import Image from "next/image";
import { TEAM, unsplashUrl } from "@/lib/content";
import { SectionContainer } from "../ui/SectionContainer";
import { Eyebrow } from "../ui/Eyebrow";
import { AccentWord } from "../ui/AccentWord";
import { Reveal } from "../ui/Reveal";

export function Team() {
  return (
    <SectionContainer id="team">
      <Reveal>
        <Eyebrow>Team</Eyebrow>
        <h2 className="mt-6 font-display text-4xl font-light leading-tight text-paper sm:text-5xl">
          Die Hände hinter der <AccentWord>Klinge</AccentWord>.
        </h2>
      </Reveal>
      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        {TEAM.map((member, index) => (
          <Reveal key={member.name} delay={index * 0.1}>
            <div className="group relative aspect-[3/4] overflow-hidden rounded-card">
              <Image
                src={unsplashUrl(member.imageId)}
                alt={member.name}
                fill
                sizes="(min-width: 640px) 30vw, 90vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="font-display text-lg text-paper">
                  {member.name}
                </p>
                <p className="mt-1 text-sm text-paper/60">{member.role}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionContainer>
  );
}
