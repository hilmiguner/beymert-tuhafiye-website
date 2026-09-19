"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const storySteps = [
  {
    number: "01",
    eyebrow: "Rengi seç",
    title: "Önce kutlamanın hissini belirle.",
    description:
      "Pembe ve rose-gold, soft baby, safari ya da daha sportif bir tema. Renk paleti geri kalan bütün seçimlerin ortak dilini kurar.",
  },
  {
    number: "02",
    eyebrow: "Parçaları birleştir",
    title: "Balon, masa ve detaylar aynı sahnede buluşsun.",
    description:
      "Tek tek ürünlerden çok birlikte nasıl göründükleri önemli. Balonlar, masa üstü parçaları, kurdele ve hediyelikler aynı tema etrafında birleşir.",
  },
  {
    number: "03",
    eyebrow: "Son dokunuş",
    title: "Küçük detaylar kutlamayı sana özel yapar.",
    description:
      "Kişiselleştirilmiş hediyelik, sunum ve renk eşleşmeleriyle hazır bir dekor değil, sana ait bir kutlama atmosferi oluşur.",
  },
] as const;

function MobileStoryVisual({ step }: { step: number }) {
  return (
    <div
      className="relative h-44 overflow-hidden rounded-[1.35rem] border border-white/12 bg-white/[0.06]"
      aria-hidden="true"
    >
      <div className="absolute -right-8 -top-10 size-32 rounded-full bg-primary/25 blur-3xl" />
      <div className="absolute -bottom-10 -left-8 size-32 rounded-full bg-accent/20 blur-3xl" />

      {step === 0 ? (
        <>
          <span className="absolute left-[14%] top-[20%] h-20 w-14 rounded-[50%] bg-primary shadow-lg" />
          <span className="absolute left-[42%] top-[13%] h-24 w-16 rounded-[50%] bg-[#e7b39a] shadow-lg" />
          <span className="absolute right-[13%] top-[25%] h-17 w-12 rounded-[50%] bg-[#fff4ee] shadow-lg" />
          <div className="absolute inset-x-[14%] bottom-5 flex justify-center gap-2">
            <span className="size-5 rounded-full bg-primary" />
            <span className="size-5 rounded-full bg-accent" />
            <span className="size-5 rounded-full bg-white" />
          </div>
        </>
      ) : null}

      {step === 1 ? (
        <>
          <span className="absolute inset-x-[12%] bottom-[18%] h-16 rounded-[1.2rem_1.2rem_0.7rem_0.7rem] bg-white/90 shadow-lg" />
          <span className="absolute bottom-[42%] left-[20%] size-9 rounded-control bg-primary" />
          <span className="absolute bottom-[42%] left-1/2 size-11 -translate-x-1/2 rounded-control bg-accent" />
          <span className="absolute bottom-[42%] right-[20%] size-8 rounded-full bg-white shadow-md" />
          <span className="absolute left-[18%] top-[15%] h-16 w-11 rounded-[50%] bg-primary/80" />
          <span className="absolute right-[16%] top-[12%] h-18 w-12 rounded-[50%] bg-accent/80" />
        </>
      ) : null}

      {step === 2 ? (
        <>
          <span className="absolute left-1/2 top-[19%] h-24 w-32 -translate-x-1/2 rounded-card bg-white/92 shadow-lg" />
          <span className="absolute left-1/2 top-[19%] h-24 w-5 -translate-x-1/2 bg-primary/70" />
          <span className="absolute left-1/2 top-[48%] h-5 w-32 -translate-x-1/2 bg-primary/70" />
          <span className="absolute bottom-[13%] left-1/2 grid size-12 -translate-x-1/2 place-items-center rounded-full bg-primary text-sm font-black text-white shadow-lg">
            B
          </span>
          <span className="absolute left-[17%] top-[24%] size-4 rotate-45 rounded-sm bg-accent" />
          <span className="absolute right-[18%] top-[31%] size-3 rounded-full bg-white" />
        </>
      ) : null}
    </div>
  );
}

