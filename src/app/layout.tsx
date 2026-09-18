import "@fontsource-variable/fraunces/wght.css";
import "@fontsource-variable/nunito-sans/wght.css";
import type { Metadata } from "next";

import { FloatingWhatsappCta } from "@/components/layout/floating-whatsapp-cta";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Beymert | Parti Malzemeleri & Tuhafiye Gemlik",
    template: "%s | Beymert",
  },
  description:
    "Gemlik'te parti malzemeleri, helyumlu ve folyo balonlar, doğum günü, baby shower, cinsiyet partisi, söz-nişan-düğün ürünleri, hediyelikler ve tuhafiye seçenekleri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <FloatingWhatsappCta />
      </body>
    </html>
  );
}
