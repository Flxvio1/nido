import Image from "next/image";
import { ATMOSPHERE, unsplashUrl } from "@/lib/content";
import { SectionContainer } from "../ui/SectionContainer";
import { Eyebrow } from "../ui/Eyebrow";
import { AccentWord } from "../ui/AccentWord";
import { Reveal } from "../ui/Reveal";

function AtmosphereImage({
  image,
  aspect,
  sizes,
  delay = 0,
  imageClassName = "",
}: {
  image: { id: string; alt: string; caption: string };
  aspect: string;
  sizes: string;
  delay?: number;
  imageClassName?: string;
}) {
  return (
    <Reveal delay={delay}>
      <figure>
        <div className={`group relative overflow-hidden rounded-card ${aspect}`}>
          <Image
            src={unsplashUrl(image.id)}
            alt={image.alt}
            fill
            sizes={sizes}
            className={`object-cover transition-transform duration-700 group-hover:scale-105 ${imageClassName}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
        </div>
        <figcaption className="mt-4 font-display text-[11px] uppercase tracking-[0.25em] text-paper/40">
          {image.caption}
        </figcaption>
      </figure>
    </Reveal>
  );
}

export function Atmosphere() {
  const { images, keywords } = ATMOSPHERE;

  return (
    <SectionContainer id="atmosphaere">
      <div className="grid gap-10 sm:grid-cols-12 sm:items-end">
        <Reveal className="sm:col-span-7">
          <Eyebrow>Atmosphäre</Eyebrow>
          <h2 className="mt-6 font-display text-4xl font-light leading-tight text-paper sm:text-5xl">
            Ein Ort, der <AccentWord>entschleunigt</AccentWord>.
          </h2>
        </Reveal>
        <Reveal delay={0.15} className="sm:col-span-5">
          <p className="text-base text-paper/60 sm:text-lg">
            Dunkles Holz, warmes Licht, ein guter Espresso — bei Nido legst du
            den Alltag mit der Jacke ab. Der Stuhl gehört dir, solange es
            braucht.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-12">
        <div className="sm:col-span-7">
          <AtmosphereImage
            image={images.chairs}
            aspect="aspect-[3/4]"
            sizes="(min-width: 640px) 55vw, 90vw"
          />
        </div>
        {/* Staggered downwards so the column reads as an editorial spread,
            not a grid of thumbnails. */}
        <div className="flex flex-col gap-6 sm:col-span-5 sm:mt-24">
          <AtmosphereImage
            image={images.interior}
            aspect="aspect-[4/3]"
            sizes="(min-width: 640px) 38vw, 90vw"
            delay={0.1}
          />
          <AtmosphereImage
            image={images.tools}
            aspect="aspect-square"
            sizes="(min-width: 640px) 38vw, 90vw"
            delay={0.2}
          />
        </div>
      </div>

      <Reveal delay={0.1}>
        <ul className="mt-16 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-paper/10 pt-8">
          {keywords.map((keyword, index) => (
            <li
              key={keyword}
              className="flex items-center gap-4 font-display text-xs uppercase tracking-[0.25em] text-paper/50"
            >
              {index > 0 && <span aria-hidden className="text-accent">·</span>}
              {keyword}
            </li>
          ))}
        </ul>
      </Reveal>
    </SectionContainer>
  );
}
