'use client';

import { useCallback, useEffect, useState } from 'react';
import { I } from './icons';
import { LINK_CATEGORIES, MOODS } from './seeds';
import { Chip, EditableList, Empty, ExtLink, SaveStatus } from './ui';
import { daysSince, newId, todayKST } from './use-board';

const fmt = (n) => Math.round(n).toLocaleString('ko-KR');
const shortDate = (d) => (d ? `${Number(d.slice(5, 7))}/${Number(d.slice(8, 10))}` : '');

const TONE_COLOR = {
  good: 'var(--success-700)',
  warn: 'var(--warn-700)',
  bad: '#a61b1b',
  ink: 'var(--ink-900)',
};

/* ---------- 공통 박스 ---------- */

export function Box({ id, icon, title, metric, editing, onEdit, onAdd, addLabel, saveState, entry, wide, children }) {
  return (
    <section id={`box-${id}`} className={`ab-box${wide ? ' wide' : ''}`} aria-labelledby={`${id}-title`}>
      <div className="ab-box-head">
        <span className="ab-box-icon" aria-hidden="true">{icon}</span>
        <h2 id={`${id}-title`} className="ab-box-title">{title}</h2>
        {metric && (
          <span className="ab-box-metric" style={{ color: TONE_COLOR[metric.tone] || TONE_COLOR.ink }} aria-label={metric.label}>
            {metric.value}
          </span>
        )}
        {onAdd && (
          <button type="button" className="ab-round" aria-label={addLabel || '추가'} onClick={onAdd}>
            <I.PlusCircle size={22} />
          </button>
        )}
        {onEdit && (
          <button type="button" className={`ab-round${editing ? ' on' : ''}`} aria-label={editing ? '편집 완료' : '편집'} aria-pressed={editing} onClick={onEdit}>
            {editing ? <I.Check size={18} /> : <I.Edit size={18} />}
          </button>
        )}
      </div>
      {(editing || saveState === 'error' || saveState === 'conflict') && (
        <div style={{ marginTop: 2 }}><SaveStatus state={saveState} updatedBy={entry?.updatedBy} seeded={entry?.seeded} /></div>
      )}
      <div className="ab-box-body">{children}</div>
    </section>
  );
}

function useEdit(keys, flush) {
  const [editing, setEditing] = useState(false);
  const toggle = () => {
    if (editing) keys.forEach((k) => flush(k));
    setEditing((v) => !v);
  };
  return [editing, toggle, setEditing];
}

/* ---------- 다음 일정 ---------- */

export function ScheduleBox({ entry, saveState, setItems, flush }) {
  const [editing, toggle, setEditing] = useEdit(['schedule'], flush);
  const today = todayKST();
  const upcoming = [...entry.items]
    .filter((e) => e.date && e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  const add = () => {
    setItems('schedule', (list) => [...list, { id: newId(), date: today, title: '' }]);
    setEditing(true);
  };

  return (
    <Box id="schedule" icon={<I.Calendar size={18} />} title="다음 일정" wide editing={editing} onEdit={toggle} onAdd={add} addLabel="일정 추가" saveState={saveState} entry={entry}>
      {editing ? (
        <EditableList
          items={entry.items}
          onChange={(fn) => setItems('schedule', fn)}
          newItem={() => ({ id: newId(), date: today, title: '' })}
          addLabel="일정 추가"
          fields={[
            { key: 'date', label: '날짜', type: 'date', col: '160px' },
            { key: 'title', label: '일정', col: '1fr', wide: true },
          ]}
        />
      ) : upcoming.length === 0 ? (
        <Empty>다가오는 일정이 없어요. ⊕를 눌러 추가하세요.</Empty>
      ) : (
        <ol className="ab-timeline">
          {upcoming.map((e) => {
            const d = -daysSince(e.date);
            return (
              <li key={e.id} className="ab-tl-item">
                <span className="ab-tl-date">{shortDate(e.date)}</span>
                <span className="ab-tl-title">{e.title || '(제목 없음)'}</span>
                <Chip tone={d <= 3 ? 'bad' : d <= 7 ? 'warn' : 'mute'}>{d === 0 ? '오늘' : `D-${d}`}</Chip>
              </li>
            );
          })}
        </ol>
      )}
    </Box>
  );
}

/* ---------- 크롤링 사이트 (자동 점검) ---------- */

function StatusMark({ tone, label }) {
  const map = {
    good: [I.Check, 'var(--success-700)'],
    bad: [I.X, '#a61b1b'],
    warn: [I.Alert, 'var(--warn-700)'],
    wait: [I.Clock, 'var(--ink-400)'],
  };
  const [Icon, color] = map[tone] || map.wait;
  return <span style={{ color, display: 'inline-flex' }} role="img" aria-label={label}><Icon size={18} strokeWidth={2.6} /></span>;
}

// 서버에 사이트 목록을 보내 상태를 받아온다 (서버는 10분 캐시)
export function useCrawlStatus(sites) {
  const [state, setState] = useState({ loading: true, byId: {}, checkedAt: '', error: '', hasCreatedAt: false });
  const sig = JSON.stringify(sites.map((s) => [s.id, s.url, s.match]));

  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const res = await fetch('/api/admin/crawl-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sites: sites.map(({ id, url, match }) => ({ id, url, match })) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `점검 실패 (${res.status})`);
      setState({
        loading: false,
        byId: Object.fromEntries((data.results || []).map((r) => [r.id, r])),
        checkedAt: data.checkedAt,
        error: data.dbError ? `사업 데이터 조회 실패: ${data.dbError}` : '',
        hasCreatedAt: data.hasCreatedAt,
      });
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: e.message }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);

  useEffect(() => {
    const t = setTimeout(run, 400);
    return () => clearTimeout(t);
  }, [run]);

  return { ...state, run };
}

