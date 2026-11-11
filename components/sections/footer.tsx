import Image from "next/image";
import { navigation } from "@/lib/navigation";

const socialLinks = [
  { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL },
  { label: "Pinterest", href: process.env.NEXT_PUBLIC_PINTEREST_URL },
  { label: "Behance", href: process.env.NEXT_PUBLIC_BEHANCE_URL },
];

const legalLinks = [
  { label: "Terms of Service", href: process.env.NEXT_PUBLIC_TERMS_URL },
  { label: "Privacy Policy", href: process.env.NEXT_PUBLIC_PRIVACY_URL },
];

export function Footer() {
  return (
    <footer className="site-footer" aria-label="Lumière footer">
      <a className="footer-globe" href="#home" aria-label="Lumière home">
        <Image src="/icons/globe.svg" width={24} height={24} alt="" />
      </a>
      <div className="footer-navigation">
        <nav className="footer-column" aria-label="Footer sitemap">
          <h2>Sitemap</h2>
          <ul>
            {navigation.map((label) => (
              <li key={label}>
                <a href={`#${label.toLowerCase()}`}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer-column">
          <h2>Social</h2>
          <ul>
            {socialLinks.map((link) => (
              <li key={link.label}>
                {link.href ? (
                  <a href={link.href}>{link.label}</a>
                ) : (
                  <span>{link.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-column">
          <h2>Legal</h2>
          <ul>
            {legalLinks.map((link) => (
              <li key={link.label}>
                {link.href ? (
                  <a href={link.href}>{link.label}</a>
                ) : (
                  <span>{link.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="footer-copyright">
        © 2025 Lumière Studio. All rights reserved.
      </p>
      <p className="footer-statement">
        Each image is styled with the precision of couture, photographed with
        the mastery of fine art.
      </p>
      <p className="footer-wordmark">Lumière</p>
    </footer>
  );
}
