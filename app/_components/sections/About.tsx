import Image from "next/image";
import { ABOUT_IMAGE_ID, unsplashUrl } from "@/lib/content";
import { SectionContainer } from "../ui/SectionContainer";
import { Eyebrow } from "../ui/Eyebrow";
import { AccentWord } from "../ui/AccentWord";
import { Reveal } from "../ui/Reveal";

export function About() {
  return (
    <SectionContainer id="ueber-uns">
      <div className="grid items-center gap-16 md:grid-cols-2">
        <Reveal>
          <div>
            <Eyebrow>Über uns</Eyebrow>
            <h2 className="mt-6 font-display text-4xl font-light leading-tight text-paper sm:text-5xl">
              Handwerk, das sich <AccentWord>Zeit</AccentWord> nimmt.
            </h2>
            <p className="mt-6 text-paper/70">
              Bei Nido Coiffeur treffen klassische Barbier-Techniken auf ein
              ruhiges, unaufgeregtes Umfeld. Jeder Schnitt beginnt mit einem
              Gespräch, nicht mit der Schere — damit das Ergebnis zu dir
              passt, nicht zum Trend der Woche.
            </p>
            <p className="mt-4 text-paper/70">
              Von der klassischen Rasur mit dem Messer bis zum präzisen Skin
              Fade: unser Team arbeitet mit Werkzeugen, die genauso viel
              Sorgfalt verdienen wie das Gesicht, dem sie gelten.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-card">
            <Image
              src={unsplashUrl(ABOUT_IMAGE_ID)}
              alt="Innenraum von Nido Coiffeur"
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </SectionContainer>
  );
}
