"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/animation";

export function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      respectReducedMotion: true,
      stopInertiaOnNavigate: true,
    });
    let refreshFrame = 0;
    let anchorFrame = 0;
    let disposed = false;
    let initialAnchorPending = Boolean(location.hash);

    function updateScroll() {
      root.style.setProperty("--scroll-progress", String(lenis.progress));
      root.style.setProperty("--scroll-velocity", String(lenis.velocity));
      root.style.setProperty(
        "--scroll-speed",
        String(Math.abs(lenis.velocity)),
      );
      root.dataset.scrollDirection =
        Math.abs(lenis.velocity) < 0.05
          ? "idle"
          : lenis.direction > 0
            ? "down"
            : "up";
      ScrollTrigger.update();
    }
    function synchronizeLocks() {
      const locked = Boolean(
        document.querySelector(".preloader, dialog[open]"),
      );
      if (locked && !lenis.isStopped) lenis.stop();
      if (!locked && lenis.isStopped) lenis.start();
      root.dataset.scrollLocked = String(locked);
      if (!locked && initialAnchorPending) refresh();
    }
    function refresh() {
      if (refreshFrame || disposed) return;
      refreshFrame = requestAnimationFrame(() => {
        refreshFrame = 0;
        lenis.resize();
        ScrollTrigger.refresh();
        if (initialAnchorPending && !lenis.isStopped) {
          const target = document.getElementById(location.hash.slice(1));
          if (target) lenis.scrollTo(target, { immediate: true });
          initialAnchorPending = false;
        }
        updateScroll();
      });
    }
    function focusDestination(target: HTMLElement) {
      const temporaryTabIndex = !target.hasAttribute("tabindex");
      if (temporaryTabIndex) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      if (temporaryTabIndex)
        target.addEventListener(
          "blur",
          () => target.removeAttribute("tabindex"),
          { once: true },
        );
    }
    function onAnchor(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (
        !link ||
        link.hasAttribute("download") ||
        (link.target && link.target !== "_self")
      )
        return;
      const url = new URL(link.href);
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        url.search !== location.search ||
        !url.hash
      )
        return;
      const target = document.getElementById(url.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      if (location.hash !== url.hash) history.pushState(null, "", url.hash);
      cancelAnimationFrame(anchorFrame);
      // React closes the mobile dialog before the anchor starts scrolling.
      anchorFrame = requestAnimationFrame(() => {
        synchronizeLocks();
        lenis.scrollTo(target, {
          lerp: 0,
          duration: 1.15,
          onComplete: () => focusDestination(target),
        });
      });
    }
    function onHistory() {
      const target = document.getElementById(location.hash.slice(1));
      lenis.scrollTo(target || 0, { immediate: true, force: true });
    }
    function tick(time: number) {
      lenis.raf(time * 1000);
    }

    const locks = new MutationObserver(synchronizeLocks);
    locks.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["open"],
    });
    const resize = new ResizeObserver(refresh);
    resize.observe(document.body);
    const main = document.querySelector("main");
    if (main) resize.observe(main);
    lenis.on("scroll", updateScroll);
    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add(tick);
    document.addEventListener("click", onAnchor);
    window.addEventListener("popstate", onHistory);
    window.addEventListener("load", refresh);
    void document.fonts.ready.then(refresh);
    synchronizeLocks();
    refresh();
    root.dataset.scrollEngine = "lenis";

    return () => {
      disposed = true;
      cancelAnimationFrame(refreshFrame);
      cancelAnimationFrame(anchorFrame);
      locks.disconnect();
      resize.disconnect();
      document.removeEventListener("click", onAnchor);
      window.removeEventListener("popstate", onHistory);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.off("scroll", updateScroll);
      lenis.destroy();
      delete root.dataset.scrollEngine;
      delete root.dataset.scrollDirection;
      delete root.dataset.scrollLocked;
      ["--scroll-progress", "--scroll-velocity", "--scroll-speed"].forEach(
        (property) => root.style.removeProperty(property),
      );
    };
  }, []);

  return null;
}
