import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { getSupabaseConfig, supabaseRequest } from '../../../lib/supabase-rest';

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

function getEnvDiagnostics() {
  const { url, key } = getSupabaseConfig();

  return {
    hasSupabaseUrl: Boolean(url),
    hasSupabaseKey: Boolean(key),
    hasServiceRoleKey: Boolean(
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY,
    ),
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
  };
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

function normalizeDetailRow(row) {
  const program = row.programs || row.program || row;
  const chips = Array.isArray(program.program_chips)
    ? program.program_chips.map((item) => item.chip)
    : row.chips;

  return {
    ...program,
    ...row,
    id: program.id || row.program_id || row.id,
    tag: row.purpose || program.tag,
    title: program.title,
    org: row.org_name || program.org,
    chips,
  };
}

function mapProgramDetailRow(row, index) {
  const data = normalizeDetailRow(row);
  const status = getRecruitStatus(data.deadline, data.status);
  const dDay = getDDay(data.deadline, data.d_day);
  const chips = data.chips?.length
    ? data.chips
    : compactChips([status, data.region, data.purpose, data.org]);

  return {
    id: data.id,
    tag: data.purpose || data.tag || '지원사업',
    dDay,
    title: data.title || data.intro || '제목 없음',
    org: data.org || '',
    status,
    bg: data.bg || CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length],
    chips,
    weeks: data.weeks || '',
    deadline: data.deadline ? `마감 ${formatDate(data.deadline)}` : '상시 모집',
    statusVariant: getStatusVariant(status, dDay, data.status_variant),
    intro: data.intro || '',
    description: data.description || '',
    qualification: data.qualification || '',
    region: data.region || '',
    phone: data.phone || '',
    kakao: data.kakao || '',
    homepage: data.homepage || '',
    email: data.email || '',
    purpose: data.purpose || '',
    viewCount: data.view_count ?? null,
  };
}

async function fetchProgramDetailsFromSupabase() {
  const rows = await supabaseRequest(
    'program_details?select=program_id,intro,description,qualification,org_name,region,phone,kakao,homepage,email,purpose,view_count,programs(id,tag,d_day,title,org,status,bg,weeks,deadline,status_variant,program_chips(chip))&order=view_count.desc.nullslast,program_id.asc',
  );
  if (!rows) return null;
  return rows.map(mapProgramDetailRow);
}

async function fetchProgramDetailsFromPostgres() {
  if (!process.env.DATABASE_URL) return null;

  const result = await query(
    `
      SELECT
        pd.program_id,
        pd.intro,
        pd.description,
        pd.qualification,
        pd.org_name,
        pd.region,
        pd.phone,
        pd.kakao,
        pd.homepage,
        pd.email,
        pd.purpose,
        pd.view_count,
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
      FROM program_details pd
      JOIN programs p ON p.id = pd.program_id
      LEFT JOIN program_chips pc ON pc.program_id = p.id
      GROUP BY pd.program_id, p.id
      ORDER BY pd.view_count DESC NULLS LAST, pd.program_id ASC
    `,
  );

  return result.rows.map(mapProgramDetailRow);
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

export async function GET(request) {
  const debug = new URL(request.url).searchParams.get('debug') === '1';
  const diagnostics = {
    env: getEnvDiagnostics(),
    sources: [],
  };

  const sources = [
    ['supabase:program_details', fetchProgramDetailsFromSupabase],
    ['postgres:program_details', fetchProgramDetailsFromPostgres],
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
