"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animation";

export function Words() {
  const quote = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    const element = quote.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
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
    <section className="words" aria-label="Our philosophy">
      <picture className="words-image">
        <source media="(max-width: 767px)" srcSet="/images/words-mobile.webp" />
        <Image src="/images/words-desktop.webp" alt="" fill sizes="100vw" />
      </picture>
      <blockquote ref={quote} className="words-quote">
        “We don’t just capture moments. We create images that will live far
        beyond the present.”
      </blockquote>
    </section>
  );
}
