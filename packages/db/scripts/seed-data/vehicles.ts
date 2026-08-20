/**
 * Araç ağacı seed verisi (Faz 0 / Sprint 1).
 *
 * ⚠ Bu veriler geliştirme ortamı içindir. Motor kodları ve yıl aralıkları
 * temsilidir; üretim verisi `arac-agaci.csv` içe aktarımıyla gelecektir.
 */

export type EngineSeed = {
  /** Kullanıcıya görünen ad: '30 TFSI 1.0' */
  name: string
  /** Üretici motor kodları — uyumluluk eşleştirmesinin en güvenilir anahtarı */
  codes: string[]
  cc: number
  kw: number
  hp: number
  fuel: 'BENZIN' | 'DIZEL' | 'LPG' | 'HIBRIT' | 'ELEKTRIK' | 'CNG'
  from?: number
  to?: number
}

export type ModelSeed = {
  name: string
  code?: string
  from: number
  to?: number
  body?: string
  engines: EngineSeed[]
}

export type BrandSeed = {
  name: string
  popular?: boolean
  country?: string
  types: string[]
  models: ModelSeed[]
}

export const VEHICLE_TYPES = [
  { name: 'Otomobil & Hafif Ticari', slug: 'otomobil', icon: 'car', sortOrder: 10 },
  { name: 'Ağır Vasıta', slug: 'agir-vasita', icon: 'truck', sortOrder: 20 },
  { name: 'Otobüs', slug: 'otobus', icon: 'bus', sortOrder: 30 },
  { name: 'İş Makinesi', slug: 'is-makinesi', icon: 'digger', sortOrder: 40 },
  { name: 'Traktör', slug: 'traktor', icon: 'tractor', sortOrder: 50 },
  { name: 'Motosiklet', slug: 'motosiklet', icon: 'bike', sortOrder: 60 },
  { name: 'Jeneratör & Deniz', slug: 'jenerator', icon: 'engine', sortOrder: 70 },
] as const

// Sık kullanılan motor grupları — tekrarı azaltmak için
const EA211_10 = (from = 2017, to?: number): EngineSeed[] => [
  {
    name: '1.0 TSI 81 kW 110 HP',
    codes: ['CHZB', 'CHZJ'],
    cc: 999,
    kw: 81,
    hp: 110,
    fuel: 'BENZIN',
    from,
    to,
  },
  {
    name: '1.0 TSI 70 kW 95 HP',
    codes: ['DKRF', 'DKLA'],
    cc: 999,
    kw: 70,
    hp: 95,
    fuel: 'BENZIN',
    from,
    to,
  },
  {
    name: '1.0 MPI 48 kW 65 HP',
    codes: ['CHYB'],
    cc: 999,
    kw: 48,
    hp: 65,
    fuel: 'BENZIN',
    from,
    to,
  },
]
const EA211_15 = (from = 2019, to?: number): EngineSeed[] => [
  {
    name: '1.5 TSI 110 kW 150 HP',
    codes: ['DLAA', 'DPCA'],
    cc: 1498,
    kw: 110,
    hp: 150,
    fuel: 'BENZIN',
    from,
    to,
  },
]
const EA288_20D = (from = 2019, to?: number): EngineSeed[] => [
  {
    name: '2.0 TDI 110 kW 150 HP',
    codes: ['DTTB', 'DFHA'],
    cc: 1968,
    kw: 110,
    hp: 150,
    fuel: 'DIZEL',
    from,
    to,
  },
  {
    name: '2.0 TDI 85 kW 116 HP',
    codes: ['DTTA'],
    cc: 1968,
    kw: 85,
    hp: 116,
    fuel: 'DIZEL',
    from,
    to,
  },
]

