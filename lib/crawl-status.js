import { query } from './db';
import { hasSupabaseRestConfig, supabaseRequest } from './supabase-rest';

// 크롤링 사이트 상태 자동 점검
// 1) 사이트 접속 확인: 서버에서 목록 페이지를 직접 열어 응답 코드와 시간을 잰다
// 2) 데이터 반영 확인: Supabase 사업 데이터 중 이 사이트(도메인 또는 기관명 키워드)에서 온 사업 수, 진행 중 사업 수, 최근 반영일
// 결과는 서버 메모리에 10분 캐시한다 (사이트에 부담을 주지 않도록)

const LIVE_TTL_MS = 10 * 60 * 1000;
const DB_TTL_MS = 5 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;
const STALE_DAYS = 14;

const liveCache = new Map();
let dbCache = { at: 0, rows: null, hasCreatedAt: false };

const UA = 'Mozilla/5.0 (compatible; NawanawangStatusBot/1.0; +https://www.nawanawang.com)';

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

function todayKST() {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

async function checkLive(url) {
  const cached = liveCache.get(url);
  if (cached && Date.now() - cached.at < LIVE_TTL_MS) return cached.result;

  const t0 = Date.now();
  let result;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store',
      signal: controller.signal,
      headers: { 'User-Agent': UA, Accept: 'text/html,*/*' },
    });
    clearTimeout(timer);
    // 본문은 읽지 않고 버린다
    try { await res.body?.cancel(); } catch { /* 무시 */ }
    result = { ok: res.ok, code: res.status, ms: Date.now() - t0 };
  } catch (error) {
    const timeout = error?.name === 'AbortError';
    result = { ok: false, code: 0, ms: Date.now() - t0, error: timeout ? 'timeout' : 'network' };
  }
  liveCache.set(url, { at: Date.now(), result });
  return result;
}

async function loadPrograms() {
  if (dbCache.rows && Date.now() - dbCache.at < DB_TTL_MS) return dbCache;

  let rows = [];
  let hasCreatedAt = false;

  if (hasSupabaseRestConfig()) {
    const base = 'program_details?select=homepage,org_name,programs(id,org,deadline';
    try {
      rows = await supabaseRequest(`${base},created_at)`);
      hasCreatedAt = true;
    } catch {
      rows = await supabaseRequest(`${base})`);
    }
    rows = (rows || []).map((r) => ({
      homepage: r.homepage || '',
      org: r.programs?.org || r.org_name || '',
      deadline: r.programs?.deadline || null,
      createdAt: r.programs?.created_at || null,
    }));
  } else if (process.env.DATABASE_URL) {
    try {
      const res = await query('SELECT pd.homepage, COALESCE(p.org, pd.org_name) AS org, p.deadline, p.created_at FROM program_details pd JOIN programs p ON p.id = pd.program_id');
      rows = res.rows.map((r) => ({ homepage: r.homepage || '', org: r.org || '', deadline: r.deadline, createdAt: r.created_at }));
      hasCreatedAt = true;
    } catch {
      const res = await query('SELECT pd.homepage, COALESCE(p.org, pd.org_name) AS org, p.deadline FROM program_details pd JOIN programs p ON p.id = pd.program_id');
      rows = res.rows.map((r) => ({ homepage: r.homepage || '', org: r.org || '', deadline: r.deadline, createdAt: null }));
    }
  }

  dbCache = { at: Date.now(), rows, hasCreatedAt };
  return dbCache;
}

function toDateStr(v) {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const m = String(v).match(/(\d{4})[-.](\d{1,2})[-.](\d{1,2})/);
  return m ? `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}` : null;
}

function daysBetween(a, b) {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
}

function matchPrograms(site, rows) {
  const host = hostOf(site.url);
  const keywords = String(site.match || '')
    .split(',')
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);
  return rows.filter((r) => {
    const h = hostOf(r.homepage);
    if (host && h && (h === host || h.endsWith(`.${host}`) || host.endsWith(`.${h}`))) return true;
    const org = String(r.org || '').toLowerCase();
    return keywords.some((k) => org.includes(k));
  });
}

export async function getCrawlStatus(sites) {
  const list = (Array.isArray(sites) ? sites : [])
    .filter((s) => s && typeof s.url === 'string' && /^https?:\/\//.test(s.url))
    .slice(0, 40);

  let db = { rows: [], hasCreatedAt: false };
  let dbError = null;
  try {
    db = await loadPrograms();
  } catch (error) {
    dbError = error?.message || 'DB 조회 실패';
  }

  const today = todayKST();
  const results = [];
  // 동시에 6곳씩 확인
  for (let i = 0; i < list.length; i += 6) {
    const chunk = list.slice(i, i + 6);
    const done = await Promise.all(chunk.map(async (site) => {
      const live = await checkLive(site.url);
      const matched = matchPrograms(site, db.rows || []);
      const active = matched.filter((r) => {
        const d = toDateStr(r.deadline);
        return !d || d >= today;
      }).length;
      const created = matched.map((r) => toDateStr(r.createdAt)).filter(Boolean).sort();
      const deadlines = matched.map((r) => toDateStr(r.deadline)).filter(Boolean).sort();
      const lastUpdated = created.length ? created[created.length - 1] : null;
      const latestDeadline = deadlines.length ? deadlines[deadlines.length - 1] : null;

      let tone;
      let reason;
      if (!live.ok && (live.code === 0 || live.code >= 500 || live.code === 404)) {
        tone = 'bad';
        reason = live.code ? `사이트 응답 ${live.code}` : (live.error === 'timeout' ? '사이트 응답 없음(8초 초과)' : '사이트 접속 실패');
      } else if (matched.length === 0) {
        tone = 'bad';
        reason = '수집된 사업 없음';
      } else if (db.hasCreatedAt && lastUpdated && daysBetween(lastUpdated, today) > STALE_DAYS) {
        tone = 'warn';
        reason = `${daysBetween(lastUpdated, today)}일째 새 사업 반영 없음`;
      } else if (active === 0) {
        tone = 'warn';
        reason = '진행 중인 사업 없음(모두 마감)';
      } else if (!live.ok) {
        tone = 'warn';
        reason = `사이트가 자동 점검을 막음(${live.code}) · 데이터는 있음`;
      } else {
        tone = 'good';
        reason = `진행 중 ${active}건`;
      }

      return {
        id: site.id,
        url: site.url,
        live,
        programs: matched.length,
        active,
        lastUpdated,
        latestDeadline,
        tone,
        reason,
      };
    }));
    results.push(...done);
  }

  return { checkedAt: new Date().toISOString(), hasCreatedAt: db.hasCreatedAt, dbError, results };
}
