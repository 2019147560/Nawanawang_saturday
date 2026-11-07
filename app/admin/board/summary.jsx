'use client';

import { crawlFreshness, speedOf } from './panels';
import { SEO_DUMMY } from './seo-dummy';
import { daysSince } from './use-board';

const fmt = (n) => Math.round(n).toLocaleString('ko-KR');

// 패널마다 한 개의 핵심 수치. 각 패널 머리 오른쪽에 크게 표시됩니다.
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
      id: 'crawl',
      value: crawlStale ? `${crawlStale}곳` : '최신',
      note: crawlStale ? (crawlBad ? `실패 ${crawlBad}` : '미업데이트') : `${crawl.length}곳 정상`,
      tone: crawlBad ? 'bad' : crawlStale ? 'warn' : 'good',
    },
    {
      id: 'priority',
      value: `${todo.length}`,
      note: overdue ? `기한 지남 ${overdue}` : high ? `높음 ${high}` : '남은 일',
      tone: overdue ? 'bad' : high ? 'warn' : 'good',
    },
    {
      id: 'links',
      value: `${board.links.items.length}`,
      note: `연락처 ${board.contacts.items.length}`,
      tone: 'info',
    },
    {
      id: 'health',
      value: health.avg === null ? '…' : health.avg >= 1000 ? `${(health.avg / 1000).toFixed(1)}초` : `${fmt(health.avg)}ms`,
      note: health.results.length ? (health.errors.length ? `에러 ${health.errors.length}` : '에러 없음') : '측정 중',
      tone: health.avg === null ? 'mute' : health.errors.length ? 'bad' : speedOf(health.avg).tone,
    },
    {
      id: 'community',
      value: avgScore === null ? `${board.community.items.length}` : `★${avgScore.toFixed(1)}`,
      note: avgScore === null ? '글' : `글 ${board.community.items.length}`,
      tone: 'info',
    },
    {
      id: 'seo',
      value: `${SEO_DUMMY.ctr}%`,
      note: 'CTR · 더미',
      tone: 'mute',
    },
    {
      id: 'feedback',
      value: `${pending('feedback')}`,
      note: '미처리',
      tone: pending('feedback') ? 'warn' : 'good',
    },
    {
      id: 'inquiries',
      value: `${pending('inquiries')}`,
      note: '미처리',
      tone: pending('inquiries') ? 'warn' : 'good',
    },
  ];
}
