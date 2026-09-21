"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { whatsappHref } from "@/config/site";

const chips = ["Balon", "Doğum Günü", "Baby Shower", "Nişan & Düğün"];

export function HeroSection() {
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
              className="bt-eyebrow max-w-full text-[0.68rem] leading-5 text-primary sm:text-xs"
            >
              <span className="sm:hidden">Gemlik · Bursa</span>
              <span className="hidden sm:inline">
                Gemlik’te kutlamalara renk katıyoruz
              </span>
            </p>

            <h1 className="bt-display bt-balance mt-4 max-w-full text-[clamp(2.8rem,13vw,3.65rem)] leading-[0.91] font-semibold sm:mt-5 sm:text-[clamp(4.25rem,7vw,5.8rem)]">
              <span className="block overflow-hidden pb-[0.08em]">
                <span
                  data-hero-title-line
                  data-hero-reveal
                  className="block origin-left"
                >
                  Her kutlama
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span
                  data-hero-title-line
                  data-hero-reveal
                  className="block origin-left text-primary"
                >
                  biraz<span className="hidden sm:inline"> Beymert.</span>
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.08em] sm:hidden">
                <span
                  data-hero-title-line
                  data-hero-reveal
                  className="block origin-left text-primary"
                >
                  Beymert.
                </span>
              </span>
            </h1>

            <p
              data-hero-copy
              data-hero-reveal
              className="mt-5 max-w-full pr-1 text-[0.98rem] leading-7 text-muted sm:mt-6 sm:max-w-xl sm:pr-0 sm:text-lg sm:leading-8"
            >
              Balonlardan özel gün konseptlerine, kişiye özel hediyeliklerden
              tül ve kurdeleye kadar kutlamanı tamamlayan detayları bir araya
              getiriyoruz.
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
                href={whatsappHref()}
                target="_blank"
                rel="noreferrer"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto sm:min-w-44"
              >
                WhatsApp’tan Sor
              </ButtonLink>
            </div>

            <div className="mt-7 flex max-w-2xl flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  data-hero-chip
                  data-hero-reveal
                  className="rounded-pill border border-border/90 bg-surface/75 px-3.5 py-2 text-xs font-extrabold text-muted shadow-soft backdrop-blur-sm sm:text-sm"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div
            ref={visualRef}
            data-hero-scene
            data-hero-reveal
            className="relative mx-auto min-w-0 w-full max-w-[35rem] lg:max-w-[30rem] xl:max-w-none"
            aria-label="Beymert parti ürünlerini temsil eden dekoratif vitrin"
            role="img"
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
                className="absolute inset-x-4 bottom-4 z-10 rounded-[1.35rem] border border-white/90 bg-white/94 p-4 shadow-soft backdrop-blur-sm sm:hidden"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="bt-eyebrow text-primary">Beymert</span>
                    <p className="bt-display mt-1 text-[1.35rem] leading-tight font-semibold">
                      Balon · Konsept · Tasarım
                    </p>
                    <p className="mt-1.5 text-xs font-bold leading-5 text-muted">
                      Özel günlerini tamamlayan renkli detaylar.
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-sm font-black text-white"
                  >
                    B
                  </span>
                </div>
              </div>

              <div
                data-party-card
                data-depth="1.2"
                className="absolute hidden sm:left-[8%] sm:top-[48%] sm:block sm:w-[46%] sm:rotate-[-4deg] sm:rounded-card sm:border sm:border-white/80 sm:bg-[#fff6f8]/95 sm:p-5 sm:shadow-soft"
              >
                <span className="bt-eyebrow text-primary">Doğum Günü</span>
                <p className="bt-display mt-2 text-xl leading-tight font-semibold sm:text-3xl">
                  Balon & Konsept
                </p>
                <div className="mt-4 flex gap-2" aria-hidden="true">
                  <span className="size-7 rounded-full bg-primary" />
                  <span className="size-7 rounded-full bg-[#e7b39a]" />
                  <span className="size-7 rounded-full bg-[#f5d8e2]" />
                </div>
              </div>

              <div
                data-party-card
                data-depth="1.6"
                className="absolute hidden sm:right-[6%] sm:top-[58%] sm:block sm:w-[45%] sm:rotate-[5deg] sm:rounded-card sm:border sm:border-white/80 sm:bg-[#f8eee9]/95 sm:p-5 sm:shadow-soft"
              >
                <span className="bt-eyebrow text-secondary">Özel Günler</span>
                <p className="bt-display mt-2 text-2xl font-semibold sm:text-3xl">
                  Nişan & Tasarım
                </p>
                <div
                  className="mt-4 h-1.5 w-20 rounded-pill bg-secondary/55"
                  aria-hidden="true"
                />
              </div>

              <div
                data-party-card
                data-depth="2.1"
                className="absolute hidden sm:bottom-[6%] sm:left-[28%] sm:flex sm:w-[44%] sm:translate-x-0 sm:items-center sm:justify-between sm:gap-3 sm:rounded-card sm:border sm:border-white/80 sm:bg-white/95 sm:p-5 sm:shadow-soft"
              >
                <div>
                  <span className="bt-eyebrow text-muted">Beymert</span>
                  <p className="mt-1 text-sm font-extrabold sm:text-base">
                    Tül · Kurdele · Hediyelik
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-black text-white sm:size-12"
                >
                  B
                </span>
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
