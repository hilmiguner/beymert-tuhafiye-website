import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import {
  directionsHref,
  phoneHref,
  whatsappHref,
  type StoreSettings,
} from "@/lib/store-settings";

export function SiteFooter({ settings }: { settings: StoreSettings }) {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-10 sm:py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandMark shortName={settings.shortName} />
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
                href={phoneHref(settings)}
                className="w-fit font-bold transition-colors hover:text-primary"
              >
                {settings.phoneDisplay}
              </a>
              <a
                href={whatsappHref(settings)}
                target="_blank"
                rel="noreferrer"
                className="w-fit font-bold transition-colors hover:text-primary"
              >
                WhatsApp
              </a>
              <a
                href={directionsHref(settings)}
                target="_blank"
                rel="noreferrer"
                className="w-fit font-bold transition-colors hover:text-primary"
              >
                Yol Tarifi
              </a>
              {settings.socialLinks.facebook ? (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-fit font-bold transition-colors hover:text-primary"
                >
                  Facebook
                </a>
              ) : null}
              {settings.socialLinks.instagram ? (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-fit font-bold transition-colors hover:text-primary"
                >
                  Instagram
                </a>
              ) : null}
              <span className="text-sm text-muted">{settings.address}</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {settings.shortName}. Tüm hakları saklıdır.
          </span>
          <span>Gemlik’te kutlamalara renk katıyoruz.</span>
        </div>
      </Container>
    </footer>
  );
}
