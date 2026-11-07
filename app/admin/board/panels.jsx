'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { I } from './icons';
import { LINK_CATEGORIES } from './seeds';
import { Chip, EditToggle, EditableList, Empty, ExtLink, Panel, SaveStatus, Toolbar } from './ui';
import { daysSince, newId, todayKST } from './use-board';
import { SEO_DUMMY } from './seo-dummy';

const COLORS = {
  blue: { bg: 'var(--brand-50)', fg: 'var(--brand-500)' },
  red: { bg: 'var(--danger-50)', fg: '#a61b1b' },
  green: { bg: 'var(--success-50)', fg: 'var(--success-700)' },
  yellow: { bg: 'var(--warn-50)', fg: 'var(--warn-700)' },
  purple: { bg: '#f1ebff', fg: '#5b3cc4' },
  gray: { bg: 'var(--line-2)', fg: 'var(--ink-600)' },
};

const fmt = (n) => Math.round(n).toLocaleString('ko-KR');

// 편집 모드 공통 처리: 편집 완료를 누르면 대기 중인 저장을 바로 보냅니다.
function useEditMode(boardKey, flush) {
  const [editing, setEditing] = useState(false);
  const toggle = () => {
    if (editing) flush(boardKey);
    setEditing((v) => !v);
  };
  return [editing, toggle];
}

function PanelToolbar({ editing, onToggle, entry, saveState, children }) {
  return (
    <Toolbar>
      <span style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {children}
        <SaveStatus state={saveState} updatedBy={entry?.updatedBy} seeded={entry?.seeded} />
      </span>
      <EditToggle editing={editing} onClick={onToggle} />
    </Toolbar>
  );
}

/* ---------- 1. 크롤링 사이트 ---------- */

export function crawlFreshness(site) {
  const d = daysSince(site.lastUpdated);
  if (site.status === '실패') return { tone: 'bad', label: '실패', days: d };
  if (site.status === '지연' || d === null || d > 7) return { tone: 'warn', label: '미업데이트', days: d };
  return { tone: 'good', label: '최신', days: d };
}

function daysText(d) {
  if (d === null) return '기록 없음';
  if (d <= 0) return '오늘';
  return `${d}일 전`;
}

