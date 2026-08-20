/**
 * ════════════════════════════════════════════════════════════════════════════
 *  KATEGORİ GÖRSELİ ÜRETİCİSİ — gerçek fotoğrafı olmayan ürünler için
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  Kaynakta fotoğrafı bulunmayan ürünler için kategorisine uygun bir ÇİZİM
 *  üretir ve üzerine parça kodunu yazar.
 *
 *  NEDEN ÇİZİM, NEDEN "GERÇEKÇİ" GÖRSEL DEĞİL
 *  Yedek parçada müşteri çoğu zaman doğru parçayı seçtiğini görselden teyit
 *  eder. Uydurma ama gerçekçi bir fotoğraf, olmayan bir bilgiyi varmış gibi
 *  gösterir ve yanlış parça siparişine yol açar. Bu yüzden düz çizgi çizimi
 *  kullanılıyor: kart boş durmuyor ama kimse bunu ürünün fotoğrafı sanmıyor.
 *
 *  GERÇEK FOTOĞRAFIN ÜZERİNE YAZMAZ. Ürettiği PNG'lere metadata olarak
 *  `ocm-placeholder` işareti koyar; bir dosyada bu işaret yoksa gerçek
 *  fotoğraftır ve dokunulmaz. İşaret olmasaydı "dosya var mı" bakmak
 *  yeterli olmazdı: fotoğraf silindiğinde yerine sessizce çizim geçer ve
 *  sitede fotoğraf varmış gibi görünmeye devam ederdi.
 *  Gerçek fotoğraf sonradan geldiğinde aynı adla kopyalamak yeterli;
 *  işaret taşımadığı için bir daha üzerine yazılmaz.
 *
 *  Çizim Python + Pillow ile yapılır (kesme betiği de aynı ikiliyi kullanıyor).
 *  ImageMagick'in SVG çevirisi rsvg-convert'e bağlı olduğu ve her ortamda
 *  bulunmadığı için tercih edilmedi.
 *
 *  Çalıştırma: npm run db:urun-gorsel-yertutucu
 */
import { loadEnv } from './env'
loadEnv()

import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { db, closeDb } from '../src/index'
import { PRODUCT_IMAGE_DIR } from './paths'

const OUT = process.env.OUT ? resolve(process.env.OUT) : PRODUCT_IMAGE_DIR

const SHAPE_BY_CATEGORY: Record<string, string> = {
  YAG_FILTRESI: 'YAG',
  HAVA_FILTRESI: 'HAVA',
  POLEN_FILTRESI: 'POLEN',
  YAKIT_FILTRESI: 'YAKIT',
  SANZUMAN_FILTRESI: 'SANZUMAN',
  DIREKSIYON_FILTRESI: 'DIREKSIYON',
  KARTER_HAVALANDIRMA: 'KARTER',
  KURUTUCU_FILTRE: 'KURUTUCU',
  IC_HAVA_FILTRESI: 'ICHAVA',
  AD_BLUE_FILTRESI: 'ADBLUE',
}

