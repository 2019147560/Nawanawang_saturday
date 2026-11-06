'use client';

import { I } from './icons';

// 대시보드 공통 스타일. 좁은 화면(720px 이하)에서는 1열, 표는 카드형으로 바뀝니다.
export const BOARD_CSS = `
.ab-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:start}
@media (max-width:900px){.ab-grid{grid-template-columns:minmax(0,1fr)}}
.ab-panel{background:#fff;border:1px solid var(--line);border-radius:16px;min-width:0}
.ab-head{width:100%;display:flex;align-items:center;gap:12px;padding:16px 18px;background:none;border:0;text-align:left;font-family:inherit;color:var(--ink-900);border-radius:16px;min-height:64px}
.ab-head:hover{background:var(--bg-soft)}
.ab-head:focus-visible{outline:2px solid var(--brand-500);outline-offset:-2px}
.ab-icon{flex:0 0 40px;height:40px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center}
.ab-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.ab-body{padding:4px 18px 18px;border-top:1px solid var(--line-2)}
.ab-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:40px;padding:0 14px;border-radius:10px;border:1px solid var(--line);background:#fff;color:var(--ink-700);font-size:13px;font-weight:700;font-family:inherit}
.ab-btn:hover{border-color:var(--brand-400);color:var(--brand-600)}
.ab-btn.primary{background:var(--brand-600);border-color:var(--brand-600);color:#fff}
.ab-iconbtn{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;border:1px solid var(--line);background:#fff;color:var(--ink-600);flex:0 0 40px}
.ab-iconbtn:hover{color:var(--danger-500);border-color:var(--danger-500)}
.ab-tabs{display:flex;gap:6px;flex-wrap:wrap;margin:14px 0 10px}
.ab-tab{min-height:36px;padding:0 12px;border-radius:999px;border:1px solid var(--line);background:#fff;font-size:13px;font-weight:600;color:var(--ink-600);font-family:inherit;display:inline-flex;align-items:center;gap:6px}
.ab-tab[aria-pressed="true"]{background:var(--brand-600);border-color:var(--brand-600);color:#fff}
.ab-table{width:100%;border-collapse:collapse;font-size:13px}
.ab-table th{padding:10px 8px;text-align:left;font-weight:600;color:var(--ink-500);border-bottom:1px solid var(--line);white-space:nowrap}
.ab-table td{padding:10px 8px;border-bottom:1px solid var(--line-2);vertical-align:middle}
.ab-cards{display:none}
@media (max-width:720px){.ab-table-wrap{display:none}.ab-cards{display:flex;flex-direction:column;gap:8px}}
.ab-card{border:1px solid var(--line-2);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:6px;font-size:13px}
.ab-ed{display:flex;flex-direction:column;gap:8px;margin-top:12px}
.ab-ed-head,.ab-ed-row{display:grid;grid-template-columns:var(--cols);gap:8px;align-items:center}
.ab-ed-head{font-size:12px;font-weight:600;color:var(--ink-500);padding:0 2px}
.ab-ed-row{padding:8px;border:1px solid var(--line-2);border-radius:12px;background:var(--bg-soft)}
.ab-ed-label{display:none;font-size:11px;font-weight:600;color:var(--ink-500);margin-bottom:4px}
.ab-ed input,.ab-ed select,.ab-ed textarea,.ab-form input,.ab-form select,.ab-form textarea{width:100%;min-height:40px;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:#fff;font-size:14px;font-family:inherit;color:var(--ink-900);box-sizing:border-box}
.ab-ed textarea,.ab-form textarea{min-height:64px;resize:vertical}
.ab-ed input:focus,.ab-ed select:focus,.ab-ed textarea:focus,.ab-form input:focus,.ab-form select:focus,.ab-form textarea:focus{outline:2px solid var(--brand-400);outline-offset:0;border-color:var(--brand-400)}
@media (max-width:720px){
  .ab-ed-head{display:none}
  .ab-ed-row{grid-template-columns:1fr 1fr}
  .ab-ed-cell.wide{grid-column:1 / -1}
  .ab-ed-cell.del{grid-column:1 / -1;justify-self:end}
  .ab-ed-label{display:block}
  .ab-ed input,.ab-ed select,.ab-ed textarea,.ab-form input,.ab-form select,.ab-form textarea{font-size:16px}
}
.ab-sum{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:10px}
@media (max-width:1100px){.ab-sum{grid-template-columns:repeat(4,minmax(0,1fr))}}
.ab-sum-tile{display:flex;flex-direction:column;align-items:flex-start;gap:4px;padding:12px;border-radius:14px;border:1px solid var(--line);background:#fff;font-family:inherit;text-align:left;min-width:0;color:var(--ink-900)}
.ab-sum-tile:hover{border-color:var(--brand-400)}
.ab-sum-tile:focus-visible{outline:2px solid var(--brand-500);outline-offset:2px}
.ab-sum-top{display:flex;align-items:center;gap:6px;min-width:0;width:100%}
.ab-sum-icon{flex:0 0 28px;height:28px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center}
.ab-sum-label{font-size:12px;font-weight:600;color:var(--ink-600);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ab-sum-value{font-size:20px;font-weight:800;line-height:1.15;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}
.ab-sum-note{font-size:11px;color:var(--ink-500);white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}
.ab-hide-sm{}
@media (max-width:720px){
  .ab-sum{gap:6px}
  .ab-sum-tile{padding:8px;gap:2px;border-radius:12px;align-items:center;text-align:center}
  .ab-sum-top{flex-direction:column;gap:2px}
  .ab-sum-icon{flex-basis:26px;width:26px;height:26px}
  .ab-sum-label{font-size:11px;max-width:100%}
  .ab-sum-value{font-size:16px}
  .ab-sum-note{font-size:10px;color:var(--ink-600)}
  .ab-hide-sm{display:none !important}
  .ab-head{padding:12px 12px;gap:10px;min-height:56px}
  .ab-icon{flex-basis:34px;width:34px;height:34px;border-radius:10px}
  .ab-head-title{font-size:14px !important}
  .ab-chips{gap:4px;margin-top:4px}
  .ab-body{padding:4px 12px 14px}
  .ab-grid{gap:10px}
}
.ab-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
`;

