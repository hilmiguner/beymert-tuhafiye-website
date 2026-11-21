"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeroCategoryArt } from "@/components/sections/hero-category-art";

const heroCategories = [
  { label: "Doğum Günü & Parti Süsleri", kind: "birthday" },
  { label: "Hediyelik Eşya & Hediye Kutuları", kind: "gift" },
  { label: "Bebek Karşılama & Süsleri", kind: "baby" },
  { label: "LED Işık & Dekorasyon", kind: "led" },
] as const;

type HeroSectionProps = {
  shortName: string;
  whatsappUrl: string;
};

export function HeroSection({
  shortName,
  whatsappUrl,
}: HeroSectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const visual = visualRef.current;

    if (!root || !visual) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      gsap.set(root.querySelectorAll("[data-hero-reveal]"), {
        clearProps: "all",
      });
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      timeline
        .from("[data-hero-eyebrow]", {
          autoAlpha: 0,
          y: 14,
          duration: 0.45,
        })
        .from(
          "[data-hero-title-line]",
          {
            autoAlpha: 0,
            yPercent: 65,
            rotate: 1.2,
            stagger: 0.09,
            duration: 0.72,
          },
          "-=0.22",
        )
        .from(
          "[data-hero-copy]",
          {
            autoAlpha: 0,
            y: 18,
            duration: 0.55,
          },
          "-=0.35",
        )
        .from(
          "[data-hero-actions]",
          {
            autoAlpha: 0,
            y: 16,
            duration: 0.48,
          },
          "-=0.3",
        )
        .from(
          "[data-hero-chip]",
          {
            autoAlpha: 0,
            y: 10,
            scale: 0.96,
            stagger: 0.055,
            duration: 0.36,
          },
          "-=0.28",
        )
        .from(
          "[data-hero-scene]",
          {
            autoAlpha: 0,
            scale: 0.96,
            y: 24,
            duration: 0.8,
            ease: "power4.out",
          },
          "-=0.7",
        )
        .from(
          "[data-balloon]",
          {
            autoAlpha: 0,
            y: 55,
            scale: 0.72,
            stagger: 0.08,
            duration: 0.62,
            ease: "back.out(1.6)",
          },
          "-=0.58",
        )
        .from(
          "[data-party-card]",
          {
            autoAlpha: 0,
            y: 26,
            rotate: -2,
            stagger: 0.08,
            duration: 0.52,
          },
          "-=0.45",
        );

      gsap.to("[data-balloon='1']", {
        y: -10,
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to("[data-balloon='2']", {
        y: -14,
        x: 4,
        duration: 4.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.35,
      });
      gsap.to("[data-balloon='3']", {
        y: -8,
        x: -3,
        duration: 3.7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.7,
      });
    }, root);

    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 1024px)",
    ).matches;

    let cleanupPointer: (() => void) | undefined;

    if (finePointer) {
      const layers = Array.from(
        visual.querySelectorAll<HTMLElement>("[data-depth]"),
      );

      const handlePointerMove = (event: PointerEvent) => {
        const bounds = visual.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;

        layers.forEach((layer) => {
          const depth = Number(layer.dataset.depth ?? 1);
          gsap.to(layer, {
            x: x * depth * 14,
            y: y * depth * 10,
            duration: 0.75,
            ease: "power3.out",
            overwrite: "auto",
          });
        });
      };

      const handlePointerLeave = () => {
        layers.forEach((layer) => {
          gsap.to(layer, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            overwrite: "auto",
          });
        });
      };

      visual.addEventListener("pointermove", handlePointerMove);
      visual.addEventListener("pointerleave", handlePointerLeave);

      cleanupPointer = () => {
        visual.removeEventListener("pointermove", handlePointerMove);
        visual.removeEventListener("pointerleave", handlePointerLeave);
      };
    }

    return () => {
      cleanupPointer?.();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="bt-hero bt-brand-glow relative isolate overflow-hidden"
    >
      <div className="bt-confetti-field" aria-hidden="true">
        <span className="bt-confetti bt-confetti-a" />
        <span className="bt-confetti bt-confetti-b" />
        <span className="bt-confetti bt-confetti-c" />
        <span className="bt-confetti bt-confetti-d" />
        <span className="bt-confetti bt-confetti-e" />
        <span className="bt-confetti bt-confetti-f" />
      </div>

      <Container className="relative z-10">
        <div className="grid min-h-0 items-center gap-10 py-10 sm:gap-12 sm:py-14 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[1.02fr_0.98fr] lg:gap-6 lg:py-8 xl:gap-8 xl:py-14">
          <div className="relative z-20 min-w-0 max-w-full overflow-hidden">
            <p
              data-hero-eyebrow
              data-hero-reveal
              className="bt-eyebrow max-w-full text-[0.67rem] leading-5 text-primary sm:text-xs"
            >
              GEMLİK · BURSA · PARTİLERİNİZE RENK KATIYORUZ
            </p>

            <h1
              aria-label="Gemlik’te Parti Malzemeleri, Hediyelik Eşya ve Kutlama Konseptleri"
              className="bt-display bt-balance mt-4 max-w-full text-[clamp(2.05rem,7.5vw,3rem)] leading-[1.02] font-semibold sm:mt-5 sm:text-[clamp(2.7rem,4.2vw,4.1rem)]"
            >
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-hero-title-line data-hero-reveal className="block origin-left">
                  Gemlik’te Parti{" "}
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-hero-title-line data-hero-reveal className="block origin-left text-primary">
                  Malzemeleri,{" "}
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-hero-title-line data-hero-reveal className="block origin-left">
                  Hediyelik Eşya ve{" "}
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-hero-title-line data-hero-reveal className="block origin-left text-primary">
                  Kutlama Konseptleri
                </span>
              </span>
            </h1>

            <p
              data-hero-copy
              data-hero-reveal
              className="bt-display mt-5 max-w-xl text-[1.18rem] leading-snug font-semibold text-foreground sm:mt-6 sm:text-[1.48rem]"
            >
              Hayalinizdeki Kutlamaları Gerçeğe Dönüştüren Her Detay Beymert’te!
            </p>
            <p
              data-hero-copy
              data-hero-reveal
              className="mt-3 max-w-xl text-[0.98rem] leading-7 text-muted sm:mt-4 sm:text-lg sm:leading-8"
            >
              Balonlardan özel gün konseptlerine, kişiye özel hediyeliklerden
              tül ve kurdeleye kadar partileriniz için aradığınız her şey
              Beymert’te.
            </p>

            <div
              data-hero-actions
              data-hero-reveal
              className="mt-7 flex w-full max-w-full flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap"
            >
              <ButtonLink
                href="/urunler"
                size="lg"
                className="w-full sm:w-auto sm:min-w-44"
              >
                Ürünleri Keşfet
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </ButtonLink>
              <ButtonLink
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto sm:min-w-44"
              >
                WhatsApp’tan Sor
              </ButtonLink>
            </div>

            <div
              className="mt-7 grid w-full max-w-[43rem] grid-cols-2 gap-3 sm:mt-8 sm:gap-4"
              aria-label="Beymert ürün grupları"
            >
              {heroCategories.map((category) => (
                <div
                  key={category.kind}
                  data-hero-chip
                  data-hero-reveal
                  className="flex min-w-0 flex-col items-center justify-end overflow-hidden rounded-[1.15rem] border border-white/85 bg-white/78 px-2 pb-3 pt-2 text-center shadow-soft backdrop-blur-sm sm:rounded-card sm:px-3 sm:pb-4"
                >
                  <HeroCategoryArt kind={category.kind} />
                  <span className="mt-1 text-[0.76rem] leading-5 font-extrabold text-foreground sm:text-sm">
                    {category.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={visualRef}
            data-hero-scene
            data-hero-reveal
            className="relative mx-auto min-w-0 w-full max-w-[35rem] lg:max-w-[30rem] xl:max-w-none"
            aria-label={`${shortName} parti ürünlerini temsil eden dekoratif vitrin`}
            role="group"
          >
            <div className="bt-hero-stage relative aspect-[1.03] min-h-[22rem] overflow-hidden rounded-[1.6rem] border border-white/75 bg-surface/72 p-4 shadow-lift backdrop-blur-md sm:aspect-[0.94] sm:min-h-[34rem] sm:rounded-[2rem] sm:p-6 lg:aspect-[1.03] lg:min-h-[28rem] xl:aspect-[0.94] xl:min-h-[34rem]">
              <div
                data-depth="1.8"
                className="absolute -right-8 top-8 size-44 rounded-full bg-[#f4d7e1]/75 blur-3xl sm:size-56"
              />
              <div
                data-depth="1.2"
                className="absolute -left-12 bottom-12 size-40 rounded-full bg-[#efd8ce]/70 blur-3xl sm:size-52"
              />

              <div
                data-depth="2.4"
                className="absolute left-[9%] top-[8%] sm:left-[8%] sm:top-[7%]"
                aria-hidden="true"
              >
                <span
                  data-balloon="1"
                  className="bt-balloon bt-balloon-primary block"
                />
              </div>
              <div
                data-depth="1.8"
                className="absolute right-[9%] top-[8%] sm:right-[13%] sm:top-[4%]"
                aria-hidden="true"
              >
                <span
                  data-balloon="2"
                  className="bt-balloon bt-balloon-rose block"
                />
              </div>
              <div
                data-depth="2"
                className="absolute left-1/2 top-[18%] -translate-x-1/2 sm:left-[39%] sm:top-[16%] sm:translate-x-0"
                aria-hidden="true"
              >
                <span
                  data-balloon="3"
                  className="bt-balloon bt-balloon-cream block"
                />
              </div>

              <div
                data-party-card
                className="absolute inset-x-4 bottom-4 z-10 rounded-[1.25rem] border border-white/90 bg-white/94 p-3 shadow-soft backdrop-blur-sm sm:hidden"
              >
                <p className="text-center text-[0.83rem] leading-6 font-extrabold text-foreground">
                  Helyum Balonlar · Butik Çiçekler
                </p>
                <p className="text-center text-[0.78rem] leading-5 font-bold text-secondary">
                  Tül, Kurdele & Aksesuar
                </p>
              </div>

              <div
                data-party-card
                data-depth="1.2"
                className="absolute hidden sm:left-[7%] sm:top-[48%] sm:block sm:w-[48%] sm:rotate-[-4deg] sm:rounded-card sm:border sm:border-white/80 sm:bg-[#fff6f8]/95 sm:p-5 sm:shadow-soft"
              >
                <p className="bt-display text-xl leading-tight font-semibold sm:text-[1.75rem]">
                  Helyum Balonlar
                </p>
                <div className="mt-3 flex gap-2" aria-hidden="true">
                  <span className="size-6 rounded-full bg-primary" />
                  <span className="size-6 rounded-full bg-[#e7b39a]" />
                  <span className="size-6 rounded-full bg-[#f5d8e2]" />
                </div>
              </div>

              <div
                data-party-card
                data-depth="1.6"
                className="absolute hidden sm:right-[5%] sm:top-[60%] sm:block sm:w-[45%] sm:rotate-[5deg] sm:rounded-card sm:border sm:border-white/80 sm:bg-[#f8eee9]/95 sm:p-5 sm:shadow-soft"
              >
                <p className="bt-display text-xl leading-tight font-semibold sm:text-[1.7rem]">
                  Butik Çiçekler
                </p>
                <div
                  className="mt-3 h-1.5 w-20 rounded-pill bg-secondary/45"
                  aria-hidden="true"
                />
              </div>

              <div
                data-party-card
                data-depth="2.1"
                className="absolute hidden sm:bottom-[6%] sm:left-[18%] sm:flex sm:w-[63%] sm:rotate-[-2deg] sm:items-center sm:justify-center sm:rounded-card sm:border sm:border-white/80 sm:bg-white/95 sm:p-5 sm:shadow-soft"
              >
                <p className="text-center text-sm leading-5 font-extrabold sm:text-base">
                  Tül, Kurdele & Aksesuar
                </p>
              </div>
            </div>

            <div
              data-depth="2.8"
              className="absolute -right-2 bottom-[13%] hidden rotate-6 rounded-pill border border-white/80 bg-primary px-4 py-2 text-xs font-black tracking-[0.12em] text-white uppercase shadow-lift sm:block"
            >
              Gemlik
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
