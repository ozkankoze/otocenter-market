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

/**
 * ────────────────────────────────────────────────────────────────────────────
 *  SSL — neden AÇIKÇA veriliyor?
 * ────────────────────────────────────────────────────────────────────────────
 *  `pg` adresteki `sslmode=require` ifadesini kendisi yorumluyor ve her
 *  çalıştırmada şu uyarıyı basıyordu:
 *
 *      SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca'
 *      are treated as aliases for 'verify-full'.
 *
 *  Uyarının kendisi zararsız ama iki sorun yaratıyordu: (1) ekranda tek
 *  görünen satır oydu, betiğin nerede olduğu anlaşılmıyordu; (2) `require`
 *  sessizce `verify-full`e dönüştüğü için sertifika zinciri doğrulanamayan
 *  ağlarda bağlantı beklenmedik şekilde düşüyordu.
 *
 *  Artık SSL seçeneği burada açıkça kuruluyor. Kaçış kapısı: sertifika
 *  doğrulaması ortam kaynaklı bir sebeple başarısız olursa
 *  `PGSSLMODE=no-verify` ile şifreleme korunur, doğrulama kapatılır.
 */
const SSL_PARAMLARI = ['sslmode', 'ssl', 'sslcert', 'sslkey', 'sslrootcert', 'sslnegotiation']

/**
 * SSL ayarını adresten SÖKÜP açık seçeneğe çevirir.
 *
 * Bu sökme işlemi şart: `pg`, `connectionString` içindeki `sslmode`i her zaman
 * açık `ssl` seçeneğinin ÜZERİNE yazar (connection-parameters.js: `config =
 * Object.assign({}, config, parse(config.connectionString))`). Yani adreste
 * `sslmode` kaldığı sürece burada ne yazarsak yazalım hükmü olmaz — ve uyarı
 * satırı basılmaya devam eder.
 */
function sslCoz(url: string): { adres: string; ssl: pg.PoolConfig['ssl'] } {
  let u: URL
  try {
    u = new URL(url)
  } catch {
    return { adres: url, ssl: undefined } // adres ayrıştırılamadı; pg'ye bırak
  }

  const sslmode = process.env.PGSSLMODE || u.searchParams.get('sslmode') || ''
  for (const p of SSL_PARAMLARI) u.searchParams.delete(p)
  const adres = u.toString()

  const yerel = u.hostname === 'localhost' || u.hostname === '127.0.0.1'
  if (sslmode === 'disable') return { adres, ssl: false }
  if (sslmode === 'no-verify') return { adres, ssl: { rejectUnauthorized: false } }
  if (!sslmode && yerel) return { adres, ssl: false }
  return { adres, ssl: { rejectUnauthorized: true } }
}

function createPool(): pg.Pool {
  const ham = process.env.DATABASE_URL
  if (!ham) {
    throw new Error('DATABASE_URL tanımlı değil. .env dosyasını kontrol edin.')
  }
  const { adres: connectionString, ssl } = sslCoz(ham)

  const pool = new Pool({
    connectionString,
    ssl,
    max: Number(process.env.DB_POOL_MAX ?? 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: Number(process.env.DB_CONNECT_TIMEOUT ?? 15_000),
    // Uzak veritabanlarında (Neon) sessiz kalan bağlantıyı aradaki NAT/güvenlik
    // duvarı düşürebilir. Soket ölür ama istemci bunu bilmez; sorgu sonsuza
    // kadar bekler. TCP keep-alive bu ölü bağlantıyı fark ettirir.
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
  })

  /*
   * HİÇBİR SORGU SÜRESİZ BEKLEMESİN.
   *
   * `lock_timeout` en önemlisi: yarıda kesilmiş (Ctrl+C) bir çalıştırma
   * sunucuda açık bir işlem bırakırsa, o işlemin tuttuğu satır kilidi yüzünden
   * sonraki UPDATE sonsuza kadar bekler — hata da vermez, çıktı da. Artık
   * 15 saniyede açık bir hata veriyor.
   *
   * `pg` istemcisi sorguları sıraya alır; buradaki SET'ler bağlantıyı kullanan
   * ilk sorgudan önce çalışır.
   */
  /*
   * `statement_timeout` BOL tutulur (15 dk). Amacı yavaş sorguyu kesmek değil,
   * sonsuza kadar donmuş bir sorgudan çıkmaktır. Kısa tutulursa MEŞRU işler
   * kırılır: uyumluluk çözümlemesi (`resolveCompatibility`) 60 binden fazla
   * satırı tek sorguda işliyor ve 120 saniyeyi rahatlıkla aşabiliyor —
   * denendi, ürün yüklemesi 57014 (statement timeout) ile düştü.
   *
   * Asıl koruma `lock_timeout`tur; takılmaların gerçek sebebi oydu.
   */
  const ifadeSiniri = process.env.PG_STATEMENT_TIMEOUT ?? '900s'
  const kilitSiniri = process.env.PG_LOCK_TIMEOUT ?? '15s'
  pool.on('connect', (client) => {
    void client
      .query(
        `set statement_timeout = '${ifadeSiniri}'; ` +
          `set lock_timeout = '${kilitSiniri}'; ` +
          `set idle_in_transaction_session_timeout = '180s'`,
      )
      .catch((e: unknown) => {
        console.warn('[db] oturum zaman sınırları ayarlanamadı:', e)
      })
  })

  // Havuzdaki boştaki bir bağlantı koparsa pg bunu 'error' ile bildirir.
  // Dinleyici yoksa Node süreci komple düşürür.
  pool.on('error', (e) => {
    console.error('[db] havuz hatası (boştaki bağlantı koptu):', e.message)
  })

  return pool
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
