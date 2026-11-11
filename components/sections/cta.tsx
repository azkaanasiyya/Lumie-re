"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animation";

export function Cta() {
  const content = useRef<HTMLDivElement>(null);
  const contactUrl = process.env.NEXT_PUBLIC_CONTACT_URL || "#contact";

  useEffect(() => {
    const element = content.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const blocks = element.querySelectorAll<HTMLElement>(
        ".cta-copy h2, .cta-copy p, .cta-link",
      );
      const link = element.querySelector<HTMLElement>(".cta-link");
      gsap.set(link, { "--cta-line-progress": 0 });
      gsap
        .timeline({
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            once: true,
          },
        })
        .fromTo(
          blocks,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.16,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
          },
        )
        .fromTo(
          link,
          { "--cta-line-progress": 0 },
          {
            "--cta-line-progress": 1,
            duration: 0.7,
            repeat: 1,
            repeatDelay: 0.2,
            ease: "power2.inOut",
          },
        );
    });
    return () => media.revert();
  }, []);

  return (
    <section id="contact" className="cta" aria-labelledby="cta-title">
      <div className="cta-image">
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet="/images/cta-mobile-2x.webp"
          />
          <Image
            src="/images/cta-desktop-2x.webp"
            alt="Four models in tailored suits during a studio photography session"
            fill
            quality={90}
            sizes="(max-width: 767px) 100vw, 50vw"
          />
        </picture>
      </div>
      <div className="cta-panel">
        <div ref={content} className="cta-content">
          <div className="cta-copy">
            <h2 id="cta-title">
              Your story deserves to be captured in its finest light
            </h2>
            <p>
              At Lumiere Studio, every session is more than just a photoshoot.
              It is an experience designed to bring out authenticity, beauty,
              and timelessness in every frame. Whether it’s an intimate
              portrait, a grand celebration, or a creative campaign, our space
              and expertise are dedicated to translating your story into imagery
              that will endure for years to come.
            </p>
          </div>
          <a className="cta-link" href={contactUrl}>
            Get in touch
            <Image
              src="/icons/arrow-up-right.svg"
              width={24}
              height={24}
              alt=""
            />
          </a>
        </div>
      </div>
    </section>
  );
}
