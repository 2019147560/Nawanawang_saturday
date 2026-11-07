// 저장된 데이터가 없을 때 보여주는 예시 데이터. 편집 후 저장하면 실제 데이터로 바뀝니다.

let n = 0;
const id = () => `seed-${(n += 1)}`;

export const SEEDS = {
  schedule: [
    { id: id(), date: '2026-11-18', title: '해커톤' },
    { id: id(), date: '2026-11-25', title: '서류 제출' },
    { id: id(), date: '2026-11-30', title: '지원금 받는 날' },
  ],
  // 예전에 주신 크롤링 대상 21곳. match = 사업 데이터의 기관명에서 찾을 키워드(쉼표로 구분)
  crawl_sites: [
    { id: id(), name: '두더지땅굴', url: 'https://dudug.kr/', match: '두더지' },
    { id: id(), name: 'siryc', url: 'https://siryc.or.kr/boards/pregrammereview?q%5Bterm%5D=%23%EC%9D%80%EB%91%94%EA%B3%A0%EB%A6%BD%EC%B2%AD%EB%85%84', match: 'siryc' },
    { id: id(), name: '광주 은둔형외톨이지원센터', url: 'https://gjtory.kr/50', match: '광주광역시은둔,광주 은둔,은둔형외톨이지원센터' },
    { id: id(), name: '안무서운회사', url: 'https://notscary.imweb.me/notice', match: '안무서운회사' },
    { id: id(), name: "G'L 청소년연구재단", url: 'https://www.glosy.re.kr/unispec', match: "G'L,청소년연구재단" },
    { id: id(), name: '닛커넥트', url: 'https://neetconnect.kr/browse', match: '닛커넥트' },
    { id: id(), name: '니트생활자', url: 'https://neetpeople.kr/recruiting', match: '니트생활자' },
    { id: id(), name: '노원 청년내일 (소개)', url: 'https://nwjob.kr/about', match: '노원구 청년일자리센터,청년내일' },
    { id: id(), name: '노원 청년내일 (게시판)', url: 'https://nwjob.kr/18', match: '노원구 청년일자리센터,청년내일' },
    { id: id(), name: '네이버 블로그 commun77', url: 'https://blog.naver.com/commun77', match: 'commun77' },
    { id: id(), name: '청소년1388', url: 'https://www.1388.go.kr/sfi/YTOSP_SC_SSU_01', match: '1388' },
    { id: id(), name: '제주청소년 1_2_1_1', url: 'https://jejuyouth.com/bbs/board.php?bo_table=1_2_1_1', match: '제주청소년' },
    { id: id(), name: '제주청소년 1_2_2_1', url: 'https://jejuyouth.com/bbs/board.php?bo_table=1_2_2_1', match: '제주청소년' },
    { id: id(), name: '제주청소년 4_1_1_1', url: 'https://jejuyouth.com/bbs/board.php?bo_table=4_1_1_1', match: '제주청소년' },
    { id: id(), name: '유유기지 인천', url: 'https://youth.incheon.go.kr/space/inuu/support/program_request.jsp', match: '유유기지,인천광역시 청년지원센터' },
    { id: id(), name: 'dgdream45', url: 'https://dgdream45.or.kr/bbs/board.php?bo_table=program', match: 'dgdream' },
    { id: id(), name: '서울 청년몽땅정보통', url: 'https://youth.seoul.go.kr/orang/infoData/sprtInfo/list.do?key=2309210005', match: '서울시 청년,서울청년' },
    { id: id(), name: 'navido', url: 'https://www.navido.kr/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD', match: 'navido,나비도' },
    { id: id(), name: '경기청년포털', url: 'https://youth.gg.go.kr/gg/intro/isol-notice.do?mode=view&articleNo=9533&article.offset=0&articleLimit=10', match: '경기도 청년,경기청년' },
    { id: id(), name: '평택 청년센터', url: 'https://www.pyeongtaek.go.kr/ptyc/portal/youthSupport/program/list.do?mId=0401000000', match: '평택' },
    { id: id(), name: '군포 gunpoycf', url: 'https://www.gunpoycf.or.kr/program', match: '군포' },
  ],
  seo_keywords: [
    { id: id(), keyword: '나와나왕' },
    { id: id(), keyword: '은둔청년 지원사업' },
    { id: id(), keyword: '고립청년 프로그램' },
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
