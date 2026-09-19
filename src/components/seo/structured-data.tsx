import { directionsHref, siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

export function StructuredData() {
  const businessId = `${absoluteUrl("/") }#business`;
  const websiteId = `${absoluteUrl("/") }#website`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": businessId,
        name: siteConfig.name,
        url: absoluteUrl("/"),
        telephone: siteConfig.phoneE164,
        sameAs: [siteConfig.facebookUrl],
        hasMap: directionsHref(),
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
        name: siteConfig.shortName,
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
