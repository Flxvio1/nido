import Link from "next/link";
import { CONTACT, NAV_LINKS } from "@/lib/content";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-paper/10 pt-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-accent text-2xl italic text-paper">Nido</p>
            <p className="mt-4 max-w-[220px] text-sm leading-relaxed text-paper/50">
              Herren-Barbershop in Reinach — klassisches Handwerk, moderne
              Präzision.
            </p>
          </div>
          <div>
            <p className="font-display text-[11px] uppercase tracking-[0.25em] text-paper/40">
              Navigation
            </p>
            <nav className="mt-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-sm text-paper/60 transition-colors duration-300 hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <p className="font-display text-[11px] uppercase tracking-[0.25em] text-paper/40">
              Kontakt
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-paper/60">
              <p>{CONTACT.address}</p>
              <a
                href={CONTACT.phoneHref}
                className="w-fit transition-colors duration-300 hover:text-accent"
              >
                {CONTACT.phone}
              </a>
              <a
                href={CONTACT.emailHref}
                className="w-fit transition-colors duration-300 hover:text-accent"
              >
                {CONTACT.email}
              </a>
              <a
                href={CONTACT.whatsappHref}
                className="w-fit transition-colors duration-300 hover:text-accent"
              >
                WhatsApp
              </a>
            </div>
          </div>
          <div>
            <p className="font-display text-[11px] uppercase tracking-[0.25em] text-paper/40">
              Öffnungszeiten
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-paper/60">
              {CONTACT.hours.map((h) => (
                <p key={h.days} className="flex justify-between gap-6">
                  <span>{h.days}</span>
                  <span className="text-paper/40">{h.time}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-paper/10 py-6 text-xs text-paper/30 sm:flex-row">
          <p>© {new Date().getFullYear()} Nido Coiffeur, Reinach</p>
          <div className="flex gap-6">
            <span>Impressum</span>
            <span>Datenschutz</span>
          </div>
        </div>
      </div>

      <p
        aria-hidden
        className="pointer-events-none -mb-[0.34em] mt-4 select-none whitespace-nowrap text-center font-accent text-[26vw] italic leading-none"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(242,237,228,0.1), rgba(242,237,228,0))",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        Nido
      </p>
    </footer>
  );
}
