/* Signup info collection page */
'use client';

import { useMemo, useState as useStateApp } from 'react';
import { SIcon } from './signup-info-icons';
import {
  HelperText,
  InlineBtn,
  Label,
  ProgressBar,
  TextInput,
  fmtTime,
  formatPhone,
  isValidEmail,
  useCountdown,
} from './signup-info-fields';

const STEPS = ['약관 동의', '정보 입력', '가입 완료'];

function SocialBadge({ provider }) {
  if (provider === 'google') {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 12px 6px 8px',
        background: '#fff', border: '1px solid var(--line)',
        borderRadius: 999, fontSize: 12, fontWeight: 600, color: 'var(--ink-700)',
      }}>
        <svg width="16" height="16" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.836.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
        </svg>
        구글 계정으로 가입중
      </div>
    );
  }
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '6px 12px 6px 8px',
      background: '#FEE500', border: '1px solid #f0d800',
      borderRadius: 999, fontSize: 12, fontWeight: 700, color: '#191600',
    }}>
      <svg width="16" height="16" viewBox="0 0 18 18">
        <path fill="#191600" d="M9 1.5C4.581 1.5 1 4.276 1 7.7c0 2.227 1.508 4.18 3.78 5.282-.166.6-.6 2.176-.687 2.514-.108.42.155.414.326.301.135-.089 2.143-1.45 3.013-2.04.5.07 1.02.107 1.568.107 4.418 0 8-2.776 8-6.2C17 4.276 13.418 1.5 9 1.5z"/>
      </svg>
      카카오 계정으로 가입중
    </div>
  );
}