export function CrawlPanel({ metric, open, onToggle, entry, saveState, setItems, flush }) {
  const [editing, toggleEdit] = useEditMode('crawl_sites', flush);
  const items = entry.items;
  const rows = items.map((s) => ({ ...s, fresh: crawlFreshness(s) }));
  const count = (tone) => rows.filter((r) => r.fresh.tone === tone).length;

  return (
    <Panel
      metric={metric}
      id="crawl"
      icon={<I.Globe />}
      color={COLORS.blue}
      title="크롤링 사이트 · 업데이트 현황"
      open={open}
      onToggle={onToggle}
      chips={<>
        <Chip>{items.length}곳</Chip>
        <Chip tone="good" icon={<I.Check size={12} />}>최신 {count('good')}</Chip>
        {count('warn') > 0 && <Chip tone="warn" icon={<I.Clock size={12} />}>미업데이트 {count('warn')}</Chip>}
        {count('bad') > 0 && <Chip tone="bad" icon={<I.Alert size={12} />}>실패 {count('bad')}</Chip>}
      </>}
    >
      <PanelToolbar editing={editing} onToggle={toggleEdit} entry={entry} saveState={saveState}>
        <span style={{ fontSize: 12, color: 'var(--ink-500)' }}>마지막 업데이트가 7일 넘으면 미업데이트로 표시</span>
      </PanelToolbar>
      {editing ? (
        <EditableList
          items={items}
          onChange={(fn) => setItems('crawl_sites', fn)}
          newItem={() => ({ id: newId(), name: '', url: '', lastUpdated: todayKST(), cycle: '매일', status: '정상', note: '' })}
          addLabel="사이트 추가"
          fields={[
            { key: 'name', label: '사이트', col: '1.1fr', placeholder: '이름' },
            { key: 'url', label: '주소', type: 'url', col: '1.4fr', wide: true, placeholder: 'https://' },
            { key: 'lastUpdated', label: '마지막 업데이트', type: 'date', col: '150px' },
            { key: 'cycle', label: '주기', type: 'select', options: ['매일', '주 2회', '주 1회', '월 1회', '수동'], col: '100px' },
            { key: 'status', label: '상태', type: 'select', options: ['정상', '지연', '실패', '중단'], col: '90px' },
            { key: 'note', label: '메모', col: '1fr', wide: true },
          ]}
        />
      ) : rows.length === 0 ? (
        <Empty>등록된 사이트가 없어요. 편집을 눌러 추가하세요.</Empty>
      ) : (
        <>
          <div className="ab-table-wrap" style={{ marginTop: 10 }}>
            <table className="ab-table">
              <thead><tr><th scope="col">사이트</th><th scope="col">마지막 업데이트</th><th scope="col">주기</th><th scope="col">상태</th><th scope="col">메모</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td><ExtLink href={r.url}>{r.name || '(이름 없음)'}</ExtLink></td>
                    <td>{r.lastUpdated || '-'} <span style={{ color: 'var(--ink-500)' }}>({daysText(r.fresh.days)})</span></td>
                    <td>{r.cycle}</td>
                    <td><Chip tone={r.fresh.tone}>{r.fresh.label}</Chip></td>
                    <td style={{ color: 'var(--ink-600)' }}>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="ab-cards" style={{ marginTop: 10 }}>
            {rows.map((r) => (
              <div key={r.id} className="ab-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                  <ExtLink href={r.url}>{r.name || '(이름 없음)'}</ExtLink>
                  <Chip tone={r.fresh.tone}>{r.fresh.label}</Chip>
                </div>
                <div style={{ color: 'var(--ink-600)' }}>{daysText(r.fresh.days)} 업데이트 · {r.cycle}</div>
                {r.note && <div style={{ color: 'var(--ink-600)' }}>{r.note}</div>}
              </div>
            ))}
          </div>
        </>
      )}
    </Panel>
  );
}

/* ---------- 2. 우선순위 ---------- */

const LEVEL_ORDER = { 높음: 0, 중간: 1, 낮음: 2 };
const LEVEL_TONE = { 높음: 'bad', 중간: 'warn', 낮음: 'mute' };
const STATUS_TONE = { '할 일': 'mute', '진행 중': 'info', 완료: 'good', 보류: 'warn' };

function dueText(due) {
  const d = daysSince(due);
  if (d === null) return null;
  if (d === 0) return { text: '오늘 마감', tone: 'warn' };
  if (d > 0) return { text: `${d}일 지남`, tone: 'bad' };
  return { text: `D-${-d}`, tone: -d <= 3 ? 'warn' : 'mute' };
}

