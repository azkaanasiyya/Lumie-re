"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/animation";

const works = [
  {
    slug: "fragments-of-time",
    title: "Fragments of Time",
    year: 2023,
    width: 490,
    height: 490,
    alt: "Dancer in a flowing white dress against a deep red background",
  },
  {
    slug: "in-the-details",
    title: "In the Details",
    year: 2023,
    width: 666,
    height: 666,
    alt: "Ornate golden snake pendant and dark beads resting on wood",
  },
  {
    slug: "echoes-of-couture",
    title: "Echoes of Couture",
    year: 2024,
    width: 490,
    height: 612,
    alt: "Two fashion models wearing a black outfit and a white hat",
  },
  {
    slug: "shapes-of-identity",
    title: "Shapes of Identity",
    year: 2025,
    width: 490,
    height: 490,
    alt: "Portrait of a woman standing among trees in a forest",
  },
  {
    slug: "in-quiet-elegance",
    title: "In Quiet Elegance",
    year: 2025,
    width: 842,
    height: 632,
    alt: "Woman in a long black evening dress in a warmly lit interior",
  },
  {
    slug: "forever-in-frame",
    title: "Forever in Frame",
    year: 2025,
    width: 666,
    height: 833,
    alt: "Wedding couple embracing under warm golden lights",
  },
] as const;

export function Featured() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const gallery = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = section.current;
    const windowElement = stage.current;
    const content = gallery.current;
    if (!container || !windowElement || !content) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      container.dataset.animated = "true";
      let travel = 0;
      function measure() {
        travel = Math.max(
          0,
          content!.offsetHeight - windowElement!.offsetHeight,
        );
        container!.style.setProperty("--featured-travel", `${travel}px`);
      }
      measure();
      const trigger = ScrollTrigger.create({
        trigger: container,
        start: () =>
          `top ${Number.parseFloat(getComputedStyle(windowElement).top) || 0}px`,
        end: () => `+=${Math.max(1, travel)}`,
        invalidateOnRefresh: true,
        onRefreshInit: measure,
        onUpdate: (self) =>
          container.style.setProperty(
            "--featured-offset",
            `${-self.progress * travel}px`,
          ),
        onRefresh: (self) =>
          container.style.setProperty(
            "--featured-offset",
            `${-self.progress * travel}px`,
          ),
      });
      const refresh = gsap
        .delayedCall(0.05, () => ScrollTrigger.refresh())
        .pause();
      const observer = new ResizeObserver(() => refresh.restart(true));
      observer.observe(windowElement);
      observer.observe(content);
      return () => {
        observer.disconnect();
        refresh.kill();
        trigger.kill();
        container.dataset.animated = "false";
        container.style.setProperty("--featured-offset", "0px");
      };
    });
    return () => media.revert();
  }, []);

  return (
    <section
      ref={section}
      id="work"
      className="featured"
      aria-labelledby="featured-title"
    >
      <div ref={stage} className="featured-stage">
        <h2 id="featured-title" className="featured-title">
          Featured <span>Works</span>
        </h2>
        <div ref={gallery} className="featured-gallery">
          {works.map((work) => (
            <figure
              key={work.slug}
              className={`featured-work featured-work--${work.slug}`}
            >
              <figcaption className="featured-work-title">
                {work.title}
              </figcaption>
              <div className="featured-work-image">
                <Image
                  src={`/images/${work.slug}-2x.webp`}
                  alt={work.alt}
                  width={work.width}
                  height={work.height}
                  quality={90}
                  sizes="(max-width: 767px) 100vw, 30vw"
                />
              </div>
              <p className="featured-work-year">
                <span className="sr-only">Year: </span>
                {work.year}
              </p>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
