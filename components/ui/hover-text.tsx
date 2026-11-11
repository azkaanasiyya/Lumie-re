export function HoverText({ children }: { children: string }) {
  return (
    <span className="hover-text">
      <span className="hover-text-track">
        <span>{children}</span>
        <span className="hover-text-copy" aria-hidden="true">
          {children}
        </span>
      </span>
    </span>
  );
}
