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
]

export function rehberBul(slug: string): RehberYazisi | null {
  return REHBER_YAZILARI.find((y) => y.slug === slug) ?? null
}
