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
  {
    slug: 'yag-filtresi-ne-zaman-degisir',
    title: 'Yağ Filtresi Ne Zaman Değiştirilir? Kaç Km’de Bir Değişir?',
    metaTitle: 'Yağ Filtresi Ne Zaman Değiştirilir? | Oto Center Market',
    summary:
      'Yağ filtresi her motor yağı değişiminde yenilenir; yağ değişim aralığı ise araca ve kullanılan yağa göre değişir. Komple ve kartuş filtre farkı, değişimde dikkat edilecekler.',
    tag: 'Bakım',
    readMinutes: 6,
    relatedHref: '/filtreler/yag-filtreleri',
    relatedLabel: 'Yağ filtrelerine göz atın',
    guncelleme: '2026-10-15',
    ilgiliYazilar: ['yag-filtresi-ve-motor-yagi-birlikte-mi', 'periyodik-bakimda-hangi-filtreler-degisir', 'dortlu-filtre-seti-nedir'],
    intro: [
      'Yağ filtresi her motor yağı değişiminde yenilenir; ayrı bir kilometre aralığı yoktur. Yağ değişim aralığı ise araca ve kullanılan yağa göre değişir: birçok araçta 10.000–15.000 km ya da yılda bir, üreticinin onayladığı uzun ömürlü (long life) yağ kullanan bazı araçlarda daha uzun aralıklar uygulanır. Kesin aralık aracın bakım kitapçığında yazar. Motorunuza uyan ürünleri [yağ filtreleri kategorisinde](/filtreler/yag-filtreleri "Yağ filtrelerini görüntüle") bulabilirsiniz.',
      'Aşağıda kilometre ve süre koşullarını, ağır kullanımın aralığı nasıl kısalttığını, filtre tiplerini ve değişimde sık yapılan hataları anlatıyoruz.',
    ],
    body: [
      {
        heading: 'Neden her yağ değişiminde değişir?',
        paragraphs: [
          'Yağ filtresi, motorun içinde oluşan metal aşınma parçacıklarını, kurumu ve yağın zamanla oluşturduğu tortuları tutar. Yağ yenilenip filtre eski kalırsa, filtrede biriken kir yeni yağa karışır ve bakımın faydası büyük ölçüde kaybolur.',
          'Dolmuş bir filtrede baypas valfi açılır; motor yağsız kalmasın diye yağ filtreyi atlayarak dolaşmaya devam eder, ama artık filtrelenmeden. Bu konuyu [yağ filtresi ve motor yağı yazımızda](/blog/yag-filtresi-ve-motor-yagi-birlikte-mi "Yağ filtresi her yağ değişiminde yenilenmeli mi") ayrıca anlattık.',
        ],
      },
      {
        heading: 'Hangi durumlarda aralık kısalır?',
        paragraphs: [
          'Bakım kitapçıklarının çoğu "ağır kullanım" için daha kısa bir yağ değişim aralığı verir. Aşağıdaki koşullardan biri sizin için geçerliyse o aralığı esas almanız gerekir:',
        ],
        list: [
          'Sık kısa mesafe (motor tam ısınmadan kapatılan) kullanım.',
          'Yoğun şehir trafiği ve uzun süre rölantide bekleme.',
          'Tozlu, toprak ya da şantiye yollarında kullanım.',
          'Römork ya da ağır yük çekme.',
          'Çok sıcak veya çok soğuk iklimde sürekli kullanım.',
        ],
      },
      {
        heading: 'Komple (spin-on) mi, kartuş mu?',
        paragraphs: [
          'Komple tipte filtre elemanı metal bir gövdenin içindedir; filtre motordan sökülür ve yenisi takılır. MANN-FILTER kodlarında W, FILTRON’da OP ile başlarlar.',
          'Kartuş tipte gövde motorda kalır, yalnızca içindeki kâğıt eleman ve contalar değişir. MANN-FILTER’da HU, FILTRON’da OE ile başlarlar. Kartuş tiplerde contaların da yenilenmesi gerekir; çoğu ürün conta setiyle birlikte gelir. Hangi tipin aracınıza uyduğunu motorunuzu seçerek görebilirsiniz.',
        ],
      },
      {
        heading: 'Değişimde dikkat edilecekler',
        paragraphs: [],
        steps: [
          'Eski filtrenin contasının motorda kalmadığından emin olun; çift conta yağ kaçırır.',
          'Komple filtrelerde yeni filtrenin contasını bir miktar temiz motor yağıyla yağlayın.',
          'Filtreyi filtrenin üzerinde yazan sıkma talimatına göre takın; aşırı sıkmak contayı ezer, sonraki sökümü de zorlaştırır.',
          'Kartuş tiplerde kapağı servis değerinde sıkın ve yeni contaları kullanın.',
          'Motoru çalıştırıp yağ basınç lambasının sönmesini bekleyin, ardından filtre çevresinde kaçak kontrolü yapın ve yağ seviyesini yeniden ölçün.',
        ],
      },
    ],
    sss: [
      {
        q: 'Yağ filtresi kaç km’de bir değişir?',
        a: 'Yağ filtresinin ayrı bir aralığı yoktur; her motor yağı değişiminde yenilenir. Yağ değişim aralığı aracın bakım kitapçığında yazar ve ağır kullanım koşullarında kısalır.',
      },
      {
        q: 'Sadece yağ değiştirip filtreyi değiştirmesem olur mu?',
        a: 'Önerilmez. Eski filtrede biriken kir yeni yağa karışır; dolmuş bir filtrede baypas valfi açılarak motora filtrelenmemiş yağ gidebilir.',
      },
    ],
  },
  {
    slug: 'aktif-karbonlu-polen-filtresi-farki',
    title: 'Aktif Karbonlu Polen Filtresi mi, Normal Polen Filtresi mi?',
    metaTitle: 'Aktif Karbonlu Polen Filtresi Farkı | Oto Center Market',
    summary:
      'Normal polen filtresi tozu ve poleni tutar; aktif karbonlu filtre buna koku ve gaz tutma özelliği ekler. Hangisini ne zaman seçmeli, kodlardan nasıl ayırt edilir?',
    tag: 'Karşılaştırma',
    readMinutes: 4,
    relatedHref: '/filtreler/polen-kabin-filtreleri',
    relatedLabel: 'Polen / kabin filtrelerine göz atın',
    guncelleme: '2026-10-15',
    ilgiliYazilar: ['polen-filtresi-neden-onemli', 'mann-filter-mi-filtron-mu'],
    intro: [
      'Normal (standart) polen filtresi kabine giren havadaki tozu, poleni ve partikülleri tutar. Aktif karbonlu polen filtresinde buna ek olarak bir aktif karbon katmanı bulunur; bu katman egzoz kokusu gibi kokuları ve bazı zararlı gazları da büyük ölçüde tutar. İki tip genellikle aynı ölçüdedir ve aynı araca birbirinin yerine takılabilir.',
      'Yoğun trafikte çok zaman geçiriyorsanız, alerjiniz varsa ya da kabine giren egzoz kokusundan rahatsız oluyorsanız aktif karbonlu tip belirgin fark yaratır. Aracınıza uyan ürünleri [polen / kabin filtreleri kategorisinde](/filtreler/polen-kabin-filtreleri "Polen filtrelerini görüntüle") bulabilirsiniz.',
    ],
    body: [
      {
        heading: 'Fark nerede?',
        paragraphs: [],
        table: {
          caption: 'Standart ve aktif karbonlu polen filtresinin karşılaştırması',
          head: ['Özellik', 'Standart polen filtresi', 'Aktif karbonlu polen filtresi'],
          rows: [
            ['Toz, polen, partikül', 'Tutar', 'Tutar'],
            ['Egzoz kokusu ve gazlar', 'Tutmaz', 'Büyük ölçüde tutar'],
            ['Görünüş', 'Beyaz / açık renk filtre kâğıdı', 'Gri-siyah karbon katmanlı'],
            ['Kime uygun?', 'Genel kullanım', 'Yoğun trafik, alerji, kokuya hassas sürücüler'],
          ],
        },
      },
      {
        heading: 'Kodlardan nasıl ayırt edilir?',
        paragraphs: [
          'MANN-FILTER’da CU ile başlayan kodlar standart, CUK ile başlayanlar aktif karbonludur. FP ile başlayan FreciousPlus serisinde aktif karbona ek olarak biyofonksiyonel bir katman bulunur. Örneğin aynı araca uyan CU 26 009, CUK 26 009 ve FP 26 009 aynı ölçüde üç farklı seviyedir.',
          'FILTRON’da kabin filtreleri K ile başlar; aktif karbonlu tipler kodun sonundaki A harfiyle ayrılır (K 1311 ve K 1311A gibi). İki markanın kod sistemi için [MANN-FILTER ve FILTRON karşılaştırmamıza](/blog/mann-filter-mi-filtron-mu "MANN-FILTER mi FILTRON mu") bakabilirsiniz.',
        ],
      },
      {
        heading: 'Değişim aralığı farklı mı?',
        paragraphs: [
          'Her iki tip için de yaygın uygulama yılda bir ya da 15.000–20.000 km aralığında değişimdir. Aktif karbon katmanının koku tutma kapasitesi zamanla dolar; kabine yeniden koku gelmeye başlaması filtrenin değişim zamanının geldiğini gösterebilir. Belirtilerin listesini [polen filtresi yazımızda](/blog/polen-filtresi-neden-onemli "Polen filtresi rehberi") bulabilirsiniz.',
        ],
      },
    ],
    sss: [
      {
        q: 'Aktif karbonlu polen filtresi normal filtrenin yerine takılır mı?',
        a: 'Genellikle evet; aynı araca uyan standart ve aktif karbonlu tipler aynı ölçüdedir. Sitemizde motorunuzu seçtiğinizde her iki tip de uyumlu ürünler arasında listelenir.',
      },
      {
        q: 'CUK ve CU arasındaki fark nedir?',
        a: 'MANN-FILTER kodlarında CU standart polen filtresidir; CUK aynı ölçüde, ek olarak aktif karbon katmanı bulunan tiptir ve koku ile bazı gazları da tutar.',
      },
    ],
  },
  {
    slug: 'dortlu-filtre-seti-nedir',
    title: '4’lü Filtre Seti Nedir? Ne Zaman Birlikte Değiştirilmeli?',
    metaTitle: '4’lü Filtre Seti Nedir? | Oto Center Market',
    summary:
      'Yağ, hava, polen ve yakıt filtresinden oluşan 4’lü set nedir, dört filtre her bakımda birlikte değişmeli mi, aracınıza uygun seti nasıl oluşturursunuz?',
    tag: 'Bakım',
    readMinutes: 4,
    relatedHref: '/filtreler',
    relatedLabel: 'Tüm filtreleri görün',
    guncelleme: '2026-10-15',
    ilgiliYazilar: ['periyodik-bakimda-hangi-filtreler-degisir', 'yag-filtresi-ne-zaman-degisir', 'yakit-filtresi-ne-zaman-degisir'],
    intro: [
      '4’lü filtre seti, bir aracın periyodik bakımında değişen dört filtrenin birlikte alınmasıdır: yağ filtresi, hava filtresi, polen (kabin) filtresi ve yakıt filtresi. Dördünü aynı bakımda değiştirmek işçiliği tek seferde toplar ve hiçbir filtrenin aralığının gözden kaçmamasını sağlar. Ancak dördünün her bakımda birlikte değişmesi şart değildir; her filtrenin kendi değişim aralığı vardır.',
    ],
    body: [
      {
        heading: 'Setteki filtreler ve aralıkları',
        paragraphs: [
          'Aralıklar yaygın değerlerdir ve bakım kitapçığının yerine geçmez. Ağır kullanım koşullarında kısalırlar.',
        ],
        table: {
          caption: '4’lü filtre setindeki filtrelerin yaygın değişim aralıkları',
          head: ['Filtre', 'Yaygın değişim aralığı'],
          rows: [
            ['Yağ filtresi', 'Her motor yağı değişiminde'],
            ['Hava filtresi', '15.000 – 30.000 km veya yılda bir'],
            ['Polen / kabin filtresi', '15.000 – 20.000 km veya yılda bir'],
            ['Yakıt filtresi', '20.000 – 30.000 km'],
          ],
        },
      },
      {
        heading: 'Dördü birlikte mi değişmeli?',
        paragraphs: [
          'Yağ filtresi her bakımda değişir. Hava ve polen filtresi çoğu araçta yılda bir değiştiği için, yılda bir bakıma giden bir araçta bu üçü genellikle aynı bakıma denk gelir. Yakıt filtresinin aralığı daha uzun olabilir; bir bakım atlayabilir.',
          'Bazı benzinli araçlarda yakıt filtresi depo içindeki pompaya entegredir ve periyodik bakımda değişmez. Bu araçlarda "set" fiilen üç filtreden oluşur.',
        ],
      },
      {
        heading: 'Aracınıza uygun seti nasıl oluşturursunuz?',
        paragraphs: [],
        steps: [
          'Sitede aracınızı marka, model ve motor sırasıyla seçin.',
          'Motor sayfasında yağ, hava, polen ve yakıt filtresi kategorilerinde yalnızca o motora uyumlu ürünler listelenir.',
          'Her kategoriden bir ürün seçip sepete ekleyin; MANN-FILTER ve FILTRON ürünlerini dilediğiniz gibi karıştırabilirsiniz.',
          'Aracınızda değiştirilebilir yakıt filtresi yoksa o kategoride uyumlu ürün çıkmaz; bu durumda set üç filtreden oluşur.',
        ],
      },
    ],
    sss: [
      {
        q: '4’lü filtre seti hangi filtrelerden oluşur?',
        a: 'Yağ filtresi, hava filtresi, polen (kabin) filtresi ve yakıt filtresinden oluşur.',
      },
      {
        q: 'Her bakımda 4 filtrenin de değişmesi gerekir mi?',
        a: 'Hayır. Yağ filtresi her bakımda değişir; hava, polen ve yakıt filtresinin kendi aralıkları vardır. Aralığı gelen filtreleri aynı bakımda değiştirmek pratiktir.',
      },
    ],
  },
  {
    slug: 'renault-clio-megane-filtre-rehberi',
    title: 'Renault Clio ve Mégane Filtre Rehberi: Yağ, Hava, Polen ve Yakıt Filtresi Kodları',
    metaTitle: 'Renault Clio ve Megane Filtre Kodları | Oto Center Market',
    summary:
      'Clio II–V ve Mégane I–IV için motor bazında MANN-FILTER ve FILTRON yağ, hava, polen ve yakıt filtresi kodları. Doğru filtreyi motorunuza göre bulun.',
    tag: 'Model rehberi',
    readMinutes: 9,
    relatedHref: '/otomobil/renault',
    relatedLabel: 'Renault modellerine göz atın',
    guncelleme: '2026-10-15',
    ilgiliYazilar: ['volkswagen-golf-filtre-rehberi', 'dortlu-filtre-seti-nedir'],
    intro: [
      'Renault Clio ve Mégane’da filtre seçimi motor tipine göre belirgin şekilde değişir: 1.5 dCi dizel ile 1.2 TCe benzinli motor aynı nesilde farklı yağ, hava ve yakıt filtresi kullanır. Aşağıdaki tablolar katalogdaki uyumluluk verisinden hazırlandı; her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır.',
      'Tablolar hızlı başvuru içindir. Kesin seçim için [Renault modelleri](/otomobil/renault "Renault yedek parça") arasından neslinizi ve motorunuzu seçin; yalnızca o motora uyumlu ürünler listelenir.',
    ],
    body: [
      {
        heading: 'Neslinizi ve motorunuzu nasıl anlarsınız?',
        paragraphs: [
          'Nesli ruhsattaki model yılından tahmin edebilirsiniz; ancak nesil geçiş yıllarında iki nesil bir süre birlikte satılmıştır. Motor hacmi ve gücü ruhsatta yazar. Motor adındaki dCi dizel, TCe turbo benzinli, 16V ise atmosferik benzinli motoru gösterir.',
          'Aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Bu durumda eski filtrenin üzerindeki kodu kontrol edin ya da siparişten önce şasi numaranızla bize sorun.',
        ],
      },
      {
        heading: 'Clio V filtre kodları',
        paragraphs: [
          'Clio V (yaklaşık 2019 ve sonrası) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Clio V sayfasında](/otomobil/renault/clio-v "Renault Clio V yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Renault Clio V — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', '—', 'OE 666/3', '1.0 LPG 91 HP, 1.0 TCe 100 101 HP, 1.0 TCe 90 91 HP, 1.3 TCe 100 131 HP, 1.3 TCe 140 140 HP'],
            ['Yağ', 'HU 10 002 z', '—', '1.0 LPG 91 HP, 1.0 TCe 100 101 HP, 1.3 TCe 100 131 HP, 1.3 TCe 140 140 HP'],
            ['Yağ', 'HU 618 y', 'OE 666/4', '1.5 Blue dCi 100 101 HP, 1.5 Blue dCi 115 116 HP, 1.5 Blue dCi 85 86 HP'],
            ['Yağ', 'W 79', 'OP 643/4', '1.0 SCe 65 65 HP, 1.0 SCe 75 72 HP'],
            ['Yağ', 'W 67/1', 'OP 595', '1.6 E-Tech 140 91 HP, 1.6 E-Tech 145 143 HP'],
            ['Hava', '—', 'AP 154/5', '1.0 LPG 91 HP, 1.0 SCe 65 65 HP, 1.0 SCe 75 72 HP, 1.0 TCe 100 101 HP, 1.0 TCe 90 91 HP, 1.3 TCe 100 131 HP, 1.3 TCe 140 140 HP, 1.5 Blue dCi 100 101 HP, 1.5 Blue dCi 115 116 HP, 1.5 Blue dCi 85 86 HP'],
            ['Hava', '—', 'AP 136/2', '1.6 E-Tech 140 91 HP, 1.6 E-Tech 145 143 HP'],
            ['Hava', 'C 24 057', '—', '1.0 SCe 75 72 HP'],
            ['Polen / kabin', 'CU 22 011, CUK 22 011, FP 22 011', '—', 'Bu nesildeki tüm motorlar'],
            ['Polen / kabin', '—', 'K 1321', '1.0 LPG 91 HP, 1.0 SCe 75 72 HP, 1.3 TCe 100 131 HP, 1.3 TCe 140 140 HP, 1.5 Blue dCi 100 101 HP, 1.5 Blue dCi 115 116 HP, 1.5 Blue dCi 85 86 HP, 1.6 E-Tech 140 91 HP, 1.6 E-Tech 145 143 HP'],
            ['Yakıt', '—', 'PE 994/1', '1.5 Blue dCi 100 101 HP, 1.5 Blue dCi 115 116 HP, 1.5 Blue dCi 85 86 HP'],
          ],
        },
      },
      {
        heading: 'Clio IV filtre kodları',
        paragraphs: [
          'Clio IV (yaklaşık 2012–2019) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Clio IV sayfasında](/otomobil/renault/clio-iv "Renault Clio IV yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Renault Clio IV — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'HU 10 002 z', '—', '0.9 TCe 75 76 HP, 1.2 TCe 120 118 HP, 1.2 TCe 120 120 HP'],
            ['Yağ', 'W 7032', 'OP 643/5', '1.5 dCi 75 HP, 1.5 dCi 90 HP, 1.5 dCi 110 HP'],
            ['Yağ', 'W 66', 'OP 642/2', '1.2 16V 74 HP'],
            ['Yağ', '—', 'OE 666/3', '1.2 TCe 120 120 HP'],
            ['Hava', 'C 27 030', '—', '0.9 TCe 90 HP, 0.9 TCe 75 76 HP, 1.2 TCe 120 118 HP, 1.2 TCe 120 120 HP, 1.5 dCi 75 HP, 1.5 dCi 90 HP, 1.5 dCi 110 HP'],
            ['Hava', '—', 'AP 134/8', '1.2 16V 74 HP'],
            ['Polen / kabin', 'CU 22 011, CUK 22 011, FP 22 011', '—', 'Bu nesildeki tüm motorlar'],
            ['Yakıt', 'PU 9011 z KIT', 'PE 815/7', '1.5 dCi 75 HP, 1.5 dCi 90 HP, 1.5 dCi 110 HP'],
          ],
        },
      },
      {
        heading: 'Clio III ve Clio Collection filtre kodları',
        paragraphs: [
          'Clio III ve Clio Collection (yaklaşık 2005–2014) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Clio III ve Clio Collection sayfasında](/otomobil/renault/clio-iii-clio-collection "Renault Clio III ve Clio Collection yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Renault Clio III ve Clio Collection — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'W 75/3', 'OP 643/3', '1.4 16V 98 HP, 1.5 dCi 65 HP, 1.5 dCi 68 HP, 1.5 dCi 86 HP, 1.5 dCi 106 HP, 1.6 16V 88 HP, 1.6 16V 112 HP, 1.6 16V 128 HP'],
            ['Yağ', 'W 79', 'OP 643/4', '1.5 dCi 65 HP, 1.5 dCi 68 HP, 1.5 dCi 86 HP, 1.5 dCi 106 HP'],
            ['Yağ', 'W 66', 'OP 642/2', '1.2 16V 65 HP, 1.2 16V 75 HP, 1.2 16V Turbo TCE 100 HP'],
            ['Hava', '—', 'AP 134/7', '1.5 dCi 65 HP, 1.5 dCi 68 HP, 1.5 dCi 86 HP, 1.5 dCi 106 HP, 1.6 16V 112 HP, 1.6 16V 128 HP'],
            ['Hava', 'C 2485/2', '—', '1.2 16V Turbo TCE 100 HP, 1.4 16V 98 HP, 1.6 16V 88 HP'],
            ['Hava', 'C 2485/1', '—', '1.5 dCi 106 HP, 1.6 16V 112 HP, 1.6 16V 128 HP'],
            ['Hava', '—', 'AP 134/8', '1.2 16V 65 HP, 1.2 16V 75 HP'],
            ['Hava', 'C 3366', '—', '1.2 16V 75 HP'],
            ['Polen / kabin', 'CU 1829, CUK 1829', '—', 'Bu nesildeki tüm motorlar'],
            ['Yakıt', 'WK 6002', 'PP 831/1', '1.2 16V 65 HP, 1.2 16V 75 HP, 1.2 16V Turbo TCE 100 HP, 1.4 16V 98 HP, 1.6 16V 88 HP, 1.6 16V 112 HP, 1.6 16V 128 HP'],
            ['Yakıt', 'WK 939/11 x, WK 939/3', 'PS 980/8, PS 980/9', '1.5 dCi 65 HP, 1.5 dCi 68 HP, 1.5 dCi 86 HP, 1.5 dCi 106 HP'],
          ],
        },
      },
      {
        heading: 'Clio II ve Clio Symbol filtre kodları',
        paragraphs: [
          'Clio II ve Clio Symbol (yaklaşık 1998–2012) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Clio II ve Clio Symbol sayfasında](/otomobil/renault/clio-ii-clio-symbol "Renault Clio II ve Clio Symbol yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Renault Clio II ve Clio Symbol — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'W 75/3', 'OP 643/3', '1.4 16V 98 HP, 1.5 dCi 65 HP, 1.5 dCi 68 HP, 1.5 dCi 82 HP, 1.5 dCi 101 HP'],
            ['Yağ', 'HU 611 x, W 66', 'OE 666, OP 642/2', '1.2 16V 75 HP'],
            ['Hava', 'C 3875, C 3875/1', 'AP 134/4, AP 134/6', '1.5 dCi 65 HP, 1.5 dCi 68 HP, 1.5 dCi 82 HP, 1.5 dCi 101 HP'],
            ['Hava', 'C 1932', 'AP 133/2, AP 134/8', '1.2 16V 75 HP'],
            ['Hava', 'C 1858/2', 'AP 185/1', '1.4 16V 98 HP'],
            ['Polen / kabin', 'CU 2945', 'K 1052', 'Bu nesildeki tüm motorlar'],
            ['Yakıt', 'WK 939/9 x', '—', '1.5 dCi 65 HP, 1.5 dCi 68 HP, 1.5 dCi 82 HP, 1.5 dCi 101 HP'],
            ['Yakıt', 'WK 939/8 x', 'PS 980/4', '1.5 dCi 65 HP, 1.5 dCi 82 HP, 1.5 dCi 101 HP'],
            ['Yakıt', 'WK 6002', 'PP 831/1', '1.2 16V 75 HP, 1.4 16V 98 HP'],
          ],
        },
      },
      {
        heading: 'Mégane IV filtre kodları',
        paragraphs: [
          'Mégane IV (yaklaşık 2016 ve sonrası) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Mégane IV sayfasında](/otomobil/renault/megane-iv "Renault Mégane IV yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Renault Mégane IV — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'W 7032', 'OP 643/5', '1.5 dCi 110 110 HP, 1.5 dCi 90 90 HP'],
            ['Yağ', 'HU 6011 z', 'OE 666/2', '1.6 dCi 130 131 HP, 1.6 dCi 165 163 HP'],
            ['Yağ', 'W 6025', 'OP 643/6', '1.6 16V 114 HP'],
            ['Hava', 'C 22 014', 'AP 135/9', 'Bu nesildeki tüm motorlar'],
            ['Polen / kabin', 'CU 25 003, CUK 25 003, FP 25 003', 'K 1355, K 1367A', 'Bu nesildeki tüm motorlar'],
          ],
        },
      },
      {
        heading: 'Mégane III filtre kodları',
        paragraphs: [
          'Mégane III (yaklaşık 2008–2016) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Mégane III sayfasında](/otomobil/renault/megane-iii "Renault Mégane III yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Renault Mégane III — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'W 79', 'OP 643/4', '1.4 16V 130 HP, 1.5 dCi 95 95 HP, 1.5 dCi FAP 86 HP, 1.5 dCi FAP 90 HP, 1.5 dCi FAP 110 HP'],
            ['Yağ', 'HU 10 002 z', 'OE 666/3', '1.2 TCe 110 116 HP, 1.2 TCe 130 132 HP'],
            ['Yağ', 'W 7032', 'OP 643/5', '1.5 dCi FAP 90 HP, 1.5 dCi FAP 110 HP'],
            ['Yağ', 'W 75/3', 'OP 643/3', '1.6 16V 100 HP, 1.6 16V 110 HP'],
            ['Yağ', 'HU 6011 z', 'OE 666/2', '1.6 dCi 130 131 HP'],
            ['Yağ', 'W 8013', 'OP 642/3', '1.9 dCi FAP 130 HP'],
            ['Hava', 'C 25 115', 'AP 185/6', 'Bu nesildeki tüm motorlar'],
            ['Polen / kabin', '—', 'K 1300A', 'Bu nesildeki tüm motorlar'],
            ['Yakıt', 'WK 6002', 'PP 831/1', '1.2 TCe 110 116 HP, 1.2 TCe 130 132 HP, 1.4 16V 130 HP, 1.6 16V 100 HP, 1.6 16V 110 HP'],
            ['Yakıt', 'WK 9012 x', 'PP 988/2', '1.5 dCi 95 95 HP, 1.5 dCi FAP 86 HP, 1.5 dCi FAP 90 HP, 1.5 dCi FAP 110 HP, 1.9 dCi FAP 130 HP'],
          ],
        },
      },
      {
        heading: 'Mégane II filtre kodları',
        paragraphs: [
          'Mégane II (yaklaşık 2002–2009) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Mégane II sayfasında](/otomobil/renault/megane-ii "Renault Mégane II yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Renault Mégane II — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'W 75/3', 'OP 643/3', '1.4 16V 82 HP, 1.4 16V 98 HP, 1.5 dCi 82 HP, 1.5 dCi 86 HP, 1.5 dCi 101 HP, 1.5 dCi 106 HP, 1.6 16V 105 HP, 1.6 16V 113 HP'],
            ['Yağ', 'W 79', 'OP 643/4', '1.5 dCi 86 HP, 1.5 dCi 106 HP, 1.9 dCi 92 HP, 1.9 dCi 120 HP, 1.9 dCi FAP 110 HP, 1.9 dCi FAP 130 HP'],
            ['Hava', 'C 2512', 'AP 185/2', '1.5 dCi 82 HP, 1.5 dCi 86 HP, 1.5 dCi 101 HP, 1.5 dCi 106 HP, 1.6 16V 113 HP'],
            ['Hava', 'C 2538', '—', '1.9 dCi 92 HP, 1.9 dCi 120 HP, 1.9 dCi FAP 110 HP, 1.9 dCi FAP 130 HP'],
            ['Hava', 'C 1858/2', 'AP 185/1', '1.4 16V 82 HP, 1.4 16V 98 HP, 1.6 16V 105 HP'],
            ['Polen / kabin', 'CU 2316, CUK 2316', 'K 1130', 'Bu nesildeki tüm motorlar'],
            ['Yakıt', 'WK 6002', 'PP 831/1', '1.4 16V 82 HP, 1.4 16V 98 HP, 1.6 16V 105 HP, 1.6 16V 113 HP'],
            ['Yakıt', '—', 'PM 816/1', '1.9 dCi 92 HP, 1.9 dCi 120 HP, 1.9 dCi FAP 110 HP, 1.9 dCi FAP 130 HP'],
            ['Yakıt', 'WK 939/4, WK 939/5', 'PS 980/1, PS 980/3', '1.5 dCi 82 HP, 1.5 dCi 101 HP'],
            ['Yakıt', 'WK 919/1, WK 920/5', 'PP 980/7', '1.5 dCi 86 HP, 1.5 dCi 106 HP'],
          ],
        },
      },
      {
        heading: 'Mégane I filtre kodları',
        paragraphs: [
          'Mégane I (yaklaşık 1995–2003) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Mégane I sayfasında](/otomobil/renault/megane-i "Renault Mégane I yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Renault Mégane I — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'W 75/3', 'OP 643/3', '1.4i 16V 95 HP, 1.6i 16V 107 HP, 1.8i 16V 115 HP, 1.9 D 65 HP, 1.9 dTi 80 HP, 2.0i 109 HP, 2.0i 16V 138 HP, 2.0i 16V 139 HP, 2.0i 16V 140 HP'],
            ['Yağ', 'W 79', 'OP 643/4', '1.9 dCi 102 HP'],
            ['Hava', 'C 1858/2', 'AP 185/1', '1.4i 16V 95 HP, 1.6i 16V 107 HP, 1.8i 16V 115 HP, 2.0i 16V 139 HP'],
            ['Hava', 'C 18 121', 'AR 274', '2.0i 109 HP, 2.0i 16V 138 HP, 2.0i 16V 140 HP'],
            ['Hava', 'C 3251/1', 'AP 134/2', '1.9 dCi 102 HP, 1.9 dTi 80 HP'],
            ['Hava', 'C 2987/1', 'AP 134/3', '1.9 D 65 HP'],
            ['Polen / kabin', 'CU 2424, CU 2945', 'K 1030, K 1052', 'Bu nesildeki tüm motorlar'],
            ['Yakıt', 'WK 6002', 'PP 831/1', '1.4i 16V 95 HP, 1.6i 16V 107 HP, 1.8i 16V 115 HP, 2.0i 109 HP, 2.0i 16V 138 HP, 2.0i 16V 139 HP, 2.0i 16V 140 HP'],
            ['Yakıt', 'P 716/1 x, PU 822 x', 'PE 815/2, PM 815/1', '1.9 D 65 HP, 1.9 dTi 80 HP'],
          ],
        },
      },
    ],
    sss: [
      {
        q: 'Renault Clio 4 1.5 dCi yağ filtresi kodu nedir?',
        a: 'Katalogdaki uyumluluk verisine göre Clio IV 1.5 dCi motorlarda MANN-FILTER W 7032 ve FILTRON OP 643/5 yağ filtresi kullanılır. Kesin seçim için motorunuzu sitede seçerek doğrulayın.',
      },
      {
        q: 'Clio ve Mégane’da polen filtresi bütün motorlarda aynı mı?',
        a: 'Çoğu nesilde evet; polen filtresi motordan bağımsız olduğu için aynı nesildeki motorların büyük kısmında ortaktır. Yağ, hava ve yakıt filtresi ise motora göre değişir.',
      },
    ],
  },
  {
    slug: 'polen-filtresi-kac-km-de-degisir',
    title: 'Polen Filtresi Kaç Km’de Değişir? Klimadan Gelen Kötü Kokunun Sebepleri',
    metaTitle: 'Polen Filtresi Kaç Km’de Değişir? | Oto Center Market',
    summary:
      'Polen filtresi çoğu araçta 15.000–20.000 km’de ya da yılda bir değişir. Klimadan gelen küf kokusu, zayıf üfleme ve buğulanan camlar filtrenin erken değişmesi gerektiğini gösterebilir.',
    tag: 'Bakım',
    readMinutes: 4,
    relatedHref: '/filtreler/polen-kabin-filtreleri',
    relatedLabel: 'Polen / kabin filtrelerine göz atın',
    guncelleme: '2026-10-16',
    ilgiliYazilar: ['aktif-karbonlu-polen-filtresi-farki', 'polen-filtresi-neden-onemli'],
    intro: [
      'Polen filtresi çoğu araçta 15.000–20.000 kilometrede ya da yılda bir kez, hangisi önce gelirse değiştirilir. Yoğun trafikte, tozlu yolda veya nemli bölgelerde kullanılan araçlarda bu süre kısalır; birçok sürücü filtreyi her yıl klima sezonundan önce yeniler. Kesin değer aracınızın bakım kitapçığında yazar.',
      'Klimadan gelen kötü koku çoğu zaman ilk olarak polen filtresine bakılmasını gerektirir: nem ve kir tutmuş eski bir filtre koku kaynağı olabilir. Aracınıza uyan ürünleri [polen / kabin filtreleri kategorisinde](/filtreler/polen-kabin-filtreleri "Polen filtrelerini görüntüle") bulabilirsiniz.',
    ],
    body: [
      {
        heading: 'Değişim aralığını ne kısaltır?',
        paragraphs: [
          'Bakım kitapçığındaki aralık normal kullanım içindir. Aşağıdaki durumlarda filtre daha çabuk dolar ve kitapçıktaki süreyi beklemeden kontrol etmek mantıklıdır:',
        ],
        list: [
          'Şehir içi yoğun trafikte, egzoz dumanı içinde uzun süre kalmak.',
          'Toprak, şantiye ya da tozlu köy yolunda sık kullanım.',
          'Ağaç altında park etmek: yaprak, polen ve reçine hava girişine dolar.',
          'Nemli iklim ve sık yağmur: ıslanan filtre kuruyamadan kir tutar.',
          'Araçta sigara içilmesi.',
        ],
      },
      {
        heading: 'Klimadan neden kötü koku gelir?',
        paragraphs: [
          'Klima çalışırken evaporatör (soğutucu) üzerinde nem yoğuşur. Bu nem, filtreden geçen toz ve organik kirle birleştiğinde küf ve bakteri üremesine uygun bir ortam oluşur. Kokunun yaygın kaynakları şunlardır:',
        ],
        list: [
          'Eski ve kirli polen filtresi: tuttuğu nemli kir koku yapar.',
          'Evaporatör yüzeyinde küf: filtre yenilense de koku sürebilir.',
          'Tıkalı klima tahliye (drenaj) hortumu: yoğuşan su dışarı atılamaz, kutuda birikir.',
          'Hava girişine dolan yaprak ve kir: genellikle ön cam altındaki ızgaranın altında birikir.',
        ],
      },
      {
        heading: 'Koku varsa ne yapmalı?',
        paragraphs: [],
        steps: [
          'Önce polen filtresini kontrol edin; kararmış, nemli ya da yaprak dolmuşsa değiştirin.',
          'Filtre yuvasını ve ön cam altındaki hava girişini yaprak ve kirden temizleyin.',
          'Koku devam ediyorsa klima sistemini bir serviste temizletin (evaporatör ve kanal temizliği).',
          'Araç altında klima suyunun damladığını kontrol edin; yaz aylarında damlama yoksa tahliye hortumu tıkalı olabilir.',
          'Günlük kullanımda, park etmeden birkaç dakika önce klimayı (kompresörü) kapatıp yalnızca fanı çalıştırın. Bu, evaporatörün kurumasına yardım eder.',
        ],
      },
      {
        heading: 'Hangi filtreyi seçmeli?',
        paragraphs: [
          'Koku hassasiyetiniz varsa ya da yoğun trafikte çok zaman geçiriyorsanız aktif karbonlu tip daha uygundur; farkları [aktif karbonlu polen filtresi yazımızda](/blog/aktif-karbonlu-polen-filtresi-farki "Aktif karbonlu polen filtresi farkı") anlattık. İki tip genellikle aynı ölçüdedir ve aynı araca takılabilir.',
          'Doğru ölçüyü bulmak için sitede aracınızın marka, model ve motorunu seçin ya da eski filtrenin üzerindeki kodu arama kutusuna yazın.',
        ],
      },
    ],
    sss: [
      {
        q: 'Polen filtresi değiştirilmezse ne olur?',
        a: 'Filtre tıkandıkça fandan gelen hava zayıflar, camların buğusu geç açılır ve kabine daha fazla toz girer. Nem tutmuş eski filtre klimadan kötü koku gelmesine de yol açabilir.',
      },
      {
        q: 'Polen filtresi yıkanıp tekrar takılabilir mi?',
        a: 'Hayır. Polen filtresi tek kullanımlıktır; yıkamak ya da hava ile üflemek filtre malzemesine zarar verir ve tutma özelliğini düşürür. Kirlendiğinde yenisiyle değiştirilir.',
      },
      {
        q: 'Filtreyi değiştirdim ama koku geçmedi, neden?',
        a: 'Koku büyük ihtimalle evaporatör yüzeyindeki küften ya da tıkalı tahliye hortumundan geliyordur. Bu durumda klima sisteminin bir serviste temizletilmesi gerekir.',
      },
    ],
  },
  {
    slug: 'orijinal-ve-muadil-filtre-farki',
    title: 'Orijinal (OE) Filtre ile Muadil Filtre Arasındaki Fark Nedir?',
    metaTitle: 'Orijinal ve Muadil Filtre Farkı | Oto Center Market',
    summary:
      'OE parça, OEM, muadil ve yan sanayi ne anlama gelir? Araç markasının kutusundaki filtre ile filtre üreticisinin kendi markalı ürünü arasındaki farkı ve dikkat edilmesi gerekenleri anlattık.',
    tag: 'Rehber',
    readMinutes: 5,
    relatedHref: '/markalar',
    relatedLabel: 'Markalarımıza göz atın',
    guncelleme: '2026-10-16',
    ilgiliYazilar: ['oem-numarasi-ile-parca-bulma', 'mann-filter-mi-filtron-mu'],
    intro: [
      'Orijinal (OE) filtre, araç üreticisinin kendi logolu kutusunda sattığı filtredir; muadil filtre ise aynı araca uyan, başka bir markanın ürettiği filtredir. Araç markaları filtreyi genellikle kendileri üretmez, MANN-FILTER gibi filtre üreticilerinden alır. Bu yüzden iyi bir muadil ile OE parça arasındaki fark çoğu zaman kalitede değil, kutudaki logodadır.',
      'Asıl fark muadil markalar arasındadır: tanınmış bir filtre üreticisinin ürünü ile kaynağı belirsiz ucuz bir filtre aynı ölçüde olsa da aynı işi yapmayabilir. Aşağıda terimleri ve seçerken nelere bakmanız gerektiğini açıkladık.',
    ],
    body: [
      {
        heading: 'Terimler ne anlama geliyor?',
        paragraphs: [],
        table: {
          caption: 'Yedek parça piyasasında sık kullanılan terimler',
          head: ['Terim', 'Anlamı'],
          rows: [
            ['OE / orijinal parça', 'Araç üreticisinin logolu kutusunda, yetkili servis kanalıyla satılan parça.'],
            ['OEM numarası', 'Araç üreticisinin parçaya verdiği kod. Parçanın kendisini değil, numarayı anlatır.'],
            ['Muadil', 'Aynı araca uyan, başka bir markanın ürettiği parça. Kalitesi markaya göre çok değişir.'],
            ['Yan sanayi', 'Günlük dilde muadil ile aynı anlamda kullanılır; çoğu zaman ucuz ve kaynağı belirsiz ürünleri anlatır.'],
            ['Orijinal ürün (sahte değil)', 'Üzerinde yazan markanın gerçekten ürettiği ürün. “Orijinal MANN-FILTER” ifadesi bu anlamdadır.'],
          ],
        },
      },
      {
        heading: 'Araç markası filtreyi nereden alıyor?',
        paragraphs: [
          'Otomobil üreticileri filtreyi çoğunlukla filtre üreticilerinden tedarik eder. MANN+HUMMEL, birçok araç üreticisine fabrikada takılan (ilk montaj) filtre sağlayan firmalardandır ve aynı tecrübeyle MANN-FILTER ve FILTRON markalarını yedek parça pazarında satar.',
          'Bu nedenle bir filtrenin “orijinal” olup olmadığını yalnızca kutudaki araç logosuna bakarak anlamak yanıltıcı olabilir. Önemli olan filtrenin araç üreticisinin istediği ölçü, filtreleme ve dayanım değerlerini karşılamasıdır.',
        ],
      },
      {
        heading: 'Muadil filtre seçerken nelere dikkat etmeli?',
        paragraphs: [],
        list: [
          'Marka: filtre üretimiyle tanınan, kataloğu ve çapraz numaraları açık olan markaları seçin.',
          'Doğru kod: aracınızın motoruna uyan kodu katalogdan doğrulayın; dış ölçünün uyması yeterli değildir.',
          'Ambalaj ve baskı: bulanık baskı, yazım hatası, etiketsiz kutu sahte ürün işareti olabilir.',
          'Fiyat: piyasanın çok altındaki fiyat sahte ya da düşük kaliteli ürün riskini artırır.',
          'Satıcı: faturalı satış yapan ve ürünün kaynağını gösterebilen satıcıdan alın.',
        ],
      },
      {
        heading: 'Kalitesiz filtrenin riski nedir?',
        paragraphs: [
          'Filtre dışarıdan aynı görünse de içindeki kâğıdın kalitesi, kat sayısı, conta ve bypass valfi farklı olabilir. Kalitesiz bir yağ filtresi yağı yeterince temizleyemez ya da soğuk çalıştırmada motoru kısa süre yağsız bırakabilir; kalitesiz hava filtresi ise ince tozu motora geçirebilir. Bu hasarlar hemen fark edilmez, motor aşınması olarak zamanla ortaya çıkar.',
        ],
      },
      {
        heading: 'Garanti süresindeki araçlarda ne yapmalı?',
        paragraphs: [
          'Garantisi devam eden araçlarda bakımın nerede ve hangi parçayla yapılacağına dair şartlar üreticiden üreticiye değişir. Muadil parça kullanmadan önce aracınızın garanti kitapçığındaki koşulları okuyun ve bakım faturalarınızı saklayın.',
        ],
      },
    ],
    sss: [
      {
        q: 'MANN-FILTER orijinal parça mı, muadil mi?',
        a: 'MANN-FILTER kutusundaki ürün, araç markasının logolu kutusunda satılmadığı için yedek parça dilinde muadil sayılır. Ancak MANN+HUMMEL birçok araç üreticisine ilk montaj filtre sağlayan bir firmadır; ürünün kendisi orijinal MANN-FILTER ürünüdür.',
      },
      {
        q: 'Muadil filtre motora zarar verir mi?',
        a: 'Doğru kodda, tanınmış bir üreticinin filtresi zarar vermez. Risk, kaynağı belirsiz ve kalitesiz ürünlerdedir; bu yüzden markaya ve satıcıya dikkat etmek gerekir.',
      },
      {
        q: 'Aracımın orijinal filtre numarasını nasıl bulurum?',
        a: 'Eski filtrenin üzerindeki kodu ya da faturadaki OEM numarasını sitedeki arama kutusuna yazabilirsiniz. Ayrıntılar için OEM numarasıyla parça bulma yazımıza bakabilirsiniz.',
      },
    ],
  },
  {
    slug: 'uzun-yol-oncesi-arac-bakim-kontrol-listesi',
    title: 'Uzun Yol Öncesi Araç Bakım Kontrol Listesi',
    metaTitle: 'Uzun Yol Öncesi Araç Kontrol Listesi | Oto Center Market',
    summary:
      'Uzun yola çıkmadan önce yağ, soğutma suyu, lastik, fren, akü, filtreler ve araçta bulunması gereken ekipmanlar için adım adım kontrol listesi.',
    tag: 'Bakım',
    readMinutes: 5,
    relatedHref: '/filtreler',
    relatedLabel: 'Tüm filtreleri görün',
    guncelleme: '2026-10-16',
    ilgiliYazilar: ['periyodik-bakimda-hangi-filtreler-degisir', 'dortlu-filtre-seti-nedir'],
    intro: [
      'Uzun yoldan önce en az birkaç gün önce motor yağı ve soğutma suyu seviyesini, lastik basıncı ve diş derinliğini, frenleri, aküyü, farları ve silecekleri kontrol edin; bakımı yaklaşmışsa yağ ve filtre değişimini yoldan önce yaptırın. Böylece eksik bir parça çıkarsa tedarik etmek için zamanınız olur.',
      'Aşağıdaki listeyi yolculuktan önce sırayla kontrol edebilirsiniz. Kontrollerin çoğu motor soğukken ve araç düz bir zemindeyken yapılmalıdır.',
    ],
    body: [
      {
        heading: 'Motor bölmesi',
        paragraphs: [],
        list: [
          'Motor yağı: çubuktaki seviye min ile max arasında olmalı. Bakım kilometresi yaklaşmışsa yağ ve yağ filtresini yoldan önce değiştirin.',
          'Soğutma suyu (antifriz): genleşme kabındaki seviye işaretler arasında olmalı. Kapağı motor sıcakken açmayın.',
          'Fren hidroliği: seviye min çizgisinin üzerinde olmalı; hızlı azalıyorsa servise gösterin.',
          'Cam suyu: depoyu doldurun; kışa giriliyorsa antifrizli cam suyu kullanın.',
          'Kayışlar ve hortumlar: görünür çatlak, şişme ya da sızıntı olmamalı.',
        ],
      },
      {
        heading: 'Filtreler',
        paragraphs: [
          'Uzun yol, motorun saatlerce yük altında çalışması demektir. Tıkalı bir hava filtresi performansı ve yakıt tüketimini olumsuz etkiler, tıkalı bir polen filtresi ise uzun saatler boyunca kabin havasını kötüleştirir. Bakım aralığı dolmak üzereyse filtreleri yoldan önce yenileyin.',
        ],
        list: [
          'Yağ filtresi: motor yağıyla birlikte değişir.',
          'Hava filtresi: kararmış ya da toz dolmuşsa değiştirin.',
          'Polen filtresi: klima kokusu ya da zayıf üfleme varsa değiştirin.',
          'Yakıt filtresi: özellikle dizel araçlarda bakım aralığı geçtiyse yoldan önce yenileyin.',
        ],
      },
      {
        heading: 'Lastikler ve frenler',
        paragraphs: [],
        list: [
          'Lastik basıncını lastikler soğukken ölçün; doğru değer genellikle sürücü kapısı kenarındaki etikette ya da depo kapağının içinde yazar. Yüklü araç için verilen değeri kullanın.',
          'Diş derinliğini kontrol edin; yasal alt sınır 1,6 mm’dir ama güvenli sürüş için bunun çok altına inmeden lastik değiştirilmelidir.',
          'Yanaklarda kesik, şişlik ya da düzensiz aşınma olmamalı.',
          'Stepne ya da lastik tamir kitinin çalışır durumda olduğunu, kriko ve bijon anahtarının araçta olduğunu kontrol edin.',
          'Frende ses, titreşim ya da direksiyonda çekme varsa yoldan önce servise gösterin.',
        ],
      },
      {
        heading: 'Elektrik ve görüş',
        paragraphs: [],
        list: [
          'Akü: sabah ilk çalıştırmada marş zorlanıyorsa aküyü test ettirin; kutup başlarında oksitlenme olmamalı.',
          'Farlar, sinyaller, fren ve geri vites lambaları: hepsini birine kontrol ettirin.',
          'Silecekler: iz bırakıyor ya da ses yapıyorsa lastiklerini değiştirin.',
          'Ön cam: görüşü engelleyen çatlak ya da taş izi büyümeden onartın.',
        ],
      },
      {
        heading: 'Araçta bulunması gerekenler',
        paragraphs: [
          'Trafikte araçta bulundurulması zorunlu ekipmanlar ile yolda işinize yarayacak malzemeleri yolculuktan önce kontrol edin:',
        ],
        list: [
          'İlk yardım çantası, yangın söndürme cihazı ve iki adet reflektör (yangın tüpünün dolum tarihine bakın).',
          'Ruhsat, sürücü belgesi, trafik sigortası ve varsa kasko poliçesi.',
          'Yedek ampul seti, akü takviye kablosu, el feneri ve yansıtıcı yelek.',
          'Su ve kışın battaniye; uzun yolda telefon şarj kablosu.',
        ],
      },
    ],
    sss: [
      {
        q: 'Uzun yoldan önce yağ değiştirmek gerekir mi?',
        a: 'Bakım kilometresine az kaldıysa evet; yolculuk sırasında aralığı aşacaksanız yağ ve yağ filtresini yoldan önce değiştirmek daha doğrudur. Yeni bakım yapılmışsa yalnızca seviyeyi kontrol etmek yeterlidir.',
      },
      {
        q: 'Uzun yolda lastik basıncı artırılmalı mı?',
        a: 'Araç yüklüyse üreticinin yüklü araç için verdiği basıncı kullanın. Bu değer genellikle sürücü kapısı kenarındaki ya da depo kapağı içindeki etikette yazar. Basıncı lastikler soğukken ölçün.',
      },
    ],
  },
  {
    slug: 'fiat-egea-filtre-rehberi',
    title: 'Fiat Egea Filtre Rehberi: Yağ, Hava, Polen ve Yakıt Filtresi Kodları',
    metaTitle: 'Fiat Egea Filtre Kodları | Oto Center Market',
    summary:
      'Fiat Egea (sedan, hatchback ve cross) için motor bazında MANN-FILTER ve FILTRON yağ, hava, polen ve yakıt filtresi kodları. 1.3 ve 1.6 MultiJet, 1.4 ve 1.0 benzinli, 1.5 Hybrid.',
    tag: 'Model rehberi',
    readMinutes: 6,
    relatedHref: '/otomobil/fiat',
    relatedLabel: 'Fiat modellerine göz atın',
    guncelleme: '2026-10-16',
    ilgiliYazilar: ['renault-clio-megane-filtre-rehberi', 'dortlu-filtre-seti-nedir'],
    intro: [
      'Fiat Egea’da filtre seçimi motor tipine göre değişir: 1.3 MultiJet, 1.6 MultiJet, 1.4 Fire, 1.0 turbo benzinli ve 1.5 Hybrid motorlar farklı yağ ve hava filtresi kullanır. Polen filtresi ise aynı motor grubundaki araçlarda çoğunlukla ortaktır. Aşağıdaki tablolar katalogdaki uyumluluk verisinden hazırlandı; her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır.',
      'Tablolar hızlı başvuru içindir. Kesin seçim için [Fiat modelleri](/otomobil/fiat "Fiat yedek parça") arasından aracınızı ve motorunuzu seçin; yalnızca o motora uyumlu ürünler listelenir.',
    ],
    body: [
      {
        heading: 'Motorunuzu nasıl anlarsınız?',
        paragraphs: [
          'Motor hacmi ve gücü ruhsatta yazar. Motor adındaki MultiJet dizel, T-Jet turbo benzinli motoru gösterir; 1.4 95 HP atmosferik benzinli (Fire) motordur. Katalogda Egea, ilk motor seçenekleri ve güncel motorlar olarak iki grupta listelenir; Tipo ile ortak motorlar ikinci grupta yer alır.',
          'Aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Bu durumda eski filtrenin üzerindeki kodu kontrol edin ya da siparişten önce şasi numaranızla bize sorun.',
        ],
      },
      {
        heading: 'Egea ve Tipo (güncel motorlar) filtre kodları',
        paragraphs: [
          'Egea ve Tipo (güncel motorlar) (1.0, 1.5 Hybrid ve 1.6 D 131 HP) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Egea ve Tipo (güncel motorlar) sayfasında](/otomobil/fiat/tipo-egea-356 "Fiat Egea ve Tipo (güncel motorlar) yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Fiat Egea ve Tipo (güncel motorlar) — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'W 79', 'OP 643/4', '1.0 101 HP, 1.5 T4 Hybrid 131 HP'],
            ['Yağ', 'HU 8006 z', 'OE 682/3', '1.6 D 131 HP'],
            ['Hava', 'C 27 046', 'AP 078/6', '1.0 101 HP'],
            ['Hava', 'C 31 028', 'AP 022/9', '1.5 T4 Hybrid 131 HP'],
            ['Polen / kabin', 'CU 2040, CUK 2040', 'K 1228, K 1228A', '1.0 101 HP, 1.5 T4 Hybrid 131 HP, 1.6 D 131 HP'],
            ['Yakıt', '—', 'PE 982/5', '1.6 D 131 HP'],
          ],
        },
      },
      {
        heading: 'Egea (ilk motor seçenekleri) filtre kodları',
        paragraphs: [
          'Egea (ilk motor seçenekleri) (1.3 ve 1.6 MultiJet, 1.4, 1.4 T-Jet ve 1.6 benzinli) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Egea (ilk motor seçenekleri) sayfasında](/otomobil/fiat/aegea-356 "Fiat Egea (ilk motor seçenekleri) yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Fiat Egea (ilk motor seçenekleri) — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'HU 7042 z, HU 712/11 x', 'OE 682/2', '1.3 D MultiJet 95 HP'],
            ['Yağ', 'HU 713/1 x', 'OE 670', '1.4 16V T-Jet 120 HP'],
            ['Yağ', 'HU 816/2 x', 'OE 672', '1.6 110 HP'],
            ['Yağ', 'HU 8006 z', 'OE 682/3', '1.6 D MultiJet 120 HP'],
            ['Hava', 'C 25 033', '—', '1.3 D MultiJet 95 HP, 1.4 16V T-Jet 120 HP, 1.6 110 HP, 1.6 D MultiJet 120 HP'],
            ['Hava', '—', 'AP 078/1', '1.3 D MultiJet 95 HP'],
            ['Hava', '—', 'AP 092/3', '1.4 95 HP'],
            ['Polen / kabin', '—', 'K 1228', '1.4 16V T-Jet 120 HP, 1.6 D MultiJet 120 HP'],
            ['Yakıt', '—', 'PE 982/2', '1.3 D MultiJet 95 HP'],
          ],
        },
      },
    ],
    sss: [
      {
        q: 'Fiat Egea 1.3 MultiJet yağ filtresi kodu nedir?',
        a: 'Katalogdaki uyumluluk verisine göre Egea 1.3 MultiJet 95 HP motorda MANN-FILTER HU 7042 z ya da HU 712/11 x, FILTRON tarafında OE 682/2 yağ filtresi kullanılır. Kesin seçim için motorunuzu sitede seçerek doğrulayın.',
      },
      {
        q: 'Fiat Egea 1.6 MultiJet yağ filtresi kodu nedir?',
        a: 'Katalogda Egea 1.6 MultiJet motorlar için MANN-FILTER HU 8006 z ve FILTRON OE 682/3 kayıtlıdır.',
      },
      {
        q: 'Egea polen filtresi bütün motorlarda aynı mı?',
        a: 'Güncel motor grubunda katalogda bütün motorlar için MANN-FILTER CU 2040 (aktif karbonlu CUK 2040) ve FILTRON K 1228 (aktif karbonlu K 1228A) kayıtlıdır. İlk motor grubunda 1.4 T-Jet ve 1.6 MultiJet için FILTRON K 1228 kayıtlıdır; diğer motorlar için sitede aracınızı seçerek kontrol edin.',
      },
      {
        q: 'Egea 1.4 95 HP için neden yalnızca hava filtresi görünüyor?',
        a: 'Katalogda bu motor için şu an yalnızca FILTRON AP 092/3 hava filtresi kayıtlı. Yağ, polen ya da yakıt filtresi için eski filtrenin üzerindeki kodu arama kutusuna yazabilir ya da şasi numaranızla bize sorabilirsiniz.',
      },
    ],
  },
  {
    slug: 'sanzuman-filtresi-ne-zaman-degisir',
    title: 'Şanzıman Filtresi Ne Zaman Değişir? Otomatik ve DSG Şanzımanlarda Filtre',
    metaTitle: 'Şanzıman Filtresi Ne Zaman Değişir? | Oto Center Market',
    summary:
      'Otomatik ve çift kavramalı (DSG) şanzımanlarda şanzıman yağı ile birlikte değişen filtrenin görevi, değişim aralığı, belirtileri ve hangi araca hangi MANN-FILTER kodunun uyduğu.',
    tag: 'Bakım',
    readMinutes: 5,
    relatedHref: '/filtreler/sanzuman-filtreleri',
    relatedLabel: 'Şanzıman filtrelerine göz atın',
    guncelleme: '2026-10-17',
    ilgiliYazilar: ['periyodik-bakimda-hangi-filtreler-degisir', 'orijinal-ve-muadil-filtre-farki'],
    intro: [
      'Şanzıman filtresi, otomatik ve çift kavramalı (DSG gibi) şanzımanlarda şanzıman yağı ile birlikte değiştirilir. Değişim aralığı araç üreticisine ve şanzıman tipine göre çok farklıdır: bazı üreticiler belirli bir kilometre verir, bazıları yağı “ömür boyu” olarak tanımlar. Kesin bilgi aracınızın bakım kitapçığında yazar; ağır kullanımda (şehir içi dur-kalk, römork çekme, sıcak iklim) değişimi öne almak yaygın bir uygulamadır.',
      'Manuel şanzımanların çoğunda ayrı bir filtre bulunmaz; bu yazı otomatik ve çift kavramalı şanzımanlar içindir. Aracınıza uyan ürünleri [şanzıman filtreleri kategorisinde](/filtreler/sanzuman-filtreleri "Şanzıman filtrelerini görüntüle") bulabilirsiniz.',
    ],
    body: [
      {
        heading: 'Şanzıman filtresi ne işe yarar?',
        paragraphs: [
          'Otomatik şanzımanda yağ hem dişlileri yağlar hem de vites geçişlerini sağlayan hidrolik sistemi çalıştırır. Zamanla kavrama balatalarından ve metal parçalardan ince aşınma tozu oluşur. Şanzıman filtresi bu partikülleri tutarak valf gövdesindeki ince kanalların ve solenoid valflerin tıkanmasını önler.',
          'Filtre tıkandığında yağ akışı azalır; bu da vites geçişlerinde sertleşme, gecikme ya da şanzımanın acil durum moduna geçmesi gibi sorunlara yol açabilir.',
        ],
      },
      {
        heading: 'Ne zaman değiştirilmeli?',
        paragraphs: [
          'Şanzıman yağı ve filtresi birlikte değişir; yağı yenileyip eski filtreyi bırakmak, yeni yağın kısa sürede kirlenmesine yol açar. Volkswagen grubunun yağlı (ıslak) kavramalı DSG şanzımanlarında yağ ve filtre değişimi genellikle 60.000 km aralığıyla öngörülür. Klasik tork konvertörlü otomatik şanzımanlarda ise aralık üreticiye göre değişir.',
          'Bakım kitapçığında “ömür boyu yağ” yazsa bile şu durumlarda kontrol ettirmek mantıklıdır:',
        ],
        list: [
          'Vites geçişleri sertleştiyse ya da gecikmeli geçiyorsa.',
          'Araç kalkışta titriyor ya da vites atlıyorsa.',
          'Gösterge panelinde şanzıman uyarısı yandıysa.',
          'Araç uzun süre ağır şehir içi trafikte ya da römork çekerek kullanıldıysa.',
          'Kilometresi yüksek, ikinci el bir araç aldıysanız ve bakım geçmişi belli değilse.',
        ],
      },
      {
        heading: 'Hangi araca hangi şanzıman filtresi?',
        paragraphs: [
          'Katalogdaki uyumluluk verisine göre sık aranan MANN-FILTER şanzıman filtreleri ve uyduğu modeller aşağıda. Aynı modelde şanzıman tipine göre farklı filtre kullanılabildiği için kesin seçimi sitede aracınızın motorunu seçerek yapın.',
        ],
        table: {
          caption: 'MANN-FILTER şanzıman filtresi kodları ve uyumlu modeller (katalog verisi)',
          head: ['MANN-FILTER kodu', 'Uyumlu modellerden bazıları'],
          rows: [
            ['H 6003 z', 'VW Golf VII, Passat B8, Tiguan II, Polo VI, Touran, Caddy IV; Skoda Octavia III–IV, Superb III, Kodiaq; Seat Leon IV, Ateca; Audi A1, Q2'],
            ['H 6031 z', 'VW Golf VII–VIII, T-Roc, Tiguan II, Arteon; Skoda Octavia III–IV, Karoq; Seat Leon IV, Ateca; Cupra Formentor; Audi A3 (8Y)'],
            ['H 6005 z', 'VW Passat B8, Arteon, Tiguan Allspace, Transporter T6; Skoda Kodiaq'],
            ['H 2019 KIT', 'VW Golf IV, Bora, New Beetle; Audi A3 (8L); Skoda Octavia I; Seat Leon I'],
            ['H 2019 KIT 1', 'VW Passat B5; Audi A4 (B5, B6, B7), A6 (C5)'],
            ['H 182 KIT', 'Mercedes-Benz C (W202, W203, W204), E (W210, W211, W212), Vito ve Viano 639, Sprinter; Jeep Grand Cherokee'],
            ['H 27 001', 'Mercedes-Benz C (W203, W204, W205), E (W211, W212), CLS, GLK, M serisi, Sprinter 906'],
            ['H 50 001', 'BMW 1 (E87), 3 (E90), 5 (E60), X1 (E84), X3 (E83), X5 (E70)'],
            ['H 50 004', 'BMW 2, 3 (G20), 4, 5 (G30), X3 (G01), X4, X7; Land Rover ve Jaguar güncel modeller; Volvo XC40'],
          ],
        },
      },
      {
        heading: 'KIT ibaresi ne anlama gelir?',
        paragraphs: [
          'Kodunda KIT geçen şanzıman filtreleri genellikle filtreyle birlikte montaj için gereken conta gibi parçaları da içeren paketlerdir. Şanzıman karteri söküldüğünde eski contanın yeniden kullanılması yağ kaçağına yol açabileceği için set halinde değişim tercih edilir.',
          'Kodun sonundaki z harfi gibi ekler, aynı ölçüdeki ürünün farklı bir versiyonunu gösterebilir. Bu yüzden kodu harfiyle birlikte eşleştirin.',
        ],
      },
      {
        heading: 'Şanzıman filtresini kendim değiştirebilir miyim?',
        paragraphs: [
          'Önerilmez. Otomatik şanzımanlarda doğru yağ tipi, doğru dolum miktarı ve dolumun belirli bir yağ sıcaklığında yapılması gerekir; çoğu araçta bu işlem arıza tespit cihazıyla yağ sıcaklığı izlenerek yapılır. Eksik ya da fazla dolum şanzımana zarar verebilir. Filtreyi temin edip değişimi şanzıman konusunda deneyimli bir servise yaptırmanız daha güvenlidir.',
        ],
      },
    ],
    sss: [
      {
        q: 'Şanzıman yağı değişirken filtre de değişmeli mi?',
        a: 'Evet. Filtresi değiştirilmeyen şanzımanda eski filtrede biriken kir yeni yağa karışır. Otomatik ve DSG şanzımanlarda yağ ve filtre birlikte değiştirilir.',
      },
      {
        q: 'Manuel şanzımanda filtre var mı?',
        a: 'Manuel şanzımanların çoğunda ayrı bir şanzıman filtresi bulunmaz. Şanzıman filtresi otomatik ve çift kavramalı şanzımanlarda kullanılır.',
      },
      {
        q: 'DSG şanzıman filtresi kaç km’de değişir?',
        a: 'Volkswagen grubunun yağlı kavramalı DSG şanzımanlarında yağ ve filtre değişimi genellikle 60.000 km aralığıyla yapılır. Kuru kavramalı tiplerde ayrı bir değişim aralığı olmayabilir. Kesin bilgi için aracınızın bakım kitapçığına bakın.',
      },
    ],
  },
  {
    slug: 'yag-filtresi-nasil-degistirilir',
    title: 'Yağ Filtresi Nasıl Değiştirilir? Adım Adım Rehber',
    metaTitle: 'Yağ Filtresi Nasıl Değiştirilir? Adım Adım | Oto Center Market',
    summary:
      'Komple (spin-on) ve kartuş tipi yağ filtresinin nasıl değiştirileceği, gereken malzemeler, conta ve sıkma ayarı ile en sık yapılan hatalar.',
    tag: 'Nasıl yapılır',
    readMinutes: 5,
    relatedHref: '/filtreler/yag-filtreleri',
    relatedLabel: 'Yağ filtrelerine göz atın',
    guncelleme: '2026-10-17',
    ilgiliYazilar: ['yag-filtresi-ne-zaman-degisir', 'yag-filtresi-ve-motor-yagi-birlikte-mi'],
    intro: [
      'Yağ filtresi motor yağıyla birlikte değiştirilir: önce eski yağ boşaltılır, ardından eski filtre sökülür, yeni filtrenin contası yağlanarak takılır ve motor yeni yağla doldurulur. Komple (spin-on) filtre elle sıkılarak takılırken, kartuş tipi filtrede filtre elemanı plastik ya da metal bir yuvanın içine yerleştirilir ve kapağın O-ringi yenilenir.',
      'İşlem temel aletlerle yapılabilir; ancak aracı güvenli şekilde kaldıracak ekipmanınız yoksa ya da motor alttan muhafazalıysa işi bir servise bırakmak daha doğrudur. Aracınıza uyan filtreyi [yağ filtreleri kategorisinde](/filtreler/yag-filtreleri "Yağ filtrelerini görüntüle") bulabilirsiniz.',
    ],
    body: [
      {
        heading: 'Önce filtre tipinizi öğrenin',
        paragraphs: [
          'Komple (spin-on) yağ filtresi, filtre elemanı ile metal gövdenin tek parça olduğu tiptir; MANN-FILTER’da W, FILTRON’da OP koduyla başlar. Kartuş tipinde ise motor üzerinde kalıcı bir filtre yuvası vardır ve yalnızca içindeki eleman değişir; MANN-FILTER’da HU, FILTRON’da OE koduyla başlar. Kartuş filtreler genellikle yeni O-ring ya da contalarıyla birlikte gelir.',
        ],
      },
      {
        heading: 'Gerekenler',
        paragraphs: [],
        list: [
          'Aracınıza uygun yeni yağ filtresi.',
          'Üreticinin önerdiği standartta ve miktarda motor yağı.',
          'Karter tapası için yeni conta (pul) — çoğu araçta her değişimde yenilenmesi önerilir.',
          'Yağ filtresi anahtarı (spin-on için) ya da kapak için uygun lokma (kartuş için).',
          'Atık yağ için en az motor yağı miktarı kadar hacimli bir kap, eldiven ve bez.',
          'Aracı kaldırmak gerekiyorsa sağlam bir kriko ve sehpa — yalnızca krikoya güvenip aracın altına girmeyin.',
        ],
      },
      {
        heading: 'Adım adım değişim',
        paragraphs: [],
        steps: [
          'Motoru birkaç dakika çalıştırıp yağı ılıtın; sıcak yağ daha kolay akar. Motoru kapatıp yağın biraz soğumasını bekleyin, yanma riskine dikkat edin.',
          'Aracı düz zeminde sabitleyin, gerekiyorsa sehpalara alın. Yağ doldurma kapağını açın; boşaltma daha hızlı olur.',
          'Kabı karter tapasının altına koyun, tapayı söküp yağın tamamen akmasını bekleyin.',
          'Spin-on filtrede eski filtreyi filtre anahtarıyla sökün. Kartuş tipinde filtre kapağını söküp eski elemanı ve O-ringi çıkarın.',
          'Filtre yuvasının oturma yüzeyini temizleyin; eski contanın yüzeye yapışıp kalmadığından emin olun. Çift conta yağ kaçağının en sık sebebidir.',
          'Yeni filtrenin contasına parmakla ince bir kat temiz motor yağı sürün.',
          'Spin-on filtreyi elle takın; conta yüzeye değdikten sonra filtre üzerindeki talimata göre (genellikle yaklaşık 3/4 tur) elle sıkın. Kartuş tipinde yeni elemanı ve O-ringi takıp kapağı servis bilgisindeki tork değeriyle sıkın.',
          'Karter tapasını yeni contasıyla takıp sıkın.',
          'Motoru belirtilen miktardan biraz eksik yağla doldurun, çalıştırıp yağ basıncı lambasının söndüğünü görün ve filtre ile tapa çevresinde kaçak olup olmadığını kontrol edin.',
          'Motoru durdurup birkaç dakika bekleyin, çubuktan seviyeyi kontrol edip eksikse tamamlayın. Gerekiyorsa servis göstergesini sıfırlayın.',
        ],
      },
      {
        heading: 'En sık yapılan hatalar',
        paragraphs: [],
        list: [
          'Filtreyi anahtarla aşırı sıkmak: conta ezilir ve bir sonraki değişimde filtre sökülemez hale gelir.',
          'Eski contayı yerinde unutmak: yeni contayla üst üste binerek yağ kaçırır.',
          'Contayı yağlamamak: conta kuru sürtünür, düzgün oturmaz.',
          'Yanlış filtre takmak: dış ölçüsü uysa bile bypass valfi ve basınç değerleri motora uygun olmayabilir. Kodu aracınızın motoruna göre doğrulayın.',
          'Atık yağı lavaboya ya da toprağa dökmek: atık yağ çevreye zarar verir; kapalı bir kapta, atık yağ toplayan bir servise ya da toplama noktasına teslim edin.',
        ],
      },
    ],
    sss: [
      {
        q: 'Yağ filtresi ne kadar sıkılmalı?',
        a: 'Spin-on filtreler elle sıkılır: conta yüzeye değdikten sonra filtre üzerindeki talimata göre, genellikle yaklaşık 3/4 tur. Anahtarla aşırı sıkmak contayı bozar. Kartuş tipinde kapak, servis bilgisindeki tork değeriyle sıkılır.',
      },
      {
        q: 'Yağ filtresine takmadan önce yağ doldurulur mu?',
        a: 'Dik takılan spin-on filtrelerde bazı ustalar filtreyi önceden kısmen yağla doldurur; yatay ya da ters takılan filtrelerde bu yapılmaz. Her durumda contaya ince bir kat yağ sürmek gerekir.',
      },
      {
        q: 'Yağ değiştirmeden sadece yağ filtresi değişir mi?',
        a: 'Önerilmez. Filtre değişirken bir miktar yağ zaten boşalır ve eski yağdaki kir yeni filtreyi kısa sürede doldurur. Yağ filtresi motor yağıyla birlikte değiştirilir.',
      },
    ],
  },
  {
    slug: 'kis-oncesi-arac-bakimi',
    title: 'Kış Öncesi Araç Bakımı: Aracınızı Kışa Hazırlamak İçin Kontrol Listesi',
    metaTitle: 'Kış Öncesi Araç Bakımı Kontrol Listesi | Oto Center Market',
    summary:
      'Kış gelmeden antifriz, akü, lastik, silecek, cam suyu ve filtreler için yapılması gereken kontroller. Dizel araçlarda yakıt filtresinin kışın neden daha önemli olduğu.',
    tag: 'Bakım',
    readMinutes: 5,
    relatedHref: '/filtreler',
    relatedLabel: 'Tüm filtreleri görün',
    guncelleme: '2026-10-17',
    ilgiliYazilar: ['uzun-yol-oncesi-arac-bakim-kontrol-listesi', 'yakit-filtresi-ne-zaman-degisir'],
    intro: [
      'Aracınızı kışa hazırlamak için antifrizin donma koruma derecesini ölçtürün, aküyü test ettirin, lastik diş derinliğini ve basıncını kontrol edin, silecekleri ve cam suyunu kışlığa çevirin. Dizel araçlarda bakım aralığı yaklaşan yakıt filtresini kıştan önce değiştirmek, soğuk sabahlarda çalıştırma sorunlarının önüne geçebilir.',
      'Bu kontrolleri hava iyice soğumadan, ekim–kasım aylarında yaptırmak hem servis yoğunluğundan kaçınmanızı hem de eksik parçayı zamanında temin etmenizi sağlar.',
    ],
    body: [
      {
        heading: 'Antifriz (soğutma sıvısı)',
        paragraphs: [
          'Soğutma sıvısı yalnızca motoru soğutmaz, donmaya karşı da korur. Su eklenerek seyreltilmiş ya da eskimiş antifriz, soğukta donarak motor bloğuna ve radyatöre zarar verebilir. Servislerde basit bir ölçüm cihazıyla sıvının kaç dereceye kadar koruduğu ölçülür; bulunduğunuz bölgenin en düşük sıcaklıklarına göre koruma yeterli olmalıdır.',
          'Seviyeyi motor soğukken genleşme kabından kontrol edin. Eksiltme varsa yalnızca su eklemek yerine aracınıza uygun tipte antifrizle tamamlayın ve kaçak olup olmadığını kontrol ettirin.',
        ],
      },
      {
        heading: 'Akü',
        paragraphs: [
          'Soğuk havada akünün verebildiği güç düşerken motoru çalıştırmak için gereken güç artar. Bu yüzden yazın sorunsuz görünen yaşlı bir akü ilk soğuk sabahta aracı çalıştıramayabilir. Marş zorlanıyorsa, akü birkaç yaşını geçtiyse ya da araç uzun süre kısa mesafelerde kullanılıyorsa kıştan önce aküyü test ettirin. Kutup başlarındaki oksitlenmeyi temizletin.',
        ],
      },
      {
        heading: 'Lastikler',
        paragraphs: [
          'Kış lastiği, hava sıcaklığı 7 °C’nin altına düştüğünde yaz lastiğine göre daha iyi yol tutuşu sağlar. Diş derinliğini ve lastik basıncını kontrol edin; basınç soğukta düşer. Kış lastiği uygulamasına ilişkin kurallar araç türüne ve bölgeye göre değişebildiği için güncel düzenlemeyi takip edin.',
        ],
      },
      {
        heading: 'Görüş: silecek, cam suyu ve farlar',
        paragraphs: [],
        list: [
          'Silecek lastikleri iz bırakıyor ya da ses yapıyorsa değiştirin.',
          'Cam suyu deposuna antifrizli (kışlık) cam suyu koyun; düz su depoda ve hortumlarda donar.',
          'Far, sis farı ve stop lambalarını kontrol edin; kışın günler kısalır.',
          'Polen filtresi tıkalıysa camların buğusu geç açılır. Buğu sorunu yaşıyorsanız polen filtresini kontrol edin.',
        ],
      },
      {
        heading: 'Filtreler ve kış',
        paragraphs: [
          'Dizel araçlarda yakıt filtresi kışın daha kritik hale gelir. Çok soğuk havada motorinde parafin kristalleri oluşabilir ve kirli ya da suyla dolmuş bir filtre bu durumda daha kolay tıkanır. Bakım aralığı yaklaşan dizel yakıt filtresini kıştan önce değiştirmek ve su ayırıcılı filtrelerde suyu boşaltmak, soğuk sabahlarda çalıştırma sorunlarını azaltır. Ayrıntılar için [yakıt filtresi yazımıza](/blog/yakit-filtresi-ne-zaman-degisir "Yakıt filtresi ne zaman değişir") bakabilirsiniz.',
          'Kısa mesafe kullanımda motor yağı yeterince ısınmaz ve içinde nem birikebilir. Bakım kilometresi yaklaştıysa yağ ve yağ filtresini kıştan önce değiştirmek iyi bir başlangıçtır.',
        ],
      },
      {
        heading: 'Araçta bulundurmanız iyi olanlar',
        paragraphs: [],
        list: [
          'Buz kazıyıcı ve fırça.',
          'Akü takviye kablosu.',
          'Battaniye, el feneri, eldiven ve su.',
          'Kar zinciri — özellikle dağlık bölgelere gidiyorsanız; takmayı yola çıkmadan önce deneyin.',
        ],
      },
    ],
    sss: [
      {
        q: 'Kışın hangi filtreler kontrol edilmeli?',
        a: 'Dizel araçlarda yakıt filtresi, tüm araçlarda yağ filtresi ve buğu sorununu etkileyen polen filtresi kıştan önce kontrol edilmelidir. Bakım aralığı yaklaşan filtreleri kıştan önce değiştirmek önerilir.',
      },
      {
        q: 'Dizel araç kışın neden zor çalışır?',
        a: 'Çok soğuk havada motorinde parafin kristalleri oluşabilir, kızdırma bujileri ya da akü zayıfsa çalıştırma zorlaşır. Kirli ya da su dolmuş yakıt filtresi bu sorunu artırır.',
      },
      {
        q: 'Antifriz ne zaman değişir?',
        a: 'Değişim aralığı antifriz tipine ve araç üreticisine göre değişir; bakım kitapçığınızda yazar. Kıştan önce koruma derecesini ölçtürmek, değişim gerekip gerekmediğini anlamanın en kolay yoludur.',
      },
    ],
  },
  {
    slug: 'ford-focus-filtre-rehberi',
    title: 'Ford Focus Filtre Rehberi: Yağ, Hava, Polen ve Yakıt Filtresi Kodları',
    metaTitle: 'Ford Focus Filtre Kodları | Oto Center Market',
    summary:
      'Ford Focus II, III ve IV için motor bazında MANN-FILTER ve FILTRON yağ, hava, polen ve yakıt filtresi kodları. TDCi, EcoBlue, EcoBoost ve Ti-VCT motorlar.',
    tag: 'Model rehberi',
    readMinutes: 7,
    relatedHref: '/otomobil/ford',
    relatedLabel: 'Ford modellerine göz atın',
    guncelleme: '2026-10-17',
    ilgiliYazilar: ['fiat-egea-filtre-rehberi', 'volkswagen-golf-filtre-rehberi'],
    intro: [
      'Ford Focus’ta filtre seçimi nesle ve motora göre değişir: aynı nesilde 1.6 TDCi dizel ile 1.0 EcoBoost benzinli motor farklı yağ ve yakıt filtresi kullanır. Polen filtresi ise çoğu nesilde motordan bağımsızdır. Aşağıdaki tablolar Focus II, III ve IV için katalogdaki uyumluluk verisinden hazırlandı; her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır.',
      'Tablolar hızlı başvuru içindir. Kesin seçim için [Ford modelleri](/otomobil/ford "Ford yedek parça") arasından Focus neslinizi ve motorunuzu seçin; yalnızca o motora uyumlu ürünler listelenir.',
    ],
    body: [
      {
        heading: 'Neslinizi ve motorunuzu nasıl anlarsınız?',
        paragraphs: [
          'Nesli ruhsattaki model yılından tahmin edebilirsiniz; nesil geçiş yıllarında iki nesil bir süre birlikte satılmıştır. Motor hacmi ve gücü ruhsatta yazar. Motor adındaki TDCi ve EcoBlue dizel, EcoBoost turbo benzinli, Ti-VCT ve 16V atmosferik benzinli motoru gösterir; mHEV hafif hibrit versiyonu anlatır.',
          'Aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Bu durumda eski filtrenin üzerindeki kodu kontrol edin ya da siparişten önce şasi numaranızla bize sorun.',
        ],
      },
      {
        heading: 'Focus IV filtre kodları',
        paragraphs: [
          'Focus IV (yaklaşık 2018 ve sonrası) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Focus IV sayfasında](/otomobil/ford/focus-iv "Ford Focus IV yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Ford Focus IV — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'W 7057', '—', '1.0 Ecoboost 86 HP, 1.0 Ecoboost 101 HP, 1.0 Ecoboost 125 HP, 1.0 Ecoboost mHEV 125 HP, 1.0 Ecoboost mHEV 155 HP, 1.0 Ecoboost mHEV Flex 125 HP, 1.5 Ecoboost 150 HP, 1.5 Ecoboost 182 HP'],
            ['Yağ', '—', 'OP 629/3', '1.0 Ecoboost mHEV 125 HP, 1.0 Ecoboost mHEV 155 HP, 1.0 Ecoboost mHEV Flex 125 HP'],
            ['Yağ', 'HU 7032 z', '—', '1.5 EcoBlue 95 HP, 1.5 EcoBlue 116 HP, 1.5 EcoBlue 120 HP'],
            ['Yağ', 'HU 5001 z', 'OE 667/6', '1.5 EcoBlue 116 HP'],
            ['Yağ', 'W 7054', 'OP 629/4', '2.0 ST EcoBlue 190 HP'],
            ['Yağ', 'W 7015', 'OP 629/2', '2.3 ST Ecoboost 280 HP'],
            ['Hava', 'C 27 031', 'AP 074/8', '1.0 Ecoboost mHEV 125 HP, 1.0 Ecoboost mHEV 155 HP, 1.0 Ecoboost mHEV Flex 125 HP, 1.5 EcoBlue 116 HP, 2.0 ST EcoBlue 190 HP, 2.3 ST Ecoboost 280 HP'],
            ['Polen / kabin', 'CU 28 009, CUK 28 009', 'K 1424, K 1424A', '1.0 Ecoboost mHEV 125 HP, 1.0 Ecoboost mHEV 155 HP, 1.0 Ecoboost mHEV Flex 125 HP, 1.5 EcoBlue 116 HP, 2.0 ST EcoBlue 190 HP, 2.3 ST Ecoboost 280 HP'],
            ['Polen / kabin', 'FP 28 009', '—', '1.0 Ecoboost mHEV 155 HP, 1.5 EcoBlue 116 HP, 2.0 ST EcoBlue 190 HP, 2.3 ST Ecoboost 280 HP'],
            ['Yakıt', 'WK 11 024, WK 11 025', '—', '1.5 EcoBlue 116 HP, 2.0 ST EcoBlue 190 HP'],
          ],
        },
      },
      {
        heading: 'Focus III filtre kodları',
        paragraphs: [
          'Focus III (yaklaşık 2011–2018) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Focus III sayfasında](/otomobil/ford/focus-iii "Ford Focus III yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Ford Focus III — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'HU 716/2 x', 'OE 667/1', '1.5 TDCi 95 HP, 1.5 TDCi 105 HP, 1.5 TDCi 120 HP, 1.6 TDCi 95 HP, 1.6 TDCi 115 HP'],
            ['Yağ', 'W 7015', 'OP 629/2', '1.0 EcoBoost 100 HP, 1.0 EcoBoost 125 HP, 1.0 EcoBoost 140 HP'],
            ['Yağ', 'W 7008', 'OP 629/1', '1.5 EcoBoost 150 HP, 1.5 EcoBoost 182 HP'],
            ['Hava', 'C 16 134/2', 'AK 372/1', 'Bu nesildeki tüm motorlar'],
            ['Polen / kabin', 'CU 25 007, CUK 25 007, FP 25 007', 'K 1350', 'Bu nesildeki tüm motorlar'],
            ['Yakıt', 'WK 9046 z', 'PP 838/9', '1.6 TDCi 95 HP, 1.6 TDCi 115 HP'],
          ],
        },
      },
      {
        heading: 'Focus II filtre kodları',
        paragraphs: [
          'Focus II (yaklaşık 2004–2011) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Focus II sayfasında](/otomobil/ford/focus-ii "Ford Focus II yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Ford Focus II — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'W 7008', 'OP 629/1', '1.4 16V 80 HP, 1.6 16V 100 HP, 1.6 16V Ti-VCT 115 HP'],
            ['Yağ', 'HU 716/2 x', 'OE 667/1', '1.6 TDCi 90 HP, 1.6 TDCi 100 HP, 1.6 TDCi 109 HP'],
            ['Yağ', 'HU 711/51 x', 'OE 673', '2.0 TDCi 110 HP, 2.0 TDCi 136 HP'],
            ['Yağ', 'W 712/82', 'OP 546/1', '1.8 TDCi 115 HP'],
            ['Yağ', 'W 7015', 'OP 629/2', '2.0 16V 145 HP'],
            ['Hava', 'C 16 134/2', 'AK 372/1', 'Bu nesildeki tüm motorlar'],
            ['Hava', '—', 'AP 074/4', '1.4 16V 80 HP, 1.6 16V 100 HP, 1.6 16V Ti-VCT 115 HP, 2.0 16V 145 HP'],
            ['Hava', 'C 27 105', 'AP 074/5', '1.6 TDCi 90 HP, 1.6 TDCi 100 HP, 1.6 TDCi 109 HP'],
            ['Hava', 'C 28 110', 'AP 074/6', '1.8 TDCi 115 HP, 2.0 TDCi 136 HP'],
            ['Polen / kabin', 'CUK 2440, FP 2440', 'K 1150', 'Bu nesildeki tüm motorlar'],
            ['Yakıt', 'WK 939/2', 'PP 838/8', '1.6 TDCi 90 HP, 1.6 TDCi 100 HP, 1.6 TDCi 109 HP'],
            ['Yakıt', 'WK 939/13', '—', '1.6 TDCi 90 HP, 1.6 TDCi 100 HP'],
            ['Yakıt', 'PU 1018 x', 'PE 816/5', '2.0 TDCi 110 HP, 2.0 TDCi 136 HP'],
            ['Yakıt', 'PU 7002 x', '—', '1.8 TDCi 115 HP'],
            ['Yakıt', 'WK 614/46', 'PP 865/5', '2.0 16V 145 HP'],
          ],
        },
      },
    ],
    sss: [
      {
        q: 'Ford Focus 3 1.6 TDCi yağ filtresi kodu nedir?',
        a: 'Katalogdaki uyumluluk verisine göre Focus III 1.6 TDCi (95 ve 115 HP) motorlarda MANN-FILTER HU 716/2 x ve FILTRON OE 667/1 yağ filtresi kullanılır. Aynı filtre Focus III 1.5 TDCi motorlarda da kayıtlıdır.',
      },
      {
        q: 'Ford Focus 2 1.6 benzinli yağ filtresi kodu nedir?',
        a: 'Focus II 1.4 16V, 1.6 16V ve 1.6 Ti-VCT motorlarda katalogda MANN-FILTER W 7008 ve FILTRON OP 629/1 kayıtlıdır.',
      },
      {
        q: 'Ford Focus 4 1.5 EcoBlue yağ filtresi kodu nedir?',
        a: 'Focus IV 1.5 EcoBlue motorlarda katalogda MANN-FILTER HU 7032 z kayıtlıdır; 116 HP versiyon için ayrıca MANN-FILTER HU 5001 z ve FILTRON OE 667/6 görünür. Kesin seçim için motorunuzu sitede seçerek doğrulayın.',
      },
      {
        q: 'Focus 3 polen filtresi bütün motorlarda aynı mı?',
        a: 'Evet. Katalogda Focus III’ün tüm motorları için MANN-FILTER CU 25 007 (aktif karbonlu CUK 25 007, FreciousPlus FP 25 007) ve FILTRON K 1350 kayıtlıdır.',
      },
    ],
  },
]

export function rehberBul(slug: string): RehberYazisi | null {
  return REHBER_YAZILARI.find((y) => y.slug === slug) ?? null
}
