import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { query } from '../../../../lib/db';
import { isValidKoreanMobile, normalizePhone } from '../../../../lib/phone-verification';
import { eq, hasSupabaseRestConfig, supabaseRequest } from '../../../../lib/supabase-rest';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

async function saveBasicWithSupabase({ email, nickname, phoneValue, provider, providerAccountId, session }) {
  const existingNickname = await supabaseRequest(
    `users?select=id&nickname=eq.${eq(nickname)}&email=neq.${eq(email)}&limit=1`,
  );

  if (existingNickname?.length) {
    return { error: NextResponse.json({ message: '이미 사용 중인 닉네임입니다.' }, { status: 409 }) };
  }

  const existingUsers = await supabaseRequest(
    `users?select=id,email,name,nickname,image_url,provider,onboarding_step&email=eq.${eq(email)}&limit=1`,
  );
  const existingUser = existingUsers?.[0];
  const now = new Date().toISOString();

  let user;
  if (existingUser) {
    const updatedUsers = await supabaseRequest(`users?id=eq.${eq(existingUser.id)}&select=id,email,nickname`, {
      method: 'PATCH',
      prefer: 'return=representation',
      body: {
        name: session?.user?.name || existingUser.name || null,
        nickname,
        image_url: session?.user?.image || existingUser.image_url || null,
        phone: phoneValue,
        phone_verified_at: null,
        provider: provider || existingUser.provider || null,
        onboarding_step: Math.max(Number(existingUser.onboarding_step || 1), 2),
        updated_at: now,
      },
    });
    user = updatedUsers?.[0];
  } else {
    const insertedUsers = await supabaseRequest('users?select=id,email,nickname', {
      method: 'POST',
      prefer: 'return=representation',
      body: {
        email,
        email_verified_at: now,
        name: session?.user?.name || null,
        nickname,
        image_url: session?.user?.image || null,
        phone: phoneValue,
        phone_verified_at: null,
        provider,
        onboarding_step: 2,
      },
    });
    user = insertedUsers?.[0];
  }

  if (!user) {
    throw new Error('Failed to save user');
  }

  if (provider && providerAccountId) {
    const accounts = await supabaseRequest(
      `oauth_accounts?select=id&provider=eq.${eq(provider)}&provider_account_id=eq.${eq(providerAccountId)}&limit=1`,
    );
    const account = accounts?.[0];

    if (account) {
      await supabaseRequest(`oauth_accounts?id=eq.${eq(account.id)}`, {
        method: 'PATCH',
        body: {
          user_id: user.id,
          updated_at: now,
        },
      });
    } else {
      await supabaseRequest('oauth_accounts', {
        method: 'POST',
        body: {
          user_id: user.id,
          provider,
          provider_account_id: providerAccountId,
        },
      });
    }
  }

  const profiles = await supabaseRequest(`user_profiles?select=user_id&user_id=eq.${eq(user.id)}&limit=1`);
  if (!profiles?.length) {
    await supabaseRequest('user_profiles', {
      method: 'POST',
      body: { user_id: user.id },
    });
  }

  return { user };
}

async function saveBasicWithPostgres({ email, nickname, phoneValue, provider, providerAccountId, session }) {
  const existingNickname = await query(
    'SELECT id FROM users WHERE nickname = $1 AND email <> $2 LIMIT 1',
    [nickname, email],
  );

  if (existingNickname.rowCount > 0) {
    return { error: NextResponse.json({ message: '이미 사용 중인 닉네임입니다.' }, { status: 409 }) };
  }

  const userResult = await query(
    `
      INSERT INTO users (
        email,
        email_verified_at,
        name,
        nickname,
        image_url,
        phone,
        phone_verified_at,
        provider,
        onboarding_step
      )
      VALUES ($1, NOW(), $2, $3, $4, $5, NULL, $6, 2)
      ON CONFLICT (email)
      DO UPDATE SET
        name = COALESCE(EXCLUDED.name, users.name),
        nickname = EXCLUDED.nickname,
        image_url = COALESCE(EXCLUDED.image_url, users.image_url),
        phone = EXCLUDED.phone,
        phone_verified_at = EXCLUDED.phone_verified_at,
        provider = COALESCE(EXCLUDED.provider, users.provider),
        onboarding_step = GREATEST(users.onboarding_step, 2),
        updated_at = NOW()
      RETURNING id, email, nickname
    `,
    [
      email,
      session?.user?.name || null,
      nickname,
      session?.user?.image || null,
      phoneValue,
      provider,
    ],
  );

  const user = userResult.rows[0];

  if (provider && providerAccountId) {
    const accountResult = await query(
      'SELECT id FROM oauth_accounts WHERE provider = $1 AND provider_account_id = $2 LIMIT 1',
      [provider, providerAccountId],
    );

    if (accountResult.rowCount > 0) {
      await query(
        'UPDATE oauth_accounts SET user_id = $1, updated_at = NOW() WHERE id = $2',
        [user.id, accountResult.rows[0].id],
      );
    } else {
      await query(
        `
          INSERT INTO oauth_accounts (user_id, provider, provider_account_id)
          VALUES ($1, $2, $3)
        `,
        [user.id, provider, providerAccountId],
      );
    }
  }

  await query(
    `
      INSERT INTO user_profiles (user_id)
      VALUES ($1)
      ON CONFLICT (user_id) DO NOTHING
    `,
    [user.id],
  );

  return { user };
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  const body = await request.json();

  const nickname = String(body.nickname || '').trim();
  const email = String(session?.user?.email || body.email || '').trim().toLowerCase();
  const phone = normalizePhone(body.phone);
  const phoneValue = phone || null;
  const provider = session?.user?.provider || null;
  const providerAccountId = session?.user?.providerAccountId || session?.user?.id || null;

  if (!session?.user || !email) {
    return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  }

  if (nickname.length < 2 || nickname.length > 30) {
    return NextResponse.json({ message: '닉네임은 2~30자로 입력해주세요.' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: '유효한 이메일이 아닙니다.' }, { status: 400 });
  }

  if (phoneValue && !isValidKoreanMobile(phoneValue)) {
    return NextResponse.json({ message: '유효한 휴대폰 번호가 아닙니다.' }, { status: 400 });
  }

  const payload = {
    email,
    nickname,
    phoneValue,
    provider,
    providerAccountId,
    session,
  };
  const result = hasSupabaseRestConfig()
    ? await saveBasicWithSupabase(payload)
    : await saveBasicWithPostgres(payload);

  if (result.error) return result.error;
  return NextResponse.json({ ok: true, user: result.user });
}
