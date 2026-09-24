export type StoreSettings = {
  name: string;
  shortName: string;
  locationLabel: string;
  address: string;
  phoneDisplay: string;
  whatsapp: string;
  defaultWhatsappMessage: string;
  publicHours: {
    weekdayLabel: string;
    weekdayHours: string;
    sundayLabel: string;
    sundayHours: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
  };
  mapQuery: string;
};

export const defaultStoreSettings: StoreSettings = {
  name: "Beymert Parti Malzemeleri Tuhafiye Tasarım",
  shortName: "Beymert",
  locationLabel: "Gemlik · Bursa",
  address: "Hamidiye · Gemlik · Bursa",
  phoneDisplay: "0543 337 70 04",
  whatsapp: "+905433377004",
  defaultWhatsappMessage:
    "Merhaba, Beymert web sitesi üzerinden ürünleriniz hakkında bilgi almak istiyorum.",
  publicHours: {
    weekdayLabel: "Pazartesi – Cumartesi",
    weekdayHours: "10:00 – 19:30",
    sundayLabel: "Pazar",
    sundayHours: "Gelmeden önce iletişime geç",
  },
  socialLinks: {
    facebook: "https://www.facebook.com/beymertasarim/",
    instagram: "",
  },
  mapQuery: "Beymert Parti Malzemeleri Tuhafiye Tasarım Gemlik Bursa",
};

export const siteConfig = {
  locality: {
    neighborhood: "Hamidiye",
    city: "Gemlik",
    region: "Bursa",
    country: "TR",
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

function digitsOnly(value: string) {
  return value.replace(/[^0-9]/g, "");
}

export function phoneHref(settings: StoreSettings) {
  return `tel:+${digitsOnly(settings.phoneDisplay)}`;
}

export function whatsappHref(
  settingsOrMessage?: StoreSettings | string,
  message?: string,
) {
  const settings =
    typeof settingsOrMessage === "object"
      ? settingsOrMessage
      : defaultStoreSettings;
  const text =
    typeof settingsOrMessage === "string"
      ? settingsOrMessage
      : message ?? settings.defaultWhatsappMessage;

  return `https://wa.me/${digitsOnly(settings.whatsapp)}?text=${encodeURIComponent(text)}`;
}

export function directionsHref(
  settings: StoreSettings = defaultStoreSettings,
) {
  const query = settings.mapQuery || settings.name;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function mapEmbedHref(
  settings: StoreSettings = defaultStoreSettings,
) {
  const query = encodeURIComponent(settings.mapQuery || settings.name);
  return `https://www.google.com/maps?q=${query}&output=embed`;
}
