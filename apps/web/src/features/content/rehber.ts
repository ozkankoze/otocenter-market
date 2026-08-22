/**
 * TEKNİK REHBER YAZILARI.
 *
 * Blog içeriği veritabanında tutulmuyor; bir içerik yönetim katmanı da yok.
 * Yazılar burada, sürüm kontrolü altında duruyor — yeni yazı eklemek bu
 * dosyaya bir kayıt eklemekten ibaret.
 *
 * İÇERİK KURALI: bakım aralıkları araç, motor ve kullanım koşuluna göre
 * değişir. Bu yüzden metinlerde kesin rakam vaat edilmez; her yazı kullanıcıyı
 * aracın kendi bakım kitapçığına yönlendirir. Uydurulmuş "uzman görüşü",
 * yazar adı ya da yayın tarihi kullanılmaz.
 */
export type RehberYazisi = {
  slug: string
  title: string
  /** Liste kartında ve meta açıklamada kullanılır. */
  summary: string
  /** Kart üstündeki küçük etiket. */
  tag: string
  /** Okuma süresi (dakika) — metin uzunluğundan elle belirlendi. */
  readMinutes: number
  /** İlgili kategori sayfası — yazıdan katalog tarafına geçiş. */
  relatedHref: string
  relatedLabel: string
  body: Array<{ heading: string; paragraphs: string[]; list?: string[] }>
}

