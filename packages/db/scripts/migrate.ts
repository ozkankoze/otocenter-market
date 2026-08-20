import { readdirSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { loadEnv } from './env'

loadEnv()

const MIGRATIONS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../migrations')

async function withClient<T>(fn: (c: pg.Client) => Promise<T>): Promise<T> {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  try {
    return await fn(client)
  } finally {
    await client.end()
  }
}

async function ensureTable(client: pg.Client): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS _ocm_migration (
      name       TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
}

function migrationFiles(): string[] {
  return readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()
}

async function up(): Promise<void> {
  await withClient(async (client) => {
    await ensureTable(client)
    const { rows } = await client.query<{ name: string }>('SELECT name FROM _ocm_migration')
    const applied = new Set(rows.map((r) => r.name))
    const pending = migrationFiles().filter((f) => !applied.has(f))

    if (pending.length === 0) {
      console.log('✓ Uygulanacak yeni migration yok.')
      return
    }

    for (const file of pending) {
      const sqlText = readFileSync(resolve(MIGRATIONS_DIR, file), 'utf8')
      process.stdout.write(`→ ${file} ... `)
      await client.query('BEGIN')
      try {
        await client.query(sqlText)
        await client.query('INSERT INTO _ocm_migration (name) VALUES ($1)', [file])
        await client.query('COMMIT')
        console.log('tamam')
      } catch (err) {
        await client.query('ROLLBACK')
        console.log('HATA')
        throw err
      }
    }
    console.log(`✓ ${pending.length} migration uygulandı.`)
  })
}

async function status(): Promise<void> {
  await withClient(async (client) => {
    await ensureTable(client)
    const { rows } = await client.query<{ name: string; applied_at: Date }>(
      'SELECT name, applied_at FROM _ocm_migration ORDER BY name',
    )
    const applied = new Map(rows.map((r) => [r.name, r.applied_at]))
    for (const file of migrationFiles()) {
      const at = applied.get(file)
      console.log(at ? `✓ ${file}  (${at.toISOString()})` : `· ${file}  (bekliyor)`)
    }
  })
}

async function reset(): Promise<void> {
  await withClient(async (client) => {
    console.log('⚠ public şeması siliniyor...')
    await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
    console.log('✓ Şema sıfırlandı.')
  })
  await up()
}

const command = process.argv[2] ?? 'up'
const commands: Record<string, () => Promise<void>> = { up, status, reset }
const run = commands[command]

if (!run) {
  console.error(`Bilinmeyen komut: ${command}. Kullanım: migrate.ts [up|status|reset]`)
  process.exit(1)
}

run().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