const TONES = {
  good: { color: 'var(--success-700)', background: 'var(--success-50)' },
  warn: { color: 'var(--warn-700)', background: 'var(--warn-50)' },
  bad: { color: '#a61b1b', background: 'var(--danger-50)' },
  info: { color: 'var(--brand-600)', background: 'var(--brand-50)' },
  mute: { color: 'var(--ink-600)', background: 'var(--line-2)' },
};

export function Chip({ tone = 'mute', icon, children }) {
  const t = TONES[tone] || TONES.mute;
  return (
    <span style={{ ...t, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 999, whiteSpace: 'nowrap' }}>
      {icon}
      {children}
    </span>
  );
}

export function SaveStatus({ state, updatedBy, seeded }) {
  const map = {
    pending: ['변경됨', 'mute'],
    saving: ['저장 중…', 'info'],
    saved: ['저장됨', 'good'],
    error: ['저장 실패', 'bad'],
    conflict: ['다른 사람이 먼저 수정해서 최신 내용으로 바꿨어요', 'warn'],
  };
  const [text, tone] = map[state] || (seeded ? ['예시 데이터 · 편집하면 저장돼요', 'warn'] : [updatedBy ? `마지막 수정: ${updatedBy}` : '', 'mute']);
  if (!text) return null;
  return <span role="status" aria-live="polite"><Chip tone={tone}>{text}</Chip></span>;
}

