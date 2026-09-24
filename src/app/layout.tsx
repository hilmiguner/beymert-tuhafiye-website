import "@fontsource-variable/fraunces/wght.css";
import "@fontsource-variable/nunito-sans/wght.css";
import "@fontsource-variable/nunito-sans/wght-italic.css";
import type { Metadata } from "next";

import { FloatingWhatsappCta } from "@/components/layout/floating-whatsapp-cta";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StructuredData } from "@/components/seo/structured-data";
import { assertContentIntegrity } from "@/lib/content-integrity";
import { getStoreSettings } from "@/lib/public-content";
import { getSiteUrl } from "@/lib/seo";

import "./globals.css";

assertContentIntegrity();

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

  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body>
        <a href="#main-content" className="bt-skip-link">
          Ana içeriğe geç
        </a>
        <SiteHeader settings={settings} />
        {children}
        <SiteFooter settings={settings} />
        <FloatingWhatsappCta settings={settings} />
        <StructuredData settings={settings} />
      </body>
    </html>
  );
}
