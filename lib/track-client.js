'use client';

// 브라우저 이벤트 추적. 로그인 정보와 연결하지 않는 무작위 세션 ID만 씁니다.

const SESSION_KEY = 'nnw_sid';
const SESSION_TTL_MS = 30 * 60 * 1000; // 30분 동안 아무 행동이 없으면 새 세션
const UTM_KEY = 'nnw_utm';

function randomId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function getSessionId() {
  try {
    const now = Date.now();
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    const id = saved && now - saved.t < SESSION_TTL_MS ? saved.id : randomId();
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id, t: now }));
    return id;
  } catch {
    return null;
  }
}

function getUtm() {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = {
      source: params.get('utm_source') || undefined,
      medium: params.get('utm_medium') || undefined,
      campaign: params.get('utm_campaign') || undefined,
    };
    if (utm.source || utm.medium || utm.campaign) {
      sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
      return utm;
    }
    return JSON.parse(sessionStorage.getItem(UTM_KEY) || 'null') || undefined;
  } catch {
    return undefined;
  }
}

function isDisabled() {
  if (typeof window === 'undefined') return true;
  if (window.location.pathname.startsWith('/admin')) return true;
  return navigator.doNotTrack === '1' || window.doNotTrack === '1';
}

export function track(event, data = {}) {
  try {
    if (isDisabled()) return;
    const payload = JSON.stringify({
      event,
      sessionId: getSessionId(),
      path: window.location.pathname,
      referrer: document.referrer || undefined,
      utm: getUtm(),
      ...data,
    });
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
      if (ok) return;
    }
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // 추적 실패는 무시합니다.
  }
}
