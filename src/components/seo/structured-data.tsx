import {
  directionsHref,
  siteConfig,
  type StoreSettings,
} from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

export function StructuredData({ settings }: { settings: StoreSettings }) {
  const businessId = `${absoluteUrl("/")}#business`;
  const websiteId = `${absoluteUrl("/")}#website`;
  const sameAs = [
    settings.socialLinks.facebook,
    settings.socialLinks.instagram,
  ].filter(Boolean);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": businessId,
        name: settings.name,
        url: absoluteUrl("/"),
        telephone: settings.phoneDisplay,
        sameAs,
        hasMap: directionsHref(settings),
        address: {
          "@type": "PostalAddress",
          addressLocality: siteConfig.locality.city,
          addressRegion: siteConfig.locality.region,
          addressCountry: siteConfig.locality.country,
        },
        areaServed: {
          "@type": "City",
          name: siteConfig.locality.city,
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: absoluteUrl("/"),
        name: settings.shortName,
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
