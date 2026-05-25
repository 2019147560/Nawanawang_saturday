import './globals.css';
import Providers from './providers';

export const metadata = {
  title: '나와나망 — 지원사업 검색',
  description: '고립·은둔청년 통합 정보 플랫폼',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
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
