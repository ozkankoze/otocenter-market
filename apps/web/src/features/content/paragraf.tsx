import Link from 'next/link'

/**
 * REHBER PARAGRAFLARINDA METİN İÇİ BAĞLANTI
 *
 * Rehber metinleri düz dizge olarak tutuluyor — bilerek: içerik dosyası JSX'e
 * dönüşürse yazı yazmak kod yazmaya döner. Ama metin içi bağlantı SEO açısından
 * önemli: konu geçtiği yerde verilen bir iç bağlantı, sayfa sonundaki bağlantı
 * listesinden çok daha değerli (hem kullanıcı hem tarama için).
 *
 * Bu yüzden paragraflarda tek bir işaretleme destekleniyor:
 *
 *     [görünen metin](/hedef/yol "bağlantı başlığı")
 *
 * Başlık kısmı zorunlu — sitedeki her bağlantının `title` etiketi olması
 * gerekiyor (SEO denetimi bunu ayrıca istiyordu).
 *
 * Yalnızca SİTE İÇİ yollar (`/` ile başlayan) kabul edilir. Dış bağlantı
 * gerekirse bilinçli bir karar olmalı ve `rel` değeriyle birlikte ayrıca
 * eklenmeli — kazara dofollow dış bağlantı üretilmesin.
 */

/** [metin](/yol "başlık") */
const BAGLANTI = /\[([^\]]+)\]\((\/[^\s)]*)\s+"([^"]+)"\)/g

export function Paragraf({ metin }: { metin: string }) {
  const parcalar: React.ReactNode[] = []
  let son = 0

  for (const eslesme of metin.matchAll(BAGLANTI)) {
    const [tam, etiket, yol, baslik] = eslesme
    const bas = eslesme.index
    if (bas > son) parcalar.push(metin.slice(son, bas))
    parcalar.push(
      <Link key={`${yol}-${bas}`} href={yol as string} prefetch={false} title={baslik}>
        {etiket}
      </Link>,
    )
    son = bas + tam.length
  }

  if (son === 0) return <>{metin}</>
  if (son < metin.length) parcalar.push(metin.slice(son))
  return <>{parcalar}</>
}
