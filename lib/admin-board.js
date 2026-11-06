import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { isAdminUser } from './admin';
import { query } from './db';
import { eq, hasSupabaseRestConfig, supabaseRequest } from './supabase-rest';

export const BOARD_KEYS = new Set([
  'crawl_sites',
  'priorities',
  'links',
  'contacts',
  'community',
  'feedback',
  'inquiries',
]);

const MAX_ITEMS = 500;
const MAX_BYTES = 200_000;

export class BoardError extends Error {
  constructor(code, status, message, extra = {}) {
    super(message);
    this.code = code;
    this.status = status;
    this.extra = extra;
  }
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new BoardError('UNAUTHENTICATED', 401, '로그인이 필요합니다.');
  if (!isAdminUser(session.user)) throw new BoardError('FORBIDDEN', 403, '관리자만 사용할 수 있습니다.');
  return session.user;
}

function isMissingTable(error) {
  const text = String(error?.message || '');
  return error?.code === '42P01' || /PGRST205|42P01|does not exist|Could not find the table/i.test(text);
}

function toStorageError(error) {
  if (error instanceof BoardError) return error;
  if (isMissingTable(error)) {
    return new BoardError('NO_TABLE', 503, 'admin_board 테이블이 없습니다. db/admin-board.sql을 실행해 주세요.');
  }
  console.error('admin_board storage error:', error?.message);
  return new BoardError('STORAGE', 500, '저장소에 접근하지 못했습니다.');
}

function hasStorage() {
  return hasSupabaseRestConfig() || Boolean(process.env.DATABASE_URL);
}

function rowToEntry(row) {
  return {
    items: Array.isArray(row?.value?.items) ? row.value.items : [],
    version: row?.version ?? 0,
    updatedAt: row?.updated_at ?? null,
    updatedBy: row?.updated_by ?? null,
  };
}

export async function readBoard() {
  if (!hasStorage()) throw new BoardError('NO_STORAGE', 503, '저장소 환경변수가 설정되지 않았습니다.');
  try {
    let rows;
    if (hasSupabaseRestConfig()) {
      rows = await supabaseRequest('admin_board?select=key,value,version,updated_at,updated_by');
    } else {
      rows = (await query('SELECT key, value, version, updated_at, updated_by FROM admin_board')).rows;
    }
    const board = {};
    for (const row of rows || []) {
      if (BOARD_KEYS.has(row.key)) board[row.key] = rowToEntry(row);
    }
    return board;
  } catch (error) {
    throw toStorageError(error);
  }
}

function validateItems(items) {
  if (!Array.isArray(items)) throw new BoardError('INVALID', 400, 'items는 배열이어야 합니다.');
  if (items.length > MAX_ITEMS) throw new BoardError('INVALID', 400, `항목은 ${MAX_ITEMS}개까지 저장할 수 있습니다.`);
  const clean = items
    .filter((it) => it && typeof it === 'object' && !Array.isArray(it))
    .map((it) => {
      const out = {};
      for (const [k, v] of Object.entries(it)) {
        if (typeof k !== 'string' || k.length > 40) continue;
        if (typeof v === 'string') out[k] = v.slice(0, 2000);
        else if (typeof v === 'number' && Number.isFinite(v)) out[k] = v;
        else if (typeof v === 'boolean') out[k] = v;
      }
      return out;
    });
  if (JSON.stringify(clean).length > MAX_BYTES) throw new BoardError('INVALID', 400, '저장할 내용이 너무 큽니다.');
  return clean;
}

// baseVersion이 저장소의 현재 version과 같을 때만 저장합니다. 아니면 409(CONFLICT).
export async function writeBoardKey(key, items, baseVersion, user) {
  if (!BOARD_KEYS.has(key)) throw new BoardError('NOT_FOUND', 404, '알 수 없는 항목입니다.');
  if (!hasStorage()) throw new BoardError('NO_STORAGE', 503, '저장소 환경변수가 설정되지 않았습니다.');
  const clean = validateItems(items);
  const base = Number.parseInt(baseVersion, 10) || 0;
  const updatedBy = String(user?.name || user?.email || '관리자').slice(0, 80);
  const value = { items: clean };

  try {
    let row = null;
    if (hasSupabaseRestConfig()) {
      if (base === 0) {
        const rows = await supabaseRequest('admin_board?on_conflict=key&select=key,value,version,updated_at,updated_by', {
          method: 'POST',
          body: { key, value, version: 1, updated_by: updatedBy },
          prefer: 'resolution=ignore-duplicates,return=representation',
        });
        row = rows?.[0] || null;
      } else {
        const rows = await supabaseRequest(
          `admin_board?key=eq.${eq(key)}&version=eq.${base}&select=key,value,version,updated_at,updated_by`,
          {
            method: 'PATCH',
            body: { value, version: base + 1, updated_at: new Date().toISOString(), updated_by: updatedBy },
            prefer: 'return=representation',
          },
        );
        row = rows?.[0] || null;
      }
    } else if (base === 0) {
      const result = await query(
        `INSERT INTO admin_board (key, value, version, updated_by) VALUES ($1, $2, 1, $3)
         ON CONFLICT (key) DO NOTHING
         RETURNING key, value, version, updated_at, updated_by`,
        [key, JSON.stringify(value), updatedBy],
      );
      row = result.rows[0] || null;
    } else {
      const result = await query(
        `UPDATE admin_board SET value = $2, version = version + 1, updated_at = NOW(), updated_by = $4
         WHERE key = $1 AND version = $3
         RETURNING key, value, version, updated_at, updated_by`,
        [key, JSON.stringify(value), base, updatedBy],
      );
      row = result.rows[0] || null;
    }

    if (!row) {
      const current = (await readBoard())[key] || rowToEntry(null);
      throw new BoardError('CONFLICT', 409, '다른 사람이 먼저 수정했어요. 최신 내용을 불러왔어요.', { current });
    }
    return rowToEntry(row);
  } catch (error) {
    throw toStorageError(error);
  }
}

export function boardErrorResponse(error, NextResponse) {
  const e = toStorageError(error);
  return NextResponse.json({ code: e.code, message: e.message, ...e.extra }, { status: e.status });
}