/** Site paletiyle aynı renkler (globals.css). */
const PY = `
import sys, json, os
from PIL import Image, ImageDraw, ImageFont
from PIL import PngImagePlugin

MARK = 'ocm-placeholder'

def is_placeholder(path):
    """Dosya bizim ürettiğimiz çizim mi? (PNG metadata işareti)

    Yalnız PNG'de işaret var; WebP/JPEG bir ürün fotoğrafıdır, çizim değildir.
    """
    if not path.lower().endswith('.png'):
        return False
    try:
        with Image.open(path) as im:
            return im.info.get(MARK) == '1'
    except Exception:
        return False

CANVAS = 600
INK_200 = (211, 218, 227)
INK_400 = (151, 163, 178)
INK_600 = (91, 102, 117)
BRAND   = (20, 84, 154)

def font(paths, size):
    for p in paths:
        try:
            return ImageFont.truetype(p, size)
        except OSError:
            continue
    return ImageFont.load_default()

MONO = ['/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
        '/System/Library/Fonts/Menlo.ttc']
SANS = ['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/System/Library/Fonts/Helvetica.ttc']

def pleats(d, x0, x1, y0, y1, step):
    x = x0 + step
    while x < x1:
        d.line([(x, y0), (x, y1)], fill=INK_200, width=3)
        x += step

def draw_shape(d, shape):
    if shape == 'YAG':            # vidalı yağ filtresi
        d.rounded_rectangle([205, 180, 395, 395], radius=16, outline=INK_400, width=7)
        d.rounded_rectangle([190, 150, 410, 192], radius=12, outline=INK_400, width=7)
        d.ellipse([284, 155, 316, 187], outline=INK_200, width=6)
        pleats(d, 215, 385, 212, 368, 26)
    elif shape == 'HAVA':         # yuvarlak hava filtresi
        d.ellipse([180, 141, 420, 209], outline=INK_400, width=7)
        d.line([(180, 175), (180, 385)], fill=INK_400, width=7)
        d.line([(420, 175), (420, 385)], fill=INK_400, width=7)
        d.ellipse([180, 351, 420, 419], outline=INK_400, width=7)
        pleats(d, 196, 404, 200, 372, 24)
    elif shape == 'POLEN':        # yassı kabin filtresi
        d.rounded_rectangle([150, 215, 450, 355], radius=10, outline=INK_400, width=7)
        pleats(d, 160, 440, 228, 342, 20)
        d.line([(150, 215), (150, 355)], fill=INK_400, width=9)
        d.line([(450, 215), (450, 355)], fill=INK_400, width=9)
    elif shape == 'SANZUMAN':     # otomatik şanzuman karter filtresi (yassı, emme ağızlı)
        d.rounded_rectangle([130, 205, 470, 375], radius=18, outline=INK_400, width=7)
        pleats(d, 142, 458, 218, 362, 22)
        d.ellipse([268, 258, 332, 322], outline=INK_400, width=7)
        d.line([(300, 175), (300, 258)], fill=INK_400, width=9)
        d.ellipse([282, 157, 318, 193], outline=INK_400, width=7)
    elif shape == 'DIREKSIYON':   # hidrolik direksiyon filtresi (küçük, silindirik, tek ağızlı)
        d.rounded_rectangle([255, 215, 345, 385], radius=12, outline=INK_400, width=7)
        pleats(d, 264, 336, 232, 368, 18)
        d.line([(300, 180), (300, 215)], fill=INK_400, width=9)
        d.ellipse([278, 158, 322, 202], outline=INK_400, width=7)
        d.arc([255, 370, 345, 400], 0, 180, fill=INK_400, width=7)
    elif shape == 'KARTER':       # karter havalandırma (yağ ayırıcı — gövde + yan çıkış)
        d.rounded_rectangle([210, 200, 390, 400], radius=22, outline=INK_400, width=7)
        d.ellipse([255, 245, 345, 335], outline=INK_400, width=7)
        pleats(d, 268, 332, 258, 322, 14)
        d.line([(390, 250), (455, 250)], fill=INK_400, width=9)
        d.line([(300, 400), (300, 435)], fill=INK_400, width=9)
        d.ellipse([445, 236, 473, 264], outline=INK_400, width=7)
    elif shape == 'KURUTUCU':     # hava kurutucu kartuşu (vidalı, geniş gövde)
        d.rounded_rectangle([200, 190, 400, 400], radius=16, outline=INK_400, width=7)
        d.rounded_rectangle([232, 150, 368, 190], radius=8, outline=INK_400, width=7)
        pleats(d, 214, 386, 210, 380, 18)
        d.line([(200, 415), (400, 415)], fill=INK_400, width=9)
    elif shape == 'ICHAVA':       # iç hava (güvenlik) filtresi — ince, uzun silindir
        d.rounded_rectangle([250, 165, 350, 425], radius=10, outline=INK_400, width=7)
        pleats(d, 260, 340, 180, 410, 16)
        d.ellipse([258, 150, 342, 182], outline=INK_400, width=7)
        d.ellipse([258, 408, 342, 440], outline=INK_400, width=7)
    elif shape == 'ADBLUE':       # AdBlue (SCR) filtresi — küçük kartuş + yan bağlantı
        d.rounded_rectangle([245, 215, 355, 385], radius=14, outline=INK_400, width=7)
        pleats(d, 256, 344, 232, 368, 16)
        d.line([(355, 260), (415, 260)], fill=INK_400, width=9)
        d.line([(300, 185), (300, 215)], fill=INK_400, width=9)
        d.ellipse([282, 165, 318, 201], outline=INK_400, width=7)
    else:                         # hat üstü yakıt filtresi
        d.rounded_rectangle([240, 185, 360, 400], radius=14, outline=INK_400, width=7)
        d.line([(300, 152), (300, 185)], fill=INK_400, width=9)
        d.line([(300, 400), (300, 432)], fill=INK_400, width=9)
        d.ellipse([286, 126, 314, 154], outline=INK_400, width=7)
        pleats(d, 250, 350, 208, 378, 22)

def center(d, text, y, f, fill):
    x0, y0, x1, y1 = d.textbbox((0, 0), text, font=f)
    d.text(((CANVAS - (x1 - x0)) / 2 - x0, y), text, font=f, fill=fill)

jobs = json.loads(sys.argv[1])
drawn, kept = [], []
for job in jobs:
    # GERÇEK FOTOĞRAF HANGİ UZANTIDA OLURSA OLSUN KORUNUR.
    # Ürün fotoğrafları WebP'ye çevrildi (klasör 209 MB → 16 MB); yer tutucu
    # çizimler PNG kalıyor çünkü "bunu ben çizdim" işareti PNG metadata'sında
    # duruyor. Yalnız .png'ye bakmak, WebP fotoğrafın üstüne çizim basardı.
    kok = os.path.splitext(job['path'])[0]
    varolan = [kok + e for e in ('.webp', '.jpg', '.jpeg', '.png') if os.path.exists(kok + e)]
    gercek = [f for f in varolan if not is_placeholder(f)]
    if gercek:
        kept.append(job['sku'])          # gerçek fotoğraf — dokunma
        continue
    im = Image.new('RGB', (CANVAS, CANVAS), 'white')
    d = ImageDraw.Draw(im)
    draw_shape(d, job['shape'])
    # Marka satırı yok: kartta ve detay sayfasında zaten markanın kendisi
    # yazıyor; görsele de koymak aynı bilgiyi üç kez tekrar ettiriyordu.
    center(d, job['code'], 470, font(MONO, 38), BRAND)
    center(d, 'Ürün görseli hazırlanıyor', 518, font(SANS, 18), INK_400)
    meta = PngImagePlugin.PngInfo()
    meta.add_text(MARK, '1')
    im.save(job['path'], optimize=True, pnginfo=meta)
    drawn.append(job['sku'])
print(json.dumps({'drawn': drawn, 'kept': kept}))
`

