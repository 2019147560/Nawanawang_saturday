import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { query } from '../../../../lib/db';
import { isValidKoreanMobile, normalizePhone } from '../../../../lib/phone-verification';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  const body = await request.json();

  const nickname = String(body.nickname || '').trim();
  const email = String(body.email || session?.user?.email || '').trim().toLowerCase();
  const phone = normalizePhone(body.phone);
  const phoneValue = phone || null;
  const provider = session?.user?.provider || body.provider || null;
  const providerAccountId = session?.user?.id || null;

  if (nickname.length < 2 || nickname.length > 30) {
    return NextResponse.json({ message: '닉네임은 2~30자로 입력해주세요.' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: '유효한 이메일이 아닙니다.' }, { status: 400 });
  }

  if (phoneValue && !isValidKoreanMobile(phoneValue)) {
    return NextResponse.json({ message: '유효한 휴대폰 번호가 아닙니다.' }, { status: 400 });
  }

  const existingNickname = await query(
    'SELECT id FROM users WHERE nickname = $1 AND email <> $2 LIMIT 1',
    [nickname, email],
  );

  if (existingNickname.rowCount > 0) {
    return NextResponse.json({ message: '이미 사용 중인 닉네임입니다.' }, { status: 409 });
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
    await query(
      `
        INSERT INTO oauth_accounts (user_id, provider, provider_account_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (provider, provider_account_id)
        DO UPDATE SET user_id = EXCLUDED.user_id, updated_at = NOW()
      `,
      [user.id, provider, providerAccountId],
    );
  }

  await query(
    `
      INSERT INTO user_profiles (user_id)
      VALUES ($1)
      ON CONFLICT (user_id) DO NOTHING
    `,
    [user.id],
  );

  return NextResponse.json({ ok: true, user });
}
