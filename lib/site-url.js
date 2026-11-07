// 검색엔진에 알릴 대표 주소. 같은 사이트가 vercel.app 주소로도 열리기 때문에
// 검색 결과가 이 주소 하나로 모이도록 canonical·sitemap·robots에서 이 값을 씁니다.
export const SITE_URL = (process.env.SITE_URL || 'https://www.nawanawang.com').replace(/\/$/, '');
