export function normalizePhone(phone) {
  return String(phone || '').replace(/\D/g, '').slice(0, 11);
}

export function isValidKoreanMobile(phone) {
  return /^01[016789]\d{7,8}$/.test(normalizePhone(phone));
}

export function createVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendSms({ to, code }) {
  // Plug a real SMS provider here, e.g. Solapi, Naver SENS, Twilio, etc.
  // Until SMS_PROVIDER is set, the API stores the code and returns it outside production.
  if (!process.env.SMS_PROVIDER) {
    return { provider: 'development', sent: false, code };
  }

  throw new Error(`Unsupported SMS_PROVIDER: ${process.env.SMS_PROVIDER}`);
}
