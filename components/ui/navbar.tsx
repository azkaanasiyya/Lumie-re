"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { Brand } from "./brand";
import { navigation } from "@/lib/navigation";
import { HoverText } from "./hover-text";
export function Navbar() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const navbar = header.current;
    const hero = document.getElementById("home");
    const content = document.querySelector("main");
    if (!navbar || !hero || !content) return;

    let animationFrame = 0;
    function update() {
      animationFrame = 0;
      if (!navbar || !hero || !content) return;
      navbar.dataset.hero = String(
        hero.getBoundingClientRect().bottom > navbar.offsetHeight / 2,
      );
      navbar.hidden =
        content.getBoundingClientRect().bottom < window.innerHeight;
    }
    function scheduleUpdate() {
      if (!animationFrame) animationFrame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(document.body);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
    dialog.current?.close();
  }, [open]);
  const links = (mobile = false) =>
    navigation.map((label, index) => (
      <a
        key={label}
        href={label === "Home" ? "#home" : `#${label.toLowerCase()}`}
        aria-current={label === "Home" ? "page" : undefined}
        style={
          mobile ? ({ "--menu-item-index": index } as CSSProperties) : undefined
        }
        onClick={() => mobile && setOpen(false)}
      >
        <HoverText>{label}</HoverText>
      </a>
    ));
  return (
    <>
      <header ref={header} className="navbar" data-hero="true">
        <Brand />
        <div className="desktop-navigation">
          <nav aria-label="Main navigation">{links()}</nav>
          <a className="contact-link" href="#contact">
            <HoverText>Get in touch</HoverText>
            <Image
              src="/icons/arrow-up-right.svg"
              width={18}
              height={18}
              alt=""
            />
          </a>
        </div>
        <button
          className="menu-trigger"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          Menu<span aria-hidden="true">☰</span>
        </button>
      </header>
      <dialog
        ref={dialog}
        id="mobile-menu"
        className="mobile-menu"
        data-lenis-prevent
        aria-label="Main navigation"
        onCancel={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <div className="menu-panel">
          <button
            className="menu-close"
            onClick={() => setOpen(false)}
            autoFocus
          >
            Close <span aria-hidden="true">×</span>
          </button>
          <nav aria-label="Mobile navigation">{links(true)}</nav>
          <div onClick={() => setOpen(false)}>
            <Brand large />
          </div>
        </div>
      </dialog>
    </>
  );
}
