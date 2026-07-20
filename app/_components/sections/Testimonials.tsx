import { TESTIMONIALS } from "@/lib/content";
import { SectionContainer } from "../ui/SectionContainer";
import { Eyebrow } from "../ui/Eyebrow";
import { AccentWord } from "../ui/AccentWord";
import { Reveal } from "../ui/Reveal";

export function Testimonials() {
  return (
    <SectionContainer id="bewertungen">
      <Reveal>
        <div className="text-center">
          <Eyebrow>Bewertungen</Eyebrow>
          <h2 className="mt-6 font-display text-4xl font-light leading-tight text-paper sm:text-5xl">
            5 von 5 <AccentWord>Sternen</AccentWord>.
          </h2>
          <p className="mt-4 text-2xl tracking-[0.3em] text-accent">★★★★★</p>
        </div>
      </Reveal>
      <div className="mt-16 grid gap-8 sm:grid-cols-3">
        {TESTIMONIALS.map((testimonial, index) => (
          <Reveal key={testimonial.author} delay={index * 0.1}>
            <div className="rounded-card border border-paper/10 p-8">
              <p className="font-accent text-lg italic text-paper/90">
                „{testimonial.quote}“
              </p>
              <p className="mt-4 text-sm text-paper/50">
                — {testimonial.author}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionContainer>
  );
}
