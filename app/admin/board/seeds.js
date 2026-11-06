// 저장된 데이터가 없을 때 보여주는 예시 데이터. 편집 후 저장하면 실제 데이터로 바뀝니다.

let n = 0;
const id = () => `seed-${(n += 1)}`;

export const SEEDS = {
  crawl_sites: [
    { id: id(), name: '온통청년', url: 'https://www.youthcenter.go.kr', lastUpdated: '2026-11-06', cycle: '매일', status: '정상', note: '' },
    { id: id(), name: '복지로', url: 'https://www.bokjiro.go.kr', lastUpdated: '2026-11-05', cycle: '매일', status: '정상', note: '' },
    { id: id(), name: '서울청년포털', url: 'https://youth.seoul.go.kr', lastUpdated: '2026-10-28', cycle: '주 1회', status: '지연', note: '목록 구조 변경 확인 필요' },
    { id: id(), name: '경기청년포털', url: 'https://youth.gg.go.kr', lastUpdated: '2026-11-04', cycle: '주 2회', status: '정상', note: '' },
    { id: id(), name: '청년재단', url: 'https://www.kyf.or.kr', lastUpdated: '2026-10-20', cycle: '주 1회', status: '실패', note: '로그인 필요 페이지로 바뀜' },
  ],
  priorities: [
    { id: id(), title: '마감 지난 사업 자동 숨김', owner: '', level: '높음', status: '진행 중', due: '2026-11-10' },
    { id: id(), title: 'Supabase에 이벤트 테이블 생성', owner: '', level: '높음', status: '할 일', due: '2026-11-08' },
    { id: id(), title: 'Search Console 등록', owner: '', level: '중간', status: '할 일', due: '2026-11-14' },
    { id: id(), title: '상세 페이지 신청 버튼 위치 개선', owner: '', level: '중간', status: '할 일', due: '' },
    { id: id(), title: '개인정보처리방침 수집 항목 추가', owner: '', level: '낮음', status: '할 일', due: '' },
  ],
  links: [
    { id: id(), category: '링크', title: 'GitHub 저장소', url: 'https://github.com/2019147560/Nawanawang_saturday', note: '' },
    { id: id(), category: '링크', title: '서비스 사이트', url: 'https://nawanawang-saturday.vercel.app', note: '' },
    { id: id(), category: '회의', title: '정기 회의 (토요일)', url: '', note: '회의 링크를 넣어 주세요' },
    { id: id(), category: '읽을거리', title: '읽어볼 자료 제목', url: '', note: '' },
    { id: id(), category: '감상', title: '감상할 작품/영상 제목', url: '', note: '' },
  ],
  contacts: [
    { id: id(), name: '대표 메일', role: '문의 창구', contact: 'step.here@naver.com', note: '' },
  ],
  community: [],
  feedback: [],
  inquiries: [],
};

export const LINK_CATEGORIES = ['링크', '회의', '읽을거리', '감상'];
