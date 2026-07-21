"use client";

import { motion } from "motion/react";
import { SERVICE_GROUPS } from "@/lib/content";
import { AccentWord } from "../ui/AccentWord";
import { Reveal } from "../ui/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

function DrawnLine({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      aria-hidden
      className="h-px w-full origin-left bg-paper/10"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.4, ease: EASE, delay }}
    />
  );
}

export function Services() {
  return (
    <section id="leistungen" className="relative py-40">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-4">
                <span aria-hidden className="h-px w-10 bg-accent/70" />
                <p className="font-display text-xs uppercase tracking-[0.3em] text-paper/60">
                  Leistungen & Preise
                </p>
              </div>
              <h2 className="mt-6 font-display text-4xl font-light leading-[1.05] text-paper sm:text-5xl lg:text-6xl">
                Jeder Schnitt ein <AccentWord>Ritual</AccentWord>.
              </h2>
            </div>
            <p className="font-display text-[11px] uppercase tracking-[0.25em] text-paper/50">
              Alle Preise in CHF · inkl. Beratung
            </p>
          </div>
        </Reveal>

        <div className="mt-20 space-y-20">
          {SERVICE_GROUPS.map((group, gi) => {
            const offset = SERVICE_GROUPS.slice(0, gi).reduce(
              (n, g) => n + g.items.length,
              0
            );
            return (
              <div key={group.category}>
                <Reveal>
                  <p className="mb-6 font-display text-xs uppercase tracking-[0.35em] text-accent">
                    {group.category}
                  </p>
                </Reveal>
                <DrawnLine />
                {group.items.map((item, i) => (
                  <div key={item.name}>
                    <Reveal delay={i * 0.08}>
                      <div className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-9 sm:gap-8">
                        <span className="font-accent text-sm italic text-accent/80">
                          {String(offset + i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h3 className="font-display text-2xl font-light text-paper transition-transform duration-500 ease-out group-hover:translate-x-2 sm:text-3xl">
                            {item.name}
                            <span
                              aria-hidden
                              className="ml-4 inline-block -translate-x-2 text-2xl text-accent opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100"
                            >
                              →
                            </span>
                          </h3>
                          <p className="mt-2 max-w-md text-sm text-paper/60">
                            {item.description}
                          </p>
                        </div>
                        <p className="whitespace-nowrap font-display text-lg text-paper/80 transition-colors duration-500 group-hover:text-accent sm:text-xl">
                          {item.price}
                        </p>
                      </div>
                    </Reveal>
                    <DrawnLine delay={0.1} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
