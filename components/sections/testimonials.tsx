"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { testimonials } from "@/lib/testimonials";
import { gsap } from "@/lib/animation";

export function Testimonials() {
  const section = useRef<HTMLElement>(null);
  const gallery = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const pausedUntil = useRef(0);
  const drag = useRef<{ pointerId: number; x: number } | null>(null);

  function pauseAutoplay() {
    pausedUntil.current = performance.now() + 1600;
  }

  useEffect(() => {
    const element = section.current;
    const carousel = gallery.current;
    if (!element || !carousel) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const content = element.querySelectorAll<HTMLElement>(
        ".testimonials-label, .testimonials-title, .testimonials-controls",
      );
      gsap.fromTo(
        content,
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.14,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: element,
            start: "top 78%",
            once: true,
          },
        },
      );
      gsap.fromTo(
        carousel.querySelectorAll<HTMLElement>(".testimonial-card"),
        { autoAlpha: 0, y: 56 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          // Reveal each repeated set together so the looping seam stays continuous.
          stagger: (index) => (index % testimonials.length) * 0.14,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: carousel,
            start: "top 90%",
            once: true,
          },
        },
      );
    });
    return () => media.revert();
  }, []);

  useEffect(() => {
    const element = gallery.current;
    if (!element) return;
    const viewport = window.matchMedia("(max-width: 767px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let animationFrame = 0;
    let previousTime = 0;
    let remainder = 0;

    function positionGallery() {
      if (!element) return;
      const card = element.firstElementChild;
      if (!card) return;
      const styles = getComputedStyle(element);
      const gap = Number.parseFloat(styles.columnGap) || 0;
      const period =
        (card.getBoundingClientRect().width + gap) * testimonials.length;
      const offset =
        Number.parseFloat(
          styles.getPropertyValue("--testimonials-initial-offset"),
        ) || 0;
      element.scrollLeft = period + offset;
    }
    function tick(time: number) {
      const delta = previousTime ? Math.min(time - previousTime, 64) : 0;
      previousTime = time;
      const keyboardFocus =
        element?.matches(":focus-visible") ||
        element?.querySelector(":focus-visible");
      if (
        element &&
        visible &&
        !document.hidden &&
        !reducedMotion.matches &&
        !drag.current &&
        !keyboardFocus &&
        time > pausedUntil.current
      ) {
        remainder += (delta * 40) / 1000;
        const distance = Math.floor(remainder);
        remainder -= distance;
        if (distance) element.scrollLeft += distance;
      }
      animationFrame = requestAnimationFrame(tick);
    }
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersection.observe(element);
    const resize = new ResizeObserver(positionGallery);
    resize.observe(element);
    positionGallery();
    viewport.addEventListener("change", positionGallery);
    animationFrame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animationFrame);
      intersection.disconnect();
      resize.disconnect();
      viewport.removeEventListener("change", positionGallery);
    };
  }, []);

  function moveGallery(direction: number) {
    const element = gallery.current;
    const card = element?.firstElementChild;
    if (!element || !card) return;
    pauseAutoplay();
    const gap = Number.parseFloat(getComputedStyle(element).columnGap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    const target = Math.round(element.scrollLeft / step) + direction;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    element.scrollTo({
      left: target * step,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }

  return (
    <section
      ref={section}
      id="testimonials"
      className="testimonials"
      aria-labelledby="testimonials-title"
    >
      <div className="testimonials-introduction">
        <span className="testimonials-label" aria-hidden="true">
          Testimonials
        </span>
        <h2 id="testimonials-title" className="testimonials-title">
          Stories from clients who trusted Lumière to capture their most
          important moments
        </h2>
      </div>
      <div className="testimonials-controls">
        <span
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Testimonial ${activeIndex + 1} of ${testimonials.length}`}
        >
          {activeIndex + 1}
          <span className="testimonials-total">/{testimonials.length}</span>
        </span>
        <div className="testimonials-buttons">
          <button
            type="button"
            onClick={() => moveGallery(-1)}
            aria-label="Previous testimonial"
            aria-controls="testimonials-gallery"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => moveGallery(1)}
            aria-label="Next testimonial"
            aria-controls="testimonials-gallery"
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={gallery}
        id="testimonials-gallery"
        className="testimonials-gallery"
        role="region"
        aria-label="Client testimonials"
        tabIndex={0}
        onWheel={pauseAutoplay}
        onTouchStart={pauseAutoplay}
        onTouchMove={pauseAutoplay}
        onPointerDown={(event) => {
          pauseAutoplay();
          if (event.pointerType !== "mouse" || event.button !== 0) return;
          drag.current = { pointerId: event.pointerId, x: event.clientX };
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.dataset.dragging = "true";
        }}
        onPointerMove={(event) => {
          if (!drag.current || drag.current.pointerId !== event.pointerId)
            return;
          event.currentTarget.scrollLeft += drag.current.x - event.clientX;
          drag.current.x = event.clientX;
        }}
        onLostPointerCapture={(event) => {
          drag.current = null;
          event.currentTarget.dataset.dragging = "false";
          pauseAutoplay();
        }}
        onPointerUp={(event) => {
          drag.current = null;
          event.currentTarget.dataset.dragging = "false";
          pauseAutoplay();
        }}
        onScroll={(event) => {
          const element = event.currentTarget;
          const card = element.firstElementChild;
          if (!card) return;
          const gap =
            Number.parseFloat(getComputedStyle(element).columnGap) || 0;
          const step = card.getBoundingClientRect().width + gap;
          const period = step * testimonials.length;
          const offset = ((element.scrollLeft % period) + period) % period;
          if (element.scrollLeft < period || element.scrollLeft >= period * 2) {
            element.scrollLeft = period + offset;
          }
          setActiveIndex(Math.round(offset / step) % testimonials.length);
        }}
      >
        {[0, 1, 2].flatMap((copy) =>
          testimonials.map((testimonial) => (
            <article
              key={`${copy}-${testimonial.id}`}
              aria-hidden={copy !== 1}
              className="testimonial-card"
              aria-label={`${testimonial.title} Collection testimonial`}
            >
              <Image
                src={`/images/testimonials/${testimonial.id}-2x.webp`}
                alt=""
                fill
                quality={90}
                sizes="(max-width: 767px) calc(100vw - 32px), 510px"
              />
              <h3 className="testimonial-card-title">
                {testimonial.title} <span>Collection</span>
              </h3>
              <div className="testimonial-content">
                <blockquote>{testimonial.quote}</blockquote>
                <div className="testimonial-attribution">
                  <p>{testimonial.author}</p>
                  <span
                    className="testimonial-rating"
                    role="img"
                    aria-label={`${testimonial.rating} out of 5`}
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <span
                        key={value}
                        className={
                          value > testimonial.rating
                            ? "testimonial-rating-muted"
                            : undefined
                        }
                      />
                    ))}
                  </span>
                </div>
              </div>
            </article>
          )),
        )}
      </div>
    </section>
  );
}
