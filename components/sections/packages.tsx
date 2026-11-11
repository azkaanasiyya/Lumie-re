"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "@/lib/animation";

type GallerySlide = { image: number; alt: string } | null;

const collections: {
  id: string;
  title: string;
  slides: GallerySlide[];
}[] = [
  {
    id: "editorial",
    title: "Editorial",
    slides: [
      { image: 1, alt: "Two models in black outfits in a photography studio" },
      {
        image: 2,
        alt: "Fashion models in motion around a model wearing a white blazer",
      },
      {
        image: 3,
        alt: "Three models in neutral knitwear against a fabric backdrop",
      },
      {
        image: 4,
        alt: "Fashion models photographed from below in colorful coats",
      },
      { image: 1, alt: "Two models in black outfits in a photography studio" },
    ],
  },
  {
    id: "brand",
    title: "Brand",
    slides: [
      { image: 1, alt: "Brand collection studio photograph" },
      { image: 2, alt: "Styled fashion photograph from the Brand collection" },
      null,
      null,
      null,
    ],
  },
  {
    id: "portrait",
    title: "Portrait",
    slides: [
      { image: 1, alt: "Studio photograph from the Portrait collection" },
      { image: 2, alt: "Portrait session from the Lumière collection" },
      { image: 3, alt: "Outdoor portrait from the Lumière collection" },
      null,
      null,
    ],
  },
  {
    id: "wedding",
    title: "Wedding",
    slides: [
      { image: 1, alt: "Wedding couple captured during their celebration" },
      { image: 2, alt: "Wedding photograph from the Lumière collection" },
      { image: 3, alt: "Studio photograph included in the Wedding collection" },
      null,
      null,
    ],
  },
];

const slideDuration = 2000;
const collectionDuration = 15000;