/** Python3 ve Pillow kurulu mu? Kurulu değilse çizim adımı atlanır. */
function pillowVarMi(): boolean {
  try {
    execFileSync('python3', ['-c', 'import PIL, numpy'], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

async function main(): Promise<void> {
  mkdirSync(OUT, { recursive: true })

  const products = await db
    .selectFrom('product as p')
    .innerJoin('product_brand as b', 'b.id', 'p.brand_id')
    .innerJoin('category as c', 'c.id', 'p.category_id')
    .select(['p.sku as sku', 'p.product_code as code', 'b.name as brand', 'c.code as category'])
    .where('p.status', '=', 'ACTIVE')
    .orderBy('p.sku')
    .execute()

  // Gerçek fotoğraf mı çizim mi ayrımını Python yapar (PNG metadata işareti).
  const jobs: Array<{ sku: string; path: string; shape: string; code: string; brand: string }> = []
  const unknownCategory: string[] = []

  for (const p of products) {
    const shape = SHAPE_BY_CATEGORY[p.category]
    if (!shape) {
      unknownCategory.push(`${p.sku} (${p.category})`)
      continue
    }
    jobs.push({
      sku: p.sku,
      path: resolve(OUT, `${p.sku}.png`),
      shape,
      code: p.code ?? p.sku,
      brand: p.brand,
    })
  }

  let drawn: string[] = []
  let kept: string[] = []
  if (jobs.length > 0) {
    if (!pillowVarMi()) {
      // Bu adım İSTEĞE BAĞLIDIR: yalnızca fotoğrafı OLMAYAN ürünler için
      // kategori çizimi üretir. Python/Pillow yoksa çizim üretilmez ama
      // depodaki gerçek fotoğraflar yerinde durur ve bağlama adımı çalışır.
      // (Eskiden burada süreç çöküyor, ardından gelen bağlama adımı hiç
      // çalışmıyordu; sonuç: TEK BİR ürünün bile görseli görünmüyordu.)
      console.log(
        '\n! Python3 + Pillow bulunamadı — kategori çizimi ADIMI ATLANDI.\n' +
          '  Depodaki gerçek ürün fotoğrafları etkilenmez, bağlanmaya devam eder.\n' +
          '  Çizimleri de üretmek isterseniz: pip install pillow numpy\n',
      )
      return
    }
    /*
     * İŞ LİSTESİ PARÇALANIR.
     *
     * Katalog büyüdükçe tüm iş listesi tek argv olarak geçirilemez oluyor
     * (E2BIG): 1000+ ürünle argüman 150 KB'ı aşıyor ve `execFileSync`
     * pid: 0 ile, anlaşılmaz bir hatayla düşüyor. Bu da "Pillow yok"
     * sanılıp ADIMIN SESSİZCE ATLANMASINA yol açıyordu.
     */
    const PARCA = 200
    for (let i = 0; i < jobs.length; i += PARCA) {
      const out = execFileSync('python3', ['-c', PY, JSON.stringify(jobs.slice(i, i + PARCA))], {
        encoding: 'utf8',
        maxBuffer: 32 * 1024 * 1024,
      })
      const r = JSON.parse(out.trim()) as { drawn: string[]; kept: string[] }
      drawn = drawn.concat(r.drawn)
      kept = kept.concat(r.kept)
    }
  }

  console.log(
    `\n${kept.length} üründe gerçek fotoğraf var (dokunulmadı) · ` +
      `${drawn.length} üründe kategori görseli`,
  )
  if (unknownCategory.length) {
    console.log(`! Şekli tanımlı olmayan kategori: ${unknownCategory.join(', ')}`)
  }
  console.log('')
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(closeDb)
