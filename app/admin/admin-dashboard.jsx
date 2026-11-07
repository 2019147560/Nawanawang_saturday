'use client';

import { signOut } from 'next-auth/react';
import { I } from './board/icons';
import { BOARD_CSS } from './board/ui';
import { useBoard } from './board/use-board';
import {
  CrawlBox,
  HealthBox,
  LinksBox,
  PriorityBox,
  ScheduleBox,
  SeoBox,
  TeamBox,
  TicketsBox,
  useHealth,
} from './board/panels';

export default function AdminDashboard({ me }) {
  const { board, loadState, saveState, message, setItems, flush } = useBoard();
  const health = useHealth();
  const common = (key) => ({ entry: board[key], saveState: saveState[key], setItems, flush });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-soft)', color: 'var(--ink-900)' }}>
      <style dangerouslySetInnerHTML={{ __html: BOARD_CSS }} />

      <header style={{ background: '#fff', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <a href="/" style={{ fontSize: 18, fontWeight: 800 }}>나와, 나왕</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="ab-hide-sm" style={{ fontSize: 13, color: 'var(--ink-600)' }}>{me}</span>
            <button type="button" className="ab-btn" style={{ minHeight: 32, padding: '0 10px', fontSize: 12 }} onClick={() => signOut({ callbackUrl: '/admin' })}>로그아웃</button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '10px 16px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loadState === 'no-table' && (
          <div role="alert" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '6px 12px', borderRadius: 10, background: 'var(--warn-50)', color: 'var(--warn-700)', fontSize: 12, lineHeight: 1.5 }}>
            <I.Alert size={18} style={{ flex: '0 0 18px', marginTop: 2 }} />
            <span><strong>저장소 미설정</strong> · Supabase에서 <code>db/admin-board.sql</code>을 실행하기 전까지는 편집 내용이 저장되지 않아요.</span>
          </div>
        )}
        {loadState === 'error' && (
          <div role="alert" style={{ padding: '12px 14px', borderRadius: 12, background: 'var(--danger-50)', color: '#a61b1b', fontSize: 13 }}>
            저장된 데이터를 불러오지 못했어요. 잠시 후 새로고침해 주세요. {message}
          </div>
        )}

        <div className="ab-grid">
          <ScheduleBox {...common('schedule')} />

          <CrawlBox {...common('crawl_sites')} />
          <PriorityBox {...common('priorities')} />

          <LinksBox links={board.links} contacts={board.contacts} saveState={saveState} setItems={setItems} flush={flush} />
          <HealthBox health={health} />

          <TeamBox team={board.team} motto={board.motto} saveState={saveState} setItems={setItems} flush={flush} />
          <SeoBox />

          <TicketsBox feedback={board.feedback} inquiries={board.inquiries} saveState={saveState} setItems={setItems} flush={flush} />
        </div>

        <footer style={{ fontSize: 12, color: 'var(--ink-500)', textAlign: 'center' }}>
          /admin · 관리자 전용 · 검색엔진 비노출
        </footer>
      </main>
    </div>
  );
}