export const VEHICLE_TREE: BrandSeed[] = [
  // ───────────────────────── OTOMOBİL & HAFİF TİCARİ ────────────────────────
  {
    name: 'AUDI',
    popular: true,
    country: 'Almanya',
    types: ['otomobil'],
    models: [
      {
        name: 'A1 (GB)',
        code: 'GB',
        from: 2018,
        body: 'Hatchback',
        engines: [
          {
            name: '30 TFSI 1.0 81 kW 110 HP',
            codes: ['CHZB', 'CHZJ'],
            cc: 999,
            kw: 81,
            hp: 110,
            fuel: 'BENZIN',
            from: 2018,
            to: 2024,
          },
          {
            name: '25 TFSI 1.0 70 kW 95 HP',
            codes: ['DKRF'],
            cc: 999,
            kw: 70,
            hp: 95,
            fuel: 'BENZIN',
            from: 2018,
            to: 2024,
          },
          {
            name: '40 TFSI 2.0 152 kW 207 HP',
            codes: ['DADA'],
            cc: 1984,
            kw: 152,
            hp: 207,
            fuel: 'BENZIN',
            from: 2019,
            to: 2024,
          },
        ],
      },
      {
        name: 'A3 (8Y)',
        code: '8Y',
        from: 2020,
        body: 'Hatchback',
        engines: [...EA211_15(2020), ...EA288_20D(2020)],
      },
      {
        name: 'A4 (B9)',
        code: 'B9',
        from: 2015,
        body: 'Sedan',
        engines: [
          {
            name: '35 TFSI 2.0 110 kW 150 HP',
            codes: ['DKNA'],
            cc: 1984,
            kw: 110,
            hp: 150,
            fuel: 'BENZIN',
            from: 2018,
          },
          {
            name: '35 TDI 2.0 120 kW 163 HP',
            codes: ['DEUA'],
            cc: 1968,
            kw: 120,
            hp: 163,
            fuel: 'DIZEL',
            from: 2018,
          },
        ],
      },
      {
        name: 'Q3 (F3)',
        code: 'F3',
        from: 2018,
        body: 'SUV',
        engines: [...EA211_15(2018), ...EA288_20D(2018)],
      },
    ],
  },
  {
    name: 'VOLKSWAGEN',
    popular: true,
    country: 'Almanya',
    types: ['otomobil'],
    models: [
      {
        name: 'POLO VI (AW)',
        code: 'AW',
        from: 2017,
        body: 'Hatchback',
        engines: EA211_10(2017, 2023),
      },
      {
        name: 'GOLF VIII (CD)',
        code: 'CD',
        from: 2019,
        body: 'Hatchback',
        engines: [...EA211_15(2019), ...EA288_20D(2019)],
      },
      { name: 'PASSAT B8', code: 'B8', from: 2014, body: 'Sedan', engines: EA288_20D(2015) },
      {
        name: 'T-ROC (A1)',
        code: 'A1',
        from: 2017,
        body: 'SUV',
        engines: [...EA211_15(2017), ...EA288_20D(2017)],
      },
      { name: 'TIGUAN II (AD)', code: 'AD', from: 2016, body: 'SUV', engines: EA288_20D(2016) },
      {
        name: 'CADDY IV',
        code: '2K',
        from: 2015,
        body: 'Panelvan',
        engines: [
          {
            name: '2.0 TDI 75 kW 102 HP',
            codes: ['DFSD'],
            cc: 1968,
            kw: 75,
            hp: 102,
            fuel: 'DIZEL',
            from: 2015,
            to: 2020,
          },
        ],
      },
      {
        name: 'TRANSPORTER T6',
        code: 'T6',
        from: 2015,
        body: 'Panelvan',
        engines: [
          {
            name: '2.0 TDI 110 kW 150 HP',
            codes: ['CXHA'],
            cc: 1968,
            kw: 110,
            hp: 150,
            fuel: 'DIZEL',
            from: 2015,
          },
          {
            name: '2.0 TDI 75 kW 102 HP',
            codes: ['CXGA'],
            cc: 1968,
            kw: 75,
            hp: 102,
            fuel: 'DIZEL',
            from: 2015,
          },
        ],
      },
    ],
  },
  {
    name: 'SEAT',
    country: 'İspanya',
    types: ['otomobil'],
    models: [
      { name: 'IBIZA V (KJ)', code: 'KJ', from: 2017, body: 'Hatchback', engines: EA211_10(2017) },
      {
        name: 'LEON IV (KL)',
        code: 'KL',
        from: 2020,
        body: 'Hatchback',
        engines: [...EA211_15(2020), ...EA288_20D(2020)],
      },
      { name: 'ARONA (KJ7)', code: 'KJ7', from: 2017, body: 'SUV', engines: EA211_10(2017) },
    ],
  },
  {
    name: 'ŠKODA',
    country: 'Çekya',
    types: ['otomobil'],
    models: [
      { name: 'FABIA IV (PJ)', code: 'PJ', from: 2021, body: 'Hatchback', engines: EA211_10(2021) },
      {
        name: 'OCTAVIA IV (NX)',
        code: 'NX',
        from: 2019,
        body: 'Sedan',
        engines: [...EA211_15(2019), ...EA288_20D(2019)],
      },
      { name: 'SUPERB III (3V)', code: '3V', from: 2015, body: 'Sedan', engines: EA288_20D(2015) },
      {
        name: 'KAROQ (NU)',
        code: 'NU',
        from: 2017,
        body: 'SUV',
        engines: [...EA211_15(2017), ...EA288_20D(2017)],
      },
    ],
  },
  {
    name: 'FORD',
    popular: true,
    country: 'ABD',
    types: ['otomobil'],
    models: [
      {
        name: 'FOCUS IV (HN)',
        code: 'HN',
        from: 2018,
        body: 'Hatchback',
        engines: [
          {
            name: '1.5 EcoBoost 110 kW 150 HP',
            codes: ['M8DA', 'M8DB'],
            cc: 1497,
            kw: 110,
            hp: 150,
            fuel: 'BENZIN',
            from: 2018,
          },
          {
            name: '1.5 EcoBlue 88 kW 120 HP',
            codes: ['XWDA'],
            cc: 1499,
            kw: 88,
            hp: 120,
            fuel: 'DIZEL',
            from: 2018,
          },
        ],
      },
      {
        name: 'FIESTA VII',
        code: 'JHH',
        from: 2017,
        body: 'Hatchback',
        engines: [
          {
            name: '1.0 EcoBoost 74 kW 100 HP',
            codes: ['M0DA'],
            cc: 998,
            kw: 74,
            hp: 100,
            fuel: 'BENZIN',
            from: 2017,
          },
          {
            name: '1.5 TDCi 63 kW 85 HP',
            codes: ['XUJC'],
            cc: 1499,
            kw: 63,
            hp: 85,
            fuel: 'DIZEL',
            from: 2017,
          },
        ],
      },
      {
        name: 'KUGA III',
        code: 'CX482',
        from: 2019,
        body: 'SUV',
        engines: [
          {
            name: '1.5 EcoBlue 88 kW 120 HP',
            codes: ['ZTDA'],
            cc: 1499,
            kw: 88,
            hp: 120,
            fuel: 'DIZEL',
            from: 2019,
          },
        ],
      },
      {
        name: 'TRANSIT CUSTOM',
        code: 'V362',
        from: 2016,
        body: 'Panelvan',
        engines: [
          {
            name: '2.0 EcoBlue 96 kW 130 HP',
            codes: ['YMF6'],
            cc: 1995,
            kw: 96,
            hp: 130,
            fuel: 'DIZEL',
            from: 2016,
          },
          {
            name: '2.0 EcoBlue 77 kW 105 HP',
            codes: ['YLF6'],
            cc: 1995,
            kw: 77,
            hp: 105,
            fuel: 'DIZEL',
            from: 2016,
          },
        ],
      },
      {
        name: 'TRANSIT COURIER',
        from: 2014,
        body: 'Panelvan',
        engines: [
          {
            name: '1.5 TDCi 55 kW 75 HP',
            codes: ['XVCB'],
            cc: 1499,
            kw: 55,
            hp: 75,
            fuel: 'DIZEL',
            from: 2014,
          },
        ],
      },
    ],
  },
  {
    name: 'RENAULT',
    popular: true,
    country: 'Fransa',
    types: ['otomobil'],
    models: [
      {
        name: 'CLIO V (BJA)',
        code: 'BJA',
        from: 2019,
        body: 'Hatchback',
        engines: [
          {
            name: '1.0 TCe 67 kW 91 HP',
            codes: ['H4D'],
            cc: 999,
            kw: 67,
            hp: 91,
            fuel: 'BENZIN',
            from: 2019,
          },
          {
            name: '1.5 Blue dCi 63 kW 85 HP',
            codes: ['K9K'],
            cc: 1461,
            kw: 63,
            hp: 85,
            fuel: 'DIZEL',
            from: 2019,
          },
        ],
      },
      {
        name: 'MEGANE IV',
        code: 'B9A',
        from: 2015,
        body: 'Hatchback',
        engines: [
          {
            name: '1.5 dCi 81 kW 110 HP',
            codes: ['K9K'],
            cc: 1461,
            kw: 81,
            hp: 110,
            fuel: 'DIZEL',
            from: 2015,
          },
          {
            name: '1.3 TCe 103 kW 140 HP',
            codes: ['H5H'],
            cc: 1332,
            kw: 103,
            hp: 140,
            fuel: 'BENZIN',
            from: 2018,
          },
        ],
      },
      {
        name: 'CAPTUR II',
        from: 2019,
        body: 'SUV',
        engines: [
          {
            name: '1.3 TCe 96 kW 130 HP',
            codes: ['H5H'],
            cc: 1332,
            kw: 96,
            hp: 130,
            fuel: 'BENZIN',
            from: 2019,
          },
        ],
      },
      {
        name: 'MASTER III',
        from: 2010,
        body: 'Panelvan',
        engines: [
          {
            name: '2.3 dCi 107 kW 145 HP',
            codes: ['M9T'],
            cc: 2298,
            kw: 107,
            hp: 145,
            fuel: 'DIZEL',
            from: 2014,
          },
        ],
      },
    ],
  },
  {
    name: 'DACIA',
    country: 'Romanya',
    types: ['otomobil'],
    models: [
      {
        name: 'DUSTER II',
        from: 2017,
        body: 'SUV',
        engines: [
          {
            name: '1.5 Blue dCi 85 kW 115 HP',
            codes: ['K9K'],
            cc: 1461,
            kw: 85,
            hp: 115,
            fuel: 'DIZEL',
            from: 2018,
          },
          {
            name: '1.3 TCe 96 kW 130 HP',
            codes: ['H5H'],
            cc: 1332,
            kw: 96,
            hp: 130,
            fuel: 'BENZIN',
            from: 2018,
          },
        ],
      },
      {
        name: 'SANDERO III',
        from: 2020,
        body: 'Hatchback',
        engines: [
          {
            name: '1.0 TCe 67 kW 91 HP',
            codes: ['H4D'],
            cc: 999,
            kw: 67,
            hp: 91,
            fuel: 'BENZIN',
            from: 2020,
          },
        ],
      },
    ],
  },
  {
    name: 'FIAT',
    popular: true,
    country: 'İtalya',
    types: ['otomobil'],
    models: [
      {
        name: 'EGEA (356)',
        code: '356',
        from: 2015,
        body: 'Sedan',
        engines: [
          {
            name: '1.4 Fire 70 kW 95 HP',
            codes: ['843A1000'],
            cc: 1368,
            kw: 70,
            hp: 95,
            fuel: 'BENZIN',
            from: 2015,
          },
          {
            name: '1.6 Multijet 88 kW 120 HP',
            codes: ['55260384'],
            cc: 1598,
            kw: 88,
            hp: 120,
            fuel: 'DIZEL',
            from: 2015,
          },
          {
            name: '1.3 Multijet 70 kW 95 HP',
            codes: ['330A1000'],
            cc: 1248,
            kw: 70,
            hp: 95,
            fuel: 'DIZEL',
            from: 2015,
          },
        ],
      },
      {
        name: 'DOBLO IV',
        from: 2015,
        body: 'Panelvan',
        engines: [
          {
            name: '1.6 Multijet 77 kW 105 HP',
            codes: ['263A5000'],
            cc: 1598,
            kw: 77,
            hp: 105,
            fuel: 'DIZEL',
            from: 2015,
          },
        ],
      },
      {
        name: 'DUCATO III',
        from: 2014,
        body: 'Panelvan',
        engines: [
          {
            name: '2.3 Multijet 110 kW 150 HP',
            codes: ['F1AGL411'],
            cc: 2287,
            kw: 110,
            hp: 150,
            fuel: 'DIZEL',
            from: 2016,
          },
        ],
      },
    ],
  },
  {
    name: 'OPEL',
    country: 'Almanya',
    types: ['otomobil'],
    models: [
      {
        name: 'CORSA F',
        from: 2019,
        body: 'Hatchback',
        engines: [
          {
            name: '1.2 Turbo 74 kW 100 HP',
            codes: ['HN05'],
            cc: 1199,
            kw: 74,
            hp: 100,
            fuel: 'BENZIN',
            from: 2019,
          },
        ],
      },
      {
        name: 'ASTRA K',
        from: 2015,
        body: 'Hatchback',
        engines: [
          {
            name: '1.4 Turbo 92 kW 125 HP',
            codes: ['B14XFT'],
            cc: 1399,
            kw: 92,
            hp: 125,
            fuel: 'BENZIN',
            from: 2015,
          },
          {
            name: '1.6 CDTI 100 kW 136 HP',
            codes: ['B16DTH'],
            cc: 1598,
            kw: 100,
            hp: 136,
            fuel: 'DIZEL',
            from: 2015,
          },
        ],
      },
    ],
  },
  {
    name: 'PEUGEOT',
    country: 'Fransa',
    types: ['otomobil'],
    models: [
      {
        name: '208 II',
        from: 2019,
        body: 'Hatchback',
        engines: [
          {
            name: '1.2 PureTech 74 kW 100 HP',
            codes: ['HN05'],
            cc: 1199,
            kw: 74,
            hp: 100,
            fuel: 'BENZIN',
            from: 2019,
          },
        ],
      },
      {
        name: '3008 II',
        from: 2016,
        body: 'SUV',
        engines: [
          {
            name: '1.5 BlueHDi 96 kW 130 HP',
            codes: ['DV5RC'],
            cc: 1499,
            kw: 96,
            hp: 130,
            fuel: 'DIZEL',
            from: 2018,
          },
          {
            name: '1.6 PureTech 133 kW 180 HP',
            codes: ['EP6FADTXD'],
            cc: 1598,
            kw: 133,
            hp: 180,
            fuel: 'BENZIN',
            from: 2018,
          },
        ],
      },
      {
        name: 'PARTNER III',
        from: 2018,
        body: 'Panelvan',
        engines: [
          {
            name: '1.5 BlueHDi 74 kW 100 HP',
            codes: ['DV5RD'],
            cc: 1499,
            kw: 74,
            hp: 100,
            fuel: 'DIZEL',
            from: 2018,
          },
        ],
      },
    ],
  },
  {
    name: 'CITROËN',
    country: 'Fransa',
    types: ['otomobil'],
    models: [
      {
        name: 'C3 III',
        from: 2016,
        body: 'Hatchback',
        engines: [
          {
            name: '1.2 PureTech 61 kW 83 HP',
            codes: ['HMZ'],
            cc: 1199,
            kw: 61,
            hp: 83,
            fuel: 'BENZIN',
            from: 2016,
          },
        ],
      },
      {
        name: 'BERLINGO III',
        from: 2018,
        body: 'Panelvan',
        engines: [
          {
            name: '1.5 BlueHDi 96 kW 130 HP',
            codes: ['DV5RC'],
            cc: 1499,
            kw: 96,
            hp: 130,
            fuel: 'DIZEL',
            from: 2018,
          },
        ],
      },
    ],
  },
  {
    name: 'BMW',
    popular: true,
    country: 'Almanya',
    types: ['otomobil'],
    models: [
      /*
       * BMW'nin '3 SERİSİ (G20)' · '1 SERİSİ (F40)' · 'X3 (G01)' modelleri
       * BURADAN KALDIRILDI. Üçü de `arac-agaci.ts`'deki kaynak yazımının
       * ("3 (G20, G21, G80, G81)", "1 (F40)", "X3 (G01, F97)") ikiziydi;
       * katalogda aynı araç iki-üç kez görünüyordu. Ürün eşlemelerinin
       * tamamı kaynak yazımına dayandığı için kaynak yazımı korundu.
       *
       * Kaybedilen: bu üç modelin dört motorundaki motor kodları
       * (B48B20 · B47D20 · B38A15). Dördü de kaynağın ürün listelerinde
       * GEÇMİYOR (mağazada o motorlara ürün yok) ve hiçbirine uyumluluk
       * bağlı değildi. BMW ağacının tamamında motor kodu zaten boş.
       */
    ],
  },
  {
    name: 'MERCEDES-BENZ',
    popular: true,
    country: 'Almanya',
    types: ['otomobil', 'agir-vasita', 'otobus'],
    models: [
      {
        name: 'C SERİSİ (W205)',
        code: 'W205',
        from: 2014,
        body: 'Sedan',
        engines: [
          {
            name: 'C 200 1.5 135 kW 184 HP',
            codes: ['M264.915'],
            cc: 1497,
            kw: 135,
            hp: 184,
            fuel: 'BENZIN',
            from: 2018,
          },
          {
            name: 'C 220 d 2.0 143 kW 194 HP',
            codes: ['OM654'],
            cc: 1950,
            kw: 143,
            hp: 194,
            fuel: 'DIZEL',
            from: 2018,
          },
        ],
      },
      {
        name: 'A SERİSİ (W177)',
        code: 'W177',
        from: 2018,
        body: 'Hatchback',
        engines: [
          {
            name: 'A 200 1.3 120 kW 163 HP',
            codes: ['M282.914'],
            cc: 1332,
            kw: 120,
            hp: 163,
            fuel: 'BENZIN',
            from: 2018,
          },
        ],
      },
      {
        name: 'VITO (447)',
        code: 'W447',
        from: 2014,
        body: 'Panelvan',
        engines: [
          {
            name: '111 CDI 2.1 84 kW 114 HP',
            codes: ['OM622'],
            cc: 2143,
            kw: 84,
            hp: 114,
            fuel: 'DIZEL',
            from: 2014,
          },
        ],
      },
      {
        name: 'SPRINTER (907)',
        code: '907',
        from: 2018,
        body: 'Panelvan',
        engines: [
          {
            name: '314 CDI 2.1 105 kW 143 HP',
            codes: ['OM651'],
            cc: 2143,
            kw: 105,
            hp: 143,
            fuel: 'DIZEL',
            from: 2018,
          },
          {
            name: '316 CDI 2.1 120 kW 163 HP',
            codes: ['OM651.958'],
            cc: 2143,
            kw: 120,
            hp: 163,
            fuel: 'DIZEL',
            from: 2018,
          },
        ],
      },
      {
        name: 'ACTROS MP4',
        code: 'MP4',
        from: 2011,
        to: 2018,
        body: 'Çekici',
        engines: [
          {
            name: '1845 LS 12.8 330 kW 449 HP',
            codes: ['OM471'],
            cc: 12809,
            kw: 330,
            hp: 449,
            fuel: 'DIZEL',
            from: 2011,
            to: 2018,
          },
          {
            name: '1842 LS 12.8 310 kW 421 HP',
            codes: ['OM471.900'],
            cc: 12809,
            kw: 310,
            hp: 421,
            fuel: 'DIZEL',
            from: 2011,
            to: 2018,
          },
        ],
      },
      {
        name: 'ATEGO 3',
        from: 2013,
        body: 'Kamyon',
        engines: [
          {
            name: '1218 4.8 130 kW 177 HP',
            codes: ['OM934'],
            cc: 4801,
            kw: 130,
            hp: 177,
            fuel: 'DIZEL',
            from: 2013,
          },
        ],
      },
      {
        name: 'TOURISMO',
        from: 2017,
        body: 'Otobüs',
        engines: [
          {
            name: '10.7 315 kW 428 HP',
            codes: ['OM470'],
            cc: 10677,
            kw: 315,
            hp: 428,
            fuel: 'DIZEL',
            from: 2017,
          },
        ],
      },
    ],
  },
  {
    name: 'TOYOTA',
    country: 'Japonya',
    types: ['otomobil'],
    models: [
      {
        name: 'COROLLA XII (E210)',
        code: 'E210',
        from: 2018,
        body: 'Sedan',
        engines: [
          {
            name: '1.6 Valvematic 97 kW 132 HP',
            codes: ['1ZR-FAE'],
            cc: 1598,
            kw: 97,
            hp: 132,
            fuel: 'BENZIN',
            from: 2018,
          },
          {
            name: '1.8 Hybrid 90 kW 122 HP',
            codes: ['2ZR-FXE'],
            cc: 1798,
            kw: 90,
            hp: 122,
            fuel: 'HIBRIT',
            from: 2019,
          },
        ],
      },
      {
        name: 'C-HR',
        from: 2016,
        body: 'SUV',
        engines: [
          {
            name: '1.8 Hybrid 90 kW 122 HP',
            codes: ['2ZR-FXE'],
            cc: 1798,
            kw: 90,
            hp: 122,
            fuel: 'HIBRIT',
            from: 2016,
          },
        ],
      },
    ],
  },
  {
    name: 'HYUNDAI',
    country: 'Güney Kore',
    types: ['otomobil'],
    models: [
      {
        name: 'i20 III (BC3)',
        code: 'BC3',
        from: 2020,
        body: 'Hatchback',
        engines: [
          {
            name: '1.4 MPI 74 kW 100 HP',
            codes: ['G4LC'],
            cc: 1368,
            kw: 74,
            hp: 100,
            fuel: 'BENZIN',
            from: 2020,
          },
        ],
      },
      {
        name: 'TUCSON IV (NX4)',
        code: 'NX4',
        from: 2020,
        body: 'SUV',
        engines: [
          {
            name: '1.6 CRDi 100 kW 136 HP',
            codes: ['D4FE'],
            cc: 1598,
            kw: 100,
            hp: 136,
            fuel: 'DIZEL',
            from: 2020,
          },
        ],
      },
    ],
  },
  {
    name: 'KIA',
    country: 'Güney Kore',
    types: ['otomobil'],
    models: [
      {
        name: 'CEED III (CD)',
        code: 'CD',
        from: 2018,
        body: 'Hatchback',
        engines: [
          {
            name: '1.6 CRDi 100 kW 136 HP',
            codes: ['D4FE'],
            cc: 1598,
            kw: 100,
            hp: 136,
            fuel: 'DIZEL',
            from: 2018,
          },
        ],
      },
      {
        name: 'SPORTAGE V (NQ5)',
        code: 'NQ5',
        from: 2021,
        body: 'SUV',
        engines: [
          {
            name: '1.6 T-GDI 132 kW 180 HP',
            codes: ['G4FS'],
            cc: 1598,
            kw: 132,
            hp: 180,
            fuel: 'BENZIN',
            from: 2021,
          },
        ],
      },
    ],
  },
  {
    name: 'NISSAN',
    country: 'Japonya',
    types: ['otomobil'],
    models: [
      {
        name: 'QASHQAI II (J11)',
        code: 'J11',
        from: 2013,
        body: 'SUV',
        engines: [
          {
            name: '1.5 dCi 81 kW 110 HP',
            codes: ['K9K'],
            cc: 1461,
            kw: 81,
            hp: 110,
            fuel: 'DIZEL',
            from: 2013,
          },
          {
            name: '1.3 DIG-T 103 kW 140 HP',
            codes: ['H5H'],
            cc: 1332,
            kw: 103,
            hp: 140,
            fuel: 'BENZIN',
            from: 2018,
          },
        ],
      },
    ],
  },
  {
    name: 'HONDA',
    country: 'Japonya',
    types: ['otomobil'],
    models: [
      {
        name: 'CIVIC X (FC)',
        code: 'FC',
        from: 2016,
        body: 'Sedan',
        engines: [
          {
            name: '1.6 i-DTEC 88 kW 120 HP',
            codes: ['N16A1'],
            cc: 1597,
            kw: 88,
            hp: 120,
            fuel: 'DIZEL',
            from: 2016,
          },
        ],
      },
    ],
  },
  {
    name: 'VOLVO',
    country: 'İsveç',
    types: ['otomobil', 'agir-vasita'],
    models: [
      {
        name: 'XC60 II',
        from: 2017,
        body: 'SUV',
        engines: [
          {
            name: 'B4 2.0 145 kW 197 HP',
            codes: ['D4204T23'],
            cc: 1969,
            kw: 145,
            hp: 197,
            fuel: 'DIZEL',
            from: 2017,
          },
        ],
      },
      {
        name: 'FH 4',
        from: 2012,
        body: 'Çekici',
        engines: [
          {
            name: 'FH 460 12.8 338 kW 460 HP',
            codes: ['D13K460'],
            cc: 12777,
            kw: 338,
            hp: 460,
            fuel: 'DIZEL',
            from: 2012,
          },
        ],
      },
    ],
  },

  // ────────────────────────────── AĞIR VASITA ───────────────────────────────
  {
    name: 'MAN',
    country: 'Almanya',
    types: ['agir-vasita', 'otobus'],
    models: [
      {
        name: 'TGX',
        from: 2012,
        to: 2020,
        body: 'Çekici',
        engines: [
          {
            name: '18.500 12.4 368 kW 500 HP',
            codes: ['D2676'],
            cc: 12419,
            kw: 368,
            hp: 500,
            fuel: 'DIZEL',
            from: 2012,
            to: 2020,
          },
          {
            name: '18.440 10.5 324 kW 440 HP',
            codes: ['D2066'],
            cc: 10518,
            kw: 324,
            hp: 440,
            fuel: 'DIZEL',
            from: 2012,
            to: 2020,
          },
        ],
      },
      {
        name: 'TGS',
        from: 2012,
        body: 'Kamyon',
        engines: [
          {
            name: '26.400 10.5 294 kW 400 HP',
            codes: ['D2066'],
            cc: 10518,
            kw: 294,
            hp: 400,
            fuel: 'DIZEL',
            from: 2012,
          },
        ],
      },
      {
        name: 'LION’S COACH',
        from: 2017,
        body: 'Otobüs',
        engines: [
          {
            name: '12.4 353 kW 480 HP',
            codes: ['D2676'],
            cc: 12419,
            kw: 353,
            hp: 480,
            fuel: 'DIZEL',
            from: 2017,
          },
        ],
      },
    ],
  },
  {
    name: 'SCANIA',
    country: 'İsveç',
    types: ['agir-vasita'],
    models: [
      {
        name: 'R SERİSİ',
        from: 2016,
        body: 'Çekici',
        engines: [
          {
            name: 'R 450 12.7 331 kW 450 HP',
            codes: ['DC13'],
            cc: 12742,
            kw: 331,
            hp: 450,
            fuel: 'DIZEL',
            from: 2016,
          },
        ],
      },
    ],
  },
  {
    name: 'DAF',
    country: 'Hollanda',
    types: ['agir-vasita'],
    models: [
      {
        name: 'XF 106',
        from: 2013,
        body: 'Çekici',
        engines: [
          {
            name: 'XF 480 12.9 355 kW 483 HP',
            codes: ['MX-13'],
            cc: 12902,
            kw: 355,
            hp: 483,
            fuel: 'DIZEL',
            from: 2013,
          },
        ],
      },
    ],
  },
  {
    name: 'IVECO',
    country: 'İtalya',
    types: ['agir-vasita', 'otomobil'],
    models: [
      {
        name: 'DAILY VI',
        from: 2014,
        body: 'Panelvan',
        engines: [
          {
            name: '35S16 2.3 116 kW 158 HP',
            codes: ['F1AGL411D'],
            cc: 2287,
            kw: 116,
            hp: 158,
            fuel: 'DIZEL',
            from: 2016,
          },
        ],
      },
      {
        name: 'STRALIS',
        from: 2013,
        body: 'Çekici',
        engines: [
          {
            name: 'AS440 11.1 338 kW 460 HP',
            codes: ['CURSOR 11'],
            cc: 11120,
            kw: 338,
            hp: 460,
            fuel: 'DIZEL',
            from: 2013,
          },
        ],
      },
    ],
  },
  {
    name: 'FORD TRUCKS',
    country: 'Türkiye',
    types: ['agir-vasita'],
    models: [
      {
        name: 'F-MAX',
        from: 2018,
        body: 'Çekici',
        engines: [
          {
            name: '1848T 12.7 368 kW 500 HP',
            codes: ['ECOTORQ'],
            cc: 12740,
            kw: 368,
            hp: 500,
            fuel: 'DIZEL',
            from: 2018,
          },
        ],
      },
    ],
  },

  // ───────────────────────────────── OTOBÜS ─────────────────────────────────
  {
    name: 'TEMSA',
    country: 'Türkiye',
    types: ['otobus'],
    models: [
      {
        name: 'SAFİR PLUS',
        from: 2015,
        body: 'Otobüs',
        engines: [
          {
            name: '10.8 320 kW 435 HP',
            codes: ['DC11'],
            cc: 10800,
            kw: 320,
            hp: 435,
            fuel: 'DIZEL',
            from: 2015,
          },
        ],
      },
    ],
  },
  {
    name: 'OTOKAR',
    country: 'Türkiye',
    types: ['otobus'],
    models: [
      {
        name: 'SULTAN',
        from: 2014,
        body: 'Midibüs',
        engines: [
          {
            name: '4.5 132 kW 180 HP',
            codes: ['CUMMINS ISF'],
            cc: 4500,
            kw: 132,
            hp: 180,
            fuel: 'DIZEL',
            from: 2014,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────── İŞ MAKİNESİ ──────────────────────────────
  {
    name: 'CATERPILLAR',
    country: 'ABD',
    types: ['is-makinesi'],
    models: [
      {
        name: '320 EKSKAVATÖR',
        from: 2017,
        body: 'Ekskavatör',
        engines: [
          {
            name: 'C4.4 90 kW 122 HP',
            codes: ['C4.4'],
            cc: 4400,
            kw: 90,
            hp: 122,
            fuel: 'DIZEL',
            from: 2017,
          },
        ],
      },
    ],
  },
  {
    name: 'JCB',
    country: 'İngiltere',
    types: ['is-makinesi'],
    models: [
      {
        name: '3CX KAZICI YÜKLEYİCİ',
        from: 2015,
        body: 'Kazıcı Yükleyici',
        engines: [
          {
            name: '4.4 81 kW 109 HP',
            codes: ['JCB448'],
            cc: 4400,
            kw: 81,
            hp: 109,
            fuel: 'DIZEL',
            from: 2015,
          },
        ],
      },
    ],
  },
  {
    name: 'HİDROMEK',
    country: 'Türkiye',
    types: ['is-makinesi'],
    models: [
      {
        name: 'HMK 102B',
        from: 2016,
        body: 'Kazıcı Yükleyici',
        engines: [
          {
            name: '4.4 74 kW 100 HP',
            codes: ['PERKINS 1104D'],
            cc: 4400,
            kw: 74,
            hp: 100,
            fuel: 'DIZEL',
            from: 2016,
          },
        ],
      },
    ],
  },

  // ──────────────────────────────── TRAKTÖR ─────────────────────────────────
  {
    name: 'NEW HOLLAND',
    country: 'İtalya',
    types: ['traktor'],
    models: [
      {
        name: 'TD5.110',
        from: 2015,
        body: 'Traktör',
        engines: [
          {
            name: '3.4 79 kW 107 HP',
            codes: ['F5C'],
            cc: 3400,
            kw: 79,
            hp: 107,
            fuel: 'DIZEL',
            from: 2015,
          },
        ],
      },
    ],
  },
  {
    name: 'MASSEY FERGUSON',
    country: 'ABD',
    types: ['traktor'],
    models: [
      {
        name: 'MF 5711',
        from: 2016,
        body: 'Traktör',
        engines: [
          {
            name: '4.4 81 kW 110 HP',
            codes: ['AGCO POWER 44'],
            cc: 4400,
            kw: 81,
            hp: 110,
            fuel: 'DIZEL',
            from: 2016,
          },
        ],
      },
    ],
  },
]
