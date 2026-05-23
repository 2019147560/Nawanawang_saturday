'use client';

import React, { useMemo, useState } from 'react';

/* ============================================================
   ICONS
============================================================ */
const Icon = {
  Search: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
    </svg>
  ),
  Bell: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  ),
  Bookmark: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Refresh: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" /><path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" /><path d="M3 21v-5h5" />
    </svg>
  ),
  Chevron: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  ChevronL: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m15 6-6 6 6 6" />
    </svg>
  ),
  ChevronR: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  ),
  Grid: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  List: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" />
      <circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" />
    </svg>
  ),
  ArrowUpRight: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 17 17 7" /><path d="M8 7h9v9" />
    </svg>
  ),
};

/* ============================================================
   TOP UTILITY BAR
============================================================ */
function UtilityBar({ onLogin }) {
  return (
    <div style={{
      borderBottom: '1px solid var(--line-2)',
      background: '#fff',
    }}>
      <div style={{
        maxWidth: 1240, margin: '0 auto', padding: '0 32px',
        height: 36, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        gap: 18, fontSize: 12,
      }}>
        <a href="#" style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          color: 'var(--ink-600)', fontWeight: 500,
        }}>
          <Icon.Bookmark width={13} height={13} />
          북마크
        </a>
        <span style={{ color: 'var(--line)' }}>|</span>
        <a href="/login" onClick={(e) => { if (onLogin) { e.preventDefault(); onLogin(); } }} style={{ color: 'var(--ink-900)', fontWeight: 600 }}>로그인</a>
      </div>
    </div>
  );
}

/* ============================================================
   LOGIN PAGE
============================================================ */
export function LoginPage({ onBack, onSignup }) {
  return (
    <div data-screen-label="03 로그인" style={{ minHeight: '100vh', background: '#fff' }}>
      <UtilityBar onLogin={() => {}} />
      <MainNav />

      <main style={{
        maxWidth: 420, margin: '0 auto', padding: '64px 24px 80px',
      }}>
        {/* Back link */}
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'transparent', border: 'none', padding: '6px 0',
            color: 'var(--ink-500)', fontSize: 13, marginBottom: 32,
          }}
        >
          <Icon.ChevronL width={14} height={14} />
          닫기
        </button>

        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'baseline', gap: 0,
            fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em', color: 'var(--brand-700)',
            marginBottom: 22,
          }}>
            <span>나와,&nbsp;</span>
            <span style={{ color: 'var(--brand-500)' }}>나왕</span>
          </div>
          <h1 style={{
            margin: 0, fontSize: 22, fontWeight: 700,
            color: 'var(--ink-900)', letterSpacing: '-0.02em', lineHeight: 1.5,
          }}>
            로그인하면, 북마크한<br />
            교육과정만 모아서 볼 수 있어요
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onSignup}
            style={{
            height: 54, width: '100%', borderRadius: 10,
            border: '1px solid var(--line)', background: '#fff',
            color: 'var(--ink-900)', fontSize: 15, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.836.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            구글로 로그인
          </button>

          <button
            onClick={onSignup}
            style={{
            height: 54, width: '100%', borderRadius: 10,
            border: 'none', background: '#FEE500',
            color: '#191600', fontSize: 15, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path fill="#191600" d="M9 1.5C4.581 1.5 1 4.276 1 7.7c0 2.227 1.508 4.18 3.78 5.282-.166.6-.6 2.176-.687 2.514-.108.42.155.414.326.301.135-.089 2.143-1.45 3.013-2.04.5.07 1.02.107 1.568.107 4.418 0 8-2.776 8-6.2C17 4.276 13.418 1.5 9 1.5z"/>
            </svg>
            카카오 로그인
          </button>
        </div>

        <p style={{
          textAlign: 'center', marginTop: 28, marginBottom: 0,
          fontSize: 12, color: 'var(--ink-500)', lineHeight: 1.65,
        }}>
          로그인 시 이용약관과 개인정보처리방침에 동의한 것으로 간주됩니다.
        </p>
      </main>
    </div>
  );
}

/* ============================================================
   MAIN NAV
============================================================ */
function MainNav({ onHome, onNavAll, active }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--line)',
      background: '#fff',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{
        maxWidth: 1240, margin: '0 auto', padding: '0 32px',
        height: 72, display: 'flex', alignItems: 'center', gap: 36,
      }}>
        {/* Logo — only entry point to home */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onHome && onHome(); }}
          title="홈으로"
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
        >
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 0,
            fontWeight: 800, fontSize: 22, letterSpacing: '-0.03em', color: 'var(--brand-700)',
          }}>
            <span>나와,&nbsp;</span>
            <span style={{ color: 'var(--brand-500)' }}>나왕</span>
          </div>
          <div style={{
            paddingLeft: 12, marginLeft: 4, borderLeft: '1px solid var(--line)',
            fontSize: 11, color: 'var(--ink-500)', lineHeight: 1.35, maxWidth: 130,
          }}>
            고립·은둔청년<br />통합 정보 플랫폼
          </div>
        </a>

        {/* Primary nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28, marginLeft: 16 }}>
          <NavItem
            label="지원사업"
            active={active === 'all'}
            onClick={onNavAll}
          />
        </nav>

        {/* Right cluster: icon-only */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
          <button style={iconBtn} aria-label="검색">
            <Icon.Search width={18} height={18} />
          </button>
          <button style={iconBtn} aria-label="알림">
            <Icon.Bell width={18} height={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

const iconBtn = {
  position: 'relative',
  width: 36, height: 36, border: 'none', background: 'transparent',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--ink-700)', borderRadius: 8,
};

function NavItem({ label, active, onClick }) {
  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick && onClick(); }}
      style={{
        position: 'relative', padding: '24px 0',
        fontWeight: active ? 700 : 500,
        fontSize: 15,
        color: active ? 'var(--brand-500)' : 'var(--ink-700)',
    }}>
      {label}
      {active && <span style={{
        position: 'absolute', left: 0, right: 0, bottom: -1,
        height: 3, background: 'var(--brand-500)', borderRadius: 2,
      }} />}
    </a>
  );
}

/* ============================================================
   HERO ANNOUNCEMENT
============================================================ */
function Hero() {
  const slides = [
    {
      type: 'notice',
      tagText: '특별 안내',
      title: '2026년 청년 자립 지원 프로그램 모집',
      desc: '고립·은둔청년을 위한 맞춤형 지원 프로그램이 시작됩니다. 주거, 일자리, 심리상담까지 종합 지원',
      cta: '자세히 보기',
      bg: 'linear-gradient(135deg, #eaf2ff 0%, #f4f8ff 60%, #f0eaff 100%)',
      blob1: 'rgba(125, 155, 255, 0.16)',
      blob2: 'rgba(174, 145, 255, 0.20)',
      blobMid: 'var(--brand-500)',
      titleColor: 'var(--brand-700)',
      tagBg: 'var(--brand-500)',
      tagFg: '#fff',
    },
    {
      type: 'ad',
      tagText: '광고',
      sponsor: '마음건강센터',
      title: '청년 1:1 익명 심리상담,\n첫 회기 무료',
      desc: '비대면으로 편하게, 전문 심리상담사와 1:1로 마음을 돌볼 수 있어요.',
      cta: '무료 상담 신청',
      bg: 'linear-gradient(135deg, #f5efff 0%, #eaf2ff 100%)',
      blob1: 'rgba(174, 145, 255, 0.22)',
      blob2: 'rgba(125, 155, 255, 0.20)',
      blobMid: '#7a5af8',
      titleColor: 'var(--ink-900)',
      tagBg: 'rgba(17, 19, 25, 0.85)',
      tagFg: '#fff',
    },
    {
      type: 'ad',
      tagText: '광고',
      sponsor: '하루한끼 도시락',
      title: '청년 1인 가구를 위한\n따뜻한 한 끼',
      desc: '균형 잡힌 정기 배송 도시락 — 첫 달 50% 할인 이벤트 진행 중',
      cta: '할인 받기',
      bg: 'linear-gradient(135deg, #fff5e6 0%, #ffece0 60%, #fff0eb 100%)',
      blob1: 'rgba(245, 180, 100, 0.22)',
      blob2: 'rgba(255, 145, 120, 0.18)',
      blobMid: '#f59e0b',
      titleColor: 'var(--ink-900)',
      tagBg: 'rgba(17, 19, 25, 0.85)',
      tagFg: '#fff',
    },
  ];

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const N = slides.length;

  // Auto-advance every 6s, pause on hover/focus
  React.useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setIdx((i) => (i + 1) % N), 6000);
    return () => clearTimeout(t);
  }, [idx, paused, N]);

  const go = (n) => setIdx(((n % N) + N) % N);
  const prev = () => go(idx - 1);
  const next = () => go(idx + 1);

  // Swipe support
  const touchX = React.useRef(null);
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchX.current = null;
  };

  const s = slides[idx];

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="배너 슬라이드"
      style={{
        position: 'relative', overflow: 'hidden',
        width: '100%',
        background: s.bg,
        minHeight: 360,
        display: 'flex', alignItems: 'center',
        transition: 'background .5s ease',
      }}
    >
      {/* Decorative circles — spread across full-width banner */}
      <div aria-hidden style={{
        position: 'absolute', right: '-3%', top: -120, width: 480, height: 480,
        borderRadius: '50%', background: s.blob1, transition: 'background .5s ease',
      }} />
      <div aria-hidden style={{
        position: 'absolute', right: '12%', top: 40, width: 160, height: 160,
        borderRadius: '50%', background: s.blob1, transition: 'background .5s ease',
      }} />
      <div aria-hidden style={{
        position: 'absolute', right: '18%', top: 110, width: 18, height: 18,
        borderRadius: '50%', background: s.blobMid, transition: 'background .5s ease',
      }} />
      <div aria-hidden style={{
        position: 'absolute', right: '6%', bottom: -80, width: 220, height: 220,
        borderRadius: '50%', background: s.blob2, transition: 'background .5s ease',
      }} />
      <div aria-hidden style={{
        position: 'absolute', left: '-4%', top: -80, width: 360, height: 360,
        borderRadius: '50%', background: s.blob1, transition: 'background .5s ease',
      }} />
      <div aria-hidden style={{
        position: 'absolute', left: '8%', bottom: -60, width: 200, height: 200,
        borderRadius: '50%', background: s.blob2, transition: 'background .5s ease',
      }} />
      <div aria-hidden style={{
        position: 'absolute', left: '14%', top: 90, width: 12, height: 12,
        borderRadius: '50%', background: s.blobMid, opacity: 0.6, transition: 'background .5s ease',
      }} />

      {/* Slide content */}
      <div style={{
        position: 'relative', width: '100%',
        maxWidth: 1240, margin: '0 auto', padding: '56px 32px',
      }}>
        <div key={idx} style={{
          maxWidth: 640,
          animation: 'heroFadeIn .4s ease',
        }}>
          {/* tag row: type label + (for ads) sponsor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            {s.type !== 'ad' && (
              <span style={{
                display: 'inline-block',
                background: s.tagBg, color: s.tagFg,
                padding: '5px 12px', borderRadius: 999,
                fontWeight: 700, fontSize: 12, letterSpacing: '0.02em',
              }}>{s.tagText}</span>
            )}
            {s.type === 'ad' && s.sponsor && (
              <span style={{
                display: 'inline-block',
                background: '#fff', color: 'var(--ink-900)',
                padding: '5px 12px', borderRadius: 999,
                fontWeight: 700, fontSize: 12, letterSpacing: '-0.01em',
                border: '1px solid rgba(17,19,25,0.08)',
              }}>{s.sponsor}</span>
            )}
          </div>
          <h2 style={{
            margin: 0, fontSize: 32, fontWeight: 800, color: s.titleColor,
            letterSpacing: '-0.025em', lineHeight: 1.3, whiteSpace: 'pre-line',
          }}>{s.title}</h2>
          <p style={{
            marginTop: 12, marginBottom: 22,
            fontSize: 15, color: 'var(--ink-600)', lineHeight: 1.6,
            letterSpacing: '-0.01em',
          }}>
            {s.desc}
          </p>
          <button style={{
            background: 'var(--ink-900)', color: '#fff', border: 'none',
            padding: '12px 22px', borderRadius: 999, fontWeight: 600, fontSize: 14,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            {s.cta}
            <Icon.ArrowUpRight width={14} height={14} />
          </button>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="이전 슬라이드"
        style={{
          ...heroArrowBtn,
          left: 'max(16px, calc((100% - 1240px) / 2 - 56px))',
        }}
      >
        <Icon.ChevronL width={18} height={18} />
      </button>
      <button
        onClick={next}
        aria-label="다음 슬라이드"
        style={{
          ...heroArrowBtn,
          right: 'max(16px, calc((100% - 1240px) / 2 - 56px))',
        }}
      >
        <Icon.ChevronR width={18} height={18} />
      </button>

      {/* Pager: dots + counter + play/pause */}
      <div style={{
        position: 'absolute', right: 'max(24px, calc((100% - 1240px) / 2 + 32px))',
        bottom: 20,
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)',
        padding: '6px 10px 6px 12px', borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '0 4px 12px rgba(15,23,42,0.06)',
      }}>
        <span style={{
          fontSize: 12, color: 'var(--ink-700)', fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
        }}>
          <span style={{ color: 'var(--ink-900)' }}>{idx + 1}</span>
          <span style={{ color: 'var(--ink-400)', margin: '0 3px' }}>/</span>
          <span>{N}</span>
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`${i + 1}번 슬라이드로 이동`}
              style={{
                width: idx === i ? 18 : 6, height: 6, borderRadius: 999,
                border: 'none', padding: 0, cursor: 'pointer',
                background: idx === i ? 'var(--ink-900)' : 'rgba(17,19,25,0.25)',
                transition: 'width .25s ease, background .2s ease',
              }}
            />
          ))}
        </div>
        <button
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? '자동 재생' : '일시 정지'}
          style={{
            width: 24, height: 24, borderRadius: '50%',
            border: 'none', background: 'transparent',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--ink-700)', cursor: 'pointer',
          }}
        >
          {paused ? (
            <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
          )}
        </button>
      </div>

      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

