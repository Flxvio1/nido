import Link from "next/link";
import type { ReactNode } from "react";

export function PillButton({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-display tracking-wide transition-colors duration-300";
  const styles =
    variant === "solid"
      ? "bg-paper text-ink hover:bg-accent"
      : "border border-paper/20 text-paper hover:border-accent hover:text-accent";

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}
