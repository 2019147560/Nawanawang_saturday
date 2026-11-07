import './globals.css';
import Providers from './providers';
import AnalyticsTracker from './analytics-tracker';
import { SITE_URL } from '../lib/site-url';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: '나와, 나왕 | 고립·은둔청년 지원사업 통합 검색',
  description:
    '고립·은둔청년을 위한 상담, 회복, 관계 형성, 일경험 등 지원사업 정보를 지역과 상황에 맞게 찾아보세요.',
  icons: {
    icon: '/icon.svg',
  },
  // 검색엔진 소유 확인용 (Vercel 환경변수에 값을 넣으면 <meta> 태그로 출력)
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.NAVER_SITE_VERIFICATION
      ? { other: { 'naver-site-verification': process.env.NAVER_SITE_VERIFICATION } }
      : {}),
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap"
        />
      </head>

      <body>
        <Providers>
          <AnalyticsTracker />
          {children}
        </Providers>
      </body>
    </html>
  );
}
