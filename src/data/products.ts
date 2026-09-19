import type { Product } from "@/types/product";

export const products: readonly Product[] = [
  {
    slug: "helyumlu-lateks-balon-demeti",
    name: "Helyumlu Lateks Balon Demeti",
    categorySlug: "balonlar",
    conceptSlugs: ["pink-gold", "blue-silver", "safari-party", "baby-shower-soft"],
    shortDescription: "Kutlamaya uygun renklerde hazırlanabilen helyumlu balon demeti.",
    description:
      "Doğum günü, baby shower ve özel kutlamalarda kullanılabilecek helyumlu lateks balon demeti. Renk kombinasyonu konsepte göre şekillendirilebilir.",
    artworkKind: "balloon-bouquet",
    colors: [
      { name: "Pembe", hex: "#d96d94" },
      { name: "Krem", hex: "#f1e5da" },
      { name: "Rose Gold", hex: "#c9967f" },
    ],
    dimensions: "Balon adedi ve yükseklik konsepte göre değişir.",
    featured: true,
    newArrival: false,
    sortOrder: 1,
    highlights: ["Helyumlu", "Renk kombinasyonu", "Özel gün uyumlu"],
  },
  {
    slug: "folyo-rakam-balon",
    name: "Folyo Rakam Balon",
    categorySlug: "balonlar",
    conceptSlugs: ["pink-gold", "blue-silver", "futbol-partisi"],
    shortDescription: "Yaş ve özel tarihler için büyük folyo rakam balon.",
    description:
      "Doğum günü ve yıl dönümü gibi kutlamalarda yaş veya tarihi vurgulamak için kullanılan folyo rakam balon seçeneği.",
    artworkKind: "foil-number",
    colors: [
      { name: "Rose Gold", hex: "#d1a08b" },
      { name: "Gümüş", hex: "#bdc3ca" },
      { name: "Altın", hex: "#d8b56f" },
    ],
    dimensions: "Rakam ve modele göre ölçü değişir.",
    featured: true,
    newArrival: false,
    sortOrder: 2,
    highlights: ["Folyo", "Rakam seçenekleri", "Helyum uyumlu"],
  },
  {
    slug: "krom-balon-seti",
    name: "Krom Balon Seti",
    categorySlug: "balonlar",
    conceptSlugs: ["pink-gold", "blue-silver", "bride-to-be"],
    shortDescription: "Metalik parlaklığa sahip krom balon kombinasyonu.",
    description:
      "Daha parlak ve modern dekorlar için krom görünümlü balonlardan oluşan kombinasyon. Farklı konsept renkleriyle eşleştirilebilir.",
    artworkKind: "chrome-balloons",
    colors: [
      { name: "Pembe Krom", hex: "#c96f8f" },
      { name: "Gümüş Krom", hex: "#9da8b2" },
      { name: "Altın Krom", hex: "#b99352" },
    ],
    featured: false,
    newArrival: true,
    sortOrder: 3,
    highlights: ["Krom görünüm", "Metalik etki", "Dekor kombinasyonu"],
  },
  {
    slug: "dogum-gunu-masa-seti",
    name: "Doğum Günü Masa Seti",
    categorySlug: "dogum-gunu",
    conceptSlugs: ["prenses-partisi", "unicorn-party", "futbol-partisi"],
    shortDescription: "Masa üstü kutlamasını tek dilde tamamlayan temel parti seti.",
    description:
      "Tabak, bardak ve masa üstü tamamlayıcıları gibi temel doğum günü ürünlerini aynı tema altında bir araya getiren örnek set.",
    artworkKind: "birthday-table",
    colors: [
      { name: "Pembe", hex: "#e28cab" },
      { name: "Lila", hex: "#a98bc9" },
      { name: "Yeşil", hex: "#6d9b78" },
    ],
    dimensions: "Set içeriğine göre değişir.",
    featured: true,
    newArrival: false,
    sortOrder: 4,
    highlights: ["Masa üstü", "Tema uyumlu", "Kombinlenebilir"],
  },
  {
    slug: "happy-birthday-banner",
    name: "Happy Birthday Banner",
    categorySlug: "dogum-gunu",
    conceptSlugs: ["prenses-partisi", "unicorn-party", "futbol-partisi", "pink-gold"],
    shortDescription: "Doğum günü alanını tamamlayan dekoratif banner.",
    description:
      "Duvar, fon veya masa arkası kullanımına uygun dekoratif doğum günü yazısı. Konsept renkleriyle birlikte kullanılabilir.",
    artworkKind: "birthday-banner",
    colors: [
      { name: "Pembe", hex: "#d96b91" },
      { name: "Altın", hex: "#cda55f" },
      { name: "Mavi", hex: "#7294b8" },
    ],
    featured: false,
    newArrival: false,
    sortOrder: 5,
    highlights: ["Dekoratif yazı", "Fon uyumlu", "Kolay kombinasyon"],
  },
  {
    slug: "baby-shower-balon-seti",
    name: "Baby Shower Balon Seti",
    categorySlug: "baby-shower",
    conceptSlugs: ["baby-shower-soft", "blue-silver", "pink-gold"],
    shortDescription: "Baby shower ve doğum karşılama için yumuşak tonlu balon seti.",
    description:
      "Krem, pastel pembe veya açık mavi gibi yumuşak tonlarla hazırlanabilen baby shower balon kombinasyonu.",
    artworkKind: "baby-balloons",
    colors: [
      { name: "Pudra", hex: "#d9a9b9" },
      { name: "Açık Mavi", hex: "#aac5de" },
      { name: "Krem", hex: "#eee4d7" },
    ],
    featured: true,
    newArrival: false,
    sortOrder: 6,
    highlights: ["Pastel tonlar", "Baby shower", "Doğum karşılama"],
  },
  {
    slug: "bebek-hatira-kutusu",
    name: "Bebek Hatıra Kutusu",
    categorySlug: "baby-shower",
    conceptSlugs: ["baby-shower-soft"],
    shortDescription: "Doğum ve baby shower hazırlıklarında kullanılabilen hatıra kutusu.",
    description:
      "Küçük hatıraları, hediyelikleri veya özel detayları bir arada tutmak için kullanılabilecek dekoratif kutu.",
    artworkKind: "baby-keepsake",
    colors: [
      { name: "Krem", hex: "#eee1d2" },
      { name: "Pudra", hex: "#d7a7b6" },
    ],
    dimensions: "Model ve hazırlığa göre değişir.",
    featured: false,
    newArrival: true,
    sortOrder: 7,
    highlights: ["Hatıra", "Hediyelik", "Kişiselleştirilebilir"],
  },
  {
    slug: "gender-reveal-surpriz-balonu",
    name: "Gender Reveal Sürpriz Balonu",
    categorySlug: "cinsiyet-partisi",
    conceptSlugs: [],
    shortDescription: "Sürpriz anını vurgulamak için hazırlanan büyük reveal balonu.",
    description:
      "Cinsiyet partilerinde sürpriz anı için kullanılan büyük balon. İç dolgu ve uygulama seçeneği mağazadaki güncel çözüme göre belirlenir.",
    artworkKind: "reveal-balloon",
    colors: [
      { name: "Siyah", hex: "#333239" },
      { name: "Pembe", hex: "#df90ae" },
      { name: "Mavi", hex: "#86acd1" },
    ],
    featured: true,
    newArrival: false,
    sortOrder: 8,
    highlights: ["Reveal anı", "Büyük balon", "Sürpriz uygulama"],
  },
  {
    slug: "gender-reveal-masa-seti",
    name: "Gender Reveal Masa Seti",
    categorySlug: "cinsiyet-partisi",
    conceptSlugs: [],
    shortDescription: "Pembe ve mavi detaylarla hazırlanan cinsiyet partisi masa seti.",
    description:
      "Cinsiyet partisi masa düzenini destekleyen pembe, mavi ve nötr tonlardaki tamamlayıcı ürünlerin örnek kombinasyonu.",
    artworkKind: "reveal-table",
    colors: [
      { name: "Pembe", hex: "#df91ae" },
      { name: "Mavi", hex: "#89add0" },
      { name: "Beyaz", hex: "#f5f2ed" },
    ],
    featured: false,
    newArrival: false,
    sortOrder: 9,
    highlights: ["Masa düzeni", "Pembe & mavi", "Nötr taban"],
  },
  {
    slug: "soz-nisan-sunum-tepsisi",
    name: "Söz & Nişan Sunum Tepsisi",
    categorySlug: "soz-nisan-dugun",
    conceptSlugs: ["pink-gold"],
    shortDescription: "Söz ve nişan sunumlarını tamamlayan dekoratif tepsi.",
    description:
      "Söz ve nişan hazırlıklarında yüzük, makas veya küçük sunum detayları için kullanılabilecek dekoratif tepsi.",
    artworkKind: "engagement-tray",
    colors: [
      { name: "Rose Gold", hex: "#c79078" },
      { name: "Krem", hex: "#eee2d6" },
    ],
    dimensions: "Modele göre değişir.",
    featured: true,
    newArrival: false,
    sortOrder: 10,
    highlights: ["Söz", "Nişan", "Sunum"],
  },
  {
    slug: "rose-gold-dekor-seti",
    name: "Rose Gold Dekor Seti",
    categorySlug: "soz-nisan-dugun",
    conceptSlugs: ["pink-gold", "bride-to-be"],
    shortDescription: "Rose-gold ve pembe detaylarla modern dekor kombinasyonu.",
    description:
      "Söz, nişan ve özel kutlamalarda kullanılabilecek rose-gold tonlu dekoratif parçaların örnek kombinasyonu.",
    artworkKind: "rose-gold-set",
    colors: [
      { name: "Rose Gold", hex: "#c99178" },
      { name: "Pembe", hex: "#d87096" },
      { name: "Beyaz", hex: "#f6f1ec" },
    ],
    featured: true,
    newArrival: true,
    sortOrder: 11,
    highlights: ["Rose Gold", "Modern dekor", "Özel gün"],
  },
  {
    slug: "bride-to-be-parti-seti",
    name: "Bride to Be Parti Seti",
    categorySlug: "kina-bekarliga-veda",
    conceptSlugs: ["bride-to-be"],
    shortDescription: "Bekarlığa veda kutlamaları için eğlenceli aksesuar seti.",
    description:
      "Bride to Be temasını destekleyen küçük aksesuar ve dekoratif detayların bir araya geldiği örnek parti seti.",
    artworkKind: "bride-set",
    colors: [
      { name: "Pembe", hex: "#cf577f" },
      { name: "Beyaz", hex: "#f6f1ed" },
      { name: "Rose", hex: "#b98998" },
    ],
    featured: true,
    newArrival: false,
    sortOrder: 12,
    highlights: ["Bride to Be", "Parti aksesuarı", "Fotoğraf detayı"],
  },
  {
    slug: "kina-gecesi-aksesuar-seti",
    name: "Kına Gecesi Aksesuar Seti",
    categorySlug: "kina-bekarliga-veda",
    conceptSlugs: [],
    shortDescription: "Kına gecesine eşlik eden seçili eğlence ve dekor aksesuarları.",
    description:
      "Kına gecesinde masa, fotoğraf ve eğlence alanlarını tamamlayabilecek seçili aksesuarların örnek kombinasyonu.",
    artworkKind: "henna-set",
    colors: [
      { name: "Bordo", hex: "#8f3b50" },
      { name: "Altın", hex: "#c5a15e" },
    ],
    featured: false,
    newArrival: false,
    sortOrder: 13,
    highlights: ["Kına", "Aksesuar", "Dekor"],
  },
  {
    slug: "kisiye-ozel-magnet",
    name: "Kişiye Özel Magnet",
    categorySlug: "kisiye-ozel-hediyelik",
    conceptSlugs: ["baby-shower-soft", "pink-gold", "bride-to-be"],
    shortDescription: "Özel gün temasına göre kişiselleştirilebilen küçük hatıra.",
    description:
      "İsim, tarih veya temaya göre kişiselleştirilebilen magnet örneği. Detay ve üretim seçeneği güncel modele göre değişebilir.",
    artworkKind: "magnet",
    colors: [
      { name: "Pudra", hex: "#d8a7b6" },
      { name: "Krem", hex: "#eee3d7" },
      { name: "Rose Gold", hex: "#c7967e" },
    ],
    dimensions: "Model ve tasarıma göre değişir.",
    featured: true,
    newArrival: false,
    sortOrder: 14,
    highlights: ["Kişiselleştirme", "Magnet", "Hatıra"],
  },
  {
    slug: "hediye-sunum-sepeti",
    name: "Hediye Sunum Sepeti",
    categorySlug: "kisiye-ozel-hediyelik",
    conceptSlugs: ["baby-shower-soft", "pink-gold"],
    shortDescription: "Hediyelik ve özel sunumlar için dekoratif sepet.",
    description:
      "Baby shower, doğum, söz ve benzeri özel günlerde hediyelik veya sunum amacıyla kullanılabilecek dekoratif sepet.",
    artworkKind: "gift-basket",
    colors: [
      { name: "Doğal", hex: "#c6a17d" },
      { name: "Krem", hex: "#eee5db" },
      { name: "Pudra", hex: "#d8a3b5" },
    ],
    featured: false,
    newArrival: true,
    sortOrder: 15,
    highlights: ["Sunum", "Sepet", "Hediyelik"],
  },
  {
    slug: "saten-kurdele",
    name: "Saten Kurdele",
    categorySlug: "tul-kurdele-tuhafiye",
    conceptSlugs: ["pink-gold", "bride-to-be", "baby-shower-soft"],
    shortDescription: "Paketleme, süsleme ve el işi için saten kurdele seçenekleri.",
    description:
      "Paketleme, dekor ve el işi hazırlıklarında kullanılabilecek saten kurdele. Renk ve genişlik seçenekleri mağazadaki güncel stoğa göre değişebilir.",
    artworkKind: "ribbon",
    colors: [
      { name: "Pembe", hex: "#d87096" },
      { name: "Krem", hex: "#e9dece" },
      { name: "Bordo", hex: "#8f455c" },
    ],
    dimensions: "Genişlik ve metraj seçeneğine göre değişir.",
    featured: false,
    newArrival: false,
    sortOrder: 16,
    highlights: ["Saten", "Paketleme", "Süsleme"],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((product) => product.categorySlug === categorySlug);
}

export function getProductsByConcept(conceptSlug: string): Product[] {
  return products.filter((product) => product.conceptSlugs.includes(conceptSlug));
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameConcept = products.filter(
    (candidate) =>
      candidate.slug !== product.slug &&
      candidate.conceptSlugs.some((slug) => product.conceptSlugs.includes(slug)),
  );

  const sameCategory = products.filter(
    (candidate) =>
      candidate.slug !== product.slug &&
      candidate.categorySlug === product.categorySlug &&
      !sameConcept.some((item) => item.slug === candidate.slug),
  );

  return [...sameConcept, ...sameCategory].slice(0, limit);
}