export function Packages() {
  const [activeCollectionIndex, setActiveCollectionIndex] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const section = useRef<HTMLElement>(null);
  const galleries = useRef<(HTMLDivElement | null)[]>([]);
  const collectionElapsed = useRef(0);
  const slideElapsed = useRef(0);
  const currentSlide = useRef(0);
  const visible = useRef(false);
  const previousCollection = useRef(activeCollectionIndex);
  const transitionSnapshot = useRef<{
    element: HTMLDivElement;
    scroll: number;
  } | null>(null);

  const selectCollection = useCallback(
    (index: number) => {
      const current = galleries.current[activeCollectionIndex];
      if (index !== activeCollectionIndex && current) {
        const snapshot = current.cloneNode(true) as HTMLDivElement;
        snapshot.className = "package-gallery-snapshot";
        snapshot.removeAttribute("id");
        snapshot.removeAttribute("role");
        snapshot.removeAttribute("aria-labelledby");
        snapshot.removeAttribute("tabindex");
        snapshot.setAttribute("aria-hidden", "true");
        snapshot.inert = true;
        snapshot.style.cssText = "";
        transitionSnapshot.current = {
          element: snapshot,
          scroll: current.scrollLeft,
        };
      }
      collectionElapsed.current = 0;
      slideElapsed.current = 0;
      currentSlide.current = 0;
      setActiveSlide(0);
      setActiveCollectionIndex(index);
    },
    [activeCollectionIndex],
  );

  function selectSlide(index: number) {
    slideElapsed.current = 0;
    currentSlide.current = index;
    setActiveSlide(index);
  }

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const text = element.querySelectorAll<HTMLElement>(
        ".packages-introduction, .package-collection-heading",
      );
      const photos = element.querySelectorAll<HTMLElement>(".package-gallery");
      gsap
        .timeline({
          scrollTrigger: {
            trigger: element,
            start: "top 72%",
            once: true,
          },
        })
        .fromTo(
          text,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.14,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
          },
        )
        .fromTo(
          photos,
          { autoAlpha: 0, y: 56 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.95,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
          },
          0.15,
        );
    });
    return () => media.revert();
  }, []);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const photoCount =
      collections[activeCollectionIndex].slides.filter(Boolean).length;
    let animationFrame = 0;
    let previousTime = 0;

    function tick(time: number) {
      const delta = previousTime ? time - previousTime : 0;
      previousTime = time;
      const keyboardFocus = element?.querySelector(":focus-visible");
      if (
        visible.current &&
        !document.hidden &&
        !reducedMotion.matches &&
        !keyboardFocus
      ) {
        const elapsedTime = Math.min(delta, 100);
        collectionElapsed.current += elapsedTime;
        slideElapsed.current += elapsedTime;
      }
      element?.style.setProperty(
        "--packages-progress",
        String(Math.min(1, collectionElapsed.current / collectionDuration)),
      );
      if (collectionElapsed.current >= collectionDuration) {
        selectCollection((activeCollectionIndex + 1) % collections.length);
        return;
      }
      if (slideElapsed.current >= slideDuration) {
        slideElapsed.current %= slideDuration;
        const nextSlide = (currentSlide.current + 1) % photoCount;
        currentSlide.current = nextSlide;
        setActiveSlide(nextSlide);
      }
      animationFrame = requestAnimationFrame(tick);
    }
    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [activeCollectionIndex, selectCollection]);

  useEffect(() => {
    const element = galleries.current[activeCollectionIndex];
    const slide =
      element?.querySelectorAll<HTMLElement>(".package-slide")[activeSlide];
    const first = element?.querySelector<HTMLElement>(".package-slide");
    if (!element || !slide || !first) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    element.scrollTo({
      left: slide.offsetLeft - first.offsetLeft,
      behavior: activeSlide === 0 || reducedMotion ? "instant" : "smooth",
    });
  }, [activeCollectionIndex, activeSlide]);

  useLayoutEffect(() => {
    if (previousCollection.current === activeCollectionIndex) return;
    previousCollection.current = activeCollectionIndex;
    const element = galleries.current[activeCollectionIndex];
    const snapshot = transitionSnapshot.current;
    transitionSnapshot.current = null;
    if (!element || !snapshot) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    element.parentElement?.insertBefore(snapshot.element, element);
    snapshot.element.scrollLeft = snapshot.scroll;
    element.style.clipPath = "inset(100% 0% 0% 0%)";
    let cancelled = false;
    let animation: gsap.core.Tween | undefined;

    async function reveal() {
      // Keep the previous photo underneath until the incoming images are ready.
      const images = Array.from(element!.querySelectorAll("img")).slice(0, 2);
      await Promise.all(
        images.map((image) => {
          image.loading = "eager";
          return image.decode().catch(() => {});
        }),
      );
      if (cancelled) return;
      animation = gsap.to(element, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.4,
        ease: "power3.inOut",
        clearProps: "clipPath",
        onComplete: () => snapshot!.element.remove(),
      });
    }
    function finishForReducedMotion() {
      if (!reducedMotion.matches) return;
      cancelled = true;
      animation?.kill();
      element!.style.removeProperty("clip-path");
      snapshot!.element.remove();
    }
    reducedMotion.addEventListener("change", finishForReducedMotion);
    void reveal();
    return () => {
      cancelled = true;
      animation?.kill();
      element.style.removeProperty("clip-path");
      snapshot.element.remove();
      reducedMotion.removeEventListener("change", finishForReducedMotion);
    };
  }, [activeCollectionIndex]);

  return (
    <section
      ref={section}
      id="services"
      className="packages"
      aria-labelledby="packages-title"
    >
      <div className="packages-introduction">
        <span className="packages-label" aria-hidden="true">
          Packages
        </span>
        <h2 id="packages-title" className="packages-title">
          Curated photography packages designed to capture your story in its
          finest light
        </h2>
      </div>
      <div className="packages-collections">
        {collections.map((collection, index) => {
          const active = activeCollectionIndex === index;
          return (
            <div className="package-collection" key={collection.id}>
              <h3 className="package-collection-heading">
                <button
                  type="button"
                  className="package-selector"
                  aria-expanded={active}
                  aria-controls={`package-gallery-${collection.id}`}
                  id={`package-selector-${collection.id}`}
                  onClick={() => selectCollection(index)}
                >
                  <span className="package-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="package-name">
                    {collection.title} <span>Collection</span>
                  </span>
                  <span className="package-arrow" aria-hidden="true">
                    ↗
                  </span>
                </button>
              </h3>
              <div
                className="package-gallery-window"
                hidden={!active}
                data-lenis-prevent
              >
                <div
                  ref={(element) => {
                    galleries.current[index] = element;
                  }}
                  id={`package-gallery-${collection.id}`}
                  className="package-gallery"
                  data-lenis-prevent
                  role="region"
                  aria-labelledby={`package-selector-${collection.id}`}
                  hidden={!active}
                  tabIndex={0}
                >
                  {collection.slides.map((slide, slideIndex) =>
                    slide ? (
                      <button
                        type="button"
                        key={slideIndex}
                        className="package-slide"
                        aria-label={`Show photo ${slideIndex + 1} from ${collection.title} Collection`}
                        aria-pressed={active && activeSlide === slideIndex}
                        onClick={() => selectSlide(slideIndex)}
                      >
                        <Image
                          src={`/images/packages/${collection.id}-${slide.image}.webp`}
                          width={510}
                          height={592}
                          alt={slide.alt}
                          sizes="(max-width: 767px) 217px, 36vw"
                        />
                      </button>
                    ) : (
                      <span
                        key={slideIndex}
                        className="package-gallery-placeholder"
                        aria-hidden="true"
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
