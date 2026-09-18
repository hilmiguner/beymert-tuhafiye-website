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
        <div className="grid min-h-[calc(100svh-4.5rem)] items-center gap-12 py-12 sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:py-14">
          <div className="relative z-20">
            <p
              data-hero-eyebrow
              data-hero-reveal
              className="bt-eyebrow text-primary"
            >
              Gemlik’te kutlamalara renk katıyoruz
            </p>

            <h1 className="bt-display bt-balance mt-5 max-w-4xl text-[clamp(3.15rem,10vw,5.8rem)] leading-[0.9] font-semibold">
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
                  biraz Beymert.
                </span>
              </span>
            </h1>

            <p
              data-hero-copy
              data-hero-reveal
              className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8"
            >
              Balonlardan özel gün konseptlerine, kişiye özel hediyeliklerden
              tül ve kurdeleye kadar kutlamanı tamamlayan detayları bir araya
              getiriyoruz.
            </p>

            <div
              data-hero-actions
              data-hero-reveal
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <ButtonLink href="/urunler" size="lg" className="sm:min-w-44">
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
                className="sm:min-w-44"
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
            className="relative mx-auto w-full max-w-[35rem] lg:max-w-none"
            aria-label="Beymert parti ürünlerini temsil eden dekoratif vitrin"
            role="img"
          >
            <div className="bt-hero-stage relative aspect-[0.94] min-h-[28rem] overflow-hidden rounded-[2rem] border border-white/75 bg-surface/72 p-4 shadow-lift backdrop-blur-md sm:min-h-[34rem] sm:p-6">
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
                className="absolute left-[8%] top-[7%]"
                aria-hidden="true"
              >
                <span
                  data-balloon="1"
                  className="bt-balloon bt-balloon-primary block"
                />
              </div>
              <div
                data-depth="1.8"
                className="absolute right-[13%] top-[4%]"
                aria-hidden="true"
              >
                <span
                  data-balloon="2"
                  className="bt-balloon bt-balloon-rose block"
                />
              </div>
              <div
                data-depth="2"
                className="absolute left-[39%] top-[16%]"
                aria-hidden="true"
              >
                <span
                  data-balloon="3"
                  className="bt-balloon bt-balloon-cream block"
                />
              </div>

              <div
                data-party-card
                data-depth="1.2"
                className="absolute left-[8%] top-[48%] w-[46%] rotate-[-4deg] rounded-card border border-white/80 bg-[#fff6f8]/95 p-4 shadow-soft sm:p-5"
              >
                <span className="bt-eyebrow text-primary">Doğum Günü</span>
                <p className="bt-display mt-2 text-2xl font-semibold sm:text-3xl">
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
                className="absolute right-[6%] top-[58%] w-[45%] rotate-[5deg] rounded-card border border-white/80 bg-[#f8eee9]/95 p-4 shadow-soft sm:p-5"
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
                className="absolute bottom-[6%] left-[28%] flex w-[44%] items-center justify-between gap-3 rounded-card border border-white/80 bg-white/95 p-4 shadow-soft sm:p-5"
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
