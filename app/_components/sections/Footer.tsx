import Link from "next/link";
import { CONTACT, NAV_LINKS } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-paper/10 px-6 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-accent text-xl italic text-paper">Nido</p>
          <p className="mt-1 text-sm text-paper/50">{CONTACT.address}</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-paper/60 transition-colors duration-300 hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex gap-6 text-sm text-paper/40">
          <span>Impressum</span>
          <span>Datenschutz</span>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-paper/30">
        © {new Date().getFullYear()} Nido Coiffeur, Reinach
      </p>
    </footer>
  );
}