const heroArrowBtn = {
  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
  width: 40, height: 40, borderRadius: '50%',
  border: '1px solid rgba(255,255,255,0.6)',
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(8px)',
  color: 'var(--ink-900)',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
  zIndex: 2,
};

/* ============================================================
   FILTERS
============================================================ */
const FILTERS = [
  { id: 'region',  label: '지역' },
  { id: 'level',   label: '참여 동기' },
  { id: 'mode',    label: '온/오프라인' },
  { id: 'period',  label: '참여 기간' },
  { id: 'status',  label: '모집 상태' },
  { id: 'people',  label: '참가 인원' },
];

function FilterBar({ values, onChange, onReset, query, setQuery, onSearch }) {
  return (
    <div>
      {/* Centered search */}
      <form
        onSubmit={(e) => { e.preventDefault(); onSearch(); }}
        style={{
          display: 'flex', gap: 10,
          maxWidth: 720, margin: '0 auto',
        }}
      >
        <div style={{ flex: 1, position: 'relative' }}>
          <Icon.Search
            width={18} height={18}
            style={{
              position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--ink-400)', pointerEvents: 'none',
            }}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="필터 결과에서 더 찾고 싶은 키워드를 입력해보세요"
            style={{
              width: '100%', height: 54, border: '1px solid var(--line)',
              borderRadius: 12, padding: '0 18px 0 48px',
              fontSize: 15, outline: 'none', color: 'var(--ink-900)',
              fontFamily: 'inherit', background: '#fff',
              boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand-500)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--line)'}
          />
        </div>
        <button type="submit" style={{
          height: 54, padding: '0 28px',
          background: 'var(--ink-900)', color: '#fff', border: 'none', borderRadius: 12,
          fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          <Icon.Search width={16} height={16} />
          검색
        </button>
      </form>

      {/* Centered filter chips */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 8, flexWrap: 'wrap',
        marginTop: 16,
      }}>
        <button onClick={onReset} style={{
          width: 36, height: 36, border: '1px solid var(--line)', background: '#fff',
          borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--ink-600)',
        }} aria-label="필터 초기화">
          <Icon.Refresh width={16} height={16} />
        </button>
        {FILTERS.map((f) => (
          <FilterChip key={f.id} f={f} value={values[f.id]} onChange={(v) => onChange(f.id, v)} />
        ))}
      </div>
    </div>
  );
}

const FILTER_OPTIONS = {
  region:  ['서울','부산','대구','인천','광주','대전','울산','세종','경기','강원','충청','전라','경상','제주'],
  level:   ['일상 회복','사회 복귀','관계 형성'],
  mode:    ['온라인','오프라인','온·오프라인 병행'],
  period:  ['1회(원데이)','2회-4회','5회 이상'],
  status:  ['현재 신청 가능','모집 예정','마감'],
  people:  ['1:1 상담','여러명'],
};

