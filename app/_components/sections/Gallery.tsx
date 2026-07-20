import Image from "next/image";
import { GALLERY_IMAGE_IDS, unsplashUrl } from "@/lib/content";
import { SectionContainer } from "../ui/SectionContainer";
import { Eyebrow } from "../ui/Eyebrow";
import { AccentWord } from "../ui/AccentWord";
import { Reveal } from "../ui/Reveal";

export function Gallery() {
  return (
    <SectionContainer id="galerie">
      <Reveal>
        <Eyebrow>Galerie</Eyebrow>
        <h2 className="mt-6 font-display text-4xl font-light leading-tight text-paper sm:text-5xl">
          Einblicke in den <AccentWord>Alltag</AccentWord>.
        </h2>
      </Reveal>
      <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {GALLERY_IMAGE_IDS.map((id, index) => (
          <Reveal key={id} delay={index * 0.05}>
            <div className="relative aspect-square overflow-hidden rounded-card">
              <Image
                src={unsplashUrl(id)}
                alt="Impression aus dem Nido Coiffeur Barbershop"
                fill
                sizes="(min-width: 640px) 30vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </SectionContainer>
  );
}