export function Panel({ id, icon, color, title, chips, open, onToggle, children }) {
  return (
    <section id={`panel-${id}`} className="ab-panel" aria-labelledby={`${id}-title`} style={{ scrollMarginTop: 12 }}>
      <h2 style={{ margin: 0 }}>
        <button type="button" className="ab-head" aria-expanded={open} aria-controls={`${id}-body`} onClick={onToggle}>
          <span className="ab-icon" style={{ background: color.bg, color: color.fg }}>{icon}</span>
          <span style={{ flex: '1 1 auto', minWidth: 0 }}>
            <span id={`${id}-title`} className="ab-head-title" style={{ display: 'block', fontSize: 15, fontWeight: 700 }}>{title}</span>
            <span className="ab-chips">{chips}</span>
          </span>
          <span style={{ color: 'var(--ink-400)', display: 'inline-flex', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>
            <I.Chevron size={20} />
          </span>
        </button>
      </h2>
      {open && (
        <div id={`${id}-body`} className="ab-body">
          {children}
        </div>
      )}
    </section>
  );
}

export function Toolbar({ children }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 14 }}>{children}</div>;
}

export function EditToggle({ editing, onClick }) {
  return (
    <button type="button" className={`ab-btn${editing ? ' primary' : ''}`} onClick={onClick}>
      {editing ? <I.Check size={16} /> : <I.Edit size={16} />}
      {editing ? '편집 완료' : '편집'}
    </button>
  );
}

// 편집 가능한 표. 넓은 화면에서는 표처럼, 좁은 화면에서는 카드형(라벨 + 입력)으로 보입니다.
// fields: [{ key, label, type: 'text'|'url'|'date'|'select'|'textarea', options, col, wide, placeholder }]
export function EditableList({ fields, items, onChange, newItem, addLabel = '행 추가' }) {
  const cols = `${fields.map((f) => f.col || '1fr').join(' ')} 40px`;
  const update = (rowId, key, value) => onChange((list) => list.map((it) => (it.id === rowId ? { ...it, [key]: value } : it)));
  const remove = (rowId) => onChange((list) => list.filter((it) => it.id !== rowId));
  const add = () => onChange((list) => [...list, newItem()]);

  return (
    <div className="ab-ed" style={{ '--cols': cols }}>
      <div className="ab-ed-head" aria-hidden="true">
        {fields.map((f) => <div key={f.key}>{f.label}</div>)}
        <div />
      </div>
      {items.map((it, rowIdx) => (
        <div key={it.id} className="ab-ed-row">
          {fields.map((f) => {
            const inputId = `${it.id}-${f.key}`;
            const common = {
              id: inputId,
              value: it[f.key] ?? '',
              onChange: (e) => update(it.id, f.key, e.target.value),
              'aria-label': `${rowIdx + 1}번째 ${f.label}`,
            };
            return (
              <div key={f.key} className={`ab-ed-cell${f.wide ? ' wide' : ''}`} style={{ minWidth: 0 }}>
                <label className="ab-ed-label" htmlFor={inputId}>{f.label}</label>
                {f.type === 'select' ? (
                  <select {...common}>
                    {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea {...common} placeholder={f.placeholder} />
                ) : (
                  <input {...common} type={f.type === 'date' ? 'date' : f.type === 'url' ? 'url' : 'text'} placeholder={f.placeholder} />
                )}
              </div>
            );
          })}
          <div className="ab-ed-cell del">
            <button type="button" className="ab-iconbtn" aria-label={`${rowIdx + 1}번째 행 삭제`} onClick={() => remove(it.id)}>
              <I.Trash size={16} />
            </button>
          </div>
        </div>
      ))}
      <div>
        <button type="button" className="ab-btn" onClick={add}><I.Plus size={16} />{addLabel}</button>
      </div>
    </div>
  );
}

export function Empty({ children }) {
  return <p style={{ margin: '14px 0 0', padding: 16, borderRadius: 12, background: 'var(--bg-soft)', fontSize: 13, color: 'var(--ink-600)', textAlign: 'center' }}>{children}</p>;
}

export function ExtLink({ href, children }) {
  if (!href) return <span>{children}</span>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-500)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, wordBreak: 'break-all' }}>
      {children}
      <I.External size={13} />
    </a>
  );
}
