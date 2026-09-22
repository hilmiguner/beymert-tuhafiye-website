"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const storySteps = [
  {
    number: "01",
    eyebrow: "Atmosferi kur",
    title: "Kutlamanın hissini ilk bakışta belirle.",
    description:
      "Balon, çiçek, masa ve renk paleti aynı atmosferde buluştuğunda kutlama daha başlamadan kendini anlatır.",
    image: "/media/scroll-story/scene-01-birthday.webp",
    alt: "Pembe, krem ve rose-gold tonlarında balonlar ile hazırlanmış doğum günü masa dekoru",
  },
  {
    number: "02",
    eyebrow: "Parçaları birleştir",
    title: "Her detay aynı hikâyeyi anlatsın.",
    description:
      "Renk uyumlu balonlar, kurdeleler, çiçekler ve sunum detayları birbirini tamamlayan tek bir vitrine dönüşür.",
    image: "/media/scroll-story/scene-02-balloons.webp",
    alt: "Pembe ve rose-gold balonlar, hediyeler ve çiçeklerle hazırlanmış kutlama düzeni",
  },
  {
    number: "03",
    eyebrow: "Konsepti kişiselleştir",
    title: "Özel gününe uygun bir sahne oluştur.",
    description:
      "Doğum günü, baby shower, söz ve nişan gibi farklı kutlamalar aynı tasarım diliyle sana özel hale gelir.",
    image: "/media/scroll-story/scene-03-baby-shower.webp",
    alt: "Pastel tonlarda balon, pasta, hediye ve dekor detaylarıyla hazırlanmış baby shower konsepti",
  },
  {
    number: "04",
    eyebrow: "Son dokunuş",
    title: "Küçük detaylarla kutlamayı tamamla.",
    description:
      "Tül, kurdele, paketleme ve parti aksesuarları büyük dekorun arkasındaki tamamlayıcı dokunuşları oluşturur.",
    image: "/media/scroll-story/scene-04-supplies.webp",
    alt: "Kurdele, tül, hediye kutuları ve parti aksesuarlarından oluşan düzenli ürün vitrini",
  },
] as const;

type StoryStep = (typeof storySteps)[number];

