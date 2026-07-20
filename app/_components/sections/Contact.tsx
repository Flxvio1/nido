import { CONTACT } from "@/lib/content";
import { SectionContainer } from "../ui/SectionContainer";
import { Eyebrow } from "../ui/Eyebrow";
import { AccentWord } from "../ui/AccentWord";
import { PillButton } from "../ui/PillButton";
import { Reveal } from "../ui/Reveal";

export function Contact() {
  return (
    <SectionContainer id="kontakt">
      <div className="overflow-hidden rounded-card border border-paper/10 bg-paper/5 p-10 shadow-[inset_0_1px_0_rgba(242,237,228,0.12)] sm:p-16">
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <div>
              <Eyebrow>Kontakt</Eyebrow>
              <h2 className="mt-6 font-display text-4xl font-light leading-tight text-paper sm:text-5xl">
                Zeit für einen <AccentWord>Termin</AccentWord>.
              </h2>
              <p className="mt-6 text-paper/70">
                Ruf an, schreib uns oder komm vorbei — wir freuen uns auf
                dich.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <PillButton href={CONTACT.phoneHref}>Anrufen</PillButton>
                <PillButton href={CONTACT.whatsappHref} variant="outline">
                  WhatsApp
                </PillButton>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="space-y-8">
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
                      className="flex justify-between text-paper/80"
                    >
                      <span>{entry.days}</span>
                      <span>{entry.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </SectionContainer>
  );
}