export function CrawlBox({ entry, saveState, setItems, flush }) {
  const [editing, toggle] = useEdit(['crawl_sites'], flush);
  const status = useCrawlStatus(editing ? [] : entry.items);
  const rows = entry.items.map((s) => ({ ...s, st: status.byId[s.id] }));
  const checked = rows.filter((r) => r.st);
  const good = checked.filter((r) => r.st.tone === 'good').length;
  const tone = !checked.length ? 'ink' : good === rows.length ? 'good' : checked.some((r) => r.st.tone === 'bad') ? 'bad' : 'warn';

  return (
    <Box
      id="crawl"
      icon={<I.Globe size={18} />}
      title="크롤링 사이트"
      metric={{ value: checked.length ? `${good}/${rows.length}` : '…', tone, label: `전체 ${rows.length}곳 중 ${good}곳 정상` }}
      editing={editing}
      onEdit={toggle}
      saveState={saveState}
      entry={entry}
    >
      {editing ? (
        <>
          <p className="ab-note">상태는 자동으로 점검해요. 여기서는 사이트 목록과, 사업 데이터의 기관명에서 찾을 키워드(쉼표로 구분)만 고치면 돼요.</p>
          <EditableList
            items={entry.items}
            onChange={(fn) => setItems('crawl_sites', fn)}
            newItem={() => ({ id: newId(), name: '', url: '', match: '' })}
            addLabel="사이트 추가"
            fields={[
              { key: 'name', label: '사이트', col: '1fr' },
              { key: 'url', label: '주소', type: 'url', col: '1.4fr', wide: true, placeholder: 'https://' },
              { key: 'match', label: '기관명 키워드', col: '1fr', wide: true, placeholder: '예: 니트생활자' },
            ]}
          />
        </>
      ) : rows.length === 0 ? (
        <Empty>등록된 사이트가 없어요.</Empty>
      ) : (
        <>
          <ul className="ab-crawl" aria-label="크롤링 사이트 목록">
            {rows.map((r) => {
              const st = r.st;
              const date = st?.lastUpdated || st?.latestDeadline;
              return (
                <li key={r.id} className="ab-crawl-row" title={st ? `${st.reason} · 사업 ${st.programs}건 · 사이트 ${st.live.code || '응답 없음'} ${st.live.ms}ms` : '점검 중'}>
                  <span className="ab-crawl-name">{r.url ? <ExtLink href={r.url}>{r.name || '(이름 없음)'}</ExtLink> : (r.name || '(이름 없음)')}</span>
                  <StatusMark tone={st ? st.tone : 'wait'} label={st ? st.reason : '점검 중'} />
                  <span className="ab-crawl-date">{st ? (date ? shortDate(date) : '·') : '…'}</span>
                  {st && st.tone !== 'good' && <span className="ab-crawl-reason">{st.reason}</span>}
                </li>
              );
            })}
          </ul>
          <div style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span className="ab-note" style={{ margin: 0 }}>
              {status.error ? <span style={{ color: '#a61b1b' }}>{status.error}</span> : (
                <>자동 점검{status.checkedAt && ` · ${new Date(status.checkedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`} · 날짜: {status.hasCreatedAt ? '최근 반영일' : '가장 늦은 마감일'}</>
              )}
            </span>
            <button type="button" className="ab-btn" onClick={status.run} disabled={status.loading}><I.Refresh size={15} />{status.loading ? '점검 중…' : '다시 점검'}</button>
          </div>
        </>
      )}
    </Box>
  );
}