function FilterChip({ f, value, onChange }) {
  const [open, setOpen] = useState(false);
  const options = FILTER_OPTIONS[f.id];
  const selected = Array.isArray(value) ? value : [];
  const allSelected = selected.length === options.length;
  const noneSelected = selected.length === 0;
  const active = !noneSelected && !allSelected;

  // Display label: number of selected when partial, else default label
  let display = f.label;
  if (active) {
    display = selected.length === 1 ? selected[0] : `${f.label} ${selected.length}`;
  }

  const toggleAll = () => {
    if (allSelected) onChange([]);
    else onChange(options.slice());
  };
  const toggleOne = (opt) => {
    if (selected.includes(opt)) onChange(selected.filter(x => x !== opt));
    else onChange([...selected, opt]);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        onBlur={(e) => {
          // close only when focus moves outside the dropdown
          if (!e.currentTarget.parentElement.contains(e.relatedTarget)) {
            setTimeout(() => setOpen(false), 150);
          }
        }}
        style={{
          height: 36, padding: '0 14px', borderRadius: 999,
          border: `1px solid ${active ? 'var(--brand-500)' : 'var(--line)'}`,
          background: active ? 'var(--brand-50)' : '#fff',
          color: active ? 'var(--brand-500)' : 'var(--ink-700)',
          fontSize: 13, fontWeight: active ? 600 : 500,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}
      >
        {display}
        <Icon.Chevron
          width={14}
          height={14}
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 160ms ease',
          }}
        />
      </button>
      {open && (
        <div
          tabIndex={-1}
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 5,
            minWidth: 200, background: '#fff',
            border: '1px solid var(--line)', borderRadius: 12,
            boxShadow: '0 12px 32px rgba(15,23,42,0.10)', padding: 6,
            maxHeight: 360, overflowY: 'auto',
          }}
        >
          <CheckRow
            label="전체선택"
            checked={allSelected}
            indeterminate={!allSelected && !noneSelected}
            onToggle={toggleAll}
          />
          <div style={{ height: 1, background: 'var(--line-2)', margin: '4px 6px' }} />
          {options.map((opt) => (
            <CheckRow
              key={opt}
              label={opt}
              checked={selected.includes(opt)}
              onToggle={() => toggleOne(opt)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CheckRow({ label, checked, indeterminate, onToggle, bold }) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onToggle(); }}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        width: '100%', textAlign: 'left',
        padding: '9px 10px', borderRadius: 8, border: 'none',
        background: 'transparent', color: 'var(--ink-700)',
        fontWeight: bold ? 700 : 500, fontSize: 13,
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-soft)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{
        width: 16, height: 16, borderRadius: 4,
        border: `1.5px solid ${checked || indeterminate ? 'var(--brand-500)' : 'var(--ink-300)'}`,
        background: checked || indeterminate ? 'var(--brand-500)' : '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
        {indeterminate && !checked && (
          <span style={{ width: 8, height: 2, background: '#fff', borderRadius: 1 }} />
        )}
      </span>
      <span>{label}</span>
    </button>
  );
}

/* ============================================================
   PROGRAM CARDS
============================================================ */
const PROGRAMS = [
  {
    id: 1, tag: '회복 프로그램', dDay: 'D-13',
    title: '천천히, 다시 만나는 일상',
    org: '경기 청년센터', status: '모집 중',
    bg: 'var(--card-blue)',
    chips: ['전체 신청 가능', '경기', '온·오프라인'],
    weeks: '8주 · 주 1회', deadline: '마감 2026.05.18',
  },
  {
    id: 2, tag: '온라인 모임', dDay: 'D-5',
    title: '방 안에서 세상으로,\n온라인 살롱',
    org: '나나센터 수원', status: '모집 중',
    bg: 'var(--card-yellow)',
    chips: ['전체 신청 가능', '경기', '온라인'],
    weeks: '4주 · 주 1회', deadline: '마감 2026.05.10',
  },
  {
    id: 3, tag: '월데이', dDay: '곧오픈',
    title: '글쓰기로 나를 정리하는 시간',
    org: '서울 청년허브', status: '모집 예정',
    bg: 'var(--card-orange)',
    chips: ['모집 예정', '서울', '온·오프라인'],
    weeks: '하루 · 4시간', deadline: '마감 2026.06.01',
    statusVariant: 'soon',
  },
  {
    id: 4, tag: '회복 프로그램', dDay: 'D-17',
    title: '식물 돌봄, 나도 돌봄',
    org: '부산 청년정책연구원', status: '모집 중',
    bg: 'var(--card-purple)',
    chips: ['전체 신청 가능', '부산', '오프라인'],
    weeks: '8주 · 주 1회', deadline: '마감 2026.05.22',
  },
  {
    id: 5, tag: '사회 적응', dDay: 'D-10',
    title: '취업 전, 나를\n알아가는 워크숍',
    org: '인천 청년센터', status: '모집 중',
    bg: 'var(--card-mustard)',
    chips: ['전체 신청 가능', '인천', '오프라인'],
    weeks: '8주 · 주 2회', deadline: '마감 2026.05.15',
  },
  {
    id: 6, tag: '온라인 모임', dDay: 'D-25',
    title: '늦은 밤 라디오, 청년 사연함',
    org: '광주 청년재단', status: '모집 중',
    bg: 'var(--card-lemon)',
    chips: ['전체 신청 가능', '광주', '온라인'],
    weeks: '4주 · 주 1회', deadline: '마감 2026.05.30',
  },
  {
    id: 7, tag: '회복 프로그램', dDay: '마감',
    title: '동네 한 바퀴, 산책 클럽',
    org: '대전 청년정책본부', status: '모집 중',
    bg: 'var(--card-pink)',
    chips: ['마감', '대전', '오프라인'],
    weeks: '6주 · 주 1회', deadline: '마감 2026.04.10',
    statusVariant: 'closed',
  },
  {
    id: 8, tag: '온라인 모임', dDay: '곧오픈',
    title: '게임으로 만나는 또래 살롱',
    org: '강원 청년허브', status: '모집 예정',
    bg: 'var(--card-mint)',
    chips: ['모집 예정', '강원', '온라인'],
    weeks: '8주 · 주 1회', deadline: '마감 2026.06.10',
    statusVariant: 'soon',
  },
];

function ProgramCard({ p, onClick }) {
  const [hover, setHover] = useState(false);

  // status pill
  let statusBg = '#fff', statusFg = 'var(--ink-900)', statusBorder = '1px solid rgba(0,0,0,0.08)';
  if (p.statusVariant === 'soon') {
    statusBg = '#fff'; statusFg = 'var(--ink-900)';
  } else if (p.statusVariant === 'closed') {
    statusBg = '#fff'; statusFg = 'var(--ink-500)';
  } else {
    statusBg = 'var(--ink-900)'; statusFg = '#fff'; statusBorder = 'none';
  }

  // d-day pill
  const dDayBg = p.dDay === '마감' ? '#fff' :
                 p.dDay === '곧오픈' ? '#fff' :
                 'var(--brand-500)';
  const dDayFg = p.dDay === '마감' ? 'var(--ink-700)' :
                 p.dDay === '곧오픈' ? 'var(--ink-900)' :
                 '#fff';
  const dDayBorder = (p.dDay === '마감' || p.dDay === '곧오픈')
    ? '1px solid rgba(0,0,0,0.12)' : 'none';

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden',
        background: '#fff', boxShadow: hover ? '0 8px 24px rgba(15,23,42,0.08)' : 'var(--shadow-card)',
        transition: 'transform .18s ease, box-shadow .18s ease',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        cursor: 'pointer', display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Visual top */}
      <div style={{
        position: 'relative', background: p.bg, height: 200, padding: 18,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        overflow: 'hidden',
      }}>
        {/* Decorative blob */}
        <div aria-hidden style={{
          position: 'absolute', left: -40, bottom: -40, width: 130, height: 130,
          borderRadius: '50%', background: 'rgba(255,255,255,0.45)',
        }} />
        <div aria-hidden style={{
          position: 'absolute', right: -30, top: 30, width: 70, height: 70,
          borderRadius: '50%', background: 'rgba(255,255,255,0.30)',
        }} />

        {/* Top row */}
        <div style={{
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            background: 'rgba(255,255,255,0.7)', color: 'var(--ink-900)',
            padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
          }}>{p.tag}</span>
          <span style={{
            background: dDayBg, color: dDayFg, border: dDayBorder,
            padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
          }}>{p.dDay}</span>
        </div>

        {/* Title */}
        <div style={{ position: 'relative' }}>
          <h3 style={{
            margin: 0, fontSize: 19, fontWeight: 800, lineHeight: 1.35,
            color: 'var(--ink-900)', letterSpacing: '-0.02em',
            whiteSpace: 'pre-line',
          }}>{p.title}</h3>
        </div>

        {/* Bottom row */}
        <div style={{
          position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 12, color: 'var(--ink-700)', fontWeight: 500 }}>{p.org}</span>
          <span style={{
            background: statusBg, color: statusFg, border: statusBorder,
            padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
          }}>{p.status}</span>
        </div>
      </div>

      {/* Bottom info */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {p.chips.map((c, i) => {
            const isFirst = i === 0;
            const isClosed = c === '마감';
            const isSoon = c === '모집 예정';
            const bg = isClosed ? '#f0f1f4'
                     : isSoon ? '#fff4d6'
                     : isFirst ? '#e6f4ec'
                     : '#f3f4f7';
            const fg = isClosed ? 'var(--ink-500)'
                     : isSoon ? '#7a5b00'
                     : isFirst ? '#1f7a4d'
                     : 'var(--ink-700)';
            return (
              <span key={i} style={{
                background: bg, color: fg,
                padding: '4px 9px', borderRadius: 6, fontSize: 11, fontWeight: 600,
              }}>{c}</span>
            );
          })}
        </div>

        <div style={{
          fontSize: 14, fontWeight: 700, color: 'var(--ink-900)',
          letterSpacing: '-0.01em', lineHeight: 1.4,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{p.title.replace('\n', ', ')}</div>

        <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{p.org}</div>

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          paddingTop: 10, borderTop: '1px dashed var(--line)',
          fontSize: 12,
        }}>
          <span style={{ color: 'var(--ink-700)', fontWeight: 600 }}>{p.weeks}</span>
          <span style={{ color: 'var(--ink-500)' }}>{p.deadline}</span>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   IN-FEED AD CARD (Slot A — row 2, position 1)
   - Matches ProgramCard footprint so grid rhythm is preserved
   - "광고" label is always visible (UX trust)
   - Native-style: pastel visual top + structured info bottom
============================================================ */
function InFeedAdCard() {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden',
        background: '#fff',
        boxShadow: hover ? '0 8px 24px rgba(15,23,42,0.08)' : 'var(--shadow-card)',
        transition: 'transform .18s ease, box-shadow .18s ease',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        display: 'flex', flexDirection: 'column', cursor: 'pointer',
        color: 'inherit', textDecoration: 'none',
      }}
    >
      {/* Visual top */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #f5efff 0%, #eaf2ff 100%)',
        height: 200, padding: 18, overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        {/* Decorative blob */}
        <div aria-hidden style={{
          position: 'absolute', right: -32, top: -28, width: 140, height: 140,
          borderRadius: '50%', background: 'rgba(125, 155, 255, 0.18)',
        }} />
        <div aria-hidden style={{
          position: 'absolute', left: -28, bottom: -36, width: 110, height: 110,
          borderRadius: '50%', background: 'rgba(174, 145, 255, 0.20)',
        }} />

        {/* Ad label + sponsor pill */}
        <div style={{
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            background: 'rgba(17, 19, 25, 0.85)', color: '#fff',
            padding: '4px 10px', borderRadius: 999,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.02em',
          }}>광고</span>
          <span style={{
            background: 'rgba(255,255,255,0.85)', color: 'var(--ink-700)',
            padding: '4px 10px', borderRadius: 999,
            fontSize: 11, fontWeight: 600,
          }}>Sponsored</span>
        </div>

        {/* Headline */}
        <div style={{ position: 'relative' }}>
          <h3 style={{
            margin: 0, fontSize: 19, fontWeight: 800, lineHeight: 1.35,
            color: 'var(--ink-900)', letterSpacing: '-0.02em',
          }}>마음 돌봄,{'\n'}전문가와 함께</h3>
        </div>

        {/* Advertiser */}
        <div style={{
          position: 'relative',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 12, color: 'var(--ink-700)', fontWeight: 500 }}>
            마음건강센터
          </span>
          <span style={{
            background: '#fff', color: 'var(--ink-900)',
            border: '1px solid rgba(0,0,0,0.08)',
            padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
          }}>무료 상담</span>
        </div>
      </div>

      {/* Bottom info */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <span style={{
            background: '#e7f0ff', color: 'var(--brand-500)',
            padding: '4px 9px', borderRadius: 6, fontSize: 11, fontWeight: 600,
          }}>심리 상담</span>
          <span style={{
            background: '#f3f4f7', color: 'var(--ink-700)',
            padding: '4px 9px', borderRadius: 6, fontSize: 11, fontWeight: 600,
          }}>전국</span>
          <span style={{
            background: '#f3f4f7', color: 'var(--ink-700)',
            padding: '4px 9px', borderRadius: 6, fontSize: 11, fontWeight: 600,
          }}>비대면</span>
        </div>

        <div style={{
          fontSize: 14, fontWeight: 700, color: 'var(--ink-900)',
          letterSpacing: '-0.01em', lineHeight: 1.4,
        }}>청년 1:1 익명 심리상담, 첫 회기 무료</div>

        <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>
          마음건강센터 · 전문 심리상담사
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 10, borderTop: '1px dashed var(--line)',
          fontSize: 12,
        }}>
          <span style={{ color: 'var(--ink-700)', fontWeight: 600 }}>
            자세히 보기
          </span>
          <span style={{ color: 'var(--ink-400)', fontSize: 11 }}>
            광고 · 외부 사이트로 이동
          </span>
        </div>
      </div>
    </a>
  );
}

/* ============================================================
   PAGINATION
============================================================ */
function Pagination({ page, setPage, total }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      gap: 6, marginTop: 36,
    }}>
      <button onClick={() => setPage(Math.max(1, page - 1))} style={pageBtn(false)} aria-label="이전">
        <Icon.ChevronL width={16} height={16} />
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <button key={n} onClick={() => setPage(n)} style={pageBtn(n === page)}>
          {n}
        </button>
      ))}
      <button onClick={() => setPage(Math.min(total, page + 1))} style={pageBtn(false)} aria-label="다음">
        <Icon.ChevronR width={16} height={16} />
      </button>
    </div>
  );
}
const pageBtn = (active) => ({
  width: 36, height: 36, borderRadius: 8,
  border: 'none', background: active ? 'var(--ink-900)' : 'transparent',
  color: active ? '#fff' : 'var(--ink-600)',
  fontSize: 13, fontWeight: 600,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
});

