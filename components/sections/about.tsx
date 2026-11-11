"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animation";

export function About() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const blocks = element.querySelectorAll<HTMLElement>(
        ".about-introduction, .about-approach, .about-craft p",
      );
      blocks.forEach((block, index) => {
        gsap.fromTo(
          block,
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.12,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: {
              trigger: block,
              start: "top 88%",
              once: true,
            },
          },
        );
      });
    });
    return () => media.revert();
  }, []);

  return (
    <section
      ref={section}
      id="about"
      className="about"
      aria-labelledby="about-title"
    >
      <div className="about-introduction">
        <span className="about-label" aria-hidden="true">
          About
        </span>
        <h2 id="about-title" className="about-title">
          <span className="sr-only">About Lumière. </span>
          Lumière is built on the belief that every image has the power to tell
          a story worth remembering. From intimate portraits to grand commercial
          productions, we focus on capturing the essence of every subject.
        </h2>
      </div>
      <p className="about-approach">
        We approach every project as a collaboration, ensuring that every detail
        aligns with the vision and purpose of our clients.
      </p>
      <div className="about-craft">
        <p>
          Our work blends technical precision with artistic intuition, creating
          photographs that feel alive and authentic.
        </p>
        <p>
          Each frame is carefully composed to evoke emotion, preserve moments,
          and reflect the unique character of the story we are telling.
        </p>
      </div>
    </section>
  );
}
