import Link from "next/link";
import { NAV_LINKS, CONTACT } from "@/lib/content";
import { PillButton } from "../ui/PillButton";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <div className="mx-auto mt-4 flex w-[min(1100px,92%)] items-center justify-between rounded-full border border-paper/10 bg-ink/60 px-6 py-3 shadow-[inset_0_1px_0_rgba(242,237,228,0.15)] backdrop-blur-md">
        <Link href="#hero" className="font-accent text-xl italic text-paper">
          Nido
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-sm tracking-wide text-paper/70 transition-colors duration-300 hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <PillButton href={CONTACT.phoneHref} variant="outline">
          Termin anfragen
        </PillButton>
      </div>
    </header>
  );
}
