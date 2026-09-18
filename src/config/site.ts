export const siteConfig = {
  name: "Beymert Parti Malzemeleri Tuhafiye Tasarım",
  shortName: "Beymert",
  locationLabel: "Gemlik · Bursa",
  phoneDisplay: "0543 337 70 04",
  phoneE164: "+905433377004",
  facebookUrl: "https://www.facebook.com/beymertasarim/",
  nav: [
    { label: "Ürünler", href: "/urunler" },
    { label: "Konseptler", href: "/konseptler" },
    { label: "Galeri", href: "/galeri" },
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "İletişim", href: "/iletisim" },
  ],
} as const;

export function whatsappHref(message?: string) {
  const text =
    message ??
    "Merhaba, Beymert web sitesi üzerinden ürünleriniz hakkında bilgi almak istiyorum.";

  return `https://wa.me/${siteConfig.phoneE164.replace("+", "")}?text=${encodeURIComponent(text)}`;
}
