import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export const dynamic = 'force-dynamic';

const CARD_BACKGROUNDS = [
  'var(--card-blue)',
  'var(--card-yellow)',
  'var(--card-orange)',
  'var(--card-purple)',
  'var(--card-mustard)',
  'var(--card-lemon)',
  'var(--card-pink)',
  'var(--card-mint)',
];

function getSupabaseConfig() {
  const url =
    process.env.SUPABASE_URL ||
    process.env.SUPABASE_PROJECT_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return { url: url?.replace(/\/$/, ''), key };
}

function getEnvDiagnostics() {
  return {
    hasSupabaseUrl: Boolean(
      process.env.SUPABASE_URL ||
      process.env.SUPABASE_PROJECT_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
    hasSupabaseKey: Boolean(
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
    hasServiceRoleKey: Boolean(
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY,
    ),
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
  };
}

async function supabaseFetch(path) {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return null;

  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase request failed: ${res.status} ${text}`);
  }

  return res.json();
}

function formatDate(value) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}

function getRecruitStatus(endDate, explicitStatus) {
  if (explicitStatus) return explicitStatus;
  if (!endDate) return '모집 중';
  const end = endDate instanceof Date ? endDate : new Date(endDate);
  if (Number.isNaN(end.getTime())) return '모집 중';
  return end.getTime() < Date.now() ? '마감' : '모집 중';
}

function getDDay(endDate, explicitDDay) {
  if (explicitDDay) return explicitDDay;
  if (!endDate) return '상시';
  const end = endDate instanceof Date ? endDate : new Date(endDate);
  if (Number.isNaN(end.getTime())) return '상시';
  const diff = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return '마감';
  if (diff === 0) return 'D-day';
  return `D-${diff}`;
}

function getStatusVariant(status, dDay, explicitVariant) {
  if (explicitVariant) return explicitVariant;
  if (status === '마감' || dDay === '마감') return 'closed';
  if (status === '모집 예정' || dDay === '곧오픈') return 'soon';
  return undefined;
}

function compactChips(values) {
  return values
    .filter(Boolean)
    .map((value) => String(value).trim())
    .filter(Boolean);
}

function mapProgramRow(row, index) {
  const chips = Array.isArray(row.program_chips)
    ? row.program_chips.map((item) => item.chip)
    : row.chips;

  const status = getRecruitStatus(row.deadline, row.status);
  const dDay = getDDay(row.deadline, row.d_day);

  return {
    id: row.id,
    tag: row.tag || '지원사업',
    dDay,
    title: row.title || '제목 없음',
    org: row.org || '',
    status,
    bg: row.bg || CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length],
    chips: chips?.length ? chips : compactChips([status, row.org]),
    weeks: row.weeks || '',
    deadline: row.deadline ? `마감 ${formatDate(row.deadline)}` : '상시 모집',
    statusVariant: getStatusVariant(status, dDay, row.status_variant),
  };
}

function mapEventRow(row, index) {
  const status = getRecruitStatus(row.end_at_recruitment_period, row.is_recruit);
  const dDay = getDDay(row.end_at_recruitment_period);
  const weeks = row.times ? `${row.times}회` : compactChips([
    row.start_at_program_period && formatDate(row.start_at_program_period),
    row.end_at_program_period && formatDate(row.end_at_program_period),
  ]).join(' - ');

  return {
    id: row.id,
    tag: row.purpose || '지원사업',
    dDay,
    title: row.name || row.hooking_comment || '제목 없음',
    org: row.enterprise_name || '',
    status,
    bg: row.image_rul || CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length],
    chips: compactChips([status, row.region, row.is_online, row.participants]),
    weeks,
    deadline: row.end_at_recruitment_period ? `마감 ${formatDate(row.end_at_recruitment_period)}` : '상시 모집',
    statusVariant: getStatusVariant(status, dDay),
    link: row.link || '',
    imageUrl: row.image_rul || '',
  };
}

async function fetchEventsFromSupabase() {
  const rows = await supabaseFetch(
    'event?select=id,name,link,start_at_recruitment_period,end_at_recruitment_period,start_at_program_period,end_at_program_period,enterprise_name,purpose,is_online,region,is_recruit,times,participants,hooking_comment,image_rul&order=number.asc.nullslast,id.asc',
  );
  if (!rows) return null;
  return rows.map(mapEventRow);
}

async function fetchProgramsFromSupabase() {
  const rows = await supabaseFetch('programs?select=*,program_chips(chip)&order=id.asc');
  if (!rows) return null;
  return rows.map(mapProgramRow);
}

async function trySource(source, loader, diagnostics) {
  try {
    const programs = await loader();
    diagnostics.sources.push({
      source,
      status: Array.isArray(programs) && programs.length > 0 ? 'ok' : 'empty',
      count: Array.isArray(programs) ? programs.length : 0,
    });
    return Array.isArray(programs) && programs.length > 0 ? programs : null;
  } catch (error) {
    console.warn(`Skipping ${source} program source:`, error);
    diagnostics.sources.push({
      source,
      status: 'error',
      message: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

async function fetchProgramsFromPostgres() {
  if (!process.env.DATABASE_URL) return null;

  const result = await query(
    `
      SELECT
        p.id,
        p.tag,
        p.d_day,
        p.title,
        p.org,
        p.status,
        p.bg,
        p.weeks,
        p.deadline,
        p.status_variant,
        COALESCE(
          array_agg(pc.chip ORDER BY pc.id) FILTER (WHERE pc.chip IS NOT NULL),
          '{}'
        ) AS chips
      FROM programs p
      LEFT JOIN program_chips pc ON pc.program_id = p.id
      GROUP BY p.id
      ORDER BY p.id
    `,
  );

  return result.rows.map(mapProgramRow);
}

async function fetchEventsFromPostgres() {
  if (!process.env.DATABASE_URL) return null;

  const result = await query(
    `
      SELECT
        id,
        name,
        link,
        start_at_recruitment_period,
        end_at_recruitment_period,
        start_at_program_period,
        end_at_program_period,
        enterprise_name,
        purpose,
        is_online,
        region,
        is_recruit,
        times,
        participants,
        hooking_comment,
        image_rul
      FROM event
      ORDER BY COALESCE(number, id), id
    `,
  );

  return result.rows.map(mapEventRow);
}

export async function GET(request) {
  const debug = new URL(request.url).searchParams.get('debug') === '1';
  const diagnostics = {
    env: getEnvDiagnostics(),
    sources: [],
  };

  const sources = [
    ['supabase:event', fetchEventsFromSupabase],
    ['supabase:programs', fetchProgramsFromSupabase],
    ['postgres:event', fetchEventsFromPostgres],
    ['postgres:programs', fetchProgramsFromPostgres],
  ];

  for (const [source, loader] of sources) {
    const programs = await trySource(source, loader, diagnostics);
    if (programs) {
      return NextResponse.json(debug ? { programs, source, diagnostics } : { programs, source });
    }
  }

  return NextResponse.json(
    debug ? { programs: [], source: 'fallback', diagnostics } : { programs: [], source: 'fallback' },
  );
}
