import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { normalizePhone } from '../../../../lib/phone-verification';

export async function POST(request) {
  const { phone, code } = await request.json();
  const normalizedPhone = normalizePhone(phone);
  const normalizedCode = String(code || '').replace(/\D/g, '').slice(0, 6);

  if (!normalizedPhone || normalizedCode.length !== 6) {
    return NextResponse.json({ message: '휴대폰 번호와 인증번호를 확인해주세요.' }, { status: 400 });
  }

  const result = await query(
    `
      UPDATE phone_verification_codes
      SET verified_at = NOW()
      WHERE id = (
        SELECT id
        FROM phone_verification_codes
        WHERE phone = $1
          AND code = $2
          AND verified_at IS NULL
          AND expires_at > NOW()
        ORDER BY created_at DESC
        LIMIT 1
      )
      RETURNING id
    `,
    [normalizedPhone, normalizedCode],
  );

  if (result.rowCount === 0) {
    return NextResponse.json({ message: '인증번호가 일치하지 않거나 만료되었습니다.' }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
