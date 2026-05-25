import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import {
  createVerificationCode,
  isValidKoreanMobile,
  normalizePhone,
  sendSms,
} from '../../../../lib/phone-verification';

export async function POST(request) {
  const { phone } = await request.json();
  const normalizedPhone = normalizePhone(phone);

  if (!isValidKoreanMobile(normalizedPhone)) {
    return NextResponse.json({ message: '유효한 휴대폰 번호가 아닙니다.' }, { status: 400 });
  }

  const code = createVerificationCode();
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

  await query(
    `
      INSERT INTO phone_verification_codes (phone, code, expires_at)
      VALUES ($1, $2, $3)
    `,
    [normalizedPhone, code, expiresAt],
  );

  const result = await sendSms({ to: normalizedPhone, code });

  return NextResponse.json({
    ok: true,
    expiresAt,
    developmentCode: process.env.NODE_ENV === 'production' ? undefined : result.code,
  });
}
