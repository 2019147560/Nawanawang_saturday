import './globals.css';
import Providers from './providers';

export const metadata = {
  title: '나와, 나왕 | 고립·은둔청년 지원사업 통합 검색',
  description:
    '고립·은둔청년을 위한 상담, 회복, 관계 형성, 일경험 등 지원사업 정보를 지역과 상황에 맞게 찾아보세요.',
  icons: {
    icon: '/icon.svg',
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
