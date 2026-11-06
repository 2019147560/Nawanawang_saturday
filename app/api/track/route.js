import { NextResponse } from 'next/server';
import { CLIENT_EVENTS, detectDevice, recordEvent } from '../../../lib/analytics';

export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 4000;

function referrerHost(referrer, ownHost) {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).host;
    return host && host !== ownHost ? host : null;
  } catch {
    return null;
  }
}

export async function POST(request) {
  const text = await request.text();
  if (!text || text.length > MAX_BODY_BYTES) {
    return new NextResponse(null, { status: 204 });
  }

  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const name = String(body?.event || '');
  if (!CLIENT_EVENTS.has(name)) {
    return new NextResponse(null, { status: 204 });
  }

  const device = detectDevice(request.headers.get('user-agent'));
  if (device === 'bot') {
    return new NextResponse(null, { status: 204 });
  }

  const ownHost = request.headers.get('host');

  await recordEvent({
    event_name: name,
    session_id: body.sessionId,
    path: body.path,
    referrer_host: referrerHost(body.referrer, ownHost),
    utm_source: body.utm?.source,
    utm_medium: body.utm?.medium,
    utm_campaign: body.utm?.campaign,
    device,
    program_id: body.programId,
    search_query: body.searchQuery,
    result_count: body.resultCount,
    props: body.props,
  });

  // 기록 성공 여부와 관계없이 204: 추적 실패가 화면에 영향을 주지 않게 합니다.
  return new NextResponse(null, { status: 204 });
}