function HeaderLogo() {
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

export default function SignupInfoPage() {
  // Mock: which provider sent us here (toggle in URL: ?p=kakao)
  const provider = useMemo(() => {
    if (typeof window === 'undefined') return 'google';
    const u = new URLSearchParams(window.location.search);
    return u.get('p') === 'kakao' ? 'kakao' : 'google';
  }, []);

  // Form state
  const [nickname, setNickname] = useStateApp('');
  const [nicknameStatus, setNicknameStatus] = useStateApp(null); // 'available' | 'taken' | null
  const [checkingNick, setCheckingNick] = useStateApp(false);

  const [email, setEmail] = useStateApp('');
  const [emailSent, setEmailSent] = useStateApp(false);
  const [emailVerified, setEmailVerified] = useStateApp(false);
  const [code, setCode] = useStateApp('');
  const [codeError, setCodeError] = useStateApp(false);

  const [phone, setPhone] = useStateApp('');

  const timer = useCountdown(180); // 3:00

  /* ----- handlers ----- */
  const checkNickname = () => {
    if (nickname.trim().length < 2) return;
    setCheckingNick(true);
    setTimeout(() => {
      // mock: anything containing "test" is taken
      setNicknameStatus(nickname.toLowerCase().includes('test') ? 'taken' : 'available');
      setCheckingNick(false);
    }, 500);
  };

  const sendCode = () => {
    if (!isValidEmail(email)) return;
    setEmailSent(true);
    setEmailVerified(false);
    setCode('');
    setCodeError(false);
    timer.start(180);
  };

  const verifyCode = () => {
    // mock: accept any 6-digit code
    if (code.length === 6) {
      setEmailVerified(true);
      setCodeError(false);
      timer.reset();
    } else {
      setCodeError(true);
    }
  };

  const phoneOk = phone.replace(/\D/g, '').length >= 10;
  const nickOk = nicknameStatus === 'available';
  const canSubmit = nickOk && emailVerified && phoneOk;

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
          <HeaderLogo />
          <div style={{
            fontSize: 12, color: 'var(--ink-500)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            이미 계정이 있으신가요?
            <a href="#" style={{
              color: 'var(--brand-500)', fontWeight: 700,
            }}>로그인</a>
          </div>
        </div>
      </header>

      {/* Main card */}
      <main style={{
        maxWidth: 560, margin: '0 auto', padding: '48px 24px 80px',
      }}>
        {/* Progress */}
        <ProgressBar steps={STEPS} current={2} />

        {/* Card */}
        <section style={{
          marginTop: 36,
          background: '#fff',
          border: '1px solid var(--line)',
          borderRadius: 18,
          padding: '40px 40px 32px',
          boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 12px 40px rgba(15,23,42,0.04)',
        }}>
          {/* Heading */}
          <div style={{ marginBottom: 8 }}>
            <SocialBadge provider={provider} />
          </div>

          <h1 style={{
            margin: '14px 0 8px', fontSize: 26, fontWeight: 800,
            color: 'var(--ink-900)', letterSpacing: '-0.025em', lineHeight: 1.35,
          }}>
            <span style={{ color: 'var(--brand-500)' }}>나와, 나왕</span>입니다.<br />
            당신을 위한 정보를 수집합니다.
          </h1>
          <p style={{
            margin: 0, fontSize: 13, color: 'var(--ink-500)', lineHeight: 1.65,
          }}>
            맞춤 지원사업을 안내해 드리기 위해 아래 정보가 필요해요.<br />
            입력하신 내용은 안전하게 보호됩니다.
          </p>

          <div style={{ height: 1, background: 'var(--line-2)', margin: '28px 0' }} />

          {/* Field: Nickname */}
          <div style={{ marginBottom: 22 }}>
            <Label htmlFor="nickname" required>닉네임</Label>
            <TextInput
              id="nickname"
              value={nickname}
              onChange={(v) => { setNickname(v); setNicknameStatus(null); }}
              placeholder="2~12자 / 한글, 영문, 숫자"
              maxLength={12}
              leftIcon={<SIcon.User width={16} height={16} />}
              status={nicknameStatus === 'taken' ? 'error' : nicknameStatus === 'available' ? 'success' : undefined}
              suffix={
                <InlineBtn
                  variant="outline"
                  onClick={checkNickname}
                  disabled={nickname.trim().length < 2 || checkingNick}
                >
                  {checkingNick ? '확인 중…' : '중복확인'}
                </InlineBtn>
              }
            />
            {nicknameStatus === 'available' && (
              <HelperText tone="success">
                <SIcon.Check width={12} height={12} /> 사용할 수 있는 닉네임이에요
              </HelperText>
            )}
            {nicknameStatus === 'taken' && (
              <HelperText tone="error">
                <SIcon.X width={12} height={12} /> 이미 사용 중인 닉네임이에요
              </HelperText>
            )}
            {nicknameStatus === null && (
              <HelperText>다른 사용자에게 보여지는 이름이에요. 가입 후에도 변경할 수 있어요.</HelperText>
            )}
          </div>

          {/* Field: Email */}
          <div style={{ marginBottom: 22 }}>
            <Label htmlFor="email" required>이메일</Label>
            <TextInput
              id="email"
              type="email"
              value={email}
              onChange={(v) => { setEmail(v); if (emailVerified) setEmailVerified(false); }}
              placeholder="example@email.com"
              autoComplete="email"
              leftIcon={<SIcon.Mail width={16} height={16} />}
              disabled={emailVerified}
              status={emailVerified ? 'success' : undefined}
              suffix={
                <InlineBtn
                  variant="outline"
                  onClick={sendCode}
                  disabled={!isValidEmail(email) || emailVerified}
                >
                  {emailSent && !emailVerified ? '재발송' : '인증번호 발송'}
                </InlineBtn>
              }
            />

            {/* Code input row appears after sending */}
            {emailSent && !emailVerified && (
              <div style={{ marginTop: 10 }}>
                <TextInput
                  value={code}
                  onChange={(v) => { setCode(v.replace(/\D/g, '').slice(0, 6)); setCodeError(false); }}
                  placeholder="인증번호 6자리"
                  status={codeError ? 'error' : undefined}
                  suffix={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 4 }}>
                      <span style={{
                        fontSize: 13, fontWeight: 700,
                        color: timer.seconds < 30 ? 'var(--danger-500)' : 'var(--brand-500)',
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        {fmtTime(timer.seconds)}
                      </span>
                      <InlineBtn
                        variant="primary"
                        onClick={verifyCode}
                        disabled={code.length !== 6 || timer.seconds === 0}
                      >
                        인증하기
                      </InlineBtn>
                    </div>
                  }
                />
                {codeError && (
                  <HelperText tone="error">
                    <SIcon.X width={12} height={12} /> 인증번호가 일치하지 않아요. 다시 확인해주세요.
                  </HelperText>
                )}
                {!codeError && timer.seconds === 0 && (
                  <HelperText tone="error">
                    인증 시간이 만료되었어요. 재발송 버튼을 눌러주세요.
                  </HelperText>
                )}
                {!codeError && timer.seconds > 0 && (
                  <HelperText>
                    이메일로 받은 6자리 인증번호를 입력해주세요. ({fmtTime(timer.seconds)} 남음)
                  </HelperText>
                )}
              </div>
            )}

            {emailVerified && (
              <HelperText tone="success">
                <SIcon.Check width={12} height={12} /> 이메일 인증이 완료되었어요
              </HelperText>
            )}
            {!emailSent && (
              <HelperText>지원사업 알림과 본인 확인을 위해 사용돼요.</HelperText>
            )}
          </div>

          {/* Field: Phone */}
          <div style={{ marginBottom: 8 }}>
            <Label htmlFor="phone" required>연락처</Label>
            <TextInput
              id="phone"
              type="tel"
              value={phone}
              onChange={(v) => setPhone(formatPhone(v))}
              placeholder="010-0000-0000"
              autoComplete="tel"
              leftIcon={<SIcon.Phone width={16} height={16} />}
            />
            <HelperText>긴급 안내 외에는 연락드리지 않아요. 마케팅에는 사용되지 않습니다.</HelperText>
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
              수집된 정보는 <strong style={{ color: 'var(--ink-900)' }}>회원 식별과 맞춤 사업 추천</strong>에만 사용되며,
              관련 법령에 따라 안전하게 관리돼요.
            </span>
          </div>

          {/* Buttons */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10,
            marginTop: 28,
          }}>
            <button style={{
              height: 54, borderRadius: 12,
              border: '1px solid var(--line)', background: '#fff',
              color: 'var(--ink-700)', fontSize: 15, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-soft)'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              <SIcon.ChevronL width={16} height={16} />
              이전
            </button>
            <button
              disabled={!canSubmit}
              style={{
                height: 54, borderRadius: 12, border: 'none',
                background: canSubmit ? 'var(--brand-500)' : '#dfe2ea',
                color: canSubmit ? '#fff' : 'var(--ink-400)',
                fontSize: 15, fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                transition: 'background .15s ease',
              }}
            >
              다음
              <SIcon.ChevronR width={16} height={16} />
            </button>
          </div>

          {/* Required-field hint */}
          {!canSubmit && (
            <div style={{
              marginTop: 14, fontSize: 12, color: 'var(--ink-500)', textAlign: 'center',
            }}>
              {!nickOk && '닉네임 중복확인이 필요해요. '}
              {!emailVerified && '이메일 인증이 필요해요. '}
              {!phoneOk && '연락처를 입력해주세요.'}
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
