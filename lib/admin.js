// 관리자 판별. Vercel 환경변수로 관리합니다.
//   ADMIN_EMAILS       예: "a@gmail.com,b@naver.com"
//   ADMIN_ACCOUNT_IDS  예: "kakao:1234567890,google:1098..."  (카카오처럼 이메일이 없을 때)
// 둘 다 비어 있으면 아무도 관리자가 아닙니다.

function parseList(value) {
  return String(value || '')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
}

export function getAccountKey(user) {
  if (!user?.provider || !user?.providerAccountId) return null;
  return `${user.provider}:${user.providerAccountId}`.toLowerCase();
}

export function isAdminUser(user) {
  if (!user) return false;
  const emails = parseList(process.env.ADMIN_EMAILS);
  const accounts = parseList(process.env.ADMIN_ACCOUNT_IDS);
  const email = String(user.email || '').trim().toLowerCase();
  const accountKey = getAccountKey(user);
  return (email && emails.includes(email)) || (accountKey && accounts.includes(accountKey));
}
