import type { Category } from "@/types/category";

export const categories: readonly Category[] = [
  {
    slug: "balonlar",
    name: "Balonlar",
    eyebrow: "Partinin imzası",
    shortDescription: "Helyum, folyo, krom ve tematik balon seçenekleri.",
    description:
      "Kutlamanın atmosferini tek dokunuşta değiştiren balon seçeneklerini keşfet. Helyumlu, folyo, krom ve farklı temalara uyum sağlayan alternatifler için Beymert’ten bilgi alabilirsin.",
    accent: "#d13f73",
    accentSoft: "#f9dce6",
    accentDark: "#8e3155",
    motif: "balloons",
    sortOrder: 1,
    highlights: ["Helyumlu balon", "Folyo balon", "Krom balon", "Tematik seçenekler"],
  },
  {
    slug: "dogum-gunu",
    name: "Doğum Günü",
    eyebrow: "Her yaşa kutlama",
    shortDescription: "Masa, dekor, mum ve tamamlayıcı doğum günü ürünleri.",
    description:
      "Çocuk ve yetişkin doğum günleri için masa üstü ürünlerden dekoratif tamamlayıcılara kadar farklı seçenekleri bir araya getiriyoruz.",
    accent: "#c85b69",
    accentSoft: "#fde8e7",
    accentDark: "#7c3640",
    motif: "birthday",
    sortOrder: 2,
    highlights: ["Masa dekoru", "Mumlar", "Tematik süsler", "Parti aksesuarları"],
  },
  {
    slug: "baby-shower",
    name: "Baby Shower",
    eyebrow: "Tatlı bir başlangıç",
    shortDescription: "Baby shower ve doğum karşılama hazırlıkları.",
    description:
      "Baby shower, hastane odası ve doğum karşılama kutlamaları için yumuşak renklerden tematik detaylara uzanan ürünleri keşfet.",
    accent: "#c08aa3",
    accentSoft: "#f7eaf0",
    accentDark: "#765165",
    motif: "baby",
    sortOrder: 3,
    highlights: ["Baby shower", "Doğum karşılama", "Hastane süsleme", "Masa detayları"],
  },
  {
    slug: "cinsiyet-partisi",
    name: "Cinsiyet Partisi",
    eyebrow: "Sürpriz anı",
    shortDescription: "Cinsiyet partisi için pembe, mavi ve nötr konseptler.",
    description:
      "Sürpriz anını tamamlayan balon, dekor ve masa ürünleriyle cinsiyet partisi konseptini tek bir dilde kurabilirsin.",
    accent: "#9676b9",
    accentSoft: "#eee8f6",
    accentDark: "#5e4778",
    motif: "reveal",
    sortOrder: 4,
    highlights: ["Pembe & mavi", "Nötr konsept", "Balon dekoru", "Masa aksesuarları"],
  },
  {
    slug: "soz-nisan-dugun",
    name: "Söz · Nişan · Düğün",
    eyebrow: "Özel anlara zarafet",
    shortDescription: "Söz, nişan, nikah ve düğün hazırlıklarının tamamlayıcıları.",
    description:
      "Söz, nişan, nikah ve düğün hazırlıklarında masa, sunum, kurdele ve dekoratif tamamlayıcılarla daha bütünlüklü bir görünüm oluştur.",
    accent: "#a36c55",
    accentSoft: "#f5e9e3",
    accentDark: "#684434",
    motif: "wedding",
    sortOrder: 5,
    highlights: ["Söz & nişan", "Nikah", "Düğün", "Sunum detayları"],
  },
  {
    slug: "kina-bekarliga-veda",
    name: "Kına & Bekarlığa Veda",
    eyebrow: "Geceye enerji kat",
    shortDescription: "Kına ve bekarlığa veda için eğlenceli parti detayları.",
    description:
      "Kına ve bekarlığa veda gecelerini daha enerjik hale getiren aksesuar, dekor ve konsept tamamlayıcılarını bir arada keşfet.",
    accent: "#ba4e70",
    accentSoft: "#f8e1e8",
    accentDark: "#793047",
    motif: "celebration",
    sortOrder: 6,
    highlights: ["Kına", "Bride to be", "Parti aksesuarları", "Dekoratif detaylar"],
  },
  {
    slug: "kisiye-ozel-hediyelik",
    name: "Kişiye Özel Hediyelik",
    eyebrow: "Küçük ama özel",
    shortDescription: "Magnet, sepet ve kişiye özel hazırlanan hediyelikler.",
    description:
      "Kutlamanı kişiselleştiren magnet, sepet ve hediyelik seçenekleriyle misafirlerin için hatırlanacak küçük detaylar hazırlayabilirsin.",
    accent: "#d98772",
    accentSoft: "#fae9e3",
    accentDark: "#8a5142",
    motif: "gift",
    sortOrder: 7,
    highlights: ["Magnet", "Hediyelik", "Sunum sepeti", "Kişiselleştirme"],
  },
  {
    slug: "tul-kurdele-tuhafiye",
    name: "Tül · Kurdele · Tuhafiye",
    eyebrow: "Detayları tamamla",
    shortDescription: "Tül, kurdele ve yaratıcı hazırlıklara eşlik eden tuhafiye ürünleri.",
    description:
      "Dekor, paketleme ve el işi hazırlıklarında kullanabileceğin tül, kurdele ve seçili tuhafiye ürünlerini Beymert’te keşfet.",
    accent: "#b28b72",
    accentSoft: "#f4ebe5",
    accentDark: "#705744",
    motif: "ribbon",
    sortOrder: 8,
    highlights: ["Tül", "Kurdele", "Paketleme", "Tuhafiye"],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
