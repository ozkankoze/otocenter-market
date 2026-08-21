/**
 * ════════════════════════════════════════════════════════════════════════════
 *  VERİTABANI TEŞHİSİ — nerede takılıyor?
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  "Bağlanamıyor" ile "yavaş" arasındaki farkı tahminle değil ÖLÇEREK ayırır.
 *  Bağlantı kurulumunu katman katman söker ve her katmanı ayrı zamanlar:
 *
 *      DNS  →  TCP  →  SSLRequest  →  TLS el sıkışması  →  kimlik doğrulama
 *           →  SELECT 1  →  gerçek sorgular  →  işlem (transaction)
 *
 *  Her aşama BAŞLARKEN ve BİTERKEN satır basar; hiçbir aşama kendi süre
 *  sınırını aşamaz. Böylece takılan aşama, o aşamanın "başladı" satırından
 *  sonra sessizlik olarak değil, açık bir ZAMAN AŞIMI satırı olarak görünür.
 *
 *  Tüm betiğin de bir üst sınırı vardır (OCM_DOCTOR_TIMEOUT, öntanımlı 90 sn);
 *  ne olursa olsun kilitlenip beklemez.
 *
 *  Çalıştırma:  npm run db:doctor
 */
import { loadEnv } from './env'
loadEnv()

import net from 'node:net'
import tls from 'node:tls'
import dns from 'node:dns'
import pg from 'pg'

const TOPLAM_SINIR = Number(process.env.OCM_DOCTOR_TIMEOUT ?? 90_000)

const t0 = Date.now()
const ms = (): string => String(Date.now() - t0).padStart(6)
let sonAsama = '(başlamadı)'

function bas(ad: string): void {
  sonAsama = ad
  process.stdout.write(`[${ms()} ms] → ${ad}\n`)
}
function bit(ad: string, detay = ''): void {
  process.stdout.write(`[${ms()} ms] ✓ ${ad}${detay ? ' — ' + detay : ''}\n`)
}
function hata(ad: string, e: unknown): void {
  const m = e instanceof Error ? e.message : String(e)
  process.stdout.write(`[${ms()} ms] ✗ ${ad} — ${m}\n`)
}

/** Bir işi süre sınırıyla çalıştırır; sınır aşılırsa AÇIKÇA hata verir. */
function sinirli<T>(ad: string, sinirMs: number, is: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const zaman = setTimeout(() => {
      reject(new Error(`ZAMAN AŞIMI (${sinirMs} ms) — burada takılıyor: ${ad}`))
    }, sinirMs)
    is().then(
      (v) => {
        clearTimeout(zaman)
        resolve(v)
      },
      (e) => {
        clearTimeout(zaman)
        reject(e)
      },
    )
  })
}

