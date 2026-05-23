'use client';

import { useState, useMemo } from 'react';

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
function UtilityBar() {
  return (
    <div style={{
      borderBottom: '1px solid var(--line-2)',
      background: '#fafbfc',
      fontSize: 12,
      color: 'var(--ink-600)',
    }}>
      <div style={{
        maxWidth: 1240, margin: '0 auto', padding: '0 32px',
        height: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{
            background: '#fff8d4', color: '#7a5b00',
            padding: '3px 8px', borderRadius: 4, fontWeight: 600, fontSize: 11,
          }}>고립·은둔청년 통합 정보 플랫폼</span>
          <span style={{ color: 'var(--ink-500)' }}>운영시간 평일 10:00–18:00</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, color: 'var(--ink-500)' }}>
          <a href="#">도움말</a>
          <span style={{ color: 'var(--line)' }}>|</span>
          <a href="#">1:1 문의</a>
          <span style={{ color: 'var(--line)' }}>|</span>
          <a href="#">로그인</a>
          <span style={{ color: 'var(--line)' }}>|</span>
          <a href="#">회원가입</a>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN NAV
============================================================ */
function MainNav() {
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
        {/* Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 0,
            fontWeight: 800, fontSize: 22, letterSpacing: '-0.03em', color: 'var(--brand-700)',
          }}>
            <span>나와</span>
            <span style={{ color: 'var(--brand-500)' }}>나망</span>
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
          <NavItem label="지원사업 검색" active />
          <NavItem label="내 스크랩" />
        </nav>

        {/* Right cluster */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 18 }}>
          <button style={iconBtn} aria-label="검색">
            <Icon.Search width={20} height={20} />
          </button>
          <button style={iconBtn} aria-label="알림">
            <Icon.Bell width={20} height={20} />
            <span style={{
              position: 'absolute', top: 6, right: 6, width: 7, height: 7,
              borderRadius: '50%', background: '#ef4444', border: '1.5px solid #fff',
            }} />
          </button>
          <button style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#e7f0ff', color: 'var(--brand-500)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 14, border: 'none',
          }}>지</button>
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