/* ---------- 우선순위 ---------- */

const PRIO_STATUS = ['진행 중', '대기', '보류', '완료'];
const PRIO_TONE = { '진행 중': 'info', 대기: 'mute', 보류: 'warn', 완료: 'good' };

export function PriorityBox({ entry, saveState, setItems, flush }) {
  const [editing, toggle, setEditing] = useEdit(['priorities'], flush);
  const items = [...entry.items].sort((a, b) => (Number(a.rank) || 99) - (Number(b.rank) || 99));
  const active = items.filter((p) => p.status !== '완료');

  const add = () => {
    const next = String((Math.max(0, ...entry.items.map((p) => Number(p.rank) || 0)) || 0) + 1);
    setItems('priorities', (list) => [...list, { id: newId(), rank: next, title: '', status: '대기', subtasks: '', owner: '' }]);
    setEditing(true);
  };

  return (
    <Box id="priority" icon={<I.Flag size={18} />} title="우선순위" editing={editing} onEdit={toggle} onAdd={add} addLabel="우선순위 추가" saveState={saveState} entry={entry}>
      {editing ? (
        <EditableList
          items={entry.items}
          onChange={(fn) => setItems('priorities', fn)}
          newItem={() => ({ id: newId(), rank: String(entry.items.length + 1), title: '', status: '대기', subtasks: '', owner: '' })}
          addLabel="우선순위 추가"
          fields={[
            { key: 'rank', label: '순위', type: 'select', options: ['1', '2', '3', '4', '5', '6', '7', '8', '9'], col: '70px' },
            { key: 'title', label: '작업', col: '1fr' },
            { key: 'status', label: '상태', type: 'select', options: PRIO_STATUS, col: '100px' },
            { key: 'subtasks', label: '세부 작업 (한 줄에 하나)', type: 'textarea', col: '1.4fr', wide: true },
          ]}
        />
      ) : active.length === 0 ? (
        <Empty>진행할 작업이 없어요. ⊕를 눌러 추가하세요.</Empty>
      ) : (
        <div className="ab-prio">
          {active.map((p) => {
            const subs = String(p.subtasks || '').split('\n').map((s) => s.trim()).filter(Boolean);
            return (
              <div key={p.id} className="ab-prio-col">
                <span className="ab-prio-head">
                  <span className="ab-prio-rank" aria-label={`${p.rank}순위`}>{p.rank}</span>
                  <Chip tone={PRIO_TONE[p.status]}>{p.status}</Chip>
                </span>
                <span className="ab-prio-title">{p.title || '(이름 없음)'}</span>
                {subs.length > 0 && (
                  <ol className="ab-prio-subs">
                    {subs.map((s, i) => (
                      <li key={i}><span className="ab-prio-subno">{p.rank}-{i + 1}</span>{s}</li>
                    ))}
                  </ol>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Box>
  );
}

/* ---------- 링크 ---------- */

export function LinksBox({ links, contacts, saveState, setItems, flush }) {
  const [editing, toggle] = useEdit(['links', 'contacts'], flush);
  const groups = [...LINK_CATEGORIES.map((c) => [c, links.items.filter((l) => l.category === c)]), ['연락처', contacts.items]];

  return (
    <Box id="links" icon={<I.Link size={18} />} title="링크" editing={editing} onEdit={toggle} saveState={saveState.links} entry={links}>
      {editing ? (
        <>
          <EditableList
            items={links.items}
            onChange={(fn) => setItems('links', fn)}
            newItem={() => ({ id: newId(), category: '링크', title: '', url: '', note: '' })}
            addLabel="링크 추가"
            fields={[
              { key: 'category', label: '분류', type: 'select', options: LINK_CATEGORIES, col: '100px' },
              { key: 'title', label: '제목', col: '1fr' },
              { key: 'url', label: '링크', type: 'url', col: '1.2fr', wide: true, placeholder: 'https://' },
            ]}
          />
          <h3 style={{ margin: '16px 0 0', fontSize: 13, fontWeight: 700 }}>연락처</h3>
          <EditableList
            items={contacts.items}
            onChange={(fn) => setItems('contacts', fn)}
            newItem={() => ({ id: newId(), name: '', role: '', contact: '', note: '' })}
            addLabel="연락처 추가"
            fields={[
              { key: 'name', label: '이름', col: '1fr' },
              { key: 'role', label: '역할', col: '1fr' },
              { key: 'contact', label: '전화/메일', col: '1.3fr', wide: true },
            ]}
          />
        </>
      ) : (
        <dl className="ab-links">
          {groups.map(([cat, list]) => (
            <div key={cat} className="ab-links-row">
              <dt>{cat}</dt>
              <dd>
                {list.length === 0 ? <span style={{ color: 'var(--ink-400)' }}>—</span> : list.map((l) => (
                  <span key={l.id} className="ab-links-item">
                    {cat === '연락처' ? (
                      <>
                        <strong>{l.name}</strong>
                        {l.contact && (
                          <a href={l.contact.includes('@') ? `mailto:${l.contact}` : `tel:${l.contact.replace(/[^0-9+]/g, '')}`} style={{ color: 'var(--brand-500)', fontWeight: 600, marginLeft: 6, wordBreak: 'break-all' }}>{l.contact}</a>
                        )}
                      </>
                    ) : l.url ? <ExtLink href={l.url}>{l.title || l.url}</ExtLink> : <span>{l.title || '(제목 없음)'}</span>}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </Box>
  );
}

/* ---------- 응답 시간 ---------- */

const ENDPOINTS = [
  { name: '메인 페이지', path: '/' },
  { name: '지원사업 API', path: '/api/programs' },
  { name: '로그인', path: '/login' },
  { name: '사이트맵', path: '/sitemap.xml' },
];

function speed(ms) {
  if (ms < 600) return 'good';
  if (ms < 1500) return 'warn';
  return 'bad';
}

export function useHealth() {
  const [results, setResults] = useState([]);
  const [checking, setChecking] = useState(false);
  const [checkedAt, setCheckedAt] = useState('');

  const run = useCallback(async () => {
    setChecking(true);
    const out = await Promise.all(ENDPOINTS.map(async (ep) => {
      const t0 = performance.now();
      try {
        const res = await fetch(ep.path, { cache: 'no-store' });
        return { ...ep, ms: performance.now() - t0, ok: res.ok, status: res.status };
      } catch {
        return { ...ep, ms: performance.now() - t0, ok: false, status: 0 };
      }
    }));
    setResults(out);
    setCheckedAt(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
    setChecking(false);
  }, []);

  useEffect(() => { run(); }, [run]);
  return { results, checking, checkedAt, run };
}

export function HealthBox({ health }) {
  const { results, checking, checkedAt, run } = health;
  const errors = results.filter((r) => !r.ok).length;
  const shown = results.length ? results : ENDPOINTS.map((e) => ({ ...e, pending: true }));

  return (
    <Box
      id="health"
      icon={<I.Activity size={18} />}
      title="응답 시간"
      metric={results.length ? (errors ? { value: `에러 ${errors}`, tone: 'bad', label: `에러 ${errors}개` } : { value: '정상', tone: 'good', label: '에러 없음' }) : null}
    >
      <div className="ab-quad">
        {shown.map((r) => (
          <div key={r.path} className="ab-quad-cell">
            <span className="ab-quad-label">{r.name}</span>
            <span className="ab-quad-value" style={{ color: r.pending ? 'var(--ink-400)' : r.ok ? TONE_COLOR[speed(r.ms)] : TONE_COLOR.bad }}>
              {r.pending ? '…' : r.ok ? <>{fmt(r.ms)}<small>ms</small></> : '에러'}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: 'var(--ink-500)' }}>이 브라우저에서 측정{checkedAt && ` · ${checkedAt}`} · 초록 0.6초 미만</span>
        <button type="button" className="ab-btn" onClick={run} disabled={checking}><I.Refresh size={15} />{checking ? '측정 중…' : '다시 측정'}</button>
      </div>
    </Box>
  );
}

/* ---------- 우리들 ---------- */

const FACE_BG = ['#ffe3cf', '#dff3e4', '#e4ecff', '#fff1c2', '#f1e4ff', '#ffe0e6'];

function Face({ mood, index }) {
  const mouth = {
    최고: <path d="M14 27 Q24 38 34 27" fill="#3b2a1a" stroke="none" />,
    좋음: <path d="M15 28 Q24 35 33 28" />,
    보통: <line x1="16" y1="30" x2="32" y2="30" />,
    피곤: <path d="M17 31 Q24 28 31 31" />,
    힘듦: <path d="M15 33 Q24 25 33 33" />,
  }[mood] || <line x1="16" y1="30" x2="32" y2="30" />;
  const eyes = mood === '피곤'
    ? <><line x1="14" y1="19" x2="20" y2="19" /><line x1="28" y1="19" x2="34" y2="19" /></>
    : mood === '최고'
      ? <><path d="M14 20 Q17 16 20 20" /><path d="M28 20 Q31 16 34 20" /></>
      : <><circle cx="17" cy="19" r="2" fill="#3b2a1a" stroke="none" /><circle cx="31" cy="19" r="2" fill="#3b2a1a" stroke="none" /></>;
  return (
    <svg viewBox="0 0 48 48" width="38" height="38" role="img" aria-label={`기분 ${mood}`}>
      <circle cx="24" cy="24" r="22" fill={FACE_BG[index % FACE_BG.length]} stroke="#3b2a1a" strokeWidth="2.5" />
      <g stroke="#3b2a1a" strokeWidth="2.5" strokeLinecap="round" fill="none">{eyes}{mouth}</g>
    </svg>
  );
}

export function TeamBox({ team, motto, saveState, setItems, flush }) {
  const [editing, toggle] = useEdit(['team', 'motto'], flush);
  const scores = team.items.map((m) => Number(m.score)).filter((s) => s > 0);
  const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
  const mottoText = motto.items[0]?.text || '';

  return (
    <Box
      id="team"
      icon={<I.Users size={18} />}
      title="우리들"
      metric={avg !== null ? { value: `★ ${avg.toFixed(1)}`, tone: 'ink', label: `자체평가 평균 ${avg.toFixed(1)}점` } : null}
      editing={editing}
      onEdit={toggle}
      saveState={saveState.team}
      entry={team}
    >
      {editing ? (
        <>
          <EditableList
            items={team.items}
            onChange={(fn) => setItems('team', fn)}
            newItem={() => ({ id: newId(), name: '', mood: '좋음', score: '', comment: '' })}
            addLabel="멤버 추가"
            fields={[
              { key: 'name', label: '이름', col: '1fr' },
              { key: 'mood', label: '기분', type: 'select', options: MOODS, col: '90px' },
              { key: 'score', label: '자체평가', type: 'select', options: ['', '5.0', '4.5', '4.0', '3.5', '3.0', '2.5', '2.0', '1.5', '1.0'], col: '100px' },
              { key: 'comment', label: '한마디', col: '1.2fr', wide: true },
            ]}
          />
          <div className="ab-form" style={{ marginTop: 14 }}>
            <label htmlFor="motto-input" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-500)', marginBottom: 4 }}>팀 한마디</label>
            <input id="motto-input" value={mottoText} onChange={(e) => setItems('motto', [{ id: 'motto', text: e.target.value }])} />
          </div>
        </>
      ) : (
        <>
          {team.items.length === 0 ? <Empty>멤버를 추가해 주세요.</Empty> : (
            <ul className="ab-team">
              {team.items.map((m, i) => (
                <li key={m.id} className="ab-team-member" title={m.comment || undefined}>
                  <span className="ab-team-name">{m.name || '(이름)'}</span>
                  <Face mood={m.mood} index={i} />
                  <span className="ab-team-score">{m.score ? Number(m.score).toFixed(1) : '—'}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="ab-team-foot">
            {mottoText && <p className="ab-motto">“{mottoText}”</p>}
            <p className="ab-team-caption">숫자: 자체평가 (5점 만점)</p>
          </div>
        </>
      )}
    </Box>
  );
}

/* ---------- SEO (Search Console · 네이버 검색 API) ---------- */

export function useSeo(keywords) {
  const [state, setState] = useState({ loading: true, data: null, error: '' });
  const q = keywords.join('|');
  const run = useCallback(async (refresh = false) => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const res = await fetch(`/api/admin/seo?keywords=${encodeURIComponent(q)}${refresh ? '&refresh=1' : ''}`, { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `조회 실패 (${res.status})`);
      setState({ loading: false, data, error: '' });
    } catch (e) {
      setState({ loading: false, data: null, error: e.message });
    }
  }, [q]);
  useEffect(() => {
    const t = setTimeout(() => run(false), 600);
    return () => clearTimeout(t);
  }, [run]);
  return { ...state, run };
}

function rankText(n) {
  if (n === null || n === undefined) return null;
  return n < 10 ? n.toFixed(1).replace(/\.0$/, '') : String(Math.round(n));
}

export function SeoBox({ entry, saveState, setItems, flush }) {
  const [editing, toggle] = useEdit(['seo_keywords'], flush);
  const keywords = entry.items.map((k) => String(k.keyword || '').trim()).filter(Boolean);
  const main = keywords[0] || '';
  const seo = useSeo(editing ? [] : keywords);
  const d = seo.data;
  const g = d?.google;
  const n = d?.naver;
  const gKw = g?.keywords?.find((k) => k.keyword === main);
  const nKw = n?.keywords?.find((k) => k.keyword === main);
  const linked = d ? (d.config.google ? 1 : 0) + (d.config.naver ? 1 : 0) : 0;

  const cell = (label, value, unit, note) => (
    <div className="ab-quad-cell" title={note || undefined}>
      <span className="ab-quad-label">{label}</span>
      <span className="ab-quad-value" style={{ color: value === null ? 'var(--ink-400)' : undefined }}>
        {value === null ? <small style={{ fontSize: 12 }}>{note || '—'}</small> : <>{value}<small>{unit}</small></>}
      </span>
    </div>
  );

  const googleNote = !d ? '…' : !d.config.google ? '연동 필요' : d.errors.google ? '오류' : null;
  const naverNote = !d ? '…' : !d.config.naver ? '연동 필요' : d.errors.naver ? '오류' : null;

  return (
    <Box
      id="seo"
      icon={<I.Search size={18} />}
      title="SEO"
      metric={d ? (linked === 2 ? { value: '자동', tone: 'good', label: '구글·네이버 연동됨' } : { value: `연동 ${linked}/2`, tone: 'warn', label: `${linked}개 연동됨` }) : null}
      editing={editing}
      onEdit={toggle}
      saveState={saveState}
      entry={entry}
    >
      {editing ? (
        <>
          <p className="ab-note">순위를 확인할 검색어예요. 첫 번째가 대표 검색어로 크게 보여요. 최대 3개.</p>
          <EditableList
            items={entry.items}
            onChange={(fn) => setItems('seo_keywords', fn)}
            newItem={() => ({ id: newId(), keyword: '' })}
            addLabel="검색어 추가"
            fields={[{ key: 'keyword', label: '검색어', col: '1fr', wide: true }]}
          />
        </>
      ) : (
        <>
          <div className="ab-quad">
            {cell('Google 순위', googleNote ? null : rankText(gKw?.position ?? g?.position), '위', googleNote || (gKw?.position == null ? '전체 평균' : undefined))}
            {cell('Naver 순위', naverNote ? null : (nKw?.rank ?? null), '위', naverNote || (nKw && nKw.rank == null ? `${nKw.checked || 300}위 밖` : undefined))}
            {cell('검색 노출', googleNote ? null : fmt(g?.impressions || 0), '회', googleNote)}
            {cell('클릭률', googleNote ? null : (g ? g.ctr.toFixed(2) : null), '%', googleNote)}
          </div>
          <p className="ab-note">
            대표 검색어 <strong>{main || '(없음)'}</strong>
            {keywords.length > 1 && n?.keywords && <> · 네이버 {n.keywords.slice(1).map((k) => `${k.keyword} ${k.rank ? `${k.rank}위` : '순위 밖'}`).join(' · ')}</>}
            {g?.topQueries?.length > 0 && <> · 유입 검색어: {g.topQueries.slice(0, 3).map((q) => q.query).join(', ')}</>}
            {g && <> · 구글 {g.range.startDate.slice(5)}~{g.range.endDate.slice(5)}</>}
          </p>
          {(seo.error || d?.errors?.google || d?.errors?.naver) && (
            <p className="ab-note" style={{ color: '#a61b1b' }}>{seo.error || [d.errors.google, d.errors.naver].filter(Boolean).join(' / ')}</p>
          )}
          {d && linked < 2 && (
            <p className="ab-note">
              연동하려면 Vercel 환경변수에{!d.config.google && <> 구글: <code>GSC_CLIENT_EMAIL</code>, <code>GSC_PRIVATE_KEY</code>, <code>GSC_SITE_URL</code></>}
              {!d.config.naver && <> 네이버: <code>NAVER_CLIENT_ID</code>, <code>NAVER_CLIENT_SECRET</code></>}를 넣어 주세요.
            </p>
          )}
        </>
      )}
    </Box>
  );
}

/* ---------- 문의 · 피드백 ---------- */

const TICKET_TONE = { 접수: 'warn', '처리 중': 'info', 완료: 'good', 보류: 'mute' };

export function TicketsBox({ feedback, inquiries, saveState, setItems, flush }) {
  const [editing, toggle] = useEdit(['feedback', 'inquiries'], flush);
  const [tab, setTab] = useState('inquiries');
  const all = [
    ...inquiries.items.map((t) => ({ ...t, type: '문의' })),
    ...feedback.items.map((t) => ({ ...t, type: '피드백' })),
  ].sort((a, b) => (a.status === '완료') - (b.status === '완료') || String(b.date).localeCompare(String(a.date)));
  const pending = all.filter((t) => t.status === '접수').length;

  return (
    <Box
      id="tickets"
      icon={<I.Message size={18} />}
      title="문의 · 피드백"
      wide
      metric={{ value: pending ? `미처리 ${pending}` : '미처리 없음', tone: pending ? 'warn' : 'good', label: `미처리 ${pending}건` }}
      editing={editing}
      onEdit={toggle}
      saveState={saveState[tab]}
      entry={tab === 'feedback' ? feedback : inquiries}
    >
      {editing ? (
        <>
          <div className="ab-tabs" role="group" aria-label="분류">
            <button type="button" className="ab-tab" aria-pressed={tab === 'inquiries'} onClick={() => setTab('inquiries')}><I.Help size={14} />문의</button>
            <button type="button" className="ab-tab" aria-pressed={tab === 'feedback'} onClick={() => setTab('feedback')}><I.Message size={14} />피드백</button>
          </div>
          <EditableList
            key={tab}
            items={(tab === 'feedback' ? feedback : inquiries).items}
            onChange={(fn) => setItems(tab, fn)}
            newItem={() => ({ id: newId(), date: todayKST(), from: '', content: '', status: '접수', owner: '' })}
            addLabel={tab === 'feedback' ? '피드백 추가' : '문의 추가'}
            fields={[
              { key: 'date', label: '날짜', type: 'date', col: '150px' },
              { key: 'from', label: '보낸 사람·경로', col: '1fr' },
              { key: 'content', label: '내용', type: 'textarea', col: '2.2fr', wide: true },
              { key: 'status', label: '상태', type: 'select', options: ['접수', '처리 중', '보류', '완료'], col: '100px' },
              { key: 'owner', label: '담당', col: '90px' },
            ]}
          />
        </>
      ) : all.length === 0 ? (
        <Empty>아직 들어온 문의·피드백이 없어요.</Empty>
      ) : (
        <ul className="ab-tickets">
          {all.map((t) => (
            <li key={`${t.type}-${t.id}`} className="ab-ticket" style={{ opacity: t.status === '완료' ? 0.6 : 1 }}>
              <Chip tone={t.type === '문의' ? 'info' : 'mute'}>{t.type}</Chip>
              <span className="ab-ticket-date">{shortDate(t.date)}</span>
              <span className="ab-ticket-text">{t.from && <strong>{t.from} · </strong>}{t.content}</span>
              <Chip tone={TICKET_TONE[t.status]}>{t.status}</Chip>
            </li>
          ))}
        </ul>
      )}
    </Box>
  );
}
