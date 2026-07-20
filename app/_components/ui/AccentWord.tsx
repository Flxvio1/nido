import type { ReactNode } from "react";

export function AccentWord({ children }: { children: ReactNode }) {
  return <em className="font-accent italic text-accent">{children}</em>;
}
