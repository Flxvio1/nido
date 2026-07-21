import { TESTIMONIALS } from "@/lib/content";
import { AccentWord } from "../ui/AccentWord";
import { Reveal } from "../ui/Reveal";

function TestimonialCard({
  quote,
  author,
}: {
  quote: string;
  author: string;
}) {
  return (
    <figure className="mr-6 w-[320px] shrink-0 rounded-card border border-paper/10 bg-paper/[0.03] p-8 shadow-[inset_0_1px_0_rgba(242,237,228,0.08)] backdrop-blur-sm sm:w-[400px]">
      <p
        aria-hidden
        className="text-sm tracking-[0.25em] text-accent"
      >
        ★★★★★
      </p>
      <blockquote className="mt-5 font-accent text-lg italic leading-relaxed text-paper/90">
        „{quote}“
      </blockquote>
      <figcaption className="mt-6 font-display text-[11px] uppercase tracking-[0.25em] text-paper/50">
        {author} · Google
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  return (
    <section id="bewertungen" className="relative overflow-hidden py-40">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-4">
                <span aria-hidden className="h-px w-10 bg-accent/70" />
                <p className="font-display text-xs uppercase tracking-[0.3em] text-paper/60">
                  Bewertungen
                </p>
              </div>
              <h2 className="mt-6 font-display text-4xl font-light leading-[1.05] text-paper sm:text-5xl lg:text-6xl">
                Was unsere <AccentWord>Kunden</AccentWord> sagen.
              </h2>
            </div>
            <p className="font-display text-sm text-paper/60">
              <span className="mr-3 tracking-[0.2em] text-accent">★★★★★</span>
              5.0 · Google Bewertungen
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <div className="group relative mt-16">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent sm:w-40" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent sm:w-40" />
          <div className="flex w-max animate-[marquee-right_55s_linear_infinite] group-hover:[animation-play-state:paused]">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <TestimonialCard key={`${t.author}-${i}`} {...t} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
