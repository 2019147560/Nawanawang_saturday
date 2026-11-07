'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { I } from './board/icons';
import { BOARD_CSS } from './board/ui';
import { useBoard } from './board/use-board';
import { buildSummary } from './board/summary';
import {
  CommunityPanel,
  CrawlPanel,
  HealthPanel,
  LinksPanel,
  PriorityPanel,
  SeoPanel,
  TicketPanel,
  useHealth,
} from './board/panels';

const PANEL_IDS = ['crawl', 'priority', 'links', 'health', 'community', 'seo', 'feedback', 'inquiries'];
const OPEN_KEY = 'nnw_admin_open';

export default function AdminDashboard({ me }) {
  const { board, loadState, saveState, message, setItems, flush } = useBoard();
  const [open, setOpen] = useState({});
  const health = useHealth();

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(OPEN_KEY) || 'null');
      if (saved && typeof saved === 'object') setOpen(saved);
    } catch { /* 무시 */ }
  }, []);

  const updateOpen = (next) => {
    setOpen(next);
    try { localStorage.setItem(OPEN_KEY, JSON.stringify(next)); } catch { /* 무시 */ }
  };
  const toggle = (id) => () => updateOpen({ ...open, [id]: !open[id] });
  const allOpen = PANEL_IDS.every((id) => open[id]);
  const setAll = (v) => updateOpen(Object.fromEntries(PANEL_IDS.map((id) => [id, v])));

  const metrics = Object.fromEntries(buildSummary(board, health).map((m) => [m.id, m]));

  const common = (key) => ({ entry: board[key], saveState: saveState[key], setItems, flush });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-soft)', color: 'var(--ink-900)' }}>
      <style dangerouslySetInnerHTML={{ __html: BOARD_CSS }} />

      <header style={{ background: '#fff', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <a href="/" style={{ fontSize: 18, fontWeight: 800 }}>나와, 나왕</a>
            <span className="ab-hide-sm" style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-600)', padding: '4px 10px', borderRadius: 999, background: 'var(--brand-50)', border: '1px solid var(--brand-100)' }}>개발·기획 대시보드</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className="ab-btn" onClick={() => setAll(!allOpen)}>
              <I.Chevron size={16} style={{ transform: allOpen ? 'rotate(180deg)' : 'none' }} />
              <span className="ab-hide-sm">{allOpen ? '모두 접기' : '모두 펼치기'}</span>
              <span className="ab-sr">{allOpen ? '모두 접기' : '모두 펼치기'}</span>
            </button>
            <span className="ab-hide-sm" style={{ fontSize: 13, color: 'var(--ink-600)' }}>{me}</span>
            <button type="button" className="ab-btn" onClick={() => signOut({ callbackUrl: '/admin' })}>로그아웃</button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 20px 64px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loadState === 'no-table' && (
          <div role="alert" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '14px 16px', borderRadius: 12, background: 'var(--warn-50)', color: 'var(--warn-700)', fontSize: 13, lineHeight: 1.6 }}>
            <I.Alert size={18} style={{ flex: '0 0 18px', marginTop: 2 }} />
            <span>
              <strong>저장소 미설정</strong> · Supabase에서 <code>db/admin-board.sql</code>을 실행하기 전까지는 편집 내용이 저장되지 않아요.
            </span>
          </div>
        )}
        {loadState === 'error' && (
          <div role="alert" style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--danger-50)', color: '#a61b1b', fontSize: 13 }}>
            저장된 데이터를 불러오지 못했어요. 잠시 후 새로고침해 주세요. {message}
          </div>
        )}

        <div className="ab-grid">
          {/* 1단 */}
          <CrawlPanel metric={metrics.crawl} open={!!open.crawl} onToggle={toggle('crawl')} {...common('crawl_sites')} />
          <PriorityPanel metric={metrics.priority} open={!!open.priority} onToggle={toggle('priority')} {...common('priorities')} />

          {/* 2단 */}
          <LinksPanel
            metric={metrics.links} open={!!open.links}
            onToggle={toggle('links')}
            links={board.links}
            contacts={board.contacts}
            saveState={saveState}
            setItems={setItems}
            flush={flush}
          />
          <HealthPanel metric={metrics.health} open={!!open.health} onToggle={toggle('health')} crawlItems={board.crawl_sites.items} health={health} />

          {/* 3단 */}
          <CommunityPanel metric={metrics.community} open={!!open.community} onToggle={toggle('community')} me={me} {...common('community')} />
          <SeoPanel metric={metrics.seo} open={!!open.seo} onToggle={toggle('seo')} />

          {/* 4단 */}
          <TicketPanel boardKey="feedback" id="feedback" title="피드백" icon={<I.Message />} color="purple" metric={metrics.feedback} open={!!open.feedback} onToggle={toggle('feedback')} {...common('feedback')} />
          <TicketPanel boardKey="inquiries" id="inquiries" title="문의사항" icon={<I.Help />} color="gray" metric={metrics.inquiries} open={!!open.inquiries} onToggle={toggle('inquiries')} {...common('inquiries')} />
        </div>

        <footer style={{ fontSize: 12, color: 'var(--ink-500)', textAlign: 'center' }}>
          /admin · 관리자 전용 · 검색엔진 비노출
        </footer>
      </main>
    </div>
  );
}
