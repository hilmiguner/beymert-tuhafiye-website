import type { Metadata } from "next";

import { getStoreSettings } from "@/lib/store-settings";

function withProtocol(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function getSiteUrl() {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim() ||
    "http://localhost:3000";

  return withProtocol(candidate).replace(/\/+$/, "");
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export async function buildPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}): Promise<Metadata> {
  const settings = await getStoreSettings();
  const socialTitle = absoluteTitle
    ? title
    : `${title} | ${settings.shortName}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: settings.shortName,
      title: socialTitle,
      description,
      url: absoluteUrl(path),
    },
    twitter: {
      card: "summary",
      title: socialTitle,
      description,
    },
  };
}
