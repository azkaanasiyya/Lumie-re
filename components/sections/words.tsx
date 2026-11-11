"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animation";

export function Words() {
  const section = useRef<HTMLElement>(null);
  const image = useRef<HTMLPictureElement>(null);
  const quote = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    const element = quote.current;
    const container = section.current;
    const background = image.current;
    if (!element || !container || !background) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        background,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      gsap.fromTo(
        element,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true,
          },
        },
      );
    });
    return () => media.revert();
  }, []);

  return (
    <section ref={section} className="words" aria-label="Our philosophy">
      <picture ref={image} className="words-image">
        <source
          media="(max-width: 767px)"
          srcSet="/images/words-mobile-2x.webp"
        />
        <Image
          src="/images/words-desktop-2x.webp"
          alt=""
          fill
          sizes="100vw"
          quality={90}
        />
      </picture>
      <blockquote ref={quote} className="words-quote">
        “We don’t just capture moments. We create images that will live far
        beyond the present.”
      </blockquote>
    </section>
  );
}
