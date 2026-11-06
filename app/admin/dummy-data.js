// 더미 데이터: 실제 수집(events 테이블, Search Console 연동)이 붙으면 이 파일을 API 호출로 교체합니다.

const END_DATE = new Date(2026, 10, 6);

function buildVisitors(period) {
  if (period === '7d') return [612, 580, 655, 701, 688, 742, 842];
  const out = [];
  for (let i = 0; i < 30; i += 1) {
    const weekend = i % 7 === 2 || i % 7 === 3 ? -70 : 0;
    out.push(Math.round(560 + 90 * Math.sin(i / 2.4) + i * 6 + weekend));
  }
  return out;
}

function buildDays(count) {
  const days = [];
  for (let j = count - 1; j >= 0; j -= 1) {
    const d = new Date(END_DATE.getTime() - j * 86400000);
    days.push(`${d.getMonth() + 1}/${d.getDate()}`);
  }
  return days;
}

export const FUNNEL_STEPS = [
  '방문',
  '검색·필터 사용',
  '사업 상세 조회',
  '신청 링크 클릭',
  '가입 시작',
  '휴대폰 인증',
  '프로필 완료',
];
export const KEY_FUNNEL_STEP = 3;

export function getDummyData(period) {
  const visitors = buildVisitors(period);
  const days = buildDays(visitors.length);
  const total = visitors.reduce((a, b) => a + b, 0);
  const ratios =
    period === '7d'
      ? [1, 0.604, 0.407, 0.127, 0.0598, 0.0417, 0.034]
      : [1, 0.593, 0.404, 0.12, 0.058, 0.0398, 0.0324];
  const funnelCounts = ratios.map((r) => Math.round(total * r));
  const mult = period === '7d' ? 1 : 4.1;

  return {
    asOf: '2026-11-06 09:00',
    visitors,
    days,
    total,
    funnelCounts,
    kpiDeltas:
      period === '7d'
        ? { visitors: '▲ 8.2%', click: '▲ 1.1%p', signup: '▲ 12.0%', zero: '▼ 0.9%p', zeroGood: true }
        : { visitors: '▲ 14.6%', click: '▲ 0.6%p', signup: '▲ 9.4%', zero: '▲ 0.4%p', zeroGood: false },
    zeroRate: period === '7d' ? 6.8 : 7.4,
    sources:
      period === '7d'
        ? [['검색 엔진', 46], ['직접 방문', 22], ['SNS·커뮤니티', 18], ['기관 홈페이지 링크', 10], ['기타', 4]]
        : [['검색 엔진', 49], ['직접 방문', 20], ['SNS·커뮤니티', 16], ['기관 홈페이지 링크', 11], ['기타', 4]],
    devices: { mobile: 71, desktop: 29 },
    programs: [
      ['[사업명] 청년 마음건강 상담', '서울', 412, 71],
      ['[사업명] 은둔청년 회복 프로그램', '경기', 368, 52],
      ['[사업명] 청년 일경험 인턴', '전국', 301, 44],
      ['[사업명] 관계 형성 소모임', '부산', 244, 23],
      ['[사업명] 1인 가구 생활 지원', '인천', 198, 19],
    ].map(([name, region, views, clicks]) => ({
      name,
      region,
      views: Math.round(views * mult),
      clicks: Math.round(clicks * mult),
      rate: (clicks / views) * 100,
    })),
    zeroQueries: [
      ['제주 은둔청년', 38],
      ['주말 프로그램', 31],
      ['야간 온라인 상담', 27],
      ['경북 일경험', 19],
      ['부모 상담', 15],
      ['30대 후반 지원', 12],
    ].map(([q, n]) => ({ q, n: Math.round(n * mult) })),
    seo: {
      impressions: 18400,
      clicks: 912,
      ctr: 4.96,
      position: 14.2,
      indexed: 186,
      submitted: 214,
      queries: [
        ['은둔청년 지원사업', 4210, 286, 6.1],
        ['고립청년 상담', 2980, 174, 8.4],
        ['청년 마음건강 바우처', 2560, 96, 15.7],
        ['은둔형 외톨이 지원', 1840, 71, 11.2],
        ['청년 일경험 지원', 1320, 38, 22.9],
      ],
      vitals: [
        { name: 'LCP', desc: '첫 화면 표시', value: '2.1초', good: true },
        { name: 'INP', desc: '클릭 반응', value: '180ms', good: true },
        { name: 'CLS', desc: '화면 흔들림', value: '0.14', good: false },
      ],
    },
    ops: [
      { label: 'API 에러율', value: '0.4%', good: true, note: '/api/programs 기준 · 기준선 1%' },
      { label: '인증 문자 발송 성공', value: '98.7%', good: true, note: `발송 ${Math.round(240 * mult).toLocaleString('ko-KR')}건 · 비용 [금액]` },
      { label: '사업 데이터 업데이트', value: '오늘 09:00', good: true, note: 'Supabase program_details 마지막 반영' },
      { label: '마감 지난 사업 노출', value: '23건', good: false, note: '목록에서 내리거나 마감 표시가 필요해요' },
    ],
  };
}
