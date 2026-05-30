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

async function fetchProgramsTableCards() {
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

  return result.rows.map((row, index) => {
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
      chips: row.chips?.length ? row.chips : compactChips([status, row.org]),
      weeks: row.weeks || '',
      deadline: row.deadline ? `마감 ${formatDate(row.deadline)}` : '상시 모집',
      statusVariant: getStatusVariant(status, dDay, row.status_variant),
    };
  });
}

async function fetchEventTableCards() {
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

  return result.rows.map((row, index) => {
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
  });
}

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ programs: [], source: 'fallback' });
  }

  try {
    const programCards = await fetchProgramsTableCards();
    if (programCards.length > 0) {
      return NextResponse.json({ programs: programCards, source: 'programs' });
    }

    const eventCards = await fetchEventTableCards();
    return NextResponse.json({ programs: eventCards, source: 'event' });
  } catch (error) {
    console.error('Failed to load program cards:', error);
    return NextResponse.json({ message: '지원사업 카드를 불러오지 못했습니다.' }, { status: 500 });
  }
}
