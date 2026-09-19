import "@fontsource-variable/fraunces/wght.css";
import "@fontsource-variable/nunito-sans/wght.css";
import type { Metadata } from "next";

import { FloatingWhatsappCta } from "@/components/layout/floating-whatsapp-cta";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StructuredData } from "@/components/seo/structured-data";
import { assertContentIntegrity } from "@/lib/content-integrity";
import { getSiteUrl } from "@/lib/seo";

import "./globals.css";

assertContentIntegrity();

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: "Beymert",
  title: {
    default: "Beymert | Parti Malzemeleri & Tuhafiye Gemlik",
    template: "%s | Beymert",
  },
  description:
    "Gemlik'te parti malzemeleri, helyumlu ve folyo balonlar, doğum günü, baby shower, cinsiyet partisi, söz-nişan-düğün ürünleri, hediyelikler ve tuhafiye seçenekleri.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <a href="#main-content" className="bt-skip-link">
          Ana içeriğe geç
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <FloatingWhatsappCta />
        <StructuredData />
      </body>
    </html>
  );
}
