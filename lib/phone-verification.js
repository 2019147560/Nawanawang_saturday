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
  const provider = process.env.SMS_PROVIDER;

  if (!provider) {
    return { provider: 'development', sent: false, code };
  }

  if (provider === 'solapi') {
    const apiKey = process.env.SOLAPI_API_KEY;
    const apiSecret = process.env.SOLAPI_API_SECRET;
    const from = normalizePhone(process.env.SOLAPI_FROM);

    if (!apiKey || !apiSecret || !from) {
      throw new Error('Missing Solapi SMS environment variables.');
    }

    const { SolapiMessageService } = await import('solapi');
    const messageService = new SolapiMessageService(apiKey, apiSecret);

    await messageService.send({
      to,
      from,
      text: `[나와, 나왕] 인증번호는 ${code}입니다. 3분 이내에 입력해주세요.`,
    });

    return { provider, sent: true };
  }

  throw new Error(`Unsupported SMS_PROVIDER: ${provider}`);
}