/* ============================================================
   FOOTER
============================================================ */
function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--line)', marginTop: 80,
      background: '#fafbfc',
    }}>
      <div style={{
        maxWidth: 1240, margin: '0 auto', padding: '36px 32px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: 32, flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: 12, color: 'var(--ink-500)', lineHeight: 1.7, maxWidth: 540 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink-900)', marginBottom: 10 }}>
            나와, 나왕
          </div>
          <div>고립·은둔청년 통합 정보 플랫폼</div>
          <div>
            <strong style={{ color: 'var(--ink-700)' }}>대표 전화</strong> 02-000-0000{'  '}
            <strong style={{ color: 'var(--ink-700)' }}>운영시간</strong> 평일 10:00–18:00
          </div>
          <div style={{ marginTop: 10, color: 'var(--ink-400)' }}>
            본 화면은 디자인 목업으로 실제 사업과 무관합니다
          </div>
        </div>
        <div style={{
          display: 'flex', gap: 22,
          fontSize: 13, color: 'var(--ink-600)', fontWeight: 500,
        }}>
          <a href="#">이용약관</a>
          <a href="#" style={{ color: 'var(--ink-900)', fontWeight: 700 }}>개인정보처리방침</a>
          <a href="#">오시는 길</a>
          <a href="#">문의하기</a>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   PROGRAM DETAIL PAGE
============================================================ */
const DETAIL_DATA = {
  intro: '아주 작은 외출에서 시작해, 또래와 함께 일상의 리듬을 천천히 되찾아가는 8주 프로그램.',
  description: '집 밖으로 나오는 첫걸음에 필요한 것들을 함께 마련해, 처음 4주는 1:1 동행으로 시작해 점차 소그룹 활동으로 옮겨갑니다. 끝과 길이, 본인의 속도에 맞춰 참여할 수 있어요.',
  qualification: '현재 사회적 고립 또는 은둔 상태에 있는 만 19~34세 청년으로, 일상 회복과 관계 경험을 희망하는 분이면 누구나 신청 가능합니다. 학력, 경력, 소득 제한 없이 참여하실 수 있습니다.',
  curriculum: [
    { weeks: '1~2주차', desc: '1:1 동행 프로그램 — 메니저와 함께 가까운 장소 방문, 외출 연습' },
    { weeks: '3~4주차', desc: '소그룹 활동 진입 — 3~4명 소그룹으로 카페/공원 방문' },
    { weeks: '5~6주차', desc: '문화 활동 체험 — 영화관, 전시회 등 문화공간 방문' },
    { weeks: '7~8주차', desc: '재입 활동 — 혼자 또는 또래와 함께 자율 활동 계획 및 실천' },
  ],
  org: {
    name: '경기 청년재단',
    region: '경기',
    phone: '031-123-4567',
    kakao: '@경기청년재단',
    homepage: 'https://open.kakao.com/example',
    email: 'support@example.or.kr',
  },
};

