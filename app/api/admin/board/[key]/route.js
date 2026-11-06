import { NextResponse } from 'next/server';
import { boardErrorResponse, requireAdmin, writeBoardKey } from '../../../../../lib/admin-board';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  try {
    const user = await requireAdmin();
    const body = await request.json().catch(() => ({}));
    const entry = await writeBoardKey(params.key, body.items, body.baseVersion, user);
    return NextResponse.json(entry);
  } catch (error) {
    return boardErrorResponse(error, NextResponse);
  }
}
