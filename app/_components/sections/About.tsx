"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "motion/react";
import { ABOUT_IMAGE_ID, unsplashUrl } from "@/lib/content";
import { AccentWord } from "../ui/AccentWord";
import { Reveal } from "../ui/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

const PRINCIPLES = [
  {
    nr: "01",
    title: "Beratung zuerst",
    text: "Jeder Schnitt beginnt mit einem Gespräch — nicht mit der Schere.",
  },
  {
    nr: "02",
    title: "Klassisches Handwerk",
    text: "Messer-Rasur, warme Tücher und Techniken, die Bestand haben.",
  },
  {
    nr: "03",
    title: "Moderne Präzision",
    text: "Skin Fades und klare Konturen, sauber bis in den Nacken.",
  },
];

const STATS = [
  { value: 12, decimals: 0, suffix: "+", label: "Jahre Handwerk" },
  { value: 4.9, decimals: 1, suffix: "★", label: "Google Bewertung" },
  { value: 98, decimals: 0, suffix: "%", label: "Stammkunden" },
];

function CountUp({
  value,
  decimals,
  suffix,
}: {
  value: number;
  decimals: number;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2.2,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals);
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return (
    <span className="font-display text-4xl font-light text-paper sm:text-5xl">
      <span ref={ref}>0</span>
      <span className="text-accent">{suffix}</span>
    </span>
  );
}

function RotatingBadge() {
  return (
    <div className="absolute -bottom-7 -right-4 h-28 w-28 rounded-full border border-accent/30 bg-ink/80 backdrop-blur-md sm:-right-7 sm:h-32 sm:w-32">
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-1.5"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path
            id="badge-circle"
            d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0"
          />
        </defs>
        <text
          fill="rgba(242,237,228,0.65)"
          fontSize="8.2"
          letterSpacing="2.1"
          style={{ textTransform: "uppercase" }}
        >
          <textPath href="#badge-circle">
            Nido Coiffeur · Reinach · Handwerk ·
          </textPath>
        </text>
      </motion.svg>
      <span className="absolute inset-0 flex items-center justify-center font-accent text-2xl italic text-accent">
        N
      </span>
    </div>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const ghostY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section
      id="ueber-uns"
      ref={sectionRef}
      className="relative overflow-hidden py-40"
    >
      <motion.p
        aria-hidden
        className="pointer-events-none absolute top-4 left-0 w-full select-none whitespace-nowrap text-center font-display text-[22vw] font-light leading-none tracking-tight"
        style={{
          y: ghostY,
          backgroundImage:
            "linear-gradient(to bottom, rgba(242,237,228,0.09), rgba(242,237,228,0))",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        Barber
      </motion.p>

      <div className="relative mx-auto mt-24 w-full max-w-6xl px-6">
        <div className="grid items-center gap-16 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-20">
          <Reveal>
            <div className="relative">
              <motion.div
                className="relative aspect-[4/5] overflow-hidden rounded-card border border-paper/10"
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{ y: imageY, scale: 1.12 }}
                >
                  <Image
                    src={unsplashUrl(ABOUT_IMAGE_ID)}
                    alt="Barbier bei der Arbeit — Nido Coiffeur"
                    fill
                    sizes="(min-width: 768px) 40vw, 90vw"
                    className="object-cover grayscale"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              </motion.div>
              <RotatingBadge />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <div className="flex items-center gap-4">
                <span aria-hidden className="h-px w-10 bg-accent/70" />
                <p className="font-display text-xs uppercase tracking-[0.3em] text-paper/60">
                  Über uns
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-display text-4xl font-light leading-[1.05] text-paper sm:text-5xl lg:text-6xl">
                Handwerk, das sich <AccentWord>Zeit</AccentWord> nimmt.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-xl text-paper/70">
                Bei Nido Coiffeur treffen klassische Barbier-Techniken auf ein
                ruhiges, unaufgeregtes Umfeld. Kein Fliessband, kein Zeitdruck
                — nur du, dein Barbier und ein Ergebnis, das zu dir passt.
              </p>
            </Reveal>

            <div className="mt-12">
              {PRINCIPLES.map((p, i) => (
                <Reveal key={p.nr} delay={0.15 + i * 0.12}>
                  <div className="group flex items-baseline gap-6 border-t border-paper/10 py-5 transition-transform duration-500 ease-out hover:translate-x-2">
                    <span className="font-accent text-sm italic text-accent">
                      {p.nr}
                    </span>
                    <div>
                      <h3 className="font-display text-lg text-paper transition-colors group-hover:text-accent">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-sm text-paper/60">{p.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-28 grid grid-cols-1 gap-10 border-t border-paper/10 pt-12 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <CountUp
                  value={s.value}
                  decimals={s.decimals}
                  suffix={s.suffix}
                />
                <p className="mt-3 font-display text-[11px] uppercase tracking-[0.25em] text-paper/50">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
