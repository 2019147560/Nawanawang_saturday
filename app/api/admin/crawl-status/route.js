import { NextResponse } from 'next/server';
import { boardErrorResponse, requireAdmin } from '../../../../lib/admin-board';
import { getCrawlStatus } from '../../../../lib/crawl-status';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(request) {
  try {
    await requireAdmin();
    const body = await request.json().catch(() => ({}));
    const data = await getCrawlStatus(body.sites);
    return NextResponse.json(data);
  } catch (error) {
    return boardErrorResponse(error, NextResponse);
  }
}
