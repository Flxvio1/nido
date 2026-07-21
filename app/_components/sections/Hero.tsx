"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { PillButton } from "../ui/PillButton";

const EASE = [0.16, 1, 0.3, 1] as const;

type Word = { word: string; index: number; accent?: boolean };

const HEADLINE_LINES: Word[][] = [
  [{ word: "Präzision,", index: 0 }],
  [
    { word: "die", index: 1 },
    { word: "man", index: 2 },
    { word: "spürt.", index: 3, accent: true },
  ],
];

function KineticWord({ word, accent, index }: Word) {
  return (
    <span className="relative inline-block">
      <span className="relative inline-block overflow-hidden pb-[0.14em] pr-[0.05em]">
        <motion.span
          className="inline-block will-change-transform"
          initial={{ y: "115%", opacity: 0, filter: "blur(10px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.45 + index * 0.11 }}
        >
          {accent ? (
            <em className="font-accent italic text-accent">{word}</em>
          ) : (
            word
          )}
        </motion.span>
      </span>
      {accent && (
        <motion.span
          aria-hidden
          className="absolute bottom-[0.02em] left-[0.05em] right-[0.1em] h-px origin-left bg-accent/60"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 1.7 }}
        />
      )}
    </span>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const mouseX = useSpring(useMotionValue(0), { stiffness: 40, damping: 16 });
  const mouseY = useSpring(useMotionValue(0), { stiffness: 40, damping: 16 });

  function handlePointerMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    mouseX.set((e.clientX / window.innerWidth - 0.5) * 26);
    mouseY.set((e.clientY / window.innerHeight - 0.5) * 18);
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      onPointerMove={handlePointerMove}
      className="relative flex min-h-screen items-end overflow-hidden px-6 pb-40 pt-40"
    >
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <motion.div
          className="absolute inset-0"
          style={{ x: mouseX, y: mouseY }}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1.08 }}
          transition={{ duration: 1.8, ease: EASE }}
        >
          <Image
            src="/hero-v2.png"
            alt="Schere und Haarschneider in Schwarz-Gold bei Nido Coiffeur"
            fill
            preload
            sizes="100vw"
            className="object-cover brightness-[1.25]"
          />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

      <motion.div
        className="relative mx-auto w-full max-w-6xl"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="flex items-center gap-4">
          <motion.span
            aria-hidden
            className="h-px w-10 origin-left bg-accent/70"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.15 }}
          />
          <motion.p
            className="font-display text-xs uppercase text-paper/60"
            initial={{ opacity: 0, letterSpacing: "0.55em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
          >
            Herren Barbier · Reinach
          </motion.p>
        </div>
        <h1 className="mt-6 font-display text-5xl font-light leading-[1.02] tracking-tight text-paper sm:text-7xl lg:text-9xl">
          {HEADLINE_LINES.map((line, i) => (
            <span key={i} className="flex flex-wrap gap-x-[0.24em]">
              {line.map((w) => (
                <KineticWord key={w.word} {...w} />
              ))}
            </span>
          ))}
        </h1>
        <motion.p
          className="mt-8 max-w-xl text-lg text-paper/70"
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: EASE, delay: 1.15 }}
        >
          Klassisches Handwerk, ruhige Atmosphäre und ein Schnitt, der sitzt —
          Nido Coiffeur ist der Herren-Barbershop in Reinach.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap items-center gap-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1.35 }}
        >
          <PillButton href="#kontakt">Termin anfragen</PillButton>
          <a
            href="#leistungen"
            className="group font-display text-sm uppercase tracking-[0.2em] text-paper/60 transition-colors hover:text-paper"
          >
            Leistungen entdecken
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute inset-x-0 bottom-0"
        style={{ opacity: contentOpacity }}
      >
        <motion.div
          className="mx-auto grid w-full max-w-6xl grid-cols-3 items-center border-t border-paper/10 px-6 py-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 1.9 }}
        >
          <p className="hidden font-display text-[11px] uppercase tracking-[0.25em] text-paper/50 md:block">
            Hauptstrasse 20 · Reinach
          </p>
          <div className="col-span-3 flex flex-col items-center gap-2 md:col-span-1">
            <span className="font-display text-[10px] uppercase tracking-[0.3em] text-paper/50">
              Scroll
            </span>
            <span className="relative block h-10 w-px overflow-hidden bg-paper/10">
              <motion.span
                className="absolute left-0 top-0 block h-4 w-px bg-accent"
                animate={{ y: ["-110%", "290%"] }}
                transition={{
                  duration: 2.2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              />
            </span>
          </div>
          <p className="hidden text-right font-display text-[11px] uppercase tracking-[0.25em] text-paper/50 md:block">
            <span className="mr-3 tracking-[0.15em] text-accent">
              ★★★★★
            </span>
            Google Bewertungen
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
