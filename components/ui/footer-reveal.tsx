"use client";

import { useEffect, useRef } from "react";

export function FooterReveal({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      element.style.setProperty(
        "--footer-rendered-height",
        `${element.offsetHeight}px`,
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={container}
      className="footer-reveal"
      onFocusCapture={() => {
        const content = document.querySelector("main");
        if (
          content &&
          content.getBoundingClientRect().bottom > 0 &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          window.scrollTo({
            top: window.scrollY + content.getBoundingClientRect().bottom,
            behavior: "instant",
          });
        }
      }}
    >
      {children}
    </div>
  );
}
