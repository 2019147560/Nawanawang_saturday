// 저장된 데이터가 없을 때 보여주는 예시 데이터. 편집 후 저장하면 실제 데이터로 바뀝니다.

let n = 0;
const id = () => `seed-${(n += 1)}`;

export const SEEDS = {
  schedule: [
    { id: id(), date: '2026-11-18', title: '해커톤' },
    { id: id(), date: '2026-11-25', title: '서류 제출' },
    { id: id(), date: '2026-11-30', title: '지원금 받는 날' },
  ],
  crawl_sites: [
    { id: id(), name: '온통청년', url: 'https://www.youthcenter.go.kr', lastUpdated: '2026-11-05', cycle: '매일', status: '정상', note: '' },
    { id: id(), name: '복지로', url: 'https://www.bokjiro.go.kr', lastUpdated: '2026-11-07', cycle: '매일', status: '정상', note: '' },
    { id: id(), name: '서울청년포털', url: 'https://youth.seoul.go.kr', lastUpdated: '', cycle: '주 1회', status: '실패', note: '' },
    { id: id(), name: '경기청년포털', url: 'https://youth.gg.go.kr', lastUpdated: '', cycle: '주 2회', status: '실패', note: '' },
    { id: id(), name: '부산청년플랫폼', url: 'https://young.busan.go.kr', lastUpdated: '', cycle: '주 1회', status: '실패', note: '' },
    { id: id(), name: '청년재단', url: 'https://www.kyf.or.kr', lastUpdated: '', cycle: '주 1회', status: '지연', note: '' },
  ],
  priorities: [
    { id: id(), rank: '1', title: '챗봇', status: '진행 중', subtasks: '[세부 작업]\n[세부 작업]', owner: '' },
    { id: id(), rank: '2', title: '로그인', status: '대기', subtasks: '[세부 작업]\n[세부 작업]', owner: '' },
  ],
  links: [
    { id: id(), category: '회의', title: '정기 회의 링크', url: '', note: '' },
    { id: id(), category: '읽을거리', title: '[읽어볼 자료]', url: '', note: '' },
    { id: id(), category: '감상', title: '[감상 목록]', url: '', note: '' },
    { id: id(), category: '링크', title: 'GitHub 저장소', url: 'https://github.com/2019147560/Nawanawang_saturday', note: '' },
    { id: id(), category: '링크', title: '서비스 사이트', url: 'https://nawanawang-saturday.vercel.app', note: '' },
  ],
  contacts: [
    { id: id(), name: '대표 메일', role: '문의 창구', contact: 'step.here@naver.com', note: '' },
  ],
  team: [
    { id: id(), name: '[이름]', mood: '좋음', score: '4.0', comment: '' },
    { id: id(), name: '[이름]', mood: '최고', score: '3.0', comment: '' },
    { id: id(), name: '[이름]', mood: '보통', score: '5.0', comment: '' },
    { id: id(), name: '[이름]', mood: '좋음', score: '3.5', comment: '' },
    { id: id(), name: '[이름]', mood: '피곤', score: '', comment: '' },
  ],
  motto: [{ id: 'motto', text: '실패는 성공의 어머니다' }],
  community: [],
  feedback: [],
  inquiries: [],
};

export const LINK_CATEGORIES = ['회의', '읽을거리', '감상', '링크'];
export const MOODS = ['최고', '좋음', '보통', '피곤', '힘듦'];
