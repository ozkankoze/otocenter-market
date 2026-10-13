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
/** Bir bölümdeki isteğe bağlı tablo. Değişim aralıkları gibi karşılaştırmalı veri için. */
export type RehberTablosu = {
  /** Tablonun ne anlattığı — `<caption>` olarak basılır, ekran okuyucu bunu okur. */
  caption: string
  head: string[]
  rows: string[][]
}

export type RehberBolumu = {
  heading: string
  paragraphs: string[]
  /** Sırasız liste — belirtiler, ipuçları. */
  list?: string[]
  /** Sıralı liste — adım adım işlem. `<ol>` olarak basılır. */
  steps?: string[]
  table?: RehberTablosu
}

/**
 * Sıkça sorulan soru.
 *
 * Sayfada görünür biçimde basılır VE Article/FAQPage yapısal verisine
 * dönüştürülür. Google bunu arama sonucunda açılır soru-cevap kutusu olarak
 * gösterebilir. Cevap KENDİ BAŞINA anlamlı olmalı — zengin sonuçta sorunun
 * bağlamı görünmez.
 */
export type RehberSorusu = { q: string; a: string }

export type RehberYazisi = {
  slug: string
  title: string
  /**
   * Arama sonucundaki başlık. Sayfadaki H1'den KISA olabilir.
   *
   * Google başlığı ~60 karakterde keser. H1 uzun ve açıklayıcı olabilir ama
   * arama sonucunda kesilen bir başlık tıklama kaybettirir; bu alan verilirse
   * `<title>` ondan üretilir ve kök şablon atlanır (marka adı iki kez yazılmaz).
   */
  metaTitle?: string
  /** Liste kartında ve meta açıklamada kullanılır. */
  summary: string
  /** Kart üstündeki küçük etiket. */
  tag: string
  /** Okuma süresi (dakika) — metin uzunluğundan elle belirlendi. */
  readMinutes: number
  /** İlgili kategori sayfası — yazıdan katalog tarafına geçiş. */
  relatedHref: string
  relatedLabel: string
  /**
   * Başlıktan önce gelen giriş paragrafları.
   *
   * İlk paragraf soruyu DOĞRUDAN cevaplar. Google öne çıkan snippet'i çoğunlukla
   * sayfanın ilk net cevabından alır; cevabı üç paragraf sonra vermek o şansı
   * harcar.
   */
  intro?: string[]
  body: RehberBolumu[]
  sss?: RehberSorusu[]
  /**
   * Metnin son gözden geçirildiği gerçek tarih (ISO). Yapısal veride
   * `dateModified` olarak kullanılır.
   *
   * UYDURULMAZ. Tarih bilinmiyorsa alan boş bırakılır ve yapısal veriye hiç
   * yazılmaz — yanlış bir tarih, tarih olmamasından kötüdür.
   */
  guncelleme?: string
  /** Yazının ucundan gidilebilecek diğer rehberler. */
  ilgiliYazilar?: string[]
}