function ProgramDetailPage({ program, onBack, onLogin }) {
  const p = program;
  return (
    <div data-screen-label="02 지원사업 상세">
      <UtilityBar onLogin={onLogin} />
      <MainNav />

      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px 32px' }}>
        {/* Breadcrumb */}
        <div style={{
          padding: '20px 0 12px',
          fontSize: 12, color: 'var(--ink-500)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icon.Search width={12} height={12} />
            고립·은둔
          </span>
          <span>›</span>
          <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>지원사업 검색</a>
          <span>›</span>
          <span style={{ color: 'var(--ink-900)', fontWeight: 600 }}>{p.title.replace('\n', ', ')}</span>
        </div>

        {/* Back link */}
        <button
          onClick={onBack}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--brand-50)';
            e.currentTarget.style.borderColor = 'var(--brand-500)';
            e.currentTarget.style.color = 'var(--brand-500)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.borderColor = 'var(--line)';
            e.currentTarget.style.color = 'var(--ink-700)';
          }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#fff', border: '1px solid var(--line)',
            padding: '9px 16px 9px 12px', borderRadius: 999,
            color: 'var(--ink-700)', fontSize: 13, fontWeight: 600,
            cursor: 'pointer',
            transition: 'background .15s ease, border-color .15s ease, color .15s ease',
            boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
          }}
        >
          <Icon.ChevronL width={16} height={16} />
          사업 목록으로
        </button>

        <div style={{ height: 1, background: 'var(--line-2)', margin: '16px 0 28px' }} />

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32 }}>
          {/* Left: main content */}
          <div>
            {/* Tags */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {p.chips.map((c, i) => {
                const isFirst = i === 0;
                const bg = isFirst ? '#e6f4ec' : '#f3f4f7';
                const fg = isFirst ? '#1f7a4d' : 'var(--ink-700)';
                return (
                  <span key={i} style={{
                    background: bg, color: fg,
                    padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                  }}>{c}</span>
                );
              })}
              <span style={{
                background: '#f3f4f7', color: 'var(--ink-700)',
                padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
              }}>회복 프로그램</span>
            </div>

            {/* Title */}
            <h1 style={{
              margin: 0, fontSize: 32, fontWeight: 800, color: 'var(--ink-900)',
              letterSpacing: '-0.03em', lineHeight: 1.3,
            }}>{p.title.replace('\n', ', ')}</h1>
            <p style={{
              marginTop: 12, marginBottom: 28, fontSize: 14, color: 'var(--ink-600)',
              lineHeight: 1.6,
            }}>{DETAIL_DATA.intro}</p>

            {/* Info table */}
            <table style={{
              width: '100%', borderCollapse: 'collapse',
              border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden',
              fontSize: 13, marginBottom: 32,
            }}>
              <tbody>
                <tr>
                  <th style={tableTh}>주관 기관</th>
                  <td style={tableTd}>{DETAIL_DATA.org.name}</td>
                  <th style={tableTh}>진행 지역</th>
                  <td style={tableTd}>{DETAIL_DATA.org.region}</td>
                </tr>
                <tr>
                  <th style={tableTh}>진행 형태</th>
                  <td style={tableTd}>온·오프라인</td>
                  <th style={tableTh}>참여 기간</th>
                  <td style={tableTd}>{p.weeks}</td>
                </tr>
                <tr>
                  <th style={tableTh}>신청 마감</th>
                  <td style={tableTd}>{p.deadline.replace('마감 ', '')}</td>
                  <th style={tableTh}>모집 인원</th>
                  <td style={tableTd}>12명</td>
                </tr>
              </tbody>
            </table>

            <DetailSection title="프로그램 소개">
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.75 }}>
                {DETAIL_DATA.description}
              </p>
            </DetailSection>

            <DetailSection title="신청자격">
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.75 }}>
                {DETAIL_DATA.qualification}
              </p>
            </DetailSection>

            <DetailSection title="사업 커리큘럼">
              <div style={{ position: 'relative', paddingLeft: 20 }}>
                <div style={{
                  position: 'absolute', left: 4, top: 8, bottom: 8,
                  width: 1, background: 'var(--line)',
                }} />
                {DETAIL_DATA.curriculum.map((c, i) => (
                  <div key={i} style={{
                    position: 'relative', marginBottom: i === DETAIL_DATA.curriculum.length - 1 ? 0 : 12,
                  }}>
                    <div style={{
                      position: 'absolute', left: -20, top: 18, width: 9, height: 9,
                      borderRadius: '50%', background: 'var(--brand-500)',
                      border: '2px solid #fff', boxShadow: '0 0 0 1px var(--brand-500)',
                    }} />
                    <div style={{
                      border: '1px solid var(--line)', borderRadius: 10, padding: '14px 18px',
                      background: '#fff',
                    }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--brand-500)', marginBottom: 4 }}>
                        {c.weeks}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--ink-700)', lineHeight: 1.55 }}>
                        {c.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DetailSection>

            {/* Org info card */}
            <div style={{
              background: '#fafbfc', border: '1px solid var(--line)', borderRadius: 12,
              padding: '22px 26px', marginTop: 16,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingBottom: 14, borderBottom: '1px solid var(--line)', marginBottom: 16,
              }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>
                  기관 및 문의 정보
                </h3>
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-500)', marginBottom: 4 }}>주최·주관 기관</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 16 }}>
                {DETAIL_DATA.org.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-500)', marginBottom: 8 }}>문의 창구</div>
              <ul style={{
                listStyle: 'none', padding: 0, margin: 0, fontSize: 13,
                display: 'flex', flexDirection: 'column', gap: 8, color: 'var(--ink-700)',
              }}>
                <li style={contactItem}>📞 {DETAIL_DATA.org.phone}</li>
                <li style={contactItem}>💬 카카오톡: {DETAIL_DATA.org.kakao}</li>
                <li style={contactItem}>🔗 오픈채팅: {DETAIL_DATA.org.homepage}</li>
                <li style={contactItem}>✉ {DETAIL_DATA.org.email}</li>
              </ul>
            </div>
          </div>

          {/* Right: sticky apply panel */}
          <aside>
            <div style={{
              position: 'sticky', top: 96,
              border: '1px solid var(--line)', borderRadius: 12,
              padding: 22, background: '#fff',
            }}>
              <dl style={{ margin: 0, fontSize: 13 }}>
                <SidebarRow label="기간" value={p.weeks} />
                <SidebarRow label="진행 형태" value="온·오프라인" />
                <SidebarRow label="지역" value="경기" />
                <SidebarRow label="신청 마감" value={p.deadline.replace('마감 ', '')} last />
              </dl>

              <button style={{
                width: '100%', height: 48, marginTop: 16,
                background: 'var(--brand-500)', color: '#fff', border: 'none',
                borderRadius: 8, fontWeight: 700, fontSize: 14,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                신청페이지로 바로가기 <Icon.ChevronR width={14} height={14} />
              </button>

              <div style={{
                marginTop: 12, padding: '14px 16px',
                background: 'var(--brand-50)', borderRadius: 8,
                fontSize: 12, color: 'var(--ink-700)', lineHeight: 1.55,
                display: 'flex', gap: 8,
              }}>
                <span style={{ flexShrink: 0 }}>💡</span>
                <span>
                  신청 도서는 본인이 정한 색채에서 다루는 운영기관<br />
                  접속.ID
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const tableTh = {
  background: '#fafbfc', fontWeight: 600, fontSize: 12,
  color: 'var(--ink-500)', textAlign: 'left',
  padding: '14px 18px', borderBottom: '1px solid var(--line)',
  borderRight: '1px solid var(--line)', width: '15%',
};
const tableTd = {
  padding: '14px 18px', borderBottom: '1px solid var(--line)',
  borderRight: '1px solid var(--line)', color: 'var(--ink-900)',
  fontSize: 13, fontWeight: 500, width: '35%',
};
const contactItem = { display: 'flex', alignItems: 'center', gap: 8 };

function DetailSection({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{
        margin: '0 0 12px', fontSize: 16, fontWeight: 700,
        color: 'var(--ink-900)', display: 'flex', alignItems: 'center', gap: 8,
        paddingBottom: 10, borderBottom: '1px solid var(--line)',
      }}>
        <span style={{ width: 3, height: 16, background: 'var(--brand-500)', borderRadius: 2 }} />
        {title}
      </h2>
      <div>{children}</div>
    </div>
  );
}

function SidebarRow({ label, value, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 0', borderBottom: last ? 'none' : '1px solid var(--line-2)',
    }}>
      <dt style={{ color: 'var(--ink-500)', fontSize: 12, fontWeight: 500 }}>{label}</dt>
      <dd style={{ margin: 0, color: 'var(--ink-900)', fontSize: 13, fontWeight: 700 }}>{value}</dd>
    </div>
  );
}

/* ============================================================
   SIGNUP PAGE — 카카오 로그인 후 회원가입 (4-step wizard)
============================================================ */
const REGIONS = ['서울','부산','대구','인천','광주','대전','울산','세종','경기','강원','충청','전라','경상','제주'];
const PURPOSES = [
  { emoji: '🙋', label: '나를 위한 정보를 찾고 있어요' },
  { emoji: '👨‍👩‍👧', label: '가족을 위한 정보를 찾고 있어요' },
  { emoji: '🤝', label: '주변 사람을 위한 정보를 찾고 있어요' },
  { emoji: '🏢', label: '기관/실무자로 정보를 확인하고 있어요' },
];
const AGE_BANDS = ['10대','20대 초반','20대 후반','30대 초반','30대 후반','40대 이상'];
const INTERESTS = ['심리 상담','일상 회복','진로·취업','가족 상담','커뮤니티·모임','생활 지원','교육 프로그램','기타'];
const PARTICIPATION = ['온라인','오프라인'];

function SignupPage({ onBack, onDone }) {
  const [step, setStep] = useState(1);
  const STEPS = ['기본 정보', '관심 정보', '선택 정보', '동의'];
  const [form, setForm] = useState({
    nickname: '', email: '', password: '', passwordConfirm: '',
    emailCode: '',
    regions: [], purposes: [],
    phone: '', age: '', interests: [], participation: [],
    agreeTerms: false, agreePrivacy: false,
    agreeExtra: false, agreeNotify: false, agreeMarketing: false,
  });
  // email verification flow
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailTimer, setEmailTimer] = useState(0);
  React.useEffect(() => {
    if (emailTimer <= 0) return;
    const t = setTimeout(() => setEmailTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [emailTimer]);
  const sendEmailCode = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return;
    setEmailSent(true);
    setEmailVerified(false);
    setEmailTimer(180); // 3 min
  };
  const verifyEmailCode = () => {
    // demo: any 6-digit accepts
    if (/^\d{6}$/.test(form.emailCode)) {
      setEmailVerified(true);
      setEmailTimer(0);
    }
  };
  const fmtTimer = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleArr = (k, v) => setForm((f) => ({
    ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v],
  }));

  // Password rules
  const pwRules = [
    { id: 'len', label: '8자 이상 20자 이하', ok: form.password.length >= 8 && form.password.length <= 20 },
    { id: 'letter', label: '영문 포함', ok: /[A-Za-z]/.test(form.password) },
    { id: 'num', label: '숫자 포함', ok: /\d/.test(form.password) },
    { id: 'spc', label: '특수문자 포함 (!@#$%^&* 등)', ok: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password) },
  ];
  const pwAllOk = pwRules.every(r => r.ok);
  const pwMatch = form.password.length > 0 && form.password === form.passwordConfirm;

  const validStep = () => {
    if (step === 1) {
      return form.nickname.trim()
        && emailVerified
        && pwAllOk
        && pwMatch;
    }
    if (step === 2) return form.regions.length > 0 && form.purposes.length > 0;
    if (step === 3) return true; // optional
    if (step === 4) return form.agreeTerms && form.agreePrivacy;
    return false;
  };

  const next = () => {
    if (!validStep()) return;
    if (step < 4) { setStep(step + 1); window.scrollTo({ top: 0, behavior: 'instant' }); }
    else { onDone && onDone(); }
  };
  const prev = () => {
    if (step > 1) { setStep(step - 1); window.scrollTo({ top: 0, behavior: 'instant' }); }
    else { onBack && onBack(); }
  };

  return (
    <div data-screen-label="04 회원가입" style={{ minHeight: '100vh', background: '#fff' }}>
      <UtilityBar onLogin={() => {}} />
      <MainNav />

      <main style={{ maxWidth: 560, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* back */}
        <button onClick={prev} style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'transparent', border: 'none', padding: '6px 0',
          color: 'var(--ink-500)', fontSize: 13, marginBottom: 20, cursor: 'pointer',
        }}>
          <Icon.ChevronL width={14} height={14} />
          {step === 1 ? '닫기' : '이전 단계'}
        </button>

        {/* progress */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10,
            fontSize: 11, fontWeight: 600, color: 'var(--ink-500)',
          }}>
            <span style={{ color: 'var(--brand-500)', fontWeight: 700 }}>STEP {step}</span>
            <span style={{ color: 'var(--ink-300)' }}>/</span>
            <span>{STEPS.length}</span>
            <span style={{ marginLeft: 8, color: 'var(--ink-700)' }}>{STEPS[step - 1]}</span>
          </div>
          <div style={{
            height: 4, borderRadius: 999, background: 'var(--line-2)', overflow: 'hidden',
          }}>
            <div style={{
              width: `${(step / STEPS.length) * 100}%`, height: '100%',
              background: 'var(--brand-500)', transition: 'width .3s ease',
            }} />
          </div>
        </div>

        {/* Header */}
        {step === 1 && (
          <SignupHeader
            title={<>나와, <span style={{ color: 'var(--brand-500)' }}>나왕</span>입니다.<br />당신을 위한 정보를 수집합니다.</>}
            desc={'맞춤 지원사업을 안내해 드리기 위해\n아래 정보가 필요해요. 입력하신 내용은 안전하게 보호됩니다.'}
          />
        )}
        {step === 2 && (
          <SignupHeader
            title="관심 정보를 알려주세요"
            desc={'관심 있는 지역과 이용 목적을 알려주시면,\n맞춤 지원사업을 더 정확하게 추천해 드릴 수 있어요.'}
          />
        )}
        {step === 3 && (
          <SignupHeader
            title="선택 정보 입력"
            desc={'더 정확한 추천을 원한다면 추가 정보를 입력할 수 있어요.\n선택 정보는 입력하지 않아도 가입할 수 있습니다.'}
          />
        )}
        {step === 4 && (
          <SignupHeader
            title="약관에 동의해 주세요"
            desc={'서비스 이용을 위해 필수 항목 동의가 필요합니다.\n선택 항목은 동의하지 않아도 가입할 수 있어요.'}
          />
        )}

        {/* Step content */}
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 22 }}>
          {step === 1 && (
            <React.Fragment>
              <Field
                label="닉네임" required
                helper="서비스 안에서 사용할 이름이에요. 실명이 아니어도 괜찮습니다."
              >
                <SignupInput value={form.nickname} onChange={(v) => upd('nickname', v)} placeholder="예) 나왕이" />
              </Field>

              {/* Email + verification */}
              <Field
                label="이메일" required
                helper="로그인과 정보 안내에 사용됩니다."
              >
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <SignupInput
                      type="email"
                      value={form.email}
                      onChange={(v) => { upd('email', v); setEmailVerified(false); setEmailSent(false); }}
                      placeholder="example@email.com"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={sendEmailCode}
                    disabled={emailVerified || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)}
                    style={{
                      height: 48, padding: '0 14px', borderRadius: 10,
                      border: '1px solid var(--ink-900)',
                      background: emailVerified ? 'var(--line-2)' : '#fff',
                      color: emailVerified ? 'var(--ink-400)' : 'var(--ink-900)',
                      fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
                      cursor: emailVerified ? 'not-allowed' : 'pointer',
                      opacity: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 0.5 : 1,
                      fontFamily: 'inherit',
                    }}
                  >
                    {emailVerified ? '인증 완료' : (emailSent ? '재전송' : '인증 메일 전송')}
                  </button>
                </div>

                {emailSent && !emailVerified && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <SignupInput
                          value={form.emailCode}
                          onChange={(v) => upd('emailCode', v.replace(/\D/g, '').slice(0, 6))}
                          placeholder="인증번호 6자리 입력"
                        />
                        {emailTimer > 0 && (
                          <span style={{
                            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                            fontSize: 12, fontWeight: 700, color: 'var(--brand-500)',
                            fontVariantNumeric: 'tabular-nums',
                          }}>{fmtTimer(emailTimer)}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={verifyEmailCode}
                        disabled={form.emailCode.length !== 6 || emailTimer === 0}
                        style={{
                          height: 48, padding: '0 14px', borderRadius: 10,
                          border: 'none', background: 'var(--ink-900)', color: '#fff',
                          fontSize: 13, fontWeight: 700,
                          cursor: form.emailCode.length === 6 && emailTimer > 0 ? 'pointer' : 'not-allowed',
                          opacity: form.emailCode.length === 6 && emailTimer > 0 ? 1 : 0.4,
                          fontFamily: 'inherit',
                        }}
                      >
                        확인
                      </button>
                    </div>
                    <p style={{
                      margin: '8px 0 0', fontSize: 11, color: 'var(--ink-500)', lineHeight: 1.5,
                    }}>
                      메일이 오지 않았다면 스팸함을 확인해 주세요. 인증번호는 3분간 유효합니다.
                    </p>
                  </div>
                )}

                {emailVerified && (
                  <p style={{
                    margin: '8px 0 0', fontSize: 12, color: '#1f7a4d', fontWeight: 600,
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1f7a4d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    이메일 인증이 완료되었어요
                  </p>
                )}
              </Field>

              {/* Password */}
              <Field
                label="비밀번호" required
                helper="지원사업 알림과 본인 확인을 위해 사용돼요."
              >
                <SignupInput
                  type="password"
                  value={form.password}
                  onChange={(v) => upd('password', v)}
                  placeholder="비밀번호 입력"
                />
                <ul style={{
                  listStyle: 'none', padding: 0, margin: '10px 0 0',
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px',
                }}>
                  {pwRules.map((r) => (
                    <li key={r.id} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontSize: 12, color: r.ok ? '#1f7a4d' : 'var(--ink-500)',
                      fontWeight: r.ok ? 600 : 500,
                    }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke={r.ok ? '#1f7a4d' : 'var(--ink-300)'}
                        strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      {r.label}
                    </li>
                  ))}
                </ul>
              </Field>

              <Field
                label="비밀번호 확인" required
              >
                <SignupInput
                  type="password"
                  value={form.passwordConfirm}
                  onChange={(v) => upd('passwordConfirm', v)}
                  placeholder="비밀번호 다시 입력"
                />
                {form.passwordConfirm.length > 0 && (
                  <p style={{
                    margin: '8px 0 0', fontSize: 12, fontWeight: 600,
                    color: pwMatch ? '#1f7a4d' : '#c0392b',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    {pwMatch ? (
                      <React.Fragment>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1f7a4d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        비밀번호가 일치해요
                      </React.Fragment>
                    ) : '비밀번호가 일치하지 않아요'}
                  </p>
                )}
              </Field>
            </React.Fragment>
          )}

          {step === 2 && (
            <React.Fragment>
              <Field
                label="관심 지역" required
                helper="지원 정보를 찾고 싶은 지역을 선택해 주세요. (중복 선택 가능)"
              >
                <ChipGroup
                  options={REGIONS}
                  value={form.regions}
                  multi
                  onChange={(v) => toggleArr('regions', v)}
                />
              </Field>
              <Field
                label="이용 목적" required
                helper="어떤 목적으로 정보를 찾고 계신가요? (중복 선택 가능)"
              >
                <PurposeGroup
                  options={PURPOSES}
                  value={form.purposes}
                  onChange={(v) => toggleArr('purposes', v)}
                />
              </Field>
            </React.Fragment>
          )}

          {step === 3 && (
            <React.Fragment>
              <Field
                label="전화번호"
                helper="상담 연결, 문자 알림, 신청 안내가 필요한 경우에 사용됩니다."
              >
                <SignupInput value={form.phone} onChange={(v) => upd('phone', v)} placeholder="010-0000-0000" />
              </Field>
              <Field
                label="연령대"
                helper="연령 조건이 있는 지원 정보를 추천하는 데 사용됩니다."
              >
                <ChipGroup
                  options={AGE_BANDS}
                  value={form.age ? [form.age] : []}
                  onChange={(v) => upd('age', form.age === v ? '' : v)}
                />
              </Field>
              <Field
                label="관심 지원 분야"
                helper="(중복 선택 가능)"
              >
                <ChipGroup
                  options={INTERESTS}
                  value={form.interests}
                  multi
                  onChange={(v) => toggleArr('interests', v)}
                />
              </Field>
              <Field label="참여 가능 방식" helper="(중복 선택 가능)">
                <ChipGroup
                  options={PARTICIPATION}
                  value={form.participation}
                  multi
                  onChange={(v) => toggleArr('participation', v)}
                />
              </Field>
            </React.Fragment>
          )}

          {step === 4 && (
            <React.Fragment>
              <ConsentAll form={form} setForm={setForm} />
              <ConsentGroup title="필수">
                <ConsentRow
                  label="서비스 이용약관 동의"
                  required
                  checked={form.agreeTerms}
                  onChange={() => upd('agreeTerms', !form.agreeTerms)}
                />
                <ConsentRow
                  label="개인정보 수집 및 이용 동의"
                  required
                  checked={form.agreePrivacy}
                  onChange={() => upd('agreePrivacy', !form.agreePrivacy)}
                />
              </ConsentGroup>
              <ConsentGroup title="선택">
                <ConsentRow
                  label="맞춤 지원정보 제공을 위한 추가 정보 활용 동의"
                  checked={form.agreeExtra}
                  onChange={() => upd('agreeExtra', !form.agreeExtra)}
                />
                <ConsentRow
                  label="알림 수신 동의"
                  checked={form.agreeNotify}
                  onChange={() => upd('agreeNotify', !form.agreeNotify)}
                />
                <ConsentRow
                  label="마케팅 정보 수신 동의"
                  checked={form.agreeMarketing}
                  onChange={() => upd('agreeMarketing', !form.agreeMarketing)}
                />
              </ConsentGroup>
            </React.Fragment>
          )}
        </div>

        {/* Footer CTA */}
        <div style={{ marginTop: 36, display: 'flex', gap: 10 }}>
          {step > 1 && (
            <button onClick={prev} style={{
              flex: '0 0 auto', height: 54, padding: '0 20px', borderRadius: 12,
              border: '1px solid var(--line)', background: '#fff',
              color: 'var(--ink-700)', fontSize: 15, fontWeight: 600, cursor: 'pointer',
            }}>이전</button>
          )}
          <button
            onClick={next}
            disabled={!validStep()}
            style={{
              flex: 1, height: 54, borderRadius: 12, border: 'none',
              background: validStep() ? 'var(--ink-900)' : 'var(--ink-300)',
              color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: validStep() ? 'pointer' : 'not-allowed',
            }}
          >
            {step === 4 ? '가입 완료' : '다음'}
          </button>
        </div>
      </main>
    </div>
  );
}

function SignupHeader({ title, desc }) {
  return (
    <div>
      <h1 style={{
        margin: 0, fontSize: 24, fontWeight: 800,
        color: 'var(--ink-900)', letterSpacing: '-0.02em', lineHeight: 1.4,
      }}>{title}</h1>
      {desc && (
        <p style={{
          marginTop: 12, marginBottom: 0,
          fontSize: 13, color: 'var(--ink-500)', lineHeight: 1.65, whiteSpace: 'pre-line',
        }}>{desc}</p>
      )}
    </div>
  );
}

function Field({ label, required, helper, children }) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6,
      }}>
        <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-900)' }}>
          {label}
        </label>
        {required && (
          <span style={{
            color: 'var(--brand-500)', fontSize: 11, fontWeight: 700,
          }}>*</span>
        )}
      </div>
      {helper && (
        <p style={{
          margin: '0 0 10px', fontSize: 12, color: 'var(--ink-500)', lineHeight: 1.5,
        }}>{helper}</p>
      )}
      {children}
    </div>
  );
}

function SignupInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', height: 48, border: '1px solid var(--line)',
        borderRadius: 10, padding: '0 14px',
        fontSize: 14, outline: 'none', color: 'var(--ink-900)',
        fontFamily: 'inherit', background: '#fff',
      }}
      onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand-500)'}
      onBlur={(e) => e.currentTarget.style.borderColor = 'var(--line)'}
    />
  );
}

function ChipGroup({ options, value, multi, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map((opt) => {
        const active = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            style={{
              height: 38, padding: '0 14px', borderRadius: 999,
              border: `1px solid ${active ? 'var(--brand-500)' : 'var(--line)'}`,
              background: active ? 'var(--brand-50)' : '#fff',
              color: active ? 'var(--brand-500)' : 'var(--ink-700)',
              fontSize: 13, fontWeight: active ? 700 : 500, cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function PurposeGroup({ options, value, onChange }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {options.map((opt) => {
        const active = value.includes(opt.label);
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onChange(opt.label)}
            style={{
              position: 'relative',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
              padding: '16px 16px 18px', borderRadius: 12, textAlign: 'left',
              border: `1px solid ${active ? 'var(--brand-500)' : 'var(--line)'}`,
              background: active ? 'var(--brand-50)' : '#fff',
              color: 'var(--ink-900)', fontSize: 13.5, fontWeight: active ? 700 : 500,
              lineHeight: 1.45, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'background .15s ease, border-color .15s ease',
            }}
          >
            <span style={{ fontSize: 26, lineHeight: 1 }}>{opt.emoji}</span>
            <span>{opt.label}</span>
            {active && (
              <span style={{
                position: 'absolute', top: 10, right: 10,
                width: 20, height: 20, borderRadius: '50%',
                background: 'var(--brand-500)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function RadioList({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px', borderRadius: 10, textAlign: 'left',
              border: `1px solid ${active ? 'var(--brand-500)' : 'var(--line)'}`,
              background: active ? 'var(--brand-50)' : '#fff',
              color: 'var(--ink-900)', fontSize: 14, fontWeight: active ? 700 : 500,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <span style={{
              width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
              border: `2px solid ${active ? 'var(--brand-500)' : 'var(--ink-300)'}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: '#fff',
            }}>
              {active && (
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-500)',
                }} />
              )}
            </span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function ConsentAll({ form, setForm }) {
  const flags = ['agreeTerms','agreePrivacy','agreeExtra','agreeNotify','agreeMarketing'];
  const all = flags.every(k => form[k]);
  const toggleAll = () => {
    const next = !all;
    setForm((f) => ({
      ...f,
      agreeTerms: next, agreePrivacy: next,
      agreeExtra: next, agreeNotify: next, agreeMarketing: next,
    }));
  };
  return (
    <button
      type="button"
      onClick={toggleAll}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 18px', borderRadius: 12, textAlign: 'left',
        border: `1px solid ${all ? 'var(--brand-500)' : 'var(--line)'}`,
        background: all ? 'var(--brand-50)' : '#fafbfc',
        color: 'var(--ink-900)', fontSize: 15, fontWeight: 700,
        cursor: 'pointer', fontFamily: 'inherit', width: '100%',
      }}
    >
      <CheckSquare checked={all} />
      모든 항목에 동의합니다
    </button>
  );
}

function ConsentGroup({ title, children }) {
  return (
    <div>
      <div style={{
        fontSize: 12, fontWeight: 700, color: 'var(--ink-500)',
        marginBottom: 8,
      }}>{title}</div>
      <div style={{
        border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        {children}
      </div>
    </div>
  );
}

function ConsentRow({ label, required, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px', textAlign: 'left',
        border: 'none', background: 'transparent',
        borderBottom: '1px solid var(--line-2)',
        color: 'var(--ink-900)', fontSize: 14, fontWeight: 500,
        cursor: 'pointer', fontFamily: 'inherit', width: '100%',
      }}
    >
      <CheckSquare checked={checked} />
      <span style={{ flex: 1 }}>
        <span style={{
          color: required ? 'var(--brand-500)' : 'var(--ink-500)',
          fontSize: 12, fontWeight: 700, marginRight: 6,
        }}>{required ? '[필수]' : '[선택]'}</span>
        {label}
      </span>
      <span style={{ color: 'var(--ink-400)', fontSize: 12 }}>보기</span>
    </button>
  );
}

function CheckSquare({ checked }) {
  return (
    <span style={{
      width: 20, height: 20, borderRadius: 6, flexShrink: 0,
      border: `1.5px solid ${checked ? 'var(--brand-500)' : 'var(--ink-300)'}`,
      background: checked ? 'var(--brand-500)' : '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {checked && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
    </span>
  );
}

/* ============================================================
   APP
============================================================ */
function App() {
  const [route, setRoute] = useState({ name: 'home' });
  const onOpen = (p) => { setRoute({ name: 'detail', program: p }); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const onBack = () => { setRoute({ name: 'home' }); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const onLogin = () => { setRoute({ name: 'login' }); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const onHome = () => { setRoute({ name: 'home' }); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const onNavAll = () => { setRoute({ name: 'all' }); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const onSignup = () => { setRoute({ name: 'signup' }); window.scrollTo({ top: 0, behavior: 'instant' }); };

  if (route.name === 'login') {
    return <LoginPage onBack={onBack} onSignup={onSignup} />;
  }
  if (route.name === 'signup') {
    return <SignupPage onBack={onBack} onDone={onHome} />;
  }
  if (route.name === 'detail') {
    return <ProgramDetailPage program={route.program} onBack={onBack} onLogin={onLogin} />;
  }
  return <ListPage mode={route.name} onOpen={onOpen} onLogin={onLogin} onHome={onHome} onNavAll={onNavAll} />;
}

/* ============================================================
   CURATION ROWS — horizontal scrollers
============================================================ */
function CurationRow({ eyebrow, title, subtitle, moreLabel = '더보기', live, children }) {
  return (
    <section style={{ marginTop: 56 }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: 16, marginBottom: 18,
      }}>
        <div>
          {eyebrow && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 600, color: 'var(--ink-500)',
              letterSpacing: '-0.01em', marginBottom: 6,
            }}>
              {live && (
                <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
                  <span style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: '#e53935', animation: 'curationPing 1.6s cubic-bezier(0,0,0.2,1) infinite',
                    opacity: 0.55,
                  }} />
                  <span style={{
                    position: 'relative', width: 8, height: 8, borderRadius: '50%',
                    background: '#e53935',
                  }} />
                </span>
              )}
              {eyebrow}
            </div>
          )}
          <h2 style={{
            margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--ink-900)',
            letterSpacing: '-0.025em',
          }}>{title}</h2>
          {subtitle && (
            <p style={{
              margin: '6px 0 0', fontSize: 13, color: 'var(--ink-500)',
              letterSpacing: '-0.01em',
            }}>{subtitle}</p>
          )}
        </div>
        <a href="#" onClick={(e) => e.preventDefault()} style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 13, fontWeight: 600, color: 'var(--ink-700)',
          whiteSpace: 'nowrap', padding: '6px 4px',
        }}>
          {moreLabel}
          <Icon.ChevronR width={14} height={14} />
        </a>
      </div>

      <div className="curation-scroller" style={{
        display: 'flex', gap: 14, overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        paddingBottom: 10, marginBottom: -2,
      }}>
        {children}
      </div>

      <style>{`
        .curation-scroller::-webkit-scrollbar { height: 6px; }
        .curation-scroller::-webkit-scrollbar-thumb { background: var(--line); border-radius: 999px; }
        .curation-scroller::-webkit-scrollbar-track { background: transparent; }
        @keyframes curationPing {
          0% { transform: scale(1); opacity: 0.55; }
          80%, 100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </section>
  );
}

/* ----- Popular (ranked) ----- */
const POPULAR_PICKS = [
  { rank: 1, delta: 'NEW', programId: 1 },
  { rank: 2, delta: '▲ 3', programId: 5 },
  { rank: 3, delta: '▼ 1', programId: 2 },
  { rank: 4, delta: '▲ 2', programId: 4 },
  { rank: 5, delta: '—',  programId: 6 },
  { rank: 6, delta: '▲ 4', programId: 8 },
];

function PopularCard({ entry, onClick }) {
  const p = PROGRAMS.find((x) => x.id === entry.programId);
  if (!p) return null;
  const up = entry.delta.startsWith('▲');
  const down = entry.delta.startsWith('▼');
  const newish = entry.delta === 'NEW';
  const deltaColor = newish ? 'var(--brand-500)' : up ? '#1f7a4d' : down ? '#c83838' : 'var(--ink-400)';
  return (
    <article
      onClick={onClick}
      style={{
        flex: '0 0 248px', scrollSnapAlign: 'start',
        border: '1px solid var(--line)', borderRadius: 14,
        background: '#fff', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        cursor: 'pointer', transition: 'transform .15s ease, box-shadow .15s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.08)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{
        position: 'relative', background: p.bg, height: 160,
        padding: 14, overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div aria-hidden style={{
          position: 'absolute', right: -32, top: -28, width: 110, height: 110,
          borderRadius: '50%', background: 'rgba(255,255,255,0.35)',
        }} />
        <div style={{
          position: 'relative',
          display: 'inline-flex', alignItems: 'baseline', gap: 4, alignSelf: 'flex-start',
          background: 'rgba(17,19,25,0.88)', color: '#fff',
          padding: '5px 10px', borderRadius: 8,
          fontWeight: 800, fontSize: 13, letterSpacing: '-0.01em',
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.7 }}>TOP</span>
          {entry.rank}
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{
            background: 'rgba(255,255,255,0.7)', color: 'var(--ink-900)',
            padding: '3px 9px', borderRadius: 999, fontSize: 11, fontWeight: 600,
          }}>{p.tag}</span>
        </div>
      </div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{
          fontSize: 14, fontWeight: 700, color: 'var(--ink-900)',
          letterSpacing: '-0.01em', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{p.title.replace('\n', ' ')}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{p.org}</div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 4, fontSize: 11,
        }}>
          <span style={{ color: 'var(--ink-500)' }}>{p.weeks}</span>
          <span style={{ color: deltaColor, fontWeight: 700 }}>{entry.delta}</span>
        </div>
      </div>
    </article>
  );
}

/* ----- One-shot programs ----- */
const ONE_SHOT_PICKS = [
  { id: 'os-1', tag: '마음돌봄', dDay: 'D-7',
    title: '제로웨이스트 다이어리 워크숍', org: '서울 청년재단',
    bg: 'var(--card-yellow)', when: '5/24 토 14:00', length: '3시간', mode: '오프라인' },
  { id: 'os-2', tag: '클래스', dDay: 'D-12',
    title: '나를 위한 커피 드리핑 원데이', org: '촌촌수투', bg: 'var(--card-orange)',
    when: '6/01 토 11:00', length: '2시간', mode: '오프라인' },
  { id: 'os-3', tag: '온라인 모임', dDay: 'D-3',
    title: '닫터서의 조용한 글쓰기 섬', org: '나나센터 수원', bg: 'var(--card-mint)',
    when: '5/20 화 21:00', length: '90분', mode: '온라인' },
  { id: 'os-4', tag: '산책 모임', dDay: 'D-9',
    title: '서천에서 함께 걷는 아침', org: '서울 청년허브', bg: 'var(--card-blue)',
    when: '5/26 일 09:00', length: '2시간', mode: '오프라인' },
  { id: 'os-5', tag: '체험', dDay: 'D-14',
    title: '소래 끝에서 만난 도자기 수업', org: '경기 청년센터', bg: 'var(--card-pink)',
    when: '6/05 목 19:00', length: '2시간', mode: '오프라인' },
  { id: 'os-6', tag: '워크숍', dDay: 'D-21',
    title: '첫 이력서, 함께 써볼까요', org: '인천 청년센터', bg: 'var(--card-purple)',
    when: '6/12 목 19:30', length: '2시간', mode: '온·오프라인' },
];

function OneShotCard({ p, onClick }) {
  return (
    <article
      onClick={onClick}
      style={{
        flex: '0 0 264px', scrollSnapAlign: 'start',
        border: '1px solid var(--line)', borderRadius: 14,
        background: '#fff', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        cursor: 'pointer', transition: 'transform .15s ease, box-shadow .15s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.08)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{
        position: 'relative', background: p.bg, height: 132,
        padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        overflow: 'hidden',
      }}>
        <div aria-hidden style={{
          position: 'absolute', left: -28, bottom: -34, width: 100, height: 100,
          borderRadius: '50%', background: 'rgba(255,255,255,0.4)',
        }} />
        <div style={{
          position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{
            background: 'rgba(255,255,255,0.75)', color: 'var(--ink-900)',
            padding: '4px 9px', borderRadius: 999, fontSize: 11, fontWeight: 600,
          }}>{p.tag}</span>
          <span style={{
            background: 'var(--ink-900)', color: '#fff',
            padding: '4px 9px', borderRadius: 999, fontSize: 11, fontWeight: 700,
          }}>{p.dDay}</span>
        </div>
        <div style={{
          position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#fff', color: 'var(--ink-900)',
          padding: '5px 10px', borderRadius: 8,
          fontSize: 11, fontWeight: 700, alignSelf: 'flex-start',
          border: '1px solid rgba(0,0,0,0.08)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-500)' }} />
          단회·{p.length}
        </div>
      </div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{
          fontSize: 14, fontWeight: 700, color: 'var(--ink-900)',
          letterSpacing: '-0.01em', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{p.title}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{p.org}</div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 4, paddingTop: 8, borderTop: '1px dashed var(--line)',
          fontSize: 11,
        }}>
          <span style={{ color: 'var(--ink-700)', fontWeight: 600 }}>{p.when}</span>
          <span style={{ color: 'var(--ink-500)' }}>{p.mode}</span>
        </div>
      </div>
    </article>
  );
}

/* ----- Reviews ----- */
const REVIEWS = [
  { id: 'r-1', rating: 5,
    quote: '나와 비슷한 사람들을 만난 게 제일 커요. 처음으로 "나만 이런 게 아니구나" 싶었어요.',
    author: '파랑새 22', persona: '당사자',
    programTitle: '천천히, 다시 만나는 일상', org: '경기 청년센터', bg: 'var(--card-blue)' },
  { id: 'r-2', rating: 5,
    quote: '온라인이라 부담이 적었어요. 카메라 꺼도 되고, 채팅으로만 참여해도 아무도 재촉 안 해주셨어요.',
    author: '노란불 09', persona: '당사자',
    programTitle: '방 안에서 세상으로, 온라인 살롱', org: '나나센터 수원', bg: 'var(--card-yellow)' },
  { id: 'r-3', rating: 4,
    quote: '자식을 도와주고 싶었는데 어떻게 대해야 할지 몰랐어요. 가족 상담에서 힌트를 많이 얻었습니다.',
    author: '어머니 김··', persona: '가족',
    programTitle: '가족을 위한 동행 상담', org: '경기 청년재단', bg: 'var(--card-mint)' },
  { id: 'r-4', rating: 5,
    quote: '8주간 매주 같은 시간에 외출하는 게 이렇게 큰 변화일 줄 몰랐어요.',
    author: '바람 한줄 14', persona: '당사자',
    programTitle: '동네 한 바퀴, 산책 클럽', org: '대전 청년정책본부', bg: 'var(--card-pink)' },
  { id: 'r-5', rating: 5,
    quote: '주변에 소개해주고 싶은 프로그램이 많아서, 관심있는 친구들에게 링크를 보내고 있어요.',
    author: '삼곡이 서포터', persona: '지인',
    programTitle: '프로그램 추천 커뮤니티', org: '나와·나왕', bg: 'var(--card-purple)' },
];

function ReviewCard({ r, onClick }) {
  return (
    <article
      onClick={onClick}
      style={{
        flex: '0 0 320px', scrollSnapAlign: 'start',
        border: '1px solid var(--line)', borderRadius: 14,
        background: '#fff', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        cursor: 'pointer', transition: 'transform .15s ease, box-shadow .15s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.08)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{ padding: '20px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} viewBox="0 0 24 24" width="14" height="14" fill={i < r.rating ? '#f5a623' : '#e7e9ee'}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
              </svg>
            ))}
          </div>
          <span style={{
            background: 'var(--bg-soft)', color: 'var(--ink-700)',
            padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600,
          }}>{r.persona}</span>
        </div>

        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{
            position: 'absolute', top: -10, left: -2,
            fontFamily: 'Georgia, serif', fontSize: 36, lineHeight: 1,
            color: 'var(--brand-100)', fontWeight: 700,
          }}>“</span>
          <p style={{
            margin: 0, paddingLeft: 16,
            fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.65,
            letterSpacing: '-0.01em',
            display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{r.quote}</p>
        </div>

        <div style={{ fontSize: 12, color: 'var(--ink-500)', fontWeight: 500 }}>— {r.author}</div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 16px',
        background: 'var(--bg-soft)', borderTop: '1px solid var(--line-2)',
      }}>
        <div style={{ width: 38, height: 38, borderRadius: 8, background: r.bg, flexShrink: 0 }} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: 'var(--ink-900)',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{r.programTitle}</div>
          <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>{r.org}</div>
        </div>
        <Icon.ChevronR width={14} height={14} style={{ color: 'var(--ink-400)' }} />
      </div>
    </article>
  );
}

function ListPage({ mode = 'home', onOpen, onLogin, onHome, onNavAll }) {
  const [filters, setFilters] = useState({
    region: [], level: [], mode: [],
    period: [], status: [], people: [],
  });
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('추천순');

  const handleFilter = (k, v) => {
    setFilters((f) => ({ ...f, [k]: v })); setPage(1);
    if (mode === 'home') onNavAll && onNavAll();
  };
  const reset = () => {
    setFilters({ region:[], level:[], mode:[], period:[], status:[], people:[] });
    setQuery(''); setAppliedQuery(''); setPage(1);
  };
  const search = () => {
    setAppliedQuery(query); setPage(1);
    if (mode === 'home') onNavAll && onNavAll();
  };

  const filtered = useMemo(() => {
    return PROGRAMS.filter((p) => {
      if (appliedQuery && !p.title.includes(appliedQuery) && !p.org.includes(appliedQuery)) return false;

      const anySelected = (arr) => Array.isArray(arr) && arr.length > 0;
      const someChip = (arr, matchFn) => arr.some(v => p.chips.some(c => matchFn(c, v)));

      if (anySelected(filters.region) && !someChip(filters.region, (c, v) => c.includes(v))) return false;
      if (anySelected(filters.mode)   && !someChip(filters.mode,   (c, v) => c === v || c.includes(v))) return false;
      if (anySelected(filters.status) && !filters.status.includes(p.statusLabel || p.status)) {
        // map status pill text to filter values
        const map = { '모집 중': '현재 신청 가능', '모집 예정': '모집 예정', '마감': '마감' };
        if (!filters.status.includes(map[p.status] || p.status)) return false;
      }
      return true;
    });
  }, [filters, appliedQuery]);

  return (
    <div data-screen-label={mode === 'all' ? '01b 지원사업 전체' : '01 홈'}>
      <UtilityBar onLogin={onLogin} />
      <MainNav onHome={onHome} onNavAll={onNavAll} active={mode} />

      {/* Top centered search + filters */}
      <section style={{
        background: 'linear-gradient(180deg, #f7f9fc 0%, #ffffff 100%)',
        borderBottom: '1px solid var(--line-2)',
      }}>
        <div style={{
          maxWidth: 1240, margin: '0 auto', padding: '56px 32px 40px',
          textAlign: 'center',
        }}>
          <h1 style={{
            margin: '0 0 28px', fontSize: 32, fontWeight: 800, color: 'var(--ink-900)',
            letterSpacing: '-0.03em',
          }}>맞춤 고립·은둔 지원 찾기</h1>
          <FilterBar
            values={filters} onChange={handleFilter} onReset={reset}
            query={query} setQuery={setQuery} onSearch={search}
          />
        </div>
      </section>

      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px 32px' }}>
        {/* Curation rows — home only */}
        {mode === 'home' && (
          <React.Fragment>
            <CurationRow
              eyebrow="실시간 인기"
              title="지금 가장 많이 보고 있는 사업"
              subtitle="다른 청년들이 지금 이 시간 살펴보고 있는 프로그램이에요"
              live
            >
              {POPULAR_PICKS.map((e) => (
                <PopularCard key={e.programId} entry={e} onClick={() => onOpen(PROGRAMS.find(p => p.id === e.programId))} />
              ))}
            </CurationRow>

            <CurationRow
              eyebrow="가볍게 시작하기"
              title="1회만 참여해도 괜찮아요"
              subtitle="원데이·짧은 일정 — 부담 없이 한 번 와보세요"
            >
              {ONE_SHOT_PICKS.map((p) => (
                <OneShotCard key={p.id} p={p} onClick={() => {}} />
              ))}
            </CurationRow>

            <CurationRow
              eyebrow="먼저 다녀온 이야기"
              title="사업 후기"
              subtitle="참여자가 직접 남긴 솔직한 후기예요"
            >
              {REVIEWS.map((r) => (
                <ReviewCard key={r.id} r={r} onClick={() => {}} />
              ))}
            </CurationRow>
          </React.Fragment>
        )}

        {/* Full grid — 지원사업 nav only */}
        {mode === 'all' && (
          <React.Fragment>
            <div style={{ marginTop: 40 }}>
              <h1 style={{
                margin: 0, fontSize: 32, fontWeight: 800, color: 'var(--ink-900)',
                letterSpacing: '-0.03em',
              }}>지원 사업</h1>
            </div>

            {/* Result toolbar */}
            <div style={{
              marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 12,
            }}>
              <div style={{ fontSize: 13, color: 'var(--ink-600)' }}>
                전체 <strong style={{ color: 'var(--ink-900)', fontWeight: 700 }}>{filtered.length}</strong>건
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <select
                  value={sort} onChange={(e) => setSort(e.target.value)}
                  style={{
                    height: 34, border: '1px solid var(--line)', borderRadius: 8,
                    padding: '0 10px 0 12px', fontSize: 12, color: 'var(--ink-700)',
                    background: '#fff', fontFamily: 'inherit', minWidth: 120,
                  }}
                >
                  <option>추천순</option>
                  <option>마감 임박순</option>
                  <option>최신순</option>
                </select>
                <div style={{
                  display: 'inline-flex', border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden',
                }}>
                  <button onClick={() => setView('grid')} style={viewBtn(view === 'grid')}>
                    <Icon.Grid width={14} height={14} />
                    <span>카드</span>
                  </button>
                  <button onClick={() => setView('list')} style={viewBtn(view === 'list')}>
                    <Icon.List width={14} height={14} />
                    <span>리스트</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Cards */}
            {view === 'grid' ? (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 18, marginTop: 18,
              }}>
                {filtered.flatMap((p, i) => {
                  const items = [<ProgramCard key={p.id} p={p} onClick={() => onOpen(p)} />];
                  // In-feed ad after position 4 (starts row 2)
                  if (i === 3 && filtered.length > 4) {
                    items.push(<InFeedAdCard key="ad-1" />);
                  }
                  return items;
                })}
              </div>
            ) : (
              <ListView programs={filtered} onOpen={onOpen} />
            )}

            {filtered.length === 0 && (
              <div style={{
                padding: '80px 0', textAlign: 'center', color: 'var(--ink-500)',
                fontSize: 14,
              }}>
                조건에 맞는 사업이 없어요. 필터를 조정해보세요.
              </div>
            )}

            {filtered.length > 0 && <Pagination page={page} setPage={setPage} total={3} />}
          </React.Fragment>
        )}
      </main>

      <Footer />
    </div>
  );
}

const viewBtn = (active) => ({
  height: 34, padding: '0 12px',
  background: active ? 'var(--ink-900)' : '#fff',
  color: active ? '#fff' : 'var(--ink-600)',
  border: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
  fontSize: 12, fontWeight: 600,
});

/* List view (simple alt) */
function ListView({ programs, onOpen }) {
  return (
    <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {programs.map((p) => (
        <div key={p.id} onClick={() => onOpen && onOpen(p)} style={{
          display: 'flex', gap: 18, alignItems: 'center',
          padding: 14, border: '1px solid var(--line)', borderRadius: 12, background: '#fff',
          cursor: 'pointer',
        }}>
          <div style={{
            width: 96, height: 96, borderRadius: 10, background: p.bg, flexShrink: 0,
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              {p.chips.map((c, i) => (
                <span key={i} style={{
                  background: '#f3f4f7', color: 'var(--ink-700)',
                  padding: '3px 8px', borderRadius: 5, fontSize: 11, fontWeight: 600,
                }}>{c}</span>
              ))}
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{p.title.replace('\n', ' ')}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{p.org} · {p.weeks}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              display: 'inline-block', padding: '4px 10px', borderRadius: 999,
              background: 'var(--brand-500)', color: '#fff', fontSize: 11, fontWeight: 700,
              marginBottom: 6,
            }}>{p.dDay}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{p.deadline}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  return <App />;
}
