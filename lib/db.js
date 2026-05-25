import pg from 'pg';

const { Pool } = pg;

const globalForPg = globalThis;

export const pool =
  globalForPg.__pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.POSTGRES_SSL === 'false' ? false : { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPg.__pgPool = pool;
}

export function assertDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
}

export async function query(text, params) {
  assertDatabaseUrl();
  return pool.query(text, params);
}
