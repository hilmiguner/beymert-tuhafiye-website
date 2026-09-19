export const siteConfig = {
  name: "Beymert Parti Malzemeleri Tuhafiye Tasarım",
  shortName: "Beymert",
  locationLabel: "Gemlik · Bursa",
  neighborhoodLabel: "Hamidiye · Gemlik · Bursa",
  phoneDisplay: "0543 337 70 04",
  phoneE164: "+905433377004",
  facebookUrl: "https://www.facebook.com/beymertasarim/",
  publicHours: {
    weekdayLabel: "Pazartesi – Cumartesi",
    weekdayHours: "10:00 – 19:30",
    sundayLabel: "Pazar",
    sundayHours: "Gelmeden önce iletişime geç",
  },
  addressVerification: {
    status: "pending-owner-verification",
    publicLabel: "Hamidiye · Gemlik · Bursa",
  },
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

export function directionsHref() {
  const query = `${siteConfig.name} Gemlik Bursa`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function mapEmbedHref() {
  const query = encodeURIComponent(`${siteConfig.name} Gemlik Bursa`);
  return `https://www.google.com/maps?q=${query}&output=embed`;
}
