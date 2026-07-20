import type { ReactNode } from "react";

export function SectionContainer({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-5xl px-6 py-32 ${className ?? ""}`}
    >
      {children}
    </section>
  );
}
