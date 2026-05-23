/* Step 3: region + persona selection */
'use client';

import { useMemo as useMemoP3, useState as useStateP3 } from 'react';
import { SIcon } from './signup-info-icons';
import { HelperText, Label, ProgressBar } from './signup-info-fields';

const REGIONS = ['서울','부산','대구','인천','광주','대전','울산','세종','경기','강원','충청','전라','경상','제주'];

const PERSONAS = [
  {
    id: 'self',
    emoji: '🙋',
    title: '당사자',
    desc: '내가 지원이 필요해요',
    detail: '고립·은둔 경험이 있거나 지금 어려움을 겪고 있어요',
  },
  {
    id: 'family',
    emoji: '👨‍👩‍👧',
    title: '가족',
    desc: '가족이 도움을 필요로 해요',
    detail: '자녀, 형제, 부모님 등 가족 구성원을 위해 정보를 찾고 있어요',
  },
  {
    id: 'ally',
    emoji: '🤝',
    title: '관심 & 지인',
    desc: '친구·동료·이웃을 돕고 싶어요',
    detail: '주변에 도움이 필요한 청년이 있거나 관련 활동에 관심 있어요',
  },
];

function HeaderLogoP3() {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: 0,
      fontWeight: 800, fontSize: 22, letterSpacing: '-0.03em', color: 'var(--brand-700)',
    }}>
      <span>나와,&nbsp;</span>
      <span style={{ color: 'var(--brand-500)' }}>나왕</span>
    </div>
  );
}

function RegionGrid({ value, onChange }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8,
    }}>
      {REGIONS.map((r) => {
        const active = value === r;
        return (
          <button
            key={r}
            type="button"
            onClick={() => onChange(r)}
            style={{
              height: 44, borderRadius: 10,
              border: `1px solid ${active ? 'var(--brand-500)' : 'var(--line)'}`,
              background: active ? 'var(--brand-50)' : '#fff',
              color: active ? 'var(--brand-500)' : 'var(--ink-700)',
              fontSize: 13, fontWeight: active ? 700 : 500,
              letterSpacing: '-0.01em',
              transition: 'all .12s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = 'var(--ink-400)'; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = 'var(--line)'; }}
          >
            {r}
          </button>
        );
      })}
    </div>
  );
}

function PersonaCard({ p, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: 'relative', textAlign: 'left',
        padding: '20px 18px',
        borderRadius: 14,
        border: `1.5px solid ${active ? 'var(--brand-500)' : 'var(--line)'}`,
        background: active ? 'var(--brand-50)' : '#fff',
        cursor: 'pointer', transition: 'all .14s ease',
        boxShadow: active ? '0 0 0 4px rgba(22,85,194,0.08)' : 'none',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = 'var(--ink-400)'; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = 'var(--line)'; }}
    >
      {/* Selected check */}
      {active && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          width: 22, height: 22, borderRadius: '50%',
          background: 'var(--brand-500)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <SIcon.Check width={12} height={12} />
        </div>
      )}

      <div style={{ fontSize: 36, lineHeight: 1, marginBottom: 10 }}>{p.emoji}</div>
      <div style={{
        fontSize: 16, fontWeight: 800,
        color: active ? 'var(--brand-500)' : 'var(--ink-900)',
        letterSpacing: '-0.02em',
      }}>{p.title}</div>
      <div style={{
        fontSize: 13, fontWeight: 600, color: 'var(--ink-700)',
        marginTop: 2,
      }}>{p.desc}</div>
      <div style={{
        fontSize: 12, color: 'var(--ink-500)', lineHeight: 1.55,
        marginTop: 4,
      }}>{p.detail}</div>
    </button>
  );
}