/** Parolayı ve kullanıcıyı gizleyerek adresin anlamlı kısımlarını gösterir. */
function adresOzeti(url: string): {
  host: string
  port: number
  vt: string
  sslmode: string | null
  pooler: boolean
  channelBinding: string | null
} {
  const u = new URL(url)
  return {
    host: u.hostname,
    port: Number(u.port || 5432),
    vt: u.pathname.replace(/^\//, ''),
    sslmode: u.searchParams.get('sslmode'),
    pooler: /-pooler\./.test(u.hostname),
    channelBinding: u.searchParams.get('channel_binding'),
  }
}

/**
 * PostgreSQL'de TLS düz TLS değildir: önce açık soketten 8 baytlık SSLRequest
 * gönderilir, sunucu tek bayt 'S' (evet) ya da 'N' (hayır) döner, TLS ondan
 * SONRA başlar. Katmanları ayrı ölçebilmek için bu el sıkışmasını elle yaparız.
 */
async function tlsProbu(
  host: string,
  port: number,
  dogrula: { tlsKullan: boolean; dogrula: boolean },
): Promise<{
  tcpMs: number
  sslCevap: string
  tlsMs: number
  protokol: string
  sertifika: string
}> {
  const tcpBas = Date.now()
  const soket: net.Socket = await sinirli(
    'TCP bağlantısı',
    10_000,
    () =>
      new Promise<net.Socket>((resolve, reject) => {
        const s = net.connect({ host, port })
        s.once('connect', () => resolve(s))
        s.once('error', reject)
      }),
  )
  const tcpMs = Date.now() - tcpBas

  const sslCevap: string = await sinirli(
    'SSLRequest yanıtı',
    10_000,
    () =>
      new Promise<string>((resolve, reject) => {
        const paket = Buffer.alloc(8)
        paket.writeInt32BE(8, 0)
        paket.writeInt32BE(80877103, 4)
        soket.once('data', (d: Buffer) => resolve(String.fromCharCode(d[0] ?? 0)))
        soket.once('error', reject)
        soket.write(paket)
      }),
  )

  if (sslCevap !== 'S' || !dogrula.tlsKullan) {
    soket.destroy()
    return { tcpMs, sslCevap, tlsMs: 0, protokol: '-', sertifika: '-' }
  }

  const tlsBas = Date.now()
  const guvenli: tls.TLSSocket = await sinirli(
    'TLS el sıkışması',
    15_000,
    () =>
      new Promise<tls.TLSSocket>((resolve, reject) => {
        // servername = SNI. Neon yönlendirmeyi SNI'ya göre yapar; SNI yoksa
        // bağlantı ya reddedilir ya da yanıtsız kalır. IP adresine SNI konmaz
        // (RFC 6066 izin vermiyor).
        const ipMi = net.isIP(host) !== 0
        const g = tls.connect({
          socket: soket,
          ...(ipMi ? {} : { servername: host }),
          rejectUnauthorized: dogrula.dogrula,
        })
        g.once('secureConnect', () => resolve(g))
        g.once('error', reject)
      }),
  )
  const tlsMs = Date.now() - tlsBas
  const cert = guvenli.getPeerCertificate()
  const sertifika = cert && cert.subject ? String(cert.subject.CN ?? '?') : '?'
  const protokol = guvenli.getProtocol() ?? '?'
  guvenli.destroy()
  return { tcpMs, sslCevap, tlsMs, protokol, sertifika }
}

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('DATABASE_URL tanımlı değil. .env dosyasını kontrol edin.')
    process.exitCode = 1
    return
  }

  const o = adresOzeti(url)
  console.log('\n════ VERİTABANI TEŞHİSİ ════\n')
  console.log(`  sunucu        : ${o.host}:${o.port}`)
  console.log(`  veritabanı    : ${o.vt}`)
  console.log(`  sslmode       : ${o.sslmode ?? '(yok)'}`)
  console.log(`  channel_binding: ${o.channelBinding ?? '(yok)'}`)
  console.log(`  havuzlu adres : ${o.pooler ? 'EVET (-pooler)' : 'hayır (doğrudan)'}`)
  console.log(`  DB_POOL_MAX   : ${process.env.DB_POOL_MAX ?? '(yok → 10)'}`)
  console.log('')

  // ── 1. DNS ────────────────────────────────────────────────────────────────
  bas('DNS çözümlemesi')
  try {
    const adres = await sinirli('DNS çözümlemesi', 8_000, () => dns.promises.lookup(o.host))
    bit('DNS çözümlemesi', `${adres.address} (IPv${adres.family})`)
  } catch (e) {
    hata('DNS çözümlemesi', e)
    console.log('\n  → Sunucu adı çözülemiyor. Adres yanlış ya da ağ/DNS engelli.\n')
    return
  }

  // ── 2-4. TCP → SSLRequest → TLS ───────────────────────────────────────────
  bas('TCP + SSLRequest + TLS')
  try {
    // client.ts ile AYNI kural: sslmode yoksa ve sunucu yerelse TLS kullanılmaz.
    const mod = process.env.PGSSLMODE || o.sslmode || ''
    const yerel = o.host === 'localhost' || o.host === '127.0.0.1'
    const ayar = {
      tlsKullan: mod !== 'disable' && !(mod === '' && yerel),
      dogrula: mod !== 'no-verify',
    }
    const r = await tlsProbu(o.host, o.port, ayar)
    bit('TCP bağlantısı', `${r.tcpMs} ms`)
    bit(
      'SSLRequest',
      `sunucu yanıtı '${r.sslCevap}' ${r.sslCevap === 'S' ? '(TLS kabul)' : '(TLS YOK)'}`,
    )
    if (!ayar.tlsKullan) bit('TLS', 'atlandı — yerel bağlantı, sslmode verilmemiş')
    else if (r.sslCevap === 'S')
      bit('TLS el sıkışması', `${r.tlsMs} ms · ${r.protokol} · sertifika CN=${r.sertifika}`)
  } catch (e) {
    hata('TCP/TLS', e)
    console.log(
      '\n  → Takılma TLS katmanında. Sertifika doğrulaması başarısızsa\n' +
        '    adrese `&sslmode=no-verify` ekleyip tekrar deneyin; bağlanırsa\n' +
        '    sorun sertifika zinciridir, ağ değil.\n',
    )
    return
  }

  // ── 5. pg ile kimlik doğrulama ────────────────────────────────────────────
  bas('pg istemcisiyle bağlanma (kimlik doğrulama dahil)')
  // client.ts ile aynı yöntem: sslmode adresten SÖKÜLÜR, ssl açıkça verilir.
  // Aksi hâlde pg adresteki sslmode'u açık ayarın üzerine yazar ve uyarı basar.
  const temiz = new URL(url)
  const mod2 = process.env.PGSSLMODE || temiz.searchParams.get('sslmode') || ''
  for (const p of ['sslmode', 'ssl', 'sslcert', 'sslkey', 'sslrootcert', 'sslnegotiation']) {
    temiz.searchParams.delete(p)
  }
  const yerel2 = temiz.hostname === 'localhost' || temiz.hostname === '127.0.0.1'
  const sslAyar =
    mod2 === 'disable' || (mod2 === '' && yerel2)
      ? false
      : mod2 === 'no-verify'
        ? { rejectUnauthorized: false }
        : { rejectUnauthorized: true }
  const client = new pg.Client({
    connectionString: temiz.toString(),
    ssl: sslAyar,
    connectionTimeoutMillis: 15_000,
    keepAlive: true,
  })
  try {
    await sinirli('pg connect', 20_000, () => client.connect())
    bit('pg istemcisiyle bağlanma')
  } catch (e) {
    hata('pg istemcisiyle bağlanma', e)
    console.log(
      '\n  → TLS kuruluyor ama kimlik doğrulama tamamlanmıyor.\n' +
        '    Kullanıcı/parola ya da (Neon) channel_binding ayarına bakın.\n',
    )
    return
  }

  try {
    // ── 6. Gidiş-dönüş süresi ───────────────────────────────────────────────
    bas('gidiş-dönüş ölçümü (5 × SELECT 1)')
    const sureler: number[] = []
    for (let i = 0; i < 5; i++) {
      const b = Date.now()
      await sinirli('SELECT 1', 10_000, () => client.query('select 1'))
      sureler.push(Date.now() - b)
    }
    const ort = Math.round(sureler.reduce((a, b) => a + b, 0) / sureler.length)
    bit('gidiş-dönüş', `ortalama ${ort} ms · ${sureler.join('/')} ms`)

    // ── 7. Sunucu bilgisi ───────────────────────────────────────────────────
    bas('sunucu bilgisi')
    const v = await sinirli('sürüm', 10_000, () =>
      client.query(
        'select version() as v, current_database() as db, ' +
          "(select coalesce(ssl::text,'?') from pg_stat_ssl where pid = pg_backend_pid()) as ssl",
      ),
    )
    const satir = v.rows[0] as { v: string; db: string; ssl: string }
    bit('sunucu bilgisi', `${satir.v.split(',')[0]} · vt=${satir.db} · ssl=${satir.ssl}`)

    // Bundan sonrası asla süresiz beklemesin.
    await client.query("set statement_timeout = '20s'")
    await client.query("set lock_timeout = '10s'")

    /*
     * ── 8. AÇIK OTURUMLAR VE KİLİTLER ───────────────────────────────────────
     *
     * `SELECT NOW()` çalışıp `vehicle_type` sorgusu takılıyorsa akla gelen ilk
     * şey ağ değil KİLİTTİR. Ctrl+C ile yarıda kesilen bir çalıştırma sunucuda
     * "idle in transaction" bir oturum bırakmış olabilir; o oturum araç ağacı
     * tablolarındaki kilidi tutmaya devam eder ve sonraki her çalıştırma
     * hiçbir çıktı vermeden sonsuza kadar bekler.
     */
    bas('açık oturumlar ve bekleyen kilitler')
    try {
      const oturumlar = await sinirli('pg_stat_activity', 15_000, () =>
        client.query(
          `select pid, state,
                  coalesce(wait_event_type,'-') as wait_event_type,
                  coalesce(wait_event,'-')      as wait_event,
                  round(extract(epoch from (now() - coalesce(xact_start, query_start, backend_start))))::int as yas_sn,
                  left(regexp_replace(coalesce(query,''), '\\s+', ' ', 'g'), 70) as sorgu
             from pg_stat_activity
            where datname = current_database()
              and pid <> pg_backend_pid()
            order by yas_sn desc
            limit 20`,
        ),
      )
      type Oturum = {
        pid: number
        state: string | null
        wait_event_type: string
        wait_event: string
        yas_sn: number
        sorgu: string
      }
      const satirlar = oturumlar.rows as Oturum[]
      bit('açık oturumlar', `${satirlar.length} adet (kendimiz hariç)`)

      const asili = satirlar.filter(
        (s) => s.state === 'idle in transaction' || (s.state === 'active' && s.yas_sn > 20),
      )
      for (const s of satirlar) {
        const isaret = asili.includes(s) ? '   ⚠' : '    '
        console.log(
          `${isaret} pid ${s.pid} · ${s.state ?? '?'} · ${s.yas_sn} sn · ` +
            `bekleme: ${s.wait_event_type}/${s.wait_event} · ${s.sorgu}`,
        )
      }

      if (asili.length) {
        console.log(
          `\n  ⚠ ${asili.length} ASILI OTURUM VAR. Bunlar araç ağacı tablolarındaki\n` +
            `    kilidi tutuyor olabilir; o zaman senkronizasyon hiç çıktı vermeden\n` +
            `    bekler. Serbest bırakmak için (kendi veritabanınızda güvenlidir):\n` +
            asili.map((s) => `      select pg_terminate_backend(${s.pid});`).join('\n') +
            '\n',
        )
      }

      // Kimin kimi beklediğini doğrudan sor.
      const engeller = await sinirli('pg_blocking_pids', 15_000, () =>
        client.query(
          `select pid, pg_blocking_pids(pid) as engelleyen
             from pg_stat_activity
            where datname = current_database()
              and cardinality(pg_blocking_pids(pid)) > 0`,
        ),
      )
      if (engeller.rowCount) {
        console.log('   ⚠ Kilit zinciri:')
        for (const r of engeller.rows as Array<{ pid: number; engelleyen: number[] }>) {
          console.log(`      pid ${r.pid} ← engelleyen: ${r.engelleyen.join(', ')}`)
        }
      } else {
        bit('kilit zinciri', 'yok — hiçbir oturum bir diğerini beklemiyor')
      }
    } catch (e) {
      hata('açık oturumlar ve kilitler', e)
    }

    // ── 9. Ağaç tabloları — gerçek sorgular ─────────────────────────────────
    for (const tablo of [
      'vehicle_type',
      'vehicle_brand',
      'vehicle_brand_type',
      'vehicle_model',
      'vehicle_generation',
      'vehicle_engine',
    ]) {
      bas(`SELECT count(*) FROM ${tablo}`)
      try {
        const b = Date.now()
        const r = await sinirli(tablo, 25_000, () =>
          client.query(`select count(*)::int as n from ${tablo}`),
        )
        bit(`${tablo}`, `${(r.rows[0] as { n: number }).n} satır · ${Date.now() - b} ms`)
      } catch (e) {
        hata(tablo, e)
      }
    }

    // ── 10. Senkronizasyonun gerçekte attığı en büyük SELECT ───────────────
    bas('vehicle_engine tam okuma (senkronizasyonun ilk büyük sorgusu)')
    try {
      const b = Date.now()
      const r = await sinirli('vehicle_engine tam okuma', 30_000, () =>
        client.query(
          'select id, generation_id, name, slug, displacement_cc, power_kw, power_hp, ' +
            'fuel_type, sort_order, is_active from vehicle_engine',
        ),
      )
      bit('vehicle_engine tam okuma', `${r.rowCount} satır · ${Date.now() - b} ms`)
    } catch (e) {
      hata('vehicle_engine tam okuma', e)
    }

    /*
     * ── 11. İŞLEM TURU + SATIR KİLİDİ SINAMASI ─────────────────────────────
     *
     * Senkronizasyonun ilk yazma işlemi `vehicle_type` üzerinde bir UPDATE'tir.
     * Yarıda kesilmiş bir çalıştırma aynı satırları güncellemiş ve işlemini
     * kapatmamışsa, bu UPDATE SATIR KİLİDİNDE sonsuza kadar bekler — hiçbir
     * hata vermez, hiçbir çıktı basmaz. Tam olarak kullanıcının gördüğü tablo.
     *
     * `FOR UPDATE NOWAIT` beklemez: kilit tutuluysa anında hata verir. Böylece
     * "takılıyor" yerine "şu satır kilitli" cevabını alırız.
     */
    bas('işlem turu: BEGIN → satır kilidi sınaması → 1000 satır INSERT → ROLLBACK')
    try {
      const b = Date.now()
      await sinirli('BEGIN', 15_000, () => client.query('begin'))

      // Her sınama kendi SAVEPOINT'inde: biri başarısız olunca işlem iptal
      // durumuna düşüp geri kalan tabloları sahte hatayla işaretlemesin.
      const kilitli: string[] = []
      for (const tablo of ['vehicle_type', 'vehicle_brand', 'vehicle_model', 'vehicle_engine']) {
        await client.query('savepoint ocm_kilit')
        try {
          const r = await sinirli(`${tablo} satır kilidi`, 15_000, () =>
            client.query(`select id from ${tablo} order by id limit 50 for update nowait`),
          )
          await client.query('release savepoint ocm_kilit')
          bit(`${tablo} satır kilidi`, `${r.rowCount} satır serbest`)
        } catch (e) {
          await client.query('rollback to savepoint ocm_kilit')
          hata(`${tablo} satır kilidi`, e)
          kilitli.push(tablo)
        }
      }
      if (kilitli.length) {
        console.log(
          `\n  ⚠ KİLİTLİ TABLO(LAR): ${kilitli.join(', ')}\n` +
            `    Bu satırları BAŞKA BİR OTURUM tutuyor. Senkronizasyonun hiçbir\n` +
            `    çıktı vermeden süresiz beklemesinin sebebi tam olarak budur.\n` +
            `    Yukarıdaki oturum listesindeki pid'leri sonlandırın:\n` +
            `      select pg_terminate_backend(<pid>);\n`,
        )
      }

      await sinirli('temp tablo', 15_000, () =>
        client.query('create temp table ocm_doctor (n int) on commit drop'),
      )
      const degerler = Array.from({ length: 1000 }, (_, i) => `(${i})`).join(',')
      await sinirli('toplu INSERT', 25_000, () =>
        client.query(`insert into ocm_doctor (n) values ${degerler}`),
      )
      await sinirli('ROLLBACK', 15_000, () => client.query('rollback'))
      bit('işlem turu', `${Date.now() - b} ms · hiçbir şey yazılmadı`)
    } catch (e) {
      hata('işlem turu', e)
      try {
        await client.query('rollback')
      } catch {
        /* yut */
      }
    }

    console.log('\n════ SONUÇ ════')
    console.log(`  Tüm aşamalar tamamlandı. Toplam ${Date.now() - t0} ms.`)
    console.log(`  Gidiş-dönüş ${ort} ms · araç ağacı senkronizasyonu ~125 sorgu atar`)
    console.log(`  → beklenen süre yaklaşık ${Math.round((ort * 125) / 1000)} saniye.\n`)
  } finally {
    await client.end().catch(() => undefined)
  }
}

const kalkan = setTimeout(() => {
  console.error(
    `\n✗ TOPLAM ZAMAN AŞIMI (${TOPLAM_SINIR} ms). Takılan aşama: ${sonAsama}\n` +
      `  Süreç zorla sonlandırıldı; beklemenize gerek kalmadı.\n`,
  )
  process.exit(2)
}, TOPLAM_SINIR)

main()
  .catch((e) => {
    hata(sonAsama, e)
    process.exitCode = 1
  })
  .finally(() => {
    clearTimeout(kalkan)
  })
