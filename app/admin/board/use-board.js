'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SEEDS } from './seeds';

// 대시보드 표 데이터를 불러오고, 바뀐 항목을 잠시 뒤 자동 저장합니다.
export function useBoard() {
  const [board, setBoard] = useState(() => {
    const init = {};
    for (const k of Object.keys(SEEDS)) init[k] = { items: SEEDS[k], version: 0, seeded: true };
    return init;
  });
  const [loadState, setLoadState] = useState('loading'); // loading | ready | no-table | error
  const [saveState, setSaveState] = useState({}); // key -> idle | saving | saved | error | conflict
  const [message, setMessage] = useState('');
  const timers = useRef({});
  const latest = useRef(board);
  latest.current = board;

  useEffect(() => {
    let alive = true;
    fetch('/api/admin/board', { cache: 'no-store' })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!alive) return;
        if (!res.ok) {
          setLoadState(data.code === 'NO_TABLE' || data.code === 'NO_STORAGE' ? 'no-table' : 'error');
          setMessage(data.message || '');
          return;
        }
        setBoard((prev) => {
          const next = { ...prev };
          for (const [k, entry] of Object.entries(data.board || {})) next[k] = { ...entry, seeded: false };
          return next;
        });
        setLoadState('ready');
      })
      .catch(() => alive && setLoadState('error'));
    return () => { alive = false; };
  }, []);

  const save = useCallback(async (key) => {
    const entry = latest.current[key];
    if (!entry) return;
    setSaveState((s) => ({ ...s, [key]: 'saving' }));
    try {
      const res = await fetch(`/api/admin/board/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: entry.items, baseVersion: entry.version }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409 && data.current) {
        setBoard((b) => ({ ...b, [key]: { ...data.current, seeded: false } }));
        setSaveState((s) => ({ ...s, [key]: 'conflict' }));
        return;
      }
      if (!res.ok) {
        setSaveState((s) => ({ ...s, [key]: 'error' }));
        if (data.code === 'NO_TABLE' || data.code === 'NO_STORAGE') setLoadState('no-table');
        return;
      }
      setBoard((b) => ({
        ...b,
        [key]: { ...b[key], version: data.version, updatedAt: data.updatedAt, updatedBy: data.updatedBy, seeded: false },
      }));
      setSaveState((s) => ({ ...s, [key]: 'saved' }));
    } catch {
      setSaveState((s) => ({ ...s, [key]: 'error' }));
    }
  }, []);

  const setItems = useCallback((key, updater) => {
    setBoard((b) => {
      const cur = b[key] || { items: [], version: 0 };
      const items = typeof updater === 'function' ? updater(cur.items) : updater;
      return { ...b, [key]: { ...cur, items } };
    });
    setSaveState((s) => ({ ...s, [key]: 'pending' }));
    clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(() => save(key), 900);
  }, [save]);

  const flush = useCallback((key) => {
    if (timers.current[key]) {
      clearTimeout(timers.current[key]);
      timers.current[key] = null;
      save(key);
    }
  }, [save]);

  return { board, loadState, saveState, message, setItems, flush };
}

export function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function todayKST() {
  const d = new Date(Date.now() + 9 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
}

export function daysSince(dateStr) {
  if (!dateStr) return null;
  const t = Date.parse(`${dateStr}T00:00:00+09:00`);
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.parse(`${todayKST()}T00:00:00+09:00`) - t) / 86400000);
}
