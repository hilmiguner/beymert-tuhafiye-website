import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CMS Önizleme",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function PreviewLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
