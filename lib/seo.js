import crypto from 'node:crypto';

// SEO 자동 집계
// - Google: Search Console API (서비스 계정). 최근 28일 노출·클릭·CTR·평균 순위, 검색어별 평균 순위
// - Naver: 네이버 검색 API(웹문서). 검색어로 검색했을 때 우리 사이트가 몇 번째에 나오는지 (최대 300위까지 확인)
// 결과는 6시간 캐시 (Search Console 데이터는 하루 단위로 갱신되고, 네이버 API는 하루 호출 한도가 있음)

const TTL_MS = 6 * 60 * 60 * 1000;
const cache = new Map();

function siteHost() {
  const raw = process.env.SEO_SITE_URL || process.env.GSC_SITE_URL || process.env.NEXTAUTH_URL || '';
  const cleaned = raw.replace(/^sc-domain:/, 'https://');
  try {
    return new URL(cleaned).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

export function seoConfig() {
  return {
    google: Boolean(process.env.GSC_CLIENT_EMAIL && process.env.GSC_PRIVATE_KEY && process.env.GSC_SITE_URL),
    naver: Boolean(process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET),
    host: siteHost(),
  };
}

/* ---------- Google Search Console ---------- */

function b64url(input) {
  return Buffer.from(input).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function signServiceAccountJwt({ email, privateKey, scope, now = Math.floor(Date.now() / 1000) }) {
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({
    iss: email,
    scope,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(`${header}.${claim}`);
  const signature = signer.sign(privateKey).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${header}.${claim}.${signature}`;
}

let googleToken = { value: null, exp: 0 };

async function getGoogleToken() {
  if (googleToken.value && Date.now() < googleToken.exp - 60_000) return googleToken.value;
  const privateKey = String(process.env.GSC_PRIVATE_KEY).replace(/\\n/g, '\n');
  const assertion = signServiceAccountJwt({
    email: process.env.GSC_CLIENT_EMAIL,
    privateKey,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
  });
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) throw new Error(`Google 인증 실패 (${data.error || res.status})`);
  googleToken = { value: data.access_token, exp: Date.now() + (data.expires_in || 3600) * 1000 };
  return googleToken.value;
}

function dateKST(offsetDays) {
  return new Date(Date.now() + 9 * 3600 * 1000 - offsetDays * 86400000).toISOString().slice(0, 10);
}

async function gscQuery(body) {
  const token = await getGoogleToken();
  const site = encodeURIComponent(process.env.GSC_SITE_URL);
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Search Console 조회 실패 (${data.error?.status || res.status}: ${data.error?.message || ''})`.trim());
  return data.rows || [];
}

async function getGoogle(keywords) {
  // Search Console 데이터는 2~3일 늦게 들어오므로 3일 전까지 28일 구간
  const range = { startDate: dateKST(30), endDate: dateKST(3) };
  const [totalRows, queryRows] = await Promise.all([
    gscQuery({ ...range, dimensions: [], rowLimit: 1 }),
    gscQuery({ ...range, dimensions: ['query'], rowLimit: 250 }),
  ]);
  const t = totalRows[0] || { clicks: 0, impressions: 0, ctr: 0, position: null };
  const byQuery = new Map(queryRows.map((r) => [String(r.keys?.[0] || '').replace(/\s+/g, ''), r]));
  return {
    range,
    clicks: t.clicks || 0,
    impressions: t.impressions || 0,
    ctr: t.impressions ? (t.clicks / t.impressions) * 100 : 0,
    position: t.position ?? null,
    topQueries: queryRows
      .slice()
      .sort((a, b) => (b.clicks - a.clicks) || (b.impressions - a.impressions))
      .slice(0, 5)
      .map((r) => ({ query: r.keys?.[0], clicks: r.clicks, impressions: r.impressions, position: r.position })),
    keywords: keywords.map((k) => {
      const row = byQuery.get(k.replace(/\s+/g, ''));
      return { keyword: k, position: row ? row.position : null, impressions: row ? row.impressions : 0 };
    }),
  };
}

/* ---------- Naver 검색 API ---------- */

function stripTags(s) {
  return String(s || '').replace(/<[^>]+>/g, '');
}

async function naverRank(keyword, host) {
  for (let start = 1; start <= 201; start += 100) {
    const url = `https://openapi.naver.com/v1/search/webkr.json?query=${encodeURIComponent(keyword)}&display=100&start=${start}`;
    const res = await fetch(url, {
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`네이버 검색 API 실패 (${data.errorCode || res.status}: ${data.errorMessage || ''})`.trim());
    const items = data.items || [];
    const idx = items.findIndex((it) => {
      try {
        const h = new URL(it.link).hostname.replace(/^www\./, '').toLowerCase();
        return h === host || h.endsWith(`.${host}`);
      } catch {
        return false;
      }
    });
    if (idx >= 0) return { keyword, rank: start + idx, title: stripTags(items[idx].title), total: data.total };
    if (items.length < 100) return { keyword, rank: null, checked: start + items.length - 1, total: data.total };
  }
  return { keyword, rank: null, checked: 300 };
}

async function getNaver(keywords, host) {
  const out = [];
  for (const k of keywords) out.push(await naverRank(k, host));
  return { keywords: out };
}

/* ---------- 합치기 ---------- */

export async function getSeo(rawKeywords, { force = false } = {}) {
  const keywords = (Array.isArray(rawKeywords) ? rawKeywords : [])
    .map((k) => String(k || '').trim().slice(0, 50))
    .filter(Boolean)
    .slice(0, 3);
  const config = seoConfig();
  const key = JSON.stringify(keywords);
  const cached = cache.get(key);
  if (!force && cached && Date.now() - cached.at < TTL_MS) return { ...cached.data, cached: true };

  const result = { config, keywords, fetchedAt: new Date().toISOString(), google: null, naver: null, errors: {} };

  const tasks = [];
  if (config.google) {
    tasks.push(getGoogle(keywords).then((g) => { result.google = g; }).catch((e) => { result.errors.google = e.message; }));
  }
  if (config.naver && config.host && keywords.length) {
    tasks.push(getNaver(keywords, config.host).then((n) => { result.naver = n; }).catch((e) => { result.errors.naver = e.message; }));
  }
  await Promise.all(tasks);

  if (config.google || config.naver) cache.set(key, { at: Date.now(), data: result });
  return result;
}