export function PriorityPanel({ metric, open, onToggle, entry, saveState, setItems, flush }) {
  const [editing, toggleEdit] = useEditMode('priorities', flush);
  const items = entry.items;
  const sorted = useMemo(() => [...items].sort((a, b) =>
    (a.status === '완료') - (b.status === '완료') || (LEVEL_ORDER[a.level] ?? 9) - (LEVEL_ORDER[b.level] ?? 9)), [items]);
  const open_ = items.filter((i) => i.status !== '완료');
  const high = open_.filter((i) => i.level === '높음').length;
  const doing = items.filter((i) => i.status === '진행 중').length;
  const overdue = open_.filter((i) => (daysSince(i.due) ?? -1) > 0).length;

  return (
    <Panel
      metric={metric}
      id="priority"
      icon={<I.Flag />}
      color={COLORS.red}
      title="우선순위"
      open={open}
      onToggle={onToggle}
      chips={<>
        <Chip>남은 일 {open_.length}</Chip>
        {high > 0 && <Chip tone="bad">높음 {high}</Chip>}
        {doing > 0 && <Chip tone="info">진행 중 {doing}</Chip>}
        {overdue > 0 && <Chip tone="bad" icon={<I.Alert size={12} />}>기한 지남 {overdue}</Chip>}
      </>}
    >
      <PanelToolbar editing={editing} onToggle={toggleEdit} entry={entry} saveState={saveState} />
      {editing ? (
        <EditableList
          items={items}
          onChange={(fn) => setItems('priorities', fn)}
          newItem={() => ({ id: newId(), title: '', owner: '', level: '중간', status: '할 일', due: '' })}
          addLabel="할 일 추가"
          fields={[
            { key: 'title', label: '할 일', col: '2fr', wide: true },
            { key: 'owner', label: '담당', col: '90px' },
            { key: 'level', label: '중요도', type: 'select', options: ['높음', '중간', '낮음'], col: '90px' },
            { key: 'status', label: '상태', type: 'select', options: ['할 일', '진행 중', '보류', '완료'], col: '100px' },
            { key: 'due', label: '기한', type: 'date', col: '150px' },
          ]}
        />
      ) : sorted.length === 0 ? (
        <Empty>등록된 할 일이 없어요.</Empty>
      ) : (
        <ol style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sorted.map((t) => {
            const due = t.status === '완료' ? null : dueText(t.due);
            return (
              <li key={t.id} className="ab-card" style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', opacity: t.status === '완료' ? 0.65 : 1 }}>
                <Chip tone={LEVEL_TONE[t.level]}>{t.level}</Chip>
                <span style={{ flex: '1 1 160px', fontWeight: 600, textDecoration: t.status === '완료' ? 'line-through' : 'none' }}>{t.title || '(제목 없음)'}</span>
                {t.owner && <span style={{ color: 'var(--ink-600)' }}>{t.owner}</span>}
                {due && <Chip tone={due.tone}>{due.text}</Chip>}
                <Chip tone={STATUS_TONE[t.status]}>{t.status}</Chip>
              </li>
            );
          })}
        </ol>
      )}
    </Panel>
  );
}

/* ---------- 3. 링크 · 회의 · 읽을거리 · 감상 · 연락처 ---------- */

const TAB_ICON = { 링크: I.Link, 회의: I.Video, 읽을거리: I.Book, 감상: I.Star, 연락처: I.Phone };

