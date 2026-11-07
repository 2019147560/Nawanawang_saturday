'use client';

import { useCallback, useEffect, useState } from 'react';
import { I } from './icons';
import { LINK_CATEGORIES, MOODS } from './seeds';
import { Chip, EditableList, Empty, ExtLink, SaveStatus } from './ui';
import { daysSince, newId, todayKST } from './use-board';
import { SEO_DUMMY } from './seo-dummy';

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
        <div style={{ marginTop: 8 }}><SaveStatus state={saveState} updatedBy={entry?.updatedBy} seeded={entry?.seeded} /></div>
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

/* ---------- 크롤링 사이트 ---------- */

export function crawlFreshness(site) {
  const d = daysSince(site.lastUpdated);
  if (site.status === '실패' || site.status === '중단') return { tone: 'bad', label: '실패', days: d };
  if (site.status === '지연' || d === null || d > 7) return { tone: 'warn', label: '미업데이트', days: d };
  return { tone: 'good', label: '최신', days: d };
}

function StatusMark({ tone }) {
  const map = {
    good: [I.Check, 'var(--success-700)', '최신'],
    bad: [I.X, '#a61b1b', '실패'],
    warn: [I.Alert, 'var(--warn-700)', '미업데이트'],
  };
  const [Icon, color, label] = map[tone];
  return <span style={{ color, display: 'inline-flex' }} role="img" aria-label={label}><Icon size={20} strokeWidth={2.6} /></span>;
}

export function CrawlBox({ entry, saveState, setItems, flush }) {
  const [editing, toggle] = useEdit(['crawl_sites'], flush);
  const rows = entry.items.map((s) => ({ ...s, fresh: crawlFreshness(s) }));
  const good = rows.filter((r) => r.fresh.tone === 'good').length;
  const tone = good === rows.length ? 'good' : rows.some((r) => r.fresh.tone === 'bad') ? 'bad' : 'warn';

  return (
    <Box
      id="crawl"
      icon={<I.Globe size={18} />}
      title="크롤링 사이트"
      metric={{ value: `${good}/${rows.length}`, tone, label: `전체 ${rows.length}곳 중 ${good}곳 최신` }}
      editing={editing}
      onEdit={toggle}
      saveState={saveState}
      entry={entry}
    >
      {editing ? (
        <EditableList
          items={entry.items}
          onChange={(fn) => setItems('crawl_sites', fn)}
          newItem={() => ({ id: newId(), name: '', url: '', lastUpdated: todayKST(), cycle: '매일', status: '정상', note: '' })}
          addLabel="사이트 추가"
          fields={[
            { key: 'name', label: '사이트', col: '1fr' },
            { key: 'url', label: '주소', type: 'url', col: '1.2fr', wide: true, placeholder: 'https://' },
            { key: 'lastUpdated', label: '마지막 업데이트', type: 'date', col: '150px' },
            { key: 'status', label: '상태', type: 'select', options: ['정상', '지연', '실패', '중단'], col: '90px' },
          ]}
        />
      ) : rows.length === 0 ? (
        <Empty>등록된 사이트가 없어요.</Empty>
      ) : (
        <ul className="ab-crawl" aria-label="크롤링 사이트 목록">
          {rows.map((r) => (
            <li key={r.id} className="ab-crawl-row">
              <span className="ab-crawl-name">{r.url ? <ExtLink href={r.url}>{r.name || '(이름 없음)'}</ExtLink> : (r.name || '(이름 없음)')}</span>
              <StatusMark tone={r.fresh.tone} />
              <span className="ab-crawl-date">{r.lastUpdated ? shortDate(r.lastUpdated) : '·'}</span>
            </li>
          ))}
        </ul>
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
                <span className="ab-prio-rank" aria-label={`${p.rank}순위`}>{p.rank}</span>
                <span className="ab-prio-title">{p.title || '(이름 없음)'}</span>
                <Chip tone={PRIO_TONE[p.status]}>{p.status}</Chip>
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
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: 'var(--ink-500)' }}>이 브라우저에서 측정{checkedAt && ` · ${checkedAt}`} · 초록 0.6초 미만</span>
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
    <svg viewBox="0 0 48 48" width="52" height="52" role="img" aria-label={`기분 ${mood}`}>
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
          <p className="ab-team-caption">자체평가 점수 (5점 만점)</p>
          {mottoText && <p className="ab-motto">“{mottoText}”</p>}
        </>
      )}
    </Box>
  );
}

/* ---------- SEO ---------- */

export function SeoBox() {
  const s = SEO_DUMMY;
  return (
    <Box id="seo" icon={<I.Search size={18} />} title="SEO" metric={{ value: '더미', tone: 'warn', label: '예시 데이터' }}>
      <div className="ab-quad">
        <div className="ab-quad-cell"><span className="ab-quad-label">Google 순위</span><span className="ab-quad-value">{s.googleRank}<small>위</small></span></div>
        <div className="ab-quad-cell"><span className="ab-quad-label">Naver 순위</span><span className="ab-quad-value">{s.naverRank}<small>위</small></span></div>
        <div className="ab-quad-cell"><span className="ab-quad-label">검색 노출</span><span className="ab-quad-value">{fmt(s.impressions)}<small>회</small></span></div>
        <div className="ab-quad-cell"><span className="ab-quad-label">클릭률</span><span className="ab-quad-value">{s.ctr}<small>%</small></span></div>
      </div>
      <p style={{ margin: '10px 0 0', fontSize: 12, color: 'var(--ink-500)' }}>대표 검색어 기준 · Search Console·네이버 서치어드바이저 연동 전 예시 숫자</p>
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
