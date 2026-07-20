import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-display text-xs uppercase tracking-[0.3em] text-paper/60">
      {children}
    </p>
  );
}
