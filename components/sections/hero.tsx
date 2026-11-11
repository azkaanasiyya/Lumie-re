"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/animation";

const slideCount = 6;
const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function Hero() {
  const sequence = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sequence.current;
    const viewport = stage.current;
    const frame = image.current;
    if (!section || !viewport || !frame) return;

    const slides = Array.from(
      frame.querySelectorAll<HTMLElement>(".hero-slide"),
    );
    function render(progress: number) {
      if (!viewport) return;
      const timeline = progress * slideCount;
      const expansion = clamp(timeline);
      const easedExpansion = expansion * expansion * (3 - 2 * expansion);
      viewport.style.setProperty("--hero-expand", String(easedExpansion));
      viewport.style.setProperty(
        "--hero-copy-opacity",
        String(1 - clamp(timeline * 1.5)),
      );
      slides.forEach((slide, index) => {
        slide.style.opacity =
          index === 0 ? "1" : String(clamp(timeline - index));
      });
    }
    render(0);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () =>
          `+=${Math.max(1, section.offsetHeight - viewport.offsetHeight)}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => render(self.progress),
        onRefresh: (self) => render(self.progress),
      });
      return () => {
        trigger.kill();
        render(0);
      };
    });
    return () => media.revert();
  }, []);

  return (
    <section
      ref={sequence}
      id="home"
      className="hero-sequence"
      aria-labelledby="hero-title"
    >
      <div ref={stage} className="hero">
        <div ref={image} className="hero-image">
          <picture className="hero-slide">
            <source
              media="(max-width: 767px)"
              srcSet="/images/hero/slide-1-mobile-2x.webp"
            />
            <Image
              src="/images/hero/slide-1-2x.webp"
              alt="Fashion portrait of a woman wearing a black hat and ornate silver earrings"
              fill
              quality={90}
              sizes="(max-width: 767px) 180vh, 100vw"
              preload
            />
          </picture>
          {[2, 3, 4, 5, 6].map((slide) => (
            <div
              className="hero-slide hero-slide-next"
              key={slide}
              aria-hidden="true"
            >
              <Image
                src={`/images/hero/slide-${slide}-2x.webp`}
                alt=""
                fill
                quality={90}
                sizes="(max-width: 767px) 180vh, 100vw"
                loading="eager"
              />
            </div>
          ))}
        </div>
        <h1 id="hero-title" className="hero-title">
          <span>Defining stories</span>
          <br className="desktop-break" /> through elegant frames
        </h1>
        <p className="hero-caption">
          Transforming into
          <br />
          timeless art
        </p>
      </div>
    </section>
  );
}