function NavItem({ label, active }) {
  return (
    <a href="#" style={{
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
  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      borderRadius: 18, marginTop: 28,
      background: 'linear-gradient(135deg, #eaf2ff 0%, #f4f8ff 60%, #f0eaff 100%)',
      padding: '40px 44px',
      minHeight: 200,
    }}>
      {/* Decorative circles */}
      <div aria-hidden style={{
        position: 'absolute', right: -40, top: -60, width: 280, height: 280,
        borderRadius: '50%', background: 'rgba(125, 155, 255, 0.18)',
      }} />
      <div aria-hidden style={{
        position: 'absolute', right: 120, top: 30, width: 110, height: 110,
        borderRadius: '50%', background: 'rgba(125, 155, 255, 0.22)',
      }} />
      <div aria-hidden style={{
        position: 'absolute', right: 180, top: 90, width: 14, height: 14,
        borderRadius: '50%', background: 'var(--brand-500)',
      }} />
      <div aria-hidden style={{
        position: 'absolute', right: 60, bottom: -50, width: 160, height: 160,
        borderRadius: '50%', background: 'rgba(174, 145, 255, 0.20)',
      }} />

      <div style={{ position: 'relative', maxWidth: 640 }}>
        <span style={{
          display: 'inline-block',
          background: 'var(--brand-500)', color: '#fff',
          padding: '5px 12px', borderRadius: 999,
          fontWeight: 600, fontSize: 12,
          marginBottom: 14,
        }}>특별 안내</span>
        <h2 style={{
          margin: 0, fontSize: 30, fontWeight: 800, color: 'var(--brand-700)',
          letterSpacing: '-0.025em',
        }}>2026년 청년 자립 지원 프로그램 모집</h2>
        <p style={{
          marginTop: 12, marginBottom: 22,
          fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.6,
          letterSpacing: '-0.01em',
        }}>
          고립·은둔청년을 위한 맞춤형 지원 프로그램이 시작됩니다. 주거, 일자리, 심리상담까지 종합 지원
        </p>
        <button style={{
          background: 'var(--ink-900)', color: '#fff', border: 'none',
          padding: '12px 22px', borderRadius: 999, fontWeight: 600, fontSize: 14,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          자세히 보기
          <Icon.ArrowUpRight width={14} height={14} />
        </button>
      </div>
    </section>
  );
}

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
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

      <form
        onSubmit={(e) => { e.preventDefault(); onSearch(); }}
        style={{ display: 'flex', gap: 10, marginTop: 14 }}
      >
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="사업명을 입력하세요"
            style={{
              width: '100%', height: 48, border: '1px solid var(--line)',
              borderRadius: 10, padding: '0 18px',
              fontSize: 14, outline: 'none', color: 'var(--ink-900)',
              fontFamily: 'inherit', background: '#fff',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand-500)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--line)'}
          />
        </div>
        <button type="submit" style={{
          height: 48, padding: '0 28px',
          background: 'var(--ink-900)', color: '#fff', border: 'none', borderRadius: 10,
          fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          <Icon.Search width={16} height={16} />
          검색
        </button>
      </form>
    </div>
  );
}

const FILTER_OPTIONS = {
  region:  ['서울','부산','대구','인천','광주','대전','울산','세종','경기','강원','충청','전라','경상','제주'],
  level:   ['일상 회복','사회 복귀','관계 형성'],
  mode:    ['온라인','오프라인','온·오프라인'],
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
        <Icon.Chevron width={14} height={14} />
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
            나와나망
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

function ProgramDetailPage({ program, onBack }) {
  const p = program;
  return (
    <div data-screen-label="02 지원사업 상세">
      <UtilityBar />
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
            고립·은둔 예방
          </span>
          <span>›</span>
          <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>지원사업 검색</a>
          <span>›</span>
          <span style={{ color: 'var(--ink-900)', fontWeight: 600 }}>{p.title.replace('\n', ', ')}</span>
        </div>

        {/* Back link */}
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'transparent', border: 'none', padding: '6px 0',
            color: 'var(--ink-500)', fontSize: 12,
          }}
        >
          <Icon.ChevronL width={14} height={14} />
          사업 목록으로
        </button>

        <div style={{ height: 1, background: 'var(--line-2)', margin: '12px 0 28px' }} />

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
   APP
============================================================ */
function App() {
  const [route, setRoute] = useState({ name: 'list' });
  const onOpen = (p) => { setRoute({ name: 'detail', program: p }); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const onBack = () => { setRoute({ name: 'list' }); window.scrollTo({ top: 0, behavior: 'instant' }); };

  if (route.name === 'detail') {
    return <ProgramDetailPage program={route.program} onBack={onBack} />;
  }
  return <ListPage onOpen={onOpen} />;
}

function ListPage({ onOpen }) {
  const [filters, setFilters] = useState({
    region: [], level: [], mode: [],
    period: [], status: [], people: [],
  });
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('추천순');

  const handleFilter = (k, v) => { setFilters((f) => ({ ...f, [k]: v })); setPage(1); };
  const reset = () => {
    setFilters({ region:[], level:[], mode:[], period:[], status:[], people:[] });
    setQuery(''); setAppliedQuery(''); setPage(1);
  };
  const search = () => { setAppliedQuery(query); setPage(1); };

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
    <div data-screen-label="01 지원사업 검색">
      <UtilityBar />
      <MainNav />

      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px 32px' }}>
        <Hero />

        {/* Section heading */}
        <div style={{ marginTop: 40 }}>
          <span style={{
            display: 'inline-block', fontSize: 12, color: 'var(--ink-500)',
            letterSpacing: '-0.01em', marginBottom: 8, fontWeight: 500,
          }}>고립·은둔 예방</span>
          <h1 style={{
            margin: 0, fontSize: 32, fontWeight: 800, color: 'var(--ink-900)',
            letterSpacing: '-0.03em',
          }}>지원사업 검색</h1>
        </div>

        {/* Filters */}
        <div style={{ marginTop: 22 }}>
          <FilterBar
            values={filters} onChange={handleFilter} onReset={reset}
            query={query} setQuery={setQuery} onSearch={search}
          />
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
            {filtered.map((p) => <ProgramCard key={p.id} p={p} onClick={() => onOpen(p)} />)}
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
