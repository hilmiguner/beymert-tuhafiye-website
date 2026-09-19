import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";
import { Container } from "@/components/ui/container";
import {
  directionsHref,
  siteConfig,
  whatsappHref,
} from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <BrandMark />
            <p className="mt-5 max-w-md leading-7 text-muted">
              Parti malzemeleri, helyumlu balonlar, özel gün konseptleri,
              kişiye özel hazırlıklar ve tuhafiye ürünleri için Gemlik’te
              renkli bir buluşma noktası.
            </p>
          </div>

          <div>
            <p className="bt-eyebrow text-muted">Keşfet</p>
            <div className="mt-4 flex flex-col gap-3">
              {siteConfig.nav.slice(0, 4).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="w-fit font-bold transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="bt-eyebrow text-muted">İletişim</p>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href={`tel:${siteConfig.phoneE164}`}
                className="w-fit font-bold transition-colors hover:text-primary"
              >
                {siteConfig.phoneDisplay}
              </a>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noreferrer"
                className="w-fit font-bold transition-colors hover:text-primary"
              >
                WhatsApp
              </a>
              <a
                href={directionsHref()}
                target="_blank"
                rel="noreferrer"
                className="w-fit font-bold transition-colors hover:text-primary"
              >
                Yol Tarifi
              </a>
              <a
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-fit font-bold transition-colors hover:text-primary"
              >
                Facebook
              </a>
              <span className="text-sm text-muted">
                {siteConfig.addressVerification.publicLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Beymert. Tüm hakları saklıdır.</span>
          <span>Gemlik’te kutlamalara renk katıyoruz.</span>
        </div>
      </Container>
    </footer>
  );
}