export const REHBER_YAZILARI: RehberYazisi[] = [
  {
    slug: 'hava-filtresi-ne-zaman-degisir',
    title: 'Hava filtresi ne zaman değişir?',
    summary:
      'Hava filtresi motora giren havayı temizler. Tıkanmış bir filtre yakıt tüketimini artırır ve performansı düşürür. Değişim zamanını nasıl anlarsınız?',
    tag: 'Bakım',
    readMinutes: 3,
    relatedHref: '/filtreler/hava-filtreleri',
    relatedLabel: 'Hava filtrelerine göz atın',
    body: [
      {
        heading: 'Hava filtresi ne işe yarar?',
        paragraphs: [
          'Motor, yaktığı her litre yakıt için binlerce litre hava emer. Bu havanın içindeki toz, polen ve partiküller silindire ulaşırsa hem yanma verimi düşer hem de silindir cidarı ile piston segmanları aşınır. Hava filtresi bu partikülleri tutar.',
          'Filtre zamanla dolduğunda motora giren hava azalır. Motor aynı gücü üretebilmek için daha çok yakıt harcar; ivmelenme tembelleşir, rölanti dengesizleşebilir.',
        ],
      },
      {
        heading: 'Değişim zamanı geldiğini nasıl anlarsınız?',
        paragraphs: [
          'Kesin süre aracın bakım kitapçığında yazar ve kullanım koşuluna göre ciddi biçimde değişir. Tozlu yolda, şantiyede ya da yoğun şehir trafiğinde çalışan bir araçta filtre çok daha hızlı dolar.',
        ],
        list: [
          'Filtreyi ışığa tuttuğunuzda kâğıt katmanlarının arasından ışık geçmiyorsa doludur.',
          'Yakıt tüketiminde başka bir sebeple açıklanamayan artış varsa filtreye bakın.',
          'Gaza basıldığında tepkinin geciktiğini hissediyorsanız hava akışı kısıtlanmış olabilir.',
          'Filtre kutusunun içinde yaprak, böcek ya da kum birikmişse temizleyip filtreyi yenileyin.',
        ],
      },
      {
        heading: 'Doğru filtreyi seçmek',
        paragraphs: [
          'Hava filtresi ölçüsü aynı model içinde bile motor seçeneğine göre değişebilir. Bu yüzden sitede filtreleri araç modeline değil, motora göre eşleştiriyoruz. Aracınızı seçtiğinizde yalnızca o motora uyan ürünler listelenir.',
          'Emin olamadığınız durumda ruhsatınızdaki şasi numarasını bize iletin; doğrulamayı biz yapalım.',
        ],
      },
    ],
  },
  {
    slug: 'yag-filtresi-ve-motor-yagi-birlikte-mi',
    title: 'Yağ filtresi her yağ değişiminde yenilenmeli mi?',
    summary:
      'Kısa cevap: evet. Yağ filtresi, yağın taşıdığı metal parçacıkları ve kurumu tutar; dolmuş bir filtre baypas valfini açar ve motora filtresiz yağ gider.',
    tag: 'Bakım',
    readMinutes: 3,
    relatedHref: '/filtreler/yag-filtreleri',
    relatedLabel: 'Yağ filtrelerine göz atın',
    body: [
      {
        heading: 'Filtre neden yağla birlikte değişir?',
        paragraphs: [
          'Yağ filtresi, motor içinde oluşan metal aşınma parçacıklarını, kurumu ve oksitlenme artıklarını tutar. Yağ yenilenip filtre eski kalırsa, filtrenin içinde biriken kirli yağ yeni yağa karışır — bakımın anlamı büyük ölçüde kaybolur.',
          'Daha önemlisi: dolmuş bir filtrenin üzerindeki baypas valfi açılır. Bu, motorun yağsız kalmaması için konulmuş bir güvenlik önlemidir ama açıldığı andan itibaren motora filtrelenmemiş yağ gider.',
        ],
      },
      {
        heading: 'Kartuş mu, komple filtre mi?',
        paragraphs: [
          'İki tip yaygındır. Komple (spin-on) filtrelerde metal gövde ve filtre elemanı tek parçadır; sökülüp yenisi takılır. Kartuş tipte ise yalnızca içindeki eleman ve contalar değişir, gövde araçta kalır.',
          'Kartuş tipte contaların da yenilenmesi gerekir; çoğu ürün conta setiyle birlikte gelir. Ürün sayfasındaki teknik özellikler bölümünde tipi görebilirsiniz.',
        ],
      },
      {
        heading: 'Yağ seçimi filtreyi etkiler mi?',
        paragraphs: [
          'Filtre seçimi yağın viskozitesine göre değil, motorun kendisine göre yapılır. Ancak yağ değişim aralığını uzatan “long life” yağ kullanıyorsanız, filtrenin de o aralığa uygun olması gerekir. Araç üreticisinin bakım kitapçığı burada belirleyicidir.',
        ],
      },
    ],
  },
  {
    slug: 'polen-filtresi-neden-onemli',
    title: 'Polen filtresi: kabin havasının sessiz bekçisi',
    summary:
      'Polen filtresi motorun değil, sizin soluduğunuz havanın filtresidir. Tıkandığında klima performansı düşer, camlar geç açılır ve kabinde koku oluşur.',
    tag: 'Konfor',
    readMinutes: 2,
    relatedHref: '/filtreler/polen-kabin-filtreleri',
    relatedLabel: 'Polen / kabin filtrelerine göz atın',
    body: [
      {
        heading: 'Ne yapar?',
        paragraphs: [
          'Polen filtresi, havalandırma sisteminden kabine giren havadaki polen, toz, is ve partikülleri tutar. Aktif karbonlu tipler ayrıca egzoz kokusu ve ozon gibi gaz kirleticileri de büyük ölçüde tutar.',
          'Alerjisi olan sürücüler için bu filtre konfor değil, doğrudan sağlık meselesidir.',
        ],
      },
      {
        heading: 'Tıkandığını gösteren işaretler',
        paragraphs: [],
        list: [
          'Fan en yüksek kademedeyken bile üfleme zayıfsa.',
          'Klima açıldığında küf ya da nem kokusu geliyorsa.',
          'Ön cam buğusu eskisine göre çok daha geç açılıyorsa.',
          'Kabinde toz birikimi belirgin şekilde arttıysa.',
        ],
      },
      {
        heading: 'Standart mı, aktif karbonlu mu?',
        paragraphs: [
          'Standart polen filtresi partikülleri tutar; aktif karbonlu tip buna gaz ve koku tutma özelliği ekler. İkisi genellikle aynı ölçüdedir ve birbirinin yerine takılabilir. Yoğun trafikte çok vakit geçiriyorsanız aktif karbonlu tip belirgin fark yaratır.',
        ],
      },
    ],
  },
  {
    slug: 'oem-numarasi-ile-parca-bulma',
    title: 'OEM numarasıyla parça bulmak',
    summary:
      'Elinizde eski parçanın üzerindeki numara varsa doğru ürünü bulmanın en kesin yolu odur. OEM, muadil ve çapraz numara kavramları ne anlama gelir?',
    tag: 'Rehber',
    readMinutes: 3,
    relatedHref: '/filtreler',
    relatedLabel: 'Tüm filtreleri görün',
    body: [
      {
        heading: 'OEM numarası nedir?',
        paragraphs: [
          'OEM (Original Equipment Manufacturer) numarası, araç üreticisinin o parçaya verdiği kendi kod numarasıdır. Araç markasının yedek parça kataloğunda bu numarayla aranır.',
          'Filtre üreticilerinin (MANN-FILTER, FILTRON gibi) ise kendi kodları vardır. Aynı fiziksel filtrenin bir OEM numarası, bir de her üreticide ayrı bir ürün kodu bulunur.',
        ],
      },
      {
        heading: 'Çapraz (cross) numara ne demek?',
        paragraphs: [
          'Bir üreticinin ürününün, başka bir üreticinin hangi ürününe karşılık geldiğini gösteren eşleştirmedir. Elinizde eski filtrenin üzerindeki kod varsa, çapraz eşleştirme sayesinde farklı bir markadan aynı ölçüdeki ürünü bulabilirsiniz.',
        ],
      },
      {
        heading: 'Sitede nasıl ararsınız?',
        paragraphs: [
          'Arama kutusuna ürün adı yazabileceğiniz gibi parça kodunu ya da OEM numarasını da yazabilirsiniz. Numaradaki tire, boşluk ve nokta farkları önemsizdir; arama bunları yok sayarak eşleştirir.',
          'Numaranız yoksa aracınızı marka → model → motor sırasıyla seçin. Bu yol daha kesindir, çünkü uyumluluk motor kodu seviyesinde tutulur.',
        ],
      },
    ],
  },
]

export function rehberBul(slug: string): RehberYazisi | null {
  return REHBER_YAZILARI.find((y) => y.slug === slug) ?? null
}
