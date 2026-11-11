"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/animation";

const icons = [
  "variant-1",
  "variant-2",
  "variant-3",
  "variant-4",
  "variant-5",
  "globe",
];

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const overlay = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const wipe = useRef<HTMLDivElement>(null);
  const reveal = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = overlay.current;
    const logo = mark.current;
    const curtain = wipe.current;
    if (!element || !logo || !curtain) return;
    let disposed = false;
    let completed = false;
    const animations: Animation[] = [];
    const entrance = gsap.context(() => {});
    const timers: ReturnType<typeof setTimeout>[] = [];
    const content = Array.from(
      document.querySelectorAll<HTMLElement>(".navbar, main, .footer-reveal"),
    );
    const previousInert = content.map((node) => node.inert);
    content.forEach((node) => {
      node.inert = true;
    });

    function finish() {
      if (disposed || completed) return;
      completed = true;
      animations.forEach((animation) => animation.cancel());
      timers.forEach(clearTimeout);
      delete document.documentElement.dataset.preloadPhase;
      content.forEach((node, index) => {
        node.inert = previousInert[index];
      });
      setLoading(false);
    }
    function animate(
      node: HTMLElement,
      frames: Keyframe[],
      options: KeyframeAnimationOptions,
    ) {
      const animation = node.animate(frames, { fill: "forwards", ...options });
      animations.push(animation);
      return animation.finished;
    }
    async function run() {
      // Deep links keep their destination, and reduced motion opens directly.
      if (
        window.location.hash ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        await Promise.resolve();
        finish();
        return;
      }
      await Promise.race([
        Promise.all([
          document.fonts.ready,
          document
            .querySelector<HTMLImageElement>(".hero-slide img")
            ?.decode()
            .catch(() => {}),
        ]),
        new Promise<void>((resolve) => {
          timers.push(setTimeout(resolve, 2000));
        }),
      ]);
      if (disposed) return;
      const destination = document.querySelector<HTMLElement>(".navbar .brand");
      if (!destination) {
        finish();
        return;
      }
      const start = logo!.getBoundingClientRect();
      const target = destination.getBoundingClientRect();
      const x = target.left - start.left;
      const y = target.top - start.top;
      const scale = target.height / start.height;
      const iconElements =
        logo!.querySelectorAll<HTMLElement>(".preloader-icon");
      function showIcon(index: number) {
        if (disposed) return;
        iconElements.forEach((icon, iconIndex) => {
          icon.style.opacity = iconIndex === index ? "1" : "0";
        });
      }
      for (let step = 0; step < 16; step += 1) {
        timers.push(
          setTimeout(() => showIcon(step % icons.length), 250 + step * 100),
        );
      }
      // Settle on the globe before the logo shrinks into the navbar.
      timers.push(setTimeout(() => showIcon(icons.length - 1), 1850));
      await Promise.all([
        animate(
          curtain!,
          [{ transform: "translateY(100%)" }, { transform: "translateY(0)" }],
          { duration: 1750, delay: 250, easing: "cubic-bezier(.76,0,.24,1)" },
        ),
        animate(
          logo!,
          [
            { transform: "translate(0, 0) scale(1)", offset: 0 },
            { transform: `translate(${x}px, ${y}px) scale(1)`, offset: 0.66 },
            {
              transform: `translate(${x}px, ${y}px) scale(${scale})`,
              offset: 1,
            },
          ],
          { duration: 2400, delay: 250, easing: "cubic-bezier(.65,0,.35,1)" },
        ),
      ]);
      if (disposed) return;
      const navbar = document.querySelector<HTMLElement>(".navbar");
      const panels = reveal.current;
      if (!navbar || !panels) {
        finish();
        return;
      }
      document.documentElement.dataset.preloadPhase = "navigation";
      logo!.style.visibility = "hidden";
      const menuItems = Array.from(
        navbar.querySelectorAll<HTMLElement>(
          ".desktop-navigation nav a, .menu-trigger",
        ),
      ).filter((item) => item.getClientRects().length > 0);
      const contact = navbar.querySelector<HTMLElement>(".contact-link");
      let navigation: gsap.core.Timeline | undefined;
      entrance.add(() => {
        navigation = gsap.timeline().fromTo(
          menuItems,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.09,
            ease: "power2.out",
          },
        );
        if (contact && contact.getClientRects().length > 0) {
          navigation
            .fromTo(
              contact,
              { "--contact-underline": 0 },
              {
                "--contact-underline": 1,
                duration: 0.45,
                repeat: 1,
                repeatDelay: 0.15,
                ease: "power2.inOut",
              },
            )
            .fromTo(
              contact.children,
              { autoAlpha: 0, y: 12 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.04,
                ease: "power2.out",
              },
              "<+=0.45",
            );
        }
      });
      await navigation?.then();
      if (disposed || completed) return;
      document.documentElement.dataset.preloadPhase = "reveal";
      panels.style.opacity = "1";
      curtain!.style.visibility = "hidden";
      element!.style.background = "transparent";
      let opening: gsap.core.Tween | undefined;
      entrance.add(() => {
        opening = gsap.to(panels.children, {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.8,
          stagger: 0.18,
          ease: "power3.inOut",
        });
      });
      await opening?.then();
      finish();
    }
    void run().catch(finish);
    return () => {
      disposed = true;
      timers.forEach(clearTimeout);
      animations.forEach((animation) => animation.cancel());
      entrance.revert();
      delete document.documentElement.dataset.preloadPhase;
      content.forEach((node, index) => {
        node.inert = previousInert[index];
      });
    };
  }, []);

  if (!loading) return null;
  return (
    <div
      ref={overlay}
      className="preloader"
      role="status"
      aria-label="Loading Lumière"
    >
      <div ref={wipe} className="preloader-wipe" />
      <div ref={reveal} className="preloader-reveal" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((group) => (
          <div key={group} className="preloader-panel" />
        ))}
      </div>
      <div ref={mark} className="preloader-mark" aria-hidden="true">
        <span className="preloader-icons">
          {icons.map((icon, index) => (
            <Image
              key={icon}
              className={`preloader-icon${index === 0 ? " preloader-icon-first" : ""}`}
              src={`/icons/preloader/${icon}.svg`}
              width={144}
              height={144}
              alt=""
              loading="eager"
            />
          ))}
        </span>
        <span>Lumière</span>
      </div>
      <span className="sr-only">Loading Lumière</span>
    </div>
  );
}
