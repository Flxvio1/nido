import { SERVICE_GROUPS } from "@/lib/content";
import { SectionContainer } from "../ui/SectionContainer";
import { Eyebrow } from "../ui/Eyebrow";
import { AccentWord } from "../ui/AccentWord";
import { Reveal } from "../ui/Reveal";

export function Services() {
  return (
    <SectionContainer id="leistungen">
      <Reveal>
        <Eyebrow>Leistungen</Eyebrow>
        <h2 className="mt-6 font-display text-4xl font-light leading-tight text-paper sm:text-5xl">
          Jeder Schnitt ein <AccentWord>Handwerk</AccentWord>.
        </h2>
      </Reveal>
      <div className="mt-16 space-y-12">
        {SERVICE_GROUPS.map((group) => (
          <div key={group.category}>
            <Reveal>
              <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">
                {group.category}
              </p>
            </Reveal>
            <div className="mt-4 divide-y divide-paper/10 border-y border-paper/10">
              {group.items.map((item, index) => (
                <Reveal key={item.name} delay={index * 0.05}>
                  <div className="flex items-center justify-between gap-6 py-6">
                    <div>
                      <h3 className="font-display text-xl text-paper">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-paper/60">
                        {item.description}
                      </p>
                    </div>
                    <p className="whitespace-nowrap font-display text-lg text-paper/80">
                      {item.price}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
