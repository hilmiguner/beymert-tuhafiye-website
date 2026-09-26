import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";
import {
  directionsHref,
  type StoreSettings,
} from "@/lib/store-settings";

function parseHoursRange(value: string) {
  const match = value.match(
    /(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/,
  );

  if (!match) return null;

  const [, openHour, openMinute, closeHour, closeMinute] = match;
  return {
    opens: `${openHour.padStart(2, "0")}:${openMinute}`,
    closes: `${closeHour.padStart(2, "0")}:${closeMinute}`,
  };
}

export function StructuredData({ settings }: { settings: StoreSettings }) {
  const businessId = `${absoluteUrl("/")}#business`;
  const websiteId = `${absoluteUrl("/")}#website`;
  const sameAs = [
    settings.socialLinks.facebook,
    settings.socialLinks.instagram,
  ].filter(Boolean);
  const weekdayHours = parseHoursRange(settings.openingHours.weekdayHours);
  const hasDetailedStreetAddress = /\d/.test(settings.address);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Store",
        "@id": businessId,
        name: settings.siteName,
        alternateName: settings.shortName,
        description:
          "Gemlik’te parti malzemeleri, balon, özel gün konseptleri, hediyelik, tül ve kurdele ürünleri sunan yerel mağaza.",
        url: absoluteUrl("/"),
        telephone: settings.whatsapp || settings.phoneDisplay,
        sameAs,
        hasMap: directionsHref(settings),
        priceRange: "₺₺",
        address: {
          "@type": "PostalAddress",
          ...(hasDetailedStreetAddress
            ? { streetAddress: settings.address }
            : {}),
          addressLocality: siteConfig.locality.city,
          addressRegion: siteConfig.locality.region,
          addressCountry: siteConfig.locality.country,
        },
        areaServed: {
          "@type": "City",
          name: siteConfig.locality.city,
        },
        ...(weekdayHours
          ? {
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ],
                opens: weekdayHours.opens,
                closes: weekdayHours.closes,
              },
            }
          : {}),
        knowsAbout: [
          "Parti malzemeleri",
          "Helyumlu balon",
          "Doğum günü malzemeleri",
          "Baby shower",
          "Cinsiyet partisi",
          "Söz ve nişan ürünleri",
          "Tuhafiye",
          "Tül",
          "Kurdele",
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: absoluteUrl("/"),
        name: settings.shortName,
        alternateName: settings.siteName,
        inLanguage: "tr-TR",
        publisher: {
          "@id": businessId,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
