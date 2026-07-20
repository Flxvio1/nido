import Image from "next/image";
import { HERO_IMAGE_ID, unsplashUrl } from "@/lib/content";
import { Eyebrow } from "../ui/Eyebrow";
import { AccentWord } from "../ui/AccentWord";
import { PillButton } from "../ui/PillButton";
import { Reveal } from "../ui/Reveal";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-end overflow-hidden px-6 pb-24 pt-40"
    >
      <Image
        src={unsplashUrl(HERO_IMAGE_ID)}
        alt="Rasur mit dem Messer bei Nido Coiffeur"
        fill
        preload
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
      <div className="relative mx-auto w-full max-w-5xl">
        <Reveal>
          <Eyebrow>Herren Barbier · Reinach</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-6 max-w-3xl font-display text-6xl font-light leading-[1.05] tracking-tight text-paper sm:text-7xl">
            Präzision, die man <AccentWord>spürt</AccentWord>.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-lg text-paper/70">
            Klassisches Handwerk, ruhige Atmosphäre und ein Schnitt, der sitzt
            — Nido Coiffeur ist der Herren-Barbershop in Reinach.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-10">
            <PillButton href="#kontakt">Termin anfragen</PillButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
