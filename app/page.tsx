import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Featured } from "@/components/sections/featured";
import { Packages } from "@/components/sections/packages";
import { Words } from "@/components/sections/words";
import { Testimonials } from "@/components/sections/testimonials";
import { Cta } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { Navbar } from "@/components/ui/navbar";
import { FooterReveal } from "@/components/ui/footer-reveal";
import { Preloader } from "@/components/ui/preloader";
export default function Home() {
  return (
    <>
      <Preloader />
      <Navbar />
      <main className="page-content">
        <Hero />
        <About />
        <Featured />
        <Packages />
        <Words />
        <Testimonials />
        <Cta />
      </main>
      <FooterReveal>
        <Footer />
      </FooterReveal>
    </>
  );
}
