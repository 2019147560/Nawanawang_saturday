import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { query } from '../../../../lib/db';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  const body = await request.json();

  const email = String(session?.user?.email || '').trim().toLowerCase();
  const region = String(body.region || '').trim();
  const persona = String(body.persona || '').trim();

  if (!email) {
    return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  }

  if (!region || !persona) {
    return NextResponse.json({ message: '거주 지역과 본인 유형을 선택해주세요.' }, { status: 400 });
  }

  const userResult = await query(
    'SELECT id FROM users WHERE email = $1 LIMIT 1',
    [email],
  );

  if (userResult.rowCount === 0) {
    return NextResponse.json({ message: '기본 회원정보를 먼저 저장해주세요.' }, { status: 404 });
  }

  const userId = userResult.rows[0].id;

  await query(
    `
      INSERT INTO user_profiles (user_id, region, persona)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id)
      DO UPDATE SET
        region = EXCLUDED.region,
        persona = EXCLUDED.persona,
        updated_at = NOW()
    `,
    [userId, region, persona],
  );

  await query(
    `
      UPDATE users
      SET onboarding_completed = TRUE,
          onboarding_step = 3,
          updated_at = NOW()
      WHERE id = $1
    `,
    [userId],
  );

  return NextResponse.json({ ok: true });
}
