import type { Concept } from "@/types/concept";

export const concepts = [
  {
    slug: "safari-party",
    name: "Safari Party",
    eyebrow: "Macera dolu kutlama",
    shortDescription: "Yeşil, bej ve sıcak toprak tonlarıyla doğal bir parti teması.",
    description:
      "Safari Party; balon, masa süsü ve küçük hayvan detaylarını doğal tonlarla bir araya getirir. Özellikle çocuk doğum günlerinde enerjik ama dengeli bir atmosfer için kullanılabilir.",
    motif: "safari",
    colors: {
      primary: "#75865a",
      secondary: "#c99a66",
      background: "#f3efe3",
      foreground: "#34402a",
    },
    relatedCategorySlugs: ["balonlar", "dogum-gunu", "kisiye-ozel-hediyelik"],
    gallery: [
      {
        title: "Karşılama alanı",
        description: "Balon grubu ve doğal tonlarda ana tema.",
        variant: "hero",
      },
      {
        title: "Masa düzeni",
        description: "Safari renkleriyle uyumlu masa üstü detayları.",
        variant: "table",
      },
      {
        title: "Küçük dokunuşlar",
        description: "Hediyelik ve kişiselleştirilmiş tamamlayıcılar.",
        variant: "detail",
      },
    ],
    sortOrder: 1,
  },
  {
    slug: "prenses-partisi",
    name: "Prenses Partisi",
    eyebrow: "Masalsı ve zarif",
    shortDescription: "Pembe, pudra ve altın dokunuşlarla yumuşak bir kutlama.",
    description:
      "Prenses Partisi; pudra pembe, inci beyazı ve sıcak metalik tonlarla masalsı bir görünüm oluşturur. Balonlardan masa detaylarına kadar aynı renk dili sürdürülebilir.",
    motif: "princess",
    colors: {
      primary: "#d980a8",
      secondary: "#d6b07a",
      background: "#fff0f5",
      foreground: "#6f3551",
    },
    relatedCategorySlugs: ["balonlar", "dogum-gunu", "kisiye-ozel-hediyelik"],
    gallery: [
      {
        title: "Taç dokunuşu",
        description: "Pembe ve altın tonların öne çıktığı ana dekor.",
        variant: "hero",
      },
      {
        title: "Masa sahnesi",
        description: "Yumuşak tonlarda bütünlüklü masa düzeni.",
        variant: "table",
      },
      {
        title: "Hediyelik detayları",
        description: "Temayı küçük kişisel dokunuşlarla tamamla.",
        variant: "detail",
      },
    ],
    sortOrder: 2,
  },
  {
    slug: "unicorn-party",
    name: "Unicorn Party",
    eyebrow: "Pastel ve eğlenceli",
    shortDescription: "Lila, pembe ve gökkuşağı detaylarıyla renkli bir tema.",
    description:
      "Unicorn Party; pastel pembe, lila ve açık mavi tonlarını küçük parlak detaylarla birleştirir. Çocuk partilerinde canlı ancak yumuşak bir renk kompozisyonu sunar.",
    motif: "unicorn",
    colors: {
      primary: "#b986d3",
      secondary: "#e58dac",
      background: "#f7f1ff",
      foreground: "#5d3e71",
    },
    relatedCategorySlugs: ["balonlar", "dogum-gunu", "kisiye-ozel-hediyelik"],
    gallery: [
      {
        title: "Pastel balon duvarı",
        description: "Pembe, lila ve açık mavi tonların birlikteliği.",
        variant: "hero",
      },
      {
        title: "Renkli masa",
        description: "Gökkuşağı vurgularıyla yumuşak masa düzeni.",
        variant: "table",
      },
      {
        title: "Parlak detaylar",
        description: "Küçük metalik ve kişisel dokunuşlar.",
        variant: "detail",
      },
    ],
    sortOrder: 3,
  },
  {
    slug: "futbol-partisi",
    name: "Futbol Partisi",
    eyebrow: "Maç günü enerjisi",
    shortDescription: "Yeşil, beyaz ve takım renkleriyle sportif kutlama.",
    description:
      "Futbol Partisi; saha yeşili, beyaz çizgiler ve istenen takım renkleriyle güçlü bir tema oluşturur. Balonlar, masa üstü detaylar ve küçük aksesuarlarla desteklenebilir.",
    motif: "football",
    colors: {
      primary: "#438a58",
      secondary: "#f0f0e8",
      background: "#eaf4ec",
      foreground: "#23452e",
    },
    relatedCategorySlugs: ["balonlar", "dogum-gunu", "kisiye-ozel-hediyelik"],
    gallery: [
      {
        title: "Saha teması",
        description: "Yeşil zemin ve sportif ana dekor.",
        variant: "hero",
      },
      {
        title: "Maç masası",
        description: "Takım renkleriyle kişiselleştirilebilen masa düzeni.",
        variant: "table",
      },
      {
        title: "Taraftar detayları",
        description: "Küçük hediyelik ve aksesuarlarla konsepti tamamla.",
        variant: "detail",
      },
    ],
    sortOrder: 4,
  },
  {
    slug: "pink-gold",
    name: "Pink & Gold",
    eyebrow: "Beymert imzası",
    shortDescription: "Pembe, beyaz ve rose-gold dokunuşlarla modern kutlama.",
    description:
      "Pink & Gold; Beymert’in sosyal içeriklerinde sık karşılaşılan pembe, beyaz ve sıcak metalik hissi bir araya getirir. Doğum günü, nişan veya özel kutlamalara uyarlanabilir.",
    motif: "pink-gold",
    colors: {
      primary: "#d13f73",
      secondary: "#d9a58c",
      background: "#fff1f5",
      foreground: "#673147",
    },
    relatedCategorySlugs: ["balonlar", "dogum-gunu", "soz-nisan-dugun"],
    gallery: [
      {
        title: "Pembe ana sahne",
        description: "Rose-gold detaylarla öne çıkan modern dekor.",
        variant: "hero",
      },
      {
        title: "Kutlama masası",
        description: "Beyaz taban üzerinde pembe ve sıcak metalik vurgular.",
        variant: "table",
      },
      {
        title: "Işıltılı detaylar",
        description: "Balon ve küçük aksesuarlarla dengeli parlaklık.",
        variant: "detail",
      },
    ],
    sortOrder: 5,
  },
  {
    slug: "blue-silver",
    name: "Blue & Silver",
    eyebrow: "Serin ve modern",
    shortDescription: "Mavi, beyaz ve gümüş hissiyle temiz bir kutlama dili.",
    description:
      "Blue & Silver; açık ve koyu mavi tonlarını beyaz ve gümüş hissiyle dengeler. Doğum günü, baby shower ve tematik çocuk partilerine uyarlanabilir.",
    motif: "blue-silver",
    colors: {
      primary: "#648bb5",
      secondary: "#b9c2ca",
      background: "#edf4fa",
      foreground: "#314a64",
    },
    relatedCategorySlugs: ["balonlar", "dogum-gunu", "baby-shower"],
    gallery: [
      {
        title: "Mavi balon sahnesi",
        description: "Beyaz ve gümüş vurgulu ana kompozisyon.",
        variant: "hero",
      },
      {
        title: "Temiz masa düzeni",
        description: "Serin renklerle dengeli bir masa sahnesi.",
        variant: "table",
      },
      {
        title: "Gümüş dokunuşlar",
        description: "Küçük aksesuarlarla parlaklık ekle.",
        variant: "detail",
      },
    ],
    sortOrder: 6,
  },
  {
    slug: "baby-shower-soft",
    name: "Soft Baby Shower",
    eyebrow: "Yumuşak başlangıç",
    shortDescription: "Krem, pudra ve pastel tonlarla sakin baby shower teması.",
    description:
      "Soft Baby Shower; pembe veya maviye bağlı kalmadan krem ve pastel tonları merkezine alır. Baby shower ve doğum karşılama organizasyonlarında sade bir seçenek sunar.",
    motif: "baby",
    colors: {
      primary: "#c895a7",
      secondary: "#d7c4ae",
      background: "#faf5ef",
      foreground: "#65545a",
    },
    relatedCategorySlugs: ["baby-shower", "balonlar", "kisiye-ozel-hediyelik"],
    gallery: [
      {
        title: "Pastel karşılama",
        description: "Krem ve pudra tonlarında yumuşak ana alan.",
        variant: "hero",
      },
      {
        title: "Baby masa",
        description: "Minimal ve sakin masa üstü detayları.",
        variant: "table",
      },
      {
        title: "Hatıra köşesi",
        description: "Kişiye özel hediyeliklerle tamamlanan küçük alan.",
        variant: "detail",
      },
    ],
    sortOrder: 7,
  },
  {
    slug: "bride-to-be",
    name: "Bride to Be",
    eyebrow: "Kutlamaya hazır",
    shortDescription: "Pembe, beyaz ve parlak detaylarla bekarlığa veda teması.",
    description:
      "Bride to Be; pembe ve beyaz tabanı parlak aksesuarlarla birleştiren enerjik bir bekarlığa veda konseptidir. Balon ve parti aksesuarlarıyla kolayca zenginleştirilebilir.",
    motif: "bride",
    colors: {
      primary: "#cf577f",
      secondary: "#b88a9a",
      background: "#fff0f5",
      foreground: "#6d3248",
    },
    relatedCategorySlugs: ["kina-bekarliga-veda", "balonlar", "kisiye-ozel-hediyelik"],
    gallery: [
      {
        title: "Bride ana alanı",
        description: "Pembe ve beyaz vurgulu karşılama dekoru.",
        variant: "hero",
      },
      {
        title: "Parti masası",
        description: "Eğlenceli aksesuarlarla hazırlanan masa düzeni.",
        variant: "table",
      },
      {
        title: "Hatıra detayları",
        description: "Kişiye özel küçük hediyelik ve fotoğraf köşesi.",
        variant: "detail",
      },
    ],
    sortOrder: 8,
  },
] as const satisfies readonly Concept[];

export function getConceptBySlug(slug: string): Concept | undefined {
  return concepts.find((concept) => concept.slug === slug);
}
