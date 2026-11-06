import { query } from './db';
import { hasSupabaseRestConfig, supabaseRequest } from './supabase-rest';

// 브라우저에서 보낼 수 있는 이벤트. 서버 전용 이벤트는 SERVER_EVENTS에 둡니다.
export const CLIENT_EVENTS = new Set([
  'page_view',
  'search',
  'filter_use',
  'program_view',
  'apply_click',
]);

export const SERVER_EVENTS = new Set([
  'signup_basic_saved',
  'sms_sent',
  'sms_failed',
  'phone_verified',
  'signup_complete',
  'api_error',
]);

const COLUMNS = [
  'event_name',
  'session_id',
  'path',
  'referrer_host',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'device',
  'program_id',
  'search_query',
  'result_count',
  'props',
];

function clip(value, max) {
  if (value === undefined || value === null || value === '') return null;
  return String(value).slice(0, max);
}

export function detectDevice(userAgent) {
  const ua = String(userAgent || '');
  if (!ua) return null;
  if (/bot|crawler|spider|crawling/i.test(ua)) return 'bot';
  if (/iPad|Tablet/i.test(ua)) return 'tablet';
  if (/Mobi|Android|iPhone/i.test(ua)) return 'mobile';
  return 'desktop';
}

export function normalizeEvent(raw) {
  const resultCount = Number.parseInt(raw.result_count, 10);
  let props = raw.props && typeof raw.props === 'object' && !Array.isArray(raw.props) ? raw.props : {};
  if (JSON.stringify(props).length > 2000) props = {};

  return {
    event_name: clip(raw.event_name, 40),
    session_id: clip(raw.session_id, 64),
    path: clip(raw.path, 300),
    referrer_host: clip(raw.referrer_host, 200),
    utm_source: clip(raw.utm_source, 100),
    utm_medium: clip(raw.utm_medium, 100),
    utm_campaign: clip(raw.utm_campaign, 100),
    device: clip(raw.device, 20),
    program_id: clip(raw.program_id, 100),
    search_query: clip(raw.search_query, 100),
    result_count: Number.isFinite(resultCount) ? resultCount : null,
    props,
  };
}

// 이벤트 기록은 실패해도 서비스 동작에 영향을 주지 않습니다.
export async function recordEvent(raw) {
  const event = normalizeEvent(raw);
  if (!event.event_name) return false;

  try {
    if (hasSupabaseRestConfig()) {
      await supabaseRequest('analytics_events', {
        method: 'POST',
        body: event,
        prefer: 'return=minimal',
      });
      return true;
    }
    if (process.env.DATABASE_URL) {
      const placeholders = COLUMNS.map((_, i) => `$${i + 1}`).join(', ');
      await query(
        `INSERT INTO analytics_events (${COLUMNS.join(', ')}) VALUES (${placeholders})`,
        COLUMNS.map((c) => (c === 'props' ? JSON.stringify(event.props) : event[c])),
      );
      return true;
    }
  } catch (error) {
    console.error('Failed to record analytics event:', event.event_name, error?.message);
  }
  return false;
}

// 서버 라우트에서 쓰는 단축 함수: 응답을 기다리게 하지 않도록 await 없이 호출해도 됩니다.
export function recordServerEvent(eventName, props = {}) {
  if (!SERVER_EVENTS.has(eventName)) return Promise.resolve(false);
  return recordEvent({ event_name: eventName, props });
}
