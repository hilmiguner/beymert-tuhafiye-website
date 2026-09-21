import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

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

export function buildPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}): Metadata {
  const socialTitle = absoluteTitle
    ? title
    : `${title} | ${siteConfig.shortName}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: siteConfig.shortName,
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
