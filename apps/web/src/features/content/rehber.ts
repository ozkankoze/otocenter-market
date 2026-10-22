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
  {
    slug: 'motor-yagi-5w30-5w40-ne-demek',
    title: 'Motor Yağı Seçimi: 5W-30, 5W-40, 0W-20 Ne Demek?',
    metaTitle: '5W-30, 5W-40 Ne Demek? Motor Yağı Seçimi | Oto Center Market',
    summary:
      'Motor yağı üzerindeki 5W-30 gibi viskozite değerleri ne anlama gelir, onay kodları (ACEA, API, üretici normları) neden önemlidir ve aracınıza doğru yağı nasıl seçersiniz?',
    tag: 'Rehber',
    readMinutes: 5,
    relatedHref: '/filtreler/yag-filtreleri',
    relatedLabel: 'Yağ filtrelerine göz atın',
    guncelleme: '2026-10-19',
    ilgiliYazilar: ['yag-filtresi-ne-zaman-degisir', 'yag-filtresi-nasil-degistirilir'],
    intro: [
      '5W-30 gibi bir değer motor yağının viskozitesini (akışkanlığını) anlatır: “W” öncesindeki sayı yağın soğukta ne kadar kolay aktığını, tireden sonraki sayı ise motor çalışma sıcaklığındaki kıvamını gösterir. W’den önceki sayı küçüldükçe yağ soğuk çalıştırmada daha hızlı dolaşır; ikinci sayı büyüdükçe yağ sıcakta daha kalın kalır.',
      'Doğru yağ yalnızca viskoziteyle seçilmez; aracınızın üreticisinin istediği onay ya da norm da karşılanmalıdır. Her ikisi de bakım kitapçığında yazar. Yağı değiştirirken yağ filtresini de yenilemeyi unutmayın; aracınıza uyan filtreyi [yağ filtreleri kategorisinde](/filtreler/yag-filtreleri "Yağ filtrelerini görüntüle") bulabilirsiniz.',
    ],
    body: [
      {
        heading: 'Viskozite değeri nasıl okunur?',
        paragraphs: [
          'Viskozite sınıfları SAE J300 standardıyla tanımlanır. 5W-30 örneğinde:',
        ],
        list: [
          '“5W”: W, İngilizce winter (kış) kelimesinden gelir. Bu sayı yağın düşük sıcaklıktaki davranışını gösterir; 0W, 5W’den, 5W de 10W’den soğukta daha akıcıdır.',
          '“30”: Yağın yaklaşık 100 °C’deki, yani motor çalışma sıcaklığındaki kıvamını gösterir. 40, 30’dan daha kalındır.',
          'Çok dereceli yağlar (5W-30 gibi) hem soğuk çalıştırmada akıcı kalır hem de sıcakta yeterli kalınlığı korur. Günümüz binek araçlarının neredeyse tamamı çok dereceli yağ kullanır.',
        ],
      },
      {
        heading: 'Sık görülen viskoziteler',
        paragraphs: [],
        table: {
          caption: 'Yaygın motor yağı viskoziteleri ve genel kullanım alanları',
          head: ['Viskozite', 'Genel özellik', 'Nerede görülür?'],
          rows: [
            ['0W-20, 0W-16', 'Çok akıcı, düşük sürtünme', 'Yeni nesil benzinli ve hibrit motorlar'],
            ['0W-30, 5W-30', 'Akıcı, geniş kullanım', 'Birçok güncel benzinli ve dizel motor'],
            ['5W-40', 'Sıcakta daha kalın', 'Bazı benzinli ve dizel motorlar, özellikle eski nesil'],
            ['10W-40, 15W-40', 'Kalın', 'Eski motorlar, bazı ticari ve ağır vasıta motorları'],
          ],
        },
      },
      {
        heading: 'Onay ve norm kodları neden önemli?',
        paragraphs: [
          'Aynı viskozitedeki iki yağ, katkı paketi bakımından farklı olabilir. Bu yüzden ambalajda viskozitenin yanında ACEA (ör. A3/B4, C3), API (ör. SP) ya da araç üreticisinin onay kodları (ör. VW 504 00, MB 229.51, BMW Longlife-04, Renault RN0720) yer alır. Bakım kitapçığında bir üretici onayı yazıyorsa, yağın bu onayı taşıması gerekir.',
          'Dizel partikül filtresi (DPF) bulunan araçlarda genellikle düşük kül içerikli (Low SAPS) yağ istenir; ACEA C sınıfları bu yağları tanımlar. Uygun olmayan yağ uzun vadede partikül filtresinin tıkanmasına katkıda bulunabilir.',
        ],
      },
      {
        heading: 'Aracıma hangi yağı koymalıyım?',
        paragraphs: [],
        steps: [
          'Bakım kitapçığında ya da kullanım kılavuzunda “motor yağı” bölümünü bulun; viskozite ve onay kodu burada yazar.',
          'Yağ ambalajında aynı viskoziteyi ve istenen onay kodunu arayın. İkisi de uyuyorsa marka tercihi size kalmıştır.',
          'Kitapçık birden fazla viskozite veriyorsa iklim koşullarınıza göre seçim yapın; soğuk bölgelerde W öncesi sayısı düşük olan yağ ilk çalıştırmada avantaj sağlar.',
          'Yağı değiştirirken aynı anda motorunuza uygun yağ filtresini de değiştirin.',
        ],
      },
    ],
    sss: [
      {
        q: '5W-30 yerine 5W-40 kullanılır mı?',
        a: 'Bakım kitapçığı iki viskoziteye de izin veriyorsa kullanılabilir. Kitapçıkta yalnızca 5W-30 ve belirli bir üretici onayı yazıyorsa, o onayı taşıyan 5W-30 yağ kullanmak gerekir; özellikle uzun ömürlü bakım programlı ve DPF’li araçlarda bu önemlidir.',
      },
      {
        q: 'Farklı marka motor yağları karıştırılır mı?',
        a: 'Aynı viskozite ve aynı onaya sahip yağlarla acil bir tamamlama genellikle sorun yaratmaz. Ancak bir sonraki bakımda yağın tamamen değiştirilmesi önerilir.',
      },
      {
        q: 'Sentetik yağ ile mineral yağ arasındaki fark nedir?',
        a: 'Sentetik yağlar sıcaklık değişimlerine ve yaşlanmaya karşı daha dayanıklıdır; düşük viskoziteli modern yağların çoğu sentetiktir. Hangi tipin kullanılacağını aracınızın istediği viskozite ve onay belirler.',
      },
    ],
  },
  {
    slug: 'yag-lambasi-yaniyor-ne-yapmali',
    title: 'Yağ Lambası Yanıyor: Sebepleri ve Ne Yapmalısınız?',
    metaTitle: 'Yağ Lambası Neden Yanar? Ne Yapmalı? | Oto Center Market',
    summary:
      'Gösterge panelindeki kırmızı yağ lambası düşük yağ basıncını gösterir ve motoru durdurmanız gerekir. Yağ lambasının yanma sebepleri, yağ filtresiyle ilişkisi ve yapılması gerekenler.',
    tag: 'Arıza',
    readMinutes: 4,
    relatedHref: '/filtreler/yag-filtreleri',
    relatedLabel: 'Yağ filtrelerine göz atın',
    guncelleme: '2026-10-19',
    ilgiliYazilar: ['yag-filtresi-ne-zaman-degisir', 'motor-yagi-5w30-5w40-ne-demek'],
    intro: [
      'Kırmızı yağ lambası (yağdanlık simgesi) motorda yağ basıncının düştüğünü gösterir. Seyir sırasında yanarsa güvenli bir yerde durup motoru hemen kapatın: yağ basıncı olmadan çalışan motor kısa sürede ağır hasar görebilir. Ardından motor soğuyunca yağ seviyesini kontrol edin; seviye normalse aracı çalıştırmadan çekici ya da servis desteği alın.',
      'Bazı araçlarda sarı ya da turuncu renkte ayrı bir yağ seviyesi uyarısı bulunur. Bu uyarı genellikle yağın eksildiğini gösterir; yağ tamamlanarak kısa sürede çözülebilir, ancak sebebi araştırılmalıdır.',
    ],
    body: [
      {
        heading: 'Yağ lambası neden yanar?',
        paragraphs: [],
        list: [
          'Yağ seviyesinin düşük olması: yağ yakma, kaçak ya da uzun süre kontrol edilmemesi.',
          'Yağ pompasında arıza ya da pompanın emiş süzgecinin tıkanması.',
          'Yanlış viskozitede ya da çok eskimiş yağ kullanılması.',
          'Yanlış ya da kalitesiz yağ filtresi: uygun olmayan bypass veya geri akış valfi yağ basıncını etkileyebilir.',
          'Yağ basınç müşürü (sensör) ya da kablo arızası: lamba yanar ama gerçek basınç normal olabilir. Bunu ancak servis ölçerek anlayabilir.',
        ],
      },
      {
        heading: 'Yağ lambası yandığında ne yapmalı?',
        paragraphs: [],
        steps: [
          'Güvenli bir yerde durun ve motoru hemen kapatın. “Biraz daha gideyim” demek motor hasarına yol açabilir.',
          'Motorun birkaç dakika soğumasını bekleyin, araç düz zemindeyken yağ çubuğuyla seviyeyi kontrol edin.',
          'Seviye düşükse aracınıza uygun yağla tamamlayın. Motoru çalıştırdığınızda lamba birkaç saniye içinde sönüyorsa yavaşça en yakın servise gidin ve kaçak ya da yağ yakma kontrolü yaptırın.',
          'Seviye normal olmasına rağmen lamba yanıyorsa aracı çalıştırmayın; çekiciyle servise götürün.',
          'Motordan vuruntu, tıkırtı gibi sesler geliyorsa kesinlikle tekrar çalıştırmayın.',
        ],
      },
      {
        heading: 'Yağ filtresinin rolü',
        paragraphs: [
          'Yağ filtresi yalnızca yağı temizlemez; birçok filtrede motor durduğunda yağın karterine geri boşalmasını engelleyen bir geri akış valfi ve filtre tıkandığında yağın motora ulaşmaya devam etmesini sağlayan bir bypass valfi bulunur. Motora uygun olmayan bir filtre takıldığında ilk çalıştırmada lamba birkaç saniye geç sönebilir ya da yağ basıncı beklenenden farklı olabilir.',
          'Bu yüzden yağ filtresini dış ölçüsüne göre değil, motorunuza uygun koduna göre seçin. Yağ değişiminde filtreyi de yenilemek ve doğru şekilde takmak için [yağ filtresi değişim rehberimize](/blog/yag-filtresi-nasil-degistirilir "Yağ filtresi nasıl değiştirilir") bakabilirsiniz.',
        ],
      },
    ],
    sss: [
      {
        q: 'Yağ lambası yanıp sönüyorsa ne demek?',
        a: 'Özellikle virajlarda ya da frenlemede yanıp sönen lamba çoğu zaman yağ seviyesinin düşük olduğunu gösterir; yağ karterde bir yana kaçtığında pompa kısa süre hava emer. Seviyeyi hemen kontrol edin.',
      },
      {
        q: 'Yağ lambası yanarken araç kullanılır mı?',
        a: 'Kırmızı yağ lambası yanarken araç kullanılmamalıdır. Yağ basıncı olmadan motor yatakları ve turbo kısa sürede hasar görebilir.',
      },
      {
        q: 'Yağ değişiminden sonra yağ lambası yanıyorsa sebebi ne olabilir?',
        a: 'Yağ eksik doldurulmuş olabilir, filtre yanlış takılmış ya da motora uygun olmayan bir filtre kullanılmış olabilir, eski filtre contası yerinde kalıp kaçak yapıyor olabilir. Motoru çalıştırmadan seviyeyi ve filtre çevresini kontrol ettirin.',
      },
    ],
  },
  {
    slug: 'hava-kurutucu-filtresi-nedir',
    title: 'Hava Kurutucu Filtresi Nedir? Kamyon ve Otobüslerde Ne Zaman Değişir?',
    metaTitle: 'Hava Kurutucu Filtresi Nedir, Ne Zaman Değişir? | Oto Center Market',
    summary:
      'Havalı fren sistemli kamyon, çekici ve otobüslerde hava kurutucu filtresinin (kartuşunun) görevi, değişim zamanı, belirtileri ve hangi araca hangi MANN-FILTER kodunun uyduğu.',
    tag: 'Ağır vasıta',
    readMinutes: 5,
    relatedHref: '/filtreler/kurutucu-filtreler',
    relatedLabel: 'Kurutucu filtrelere göz atın',
    guncelleme: '2026-10-19',
    ilgiliYazilar: ['periyodik-bakimda-hangi-filtreler-degisir', 'kis-oncesi-arac-bakimi'],
    intro: [
      'Hava kurutucu filtresi (kurutucu kartuş), havalı fren sistemli kamyon, çekici ve otobüslerde kompresörün ürettiği basınçlı havadaki nemi ve yağ buharını tutar. Kuru ve temiz hava; fren valflerinin, körüklerin ve hava tanklarının paslanmasını, donmasını ve tıkanmasını önler. Değişim aralığı araç ve kurutucu üreticisine göre değişir; yaygın uygulama kartuşun periyodik bakımlarla, genellikle yılda bir değiştirilmesidir.',
      'Aracınıza uyan kartuşu [kurutucu filtreler kategorisinde](/filtreler/kurutucu-filtreler "Kurutucu filtreleri görüntüle") ya da [ağır vasıta](/agir-vasita "Ağır vasıta filtreleri") bölümünden aracınızı seçerek bulabilirsiniz.',
    ],
    body: [
      {
        heading: 'Hava kurutucu nasıl çalışır?',
        paragraphs: [
          'Kompresör dış havayı sıkıştırırken havadaki nem de yoğunlaşır. Kurutucu kartuşun içindeki kurutucu madde (granül) bu nemi tutar; kartuşta ayrıca kompresörden gelen yağ buharını ayıran bir bölüm bulunabilir. Tanklar dolduğunda kurutucu kısa bir tahliye (boşaltma) yaparak biriktirdiği nemi dışarı atar ve kendini yeniler.',
          'Zamanla kurutucu madde yağla kirlenir ve nem tutma kapasitesini kaybeder. Bu noktada kartuş değiştirilmezse nemli hava fren sistemine ulaşır.',
        ],
      },
      {
        heading: 'Kurutucu kartuşun bittiğini gösteren işaretler',
        paragraphs: [],
        list: [
          'Hava tanklarının tahliye musluğundan su ya da yağlı su gelmesi.',
          'Kışın valflerin ve hava hatlarının donması, fren ya da vites (pnömatik) sisteminde gecikme.',
          'Kompresörün tankları doldurmak için normalden uzun çalışması.',
          'Kurutucunun çok sık tahliye yapması ya da sürekli hava kaçırması.',
        ],
      },
      {
        heading: 'Hangi araca hangi kurutucu filtre?',
        paragraphs: [
          'Katalogdaki uyumluluk verisine göre MANN-FILTER kurutucu kartuşları ve uyduğu araçlardan bazıları aşağıda. Aynı markanın farklı modellerinde kurutucu üreticisi değişebildiği için kesin seçimi aracınızı seçerek ya da sökülen kartuşun üzerindeki kodla yapın.',
        ],
        table: {
          caption: 'MANN-FILTER hava kurutucu kartuşları ve uyumlu araçlar (katalog verisi)',
          head: ['MANN-FILTER kodu', 'Uyumlu araçlardan bazıları'],
          rows: [
            ['TB 1394/1 x', 'Mercedes-Benz Actros, Axor, Atego, Arocs, Antos; MAN TGA, TGL, TGS, TGX; Iveco Stralis, EuroCargo; Renault Trucks; Ford Trucks Cargo, F-Max; BMC; Otokar; Temsa; Volvo FH 16'],
            ['TB 1374 x', 'BMC Fatih, Probus, Procity, Professional; Ford Trucks Cargo; Iveco EuroCargo, Stralis; Otokar Kent, Navigo, Territo, Vectio; Temsa Safari'],
            ['TB 1394/3 x', 'Scania G, P, R, S, T ve New Generation serileri'],
            ['TB 1374/3 x', 'Scania P, R, T'],
            ['TB 1394/6 x', 'DAF CF75, CF85, XF105, New XF (XF106)'],
            ['TB 1364 x', 'DAF CF75, CF85'],
          ],
        },
      },
      {
        heading: 'Değişimde dikkat edilecekler',
        paragraphs: [],
        list: [
          'Kartuşu sökmeden önce sistemdeki havayı tamamen boşaltın. Basınç altındaki kartuşu sökmek tehlikelidir.',
          'Yeni kartuşun contasına ince bir kat yağ sürün ve üreticinin belirttiği şekilde elle ya da belirtilen torkla sıkın.',
          'Değişimden sonra tankları doldurup kaçak kontrolü yapın, tanklardaki suyu boşaltın.',
          'Kartuş kısa sürede yağla doluyorsa sorun kompresörde olabilir; kompresörü kontrol ettirin.',
        ],
      },
    ],
    sss: [
      {
        q: 'Hava kurutucu filtresi kaç km’de değişir?',
        a: 'Değişim aralığı araç üreticisine, kurutucu tipine ve kullanım yoğunluğuna göre değişir. Yaygın uygulama kartuşun yılda bir, periyodik bakımlarla değiştirilmesidir; kesin aralık için aracınızın bakım planına bakın.',
      },
      {
        q: 'Kurutucu filtre değişmezse ne olur?',
        a: 'Nemli hava fren sistemine ulaşır; tanklarda su birikir, valfler paslanabilir ve kışın donma nedeniyle fren ve pnömatik sistemlerde arıza riski artar.',
      },
      {
        q: 'Kurutucu kartuşta yağ çıkması normal mi?',
        a: 'Az miktarda yağ buharı normaldir ve kartuş bunu tutar. Tank tahliyesinden belirgin yağ geliyorsa ya da kartuş kısa sürede yağla doluyorsa kompresör aşınmış olabilir; kontrol ettirin.',
      },
    ],
  },
  {
    slug: 'toyota-corolla-filtre-rehberi',
    title: 'Toyota Corolla Filtre Rehberi: Yağ, Hava, Polen ve Yakıt Filtresi Kodları',
    metaTitle: 'Toyota Corolla Filtre Kodları | Oto Center Market',
    summary:
      'Toyota Corolla E12, E15, E18 ve E210 için motor bazında MANN-FILTER ve FILTRON yağ, hava, polen ve yakıt filtresi kodları. Benzinli, D-4D dizel ve hibrit motorlar.',
    tag: 'Model rehberi',
    readMinutes: 7,
    relatedHref: '/otomobil/toyota',
    relatedLabel: 'Toyota modellerine göz atın',
    guncelleme: '2026-10-19',
    ilgiliYazilar: ['ford-focus-filtre-rehberi', 'fiat-egea-filtre-rehberi'],
    intro: [
      'Toyota Corolla’da filtre seçimi nesle ve motora göre değişir: aynı nesilde benzinli, D-4D dizel ve hibrit motorlar farklı yağ ve hava filtresi kullanabilir. Polen filtresi ise çoğu nesilde tüm motorlarda ortaktır. Aşağıdaki tablolar Corolla E12, E15, E18 ve E210 için katalogdaki uyumluluk verisinden hazırlandı; her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır.',
      'Tablolar hızlı başvuru içindir. Kesin seçim için [Toyota modelleri](/otomobil/toyota "Toyota yedek parça") arasından Corolla neslinizi ve motorunuzu seçin; yalnızca o motora uyumlu ürünler listelenir.',
    ],
    body: [
      {
        heading: 'Neslinizi ve motorunuzu nasıl anlarsınız?',
        paragraphs: [
          'Nesli ruhsattaki model yılından tahmin edebilirsiniz; nesil geçiş yıllarında iki nesil bir süre birlikte satılmıştır. Katalogda nesiller şasi koduyla (E12, E15, E18, E210) geçer. Motor hacmi ve gücü ruhsatta yazar; D-4D dizel, VVT-i benzinli motoru, Hybrid ise hibrit versiyonu gösterir.',
          'Aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Bu durumda eski filtrenin üzerindeki kodu kontrol edin ya da siparişten önce şasi numaranızla bize sorun.',
        ],
      },
      {
        heading: 'Corolla E210 filtre kodları',
        paragraphs: [
          'Corolla E210 (yaklaşık 2019 ve sonrası) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Corolla E210 sayfasında](/otomobil/toyota/corolla-e210 "Toyota Corolla E210 yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Toyota Corolla E210 — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'W 68/3', 'OP 572', '1.2 116 HP, 1.6 VVTi 122 HP, 1.6 VVTi 132 HP, 1.8 116 HP, 1.8 VVTi Hybrid 140 HP'],
            ['Yağ', '—', 'OP 618/2', '1.5 VVTi 125 HP, 1.8 VVTi Hybrid 140 HP, 2.0 Hybrid 152 HP, 2.0 Hybrid 184 HP'],
            ['Yağ', 'W 6031', '—', '1.8 VVTi Hybrid 140 HP, 2.0 Hybrid 152 HP, 2.0 Hybrid 184 HP'],
            ['Hava', '—', 'AP 178/4', '1.2 116 HP, 1.5 VVTi 125 HP, 1.6 VVTi 122 HP, 1.6 VVTi 132 HP'],
            ['Hava', '—', 'AP 178/3', '1.8 116 HP, 1.8 VVTi Hybrid 140 HP'],
            ['Hava', 'C 18 021', 'AP 178/6', '2.0 Hybrid 152 HP, 2.0 Hybrid 184 HP'],
            ['Hava', 'C 17 008', '—', '1.8 116 HP'],
            ['Polen / kabin', 'CUK 22 032', 'K 1310, K 1310A', 'Bu nesildeki tüm motorlar'],
            ['Polen / kabin', 'FP 22 032', '—', '1.2 116 HP, 1.6 VVTi 122 HP, 1.6 VVTi 132 HP, 1.8 VVTi Hybrid 140 HP, 2.0 Hybrid 152 HP, 2.0 Hybrid 184 HP'],
          ],
        },
      },
      {
        heading: 'Corolla E18 filtre kodları',
        paragraphs: [
          'Corolla E18 (yaklaşık 2013–2019) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Corolla E18 sayfasında](/otomobil/toyota/corolla-xi-e18 "Toyota Corolla E18 yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Toyota Corolla E18 — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'HU 6006 z', 'OE 685/2', '1.33 VVT-i 99 HP, 1.6 132 HP, 1.6 VVT-i 122 HP'],
            ['Yağ', 'HU 7019 z', 'OE 685/1', '1.4 D-4D 90 HP'],
            ['Yağ', 'W 68/3', 'OP 572', '1.5 Hybrid 73 HP'],
            ['Hava', 'C 24 005', 'AP 160/1', '1.33 VVT-i 99 HP, 1.6 VVT-i 122 HP'],
            ['Hava', 'C 27 013', '—', '1.4 D-4D 90 HP'],
            ['Hava', 'C 17 008', 'AP 178/3', '1.5 Hybrid 73 HP'],
            ['Polen / kabin', 'CUK 1919, FP 1919', '—', 'Bu nesildeki tüm motorlar'],
            ['Polen / kabin', 'CU 1919', '—', '1.33 VVT-i 99 HP, 1.5 Hybrid 73 HP, 1.6 VVT-i 122 HP'],
            ['Yakıt', 'WK 8028 z', '—', '1.4 D-4D 90 HP'],
          ],
        },
      },
      {
        heading: 'Corolla E15 filtre kodları',
        paragraphs: [
          'Corolla E15 (yaklaşık 2007–2013) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Corolla E15 sayfasında](/otomobil/toyota/corolla-x-e14-e15 "Toyota Corolla E15 yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Toyota Corolla E15 — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'HU 6006 z', 'OE 685/2', '1.33 VVT 101 HP, 1.6 16V 124 HP, 1.6 16V 132 HP, 1.6 VVTi 136 HP, 1.8 136 HP, 1.8 16V 147 HP, 1.8i 16V DOHC 136 HP'],
            ['Yağ', 'W 68/3', 'OP 572', '1.4 97 HP, 1.6 16V 124 HP, 1.6 VVTi 136 HP, 1.8 128 HP, 1.8i 16V DOHC 136 HP'],
            ['Hava', 'C 24 005', 'AP 160/1', 'Bu nesildeki tüm motorlar'],
            ['Polen / kabin', 'CU 1919, CUK 1919, FP 1919', '—', 'Bu nesildeki tüm motorlar'],
          ],
        },
      },
      {
        heading: 'Corolla E12 filtre kodları',
        paragraphs: [
          'Corolla E12 (yaklaşık 2002–2007) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Corolla E12 sayfasında](/otomobil/toyota/corolla-ix-e12-e13 "Toyota Corolla E12 yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Toyota Corolla E12 — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'W 68/3', 'OP 572', '1.4 97 HP, 1.6 110 HP, 1.8 VVTi 134 HP'],
            ['Yağ', 'WP 1026', 'OP 619/2', '2.0 D-4D 90 HP, 2.0 D-4D 110 HP, 2.0 D-4D 116 HP'],
            ['Yağ', 'W 610/9', '—', '1.8 173 HP, 1.8 192 HP'],
            ['Yağ', 'W 712/83', 'OP 618', '1.4 D-4D 90 HP'],
            ['Hava', 'C 2620', 'AP 142/3', '1.4 97 HP, 1.6 110 HP, 1.8 173 HP, 1.8 192 HP, 1.8 VVTi 134 HP'],
            ['Hava', 'C 3230', 'AP 142/6', '1.4 D-4D 90 HP, 2.0 D-4D 90 HP, 2.0 D-4D 110 HP, 2.0 D-4D 116 HP'],
            ['Polen / kabin', 'CU 1912', 'K 1123', 'Bu nesildeki tüm motorlar'],
            ['Yakıt', 'WK 720/2 x', 'PP 950', '1.4 D-4D 90 HP, 2.0 D-4D 90 HP, 2.0 D-4D 110 HP, 2.0 D-4D 116 HP'],
            ['Yakıt', 'WK 828 x', '—', '2.0 D-4D 116 HP'],
          ],
        },
      },
    ],
    sss: [
      {
        q: 'Toyota Corolla 1.6 benzinli yağ filtresi kodu nedir?',
        a: 'Katalogdaki uyumluluk verisine göre Corolla E18’in 1.6 benzinli motorlarında MANN-FILTER HU 6006 z ve FILTRON OE 685/2 kartuş yağ filtresi kayıtlıdır; Corolla E15 1.6’da bu kodun yanında motor versiyonuna göre W 68/3 ve OP 572 de görünür. Corolla E210 1.6 VVTi’de ise MANN-FILTER W 68/3 ve FILTRON OP 572 görünür. Kesin seçim için motorunuzu sitede seçerek doğrulayın.',
      },
      {
        q: 'Corolla hibrit yağ filtresi kodu nedir?',
        a: 'Corolla E210 1.8 ve 2.0 Hybrid motorlarda katalogda MANN-FILTER W 6031 ve FILTRON OP 618/2 kayıtlıdır; 1.8 Hybrid için ayrıca W 68/3 ve OP 572 de görünür. Aynı motorda iki kod görülmesi üretim yılına bağlı olabilir; eski filtrenin kodunu kontrol edin.',
      },
      {
        q: 'Corolla E12 polen filtresi kodu nedir?',
        a: 'Katalogda Corolla E12’nin tüm motorları için MANN-FILTER CU 1912 ve FILTRON K 1123 polen filtresi kayıtlıdır.',
      },
    ],
  },
  {
    slug: 'polen-filtresi-nasil-degistirilir',
    title: 'Polen Filtresi Nasıl Değiştirilir? Torpido Arkası ve Kaput Altı Adım Adım',
    metaTitle: 'Polen Filtresi Nasıl Değiştirilir? Adım Adım | Oto Center Market',
    summary:
      'Polen (kabin) filtresi çoğu araçta torpido gözünün arkasında, bazılarında ön cam altındaki kaputun içindedir. Yerini bulmak, eski filtreyi çıkarmak ve yenisini doğru yönde takmak için adım adım rehber.',
    tag: 'Nasıl yapılır',
    readMinutes: 4,
    relatedHref: '/filtreler/polen-kabin-filtreleri',
    relatedLabel: 'Polen / kabin filtrelerine göz atın',
    guncelleme: '2026-10-20',
    ilgiliYazilar: ['polen-filtresi-kac-km-de-degisir', 'aktif-karbonlu-polen-filtresi-farki'],
    intro: [
      'Polen filtresi çoğu otomobilde torpido gözünün arkasındaki bir kapağın içindedir: torpido gözünü boşaltıp indirir, filtre kapağını açar, eski filtreyi çekip yenisini hava akış okuna dikkat ederek takarsınız. Bazı araçlarda ise filtre kaputun altında, ön cam önündeki plastik ızgaranın (torpido sacı kapağı) altında yer alır. İşlem çoğu araçta alet gerektirmez ve 10–15 dakika sürer.',
      'Aracınıza uyan filtreyi sitede marka, model ve motorunuzu seçerek ya da eski filtrenin üzerindeki kodla [polen / kabin filtreleri kategorisinde](/filtreler/polen-kabin-filtreleri "Polen filtrelerini görüntüle") bulabilirsiniz.',
    ],
    body: [
      {
        heading: 'Polen filtresi nerede?',
        paragraphs: [
          'Yerini en kolay kullanım kılavuzundan öğrenirsiniz. Genel olarak iki yerleşim görülür:',
        ],
        list: [
          'Torpido gözünün arkası: Günümüz otomobillerinin çoğunda filtre, torpido gözü indirildiğinde görünen dikdörtgen bir kapağın içindedir.',
          'Kaput altı, ön cam önü: Bazı modellerde filtre, motor bölmesinde ön camın hemen önündeki plastik kapağın altındaki yuvada bulunur.',
          'Bazı araçlarda filtreye ulaşmak için torpido altındaki ya da yolcu ayak boşluğundaki bir panelin sökülmesi gerekir.',
        ],
      },
      {
        heading: 'Torpido arkasındaki filtre nasıl değiştirilir?',
        paragraphs: [],
        steps: [
          'Kontağı kapatın, fan ve klimanın kapalı olduğundan emin olun.',
          'Torpido gözünü boşaltın ve açın. Yan taraflardaki durdurucuları ya da amortisör bağlantısını serbest bırakarak torpido gözünü aşağı indirin.',
          'Arkada görünen filtre kapağının tırnaklarına bastırarak kapağı çıkarın.',
          'Eski filtreyi yavaşça kendinize doğru çekin. Biriken toz ve yaprakların kanala düşmemesi için filtreyi düz tutun.',
          'Filtre yuvasını mümkünse elektrik süpürgesiyle temizleyin.',
          'Yeni filtrenin üzerindeki hava akış okunu bulun. Ok, havanın filtreden geçtiği yönü gösterir; eski filtrenin takılı olduğu yönü ve kapağın üzerindeki işareti esas alın.',
          'Yeni filtreyi yuvaya bükmeden kaydırın, kapağı takın ve torpido gözünü yerine kaldırın.',
          'Fanı çalıştırıp hava akışının ve sesin normal olduğunu kontrol edin.',
        ],
      },
      {
        heading: 'Kaput altındaki filtre nasıl değiştirilir?',
        paragraphs: [],
        steps: [
          'Kontak kapalıyken kaputu açın; silecek kollarının kapağı engelleyip engellemediğine bakın.',
          'Ön cam önündeki plastik kapağın klipslerini ya da vidalarını sökerek filtre yuvasını açın.',
          'Eski filtreyi çıkarın, yuvaya dolmuş yaprakları ve kiri temizleyin. Bu bölgedeki su tahliye deliklerinin açık olduğundan emin olun.',
          'Yeni filtreyi hava akış okuna dikkat ederek takın, kapağı ve conta kenarlarını düzgün oturtarak kapatın.',
        ],
      },
      {
        heading: 'Dikkat edilecekler',
        paragraphs: [],
        list: [
          'Filtreyi ters takmayın: ok yönü yanlışsa filtrenin tutma verimi düşer.',
          'Filtreyi aşırı bükmeyin; kıvrılan kenarlardan filtrelenmemiş hava geçebilir.',
          'Torpido gözünü indirirken plastik tırnakları zorlamayın; çoğu araçta yandan esneterek çıkarılır.',
          'Klimadan koku geliyorsa yalnızca filtre değişimi yetmeyebilir; [klima kokusu yazımızda](/blog/polen-filtresi-kac-km-de-degisir "Polen filtresi kaç km’de değişir") sebeplerini anlattık.',
        ],
      },
    ],
    sss: [
      {
        q: 'Polen filtresi değişimi ne kadar sürer?',
        a: 'Torpido gözü arkasındaki filtrelerde işlem genellikle 10–15 dakika sürer ve alet gerektirmez. Kaput altındaki ya da panel sökülmesi gereken modellerde biraz daha uzun sürebilir.',
      },
      {
        q: 'Polen filtresinin ok yönü neye göre takılır?',
        a: 'Filtre üzerindeki ok, havanın filtreden geçiş yönünü gösterir. Eski filtrenin hangi yönde takılı olduğuna ve filtre kapağındaki işarete bakarak yeni filtreyi aynı yönde takın.',
      },
      {
        q: 'Polen filtresini kendim değiştirebilir miyim?',
        a: 'Evet, çoğu araçta polen filtresi kullanıcının değiştirebileceği basit bir parçadır. Yerini ve sökme şeklini aracınızın kullanım kılavuzundan kontrol edebilirsiniz.',
      },
    ],
  },
  {
    slug: 'dizel-yakit-filtresi-degisimi-hava-alma',
    title: 'Dizel Yakıt Filtresi Değişimi ve Hava Alma: Adım Adım Rehber',
    metaTitle: 'Dizel Yakıt Filtresi Değişimi ve Hava Alma | Oto Center Market',
    summary:
      'Dizel araçlarda yakıt filtresinin nasıl değiştirildiği, değişimden sonra sistemin havasının nasıl alındığı, su ayırıcının boşaltılması ve common rail motorlarda temizliğin neden kritik olduğu.',
    tag: 'Nasıl yapılır',
    readMinutes: 5,
    relatedHref: '/filtreler/yakit-filtreleri',
    relatedLabel: 'Yakıt filtrelerine göz atın',
    guncelleme: '2026-10-20',
    ilgiliYazilar: ['yakit-filtresi-ne-zaman-degisir', 'kis-oncesi-arac-bakimi'],
    intro: [
      'Dizel yakıt filtresi değiştirilirken önce filtre gövdesindeki yakıt boşaltılır, eski filtre ya da kartuş sökülür, yeni filtre contaları yenilenerek takılır ve ardından sisteme giren hava alınır. Elektrikli besleme pompası olan araçlarda hava alma çoğu zaman kontağı birkaç kez açıp kapatarak yapılır; el pompalı sistemlerde filtre üzerindeki pompa basılarak yakıt gelene kadar devam edilir.',
      'Common rail dizel motorlarda yakıt sistemine giren en küçük kir bile enjektörlere zarar verebilir. Temiz bir çalışma ortamınız ve doğru ekipmanınız yoksa değişimi servise yaptırmanız daha güvenlidir. Aracınıza uyan filtreyi [yakıt filtreleri kategorisinde](/filtreler/yakit-filtreleri "Yakıt filtrelerini görüntüle") bulabilirsiniz.',
    ],
    body: [
      {
        heading: 'Önce filtre tipinizi öğrenin',
        paragraphs: [
          'Dizel yakıt filtreleri iki ana tipte görülür. Komple (hat tipi ya da spin-on) filtrelerde filtre gövdesiyle birlikte değişir; MANN-FILTER’da WK, FILTRON’da PP koduyla başlar. Kartuş tipinde motor üzerindeki gövde kalır, yalnızca içindeki eleman değişir; MANN-FILTER’da PU, FILTRON’da PE koduyla başlar. Kartuş filtreler genellikle yeni contalarıyla gelir.',
          'Birçok dizel filtrede altta bir su ayırıcı ve boşaltma vidası, bazılarında ise su seviyesi sensörü bulunur.',
        ],
      },
      {
        heading: 'Hazırlık ve güvenlik',
        paragraphs: [],
        list: [
          'Motor soğukken çalışın; yakıt sıcak motor parçalarına damlamamalı.',
          'Çalışma alanında açık alev, kıvılcım ya da sigara olmamalı.',
          'Akan yakıt için bir kap ve emici bez hazırlayın; yakıtın kayışlara ve hortumlara bulaşmasını önleyin.',
          'Filtre gövdesinin çevresini sökmeden önce temizleyin. Gövde açıkken içeri toz girmemesi çok önemlidir.',
          'Eldiven ve göz koruması kullanın.',
        ],
      },
      {
        heading: 'Adım adım değişim',
        paragraphs: [],
        steps: [
          'Filtre gövdesinin altına kabı yerleştirin. Varsa su boşaltma vidasını açarak gövdedeki yakıtı ve suyu boşaltın.',
          'Komple filtrede hortum bağlantılarını ya da filtreyi sökün; bağlantıların takılış yönünü not edin. Kartuş tipinde gövde kapağını söküp eski elemanı çıkarın.',
          'Kartuş gövdesinin içini temiz, tüy bırakmayan bir bezle silin. Temiz tarafa (motora giden çıkış kanalına) kir girmemesine dikkat edin.',
          'Yeni contaları ya da O-ringleri takın, contalara ince bir kat temiz yakıt sürün.',
          'Yeni filtreyi ya da kartuşu takın, kapağı servis bilgisindeki tork değeriyle sıkın. Su sensörü varsa yeni filtreye aktarın ve fişini takın.',
          'Su boşaltma vidasını kapatın ve bağlantıları kontrol edin.',
        ],
      },
      {
        heading: 'Hava nasıl alınır?',
        paragraphs: [
          'Değişimden sonra filtre gövdesinde ve hatlarda hava kalır. Hava alma yöntemi araca göre değişir; kesin yöntem için servis bilgisine bakın. Genel uygulamalar şunlardır:',
        ],
        list: [
          'Elektrikli besleme pompası olan araçlarda: kontağı motoru çalıştırmadan birkaç kez açıp birkaç saniye bekleyerek pompanın sistemi doldurmasını sağlayın.',
          'El pompası (pompa topu ya da filtre üzerinde basma düğmesi) olan araçlarda: pompa sertleşip direnç hissedilene kadar basın.',
          'Hava alma vidası olan sistemlerde: vidayı hafifçe gevşetip el pompasıyla hava kabarcıksız yakıt gelene kadar basın, sonra vidayı sıkın.',
          'Motor çalıştıktan sonra kısa süre düzensiz çalışabilir. Marşa art arda uzun süre basmayın; çalışmazsa hava almayı tekrarlayın.',
        ],
      },
      {
        heading: 'Sık yapılan hatalar',
        paragraphs: [],
        list: [
          'Yeni filtreyi temiz tarafından filtrelenmemiş yakıtla doldurmak: kir doğrudan enjeksiyon sistemine gider. Üretici önceden doldurmaya izin vermiyorsa filtreyi boş takıp hava alma yöntemini kullanın.',
          'Eski contayı yeniden kullanmak: hava ya da yakıt kaçağına yol açar.',
          'Su sensörünü yeni filtreye aktarmayı unutmak: gösterge uyarısına sebep olabilir.',
          'Benzinli araçla karıştırmak: benzinli araçların çoğunda yakıt filtresi depodaki pompa modülünün içindedir ve değişimi farklıdır.',
        ],
      },
    ],
    sss: [
      {
        q: 'Dizel yakıt filtresi değişince araç neden çalışmaz?',
        a: 'En sık sebep sistemde hava kalmasıdır. Kontağı birkaç kez açıp kapatarak ya da el pompasıyla hava alın. Hâlâ çalışmıyorsa bağlantılarda hava emişi veya yanlış takılmış conta olabilir.',
      },
      {
        q: 'Yakıt filtresinin suyu ne sıklıkla boşaltılmalı?',
        a: 'Gösterge panelinde su uyarısı yandığında ve periyodik bakımlarda boşaltılmalıdır. Su ayırıcılı filtrelerde, özellikle kıştan önce boşaltmak donma riskini azaltır.',
      },
      {
        q: 'Yakıt filtresini değiştirmeden önce doldurmak gerekir mi?',
        a: 'Üreticiye göre değişir. Common rail sistemlerde temiz tarafa kir girme riski nedeniyle çoğu zaman filtre boş takılır ve sistemin havası alınır. Aracınızın servis bilgisine uyun.',
      },
    ],
  },
  {
    slug: 'adblue-filtresi-nedir',
    title: 'AdBlue Filtresi Nedir? Ne Zaman Değişir, Tıkanırsa Ne Olur?',
    metaTitle: 'AdBlue Filtresi Nedir, Ne Zaman Değişir? | Oto Center Market',
    summary:
      'SCR sistemli dizel kamyon, otobüs ve çekicilerde AdBlue filtresinin görevi, tıkandığında görülen arızalar, değişim zamanı ve hangi araca hangi MANN-FILTER kitinin uyduğu.',
    tag: 'Ağır vasıta',
    readMinutes: 4,
    relatedHref: '/filtreler/adblue-filtreleri',
    relatedLabel: 'AdBlue filtrelerine göz atın',
    guncelleme: '2026-10-20',
    ilgiliYazilar: ['hava-kurutucu-filtresi-nedir', 'periyodik-bakimda-hangi-filtreler-degisir'],
    intro: [
      'AdBlue filtresi, SCR (seçici katalitik indirgeme) sistemli dizel araçlarda AdBlue sıvısını dozaj pompasına ve enjektöre gitmeden önce süzer. AdBlue; yüzde 32,5 oranında üre içeren, egzozdaki azot oksitleri (NOx) azaltmak için kullanılan bir sıvıdır. Filtre, sıvıdaki partiküllerin ve kristalleşmiş ürenin pompayı ve dozaj valfini tıkamasını önler.',
      'Değişim aralığı araç ve SCR sistemi üreticisine göre değişir ve bakım planında belirtilir. Aracınıza uyan kiti [AdBlue filtreleri kategorisinde](/filtreler/adblue-filtreleri "AdBlue filtrelerini görüntüle") ya da [ağır vasıta](/agir-vasita "Ağır vasıta filtreleri") bölümünden aracınızı seçerek bulabilirsiniz.',
    ],
    body: [
      {
        heading: 'AdBlue filtresi neden tıkanır?',
        paragraphs: [
          'AdBlue havayla temas ettiğinde ya da kuruduğunda beyaz üre kristalleri oluşturur. Depoya giren toz, uygun olmayan kaplarla doldurma ve standart dışı sıvı kullanımı da filtreyi kirletir. Zamanla tıkanan filtre, pompanın yeterli sıvıyı basamamasına yol açar.',
        ],
      },
      {
        heading: 'Tıkalı AdBlue filtresinin belirtileri',
        paragraphs: [],
        list: [
          'Gösterge panelinde AdBlue ya da emisyon sistemi uyarısı.',
          'Motor arıza lambasının yanması ve emisyon sistemiyle ilgili arıza kodları.',
          'Motor gücünün sistem tarafından sınırlandırılması (güç düşürme).',
          'AdBlue tüketiminin beklenenden belirgin şekilde düşmesi.',
        ],
      },
      {
        heading: 'Hangi araca hangi AdBlue filtresi?',
        paragraphs: [
          'Katalogdaki uyumluluk verisine göre MANN-FILTER AdBlue filtre kitleri ve uyduğu araçlardan bazıları aşağıda. Kesin seçim için aracınızı seçin ya da sökülen filtrenin üzerindeki kodu kontrol edin.',
        ],
        table: {
          caption: 'MANN-FILTER AdBlue filtre kitleri ve uyumlu araçlar (katalog verisi)',
          head: ['MANN-FILTER kodu', 'Uyumlu araçlardan bazıları'],
          rows: [
            ['U 58/1 KIT', 'Mercedes-Benz Actros I, Axor II, Atego II, Econic, Vario, Zetros; Setra otobüsleri'],
            ['U 630 x KIT', 'Volvo FH, FH 16, FM, FMX, FL, FE; Renault Trucks Premium, Magnum, Kerax, Midlum; Iveco Stralis, EuroCargo; Ford Trucks Cargo, F-Max'],
            ['U 620/3 y KIT', 'DAF CF75, CF85, XF105'],
          ],
        },
      },
      {
        heading: 'Değişimde dikkat edilecekler',
        paragraphs: [],
        list: [
          'Kodunda KIT geçen ürünler genellikle filtreyle birlikte conta gibi montaj parçalarını da içerir; eski parçaları yeniden kullanmayın.',
          'Filtre yuvasını temiz tutun; üre kristallerini sıcak suyla temizleyin, sistemi kirle temas ettirmeyin.',
          'AdBlue depoya yalnızca standarda uygun (ISO 22241) sıvı ve temiz kaplarla doldurulmalıdır.',
          'Değişimden sonra arıza kodlarının silinmesi ve sistem testinin yapılması için servis cihazı gerekebilir.',
        ],
      },
    ],
    sss: [
      {
        q: 'AdBlue filtresi kaç km’de değişir?',
        a: 'Değişim aralığı araç ve SCR sistemi üreticisine göre farklıdır ve bakım planında yazar. Ağır kullanımda ya da kalitesiz AdBlue kullanıldığında filtre daha erken tıkanabilir.',
      },
      {
        q: 'AdBlue filtresi tıkanırsa araç durur mu?',
        a: 'Araç hemen durmaz, ancak SCR sistemi arıza verdiğinde motor gücü sınırlandırılabilir ve bazı araçlarda arıza giderilmeden motorun yeniden çalıştırılması kısıtlanabilir. Uyarı yandığında sistemi kontrol ettirin.',
      },
      {
        q: 'Binek araçlarda AdBlue filtresi var mı?',
        a: 'AdBlue kullanan binek ve hafif ticari araçlarda da filtre bulunur; ancak çoğu modelde filtre depo ve pompa modülünün içindedir ve ayrı değiştirilemeyebilir. Ayrıntı için aracınızın servis bilgisine bakın.',
      },
    ],
  },
  {
    slug: 'opel-astra-filtre-rehberi',
    title: 'Opel Astra Filtre Rehberi: Yağ, Hava, Polen ve Yakıt Filtresi Kodları',
    metaTitle: 'Opel Astra Filtre Kodları | Oto Center Market',
    summary:
      'Opel Astra H, J, K ve L için motor bazında MANN-FILTER ve FILTRON yağ, hava, polen ve yakıt filtresi kodları. Benzinli, CDTI dizel ve plug-in hibrit motorlar.',
    tag: 'Model rehberi',
    readMinutes: 8,
    relatedHref: '/otomobil/opel',
    relatedLabel: 'Opel modellerine göz atın',
    guncelleme: '2026-10-20',
    ilgiliYazilar: ['toyota-corolla-filtre-rehberi', 'ford-focus-filtre-rehberi'],
    intro: [
      'Opel Astra’da filtre seçimi nesle ve motora göre değişir: aynı nesilde 1.4 benzinli ile 1.7 CDTI dizel farklı yağ, hava ve yakıt filtresi kullanır. Polen filtresi ise her nesilde tüm motorlarda ortaktır. Aşağıdaki tablolar Astra H, J, K ve L için katalogdaki uyumluluk verisinden hazırlandı; her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır.',
      'Tablolar hızlı başvuru içindir. Kesin seçim için [Opel modelleri](/otomobil/opel "Opel yedek parça") arasından Astra neslinizi ve motorunuzu seçin; yalnızca o motora uyumlu ürünler listelenir.',
    ],
    body: [
      {
        heading: 'Neslinizi ve motorunuzu nasıl anlarsınız?',
        paragraphs: [
          'Nesli ruhsattaki model yılından tahmin edebilirsiniz; nesil geçiş yıllarında iki nesil bir süre birlikte satılmıştır. Motor hacmi ve gücü ruhsatta yazar. Motor adındaki CDTI dizel, Turbo turbo benzinli, 16V atmosferik benzinli motoru, Plug-In-Hybrid ise şarj edilebilir hibrit versiyonu gösterir.',
          'Aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Bu durumda eski filtrenin üzerindeki kodu kontrol edin ya da siparişten önce şasi numaranızla bize sorun.',
        ],
      },
      {
        heading: 'Astra L filtre kodları',
        paragraphs: [
          'Astra L (yaklaşık 2021 ve sonrası) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Astra L sayfasında](/otomobil/opel/astra-l "Opel Astra L yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Opel Astra L — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'W 7058', 'OP 540/1', '1.2 110 HP, 1.2 131 HP'],
            ['Yağ', 'HU 711/51 x', 'OE 673', '1.6 Plug-In-Hybrid 181 HP, 1.6 Plug-In-Hybrid 224 HP'],
            ['Yağ', 'HU 7032 z', 'OE 667/6', '1.5 Turbo Diesel 131 HP'],
            ['Hava', 'C 36 007 KIT', 'AP 196/2', '1.2 110 HP, 1.2 131 HP'],
            ['Hava', 'C 36 003', 'AP 196/4', '1.6 Plug-In-Hybrid 181 HP, 1.6 Plug-In-Hybrid 224 HP'],
            ['Hava', 'C 24 036', 'AP 196/9', '1.5 Turbo Diesel 131 HP'],
            ['Polen / kabin', 'CU 26 014-2', 'K 1328-2x, K 1328A-2x', 'Bu nesildeki tüm motorlar'],
            ['Yakıt', '—', 'PE 816/6', '1.5 Turbo Diesel 131 HP'],
          ],
        },
      },
      {
        heading: 'Astra K filtre kodları',
        paragraphs: [
          'Astra K (yaklaşık 2015–2021) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Astra K sayfasında](/otomobil/opel/astra-k "Opel Astra K yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Opel Astra K — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'HU 6019 z', 'OE 648/9', '1.6 CDTI 95 HP, 1.6 CDTI 110 HP, 1.6 CDTI 136 HP, 1.6 CDTI 150 HP, 1.6 CDTI 160 HP'],
            ['Yağ', 'W 7056', 'OP 570/2', '1.2 Turbo 110 HP, 1.2 Turbo 131 HP, 1.2 Turbo 145 HP, 1.4 101 HP'],
            ['Yağ', 'HU 6018 z', '—', '1.6 Turbo 200 HP'],
            ['Hava', 'C 16 012', '—', '1.4 101 HP, 1.6 CDTI 95 HP, 1.6 CDTI 110 HP, 1.6 CDTI 136 HP, 1.6 CDTI 150 HP, 1.6 CDTI 160 HP, 1.6 Turbo 200 HP'],
            ['Hava', '—', 'AK 375/1', '1.6 CDTI 95 HP, 1.6 CDTI 110 HP, 1.6 CDTI 136 HP, 1.6 CDTI 150 HP, 1.6 CDTI 160 HP'],
            ['Hava', '—', 'AK 375', '1.4 101 HP, 1.6 Turbo 200 HP'],
            ['Hava', 'C 24 077', '—', '1.5 105 HP, 1.5 122 HP'],
            ['Polen / kabin', 'CUK 24 003', 'K 1343A', 'Bu nesildeki tüm motorlar'],
            ['Polen / kabin', 'FP 24 003', 'K 1343', '1.2 Turbo 110 HP, 1.2 Turbo 131 HP, 1.2 Turbo 145 HP, 1.4 Turbo 145 HP, 1.5 105 HP, 1.5 122 HP'],
            ['Yakıt', 'PU 9012 z', '—', '1.6 CDTI 95 HP, 1.6 CDTI 110 HP, 1.6 CDTI 136 HP, 1.6 CDTI 150 HP, 1.6 CDTI 160 HP'],
            ['Yakıt', 'PU 9012/1 z', 'PE 982/4', '1.5 105 HP, 1.5 122 HP'],
          ],
        },
      },
      {
        heading: 'Astra J filtre kodları',
        paragraphs: [
          'Astra J (yaklaşık 2009–2015) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Astra J sayfasında](/otomobil/opel/astra-j-astra-j-gtc "Opel Astra J yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Opel Astra J — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'HU 612/2 x', 'OE 648/6', '1.4 16V 87 HP, 1.4 16V 100 HP, 1.4 16V Turbo 120 HP, 1.4 16V Turbo 140 HP, 1.6 16V 115 HP, 1.6 16V Turbo 180 HP'],
            ['Yağ', '—', 'OE 682/1', '1.3 CDTi 95 HP, 2.0 CDTi 131 HP, 2.0 CDTi 160 HP, 2.0 CDTi 165 HP, 2.0 CDTi BiTurbo 195 HP'],
            ['Yağ', 'HU 820/1 y', 'OE 648/8', '1.7 CDTi 101 HP, 1.7 CDTi 110 HP, 1.7 CDTi 125 HP, 1.7 CDTi 131 HP'],
            ['Yağ', 'HU 6019 z', 'OE 648/9', '1.6 CDTI 110 HP, 1.6 CDTI 136 HP'],
            ['Hava', 'C 27 107', '—', '1.3 CDTi 95 HP, 1.4 16V Turbo 120 HP, 1.4 16V Turbo 140 HP, 1.6 16V Turbo 180 HP, 1.6 CDTI 110 HP, 1.6 CDTI 136 HP, 1.7 CDTi 101 HP, 1.7 CDTi 110 HP, 1.7 CDTi 125 HP, 1.7 CDTi 131 HP, 2.0 CDTi 131 HP, 2.0 CDTi 160 HP, 2.0 CDTi 165 HP, 2.0 CDTi BiTurbo 195 HP'],
            ['Hava', 'C 26 106, C 26 108', 'AP 051/8, AP 051/9', '1.4 16V 87 HP, 1.4 16V 100 HP, 1.6 16V 115 HP'],
            ['Hava', '—', 'AP 051/7', '2.0 CDTi 131 HP'],
            ['Polen / kabin', 'CU 2442, CUK 2442, FP 2442', 'K 1223, K 1223A', 'Bu nesildeki tüm motorlar'],
            ['Yakıt', 'PU 9001/1 x', 'PE 982/1', '1.3 CDTi 95 HP, 1.6 CDTI 110 HP, 1.6 CDTI 136 HP, 1.7 CDTi 101 HP, 1.7 CDTi 110 HP, 1.7 CDTi 125 HP, 1.7 CDTi 131 HP, 2.0 CDTi 131 HP, 2.0 CDTi 160 HP, 2.0 CDTi 165 HP, 2.0 CDTi BiTurbo 195 HP'],
          ],
        },
      },
      {
        heading: 'Astra H filtre kodları',
        paragraphs: [
          'Astra H (yaklaşık 2004–2010) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Astra H sayfasında](/otomobil/opel/astra-h-astra-h-gtc "Opel Astra H yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Opel Astra H — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'HU 612/2 x', 'OE 648/6', '1.2 16V 80 HP, 1.4 16V 75 HP, 1.4 16V 90 HP, 1.6 16V 115 HP, 1.6 16V Turbo 180 HP, 1.8 16V 140 HP'],
            ['Yağ', 'W 712/75', 'OP 570/1', '1.6 16V 105 HP, 1.8 16V 125 HP, 2.0 16V Turbo 170 HP, 2.0 16V Turbo 200 HP'],
            ['Yağ', 'HU 712/8 x', 'OE 648', '1.2 16V 80 HP, 1.4 16V 75 HP, 1.4 16V 90 HP'],
            ['Yağ', 'HU 711/4 x', 'OE 648/5', '1.9 CDTI 100 HP, 1.9 CDTI 120 HP, 1.9 CDTI 150 HP'],
            ['Yağ', 'HU 820/1 y', 'OE 648/8', '1.7 CDTI 110 HP, 1.7 CDTI 125 HP'],
            ['Yağ', 'HU 820 x', 'OE 648/4', '1.7 CDTI 80 HP, 1.7 CDTI 100 HP'],
            ['Yağ', 'HU 712/7 x, HU 713/1 x', 'OE 670, OE 682', '1.3 CDTI 90 HP'],
            ['Hava', 'C 30 130', 'AP 051', '1.2 16V 80 HP, 1.4 16V 75 HP, 1.4 16V 90 HP, 1.6 16V 105 HP, 1.6 16V 115 HP, 1.8 16V 125 HP, 1.8 16V 140 HP, 2.0 16V Turbo 170 HP, 2.0 16V Turbo 200 HP'],
            ['Hava', 'C 30 138', 'AP 051/6', '1.6 16V Turbo 180 HP, 1.7 CDTI 110 HP, 1.7 CDTI 125 HP, 1.9 CDTI 100 HP, 1.9 CDTI 120 HP, 1.9 CDTI 150 HP'],
            ['Hava', 'C 30 130/2', 'AP 051/4', '1.3 CDTI 90 HP, 1.7 CDTI 80 HP, 1.7 CDTI 100 HP'],
            ['Polen / kabin', 'CU 3054, CUK 3054', 'K 1014', 'Bu nesildeki tüm motorlar'],
            ['Polen / kabin', 'FP 3054', '—', '1.6 16V 115 HP'],
            ['Yakıt', 'PU 723 x', 'PE 982', '1.3 CDTI 90 HP, 1.9 CDTI 100 HP, 1.9 CDTI 120 HP, 1.9 CDTI 150 HP'],
            ['Yakıt', 'PU 8013 z', 'PE 936/1', '1.7 CDTI 80 HP, 1.7 CDTI 100 HP, 1.7 CDTI 110 HP, 1.7 CDTI 125 HP'],
          ],
        },
      },
    ],
    sss: [
      {
        q: 'Opel Astra J 1.4 Turbo yağ filtresi kodu nedir?',
        a: 'Katalogdaki uyumluluk verisine göre Astra J 1.4 Turbo (120 ve 140 HP) motorlarda MANN-FILTER HU 612/2 x ve FILTRON OE 648/6 yağ filtresi kullanılır. Kesin seçim için motorunuzu sitede seçerek doğrulayın.',
      },
      {
        q: 'Opel Astra K 1.6 CDTI yağ filtresi kodu nedir?',
        a: 'Astra K 1.6 CDTI motorlarda katalogda MANN-FILTER HU 6019 z ve FILTRON OE 648/9 kayıtlıdır. Aynı filtre Astra J’nin 1.6 CDTI motorlarında da görünür.',
      },
      {
        q: 'Astra H 1.7 CDTI yağ filtresi hangisi?',
        a: 'Motor gücüne göre değişir: katalogda Astra H 1.7 CDTI 80 ve 100 HP için MANN-FILTER HU 820 x ve FILTRON OE 648/4, 110 ve 125 HP için MANN-FILTER HU 820/1 y ve FILTRON OE 648/8 kayıtlıdır.',
      },
      {
        q: 'Astra J polen filtresi bütün motorlarda aynı mı?',
        a: 'Evet. Katalogda Astra J’nin tüm motorları için MANN-FILTER CU 2442 (aktif karbonlu CUK 2442, FreciousPlus FP 2442) ve FILTRON K 1223 (aktif karbonlu K 1223A) kayıtlıdır.',
      },
    ],
  },
  {
    slug: 'yag-filtresi-sizdiriyor',
    title: 'Yağ Filtresi Yağ Sızdırıyor: Sebepleri ve Çözümü',
    metaTitle: 'Yağ Filtresinden Yağ Sızıyor: Sebepleri | Oto Center Market',
    summary:
      'Yağ filtresinden yağ sızmasının en sık sebepleri: üst üste binmiş eski conta, yanlış sıkma, yanlış filtre ve hasarlı kapak. Kaçağın gerçekten filtreden gelip gelmediğini nasıl anlarsınız?',
    tag: 'Arıza',
    readMinutes: 4,
    relatedHref: '/filtreler/yag-filtreleri',
    relatedLabel: 'Yağ filtrelerine göz atın',
    guncelleme: '2026-10-21',
    ilgiliYazilar: ['yag-filtresi-nasil-degistirilir', 'yag-lambasi-yaniyor-ne-yapmali'],
    intro: [
      'Yağ filtresinden yağ sızmasının en sık sebebi, değişimde eski filtrenin contasının motor üzerinde kalması ve yeni contayla üst üste binmesidir. Bunu yanlış sıkma (çok gevşek ya da aşırı sıkı), contaya yağ sürülmemesi, motora uygun olmayan filtre takılması ve kartuş tipinde yenilenmeyen O-ring izler. Yağ değişiminden hemen sonra başlayan kaçak neredeyse her zaman montajla ilgilidir.',
      'Filtre çevresinde belirgin yağ akıntısı varsa ve yağ seviyesi hızla düşüyorsa aracı kullanmayın; yağ basıncı düşerse motor zarar görebilir. Aracınıza uygun filtreyi [yağ filtreleri kategorisinde](/filtreler/yag-filtreleri "Yağ filtrelerini görüntüle") bulabilirsiniz.',
    ],
    body: [
      {
        heading: 'Kaçak gerçekten filtreden mi geliyor?',
        paragraphs: [
          'Motorun alt kısmında görülen yağ her zaman filtreden gelmez. Yağ yerçekimiyle aşağı aktığı için kaçağın kaynağı genellikle ıslak bölgenin en üst noktasıdır. Filtre çevresini temizleyip motoru birkaç dakika çalıştırdıktan sonra tekrar bakmak, kaynağı bulmanın en kolay yoludur.',
        ],
        list: [
          'Filtrenin conta hizasında taze yağ varsa: kaçak büyük ihtimalle filtreden.',
          'Filtrenin üzerinden aşağı yağ akıyorsa: kaynak daha yukarıda olabilir (külbütör kapağı, yağ soğutucusu, yağ basınç müşürü).',
          'Karter tapası çevresi ıslaksa: tapa contası yenilenmemiş ya da tapa gevşek olabilir.',
          'Karter ile motor bloğu birleşiminde yağ varsa: karter contası ya da sızdırmazlık macunu.',
        ],
      },
      {
        heading: 'Yağ filtresinden sızıntının sebepleri',
        paragraphs: [],
        list: [
          'Çift conta: eski filtrenin contası motor üzerinde yapışık kalmıştır. Yeni filtre bunun üzerine takıldığında yağ basıncıyla kaçırır, hatta conta dışarı fırlayabilir.',
          'Gevşek filtre: conta yeterince bastırılmamıştır.',
          'Aşırı sıkılmış filtre: conta ezilir ya da yerinden kayar.',
          'Contaya yağ sürülmemesi: kuru conta sıkılırken burulur ve düzgün oturmaz.',
          'Yanlış filtre: dişi ya da conta çapı aynı görünen ama motora uygun olmayan filtre tam oturmaz.',
          'Kartuş tipinde eski O-ring: kapak contası yenilenmemiş, yanlış oturmuş ya da kapak çatlamıştır.',
          'Hasarlı filtre gövdesi: taş çarpması ya da sökme sırasında ezilen gövde.',
        ],
      },
      {
        heading: 'Ne yapmalı?',
        paragraphs: [],
        steps: [
          'Motoru durdurun ve yağ seviyesini kontrol edin; eksikse uygun yağla tamamlayın.',
          'Kaçak az ve yeni değişim yapıldıysa filtreyi söküp motor üzerindeki oturma yüzeyine bakın; eski conta kalmışsa çıkarın.',
          'Yeni filtrenin contasına ince bir kat yağ sürün ve filtreyi üzerindeki talimata göre (spin-on filtrelerde genellikle conta değdikten sonra yaklaşık 3/4 tur) elle sıkın.',
          'Kartuş tipinde kapağın O-ringini yenisiyle değiştirin ve kapağı servis bilgisindeki torkla sıkın.',
          'Motoru çalıştırıp birkaç dakika sonra filtre çevresini kontrol edin. Kaçak sürüyorsa filtre kodunun motorunuza uygun olup olmadığını kontrol edin ya da servise başvurun.',
        ],
      },
    ],
    sss: [
      {
        q: 'Yağ değişiminden sonra yağ filtresi neden sızdırır?',
        a: 'En sık sebep eski filtre contasının motor üzerinde kalıp yeni contayla üst üste binmesidir. Gevşek ya da aşırı sıkılmış filtre ve yağlanmamış conta da sık görülen sebeplerdir.',
      },
      {
        q: 'Yağ filtresi sızdırırken araç kullanılır mı?',
        a: 'Küçük bir terleme kısa mesafe için risk oluşturmayabilir, ancak damlama ya da akıntı varsa aracı kullanmayın. Yağ seviyesi düşerse yağ basıncı azalır ve motor zarar görebilir.',
      },
      {
        q: 'Yağ filtresi sıkıştırılırsa kaçak durur mu?',
        a: 'Gevşek filtrede durabilir; ancak kaçağın sebebi çift conta, ezilmiş conta ya da yanlış filtreyse daha fazla sıkmak sorunu büyütür. Filtreyi söküp contayı ve oturma yüzeyini kontrol etmek daha doğrudur.',
      },
    ],
  },
  {
    slug: 'lpg-li-araclarda-bakim-ve-filtreler',
    title: 'LPG’li Araçlarda Bakım: Hangi Filtreler Değişir, Nelere Dikkat Edilir?',
    metaTitle: 'LPG’li Araç Bakımı ve Filtreler | Oto Center Market',
    summary:
      'LPG’li araçlarda motor filtrelerine ek olarak LPG gaz faz filtresi de bakım ister. Hava ve yağ filtresinin LPG’li araçta neden daha önemli olduğu, buji ve LPG sistemi kontrolleri.',
    tag: 'Bakım',
    readMinutes: 5,
    relatedHref: '/filtreler',
    relatedLabel: 'Tüm filtreleri görün',
    guncelleme: '2026-10-21',
    ilgiliYazilar: ['periyodik-bakimda-hangi-filtreler-degisir', 'hava-filtresi-ne-zaman-degisir'],
    intro: [
      'LPG’li araçlarda normal motor bakımına (yağ, yağ filtresi, hava filtresi, polen filtresi) ek olarak LPG sisteminin kendi filtreleri de değiştirilir. En yaygın olanı, buharlaştırıcı (regülatör) ile enjektörler arasındaki gaz faz filtresidir; bazı sistemlerde sıvı faz filtresi de bulunur. Bu filtrelerin değişim aralığını LPG sisteminin üreticisi belirler ve genellikle LPG servisindeki periyodik bakımda değiştirilir.',
      'LPG ile çalışan motor, yanma koşulları nedeniyle hava filtresine ve ateşleme sistemine benzine göre daha duyarlıdır. Bu yüzden motor filtrelerini aksatmamak LPG’li araçta daha da önemlidir. Aracınıza uygun motor filtrelerini [filtreler kategorisinde](/filtreler "Filtreleri görüntüle") bulabilirsiniz.',
    ],
    body: [
      {
        heading: 'LPG’li araçta değişen filtreler',
        paragraphs: [],
        table: {
          caption: 'LPG’li araçlarda bakımda değişen başlıca filtreler',
          head: ['Filtre', 'Görevi', 'Nerede değişir?'],
          rows: [
            ['Motor yağ filtresi', 'Motor yağını temizler', 'Her yağ değişiminde'],
            ['Hava filtresi', 'Motora giren havayı temizler; LPG karışımı için önemlidir', 'Motor bakımında'],
            ['Polen filtresi', 'Kabin havasını temizler', 'Motor bakımında'],
            ['Yakıt (benzin) filtresi', 'Benzini temizler; araç benzinle de çalıştığı için gereklidir', 'Araç üreticisinin aralığında'],
            ['LPG gaz faz filtresi', 'Buharlaşmış LPG’deki partikülleri ve yağlı kalıntıları tutar', 'LPG servisinde'],
            ['LPG sıvı faz filtresi', 'Sıvı LPG’yi buharlaştırıcıya girmeden süzer (sisteme göre)', 'LPG servisinde'],
          ],
        },
      },
      {
        heading: 'Hava filtresi LPG’li araçta neden daha önemli?',
        paragraphs: [
          'LPG sistemi, motora giren hava miktarına göre gaz püskürtür. Tıkalı bir hava filtresi karışımı bozabilir; bu da performans düşüşü, rölantide düzensizlik ve yakıt tüketiminde artış olarak görülebilir. LPG’li araçta hava filtresini kontrol aralığını aksatmadan değiştirmek iyi bir uygulamadır. Ayrıntılar için [hava filtresi yazımıza](/blog/hava-filtresi-ne-zaman-degisir "Hava filtresi ne zaman değişir") bakabilirsiniz.',
        ],
      },
      {
        heading: 'LPG’li araçta diğer bakım noktaları',
        paragraphs: [],
        list: [
          'Bujiler: LPG’de ateşleme için daha yüksek voltaj gerektiği için bujiler daha çabuk yıpranabilir. Tekleme ya da geçişte sarsıntı varsa bujileri kontrol ettirin.',
          'Supap ayarı: Bazı motorlarda LPG kullanımı supap ayarının daha sık kontrol edilmesini gerektirebilir. Motorunuz için önerilen kontrol aralığını LPG servisinize sorun.',
          'Soğutma sıvısı: Buharlaştırıcı motorun soğutma suyuyla ısınır; soğutma sıvısı eksikse LPG geçişinde sorun yaşanabilir.',
          'Kaçak kontrolü: Gaz kokusu alırsanız aracı kullanmayın, LPG vanasını kapatın ve servise başvurun.',
          'Benzin deposu: Araç her çalıştırmada kısa süre benzinle çalıştığı için depoda bir miktar benzin bulundurun.',
          'Tank ve sistem kontrolü: LPG tankının ve sistemin yasal kontrollerini ve muayene gerekliliklerini takip edin.',
        ],
      },
      {
        heading: 'LPG filtresini nereden alırım?',
        paragraphs: [
          'LPG gaz faz ve sıvı faz filtreleri LPG sisteminin markasına ve modeline özeldir. Doğru filtreyi LPG kitinizi bilen servisinizden temin etmeniz en güvenli yoldur. Sitemizde LPG’li motorlar için motor yağ, hava, polen ve yakıt filtrelerini bulabilirsiniz; aracınızı seçerken motor listesinde LPG ibaresi geçen versiyonları da görebilirsiniz.',
        ],
      },
    ],
    sss: [
      {
        q: 'LPG filtresi kaç km’de değişir?',
        a: 'Değişim aralığını LPG sisteminin üreticisi belirler ve genellikle LPG servisindeki periyodik bakımda değiştirilir. Kesin aralık için sisteminizin bakım kartına bakın.',
      },
      {
        q: 'LPG’li araçta yağ filtresi farklı mı?',
        a: 'Hayır, yağ filtresi aracın motoruna göre seçilir; LPG takılı olması filtre kodunu değiştirmez. Önemli olan yağ ve yağ filtresinin bakım aralığında değişmesidir.',
      },
      {
        q: 'LPG’li araçta hava filtresi değişmezse ne olur?',
        a: 'Tıkalı hava filtresi LPG karışımını bozabilir; performans düşüşü, rölantide düzensizlik ve tüketim artışı görülebilir. Hava filtresini bakım aralığında değiştirmek LPG’li araçta özellikle önemlidir.',
      },
    ],
  },
  {
    slug: 'dacia-duster-filtre-rehberi',
    title: 'Dacia Duster Filtre Rehberi: Yağ, Hava, Polen ve Yakıt Filtresi Kodları',
    metaTitle: 'Dacia Duster Filtre Kodları | Oto Center Market',
    summary:
      'Dacia Duster I ve Duster II için motor bazında MANN-FILTER ve FILTRON yağ, hava, polen ve yakıt filtresi kodları. 1.5 dCi, 1.0 ve 1.3 TCe, 1.6 benzinli ve LPG’li motorlar.',
    tag: 'Model rehberi',
    readMinutes: 6,
    relatedHref: '/otomobil/dacia',
    relatedLabel: 'Dacia modellerine göz atın',
    guncelleme: '2026-10-21',
    ilgiliYazilar: ['renault-clio-megane-filtre-rehberi', 'lpg-li-araclarda-bakim-ve-filtreler'],
    intro: [
      'Dacia Duster’da filtre seçimi motora göre değişir: 1.5 dCi dizel, 1.0 ve 1.3 TCe turbo benzinli ve 1.6 benzinli motorlar farklı yağ ve yakıt filtresi kullanır. Duster, Renault grubuyla ortak motorlar kullandığı için kodların bir kısmı Clio ve Mégane ile aynıdır. Aşağıdaki tablolar Duster I ve Duster II için katalogdaki uyumluluk verisinden hazırlandı; her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır.',
      'Tablolar hızlı başvuru içindir. Kesin seçim için [Dacia modelleri](/otomobil/dacia "Dacia yedek parça") arasından Duster neslinizi ve motorunuzu seçin; yalnızca o motora uyumlu ürünler listelenir.',
    ],
    body: [
      {
        heading: 'Neslinizi ve motorunuzu nasıl anlarsınız?',
        paragraphs: [
          'Duster I yaklaşık 2010–2017, Duster II yaklaşık 2017 sonrası üretilmiştir. Motor hacmi ve gücü ruhsatta yazar. Motor adındaki dCi dizel, TCe turbo benzinli, SCe ve 16V atmosferik benzinli motoru gösterir; LPG ibaresi fabrika çıkışlı LPG’li versiyonları anlatır.',
          'Aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Bu durumda eski filtrenin üzerindeki kodu kontrol edin ya da siparişten önce şasi numaranızla bize sorun.',
        ],
      },
      {
        heading: 'Duster II filtre kodları',
        paragraphs: [
          'Duster II (yaklaşık 2017–2024) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Duster II sayfasında](/otomobil/dacia/duster-ii "Dacia Duster II yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Dacia Duster II — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'HU 10 002 z', '—', '1.0 LPG 101 HP, 1.0 TCe 100 101 HP, 1.0 TCe 90 91 HP, 1.0 TCe LPG 91 HP, 1.2 TCe 125 125 HP, 1.3 TCe 130 HP, 1.3 TCe 150 150 HP'],
            ['Yağ', '—', 'OE 666/3', '1.0 LPG 101 HP, 1.0 TCe 100 101 HP, 1.0 TCe 90 91 HP, 1.0 TCe LPG 91 HP, 1.3 TCe 130 HP, 1.3 TCe 150 150 HP'],
            ['Yağ', 'W 7032', 'OP 643/5', '1.5 dCi 110 109 HP, 1.5 dCi 90 90 HP'],
            ['Yağ', 'HU 618 y', 'OE 666/4', '1.5 dCi 115 114 HP'],
            ['Yağ', 'W 6025', 'OP 643/6', '1.6 SCe 115 114 HP'],
            ['Hava', 'C 27 030', '—', '1.0 LPG 101 HP, 1.0 TCe 100 101 HP, 1.2 TCe 125 125 HP, 1.3 TCe 130 HP, 1.3 TCe 150 150 HP, 1.5 Blue dCi 115 HP, 1.5 Blue dCi 95 95 HP, 1.5 dCi 110 109 HP, 1.5 dCi 115 114 HP, 1.5 dCi 90 90 HP, 1.6 SCe 115 114 HP'],
            ['Polen / kabin', 'CU 22 011, CUK 22 011, FP 22 011', '—', 'Bu nesildeki tüm motorlar'],
            ['Polen / kabin', '—', 'K 1321', '1.0 LPG 101 HP, 1.0 TCe 100 101 HP, 1.0 TCe 90 91 HP, 1.0 TCe LPG 91 HP, 1.3 TCe 130 HP, 1.5 dCi 115 114 HP'],
            ['Yakıt', 'PU 9011 z KIT', 'PE 815/7', '1.5 Blue dCi 115 HP, 1.5 Blue dCi 95 95 HP, 1.5 dCi 110 109 HP, 1.5 dCi 90 90 HP'],
          ],
        },
      },
      {
        heading: 'Duster I filtre kodları',
        paragraphs: [
          'Duster I (yaklaşık 2010–2017) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Duster I sayfasında](/otomobil/dacia/duster-i "Dacia Duster I yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Dacia Duster I — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'W 7032, W 79', 'OP 643/4, OP 643/5', '1.5 dCi 86 HP, 1.5 dCi 90 HP, 1.5 dCi 107 HP, 1.5 dCi 109 HP, 1.5 dCi 110 HP'],
            ['Yağ', 'W 75/3', 'OP 643/3', '1.6 16V 105 HP, 1.6 16V LPG 100 HP, 2.0 16V 135 HP, 2.0 16V 143 HP'],
            ['Yağ', 'HU 10 002 z', 'OE 666/3', '1.2 TCe 125 125 HP'],
            ['Yağ', 'W 6025', 'OP 643/6', '1.6 SCe 115 114 HP'],
            ['Hava', 'C 27 030', '—', '1.2 TCe 125 125 HP, 1.5 dCi 90 HP, 1.5 dCi 107 HP, 1.5 dCi 109 HP, 1.5 dCi 110 HP, 1.6 SCe 115 114 HP'],
            ['Hava', 'C 27 010', 'AP 134/9', '1.5 dCi 90 HP, 1.5 dCi 107 HP, 1.5 dCi 109 HP, 1.5 dCi 110 HP'],
            ['Hava', 'C 1858/2', 'AP 185/1', '1.6 16V 105 HP, 1.6 16V LPG 100 HP, 2.0 16V 135 HP, 2.0 16V 143 HP'],
            ['Hava', 'C 3875, C 3875/1', 'AP 134/4, AP 134/6', '1.5 dCi 86 HP'],
            ['Polen / kabin', 'CU 1829, CUK 1829', '—', '1.2 TCe 125 125 HP, 1.5 dCi 109 HP, 1.6 16V 105 HP, 1.6 16V LPG 100 HP, 1.6 SCe 115 114 HP, 2.0 16V 135 HP, 2.0 16V 143 HP'],
            ['Yakıt', 'WK 6002', 'PP 831/1', '1.2 TCe 125 125 HP, 1.6 16V 105 HP, 1.6 16V LPG 100 HP, 1.6 SCe 115 114 HP, 2.0 16V 135 HP, 2.0 16V 143 HP'],
            ['Yakıt', 'PU 9011 z KIT, WK 8039', 'PE 815/7, PP 988/3', '1.5 dCi 86 HP, 1.5 dCi 90 HP, 1.5 dCi 107 HP, 1.5 dCi 109 HP, 1.5 dCi 110 HP'],
          ],
        },
      },
    ],
    sss: [
      {
        q: 'Dacia Duster 1.5 dCi yağ filtresi kodu nedir?',
        a: 'Katalogdaki uyumluluk verisine göre Duster 1.5 dCi 90 ve 110 HP motorlarda MANN-FILTER W 7032 ve FILTRON OP 643/5 kayıtlıdır; Duster II 1.5 dCi 115 HP’de ise MANN-FILTER HU 618 y ve FILTRON OE 666/4 görünür. Kesin seçim için motorunuzu sitede seçerek doğrulayın.',
      },
      {
        q: 'Duster 1.0 TCe yağ filtresi kodu nedir?',
        a: 'Duster II 1.0 TCe (LPG’li versiyonlar dahil) motorlarda katalogda MANN-FILTER HU 10 002 z ve FILTRON OE 666/3 kayıtlıdır. Aynı filtre 1.3 TCe motorlarda da kullanılır.',
      },
      {
        q: 'Duster II polen filtresi kodu nedir?',
        a: 'Katalogda Duster II’nin tüm motorları için MANN-FILTER CU 22 011 (aktif karbonlu CUK 22 011, FreciousPlus FP 22 011) kayıtlıdır. Aynı kod Clio V’te de kullanılır.',
      },
    ],
  },
  {
    slug: 'hyundai-i20-filtre-rehberi',
    title: 'Hyundai i20 Filtre Rehberi: Yağ, Hava, Polen ve Yakıt Filtresi Kodları',
    metaTitle: 'Hyundai i20 Filtre Kodları | Oto Center Market',
    summary:
      'Hyundai i20’nin üç nesli için motor bazında MANN-FILTER ve FILTRON yağ, hava, polen ve yakıt filtresi kodları. 1.0 T-GDI, 1.2, 1.4 MPI ve CRDi dizel motorlar.',
    tag: 'Model rehberi',
    readMinutes: 5,
    relatedHref: '/otomobil/hyundai',
    relatedLabel: 'Hyundai modellerine göz atın',
    guncelleme: '2026-10-21',
    ilgiliYazilar: ['dacia-duster-filtre-rehberi', 'aktif-karbonlu-polen-filtresi-farki'],
    intro: [
      'Hyundai i20’de hava ve polen filtresi her nesilde tüm motorlarda ortaktır; yağ filtresi ise motora göre değişir. Örneğin i20 III’te 1.0 T-GDI ve 1.4 MPI motorlar aynı yağ filtresini kullanırken 1.2 motor farklı bir filtre kullanır. Aşağıdaki tablolar i20’nin üç nesli için katalogdaki uyumluluk verisinden hazırlandı; her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır.',
      'Tablolar hızlı başvuru içindir. Kesin seçim için [Hyundai modelleri](/otomobil/hyundai "Hyundai yedek parça") arasından i20 neslinizi ve motorunuzu seçin; yalnızca o motora uyumlu ürünler listelenir.',
    ],
    body: [
      {
        heading: 'Neslinizi ve motorunuzu nasıl anlarsınız?',
        paragraphs: [
          'i20’nin ilk nesli yaklaşık 2008–2014, ikinci nesli yaklaşık 2014–2020, üçüncü nesli (BC3) yaklaşık 2020 sonrası üretilmiştir. Motor hacmi ve gücü ruhsatta yazar. Motor adındaki CRDi dizel, T-GDI turbo benzinli, MPI atmosferik benzinli motoru gösterir; Hybrid 48V hafif hibrit versiyonu anlatır.',
          'Aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Bu durumda eski filtrenin üzerindeki kodu kontrol edin ya da siparişten önce şasi numaranızla bize sorun.',
        ],
      },
      {
        heading: 'i20 III filtre kodları',
        paragraphs: [
          'i20 III (yaklaşık 2020 ve sonrası) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [i20 III sayfasında](/otomobil/hyundai/i20-iii-bc3 "Hyundai i20 III yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Hyundai i20 III — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'W 7023', 'OP 595/2', '1.0 T-GDI 101 HP, 1.0 T-GDI Hybrid 48V 101 HP, 1.0 T-GDI Hybrid 48V 120 HP, 1.4 MPI 101 HP'],
            ['Yağ', 'W 811/80', 'OP 617', '1.2 84 HP'],
            ['Hava', 'C 25 002', 'AP 197/2', 'Bu nesildeki tüm motorlar'],
            ['Polen / kabin', 'CUK 24 013', 'K 1314A', 'Bu nesildeki tüm motorlar'],
          ],
        },
      },
      {
        heading: 'i20 II filtre kodları',
        paragraphs: [
          'i20 II (yaklaşık 2014–2020) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [i20 II sayfasında](/otomobil/hyundai/i20-ii "Hyundai i20 II yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Hyundai i20 II — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'W 610/7', 'OP 575', '1.2 LPG 75 HP'],
            ['Yağ', 'W 7023', 'OP 595/2', '1.4 101 HP'],
            ['Yağ', 'HU 7001 x', 'OE 674/5', '1.4 CRDi 90 HP'],
            ['Hava', 'C 25 002', 'AP 197/2', 'Bu nesildeki tüm motorlar'],
            ['Polen / kabin', 'CUK 24 013', 'K 1314A', 'Bu nesildeki tüm motorlar'],
          ],
        },
      },
      {
        heading: 'i20 I filtre kodları',
        paragraphs: [
          'i20 I (yaklaşık 2008–2014) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [i20 I sayfasında](/otomobil/hyundai/i20 "Hyundai i20 I yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Hyundai i20 I — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'HU 7001 x', 'OE 674/5', '1.4 CRDi 75 HP, 1.4 CRDi 90 HP, 1.6 CRDi 116 HP'],
            ['Yağ', 'W 811/80', 'OP 617', '1.4 101 HP, 1.6 126 HP'],
            ['Hava', 'C 26 014', 'AP 107/7', 'Bu nesildeki tüm motorlar'],
            ['Polen / kabin', 'CU 25 008-2, CU 29 002-2', 'K 1257-2x, K 1357-2x', 'Bu nesildeki tüm motorlar'],
            ['Yakıt', 'WK 8019', 'PP 979/2', '1.4 CRDi 75 HP, 1.4 CRDi 90 HP, 1.6 CRDi 116 HP'],
          ],
        },
      },
    ],
    sss: [
      {
        q: 'Hyundai i20 1.4 benzinli yağ filtresi kodu nedir?',
        a: 'Katalogdaki uyumluluk verisine göre i20 II 1.4 ve i20 III 1.4 MPI motorlarda MANN-FILTER W 7023 ve FILTRON OP 595/2 kullanılır. İlk nesil i20’nin 1.4 benzinli motorunda ise MANN-FILTER W 811/80 ve FILTRON OP 617 kayıtlıdır.',
      },
      {
        q: 'i20 III 1.0 T-GDI yağ filtresi kodu nedir?',
        a: 'i20 III 1.0 T-GDI (48V hibrit versiyonlar dahil) motorlarda katalogda MANN-FILTER W 7023 ve FILTRON OP 595/2 kayıtlıdır.',
      },
      {
        q: 'i20 II ve i20 III polen filtresi aynı mı?',
        a: 'Katalogda iki nesil için de MANN-FILTER CUK 24 013 ve FILTRON K 1314A aktif karbonlu polen filtresi kayıtlıdır. Hava filtresi de iki nesilde aynıdır: MANN-FILTER C 25 002 ve FILTRON AP 197/2.',
      },
    ],
  },
  {
    slug: 'turbo-motor-bakimi-yag-ve-filtre',
    title: 'Turbo Motor Bakımı: Turbonun Ömrünü Uzatan Yağ ve Filtre Alışkanlıkları',
    metaTitle: 'Turbo Motor Bakımı: Yağ ve Filtre | Oto Center Market',
    summary:
      'Turbo motor motor yağıyla yağlanır ve soğur; bu yüzden yağın, yağ filtresinin ve hava filtresinin zamanında değişmesi turbonun ömrünü doğrudan etkiler. Turbo motorlu araçlar için bakım ve kullanım önerileri.',
    tag: 'Bakım',
    readMinutes: 5,
    relatedHref: '/filtreler/yag-filtreleri',
    relatedLabel: 'Yağ filtrelerine göz atın',
    guncelleme: '2026-10-22',
    ilgiliYazilar: ['motor-yagi-5w30-5w40-ne-demek', 'hava-filtresi-ne-zaman-degisir'],
    intro: [
      'Turboşarj, motor yağıyla yağlanan ve çok yüksek devirde dönen bir parçadır; bu yüzden turbonun ömrünü en çok yağın kalitesi ve temizliği belirler. Motor yağını ve yağ filtresini bakım aralığında değiştirmek, üreticinin istediği onaylı yağı kullanmak ve hava filtresini temiz tutmak turbo motor bakımının temelidir. Soğuk motoru yüksek devirde zorlamamak ve ağır kullanımdan sonra motoru kısa süre rölantide bekletmek de turboyu korur.',
      'Aracınıza uygun yağ filtresini [yağ filtreleri](/filtreler/yag-filtreleri "Yağ filtrelerini görüntüle"), hava filtresini [hava filtreleri](/filtreler/hava-filtreleri "Hava filtrelerini görüntüle") kategorisinde bulabilirsiniz.',
    ],
    body: [
      {
        heading: 'Turbo neden yağa bu kadar bağımlı?',
        paragraphs: [
          'Turbonun mili, egzoz gazıyla dönen türbin ve havayı sıkıştıran kompresör çarkını birbirine bağlar. Bu mil, ince bir yağ filmi üzerinde çok yüksek devirlerde döner. Egzoz tarafı çok ısındığı için yağ aynı zamanda turboyu soğutur.',
          'Kirlenmiş, eskimiş ya da yetersiz yağ bu ince yağ filminin bozulmasına, yataklarda aşınmaya ve yağ kanallarında karbonlaşmaya yol açabilir. Tıkanmış bir yağ filtresi ise bypass valfi açıldığında filtrelenmemiş yağın turboya ulaşmasına neden olabilir.',
        ],
      },
      {
        heading: 'Turbo motorda bakımda dikkat edilecekler',
        paragraphs: [],
        list: [
          'Motor yağı: aracınızın bakım kitapçığındaki viskozite ve üretici onayına uyan yağ kullanın; bakım aralığını aşmayın.',
          'Yağ filtresi: her yağ değişiminde motorunuza uygun kodla değiştirin. Ayrıntılar için [yağ filtresi yazımıza](/blog/yag-filtresi-ne-zaman-degisir "Yağ filtresi ne zaman değişir") bakabilirsiniz.',
          'Hava filtresi: turbo, hava filtresinden geçen havayı sıkıştırır. Yırtık ya da yanlış oturmuş filtreden geçen toz kompresör çarkına zarar verebilir.',
          'Emme hortumları ve bağlantılar: hava filtresi ile turbo arasındaki hortumlarda çatlak ya da gevşek kelepçe filtrelenmemiş hava emilmesine yol açar.',
          'Ağır kullanım: şehir içi kısa mesafe, yoğun trafik ve sık yüklü kullanımda bakım aralığını kısaltmak iyi bir uygulamadır.',
        ],
      },
      {
        heading: 'Kullanım alışkanlıkları',
        paragraphs: [],
        list: [
          'Motor soğukken yüksek devirde ve tam gazda sürmeyin; yağın ısınıp tüm kanallara ulaşmasını bekleyin.',
          'Otoyolda ya da yokuşta uzun süre zorlandıktan sonra motoru hemen kapatmayın; kısa süre rölantide ya da sakin sürüşle soğumasına izin verin.',
          'Yağ seviyesini düzenli kontrol edin; turbo motorlar bakım aralığında bir miktar yağ eksiltebilir.',
          'Gösterge panelinde yağ basıncı uyarısı yanarsa aracı hemen durdurun.',
        ],
      },
      {
        heading: 'Turbo arızasının belirtileri',
        paragraphs: [
          'Aşağıdaki belirtiler turbo ya da turbo besleme sisteminde sorun olabileceğini gösterir. Bunlar başka arızalarla da karışabileceği için bir servise kontrol ettirin:',
        ],
        list: [
          'Belirgin güç kaybı ve hızlanmada gecikme.',
          'Turbodan gelen ıslık ya da siren benzeri yeni bir ses.',
          'Egzozdan mavi duman ya da yağ eksilmesinde artış.',
          'Gösterge panelinde motor arıza lambası ve güç sınırlaması.',
        ],
      },
    ],
    sss: [
      {
        q: 'Turbo motorda yağ kaç km’de değişmeli?',
        a: 'Değişim aralığı araç üreticisine ve kullanılan yağa göre değişir; bakım kitapçığında yazar. Ağır şehir içi kullanımda ya da sık yüklü kullanımda aralığı kısaltmak turbo için faydalıdır.',
      },
      {
        q: 'Turbo motoru kapatmadan önce beklemek gerekir mi?',
        a: 'Normal sürüşten sonra uzun beklemeye gerek yoktur. Ancak otoyolda, yokuşta ya da yüklü olarak uzun süre zorlandıktan sonra motoru kısa süre rölantide bekletmek turbonun soğumasına yardımcı olur.',
      },
      {
        q: 'Hava filtresi turboya zarar verir mi?',
        a: 'Doğru takılmış sağlam bir hava filtresi turboyu korur. Yırtık, yanlış ölçüde ya da yerine tam oturmamış filtre ise tozun kompresör çarkına ulaşmasına ve aşınmaya neden olabilir.',
      },
    ],
  },
  {
    slug: 'hibrit-arac-bakimi-ve-filtreler',
    title: 'Hibrit Araç Bakımı: Hangi Filtreler Değişir, Nelere Dikkat Edilir?',
    metaTitle: 'Hibrit Araç Bakımı ve Filtreler | Oto Center Market',
    summary:
      'Hibrit araçlarda benzinli motor daha az çalışsa da yağ, yağ filtresi, hava ve polen filtresi bakımı sürer. Hibritlerde süreye bağlı bakımın önemi, batarya soğutma havası ve fren bakımı.',
    tag: 'Bakım',
    readMinutes: 5,
    relatedHref: '/filtreler',
    relatedLabel: 'Tüm filtreleri görün',
    guncelleme: '2026-10-22',
    ilgiliYazilar: ['toyota-corolla-filtre-rehberi', 'periyodik-bakimda-hangi-filtreler-degisir'],
    intro: [
      'Hibrit araçlarda benzinli motor bulunduğu için motor yağı, yağ filtresi ve hava filtresi bakımı normal araçlardaki gibi sürer; polen filtresi de aynı şekilde değişir. Motor daha az çalıştığı için kilometre yavaş birikebilir, ancak yağ zamanla da eskidiği için hibritlerde bakım genellikle “kilometre ya da süre, hangisi önce gelirse” kuralıyla yapılır. Bazı hibrit modellerde ayrıca yüksek voltaj bataryasının soğutma havası girişinin temizlenmesi gerekir.',
      'Hibrit aracınıza uygun filtreleri sitede marka, model ve motorunuzu seçerek bulabilirsiniz; hibrit versiyonlar motor listesinde ayrıca yer alır.',
    ],
    body: [
      {
        heading: 'Hibrit araçta hangi filtreler değişir?',
        paragraphs: [],
        table: {
          caption: 'Hibrit araçlarda bakımda değişen filtreler',
          head: ['Filtre', 'Hibritte durum'],
          rows: [
            ['Yağ filtresi', 'Her yağ değişiminde değişir; benzinli araçtaki gibidir'],
            ['Hava filtresi', 'Motor bakımında kontrol edilir ve değişir'],
            ['Polen filtresi', 'Klima ve kabin havası için normal araçtaki gibi değişir'],
            ['Yakıt filtresi', 'Çoğu benzinli hibritte depo içindeki pompa modülündedir'],
            ['Batarya soğutma filtresi / ızgarası', 'Bazı modellerde bulunur; temizlenmesi ya da değişmesi gerekir'],
          ],
        },
      },
      {
        heading: 'Neden süreye bağlı bakım önemli?',
        paragraphs: [
          'Hibrit araçta benzinli motor sık sık durup kalkar ve özellikle şehir içinde kısa süreler çalışır. Bu kullanımda motor yağı her zaman tam çalışma sıcaklığına ulaşmayabilir; yağda nem ve yakıt kalıntısı birikebilir. Bu yüzden yıllık kilometre düşük olsa bile yağ ve yağ filtresini bakım kitapçığındaki süre aralığında değiştirmek önemlidir.',
          'Birçok hibrit motor 0W-16 ya da 0W-20 gibi düşük viskoziteli yağlar ister. Doğru yağı seçmek için [motor yağı yazımıza](/blog/motor-yagi-5w30-5w40-ne-demek "Motor yağı seçimi") bakabilirsiniz.',
        ],
      },
      {
        heading: 'Batarya soğutma havası',
        paragraphs: [
          'Bazı hibrit modellerde yüksek voltaj bataryası, kabinden emilen havayla soğutulur. Bu hava girişi genellikle arka koltuk çevresinde bir ızgara ya da filtreyle korunur. Izgara toz, tüy ya da eşya ile tıkanırsa batarya ısınabilir ve sistem performansı düşebilir. Aracınızda böyle bir giriş olup olmadığını ve temizleme aralığını kullanım kılavuzundan öğrenin; girişin önünü eşyayla kapatmayın.',
        ],
      },
      {
        heading: 'Hibritte diğer bakım noktaları',
        paragraphs: [],
        list: [
          'Frenler: rejeneratif frenleme sayesinde balatalar daha geç aşınır, ancak az kullanılan disk ve kaliperlerde paslanma görülebilir. Fren hidroliğini süre aralığında değiştirin.',
          'Soğutma sıvısı: birçok hibritte motor ve invertör/elektrik sistemi için ayrı soğutma devreleri bulunur.',
          '12 V akü: hibritlerde de 12 V akü vardır; zayıfladığında araç “hazır” konuma geçmeyebilir.',
          'Yüksek voltaj sistemi: turuncu kablolu parçalara yalnızca yetkili ve eğitimli personel müdahale etmelidir.',
        ],
      },
    ],
    sss: [
      {
        q: 'Hibrit araçta yağ değişimi gerekir mi?',
        a: 'Evet. Hibrit araçlarda benzinli motor bulunduğu için motor yağı ve yağ filtresi bakım aralığında değiştirilir. Motor daha az çalışsa da yağ zamanla eskidiği için süre aralığına da uyulmalıdır.',
      },
      {
        q: 'Hibrit araçta hava filtresi farklı mı?',
        a: 'Hayır, hava filtresi aracın motoruna göre seçilir. Hibrit versiyonların motor kodları farklı olduğu için sitede aracınızı seçerken hibrit motoru seçmeniz yeterlidir.',
      },
      {
        q: 'Hibrit batarya filtresi nerede?',
        a: 'Bazı hibrit modellerde batarya soğutma havası girişi arka koltuk çevresinde bir ızgara ya da filtreyle korunur. Aracınızda olup olmadığını ve yerini kullanım kılavuzundan öğrenebilirsiniz.',
      },
    ],
  },
  {
    slug: 'fiat-doblo-filtre-rehberi',
    title: 'Fiat Doblo Filtre Rehberi: Yağ, Hava, Polen ve Yakıt Filtresi Kodları',
    metaTitle: 'Fiat Doblo Filtre Kodları | Oto Center Market',
    summary:
      'Fiat Doblo I, II ve yeni nesil Doblo için motor bazında MANN-FILTER ve FILTRON yağ, hava, polen ve yakıt filtresi kodları. 1.3 ve 1.6 Multijet, 1.9 JTD, 1.4 benzinli ve 1.5 BlueHDi.',
    tag: 'Model rehberi',
    readMinutes: 7,
    relatedHref: '/otomobil/fiat',
    relatedLabel: 'Fiat modellerine göz atın',
    guncelleme: '2026-10-22',
    ilgiliYazilar: ['fiat-egea-filtre-rehberi', 'dizel-yakit-filtresi-degisimi-hava-alma'],
    intro: [
      'Fiat Doblo’da filtre seçimi motora ve üretim dönemine göre belirgin şekilde değişir: 1.3 Multijet, 1.6 Multijet, 1.9 JTD ve 1.4 benzinli motorlar farklı yağ, hava ve yakıt filtresi kullanır. 2022 sonrası yeni nesil Doblo ise Stellantis grubunun 1.5 BlueHDi ve 1.2 PureTech motorlarını kullanır. Aşağıdaki tablolar katalogdaki uyumluluk verisinden hazırlandı; her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır.',
      'Tablolar hızlı başvuru içindir. Kesin seçim için [Fiat modelleri](/otomobil/fiat "Fiat yedek parça") arasından Doblo’yu ve motorunuzu seçin; yalnızca o motora uyumlu ürünler listelenir.',
    ],
    body: [
      {
        heading: 'Motorunuzu nasıl anlarsınız?',
        paragraphs: [
          'Katalogda Doblo I (yaklaşık 2000–2010) ve Doblo II (yaklaşık 2010–2022) aynı model altında listelenir; bu yüzden motor seçimi özellikle önemlidir. Motor hacmi ve gücü ruhsatta yazar. JTD ve Multijet dizel, BlueHDi yeni nesil dizel, PureTech turbo benzinli motoru gösterir.',
          'Aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Özellikle 1.3 Multijet motorda birden fazla yağ filtresi kodu bulunduğu için eski filtrenin üzerindeki kodu kontrol edin ya da siparişten önce şasi numaranızla bize sorun.',
        ],
      },
      {
        heading: 'Doblo (yeni nesil) filtre kodları',
        paragraphs: [
          'Doblo (yeni nesil) (yaklaşık 2022 ve sonrası) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Doblo (yeni nesil) sayfasında](/otomobil/fiat/doblo-510-511 "Fiat Doblo (yeni nesil) yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Fiat Doblo (yeni nesil) — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'HU 7032 z', 'OE 667/6', '1.5 BlueHDi 100 102 HP, 1.5 BlueHDi 130 131 HP'],
            ['Yağ', 'W 7058', 'OP 540/1', '1.2 PureTech 110 110 HP'],
            ['Hava', 'C 24 036', 'AP 196/9', '1.5 BlueHDi 100 102 HP, 1.5 BlueHDi 130 131 HP'],
            ['Hava', 'C 36 007 KIT', 'AP 196/2', '1.2 PureTech 110 110 HP'],
            ['Polen / kabin', 'CU 29 003-2, CUK 29 003-2, FP 29 003-2', 'K 1227-2x, K 1227A-2x', 'Bu nesildeki tüm motorlar'],
            ['Yakıt', '—', 'PE 816/6', '1.5 BlueHDi 100 102 HP, 1.5 BlueHDi 130 131 HP'],
          ],
        },
      },
      {
        heading: 'Doblo I ve II filtre kodları',
        paragraphs: [
          'Doblo I ve II (yaklaşık 2000–2022) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Doblo I ve II sayfasında](/otomobil/fiat/doblo "Fiat Doblo I ve II yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Fiat Doblo I ve II — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'HU 712/11 x', 'OE 682/2', '1.3 D Multijet 75 HP, 1.3 MTJD 90 HP, 1.6 D Multijet 95 HP, 1.6 D Multijet 120 HP, 1.6 JTD 90 HP, 1.6 JTD 100 HP, 1.6 JTD 105 HP, 2.0 JTD 135 HP'],
            ['Yağ', 'HU 713/1 x', 'OE 670', '1.3 D Multijet 75 HP, 1.3 JTD 70 HP, 1.3 MTJD 90 HP, 1.3 Multijet 16V JTD 75 HP, 1.3 Multijet 16V JTD 85 HP, 1.4 16V 120 HP'],
            ['Yağ', 'HU 8006 z', 'OE 682/3', '1.6 D Multijet 95 HP, 1.6 D Multijet 120 HP, 1.6 JTD 90 HP, 1.6 JTD 100 HP, 1.6 JTD 105 HP, 2.0 JTD 135 HP'],
            ['Yağ', 'HU 712/7 x', 'OE 682', '1.3 D Multijet 75 HP, 1.3 JTD 70 HP, 1.3 MTJD 90 HP, 1.3 Multijet 16V JTD 75 HP, 1.3 Multijet 16V JTD 85 HP'],
            ['Yağ', 'W 610/3', '—', '1.2 65 HP, 1.4 16V 95 HP, 1.4 8V 77 HP'],
            ['Yağ', 'W 714/4', '—', '1.9 D 63 HP, 1.9 JTD 100 HP, 1.9 JTD 105 105 HP'],
            ['Yağ', 'W 7003', 'OP 537/2', '1.9 JTD 100 HP, 1.9 JTD 105 105 HP, 1.9 JTD 120 120 HP'],
            ['Yağ', 'HU 7041 z, HU 7042 z', '—', '1.3 D Multijet 80 HP, 1.3 D Multijet 95 HP'],
            ['Yağ', '—', 'OP 537/1', '1.2 65 HP'],
            ['Yağ', 'W 713/16', 'OP 545', '1.6 16V 103 HP'],
            ['Hava', 'C 21 106', 'AP 098/3', '1.6 D Multijet 95 HP, 1.6 D Multijet 120 HP, 1.6 JTD 90 HP, 1.6 JTD 100 HP, 1.6 JTD 105 HP, 2.0 JTD 135 HP'],
            ['Hava', 'C 3877/1', 'AP 092/7', '1.3 D Multijet 75 HP, 1.3 JTD 70 HP, 1.3 MTJD 90 HP, 1.3 Multijet 16V JTD 75 HP, 1.3 Multijet 16V JTD 85 HP'],
            ['Hava', 'C 1189', 'AR 234/3', '1.6 16V 103 HP, 1.9 D 63 HP, 1.9 JTD 100 HP, 1.9 JTD 105 105 HP, 1.9 JTD 120 120 HP'],
            ['Hava', '—', 'AP 078/1', '1.3 D Multijet 75 HP, 1.3 D Multijet 80 HP, 1.3 D Multijet 95 HP, 1.3 MTJD 90 HP'],
            ['Hava', 'C 3275', 'AP 092/3', '1.4 16V 95 HP'],
            ['Hava', 'C 2859', 'AP 022/2', '1.4 8V 77 HP'],
            ['Polen / kabin', '—', 'K 1228', '1.3 D Multijet 75 HP, 1.3 D Multijet 80 HP, 1.3 D Multijet 95 HP, 1.3 MTJD 90 HP, 1.4 16V 95 HP, 1.4 16V 120 HP, 1.6 D Multijet 95 HP, 1.6 D Multijet 120 HP, 1.6 JTD 90 HP, 1.6 JTD 100 HP, 1.6 JTD 105 HP, 2.0 JTD 135 HP'],
            ['Polen / kabin', 'CU 2335, CUK 2335 KIT, FP 2335 KIT', 'K 1101', '1.2 65 HP, 1.3 JTD 70 HP, 1.3 Multijet 16V JTD 75 HP, 1.3 Multijet 16V JTD 85 HP, 1.4 8V 77 HP, 1.6 16V 103 HP, 1.9 D 63 HP, 1.9 JTD 100 HP, 1.9 JTD 105 105 HP, 1.9 JTD 120 120 HP'],
            ['Yakıt', 'PU 7005', 'PE 982/2', '1.3 D Multijet 75 HP, 1.3 D Multijet 80 HP, 1.3 D Multijet 95 HP, 1.3 MTJD 90 HP, 1.6 D Multijet 95 HP, 1.6 D Multijet 120 HP, 1.6 JTD 90 HP, 1.6 JTD 100 HP, 1.6 JTD 105 HP, 2.0 JTD 135 HP'],
            ['Yakıt', '—', 'PP 966/3', '1.3 D Multijet 75 HP, 1.3 MTJD 90 HP, 1.6 JTD 90 HP, 1.6 JTD 100 HP, 1.6 JTD 105 HP, 1.9 JTD 120 120 HP, 2.0 JTD 135 HP'],
            ['Yakıt', 'WK 853/20', 'PP 966/2', '1.3 D Multijet 75 HP, 1.3 MTJD 90 HP, 1.9 JTD 100 HP, 1.9 JTD 105 105 HP'],
            ['Yakıt', 'PU 723 x', 'PE 982', '1.3 JTD 70 HP, 1.3 Multijet 16V JTD 75 HP, 1.3 Multijet 16V JTD 85 HP'],
            ['Yakıt', 'WK 829/2', 'PP 966', '1.9 D 63 HP'],
            ['Yakıt', '—', 'PP 968', '1.9 JTD 100 HP'],
            ['Yakıt', 'WK 854/5', 'PP 968/1', '1.9 JTD 105 105 HP'],
          ],
        },
      },
    ],
    sss: [
      {
        q: 'Fiat Doblo 1.3 Multijet yağ filtresi kodu nedir?',
        a: 'Katalogda Doblo 1.3 Multijet motorlar için üretim dönemine göre birden fazla kartuş yağ filtresi kayıtlıdır: MANN-FILTER HU 713/1 x (FILTRON OE 670), HU 712/11 x (OE 682/2) ve HU 712/7 x (OE 682). Doğru kodu eski filtrenin üzerinden ya da sitede motorunuzu seçerek kontrol edin.',
      },
      {
        q: 'Fiat Doblo 1.6 Multijet yağ filtresi kodu nedir?',
        a: 'Doblo 1.6 Multijet (95 ve 120 HP) motorlarda katalogda MANN-FILTER HU 8006 z (FILTRON OE 682/3) ve HU 712/11 x (OE 682/2) kayıtlıdır. Aynı motor için iki kod görülmesi üretim yılına bağlı olabilir.',
      },
      {
        q: 'Doblo dizel yakıt filtresi kodu nedir?',
        a: 'Doblo 1.3 ve 1.6 Multijet ile 2.0 JTD motorlarda katalogda MANN-FILTER PU 7005 ve FILTRON PE 982/2 kartuş yakıt filtresi kayıtlıdır. Eski 1.9 JTD motorlarda farklı kodlar kullanılır.',
      },
    ],
  },
  {
    slug: 'skoda-octavia-filtre-rehberi',
    title: 'Skoda Octavia Filtre Rehberi: Yağ, Hava, Polen, Yakıt ve Şanzıman Filtresi Kodları',
    metaTitle: 'Skoda Octavia Filtre Kodları | Oto Center Market',
    summary:
      'Skoda Octavia II, III ve IV için motor bazında MANN-FILTER ve FILTRON yağ, hava, polen, yakıt ve DSG şanzıman filtresi kodları. TSI, TDI, FSI ve RS motorlar.',
    tag: 'Model rehberi',
    readMinutes: 8,
    relatedHref: '/otomobil/skoda',
    relatedLabel: 'Skoda modellerine göz atın',
    guncelleme: '2026-10-22',
    ilgiliYazilar: ['volkswagen-golf-filtre-rehberi', 'sanzuman-filtresi-ne-zaman-degisir'],
    intro: [
      'Skoda Octavia, Volkswagen grubunun motorlarını kullandığı için filtre kodlarının çoğu Golf, Leon ve A3 ile ortaktır. Filtre seçimi nesle ve motora göre değişir: aynı nesilde 1.0 ve 1.5 TSI benzinli ile 2.0 TDI dizel farklı yağ, hava ve yakıt filtresi kullanır. Aşağıdaki tablolar Octavia II, III ve IV için katalogdaki uyumluluk verisinden hazırlandı; her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır.',
      'Tablolar hızlı başvuru içindir. Kesin seçim için [Skoda modelleri](/otomobil/skoda "Skoda yedek parça") arasından Octavia neslinizi ve motorunuzu seçin; yalnızca o motora uyumlu ürünler listelenir.',
    ],
    body: [
      {
        heading: 'Neslinizi ve motorunuzu nasıl anlarsınız?',
        paragraphs: [
          'Nesli ruhsattaki model yılından tahmin edebilirsiniz; nesil geçiş yıllarında iki nesil bir süre birlikte satılmıştır. Motor hacmi ve gücü ruhsatta yazar. Motor adındaki TSI turbo benzinli, TDI dizel, FSI direkt enjeksiyonlu benzinli motoru, e-TEC hafif hibrit, G-TEC doğalgazlı versiyonu gösterir.',
          'DSG şanzımanlı Octavia’larda şanzıman yağı ve filtresi de bakım ister; ayrıntılar için [şanzıman filtresi yazımıza](/blog/sanzuman-filtresi-ne-zaman-degisir "Şanzıman filtresi ne zaman değişir") bakabilirsiniz. Aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir; eski filtrenin kodunu kontrol edin ya da siparişten önce şasi numaranızla bize sorun.',
        ],
      },
      {
        heading: 'Octavia IV filtre kodları',
        paragraphs: [
          'Octavia IV (yaklaşık 2020 ve sonrası) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Octavia IV sayfasında](/otomobil/skoda/octavia-iv "Skoda Octavia IV yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Skoda Octavia IV — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'W 712/95', 'OP 616/3', '1.0 TSI 110 HP, 1.0 TSI e-TEC 110 HP, 1.4 TSI 150 HP, 1.4 TSI IV 204 HP, 1.4 TSI IV RS 245 HP, 1.5 TSI G-TEC 131 HP, 1.5 TSi 150 HP, 1.5 TSi e-TEC 150 HP, 1.6 SRE 110 HP'],
            ['Yağ', 'HU 5003 z', 'OE 688/6', '2.0 TDI 150 HP, 2.0 TDI 200 HP, 2.0 TDi 116 HP'],
            ['Yağ', 'HU 6013 z', 'OE 688/5', '2.0 TFSI 190 HP, 2.0 TSI RS 245 HP'],
            ['Yağ', 'HU 7020 z', 'OE 688/3', '2.0 TDI 143 HP'],
            ['Hava', 'C 30 005', 'AP 139/5', '2.0 TDI 143 HP, 2.0 TDI 150 HP, 2.0 TDI 200 HP, 2.0 TDi 116 HP, 2.0 TFSI 190 HP, 2.0 TSI RS 245 HP'],
            ['Hava', 'C 28 043', 'AP 183/6', '1.0 TSI 110 HP, 1.0 TSI e-TEC 110 HP, 1.5 TSI G-TEC 131 HP, 1.5 TSi 150 HP, 1.5 TSi e-TEC 150 HP'],
            ['Hava', 'C 30 004', 'AP 139/6', '2.0 TDI 143 HP, 2.0 TDI 150 HP, 2.0 TDI 200 HP, 2.0 TDi 116 HP, 2.0 TFSI 190 HP'],
            ['Hava', 'C 27 009', 'AP 062/1', '1.4 TSI 150 HP, 1.4 TSI IV 204 HP, 1.4 TSI IV RS 245 HP'],
            ['Hava', 'C 21 014', 'AP 139/7', '1.6 SRE 110 HP'],
            ['Polen / kabin', 'CU 26 009, CUK 26 009, FP 26 009', 'K 1311, K 1311A', 'Bu nesildeki tüm motorlar'],
            ['Yakıt', 'PU 8028', 'PE 973/9, PE 993/2', '2.0 TDI 143 HP, 2.0 TDI 150 HP, 2.0 TDI 200 HP, 2.0 TDi 116 HP'],
            ['Şanzıman', 'H 6003 z, H 6031 z', '—', 'Bu nesildeki tüm motorlar'],
          ],
        },
      },
      {
        heading: 'Octavia III filtre kodları',
        paragraphs: [
          'Octavia III (yaklaşık 2013–2020) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Octavia III sayfasında](/otomobil/skoda/octavia-iii "Skoda Octavia III yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Skoda Octavia III — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'W 712/95', 'OP 616/3', '1.0 TSI 115 HP, 1.2 TSI 86 HP, 1.2 TSI 105 HP, 1.2 TSI 110 HP, 1.4 TSI 122 HP, 1.4 TSI 140 HP, 1.4 TSI 150 HP, 1.5 TSI 131 HP, 1.5 TSI 150 HP, 1.5 TSI G-TEC 131 HP, 1.6 MPI 110 HP'],
            ['Yağ', 'HU 7020 z', 'OE 688/3', '1.6 TDI 90 HP, 1.6 TDI 105 HP, 1.6 TDI 110 HP, 1.6 TDI 115 HP, 2.0 TDI 110 HP, 2.0 TDI 143 HP, 2.0 TDI 150 HP, 2.0 TDI / RS 184 HP'],
            ['Yağ', 'HU 6013 z', '—', '1.8 TSI 180 HP, 2.0 RS 220 HP, 2.0 RS 230 HP, 2.0 RS 245 HP, 2.0 TSI 190 HP'],
            ['Hava', 'C 30 005', 'AP 139/5', '1.6 TDI 90 HP, 1.6 TDI 105 HP, 1.6 TDI 110 HP, 1.6 TDI 115 HP, 1.8 TSI 180 HP, 2.0 RS 220 HP, 2.0 RS 230 HP, 2.0 RS 245 HP, 2.0 TDI 110 HP, 2.0 TDI 143 HP, 2.0 TDI 150 HP, 2.0 TDI / RS 184 HP, 2.0 TSI 190 HP'],
            ['Hava', 'C 27 009', 'AP 062/1', '1.2 TSI 86 HP, 1.2 TSI 105 HP, 1.2 TSI 110 HP, 1.4 TSI 122 HP, 1.4 TSI 140 HP, 1.4 TSI 150 HP'],
            ['Hava', 'C 28 043', '—', '1.5 TSI 131 HP, 1.5 TSI 150 HP, 1.5 TSI G-TEC 131 HP'],
            ['Hava', '—', 'AP 062/2', '1.0 TSI 115 HP, 1.2 TSI 86 HP'],
            ['Hava', '—', 'AP 183/6', '1.5 TSI G-TEC 131 HP'],
            ['Hava', 'C 21 014', '—', '1.6 MPI 110 HP'],
            ['Polen / kabin', 'CU 26 009, CUK 26 009, FP 26 009', 'K 1311, K 1311A', 'Bu nesildeki tüm motorlar'],
            ['Yakıt', 'PU 8028', 'PE 973/9, PE 993/2', '1.6 TDI 90 HP, 1.6 TDI 105 HP, 1.6 TDI 110 HP, 1.6 TDI 115 HP, 2.0 TDI 110 HP, 2.0 TDI 143 HP, 2.0 TDI 150 HP, 2.0 TDI / RS 184 HP'],
            ['Şanzıman', 'H 6003 z, H 6031 z', '—', '1.5 TSI G-TEC 131 HP'],
          ],
        },
      },
      {
        heading: 'Octavia II filtre kodları',
        paragraphs: [
          'Octavia II (yaklaşık 2004–2013) için katalogdaki MANN-FILTER ve FILTRON karşılıkları aşağıda. Her satırda filtrenin uyduğu motorlar beygir gücüyle birlikte yazılıdır; aynı motor için birden fazla kod görüyorsanız filtre üretim yılına göre değişiyor olabilir. Motorunuzu seçerek size uyan ürünleri [Octavia II sayfasında](/otomobil/skoda/octavia-ii "Skoda Octavia II yedek parça") görebilirsiniz.',
        ],
        table: {
          caption: 'Skoda Octavia II — filtre türüne göre MANN-FILTER ve FILTRON kodları',
          head: ['Filtre', 'MANN-FILTER', 'FILTRON', 'Uyumlu motorlar'],
          rows: [
            ['Yağ', 'HU 7008 z', 'OE 688', '1.6 TDI 105 HP, 2.0 TDI 110 HP, 2.0 TDI 140 HP, 2.0 TDI RS 170 HP'],
            ['Yağ', 'W 719/45', 'OP 526/7', '1.8 TSI 152 HP, 1.8 TSI 160 HP, 2.0 RS 200 HP'],
            ['Yağ', 'HU 719/7 x', 'OE 650/1', '1.9 TDI 105 HP, 2.0 TDI 140 HP, 2.0 TDI RS 170 HP'],
            ['Yağ', 'W 712/94', 'OP 641/2', '1.2 TSI 105 HP, 1.4 TSI 122 HP'],
            ['Yağ', 'W 712/52', 'OP 641', '1.4 75 HP, 1.4 80 HP'],
            ['Yağ', 'HU 719/6 x', 'OE 671/3', '2.0 FSI 150 HP, 2.0 RS 200 HP'],
            ['Yağ', 'W 712/93', 'OP 641/1', '1.4 TSI 122 HP'],
            ['Yağ', 'W 719/30', 'OP 526/1', '1.6 102 HP'],
            ['Yağ', 'HU 712/6 x', 'OE 650/2', '1.6 FSI 115 HP'],
            ['Hava', 'C 35 154', 'AP 139/2', '1.6 TDI 105 HP, 1.8 TSI 152 HP, 1.8 TSI 160 HP, 1.9 TDI 105 HP, 2.0 RS 200 HP, 2.0 TDI 110 HP, 2.0 TDI 140 HP, 2.0 TDI RS 170 HP'],
            ['Hava', 'C 14 130', 'AK 370/4', '1.2 TSI 105 HP, 1.4 TSI 122 HP, 1.6 102 HP, 2.0 FSI 150 HP'],
            ['Hava', 'C 2998/5 x', 'AP 149/3', '1.4 75 HP'],
            ['Hava', 'C 3880', 'AP 183/3', '1.4 80 HP'],
            ['Hava', 'C 3083/1', 'AP 149/7', '1.6 FSI 115 HP'],
            ['Hava', 'C 41 110', 'AP 149/8', '2.0 RS 200 HP'],
            ['Polen / kabin', 'CU 2939, CUK 2939, FP 2939', 'K 1111, K 1111A', 'Bu nesildeki tüm motorlar'],
            ['Yakıt', 'WK 69', 'PP 836/2', '1.2 TSI 105 HP, 1.4 TSI 122 HP, 1.6 FSI 115 HP, 1.8 TSI 152 HP, 1.8 TSI 160 HP, 2.0 FSI 150 HP, 2.0 RS 200 HP'],
            ['Yakıt', 'PU 825 x', 'PE 973/3', '1.6 TDI 105 HP, 1.9 TDI 105 HP, 2.0 TDI 110 HP, 2.0 TDI 140 HP, 2.0 TDI RS 170 HP'],
            ['Yakıt', 'WK 69/2', 'PP 836/4', '1.4 75 HP, 1.4 80 HP, 1.6 102 HP'],
            ['Yakıt', 'PU 936/1 x', 'PE 973/2', '1.9 TDI 105 HP, 2.0 TDI 140 HP, 2.0 TDI RS 170 HP'],
            ['Yakıt', 'WK 59 x', '—', '1.4 75 HP, 1.6 102 HP'],
            ['Yakıt', 'PU 936/2 x', '—', '1.9 TDI 105 HP, 2.0 TDI 140 HP'],
          ],
        },
      },
    ],
    sss: [
      {
        q: 'Skoda Octavia 3 1.6 TDI yağ filtresi kodu nedir?',
        a: 'Katalogdaki uyumluluk verisine göre Octavia III 1.6 TDI ve 2.0 TDI motorlarda MANN-FILTER HU 7020 z ve FILTRON OE 688/3 kartuş yağ filtresi kullanılır.',
      },
      {
        q: 'Octavia 1.0 TSI ve 1.5 TSI yağ filtresi aynı mı?',
        a: 'Evet. Octavia III ve IV’te 1.0 TSI, 1.2 TSI, 1.4 TSI ve 1.5 TSI motorlar için katalogda aynı yağ filtresi kayıtlıdır: MANN-FILTER W 712/95 ve FILTRON OP 616/3.',
      },
      {
        q: 'Octavia 3 ve Octavia 4 polen filtresi aynı mı?',
        a: 'Katalogda iki nesil için de MANN-FILTER CU 26 009 (aktif karbonlu CUK 26 009, FreciousPlus FP 26 009) ve FILTRON K 1311 (aktif karbonlu K 1311A) kayıtlıdır.',
      },
    ],
  },
]

export function rehberBul(slug: string): RehberYazisi | null {
  return REHBER_YAZILARI.find((y) => y.slug === slug) ?? null
}