function MobileStoryVisual({ step }: { step: StoryStep }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] border border-white/12 bg-white/[0.06]">
      <Image
        src={step.image}
        alt={step.alt}
        fill
        sizes="(max-width: 639px) calc(100vw - 3rem), (max-width: 1023px) calc(100vw - 5rem), 42rem"
        className="object-cover"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#291c22]/30 via-transparent to-white/5"
        aria-hidden="true"
      />
      <span className="absolute bottom-3 right-3 rounded-pill border border-white/35 bg-[#291c22]/72 px-3 py-1.5 text-[0.62rem] font-extrabold tracking-[0.08em] text-white/90 uppercase backdrop-blur-md">
        Temsili konsept görseli
      </span>
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
        const images = Array.from(
          root.querySelectorAll<HTMLElement>("[data-story-image]"),
        );
        const photos = Array.from(
          root.querySelectorAll<HTMLImageElement>("[data-story-photo]"),
        );

        if (
          steps.length !== storySteps.length ||
          images.length !== storySteps.length ||
          photos.length !== storySteps.length
        ) {
          return;
        }

        track.dataset.enhanced = "true";

        gsap.set(steps, { autoAlpha: 0, y: 16 });
        gsap.set(steps[0], { autoAlpha: 1, y: 0 });
        gsap.set(images, { autoAlpha: 0 });
        gsap.set(images[0], { autoAlpha: 1 });
        gsap.set(photos, { scale: 1.06, yPercent: 0 });
        gsap.set(photos[0], { scale: 1.02 });

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

        timeline.to(photos[0], { scale: 1.075, duration: 0.2 }, 0.02);

        [0.18, 0.45, 0.72].forEach((position, transitionIndex) => {
          const previousIndex = transitionIndex;
          const nextIndex = transitionIndex + 1;

          timeline
            .to(
              steps[previousIndex],
              { autoAlpha: 0, y: -14, duration: 0.12 },
              position,
            )
            .to(
              images[previousIndex],
              { autoAlpha: 0, duration: 0.15 },
              position,
            )
            .to(
              photos[previousIndex],
              { scale: 1.095, duration: 0.16 },
              position,
            )
            .fromTo(
              photos[nextIndex],
              { scale: 1.085, yPercent: 1.5 },
              { scale: 1.02, yPercent: 0, duration: 0.24 },
              position,
            )
            .to(
              images[nextIndex],
              { autoAlpha: 1, duration: 0.18 },
              position + 0.02,
            )
            .to(
              steps[nextIndex],
              { autoAlpha: 1, y: 0, duration: 0.17 },
              position + 0.035,
            );

          if (nextIndex < storySteps.length - 1) {
            timeline.to(
              photos[nextIndex],
              { scale: 1.065, duration: 0.17 },
              position + 0.18,
            );
          }
        });

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
      aria-label="Beymert vitrini"
      className="bt-story relative isolate overflow-x-clip text-white"
    >
      <span className="sr-only">
        Bu bölümdeki konsept görselleri temsili olarak hazırlanmıştır.
      </span>

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
          <h2 className="bt-display bt-balance mt-3 max-w-2xl text-4xl leading-tight font-semibold sm:text-5xl">
            Bir kutlama, detay detay şekillenir.
          </h2>
          <p className="mt-5 max-w-xl leading-7 text-white/65">
            Renkten konsepte, balondan kurdeleye her seçim aynı kutlama
            atmosferinin bir parçasına dönüşür.
          </p>

          <div className="mt-9 space-y-4">
            {storySteps.map((step) => (
              <article
                key={step.number}
                data-story-mobile-card
                className="rounded-[1.75rem] border border-white/12 bg-white/[0.055] p-4 shadow-[0_24px_70px_rgb(0_0_0_/_0.18)] backdrop-blur-sm sm:p-5"
              >
                <MobileStoryVisual step={step} />
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
            <ButtonLink href="/urunler" variant="light">
              Ürünlere Bak
            </ButtonLink>
          </div>
        </div>

        <div ref={trackRef} className="bt-story-track hidden lg:block">
          <div className="bt-story-sticky">
            <div className="grid w-full grid-cols-[0.84fr_1.16fr] items-center gap-10 py-8 xl:gap-12 xl:py-10">
              <div>
                <p className="bt-eyebrow text-[#f2b9cd]">Beymert vitrini</p>
                <h2 className="bt-display bt-balance mt-3 max-w-xl text-[3.4rem] leading-[0.98] font-semibold xl:text-6xl">
                  Bir kutlama, detay detay şekillenir.
                </h2>
                <p className="mt-5 max-w-lg leading-7 text-white/60">
                  Scroll ettikçe farklı detaylar profesyonel bir kutlama
                  atmosferinde bir araya gelir.
                </p>

                <ol className="bt-story-steps relative mt-8 min-h-[12.5rem] border-t border-white/10 pt-5">
                  {storySteps.map((step) => (
                    <li
                      key={step.number}
                      data-story-step
                      data-story-animated
                      className="bt-story-step absolute inset-x-0 top-5 grid grid-cols-[2.8rem_1fr] gap-4"
                    >
                      <span className="pt-1 text-xs font-black tracking-[0.14em] text-[#f2b9cd]">
                        {step.number}
                      </span>
                      <div>
                        <p className="bt-eyebrow text-white/48">
                          {step.eyebrow}
                        </p>
                        <h3 className="bt-display mt-2 max-w-md text-2xl leading-tight font-semibold xl:text-3xl">
                          {step.title}
                        </h3>
                        <p className="mt-3 max-w-md text-sm leading-6 text-white/55">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-8 flex gap-3">
                  <ButtonLink href="/konseptler">Konseptleri Keşfet</ButtonLink>
                  <ButtonLink href="/urunler" variant="light">
                    Ürünlere Bak
                  </ButtonLink>
                </div>
              </div>

              <div className="bt-story-stage relative mx-auto aspect-[4/3] w-full max-w-[42rem] overflow-hidden rounded-[2.25rem] border border-white/12 bg-[#392a31] shadow-[0_36px_100px_rgb(0_0_0_/_0.28)]">
                {storySteps.map((step, index) => (
                  <div
                    key={step.number}
                    data-story-image
                    className={
                      "absolute inset-0 " +
                      (index === 0 ? "opacity-100" : "opacity-0")
                    }
                    aria-hidden="true"
                  >
                    <Image
                      data-story-photo
                      src={step.image}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 42rem, 52vw"
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#291c22]/36 via-transparent to-white/[0.04]" />
                    <span className="absolute bottom-5 right-5 rounded-pill border border-white/30 bg-[#291c22]/72 px-3.5 py-2 text-[0.64rem] font-extrabold tracking-[0.08em] text-white/90 uppercase backdrop-blur-md">
                      Temsili konsept görseli
                    </span>
                  </div>
                ))}

                <div
                  className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
