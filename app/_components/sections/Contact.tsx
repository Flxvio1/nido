import { CONTACT } from "@/lib/content";
import { SectionContainer } from "../ui/SectionContainer";
import { Eyebrow } from "../ui/Eyebrow";
import { AccentWord } from "../ui/AccentWord";
import { PillButton } from "../ui/PillButton";
import { Reveal } from "../ui/Reveal";
import { BookingDialog } from "./BookingDialog";

export function Contact() {
  return (
    <SectionContainer id="kontakt">
      <div className="overflow-hidden rounded-card border border-paper/10 bg-paper/5 p-8 shadow-[inset_0_1px_0_rgba(242,237,228,0.12)] sm:p-14">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
          <div>
            <Reveal>
              <Eyebrow>Online buchen</Eyebrow>
              <h2 className="mt-6 font-display text-4xl font-light leading-tight text-paper sm:text-5xl">
                Buch dir deinen <AccentWord>Termin</AccentWord>.
              </h2>
              <p className="mt-6 max-w-md text-paper/70">
                Datum und Zeit aussuchen — die Bestätigung kommt direkt per
                WhatsApp.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <BookingDialog />
                <p className="text-sm text-paper/40">
                  Dauert keine 30 Sekunden.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="space-y-8 border-paper/10 lg:border-l lg:pl-12">
              <div>
                <p className="font-display text-xs uppercase tracking-[0.3em] text-paper/50">
                  Adresse
                </p>
                <p className="mt-2 text-paper/80">{CONTACT.address}</p>
              </div>
              <div>
                <p className="font-display text-xs uppercase tracking-[0.3em] text-paper/50">
                  Kontakt
                </p>
                <p className="mt-2 text-paper/80">{CONTACT.phone}</p>
                <p className="text-paper/80">{CONTACT.email}</p>
              </div>
              <div>
                <p className="font-display text-xs uppercase tracking-[0.3em] text-paper/50">
                  Öffnungszeiten
                </p>
                <div className="mt-2 space-y-1">
                  {CONTACT.hours.map((entry) => (
                    <div
                      key={entry.days}
                      className="flex justify-between gap-6 text-sm text-paper/80"
                    >
                      <span>{entry.days}</span>
                      <span className="whitespace-nowrap text-paper/60">
                        {entry.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-paper/10 pt-8">
                <p className="text-sm text-paper/50">
                  Lieber persönlich? Ruf kurz durch.
                </p>
                <div className="mt-4">
                  <PillButton href={CONTACT.phoneHref} variant="outline">
                    Anrufen
                  </PillButton>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </SectionContainer>
  );
}
