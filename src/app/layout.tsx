import "@fontsource-variable/fraunces/wght.css";
import "@fontsource-variable/nunito-sans/wght.css";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Beymert Tuhafiye | Parti Malzemeleri",
    template: "%s | Beymert Tuhafiye",
  },
  description:
    "Parti malzemeleri, özel gün konseptleri ve kutlamalar için ürün seçeneklerini Beymert Tuhafiye'de keşfedin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
