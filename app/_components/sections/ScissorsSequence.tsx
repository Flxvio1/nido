"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ScissorsScene } from "../three/ScissorsScene";
import { useCanRender3D } from "../three/useCanRender3D";
import { SIGNATURE_FALLBACK_IMAGE_ID, unsplashUrl } from "@/lib/content";
import { Eyebrow } from "../ui/Eyebrow";
import { AccentWord } from "../ui/AccentWord";

const STATEMENTS = [
  {
    eyebrow: "01 · Haltung",
    before: "Ein Schnitt ist ein ",
    accent: "Statement",
    after: ".",
  },
  {
    eyebrow: "02 · Handwerk",
    before: "Handwerk. Keine ",
    accent: "Trends",
    after: ".",
  },
  {
    eyebrow: "03 · Versprechen",
    before: "Dein Stil. Unsere ",
    accent: "Klinge",
    after: ".",
  },
];

// Opacity and vertical-drift windows per statement, in section progress.
const WINDOWS: {
  opacity: [number[], number[]];
  y: [number[], string[]];
}[] = [
  {
    opacity: [
      [0, 0.16, 0.3],
      [1, 1, 0],
    ],
    y: [
      [0, 0.3],
      ["0%", "-30%"],
    ],
  },
  {
    opacity: [
      [0.34, 0.44, 0.58, 0.66],
      [0, 1, 1, 0],
    ],
    y: [
      [0.34, 0.66],
      ["30%", "-30%"],
    ],
  },
  {
    opacity: [
      [0.7, 0.8, 1],
      [0, 1, 1],
    ],
    y: [
      [0.7, 1],
      ["30%", "0%"],
    ],
  },
];

function Statement({
  progress,
  index,
}: {
  progress: MotionValue<number>;
  index: number;
}) {
  const { eyebrow, before, accent, after } = STATEMENTS[index];
  const window = WINDOWS[index];
  const opacity = useTransform(progress, window.opacity[0], window.opacity[1]);
  const y = useTransform(progress, window.y[0], window.y[1]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <p className="mt-6 max-w-5xl font-display text-5xl font-light leading-[1.05] tracking-tight text-paper [text-shadow:0_2px_36px_rgba(0,0,0,0.9)] sm:text-7xl lg:text-8xl">
        {before}
        <AccentWord>{accent}</AccentWord>
        {after}
      </p>
    </motion.div>
  );
}

export function ScissorsSequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const canRender3D = useCanRender3D();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Note: "0% 0%"/"100% 100%" is numerically identical to the
    // "start start"/"end end" preset, but the literal preset keywords make
    // Motion pick a browser-native ViewTimeline (CSS `contain` named range)
    // to drive scrollYProgress. For a target much taller than the viewport
    // (this section is 240vh) that native range is degenerate, which desyncs
    // the derived opacity crossfades from real scroll position and lets two
    // statements render at full opacity simultaneously. The equivalent
    // percentage-edge syntax below isn't recognised by Motion's preset
    // matcher, so it keeps the (correct) JS-computed scroll tracking.
    offset: ["0% 0%", "100% 100%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progressRef.current = value;
  });

  // The gold hairline at the top hands the eye over from the hours strip
  // into the black stage; it retracts as the sequence takes over.
  const lineScale = useTransform(scrollYProgress, [0, 0.14], [1, 0]);

  return (
    <section ref={sectionRef} className="relative h-[240vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0">
          {canRender3D ? (
            <ScissorsScene progressRef={progressRef} />
          ) : (
            <Image
              src={unsplashUrl(SIGNATURE_FALLBACK_IMAGE_ID)}
              alt="Klinge und Präzision bei Nido Coiffeur"
              fill
              sizes="100vw"
              className="object-cover opacity-40"
            />
          )}
        </div>
        {/* Push the scene into the background so the typography leads. */}
        <div className="absolute inset-0 bg-ink/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/60" />
        <motion.span
          aria-hidden
          style={{ scaleY: lineScale }}
          className="absolute left-1/2 top-0 h-20 w-px origin-top -translate-x-1/2 bg-gradient-to-b from-accent/70 to-transparent"
        />
        <div className="absolute inset-0">
          {STATEMENTS.map((statement, index) => (
            <Statement
              key={statement.eyebrow}
              progress={scrollYProgress}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
