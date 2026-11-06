import { NextResponse } from 'next/server';
import { boardErrorResponse, readBoard, requireAdmin } from '../../../../lib/admin-board';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    const board = await readBoard();
    return NextResponse.json({ board });
  } catch (error) {
    return boardErrorResponse(error, NextResponse);
  }
}