export function AnimatedShowcaseSection() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;

    if (!root || !track) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    media.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const steps = Array.from(
          root.querySelectorAll<HTMLElement>("[data-story-step]"),
        );
        const balloons = Array.from(
          root.querySelectorAll<HTMLElement>("[data-story-balloon]"),
        );
        const palette = root.querySelector<HTMLElement>("[data-story-palette]");
        const table = root.querySelector<HTMLElement>("[data-story-table]");
        const products = Array.from(
          root.querySelectorAll<HTMLElement>("[data-story-product]"),
        );
        const ribbon = root.querySelector<HTMLElement>("[data-story-ribbon]");
        const seal = root.querySelector<HTMLElement>("[data-story-seal]");
        const sparkles = Array.from(
          root.querySelectorAll<HTMLElement>("[data-story-sparkle]"),
        );

        if (
          steps.length !== 3 ||
          balloons.length === 0 ||
          !palette ||
          !table ||
          products.length === 0 ||
          !ribbon ||
          !seal
        ) {
          return;
        }

        track.dataset.enhanced = "true";

        gsap.set(steps, { opacity: 0.28, y: 0 });
        gsap.set(steps[0], { opacity: 1 });
        gsap.set(table, { autoAlpha: 0.1, y: 90 });
        gsap.set(products, { autoAlpha: 0, y: 56, rotate: -4 });
        gsap.set(ribbon, { autoAlpha: 0, scaleX: 0.35 });
        gsap.set(seal, { autoAlpha: 0, scale: 0.5, rotate: -16 });
        gsap.set(sparkles, { autoAlpha: 0, scale: 0.4 });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: track,
            start: "top top+=72",
            end: "bottom bottom",
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(
            balloons,
            {
              y: (index) => [-18, -8, -22][index] ?? -12,
              x: (index) => [-8, 5, 12][index] ?? 0,
              scale: 0.94,
              stagger: 0.02,
              duration: 0.26,
            },
            0.18,
          )
          .to(palette, { autoAlpha: 0.42, scale: 0.88, duration: 0.2 }, 0.2)
          .to(steps[0], { opacity: 0.28, y: -8, duration: 0.16 }, 0.27)
          .to(steps[1], { opacity: 1, y: -3, duration: 0.18 }, 0.32)
          .to(table, { autoAlpha: 1, y: 0, duration: 0.28 }, 0.3)
          .to(
            products,
            {
              autoAlpha: 1,
              y: 0,
              rotate: 0,
              stagger: 0.025,
              duration: 0.24,
            },
            0.36,
          )
          .to(steps[1], { opacity: 0.28, y: -8, duration: 0.16 }, 0.62)
          .to(steps[2], { opacity: 1, y: -3, duration: 0.18 }, 0.67)
          .to(ribbon, { autoAlpha: 1, scaleX: 1, duration: 0.22 }, 0.66)
          .to(
            seal,
            {
              autoAlpha: 1,
              scale: 1,
              rotate: 0,
              duration: 0.2,
              ease: "back.out(1.6)",
            },
            0.72,
          )
          .to(
            sparkles,
            {
              autoAlpha: 1,
              scale: 1,
              stagger: 0.02,
              duration: 0.18,
            },
            0.74,
          )
          .to(
            balloons,
            {
              y: (index) => [-25, -16, -29][index] ?? -18,
              duration: 0.2,
            },
            0.78,
          );

        ScrollTrigger.refresh();

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
          delete track.dataset.enhanced;
        };
      },
    );

    media.add(
      "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
      () => {
        const cards = Array.from(
          root.querySelectorAll<HTMLElement>("[data-story-mobile-card]"),
        );

        cards.forEach((card) => {
          gsap.from(card, {
            autoAlpha: 0,
            y: 24,
            duration: 0.55,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          });
        });
      },
    );

    return () => media.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="animated-showcase-title"
      className="bt-story relative isolate overflow-hidden text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
      >
        <div className="absolute left-[8%] top-[9%] size-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-[7%] right-[6%] size-56 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <Container className="relative z-10 py-[var(--bt-section-space)] lg:py-0">
        <div className="lg:hidden">
          <p className="bt-eyebrow text-[#f2b9cd]">Beymert vitrini</p>
          <h2
            id="animated-showcase-title"
            className="bt-display bt-balance mt-3 max-w-2xl text-4xl leading-tight font-semibold sm:text-5xl"
          >
            Bir kutlama, detay detay şekillenir.
          </h2>
          <p className="mt-5 max-w-xl leading-7 text-white/65">
            Aynı ürünleri yan yana koymak yerine renk, ürün ve kişisel detayları
            tek bir görsel dilde buluştur.
          </p>

          <div className="mt-9 space-y-4">
            {storySteps.map((step, index) => (
              <article
                key={step.number}
                data-story-mobile-card
                className="rounded-[1.75rem] border border-white/12 bg-white/[0.055] p-4 shadow-[0_24px_70px_rgb(0_0_0_/_0.18)] backdrop-blur-sm sm:p-5"
              >
                <MobileStoryVisual step={index} />
                <div className="px-1 pb-1 pt-5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black tracking-[0.14em] text-[#f2b9cd]">
                      {step.number}
                    </span>
                    <span className="bt-eyebrow text-white/55">
                      {step.eyebrow}
                    </span>
                  </div>
                  <h3 className="bt-display mt-3 text-3xl leading-tight font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/62">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/konseptler">Konseptleri Keşfet</ButtonLink>
            <ButtonLink href="/urunler" variant="outline">
              Ürünlere Bak
            </ButtonLink>
          </div>
        </div>

        <div ref={trackRef} className="bt-story-track hidden lg:block">
          <div className="bt-story-sticky">
            <div className="grid w-full grid-cols-[0.84fr_1.16fr] items-center gap-12 py-12">
              <div>
                <p className="bt-eyebrow text-[#f2b9cd]">Beymert vitrini</p>
                <h2
                  id="animated-showcase-title"
                  className="bt-display bt-balance mt-3 max-w-xl text-6xl leading-[0.98] font-semibold xl:text-7xl"
                >
                  Bir kutlama, detay detay şekillenir.
                </h2>
                <p className="mt-5 max-w-lg leading-7 text-white/60">
                  Scroll ettikçe aynı vitrin renk seçiminden tamamlanmış
                  kutlama sahnesine dönüşür.
                </p>

                <ol className="mt-9 space-y-5">
                  {storySteps.map((step) => (
                    <li
                      key={step.number}
                      data-story-step
                      data-story-animated
                      className="grid grid-cols-[2.8rem_1fr] gap-4 border-t border-white/10 pt-4"
                    >
                      <span className="pt-1 text-xs font-black tracking-[0.14em] text-[#f2b9cd]">
                        {step.number}
                      </span>
                      <div>
                        <p className="bt-eyebrow text-white/48">
                          {step.eyebrow}
                        </p>
                        <h3 className="bt-display mt-2 text-2xl font-semibold xl:text-3xl">
                          {step.title}
                        </h3>
                        <p className="mt-2 max-w-md text-sm leading-6 text-white/55">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-8 flex gap-3">
                  <ButtonLink href="/konseptler">Konseptleri Keşfet</ButtonLink>
                  <ButtonLink href="/urunler" variant="outline">
                    Ürünlere Bak
                  </ButtonLink>
                </div>
              </div>

              <div
                className="bt-story-stage relative mx-auto aspect-[1.05] w-full max-w-[42rem] overflow-hidden rounded-[2.25rem] border border-white/12 bg-white/[0.055] shadow-[0_36px_100px_rgb(0_0_0_/_0.25)] backdrop-blur-sm"
                aria-hidden="true"
              >
                <div className="absolute inset-[8%] rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
                <div className="absolute left-1/2 top-[9%] h-[62%] w-[58%] -translate-x-1/2 rounded-t-[10rem] border border-white/12 bg-white/[0.035]" />

                <div data-story-palette data-story-animated className="absolute left-[7%] top-[9%] flex gap-2 rounded-pill border border-white/12 bg-black/10 p-2.5 backdrop-blur-sm">
                  <span className="size-6 rounded-full bg-primary" />
                  <span className="size-6 rounded-full bg-accent" />
                  <span className="size-6 rounded-full bg-[#fff5ef]" />
                </div>

                <span
                  data-story-balloon
                  data-story-animated
                  className="absolute left-[15%] top-[20%] h-32 w-22 rounded-[50%] bg-primary shadow-[0_22px_50px_rgb(0_0_0_/_0.18)]"
                />
                <span
                  data-story-balloon
                  data-story-animated
                  className="absolute left-[42%] top-[11%] h-38 w-26 rounded-[50%] bg-[#e5aa92] shadow-[0_22px_50px_rgb(0_0_0_/_0.18)]"
                />
                <span
                  data-story-balloon
                  data-story-animated
                  className="absolute right-[14%] top-[23%] h-29 w-20 rounded-[50%] bg-[#fff1ec] shadow-[0_22px_50px_rgb(0_0_0_/_0.18)]"
                />

                <div
                  data-story-table
                  data-story-animated
                  className="absolute inset-x-[12%] bottom-[10%] h-[30%] rounded-[2rem_2rem_1rem_1rem] bg-[#fff8f5] shadow-[0_24px_65px_rgb(0_0_0_/_0.22)]"
                >
                  <span className="absolute inset-x-0 top-[34%] h-3 bg-primary/55" />
                </div>

                <div
                  data-story-product
                  data-story-animated
                  className="absolute bottom-[28%] left-[20%] h-20 w-16 rounded-[1rem_1rem_0.6rem_0.6rem] bg-primary shadow-lg"
                >
                  <span className="absolute left-1/2 top-[-1.7rem] h-7 w-1.5 -translate-x-1/2 rounded-pill bg-[#fff4ee]" />
                </div>

                <div
                  data-story-product
                  data-story-animated
                  className="absolute bottom-[28%] left-1/2 h-24 w-20 -translate-x-1/2 rounded-[1.1rem] bg-white shadow-lg"
                >
                  <span className="absolute left-1/2 top-0 h-full w-3 -translate-x-1/2 bg-accent/85" />
                  <span className="absolute left-0 top-[38%] h-3 w-full bg-accent/85" />
                </div>

                <div
                  data-story-product
                  data-story-animated
                  className="absolute bottom-[28%] right-[19%] size-18 rounded-full border-[8px] border-[#c69079] bg-[#fff8f5] shadow-lg"
                />

                <span
                  data-story-ribbon
                  data-story-animated
                  className="absolute bottom-[17%] left-[17%] h-4 w-[66%] origin-left rounded-pill bg-primary/75 shadow-md"
                />

                <span
                  data-story-seal
                  data-story-animated
                  className="absolute bottom-[12%] left-1/2 grid size-16 -translate-x-1/2 place-items-center rounded-full border-4 border-[#fff8f5] bg-primary text-lg font-black text-white shadow-xl"
                >
                  B
                </span>

                <span
                  data-story-sparkle
                  data-story-animated
                  className="absolute right-[10%] top-[14%] size-4 rotate-45 rounded-sm bg-accent"
                />
                <span
                  data-story-sparkle
                  data-story-animated
                  className="absolute left-[11%] top-[52%] size-3 rounded-full bg-white"
                />
                <span
                  data-story-sparkle
                  data-story-animated
                  className="absolute right-[8%] top-[54%] h-5 w-2 rotate-[28deg] rounded-pill bg-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
