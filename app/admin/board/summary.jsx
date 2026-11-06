'use client';

import { I } from './icons';
import { crawlFreshness, speedOf } from './panels';
import { SEO_DUMMY } from './seo-dummy';
import { daysSince } from './use-board';

const TONE = {
  good: { fg: 'var(--success-700)', bg: 'var(--success-50)', word: '좋음' },
  warn: { fg: 'var(--warn-700)', bg: 'var(--warn-50)', word: '확인' },
  bad: { fg: '#a61b1b', bg: 'var(--danger-50)', word: '주의' },
  info: { fg: 'var(--brand-600)', bg: 'var(--brand-50)', word: '' },
  mute: { fg: 'var(--ink-600)', bg: 'var(--line-2)', word: '' },
};

const fmt = (n) => Math.round(n).toLocaleString('ko-KR');

// 패널마다 한 개의 핵심 수치. 작은 화면에서도 4칸 × 2줄로 한눈에 보입니다.
export function buildSummary(board, health) {
  const crawl = board.crawl_sites.items.map(crawlFreshness);
  const crawlBad = crawl.filter((c) => c.tone === 'bad').length;
  const crawlStale = crawl.filter((c) => c.tone !== 'good').length;

  const todo = board.priorities.items.filter((t) => t.status !== '완료');
  const high = todo.filter((t) => t.level === '높음').length;
  const overdue = todo.filter((t) => (daysSince(t.due) ?? -1) > 0).length;

  const scores = board.community.items.filter((p) => Number(p.score)).map((p) => Number(p.score));
  const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

  const pending = (key) => board[key].items.filter((t) => t.status === '접수').length;

  return [
    {
      id: 'crawl', label: '크롤링', icon: I.Globe,
      value: crawlStale ? `${crawlStale}곳` : '최신',
      note: crawlStale ? (crawlBad ? `실패 ${crawlBad}` : '미업데이트') : `${crawl.length}곳 정상`,
      tone: crawlBad ? 'bad' : crawlStale ? 'warn' : 'good',
    },
    {
      id: 'priority', label: '우선순위', icon: I.Flag,
      value: `${todo.length}`,
      note: overdue ? `기한 지남 ${overdue}` : high ? `높음 ${high}` : '남은 일',
      tone: overdue ? 'bad' : high ? 'warn' : 'good',
    },
    {
      id: 'links', label: '링크', icon: I.Link,
      value: `${board.links.items.length}`,
      note: `연락처 ${board.contacts.items.length}`,
      tone: 'info',
    },
    {
      id: 'health', label: '응답', icon: I.Activity,
      value: health.avg === null ? '…' : `${fmt(health.avg)}ms`,
      note: health.results.length ? (health.errors.length ? `에러 ${health.errors.length}` : '에러 없음') : '측정 중',
      tone: health.avg === null ? 'mute' : health.errors.length ? 'bad' : speedOf(health.avg).tone,
    },
    {
      id: 'community', label: '커뮤니티', icon: I.Users,
      value: avgScore === null ? `${board.community.items.length}` : `★${avgScore.toFixed(1)}`,
      note: avgScore === null ? '글' : `글 ${board.community.items.length}`,
      tone: 'info',
    },
    {
      id: 'seo', label: 'SEO', icon: I.Search,
      value: `${SEO_DUMMY.ctr}%`,
      note: 'CTR · 더미',
      tone: 'mute',
    },
    {
      id: 'feedback', label: '피드백', icon: I.Message,
      value: `${pending('feedback')}`,
      note: '미처리',
      tone: pending('feedback') ? 'warn' : 'good',
    },
    {
      id: 'inquiries', label: '문의', icon: I.Help,
      value: `${pending('inquiries')}`,
      note: '미처리',
      tone: pending('inquiries') ? 'warn' : 'good',
    },
  ];
}

export function SummaryStrip({ items, onPick }) {
  return (
    <nav aria-label="패널 요약" className="ab-sum">
      {items.map((it) => {
        const t = TONE[it.tone] || TONE.mute;
        const Icon = it.icon;
        return (
          <button
            key={it.id}
            type="button"
            className="ab-sum-tile"
            onClick={() => onPick(it.id)}
            aria-label={`${it.label}: ${it.value}, ${it.note}${t.word ? `, ${t.word}` : ''}. 눌러서 펼치기`}
          >
            <span className="ab-sum-top">
              <span className="ab-sum-icon" style={{ background: t.bg, color: t.fg }}><Icon size={16} /></span>
              <span className="ab-sum-label">{it.label}</span>
            </span>
            <span className="ab-sum-value" style={{ color: it.tone === 'mute' || it.tone === 'info' ? 'var(--ink-900)' : t.fg }}>{it.value}</span>
            <span className="ab-sum-note">{it.note}</span>
          </button>
        );
      })}
    </nav>
  );
}
