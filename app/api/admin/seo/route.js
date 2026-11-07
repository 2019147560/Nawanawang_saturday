import { NextResponse } from 'next/server';
import { boardErrorResponse, requireAdmin } from '../../../../lib/admin-board';
import { getSeo } from '../../../../lib/seo';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(request) {
  try {
    await requireAdmin();
    const params = new URL(request.url).searchParams;
    const keywords = (params.get('keywords') || '').split('|');
    const data = await getSeo(keywords, { force: params.get('refresh') === '1' });
    return NextResponse.json(data);
  } catch (error) {
    return boardErrorResponse(error, NextResponse);
  }
}
