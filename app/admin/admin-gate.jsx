'use client';

import { signIn, signOut } from 'next-auth/react';

const btn = {
  height: 48,
  padding: '0 20px',
  borderRadius: 10,
  fontSize: 14,
  fontWeight: 700,
  border: '1px solid var(--line)',
  background: '#fff',
  color: 'var(--ink-900)',
};

export default function AdminGate({ state, email, accountKey }) {
  return (
    <div className="page-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <main style={{ width: '100%', maxWidth: 440, background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--radius-card)', padding: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand-500)' }}>나와, 나왕 운영 대시보드</div>

        {state === 'signed-out' ? (
          <>
            <h1 style={{ margin: '8px 0 0', fontSize: 22, fontWeight: 800 }}>관리자 로그인이 필요해요</h1>
            <p style={{ margin: '10px 0 0', fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.6 }}>
              관리자로 등록된 계정으로 로그인해 주세요.
            </p>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button type="button" style={btn} onClick={() => signIn('google', { callbackUrl: '/admin' })}>Google로 로그인</button>
              <button type="button" style={{ ...btn, background: '#FEE500', border: '1px solid #FEE500' }} onClick={() => signIn('kakao', { callbackUrl: '/admin' })}>카카오로 로그인</button>
            </div>
          </>
        ) : (
          <>
            <h1 style={{ margin: '8px 0 0', fontSize: 22, fontWeight: 800 }}>접근 권한이 없어요</h1>
            <p style={{ margin: '10px 0 0', fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.6 }}>
              이 계정은 관리자로 등록되어 있지 않아요. 관리자라면 아래 값을 Vercel 환경변수
              <code style={{ margin: '0 4px' }}>ADMIN_EMAILS</code>또는
              <code style={{ margin: '0 4px' }}>ADMIN_ACCOUNT_IDS</code>에 추가한 뒤 다시 배포해 주세요.
            </p>
            <dl style={{ margin: '18px 0 0', padding: 16, borderRadius: 10, background: 'var(--bg-soft)', fontSize: 13, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 12px' }}>
              <dt style={{ color: 'var(--ink-500)' }}>이메일</dt>
              <dd style={{ margin: 0, fontWeight: 600, wordBreak: 'break-all' }}>{email || '(제공되지 않음)'}</dd>
              <dt style={{ color: 'var(--ink-500)' }}>계정 ID</dt>
              <dd style={{ margin: 0, fontWeight: 600, wordBreak: 'break-all' }}>{accountKey || '(알 수 없음)'}</dd>
            </dl>
            <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="button" style={btn} onClick={() => signOut({ callbackUrl: '/admin' })}>다른 계정으로 로그인</button>
              <a href="/" style={{ ...btn, display: 'inline-flex', alignItems: 'center' }}>홈으로</a>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
