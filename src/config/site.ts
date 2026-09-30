export const siteConfig = {
  name: "Beymert Tuhafiye",
  shortName: "Beymert Tuhafiye",
  canonicalOrigin: "https://www.beymerttuhafiye.com",
  locationLabel: "Gemlik · Bursa",
  neighborhoodLabel: "Hamidiye Mahallesi · Gemlik · Bursa",
  locality: {
    neighborhood: "Hamidiye",
    city: "Gemlik",
    region: "Bursa",
    country: "TR",
  },
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
    status: "owner-verified",
    publicLabel:
      "Hamidiye Mahallesi, Kuşlu Sokak, Semöz Apartmanı No: 2/A, Gemlik/Bursa",
  },
  nav: [
    { label: "Ürünler", href: "/urunler" },
    { label: "Kategoriler", href: "/kategoriler" },
    { label: "Konseptler", href: "/konseptler" },
    { label: "Galeri", href: "/galeri" },
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "İletişim", href: "/iletisim" },
  ],
} as const;

export function whatsappHref(message?: string) {
  const text =
    message ??
    "Merhaba, Beymert Tuhafiye web sitesi üzerinden ürünleriniz hakkında bilgi almak istiyorum.";

  return `https://wa.me/${siteConfig.phoneE164.replace("+", "")}?text=${encodeURIComponent(text)}`;
}

export function directionsHref() {
  const query = siteConfig.addressVerification.publicLabel;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function mapEmbedHref() {
  const query = encodeURIComponent(siteConfig.addressVerification.publicLabel);
  return `https://www.google.com/maps?q=${query}&output=embed`;
}
