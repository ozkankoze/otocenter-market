import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'
import type { Database } from './types'

const { Pool, types } = pg

// pg varsayılan olarak NUMERIC ve BIGINT'i string döndürür.
// Fiyatlar (NUMERIC) ve kimlikler (BIGINT) uygulama genelinde `number` olarak
// kullanılıyor; büyüklükleri Number.MAX_SAFE_INTEGER'ın çok altında.
types.setTypeParser(types.builtins.NUMERIC, (v) => Number.parseFloat(v))
types.setTypeParser(types.builtins.INT8, (v) => Number.parseInt(v, 10))

declare global {
  // eslint-disable-next-line no-var
  var __ocmDb: Kysely<Database> | undefined
  // eslint-disable-next-line no-var
  var __ocmPool: pg.Pool | undefined
}

function createPool(): pg.Pool {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL tanımlı değil. .env dosyasını kontrol edin.')
  }
  return new Pool({
    connectionString,
    max: Number(process.env.DB_POOL_MAX ?? 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  })
}

function createDb(): Kysely<Database> {
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      // Havuz TEMBEL kurulur: ilk sorguya kadar DATABASE_URL okunmaz.
      // Böylece .env yükleyen script'ler import sırasından etkilenmez.
      pool: async () => globalThis.__ocmPool ?? (globalThis.__ocmPool = createPool()),
    }),
  })
}

/**
 * Tek Kysely örneği. Next.js dev modunda hot-reload her modül yeniden
 * yüklendiğinde yeni havuz açmasın diye globalThis üzerinde saklanır.
 */
export const db: Kysely<Database> = globalThis.__ocmDb ?? createDb()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__ocmDb = db
}

export async function closeDb(): Promise<void> {
  await db.destroy()
  globalThis.__ocmDb = undefined
  globalThis.__ocmPool = undefined
}
