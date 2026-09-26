import "@fontsource-variable/fraunces/wght.css";
import "@fontsource-variable/nunito-sans/wght.css";
import "@fontsource-variable/nunito-sans/wght-italic.css";
import type { Metadata } from "next";

import { FloatingWhatsappCta } from "@/components/layout/floating-whatsapp-cta";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StructuredData } from "@/components/seo/structured-data";
import { assertContentIntegrity } from "@/lib/content-integrity";
import { getSiteUrl } from "@/lib/seo";
import {
  getStoreSettings,
  whatsappHref,
} from "@/lib/store-settings";

import "./globals.css";

assertContentIntegrity();

// Store settings are managed at runtime through the Supabase-backed CMS.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();

  return {
    metadataBase: new URL(getSiteUrl()),
    applicationName: settings.shortName,
    title: {
      default: `${settings.shortName} | Parti Malzemeleri & Tuhafiye Gemlik`,
      template: `%s | ${settings.shortName}`,
    },
    description:
      "Gemlik'te parti malzemeleri, helyumlu ve folyo balonlar, doğum günü, baby shower, cinsiyet partisi, söz-nişan-düğün ürünleri, hediyelikler ve tuhafiye seçenekleri.",
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getStoreSettings();
  const whatsappUrl = whatsappHref(settings);

  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body>
        <a href="#main-content" className="bt-skip-link">
          Ana içeriğe geç
        </a>
        <SiteHeader
          shortName={settings.shortName}
          whatsappUrl={whatsappUrl}
        />
        {children}
        <SiteFooter settings={settings} />
        <FloatingWhatsappCta
          whatsappUrl={whatsappUrl}
          shortName={settings.shortName}
        />
        <StructuredData settings={settings} />
      </body>
    </html>
  );
}
