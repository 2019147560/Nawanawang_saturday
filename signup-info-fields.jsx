/* Field components for signup info page */
import { useEffect, useRef, useState } from 'react';
import { SIcon } from './signup-info-icons';

function Label({ children, required, htmlFor }) {
  return (
    <label htmlFor={htmlFor} style={{
      display: 'block', fontSize: 13, fontWeight: 600,
      color: 'var(--ink-700)', marginBottom: 8, letterSpacing: '-0.01em',
    }}>
      {children}
      {required && <span style={{ color: 'var(--brand-500)', marginLeft: 4 }}>*</span>}
    </label>
  );
}

function HelperText({ tone = 'muted', children }) {
  const colors = {
    muted: 'var(--ink-500)',
    error: 'var(--danger-500)',
    success: 'var(--success-700)',
  };
  return (
    <div style={{
      marginTop: 6, fontSize: 12, color: colors[tone],
      lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: 4,
    }}>
      {children}
    </div>
  );
}

function TextInput({ id, value, onChange, placeholder, type = 'text', maxLength, suffix, status, leftIcon, autoComplete, onBlur, disabled }) {
  const [focused, setFocused] = useState(false);
  let borderColor = 'var(--line)';
  if (status === 'error') borderColor = 'var(--danger-500)';
  else if (status === 'success') borderColor = 'var(--success-700)';
  else if (focused) borderColor = 'var(--brand-500)';

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      height: 52, border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-input)',
      background: disabled ? 'var(--bg-soft)' : '#fff',
      transition: 'border-color .15s ease, box-shadow .15s ease',
      boxShadow: focused ? '0 0 0 3px rgba(22,85,194,0.10)' : 'none',
      paddingLeft: leftIcon ? 14 : 16,
      paddingRight: suffix ? 6 : 16,
      gap: 10,
    }}>
      {leftIcon && (
        <span style={{ color: 'var(--ink-400)', flexShrink: 0, display: 'flex' }}>
          {leftIcon}
        </span>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={(e) => { setFocused(false); onBlur && onBlur(e); }}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        disabled={disabled}
        style={{
          flex: 1, height: '100%', border: 'none', outline: 'none',
          background: 'transparent', fontSize: 15, color: 'var(--ink-900)',
          letterSpacing: '-0.01em', minWidth: 0,
        }}
      />
      {suffix}
    </div>
  );
}

/* Inline button used inside an input row */
function InlineBtn({ onClick, disabled, variant = 'primary', children }) {
  const styles = {
    primary: { bg: 'var(--ink-900)', fg: '#fff', border: 'none' },
    outline: { bg: '#fff', fg: 'var(--ink-900)', border: '1px solid var(--line)' },
    brand:   { bg: 'var(--brand-500)', fg: '#fff', border: 'none' },
  }[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        height: 40, padding: '0 14px',
        background: disabled ? '#dfe2ea' : styles.bg,
        color: disabled ? 'var(--ink-400)' : styles.fg,
        border: styles.border, borderRadius: 8,
        fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
}

function ProgressBar({ steps, current }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 14,
      }}>
        <div style={{ fontSize: 12, color: 'var(--ink-500)', fontWeight: 500 }}>
          STEP <span style={{ color: 'var(--brand-500)', fontWeight: 700 }}>{current}</span>
          <span style={{ color: 'var(--ink-300)', margin: '0 4px' }}>/</span>
          {steps.length}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-700)', fontWeight: 600 }}>
          {steps[current - 1]}
        </div>
      </div>

      {/* Segmented progress bar */}
      <div style={{ display: 'flex', gap: 6 }}>
        {steps.map((s, i) => {
          const idx = i + 1;
          const done = idx < current;
          const active = idx === current;
          return (
            <div key={s} style={{ flex: 1 }}>
              <div style={{
                height: 6, borderRadius: 999,
                background: (done || active) ? 'var(--brand-500)' : 'var(--line)',
                transition: 'background .25s ease',
              }} />
              <div style={{
                marginTop: 8, fontSize: 11,
                color: active ? 'var(--brand-500)' : done ? 'var(--ink-700)' : 'var(--ink-400)',
                fontWeight: active ? 700 : 500,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                {done && (
                  <span style={{
                    width: 14, height: 14, borderRadius: '50%',
                    background: 'var(--brand-500)', color: '#fff',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <SIcon.Check width={9} height={9} />
                  </span>
                )}
                <span>{s}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Verification timer countdown hook */
function useCountdown(initialSeconds) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(ref.current); setRunning(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [running]);

  const start = (sec = initialSeconds) => { setSeconds(sec); setRunning(true); };
  const reset = () => { setSeconds(initialSeconds); setRunning(false); };
  return { seconds, running, start, reset };
}

function fmtTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const ss = (s % 60).toString().padStart(2, '0');
  return `${m}:${ss}`;
}

/* Korean phone formatter: 010-0000-0000 */
function formatPhone(raw) {
  const d = raw.replace(/\D/g, '').slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export { Label, HelperText, TextInput, InlineBtn, ProgressBar, useCountdown, fmtTime, formatPhone, isValidEmail };
