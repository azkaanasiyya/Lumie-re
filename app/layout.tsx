import type { Metadata } from "next";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
const satoshi = localFont({
  src: [
    { path: "./fonts/satoshi-regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/satoshi-medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/satoshi-bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Lumière — Stories through elegant frames",
  description:
    "Transforming stories into timeless art. Lumière photography studio.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={satoshi.variable}>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