export function LinksPanel({ metric, open, onToggle, links, contacts, saveState, setItems, flush }) {
  const [tab, setTab] = useState('링크');
  const isContacts = tab === '연락처';
  const key = isContacts ? 'contacts' : 'links';
  const [editing, setEditing] = useState(false);
  const toggleEdit = () => { if (editing) { flush('links'); flush('contacts'); } setEditing((v) => !v); };
  const counts = Object.fromEntries(LINK_CATEGORIES.map((c) => [c, links.items.filter((l) => l.category === c).length]));
  const mine = links.items.filter((l) => l.category === tab);

  const onLinksChange = (fn) => setItems('links', (all) => {
    const others = all.filter((l) => l.category !== tab);
    return [...others, ...fn(all.filter((l) => l.category === tab))];
  });

  return (
    <Panel
      metric={metric}
      id="links"
      icon={<I.Link />}
      color={COLORS.purple}
      title="링크 · 회의 · 자료 · 연락처"
      open={open}
      onToggle={onToggle}
      chips={<>
        {LINK_CATEGORIES.map((c) => { const Icon = TAB_ICON[c]; return <Chip key={c} icon={<Icon size={12} />}>{c} {counts[c]}</Chip>; })}
        <Chip icon={<I.Phone size={12} />}>연락처 {contacts.items.length}</Chip>
      </>}
    >
      <div className="ab-tabs" role="group" aria-label="분류">
        {[...LINK_CATEGORIES, '연락처'].map((c) => {
          const Icon = TAB_ICON[c];
          return (
            <button key={c} type="button" className="ab-tab" aria-pressed={tab === c} onClick={() => setTab(c)}>
              <Icon size={14} />{c}
            </button>
          );
        })}
      </div>
      <PanelToolbar editing={editing} onToggle={toggleEdit} entry={isContacts ? contacts : links} saveState={saveState[key]} />
      {editing ? (
        isContacts ? (
          <EditableList
            items={contacts.items}
            onChange={(fn) => setItems('contacts', fn)}
            newItem={() => ({ id: newId(), name: '', role: '', contact: '', note: '' })}
            addLabel="연락처 추가"
            fields={[
              { key: 'name', label: '이름', col: '1fr' },
              { key: 'role', label: '역할', col: '1fr' },
              { key: 'contact', label: '전화/메일', col: '1.4fr', wide: true },
              { key: 'note', label: '메모', col: '1fr', wide: true },
            ]}
          />
        ) : (
          <EditableList
            items={mine}
            onChange={onLinksChange}
            newItem={() => ({ id: newId(), category: tab, title: '', url: '', note: '' })}
            addLabel={`${tab} 추가`}
            fields={[
              { key: 'title', label: '제목', col: '1.2fr', wide: true },
              { key: 'url', label: '링크', type: 'url', col: '1.5fr', wide: true, placeholder: 'https://' },
              { key: 'note', label: '메모', col: '1fr', wide: true },
            ]}
          />
        )
      ) : isContacts ? (
        contacts.items.length === 0 ? <Empty>연락처가 없어요.</Empty> : (
          <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {contacts.items.map((c) => (
              <li key={c.id} className="ab-card">
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <strong>{c.name || '(이름 없음)'}</strong>
                  {c.role && <span style={{ color: 'var(--ink-600)' }}>{c.role}</span>}
                </div>
                {c.contact && (
                  <a href={c.contact.includes('@') ? `mailto:${c.contact}` : `tel:${c.contact.replace(/[^0-9+]/g, '')}`} style={{ color: 'var(--brand-500)', fontWeight: 600, wordBreak: 'break-all' }}>{c.contact}</a>
                )}
                {c.note && <span style={{ color: 'var(--ink-600)' }}>{c.note}</span>}
              </li>
            ))}
          </ul>
        )
      ) : mine.length === 0 ? (
        <Empty>{tab} 항목이 없어요.</Empty>
      ) : (
        <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {mine.map((l) => (
            <li key={l.id} className="ab-card">
              <ExtLink href={l.url}>{l.title || l.url || '(제목 없음)'}</ExtLink>
              {l.note && <span style={{ color: 'var(--ink-600)' }}>{l.note}</span>}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* ---------- 4. 사이트 응답 시간 · 에러 · 미업데이트 ---------- */

const ENDPOINTS = [
  { name: '메인 페이지', path: '/' },
  { name: '지원사업 API', path: '/api/programs' },
  { name: '로그인 페이지', path: '/login' },
  { name: '사이트맵', path: '/sitemap.xml' },
];

function speed(ms) {
  if (ms < 600) return { tone: 'good', label: '빠름' };
  if (ms < 1500) return { tone: 'warn', label: '보통' };
  return { tone: 'bad', label: '느림' };
}

export function useHealth() {
  const [results, setResults] = useState([]);
  const [programs, setPrograms] = useState(null);
  const [checking, setChecking] = useState(false);
  const [checkedAt, setCheckedAt] = useState('');

  const run = useCallback(async () => {
    setChecking(true);
    const out = await Promise.all(ENDPOINTS.map(async (ep) => {
      const t0 = performance.now();
      try {
        const res = await fetch(ep.path, { cache: 'no-store' });
        const ms = performance.now() - t0;
        if (ep.path === '/api/programs') {
          const data = await res.clone().json().catch(() => null);
          if (data && Array.isArray(data.programs)) setPrograms(data.programs.length);
        }
        return { ...ep, ms, ok: res.ok, status: res.status };
      } catch {
        return { ...ep, ms: performance.now() - t0, ok: false, status: 0 };
      }
    }));
    setResults(out);
    setCheckedAt(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setChecking(false);
  }, []);

  useEffect(() => { run(); }, [run]);

  const errors = results.filter((r) => !r.ok);
  const avg = results.length ? results.reduce((a, r) => a + r.ms, 0) / results.length : null;
  return { results, programs, checking, checkedAt, run, errors, avg };
}

export function speedOf(ms) { return speed(ms); }

export function HealthPanel({ metric, open, onToggle, crawlItems, health }) {
  const { results, programs, checking, checkedAt, run } = health;

  const errors = results.filter((r) => !r.ok);
  const avg = results.length ? results.reduce((a, r) => a + r.ms, 0) / results.length : null;
  const stale = crawlItems.map((s) => ({ ...s, fresh: crawlFreshness(s) })).filter((s) => s.fresh.tone !== 'good');

  return (
    <Panel
      metric={metric}
      id="health"
      icon={<I.Activity />}
      color={COLORS.green}
      title="응답 시간 · 에러 · 미업데이트"
      open={open}
      onToggle={onToggle}
      chips={<>
        {avg === null ? <Chip>측정 중…</Chip> : <Chip tone={speed(avg).tone} icon={<I.Clock size={12} />}>평균 {fmt(avg)}ms</Chip>}
        {results.length > 0 && (errors.length ? <Chip tone="bad" icon={<I.Alert size={12} />}>에러 {errors.length}</Chip> : <Chip tone="good" icon={<I.Check size={12} />}>에러 없음</Chip>)}
        {stale.length > 0 ? <Chip tone="warn">미업데이트 {stale.length}곳</Chip> : <Chip tone="good">크롤링 최신</Chip>}
      </>}
    >
      <Toolbar>
        <span style={{ fontSize: 12, color: 'var(--ink-500)' }}>지금 이 브라우저에서 잰 값{checkedAt && ` · ${checkedAt}`}</span>
        <button type="button" className="ab-btn" onClick={run} disabled={checking}>
          <I.Refresh size={16} />{checking ? '측정 중…' : '다시 측정'}
        </button>
      </Toolbar>
      <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {results.map((r) => {
          const s = speed(r.ms);
          return (
            <li key={r.path} className="ab-card" style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ flex: '1 1 140px', fontWeight: 600 }}>{r.name} <span style={{ color: 'var(--ink-500)', fontWeight: 400 }}>{r.path}</span></span>
              <strong>{fmt(r.ms)}ms</strong>
              <Chip tone={s.tone}>{s.label}</Chip>
              <Chip tone={r.ok ? 'good' : 'bad'}>{r.ok ? `정상 ${r.status}` : `에러 ${r.status || '연결 실패'}`}</Chip>
            </li>
          );
        })}
      </ul>
      {programs !== null && (
        <p style={{ margin: '10px 0 0', fontSize: 13, color: 'var(--ink-600)' }}>지원사업 API가 돌려준 사업 수: <strong style={{ color: 'var(--ink-900)' }}>{fmt(programs)}개</strong></p>
      )}
      <h3 style={{ margin: '18px 0 0', fontSize: 14, fontWeight: 700 }}>미업데이트 · 실패 크롤링</h3>
      {stale.length === 0 ? <Empty>모든 사이트가 최신이에요.</Empty> : (
        <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {stale.map((s) => (
            <li key={s.id} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', fontSize: 13 }}>
              <Chip tone={s.fresh.tone}>{s.fresh.label}</Chip>
              <strong>{s.name}</strong>
              <span style={{ color: 'var(--ink-600)' }}>{daysText(s.fresh.days)}{s.note ? ` · ${s.note}` : ''}</span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* ---------- 5. 개발자 커뮤니티 ---------- */

const KINDS = ['자체평가', '잡담', '칭찬', '아이디어'];
const KIND_TONE = { 자체평가: 'info', 잡담: 'mute', 칭찬: 'good', 아이디어: 'warn' };

export function CommunityPanel({ metric, open, onToggle, entry, saveState, setItems, me }) {
  const [kind, setKind] = useState('자체평가');
  const [score, setScore] = useState('4');
  const [text, setText] = useState('');
  const posts = [...entry.items].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const scores = entry.items.filter((p) => p.kind === '자체평가' && Number(p.score)).map((p) => Number(p.score));
  const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const post = { id: newId(), kind, text: text.trim(), author: me || '관리자', createdAt: new Date().toISOString() };
    if (kind === '자체평가') post.score = Number(score);
    setItems('community', (list) => [post, ...list]);
    setText('');
  };

  return (
    <Panel
      metric={metric}
      id="community"
      icon={<I.Users />}
      color={COLORS.yellow}
      title="개발자 커뮤니티"
      open={open}
      onToggle={onToggle}
      chips={<>
        <Chip icon={<I.Message size={12} />}>글 {entry.items.length}</Chip>
        {avg !== null && <Chip tone="info" icon={<I.Star size={12} />}>자체평가 {avg.toFixed(1)}/5</Chip>}
        {posts[0] && <Chip>최근 {String(posts[0].createdAt).slice(5, 10).replace('-', '/')}</Chip>}
      </>}
    >
      <form className="ab-form" onSubmit={submit} style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <label style={{ flex: '1 1 140px' }}>
            <span className="ab-sr">글 종류</span>
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              {KINDS.map((k) => <option key={k}>{k}</option>)}
            </select>
          </label>
          {kind === '자체평가' && (
            <label style={{ flex: '1 1 140px' }}>
              <span className="ab-sr">사이트 점수</span>
              <select value={score} onChange={(e) => setScore(e.target.value)}>
                {[5, 4, 3, 2, 1].map((s) => <option key={s} value={s}>{`${'★'.repeat(s)}${'☆'.repeat(5 - s)} ${s}점`}</option>)}
              </select>
            </label>
          )}
        </div>
        <label>
          <span className="ab-sr">내용</span>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={kind === '자체평가' ? '이번 주 사이트에서 좋았던 점, 아쉬운 점' : '자유롭게 남겨 주세요'} />
        </label>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <SaveStatus state={saveState} updatedBy={entry.updatedBy} />
          <button type="submit" className="ab-btn primary" disabled={!text.trim()}><I.Plus size={16} />글 남기기</button>
        </div>
      </form>
      {posts.length === 0 ? <Empty>첫 글을 남겨 보세요.</Empty> : (
        <ul style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {posts.map((p) => (
            <li key={p.id} className="ab-card">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <Chip tone={KIND_TONE[p.kind]}>{p.kind}</Chip>
                {p.score ? <span aria-label={`${p.score}점`} style={{ color: '#b07a00', fontWeight: 700 }}>{'★'.repeat(p.score)}{'☆'.repeat(5 - p.score)}</span> : null}
                <strong>{p.author}</strong>
                <span style={{ color: 'var(--ink-500)' }}>{new Date(p.createdAt).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                <button type="button" className="ab-iconbtn" style={{ marginLeft: 'auto' }} aria-label="글 삭제" onClick={() => setItems('community', (list) => list.filter((x) => x.id !== p.id))}>
                  <I.Trash size={16} />
                </button>
              </div>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--ink-700)' }}>{p.text}</p>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* ---------- 6. SEO ---------- */

export function SeoPanel({ metric, open, onToggle }) {
  const s = SEO_DUMMY;
  return (
    <Panel
      metric={metric}
      id="seo"
      icon={<I.Search />}
      color={COLORS.blue}
      title="SEO 현황"
      open={open}
      onToggle={onToggle}
      chips={<>
        <Chip>노출 {fmt(s.impressions)}</Chip>
        <Chip>클릭 {fmt(s.clicks)}</Chip>
        <Chip tone="info">CTR {s.ctr}%</Chip>
        <Chip tone="warn">더미 데이터</Chip>
      </>}
    >
      <p style={{ margin: '14px 0 0', fontSize: 12, color: 'var(--ink-500)' }}>Google Search Console 연동 전이라 예시 숫자예요 · 최근 28일 기준으로 표시 예정</p>
      <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8 }}>
        {[['검색 노출', `${fmt(s.impressions)}회`], ['검색 클릭', `${fmt(s.clicks)}회`], ['클릭률', `${s.ctr}%`], ['평균 순위', `${s.position}위`]].map(([k, v]) => (
          <div key={k} style={{ padding: '12px 14px', borderRadius: 12, background: 'var(--bg-soft)' }}>
            <div style={{ fontSize: 12, color: 'var(--ink-600)', fontWeight: 600 }}>{k}</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{v}</div>
          </div>
        ))}
      </div>
      <h3 style={{ margin: '16px 0 0', fontSize: 14, fontWeight: 700 }}>유입 검색어 상위</h3>
      <div className="ab-table-wrap" style={{ marginTop: 6 }}>
        <table className="ab-table">
          <thead><tr><th scope="col">검색어</th><th scope="col" style={{ textAlign: 'right' }}>노출</th><th scope="col" style={{ textAlign: 'right' }}>클릭</th><th scope="col" style={{ textAlign: 'right' }}>순위</th></tr></thead>
          <tbody>
            {s.queries.map(([q, imp, clk, pos]) => (
              <tr key={q}><td>{q}</td><td style={{ textAlign: 'right' }}>{fmt(imp)}</td><td style={{ textAlign: 'right' }}>{fmt(clk)}</td><td style={{ textAlign: 'right' }}>{pos}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ab-cards" style={{ marginTop: 6 }}>
        {s.queries.map(([q, imp, clk, pos]) => (
          <div key={q} className="ab-card" style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <strong>{q}</strong>
            <span style={{ color: 'var(--ink-600)' }}>노출 {fmt(imp)} · 클릭 {fmt(clk)} · {pos}위</span>
          </div>
        ))}
      </div>
      <h3 style={{ margin: '16px 0 0', fontSize: 14, fontWeight: 700 }}>페이지 속도 (Core Web Vitals)</h3>
      <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {s.vitals.map((v) => (
          <div key={v.name} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', fontSize: 13 }}>
            <strong style={{ minWidth: 36 }}>{v.name}</strong>
            <span style={{ color: 'var(--ink-600)', flex: '1 1 auto' }}>{v.desc}</span>
            <strong>{v.value}</strong>
            <Chip tone={v.good ? 'good' : 'warn'}>{v.good ? '좋음' : '개선 필요'}</Chip>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ---------- 7·8. 피드백 · 문의사항 ---------- */

const TICKET_TONE = { 접수: 'warn', '처리 중': 'info', 완료: 'good', 보류: 'mute' };

export function TicketPanel({ metric, boardKey, id, title, icon, color, open, onToggle, entry, saveState, setItems, flush }) {
  const [editing, toggleEdit] = useEditMode(boardKey, flush);
  const items = [...entry.items].sort((a, b) => (a.status === '완료') - (b.status === '완료') || String(b.date).localeCompare(String(a.date)));
  const pending = items.filter((t) => t.status === '접수').length;
  const doing = items.filter((t) => t.status === '처리 중').length;

  return (
    <Panel
      metric={metric}
      id={id}
      icon={icon}
      color={COLORS[color]}
      title={title}
      open={open}
      onToggle={onToggle}
      chips={<>
        <Chip>전체 {items.length}</Chip>
        {pending > 0 ? <Chip tone="warn" icon={<I.Alert size={12} />}>미처리 {pending}</Chip> : <Chip tone="good" icon={<I.Check size={12} />}>미처리 없음</Chip>}
        {doing > 0 && <Chip tone="info">처리 중 {doing}</Chip>}
      </>}
    >
      <PanelToolbar editing={editing} onToggle={toggleEdit} entry={entry} saveState={saveState} />
      {editing ? (
        <EditableList
          items={entry.items}
          onChange={(fn) => setItems(boardKey, fn)}
          newItem={() => ({ id: newId(), date: todayKST(), from: '', content: '', status: '접수', owner: '' })}
          addLabel="추가"
          fields={[
            { key: 'date', label: '날짜', type: 'date', col: '150px' },
            { key: 'from', label: '보낸 사람·경로', col: '1fr' },
            { key: 'content', label: '내용', type: 'textarea', col: '2fr', wide: true },
            { key: 'status', label: '상태', type: 'select', options: ['접수', '처리 중', '보류', '완료'], col: '100px' },
            { key: 'owner', label: '담당', col: '90px' },
          ]}
        />
      ) : items.length === 0 ? (
        <Empty>아직 없어요. 편집을 눌러 추가하세요.</Empty>
      ) : (
        <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((t) => (
            <li key={t.id} className="ab-card" style={{ opacity: t.status === '완료' ? 0.65 : 1 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <Chip tone={TICKET_TONE[t.status]}>{t.status}</Chip>
                <span style={{ color: 'var(--ink-500)' }}>{t.date}</span>
                {t.from && <strong>{t.from}</strong>}
                {t.owner && <span style={{ color: 'var(--ink-600)', marginLeft: 'auto' }}>담당 {t.owner}</span>}
              </div>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--ink-700)' }}>{t.content}</p>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