export const REHBER_YAZILARI: RehberYazisi[] = [
  {
    slug: 'hava-filtresi-ne-zaman-degisir',
    title: 'Hava Filtresi Ne Zaman Değiştirilir? Kaç Km’de Bir Değişir?',
    // 55 karakter — Google'ın ~60 karakterlik kesme sınırının altında.
    metaTitle: 'Hava Filtresi Ne Zaman Değiştirilir? | Oto Center Market',
    summary:
      'Hava filtresi normal koşullarda 15.000–30.000 km arasında değiştirilir; tozlu yolda bu aralık yarıya iner. Değişim zamanının belirtileri ve doğru filtre seçimi.',
    tag: 'Bakım',
    readMinutes: 8,
    relatedHref: '/filtreler/hava-filtreleri',
    relatedLabel: 'Hava filtrelerine göz atın',
    guncelleme: '2026-08-31',
    ilgiliYazilar: ['polen-filtresi-neden-onemli', 'oem-numarasi-ile-parca-bulma'],
    intro: [
      'Hava filtresi, çoğu araçta normal kullanım koşullarında 15.000–30.000 kilometre arasında ya da yılda bir kez değiştirilir. Tozlu yolda, şantiyede veya yoğun şehir trafiğinde kullanılan araçlarda bu aralık 8.000–12.000 kilometreye kadar iner. Kesin değer aracın bakım kitapçığında yazar; aşağıdaki aralıklar kitapçığın yerine geçmez, ne beklemeniz gerektiğini gösterir. Aracınıza uyan ürünleri [hava filtreleri kategorisinden](/filtreler/hava-filtreleri "Hava filtrelerini görüntüle") görebilirsiniz.',
      'Kilometreyi beklemek de her zaman doğru değildir. Filtre erken dolduysa aracın size söyleyeceği belirtiler vardır — yakıt tüketiminde açıklanamayan artış, gaza geç tepki, rölantide dengesizlik. Bu yazıda hem sayısal aralıkları hem de o belirtileri tek tek ele alıyoruz.',
    ],
    body: [
      {
        heading: 'Hava filtresi ne işe yarar?',
        paragraphs: [
          'Motor, yaktığı her litre yakıt için yaklaşık on bin litre hava emer. Bu havanın içindeki toz, kum, polen ve is silindire ulaşırsa iki şey olur: yanma verimi düşer ve aşındırıcı partiküller silindir cidarı ile piston segmanlarını yer. Hava filtresi, motora giden havayı bu partiküllerden arındırır.',
          'Filtre elemanı çoğunlukla akordeon gibi katlanmış özel kâğıttan yapılır. Katlama, küçük bir hacme büyük bir yüzey sığdırmak içindir — yüzey ne kadar genişse, filtre dolmadan önce o kadar çok partikül tutabilir.',
          'Filtre zamanla dolduğunda motora giren hava azalır. Motor kontrol ünitesi karışımı dengelemeye çalışır; aynı gücü üretmek için daha çok yakıt harcanır, ivmelenme tembelleşir ve egzoz emisyonları yükselir.',
        ],
      },
      {
        heading: 'Hava filtresi kaç km’de bir değiştirilir?',
        paragraphs: [
          'Aşağıdaki tablo sektörde yaygın olarak kullanılan aralıkları özetler. İki sütun arasındaki fark küçümsenmeyecek kadar büyüktür: aynı araç, yalnızca çalıştığı ortam yüzünden filtresini iki kat sık değiştirebilir.',
          'Yağ filtresinin neden her yağ değişiminde yenilendiğini [ayrı bir yazıda](/blog/yag-filtresi-ve-motor-yagi-birlikte-mi "Yağ filtresi değişimi rehberini oku") anlattık. Kilometre ve süre koşullarından hangisi önce dolarsa değişim o zaman yapılır. Yılda 5.000 kilometre yapan bir araçta filtre kilometreyi doldurmadan yaşlanır; kâğıt nemden etkilenir ve tuttuğu organik artıklar küflenebilir.',
        ],
        table: {
          caption: 'Filtre türüne göre yaygın değişim aralıkları',
          head: ['Filtre', 'Normal kullanım', 'Ağır / tozlu kullanım'],
          rows: [
            ['Hava filtresi', '15.000 – 30.000 km veya yılda bir', '8.000 – 12.000 km'],
            ['Yakıt filtresi', '20.000 – 30.000 km', '15.000 – 20.000 km'],
            ['Polen / kabin filtresi', '15.000 – 20.000 km veya yılda bir', 'Yılda bir veya daha sık'],
            ['Yağ filtresi', 'Her yağ değişiminde', 'Her yağ değişiminde'],
          ],
        },
      },
      {
        heading: 'Benzinli ve dizel araçlarda fark var mı?',
        paragraphs: [
          'Değişim aralığı bakımından iki motor tipi birbirine yakındır; belirleyici olan yakıt cinsi değil, aracın çalıştığı ortamdır. Ancak tıkanmanın sonuçları farklı hissedilir.',
          'Benzinli motorlarda kısıtlanan hava akışı doğrudan güç kaybı ve tüketim artışı olarak görünür. Dizel motorlarda ise ilk belirti çoğu zaman egzozdan gelen siyah dumandır: yeterli hava bulamayan yakıt tam yanmaz. Turbolu dizellerde bu durum uzun sürerse partikül filtresi (DPF) de erken dolmaya başlar — yani ucuz bir parçanın ihmali, pahalı bir parçayı yorar.',
          'Ağır vasıtalarda ve iş makinelerinde genellikle iki kademeli filtre bulunur: bir ana eleman ve içinde onu koruyan bir emniyet elemanı. Emniyet elemanı her ana filtre değişiminde değil, üreticinin belirttiği daha uzun aralıkta yenilenir.',
        ],
      },
      {
        heading: 'Değişim aralığını kısaltan kullanım koşulları',
        paragraphs: [
          'Araç üreticileri bakım kitapçıklarında çoğunlukla “ağır kullanım koşulları” diye ayrı bir aralık verir. Aracınız aşağıdakilerden birine giriyorsa kısa aralığı esas alın:',
        ],
        list: [
          'Stabilize, toprak veya şantiye yolunda düzenli kullanım.',
          'Yoğun şehir trafiğinde kısa mesafeli, dur-kalk sürüş.',
          'Tarım, madencilik, inşaat gibi havada sürekli partikül bulunan ortamlar.',
          'Uzun süreli rölantide bekleme — araç yol almadan filtre hava çekmeye devam eder.',
          'Polen mevsiminin yoğun geçtiği bölgelerde ilkbahar dönemi.',
        ],
      },
      {
        heading: 'Tıkanmış hava filtresinin belirtileri',
        paragraphs: [
          'Filtrenin durumunu anlamak için servise gitmeniz şart değil. Kutuyu açıp elemanı çıkarmak çoğu araçta birkaç klips meselesidir. Aşağıdaki işaretlerden biri bile varsa filtreye bakmakta fayda var:',
        ],
        list: [
          'Filtreyi güçlü bir ışığa tuttuğunuzda kâğıt katmanları arasından ışık geçmiyorsa eleman doymuştur.',
          'Yakıt tüketiminde, sürüş alışkanlığınız değişmediği hâlde açıklanamayan bir artış varsa.',
          'Gaza bastığınızda tepki gecikiyor, araç “boğuluyor” gibi hissettiriyorsa.',
          'Rölanti devri dengesiz, motor titriyorsa.',
          'Dizel araçta hızlanırken egzozdan siyah duman geliyorsa.',
          'Filtre kutusunun içinde yaprak, böcek, kum birikmişse — kutu temizlenmeli ve eleman yenilenmelidir.',
          'Elemanın kâğıdı yağlı, ıslak ya da yer yer yırtılmışsa. Yırtık bir filtre hiç filtre olmamasından farksızdır; toz doğrudan motora gider.',
        ],
      },
      {
        heading: 'Hava filtresi temizlenip tekrar kullanılabilir mi?',
        paragraphs: [
          'Standart kâğıt elemanlar için cevap hayır. Basınçlı hava tutmak yüzeydeki iri tozu uçurur ama kâğıdın gözeneklerine giren ince partikülleri çıkarmaz; üstelik hava tabancası kâğıtta gözle görülmeyen yırtıklar açar. O andan sonra filtre ölçülebilir bir koruma sağlamaz. Su veya deterjanla yıkamak ise kâğıdın yapısını kalıcı olarak bozar.',
          'Yalnızca yağlı bez tipi (genellikle performans amaçlı satılan yıkanabilir) filtreler üreticisinin kendi temizleme ve yağlama setiyle yeniden kullanılabilir. Bunlar ayrı bir ürün sınıfıdır ve her araca uygun değildir.',
          'Pratik kural şudur: iki değişim arasında filtre kutusunun içini nemli bezle silin, elemanı ise yenileyin. Hava filtresi, bakım kalemleri arasında en ucuz olanlardandır; temizlemeye harcanan çaba karşılığını vermez.',
        ],
      },
      {
        heading: 'Hava filtresi nasıl değiştirilir?',
        paragraphs: [
          'Çoğu binek araçta bu işlem alet gerektirmez ya da tek bir tornavidayla biter. Motor soğukken ve kontak kapalıyken çalışın.',
        ],
        steps: [
          'Motor kapağını açın ve hava filtresi kutusunu bulun. Genellikle emme manifolduna kalın bir hortumla bağlanan, dikdörtgen veya silindirik plastik bir kutudur.',
          'Kutunun kapağını tutan klipsleri açın ya da vidaları sökün. Kapağın üzerinden kablo veya sensör soketi geçiyorsa zorlamadan yerinden çıkarın.',
          'Eski elemanı çıkarın ve hangi yöne baktığını not edin. Contalı kenar aşağı bakıyorsa yenisi de öyle oturmalıdır.',
          'Kutunun içinde biriken yaprak, toz ve böcekleri elektrikli süpürge veya nemli bezle temizleyin. Bu artıkları içeri düşürmeyin.',
          'Yeni elemanı yerleştirin. Conta kenarının kutu yuvasına her noktada tam oturduğundan emin olun — kenardan kaçan hava filtrelenmemiş havadır.',
          'Kapağı kapatın, tüm klipsleri geçirin, soketleri geri takın. Aracı çalıştırıp rölantide emme tarafından ıslık benzeri kaçak sesi gelmediğini dinleyin.',
          'Değişimin kilometresini not edin. Bir sonraki bakımda ne zaman değiştiğini hatırlamanın en kolay yolu budur.',
        ],
      },
      {
        heading: 'Orijinal mi, muadil mi?',
        paragraphs: [
          'Hava filtresi, orijinal ile muadil arasındaki farkın en az hissedildiği parçalardan biri gibi görünür — sonuçta katlanmış bir kâğıt. Fark, kâğıdın kendisinde ve üretim toleransındadır: filtreleme verimi (hangi büyüklükteki partikülün ne oranda tutulduğu), tozu tutma kapasitesi ve conta kenarının kutuya ne kadar tam oturduğu.',
          'Kenardan kaçak yapan bir filtre, ne kadar iyi kâğıt kullanırsa kullansın işe yaramaz: hava en az dirençli yoldan gider ve filtreyi baypas eder. Bu yüzden ucuz bir üründe asıl risk kâğıt değil, ölçü tutarsızlığıdır.',
          'Katalogdaki ürünler yetkili distribütör kanalından tedarik edilir ve orijinal–muadil ayrımı ürün sayfasında belirtilir. Muadil bir ürünü orijinal gibi göstermeyiz; hangisini seçeceğinize bilgiyle karar verirsiniz.',
        ],
      },
      {
        heading: 'Hava filtresi ile polen filtresi aynı şey değildir',
        paragraphs: [
          'Bu ikisi sık karıştırılır ve serviste “filtre değişti” denildiğinde hangisinin değiştiği çoğu zaman sorulmaz. Hava filtresi MOTORUN soluduğu havayı temizler; polen (kabin) filtresi SİZİN soluduğunuz havayı. Farklı yerlerde dururlar, farklı ölçülerdedirler ve birbirinin yerine geçmezler.',
          'Belirtileri de ayrışır: motor gücünde düşüş ve tüketim artışı hava filtresine, klimanın zayıf üflemesi ile kabindeki koku polen filtresine işaret eder. Kabin havası tarafını ayrıntılı anlattığımız [polen filtresi rehberine](/blog/polen-filtresi-neden-onemli "Polen filtresi rehberini oku") göz atabilirsiniz; ürünler ise [polen / kabin filtreleri](/filtreler/polen-kabin-filtreleri "Polen ve kabin filtrelerini görüntüle") kategorisinde.',
        ],
      },
      {
        heading: 'Doğru hava filtresini seçmek',
        paragraphs: [
          'Hava filtresi ölçüsü aynı marka ve model içinde bile motor seçeneğine göre değişir. 1.6 dizel ile 1.4 benzinli aynı kasada farklı filtre kullanabilir. Bu yüzden filtreleri araç modeline değil, motora göre eşleştiriyoruz: aracınızı marka, model ve motor sırasıyla seçtiğinizde yalnızca o motora uyduğu doğrulanmış ürünler listelenir. [Otomobil ve hafif ticari](/otomobil "Otomobil ve hafif ticari araç filtrelerini görüntüle") ile [ağır vasıta](/agir-vasita "Ağır vasıta filtrelerini görüntüle") araçlar aynı katalogda.',
          'Elinizde eski filtrenin üzerindeki kod ya da ruhsatta geçen OEM numarası varsa arama kutusuna doğrudan yazabilirsiniz; numaradaki tire, boşluk ve nokta farkları eşleştirmeyi bozmaz. Numara tiplerinin ne anlama geldiğini [OEM numarasıyla parça bulma](/blog/oem-numarasi-ile-parca-bulma "OEM numarasıyla parça bulma rehberini oku") yazısında anlattık.',
          'Uyumluluğu doğrulanmamış bir eşleşmeyi yeşil “aracınıza uygun” rozetiyle göstermeyiz — kaynaklar çelişiyorsa ya da kayıt yoksa ürün sayfasında bunu açıkça yazarız. Emin olamadığınız durumda ruhsatınızdaki şasi numarasını [bize iletin](/iletisim "İletişim sayfasına git"), doğrulamayı biz yapalım.',
        ],
      },
    ],
    sss: [
      {
        q: 'Hava filtresi kaç km’de bir değiştirilir?',
        a: 'Hava filtresi normal kullanım koşullarında genellikle 15.000–30.000 kilometre arasında ya da yılda bir kez değiştirilir. Tozlu yol, şantiye veya yoğun şehir trafiği gibi ağır koşullarda bu aralık 8.000–12.000 kilometreye iner. Kesin değer için aracın bakım kitapçığına bakılmalıdır.',
      },
      {
        q: 'Hava filtresi değişmezse ne olur?',
        a: 'Tıkanmış bir hava filtresi motora giren havayı kısıtlar. Yakıt tüketimi artar, ivmelenme zayıflar, rölanti dengesizleşir ve egzoz emisyonları yükselir. Dizel araçlarda siyah duman görülür ve uzun vadede partikül filtresi erken dolar. Filtre yırtılırsa toz doğrudan motora girerek silindir ve segman aşınmasına yol açar.',
      },
      {
        q: 'Hava filtresi temizlenip tekrar kullanılabilir mi?',
        a: 'Standart kâğıt hava filtreleri temizlenip yeniden kullanılamaz. Basınçlı hava yüzeydeki tozu alır ama gözeneklere yerleşmiş ince partikülleri çıkarmaz ve kâğıtta görünmeyen yırtıklar açar. Yıkamak kâğıdın yapısını bozar. Yalnızca yağlı bez tipi yıkanabilir filtreler, üreticisinin kendi bakım setiyle yeniden kullanılabilir.',
      },
      {
        q: 'Tıkanmış hava filtresi yakıt tüketimini artırır mı?',
        a: 'Evet. Filtre tıkandığında motor aynı gücü üretmek için daha fazla yakıt harcar. Sürüş alışkanlığınız değişmediği hâlde tüketimde açıklanamayan bir artış varsa, kontrol edilmesi gereken ilk ucuz kalemlerden biri hava filtresidir.',
      },
      {
        q: 'Hava filtresini kendim değiştirebilir miyim?',
        a: 'Çoğu binek araçta evet. Hava filtresi kutusu motor bölmesinde kolay erişilen bir yerdedir ve kapağı genellikle klipsler ya da birkaç vidayla tutulur. Motor soğukken kutuyu açın, eski elemanı yönünü not ederek çıkarın, kutunun içini temizleyin ve yeni elemanı contası tam oturacak biçimde yerleştirin.',
      },
      {
        q: 'Hava filtresi ile polen filtresi aynı şey mi?',
        a: 'Hayır. Hava filtresi motora giren havayı temizler ve motor bölmesinde bulunur. Polen (kabin) filtresi ise kabine giren havayı temizler, genellikle torpido arkasında yer alır. Farklı ölçülerdedirler ve birbirinin yerine kullanılamazlar.',
      },
      {
        q: 'Hava filtresi hangi araçlarda daha sık değişir?',
        a: 'Stabilize veya toprak yolda kullanılan araçlarda, şantiye ve tarım ortamında çalışan iş makineleriyle ağır vasıtalarda, uzun süre rölantide bekleyen araçlarda ve yoğun şehir trafiğinde kısa mesafe yapan araçlarda hava filtresi belirgin biçimde daha hızlı dolar.',
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
  {
    slug: 'yakit-filtresi-ne-zaman-degisir',
    title: 'Yakıt Filtresi Ne Zaman Değiştirilir? Tıkanma Belirtileri',
    metaTitle: 'Yakıt Filtresi Ne Zaman Değişir? | Oto Center Market',
    summary:
      'Yakıt filtresi çoğu araçta 20.000–30.000 km aralığında değişir; dizelde su ayırıcı nedeniyle daha da kritiktir. Tıkanma belirtileri, benzinli ve dizel farkı, doğru filtre seçimi.',
    tag: 'Bakım',
    readMinutes: 6,
    relatedHref: '/filtreler/yakit-filtreleri',
    relatedLabel: 'Yakıt filtrelerine göz atın',
    guncelleme: '2026-10-13',
    ilgiliYazilar: ['periyodik-bakimda-hangi-filtreler-degisir', 'hava-filtresi-ne-zaman-degisir'],
    intro: [
      'Yakıt filtresi, değiştirilebilir tip filtre kullanan araçların çoğunda 20.000–30.000 kilometre aralığında değiştirilir. Dizel araçlarda filtre aynı zamanda yakıttaki suyu ayırdığı için bu aralık daha sıkı takip edilmelidir; kalitesi belirsiz yakıt alınan bölgelerde değişim öne çekilir. Kesin aralık aracın bakım kitapçığında yazar. Aracınıza uyan ürünleri [yakıt filtreleri kategorisinde](/filtreler/yakit-filtreleri "Yakıt filtrelerini görüntüle") bulabilirsiniz.',
      'Bazı benzinli araçlarda yakıt filtresi depo içindeki pompa ünitesine entegredir ve periyodik bakımda değişmez. Aracınızda hangisinin olduğunu bilmiyorsanız, motorunuzu seçerek uyumlu bir değiştirilebilir filtre olup olmadığını görebilirsiniz; uyumlu ürün çıkmıyorsa filtre büyük ihtimalle pompaya entegredir.',
    ],
    body: [
      {
        heading: 'Yakıt filtresi ne işe yarar?',
        paragraphs: [
          'Yakıt deposundan motora giden yakıtın içinde pas, tortu, depo dibinde biriken kir ve — özellikle dizelde — su bulunabilir. Yakıt filtresi bunları enjektörlere ulaşmadan tutar.',
          'Modern enjeksiyon sistemleri çok yüksek basınçla ve çok küçük deliklerden yakıt püskürtür. Bu deliklere ulaşan tek bir sert partikül enjektörü çizebilir veya tıkayabilir. Enjektör ve yüksek basınç pompası, filtreye göre kat kat pahalı parçalardır; filtre bu yüzden ucuz bir sigorta gibidir.',
        ],
      },
      {
        heading: 'Yakıt filtresi tıkanınca hangi belirtiler görülür?',
        paragraphs: [
          'Filtre yavaş yavaş dolar, belirtiler de genellikle sinsice başlar. Aşağıdakilerden biri ya da birkaçı görülüyorsa ve filtre uzun süredir değişmediyse ilk kontrol edilecek parçalardan biri yakıt filtresidir:',
        ],
        list: [
          'Yokuşta veya yük altında güç kaybı, gaza basınca motorun "boğulması".',
          'Uzun süre çalıştırma (marş) sonrası zor çalışma, özellikle soğuk havada.',
          'Rölantide dengesizlik, ara ara tekleme.',
          'Yüksek hızda kesik kesik çekiş.',
          'Dizel araçlarda gösterge panelinde su / yakıt filtresi uyarısı (donanımı olan araçlarda).',
        ],
      },
      {
        heading: 'Dizel araçlarda neden daha önemli?',
        paragraphs: [
          'Dizel yakıt su tutmaya daha yatkındır ve dizel yakıt sistemleri suya karşı çok hassastır. Dizel yakıt filtrelerinin çoğu bu yüzden su ayırıcı (su tutucu) bölümle birlikte gelir; filtre suyu yakıttan ayırıp alt kısımda biriktirir.',
          'Kış aylarında dizel yakıttaki parafin soğukta katılaşmaya başlayabilir. Dolmaya yakın bir filtre bu durumda çok daha çabuk tıkanır ve araç sabah çalışmayabilir. Kış öncesi bakımda dizel yakıt filtresinin durumunu kontrol ettirmek bu yüzden iyi bir alışkanlıktır.',
        ],
      },
      {
        heading: 'Hangi tip yakıt filtresi aracıma uyar?',
        paragraphs: [
          'Yakıt filtreleri iki ana tipte gelir. Hat üstü (in-line) veya kutulu tiplerde filtre komple değişir. Kartuş (element) tiplerde ise gövde araçta kalır, yalnızca içindeki filtre elemanı ve contaları değişir. MANN-FILTER kodlarında WK ile başlayanlar genellikle komple, PU ile başlayanlar kartuş tiptir; FILTRON’da PP komple, PE kartuş tipi ifade eder.',
          'Doğru filtreyi bulmanın en kesin yolu motor bilgisidir. Sitemizde aracınızı marka, model ve motor sırasıyla seçtiğinizde yalnızca o motora uyumlu yakıt filtreleri listelenir. Eski filtrenin üzerindeki kod elinizdeyse [OEM numarasıyla arama rehberimize](/blog/oem-numarasi-ile-parca-bulma "OEM numarasıyla parça bulma rehberi") de göz atabilirsiniz.',
        ],
      },
      {
        heading: 'Yakıt filtresini kendim değiştirebilir miyim?',
        paragraphs: [
          'Bazı benzinli araçlarda hat üstü filtrenin değişimi basittir; ancak yakıt hattında basınç vardır ve yakıt yanıcıdır. Dizel araçlarda değişimden sonra sistemin havasının alınması gerekir; hava kalırsa araç çalışmayabilir. Deneyiminiz yoksa değişimi servise yaptırmanızı öneririz.',
        ],
      },
    ],
    sss: [
      {
        q: 'Yakıt filtresi kaç km’de bir değişir?',
        a: 'Değiştirilebilir yakıt filtresi olan araçların çoğunda 20.000–30.000 km aralığında değişir. Dizel araçlarda ve kalitesi belirsiz yakıt kullanılan bölgelerde bu aralık kısalır. Kesin değer aracın bakım kitapçığında yazar.',
      },
      {
        q: 'Yakıt filtresi değişmezse ne olur?',
        a: 'Tıkanan filtre motora yeterli yakıt gitmesini engeller; güç kaybı, zor çalışma ve tekleme görülür. Filtreden geçemeyen kir ve su enjektörlere ve yüksek basınç pompasına zarar verebilir; bu parçaların onarımı filtreden çok daha pahalıdır.',
      },
      {
        q: 'Benzinli araçlarda yakıt filtresi var mı?',
        a: 'Vardır, ancak bazı benzinli modellerde filtre depo içindeki pompa ünitesine entegredir ve periyodik bakımda değişmez. Aracınızda değiştirilebilir bir filtre olup olmadığını motor seçimiyle uyumlu ürünlere bakarak görebilirsiniz.',
      },
    ],
  },
  {
    slug: 'mann-filter-mi-filtron-mu',
    title: 'MANN-FILTER mi FILTRON mu? İki Marka Arasındaki Fark',
    metaTitle: 'MANN-FILTER mi FILTRON mu? | Oto Center Market',
    summary:
      'MANN-FILTER ve FILTRON bugün aynı grubun, MANN+HUMMEL’in markaları. Kod sistemleri, ürün tipleri ve aynı araç için iki markanın karşılıklarını nasıl bulacağınız.',
    tag: 'Karşılaştırma',
    readMinutes: 5,
    relatedHref: '/markalar',
    relatedLabel: 'Markalara göz atın',
    guncelleme: '2026-10-13',
    ilgiliYazilar: ['oem-numarasi-ile-parca-bulma', 'volkswagen-golf-filtre-rehberi'],
    intro: [
      'MANN-FILTER ve FILTRON bugün aynı şirketin, Alman MANN+HUMMEL grubunun markalarıdır. FILTRON, MANN+HUMMEL’in 2016’da tamamladığı Affinia Group filtrasyon işi satın alımıyla gruba katıldı. İki marka da aynı araç için birbirinin karşılığı olan ürünler sunar; fark daha çok kod sisteminde, ürün gamının genişliğinde ve fiyat konumunda görülür.',
      'Sitemizdeki ürünlerin büyük kısmında aynı motor için hem MANN-FILTER hem FILTRON kodu bulunur. Aşağıda iki markanın kodlarını nasıl okuyacağınızı ve aracınız için hangisini seçebileceğinizi anlatıyoruz.',
    ],
    body: [
      {
        heading: 'İki marka kısaca',
        paragraphs: [
          'MANN-FILTER, MANN+HUMMEL’in otomotiv yedek parça pazarındaki ana markasıdır. Binek, ticari ve ağır vasıta için geniş bir hava, yağ, yakıt ve kabin filtresi gamı sunar.',
          'FILTRON köken olarak Polonyalı bir filtre markasıdır ve özellikle Avrupa’da binek ve hafif ticari araç pazarında yaygındır. 2016’dan bu yana MANN+HUMMEL bünyesindedir.',
        ],
      },
      {
        heading: 'Kodlar nasıl okunur?',
        paragraphs: [
          'Her iki marka da kodun başındaki harflerle filtre tipini anlatır. Sitemizde sık gördüğünüz önekler şunlardır:',
        ],
        table: {
          caption: 'MANN-FILTER ve FILTRON kod önekleri',
          head: ['Filtre tipi', 'MANN-FILTER', 'FILTRON'],
          rows: [
            ['Yağ filtresi — komple (spin-on)', 'W', 'OP'],
            ['Yağ filtresi — kartuş', 'HU', 'OE'],
            ['Hava filtresi', 'C', 'AP (panel), AK / AR (yuvarlak)'],
            ['Polen / kabin filtresi', 'CU', 'K'],
            ['Polen filtresi — aktif karbonlu', 'CUK', 'K … A (sonunda A harfi)'],
            ['Yakıt filtresi — komple', 'WK', 'PP'],
            ['Yakıt filtresi — kartuş', 'PU', 'PE'],
          ],
        },
      },
      {
        heading: 'Polen filtresinde FreciousPlus (FP) nedir?',
        paragraphs: [
          'MANN-FILTER’ın kabin filtrelerinde üç seviye görürsünüz: CU standart partikül filtresi, CUK aktif karbon katmanlı filtre, FP ise FreciousPlus serisi. FreciousPlus, aktif karbona ek olarak biyofonksiyonel bir katman içerir ve alerjen ile bakterilerin tutulmasına yöneliktir. Üçü aynı araca aynı ölçüde takılır; seçim kullanım koşuluna ve beklentinize göre yapılır.',
          'FILTRON’da kabin filtreleri K harfiyle başlar; aktif karbonlu tipler kodun sonundaki A harfiyle ayrılır (örneğin K 1311 ve K 1311A). Standart ve aktif karbonlu tip arasındaki fark için [polen filtresi yazımıza](/blog/polen-filtresi-neden-onemli "Polen filtresi rehberi") bakabilirsiniz.',
        ],
      },
      {
        heading: 'Hangisini seçmeliyim?',
        paragraphs: [
          'Aracınıza uyumlu olduğu doğrulanmış her iki marka da kullanılabilir; burada belirleyici olan markadan çok, filtrenin aracınızın motoruna uygun olmasıdır. Sitemizde motorunuzu seçtiğinizde her iki markanın uyumlu ürünleri birlikte listelenir; fiyat, stok ve tercih ettiğiniz markaya göre seçim yapabilirsiniz.',
          'Bakım geçmişinde hangi markanın kullanıldığını biliyorsanız aynı markayla devam etmek, kodları takip etmeyi kolaylaştırır. Eski filtrenin üzerindeki kod elinizdeyse arama kutusuna yazmanız yeterlidir; kodun boşluk ve tire farkları önemli değildir.',
        ],
      },
    ],
    sss: [
      {
        q: 'MANN-FILTER ve FILTRON aynı şirket mi?',
        a: 'Evet. FILTRON, MANN+HUMMEL’in 2016’da tamamladığı Affinia Group filtrasyon işi satın alımıyla MANN+HUMMEL grubuna katıldı. MANN-FILTER de aynı grubun markasıdır.',
      },
      {
        q: 'MANN-FILTER kodunun FILTRON karşılığını nasıl bulurum?',
        a: 'Sitemizde aracınızın motorunu seçtiğinizde iki markanın uyumlu ürünleri birlikte listelenir. Elinizde yalnızca kod varsa arama kutusuna yazarak ürünü bulabilir, ürün sayfasındaki uyumlu araç listesinden aynı motora uyan diğer marka ürününe geçebilirsiniz.',
      },
      {
        q: 'CU, CUK ve FP polen filtreleri arasındaki fark nedir?',
        a: 'CU standart partikül filtresidir. CUK’ta buna ek olarak koku ve gazları tutan aktif karbon katmanı vardır. FP (FreciousPlus) serisi aktif karbona ek olarak biyofonksiyonel bir katman içerir. Üçü aynı araca aynı ölçüde takılır.',
      },
    ],
  },
  {
    slug: 'periyodik-bakimda-hangi-filtreler-degisir',
    title: 'Periyodik Bakımda Hangi Filtreler Değişir? Filtre Kontrol Listesi',
    metaTitle: 'Periyodik Bakımda Hangi Filtreler Değişir? | Oto Center Market',
    summary:
      'Her bakımda yağ filtresi değişir; hava, polen ve yakıt filtresi ise kendi aralıklarına göre. Aracınızın periyodik bakımında hangi filtrenin ne zaman değiştiğini gösteren kontrol listesi.',
    tag: 'Bakım',
    readMinutes: 5,
    relatedHref: '/filtreler',
    relatedLabel: 'Tüm filtreleri görün',
    guncelleme: '2026-10-13',
    ilgiliYazilar: ['yag-filtresi-ve-motor-yagi-birlikte-mi', 'hava-filtresi-ne-zaman-degisir', 'yakit-filtresi-ne-zaman-degisir'],
    intro: [
      'Periyodik bakımda yağ filtresi her seferinde motor yağıyla birlikte değişir. Hava filtresi ve polen (kabin) filtresi çoğu araçta yılda bir ya da 15.000–30.000 km aralığında, yakıt filtresi ise genellikle 20.000–30.000 km aralığında yenilenir. Otomatik şanzımanlı araçlarda şanzıman filtresi, üreticinin belirttiği aralıkta şanzıman yağıyla birlikte değişir. Kesin aralıklar aracınızın bakım kitapçığında yazar.',
      'Bakıma gitmeden önce hangi filtrelerin sırası geldiğini bilmek, hem bütçe planlamasını hem de doğru parçanın hazır olmasını kolaylaştırır. Aşağıdaki liste, bakımda filtreler için neyin kontrol edileceğini tek yerde topluyor.',
    ],
    body: [
      {
        heading: 'Filtrelerin yaygın değişim aralıkları',
        paragraphs: [
          'Tablodaki aralıklar sektörde yaygın kullanılan değerlerdir ve bakım kitapçığının yerine geçmez. Tozlu yol, yoğun şehir trafiği, kısa mesafe kullanım veya kalitesi belirsiz yakıt gibi ağır koşullarda aralıklar kısalır.',
        ],
        table: {
          caption: 'Periyodik bakımda filtreler — yaygın değişim aralıkları',
          head: ['Filtre', 'Ne zaman değişir?', 'Not'],
          rows: [
            ['Yağ filtresi', 'Her yağ değişiminde', 'Yağ yenilenip filtre eski kalırsa bakımın anlamı büyük ölçüde kaybolur.'],
            ['Hava filtresi', '15.000 – 30.000 km veya yılda bir', 'Tozlu yolda kullanımda aralık belirgin şekilde kısalır.'],
            ['Polen / kabin filtresi', '15.000 – 20.000 km veya yılda bir', 'Klima kokusu ve zayıf üfleme erken değişim işaretidir.'],
            ['Yakıt filtresi', '20.000 – 30.000 km', 'Dizelde su ayırıcı nedeniyle daha kritiktir; bazı benzinlilerde depo içindedir.'],
            ['Şanzıman filtresi', 'Üreticinin şanzıman yağı aralığında', 'Otomatik şanzımanlarda yağla birlikte değişir.'],
          ],
        },
      },
      {
        heading: 'Bakım öncesi kontrol listesi',
        paragraphs: [],
        steps: [
          'Bakım kitapçığından ya da servis kayıtlarından son bakımda hangi filtrelerin değiştiğini kontrol edin.',
          'Aracın şu anki kilometresini ve son değişimden bu yana geçen süreyi not edin; hangisi önce dolarsa o esas alınır.',
          'Sitede aracınızı marka, model ve motor sırasıyla seçin; yalnızca motorunuza uyumlu filtreler listelenir.',
          'Yağ filtresiyle birlikte motor yağının cinsini ve miktarını bakım kitapçığından teyit edin.',
          'Hava ve polen filtresini bakımda görsel olarak kontrol ettirin; aşırı kirliyse kilometresi dolmasa da değiştirin.',
          'Dizel araçlarda kış öncesi bakımda yakıt filtresinin durumuna özellikle baktırın.',
        ],
      },
      {
        heading: '4 filtre seti nedir, birlikte mi değişmeli?',
        paragraphs: [
          'Yağ, hava, polen ve yakıt filtresinin birlikte alınmasına sıklıkla "4’lü filtre seti" denir. Dört filtrenin aynı bakımda değişmesi çoğu zaman pratiktir: işçilik tek seferde yapılır ve hiçbir filtrenin aralığı gözden kaçmaz.',
          'Ancak aralıklar farklı olduğu için her bakımda dördünün birden değişmesi şart değildir. Örneğin yağ filtresi her bakımda değişirken yakıt filtresi bir bakım atlayabilir. Kendi aracınız için hangi filtrenin sırasının geldiğine yukarıdaki tabloya ve bakım kitapçığına göre karar verebilirsiniz.',
        ],
      },
      {
        heading: 'Doğru filtreyi nasıl bulurum?',
        paragraphs: [
          'Filtre uyumluluğu modelden çok motora bağlıdır; aynı modelin farklı motorları farklı filtre kullanabilir. Bu yüzden sitemizde aracınızı motor seviyesine kadar seçmenizi öneririz. Örnek olarak [Volkswagen Golf filtre rehberimizde](/blog/volkswagen-golf-filtre-rehberi "Volkswagen Golf filtre rehberi") aynı modelin farklı motorlarında filtre kodlarının nasıl değiştiğini görebilirsiniz.',
          'Filtrelerin kendi rehberleri için: [hava filtresi](/blog/hava-filtresi-ne-zaman-degisir "Hava filtresi değişim rehberi"), [yağ filtresi](/blog/yag-filtresi-ve-motor-yagi-birlikte-mi "Yağ filtresi rehberi"), [polen filtresi](/blog/polen-filtresi-neden-onemli "Polen filtresi rehberi") ve [yakıt filtresi](/blog/yakit-filtresi-ne-zaman-degisir "Yakıt filtresi değişim rehberi").',
        ],
      },
    ],
    sss: [
      {
        q: 'Her bakımda hangi filtre mutlaka değişir?',
        a: 'Yağ filtresi her yağ değişiminde, yani her periyodik bakımda değişir. Hava, polen ve yakıt filtresi kendi aralıklarına göre değişir; bunlar her bakımda değişmeyebilir.',
      },
      {
        q: 'Periyodik bakımda filtreler birlikte mi değişmeli?',
        a: 'Şart değildir. Yağ filtresi her bakımda değişir; hava, polen ve yakıt filtresinin aralıkları farklıdır. Ancak aralıkları yakın olan filtreleri aynı bakımda değiştirmek işçilik ve takip açısından pratiktir.',
      },
    ],
  },
  {
    slug: 'volkswagen-golf-filtre-rehberi',
    title: 'Volkswagen Golf Filtre Rehberi: Yağ, Hava, Polen ve Yakıt Filtresi Kodları',
    metaTitle: 'VW Golf Filtre Kodları (IV–VIII) | Oto Center Market',
    summary:
      'Golf IV, V, VI, VII ve VIII için motor bazında MANN-FILTER ve FILTRON yağ, hava, polen, yakıt ve şanzıman filtresi kodları. Doğru filtreyi motorunuza göre bulun.',
    tag: 'Model rehberi',
    readMinutes: 9,
    relatedHref: '/otomobil/volkswagen',
    relatedLabel: 'Volkswagen modellerine göz atın',
    guncelleme: '2026-10-13',
    ilgiliYazilar: ['periyodik-bakimda-hangi-filtreler-degisir', 'mann-filter-mi-filtron-mu'],
    intro: [
      'Volkswagen Golf’te filtre seçimi kasa neslinden çok motora bağlıdır: aynı nesilde 1.4 TSI ile 2.0 TDI farklı yağ, hava ve yakıt filtresi kullanır. Polen filtresi ise çoğu zaman aynı nesildeki tüm motorlarda ortaktır. Aşağıdaki tablolar Golf IV’ten Golf VIII’e kadar katalogdaki uyumluluk verisinden hazırlandı; her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır.',
      'Tablo hızlı bir başvuru içindir. Kesin seçim için [Volkswagen modelleri](/otomobil/volkswagen "Volkswagen yedek parça") arasından Golf neslinizi ve motorunuzu seçin; yalnızca o motora uyumlu ürünler listelenir.',
    ],
    body: [
      {
        heading: 'Golf neslinizi ve motorunuzu nasıl anlarsınız?',
        paragraphs: [
          'Nesli ruhsattaki model yılından tahmin edebilirsiniz; ancak nesil geçiş yıllarında üretilen araçlarda iki nesil iç içe geçebilir. Motor hacmi ve gücü ruhsatta yazar; motor kodu ise genellikle motor bloğunda ve servis kayıtlarında bulunur.',
          'Aynı motor için tabloda birden fazla kod görüyorsanız, filtre üretim yılına veya donanıma göre değişiyor olabilir. Bu durumda eski filtrenin üzerindeki kodu kontrol edin ya da siparişten önce şasi numaranızla bize sorun.',
        ],
      },
      {
        heading: 'Golf VIII filtre kodları',
        paragraphs: [
          "Golf VIII (2019 ve sonrası) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Tablodaki her satır, o filtrenin uyduğu motorları gösterir; motor adının yanındaki beygir gücü değeri önemlidir, çünkü aynı hacimdeki iki motor farklı filtre kullanabilir. Motorunuzu seçerek size uyan ürünleri [Golf VIII sayfasında](/otomobil/volkswagen/golf-viii \"Volkswagen Golf VIII yedek parça\") görebilirsiniz.",
        ],
        table: {
          caption: "Volkswagen Golf VIII — filtre türüne göre MANN-FILTER ve FILTRON kodları",
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'W 712/95', 'OP 616/3', '1.0 TSI 90 HP, 1.0 TSI 110 HP, 1.0 eTSI 110 HP, 1.4 TSI eHybrid 204 HP, 1.4 TSI eHybrid 245 HP, 1.5 TGI 131 HP, 1.5 TSI 131 HP, 1.5 TSI 150 HP, 1.5 eTSI 131 HP, 1.5 eTSI 150 HP'],
            ['Yağ', 'HU 6013 z', 'OE 688/5', '2.0 GTI 245 HP, 2.0 GTI Clubsport 300 HP, 2.0 TSI 190 HP, 2.0 TSI R 320 HP, 2.0 TSI R 333 HP'],
            ['Yağ', 'HU 5003 z', 'OE 688/6', '2.0 TDI 4motion 150 HP, 2.0 TDI 4motion 200 HP, 2.0 TDI Blue Motion 116 HP, 2.0 TDI Blue Motion 150 HP'],
            ['Hava', 'C 30 005', 'AP 139/5', '2.0 GTI 245 HP, 2.0 GTI Clubsport 300 HP, 2.0 TDI 4motion 150 HP, 2.0 TDI 4motion 200 HP, 2.0 TDI Blue Motion 116 HP, 2.0 TDI Blue Motion 150 HP, 2.0 TSI 190 HP, 2.0 TSI R 320 HP, 2.0 TSI R 333 HP'],
            ['Hava', 'C 28 043', 'AP 183/6', '1.0 TSI 90 HP, 1.0 TSI 110 HP, 1.0 eTSI 110 HP, 1.5 TGI 131 HP, 1.5 TSI 131 HP, 1.5 TSI 150 HP, 1.5 eTSI 131 HP, 1.5 eTSI 150 HP'],
            ['Hava', 'C 30 004', 'AP 139/6', '2.0 GTI 245 HP, 2.0 TDI 4motion 150 HP, 2.0 TDI 4motion 200 HP, 2.0 TDI Blue Motion 116 HP, 2.0 TDI Blue Motion 150 HP'],
            ['Hava', 'C 27 009', 'AP 062/1', '1.4 TSI eHybrid 204 HP, 1.4 TSI eHybrid 245 HP'],
            ['Polen / kabin', 'CU 26 009, CUK 26 009, FP 26 009', 'K 1311, K 1311A', 'Bu nesildeki tüm motorlar'],
            ['Yakıt', 'PU 8028', 'PE 973/9, PE 993/2', '2.0 TDI 4motion 150 HP, 2.0 TDI 4motion 200 HP, 2.0 TDI Blue Motion 116 HP, 2.0 TDI Blue Motion 150 HP'],
            ['Şanzıman', 'H 6031 z', '—', 'Bu nesildeki tüm motorlar'],
          ],
        },
      },
      {
        heading: 'Golf VII filtre kodları',
        paragraphs: [
          "Golf VII (yaklaşık 2012–2020) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Tablodaki her satır, o filtrenin uyduğu motorları gösterir; motor adının yanındaki beygir gücü değeri önemlidir, çünkü aynı hacimdeki iki motor farklı filtre kullanabilir. Motorunuzu seçerek size uyan ürünleri [Golf VII sayfasında](/otomobil/volkswagen/golf-vii \"Volkswagen Golf VII yedek parça\") görebilirsiniz.",
        ],
        table: {
          caption: "Volkswagen Golf VII — filtre türüne göre MANN-FILTER ve FILTRON kodları",
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'W 712/95', 'OP 616/3', '1.0 TSI 86 HP, 1.0 TSI 116 HP, 1.2 TSI 86 HP, 1.2 TSI 105 HP, 1.2 TSI 110 HP, 1.4 TSI 122 HP, 1.4 TSI 125 HP, 1.4 TSI 140 HP, 1.4 TSI 150 HP, 1.5 TSI 131 HP, 1.5 TSI 150 HP, 1.6 110 HP'],
            ['Yağ', 'HU 7020 z', 'OE 688/3', '1.6 TDI 90 HP, 1.6 TDI 105 HP, 1.6 TDI 110 HP, 1.6 TDI 116 HP, 2.0 GTD 184 HP, 2.0 TDI 110 HP, 2.0 TDI 143 HP, 2.0 TDI 150 HP'],
            ['Yağ', 'HU 6013 z', '—', '1.8 TSI 179 HP, 2.0 GTI 220 HP, 2.0 GTI 230 HP, 2.0 GTI 265 HP, 2.0 R 280 HP, 2.0 R 292 HP, 2.0 TSI 211 HP'],
            ['Hava', 'C 30 005', 'AP 139/5', '1.6 TDI 90 HP, 1.6 TDI 105 HP, 1.6 TDI 110 HP, 1.6 TDI 116 HP, 1.8 TSI 179 HP, 2.0 GTD 184 HP, 2.0 GTI 220 HP, 2.0 GTI 230 HP, 2.0 GTI 265 HP, 2.0 R 280 HP, 2.0 R 292 HP, 2.0 TDI 110 HP, 2.0 TDI 143 HP, 2.0 TDI 150 HP, 2.0 TSI 211 HP'],
            ['Hava', 'C 27 009', 'AP 062/1', '1.2 TSI 86 HP, 1.2 TSI 105 HP, 1.2 TSI 110 HP, 1.4 TSI 122 HP, 1.4 TSI 125 HP, 1.4 TSI 140 HP, 1.4 TSI 150 HP'],
            ['Hava', '—', 'AP 062/2', '1.0 TSI 86 HP, 1.0 TSI 116 HP'],
            ['Hava', 'C 28 043', '—', '1.5 TSI 131 HP, 1.5 TSI 150 HP'],
            ['Hava', 'C 21 014', '—', '1.6 110 HP'],
            ['Polen / kabin', 'CU 26 009, CUK 26 009, FP 26 009', 'K 1311', 'Bu nesildeki tüm motorlar'],
            ['Polen / kabin', '—', 'K 1311A', '1.0 TSI 86 HP, 1.0 TSI 116 HP, 1.2 TSI 86 HP, 1.2 TSI 105 HP, 1.4 TSI 122 HP, 1.4 TSI 140 HP, 1.4 TSI 150 HP, 1.5 TSI 131 HP, 1.5 TSI 150 HP, 1.6 110 HP, 1.6 TDI 90 HP, 1.6 TDI 110 HP, 1.6 TDI 116 HP, 1.8 TSI 179 HP, 2.0 GTD 184 HP, 2.0 GTI 220 HP, 2.0 GTI 230 HP, 2.0 GTI 265 HP, 2.0 R 280 HP, 2.0 R 292 HP, 2.0 TDI 110 HP, 2.0 TDI 143 HP, 2.0 TDI 150 HP, 2.0 TSI 211 HP'],
            ['Yakıt', 'PU 8028', 'PE 973/9, PE 993/2', '1.6 TDI 90 HP, 1.6 TDI 105 HP, 1.6 TDI 110 HP, 1.6 TDI 116 HP, 2.0 GTD 184 HP, 2.0 TDI 110 HP, 2.0 TDI 143 HP, 2.0 TDI 150 HP'],
          ],
        },
      },
      {
        heading: 'Golf VI ve Golf Plus filtre kodları',
        paragraphs: [
          "Golf VI ve Golf Plus (yaklaşık 2008–2013) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Tablodaki her satır, o filtrenin uyduğu motorları gösterir; motor adının yanındaki beygir gücü değeri önemlidir, çünkü aynı hacimdeki iki motor farklı filtre kullanabilir. Motorunuzu seçerek size uyan ürünleri [Golf VI ve Golf Plus sayfasında](/otomobil/volkswagen/golf-vi-golf-plus \"Volkswagen Golf VI ve Golf Plus yedek parça\") görebilirsiniz.",
        ],
        table: {
          caption: "Volkswagen Golf VI ve Golf Plus — filtre türüne göre MANN-FILTER ve FILTRON kodları",
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'W 712/94', 'OP 641/2', '1.2 TSI 86 HP, 1.2 TSI 105 HP, 1.4 TSI 122 HP, 1.4 TSI 160 HP'],
            ['Yağ', 'HU 7008 z', 'OE 688', '1.6 TDI 90 HP, 1.6 TDI / 1.6 TDI Blue Motion 105 HP, 2.0 TDI 110 HP, 2.0 TDI 140 HP'],
            ['Yağ', 'W 712/93', 'OP 641/1', '1.2 TSI 105 HP, 1.4 TSI 122 HP, 1.4 TSI 160 HP'],
            ['Yağ', 'W 719/45', 'OP 526/7', '1.8 TSFI 160 HP, 2.0 TSI 200 HP, 2.0 TSI GTI 210 HP'],
            ['Yağ', 'HU 719/6 x', 'OE 671/3', '2.0 TSI R 256 HP, 2.0 TSI R 270 HP, 2.5 V5 170 HP'],
            ['Yağ', 'W 712/95', 'OP 616/3', '1.4 TSI 125 HP, 1.4 TSI 150 HP'],
            ['Yağ', 'HU 719/7 x', 'OE 650/1', '2.0 TDI 110 HP, 2.0 TDI 140 HP'],
            ['Yağ', 'HU 7020 z', 'OE 688/3', '2.0 TDI 110 HP, 2.0 TDI 150 HP'],
            ['Yağ', 'W 712/52', 'OP 641', '1.4 80 HP'],
            ['Yağ', 'W 719/30', 'OP 526/1', '1.6 102 HP'],
            ['Hava', 'C 35 154', 'AP 139/2', '1.4 TSI 160 HP, 1.6 TDI 90 HP, 1.6 TDI / 1.6 TDI Blue Motion 105 HP, 1.8 TSFI 160 HP, 2.0 TDI 110 HP, 2.0 TDI 140 HP, 2.0 TDI 150 HP, 2.0 TSI 200 HP, 2.0 TSI GTI 210 HP'],
            ['Hava', 'C 14 130', 'AK 370/4', '1.2 TSI 86 HP, 1.2 TSI 105 HP, 1.4 TSI 122 HP, 1.6 102 HP'],
            ['Hava', 'C 27 009', 'AP 062/1', '1.4 TSI 125 HP, 1.4 TSI 150 HP'],
            ['Hava', 'C 41 002', '—', '2.0 TSI R 256 HP, 2.0 TSI R 270 HP'],
            ['Hava', 'C 3880', 'AP 183/3', '1.4 80 HP'],
            ['Hava', 'C 43 102', 'AP 149/10', '2.5 V5 170 HP'],
            ['Polen / kabin', 'CU 2939, CUK 2939, FP 2939', 'K 1111, K 1111A', 'Bu nesildeki tüm motorlar'],
            ['Yakıt', 'WK 69', 'PP 836/2', '1.2 TSI 86 HP, 1.2 TSI 105 HP, 1.4 TSI 122 HP, 1.4 TSI 125 HP, 1.4 TSI 150 HP, 1.4 TSI 160 HP, 1.8 TSFI 160 HP, 2.0 TSI 200 HP, 2.0 TSI GTI 210 HP, 2.0 TSI R 256 HP, 2.0 TSI R 270 HP'],
            ['Yakıt', 'PU 825 x', 'PE 973/3', '1.6 TDI / 1.6 TDI Blue Motion 105 HP, 2.0 TDI 110 HP, 2.0 TDI 140 HP, 2.0 TDI 150 HP'],
            ['Yakıt', 'PU 936/1 x', 'PE 973/2', '1.6 TDI 90 HP, 1.6 TDI / 1.6 TDI Blue Motion 105 HP, 2.0 TDI 110 HP, 2.0 TDI 140 HP'],
            ['Yakıt', 'WK 69/2', 'PP 836/4', '1.4 80 HP, 1.6 102 HP, 2.5 V5 170 HP'],
            ['Yakıt', 'PU 8028', 'PE 973/9', '2.0 TDI 110 HP, 2.0 TDI 150 HP'],
          ],
        },
      },
      {
        heading: 'Golf V ve Golf Plus filtre kodları',
        paragraphs: [
          "Golf V ve Golf Plus (yaklaşık 2003–2009) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Tablodaki her satır, o filtrenin uyduğu motorları gösterir; motor adının yanındaki beygir gücü değeri önemlidir, çünkü aynı hacimdeki iki motor farklı filtre kullanabilir. Motorunuzu seçerek size uyan ürünleri [Golf V ve Golf Plus sayfasında](/otomobil/volkswagen/golf-v-golf-plus \"Volkswagen Golf V ve Golf Plus yedek parça\") görebilirsiniz.",
        ],
        table: {
          caption: "Volkswagen Golf V ve Golf Plus — filtre türüne göre MANN-FILTER ve FILTRON kodları",
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'HU 719/7 x', 'OE 650/1', '1.9 TDI 90 HP, 1.9 TDI 105 HP, 2.0 TDI 131 HP, 2.0 TDI 140 HP, 2.0 TDI 170 HP, 3.2 R32 250 HP'],
            ['Yağ', 'HU 712/6 x', 'OE 650/2', '1.4 FSI 90 HP, 1.4 TSI 122 HP, 1.4 TSI 140 HP, 1.4 TSI 170 HP, 1.6 FSI 115 HP'],
            ['Yağ', 'HU 719/6 x', 'OE 671/3', '2.0 FSI 150 HP, 2.0 GTI 200 HP, 2.0 TFSI GTI 230 HP'],
            ['Yağ', 'W 712/52', 'OP 641', '1.4 16V 75 HP, 1.4 16V 80 HP'],
            ['Yağ', 'W 712/93', 'OP 641/1', '1.4 TSI 122 HP, 1.4 TSI 160 HP'],
            ['Yağ', 'W 719/30', 'OP 526/1', '1.6 16V 102 HP, 2.0 FSI 156 HP'],
            ['Yağ', 'W 712/94', 'OP 641/2', '1.4 TSI 122 HP'],
            ['Yağ', 'W 719/45', 'OP 526/7', '2.0 GTI 200 HP'],
            ['Yağ', 'HU 7008 z', 'OE 688', '2.0 TDI 140 HP'],
            ['Hava', 'C 35 154', 'AP 139/2', '1.4 TSI 140 HP, 1.4 TSI 160 HP, 1.4 TSI 170 HP, 1.9 TDI 90 HP, 1.9 TDI 105 HP, 2.0 GTI 200 HP, 2.0 TDI 131 HP, 2.0 TDI 140 HP, 2.0 TDI 170 HP'],
            ['Hava', 'C 14 130', 'AK 370/4', '1.4 TSI 122 HP, 1.6 16V 102 HP, 2.0 FSI 150 HP, 2.0 FSI 156 HP'],
            ['Hava', 'C 2998/5 x', 'AP 149/3', '1.4 16V 75 HP'],
            ['Hava', 'C 3880', 'AP 183/3', '1.4 16V 80 HP'],
            ['Hava', 'C 3083', 'AP 149/6', '1.4 FSI 90 HP'],
            ['Hava', 'C 3083/1', 'AP 149/7', '1.6 FSI 115 HP'],
            ['Hava', 'C 41 110', 'AP 149/8', '2.0 GTI 200 HP'],
            ['Hava', 'C 41 002', '—', '2.0 TFSI GTI 230 HP'],
            ['Hava', 'C 36 188', 'AP 004/4', '3.2 R32 250 HP'],
            ['Polen / kabin', 'CU 2939, CUK 2939, FP 2939', 'K 1111, K 1111A', 'Bu nesildeki tüm motorlar'],
            ['Yakıt', 'WK 69', 'PP 836/2', '1.4 FSI 90 HP, 1.4 TSI 122 HP, 1.4 TSI 140 HP, 1.4 TSI 160 HP, 1.4 TSI 170 HP, 1.6 FSI 115 HP, 2.0 FSI 150 HP, 2.0 FSI 156 HP, 2.0 GTI 200 HP, 2.0 TFSI GTI 230 HP'],
            ['Yakıt', 'PU 936/1 x, PU 936/2 x', 'PE 973/2', '1.9 TDI 90 HP, 1.9 TDI 105 HP, 2.0 TDI 131 HP, 2.0 TDI 140 HP, 2.0 TDI 170 HP'],
            ['Yakıt', 'WK 69/2', 'PP 836/4', '1.4 16V 75 HP, 1.4 16V 80 HP, 1.6 16V 102 HP, 3.2 R32 250 HP'],
            ['Yakıt', 'WK 59 x', '—', '1.4 16V 75 HP, 1.6 16V 102 HP, 1.6 FSI 115 HP'],
            ['Yakıt', 'WK 512', 'PP 905', '1.4 FSI 90 HP, 1.6 FSI 115 HP, 2.0 FSI 150 HP'],
          ],
        },
      },
      {
        heading: 'Golf IV filtre kodları',
        paragraphs: [
          "Golf IV (yaklaşık 1997–2004) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Tablodaki her satır, o filtrenin uyduğu motorları gösterir; motor adının yanındaki beygir gücü değeri önemlidir, çünkü aynı hacimdeki iki motor farklı filtre kullanabilir. Motorunuzu seçerek size uyan ürünleri [Golf IV sayfasında](/otomobil/volkswagen/golf-iv-1j1-1j5 \"Volkswagen Golf IV yedek parça\") görebilirsiniz.",
        ],
        table: {
          caption: "Volkswagen Golf IV — filtre türüne göre MANN-FILTER ve FILTRON kodları",
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'HU 726/2 x', 'OE 640/1', '1.9 TDI 100 HP, 1.9 TDI 130 HP, 1.9 TDI 150 HP'],
            ['Yağ', 'W 719/30', 'OP 526/1', '1.6 102 HP, 1.8 Turbo 180 HP'],
            ['Yağ', 'W 712/52', 'OP 641', '1.6 16V 105 HP, 1.6 FSI 110 HP'],
            ['Hava', 'C 37 153', 'AP 149/1', '1.6 102 HP, 1.6 FSI 110 HP, 1.8 Turbo 180 HP, 1.9 TDI 100 HP, 1.9 TDI 130 HP, 1.9 TDI 150 HP'],
            ['Hava', 'C 2998/5 x, C 4287/2', 'AP 149/3', '1.6 16V 105 HP'],
            ['Polen / kabin', 'CUK 2862, FP 2862', 'K 1047A', 'Bu nesildeki tüm motorlar'],
            ['Yakıt', 'WK 730/1', 'PP 836/1', '1.6 102 HP, 1.6 16V 105 HP, 1.6 FSI 110 HP, 1.8 Turbo 180 HP'],
            ['Yakıt', 'WK 853/3 x', 'PP 839/1', '1.9 TDI 100 HP, 1.9 TDI 130 HP, 1.9 TDI 150 HP'],
            ['Şanzıman', 'H 2019 KIT', '—', 'Bu nesildeki tüm motorlar'],
          ],
        },
      },
    ],
    sss: [
      {
        q: 'Golf’te polen filtresi bütün motorlarda aynı mı?',
        a: 'Çoğu nesilde evet; polen filtresi motordan bağımsız olduğu için aynı nesildeki motorların büyük kısmında ortaktır. Yağ, hava ve yakıt filtresi ise motora göre değişir.',
      },
      {
        q: 'Golf 7 1.6 TDI yağ filtresi kodu nedir?',
        a: 'Katalogdaki uyumluluk verisine göre Golf VII 1.6 TDI motorlarda MANN-FILTER HU 7020 z ve FILTRON OE 688/3 yağ filtresi kullanılır. Kesin seçim için motorunuzu sitede seçerek doğrulayın.',
      },
    ],
  },
]

export function rehberBul(slug: string): RehberYazisi | null {
  return REHBER_YAZILARI.find((y) => y.slug === slug) ?? null
}