export default function SignupInfoStep3() {
  const provider = useMemoP3(() => {
    if (typeof window === 'undefined') return 'google';
    const u = new URLSearchParams(window.location.search);
    return u.get('p') === 'kakao' ? 'kakao' : 'google';
  }, []);

  const [region, setRegion] = useStateP3('');
  const [persona, setPersona] = useStateP3('');

  const canSubmit = region && persona;

  return (
    <div className="page-bg">
      {/* Top bar */}
      <header style={{
        borderBottom: '1px solid var(--line-2)', background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(8px)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{
          maxWidth: 1240, margin: '0 auto', padding: '0 32px',
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <HeaderLogoP3 />
          <div style={{
            fontSize: 12, color: 'var(--ink-500)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            이미 계정이 있으신가요?
            <a href="#" style={{ color: 'var(--brand-500)', fontWeight: 700 }}>로그인</a>
          </div>
        </div>
      </header>

      {/* Main card */}
      <main style={{
        maxWidth: 620, margin: '0 auto', padding: '48px 24px 80px',
      }}>
        {/* Progress (step 3 of 4) */}
        <ProgressBar steps={['약관 동의','정보 입력','맞춤 설정','가입 완료']} current={3} />

        {/* Card */}
        <section style={{
          marginTop: 36,
          background: '#fff',
          border: '1px solid var(--line)',
          borderRadius: 18,
          padding: '40px 40px 32px',
          boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 12px 40px rgba(15,23,42,0.04)',
        }}>
          <h1 style={{
            margin: '0 0 8px', fontSize: 26, fontWeight: 800,
            color: 'var(--ink-900)', letterSpacing: '-0.025em', lineHeight: 1.35,
          }}>
            <span style={{ color: 'var(--brand-500)' }}>딱 맞는 사업</span>을<br />
            추천해 드릴게요
          </h1>
          <p style={{
            margin: 0, fontSize: 13, color: 'var(--ink-500)', lineHeight: 1.65,
          }}>
            거주 지역과 본인 유형을 알려주시면 더 정확한 정보를 보여드려요.<br />
            가입 후 마이페이지에서 언제든 변경할 수 있어요.
          </p>

          <div style={{ height: 1, background: 'var(--line-2)', margin: '28px 0' }} />

          {/* Region */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <Label required>사는 지역</Label>
              {region && (
                <span style={{
                  fontSize: 12, fontWeight: 700, color: 'var(--brand-500)',
                }}>
                  {region} 선택됨
                </span>
              )}
            </div>
            <RegionGrid value={region} onChange={setRegion} />
            <HelperText>현재 거주하시는 지역을 선택해주세요. 해당 지역의 사업이 우선 노출돼요.</HelperText>
          </div>

          {/* Persona */}
          <div style={{ marginBottom: 8 }}>
            <Label required>본인 유형 선택</Label>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
              marginTop: 4,
            }}>
              {PERSONAS.map((p) => (
                <PersonaCard
                  key={p.id}
                  p={p}
                  active={persona === p.id}
                  onClick={() => setPersona(p.id)}
                />
              ))}
            </div>
            <HelperText>유형에 따라 안내되는 프로그램과 콘텐츠가 달라져요.</HelperText>
          </div>

          {/* Privacy notice */}
          <div style={{
            marginTop: 24, padding: '14px 16px',
            background: 'var(--brand-50)', borderRadius: 10,
            display: 'flex', gap: 10, fontSize: 12, color: 'var(--ink-700)', lineHeight: 1.6,
          }}>
            <span style={{ color: 'var(--brand-500)', flexShrink: 0, marginTop: 1 }}>
              <SIcon.Info width={14} height={14} />
            </span>
            <span>
              선택한 정보는 <strong style={{ color: 'var(--ink-900)' }}>맞춤 사업 추천</strong>에만 사용되며,
              다른 사용자에게 공개되지 않아요.
            </span>
          </div>

          {/* Buttons */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10,
            marginTop: 28,
          }}>
            <a
              href="signup-info.html"
              style={{
                height: 54, borderRadius: 12,
                border: '1px solid var(--line)', background: '#fff',
                color: 'var(--ink-700)', fontSize: 15, fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-soft)'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              <SIcon.ChevronL width={16} height={16} />
              이전
            </a>
            <button
              disabled={!canSubmit}
              style={{
                height: 54, borderRadius: 12, border: 'none',
                background: canSubmit ? 'var(--brand-500)' : '#dfe2ea',
                color: canSubmit ? '#fff' : 'var(--ink-400)',
                fontSize: 15, fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                transition: 'background .15s ease',
              }}
            >
              회원가입 완료
              <SIcon.Check width={18} height={18} />
            </button>
          </div>

          {!canSubmit && (
            <div style={{
              marginTop: 14, fontSize: 12, color: 'var(--ink-500)', textAlign: 'center',
            }}>
              {!region && '거주 지역을 선택해주세요. '}
              {!persona && '본인 유형을 선택해주세요.'}
            </div>
          )}
        </section>

        <p style={{
          textAlign: 'center', marginTop: 24, marginBottom: 0,
          fontSize: 11, color: 'var(--ink-400)', lineHeight: 1.6,
        }}>
          본 화면은 디자인 목업으로 실제 가입과 무관합니다
        </p>
      </main>
    </div>
  );
}
