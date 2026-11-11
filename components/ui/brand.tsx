import Image from "next/image";
export function Brand({ large = false }: { large?: boolean }) {
  return (
    <a
      className={`brand${large ? " brand-large" : ""}`}
      href="#home"
      aria-label="Lumière home"
    >
      <Image src="/icons/globe.svg" width={24} height={24} alt="" />
      <span>Lumière</span>
    </a>
  );
}
