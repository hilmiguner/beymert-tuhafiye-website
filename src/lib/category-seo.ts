import type { Category } from "@/types/category";

type CategorySeoContent = {
  title: string;
  description: string;
  localHeading: string;
  localDescription: string;
  localPageHref: string;
  localPageLabel: string;
  regionalPageHref: string;
  regionalPageLabel: string;
};

const categorySeoBySlug: Record<string, Omit<CategorySeoContent, "description"> & { description: string }> = {
  balonlar: {
    title: "Gemlik Balon & Helyumlu Balon",
    description:
      "Gemlik’te helyumlu, folyo, krom ve tematik balon seçeneklerini Beymert’te keşfedin; güncel renk ve stok bilgisini mağazadan doğrulayın.",
    localHeading: "Gemlik’te balon seçimini kutlamanın temasına göre yap.",
    localDescription:
      "Rakam, folyo, lateks veya krom balon seçerken etkinliğin türü, renk paleti ve kullanım alanı birlikte düşünülmelidir. Güncel seçenekleri katalogdan inceleyip mağazadan stok doğrulaması yapabilirsin.",
    localPageHref: "/gemlik-parti-malzemeleri",
    localPageLabel: "Gemlik parti malzemeleri rehberine git",
    regionalPageHref: "/bursa-parti-malzemeleri",
    regionalPageLabel: "Bursa parti malzemeleri sayfasını incele",
  },
  "dogum-gunu": {
    title: "Gemlik Doğum Günü Malzemeleri",
    description:
      "Gemlik’te doğum günü malzemeleri, masa dekoru, mum, tematik süs ve parti aksesuarlarını Beymert’te keşfedin.",
    localHeading: "Gemlik’te doğum günü hazırlığını tek tema etrafında toparla.",
    localDescription:
      "Doğum günü hazırlığında masa detayları, balonlar, mumlar ve tematik aksesuarların aynı renk veya tema dili içinde seçilmesi daha bütünlüklü bir görünüm sağlar.",
    localPageHref: "/gemlik-parti-malzemeleri",
    localPageLabel: "Gemlik parti malzemeleri sayfasına git",
    regionalPageHref: "/bursa-parti-malzemeleri",
    regionalPageLabel: "Bursa parti malzemeleri sayfasını incele",
  },
  "baby-shower": {
    title: "Gemlik Baby Shower Malzemeleri",
    description:
      "Gemlik’te baby shower, doğum karşılama ve hastane süsleme için balon, masa ve tamamlayıcı ürünleri Beymert’te keşfedin.",
    localHeading: "Baby shower hazırlığında renk ve ürün gruplarını birlikte planla.",
    localDescription:
      "Baby shower veya doğum karşılama hazırlığında balon, masa detayları ve küçük dekoratif parçaları aynı konsept altında değerlendirmek seçim sürecini kolaylaştırır.",
    localPageHref: "/gemlik-parti-malzemeleri",
    localPageLabel: "Gemlik parti malzemeleri sayfasına git",
    regionalPageHref: "/bursa-parti-malzemeleri",
    regionalPageLabel: "Bursa parti malzemeleri sayfasını incele",
  },
  "cinsiyet-partisi": {
    title: "Gemlik Cinsiyet Partisi Malzemeleri",
    description:
      "Gemlik’te cinsiyet partisi için pembe, mavi ve nötr konseptlere uygun balon, dekor ve masa ürünlerini Beymert’te keşfedin.",
    localHeading: "Sürpriz anını tek bir renk ve konsept diliyle destekle.",
    localDescription:
      "Cinsiyet partisi hazırlığında balon ve masa ürünleri genellikle konseptin ana görsel dilini oluşturur. Renk ve stok durumunu etkinlik öncesinde mağazadan doğrulayabilirsin.",
    localPageHref: "/gemlik-parti-malzemeleri",
    localPageLabel: "Gemlik parti malzemeleri sayfasına git",
    regionalPageHref: "/bursa-parti-malzemeleri",
    regionalPageLabel: "Bursa parti malzemeleri sayfasını incele",
  },
  "soz-nisan-dugun": {
    title: "Gemlik Söz, Nişan & Düğün Malzemeleri",
    description:
      "Gemlik’te söz, nişan, nikah ve düğün hazırlıkları için sunum, dekor, kurdele ve tamamlayıcı ürünleri Beymert’te keşfedin.",
    localHeading: "Söz, nişan ve düğün detaylarını birbiriyle uyumlu seç.",
    localDescription:
      "Masa, sunum, kurdele ve dekoratif tamamlayıcıları aynı renk ailesi veya konsept üzerinden planlamak özel gün hazırlığını daha tutarlı hale getirir.",
    localPageHref: "/gemlik-parti-malzemeleri",
    localPageLabel: "Gemlik parti malzemeleri sayfasına git",
    regionalPageHref: "/bursa-parti-malzemeleri",
    regionalPageLabel: "Bursa parti malzemeleri sayfasını incele",
  },
  "kina-bekarliga-veda": {
    title: "Gemlik Kına & Bekarlığa Veda Malzemeleri",
    description:
      "Gemlik’te kına gecesi ve bekarlığa veda için parti aksesuarı, dekor ve konsept tamamlayıcılarını Beymert’te keşfedin.",
    localHeading: "Kına ve bekarlığa veda hazırlığını konsept üzerinden kur.",
    localDescription:
      "Aksesuar, balon ve dekor parçalarını aynı tema içinde değerlendirmek hazırlığı kolaylaştırır. Mağazaya gelmeden önce güncel ürün ve renk seçeneklerini sorabilirsin.",
    localPageHref: "/gemlik-parti-malzemeleri",
    localPageLabel: "Gemlik parti malzemeleri sayfasına git",
    regionalPageHref: "/bursa-parti-malzemeleri",
    regionalPageLabel: "Bursa parti malzemeleri sayfasını incele",
  },
  "kisiye-ozel-hediyelik": {
    title: "Gemlik Kişiye Özel Hediyelik",
    description:
      "Gemlik’te kişiye özel hediyelik, magnet, sunum sepeti ve özel gün tamamlayıcılarını Beymert’te keşfedin.",
    localHeading: "Küçük hediyelikleri kutlamanın konseptiyle eşleştir.",
    localDescription:
      "Hediyelik ve sunum detayları, ana kutlama temasındaki renk ve malzemelerle birlikte düşünüldüğünde daha bütünlüklü bir sonuç verir.",
    localPageHref: "/gemlik-parti-malzemeleri",
    localPageLabel: "Gemlik parti malzemeleri sayfasına git",
    regionalPageHref: "/bursa-parti-malzemeleri",
    regionalPageLabel: "Bursa parti malzemeleri sayfasını incele",
  },
  "tul-kurdele-tuhafiye": {
    title: "Gemlik Tül, Kurdele & Tuhafiye",
    description:
      "Gemlik’te tül, saten kurdele, paketleme ve özel gün hazırlıklarında kullanılan tuhafiye ürünlerini Beymert’te keşfedin.",
    localHeading: "Tül ve kurdeleyi kullanım amacına göre karşılaştır.",
    localDescription:
      "Paketleme, masa süslemesi, söz-nişan hazırlığı veya doğum günü dekoru için gerekli renk, doku ve miktar farklı olabilir. Belirli bir ton arıyorsan mağazada karşılaştırma yapmak faydalıdır.",
    localPageHref: "/gemlik-tuhafiye",
    localPageLabel: "Gemlik tuhafiye sayfasına git",
    regionalPageHref: "/bursa-tuhafiye",
    regionalPageLabel: "Bursa tuhafiye sayfasını incele",
  },
};

export function getCategorySeoContent(category: Category): CategorySeoContent {
  const configured = categorySeoBySlug[category.slug];

  if (configured) {
    return configured;
  }

  return {
    title: `${category.name} | Gemlik`,
    description: `${category.shortDescription} Gemlik’teki Beymert mağazasında güncel ürün ve stok bilgisini doğrulayabilirsin.`,
    localHeading: `Gemlik’te ${category.name.toLocaleLowerCase("tr-TR")} seçeneklerini keşfet.`,
    localDescription:
      "Ürün seçenekleri ve stok durumu dönemsel olarak değişebilir. Güncel bilgi için mağazaya gelmeden önce WhatsApp üzerinden iletişime geçebilirsin.",
    localPageHref: "/kategoriler",
    localPageLabel: "Tüm kategorileri incele",
    regionalPageHref: "/iletisim",
    regionalPageLabel: "Mağaza iletişim bilgilerini gör",
  };
}
