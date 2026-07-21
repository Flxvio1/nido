"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { MonogramScene } from "../three/MonogramScene";
import { useCanRender3D } from "../three/useCanRender3D";
import { SIGNATURE_FALLBACK_IMAGE_ID, unsplashUrl } from "@/lib/content";
import { Eyebrow } from "../ui/Eyebrow";
import { AccentWord } from "../ui/AccentWord";

const STATEMENTS = [
  {
    eyebrow: "01 · Ankunft",
    before: "Jeder Termin beginnt mit ",
    accent: "Ruhe",
    after: ", nicht mit der Uhr.",
  },
  {
    eyebrow: "02 · Handwerk",
    before: "Die Klinge folgt der ",
    accent: "Kontur",
    after: ", nicht der Routine.",
  },
  {
    eyebrow: "03 · Finish",
    before: "Präzision zeigt sich erst im letzten ",
    accent: "Millimeter",
    after: ".",
  },
];

export function SignatureSequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const canRender3D = useCanRender3D();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Note: "0% 0%"/"100% 100%" is numerically identical to the
    // "start start"/"end end" preset, but the literal preset keywords make
    // Motion pick a browser-native ViewTimeline (CSS `contain` named range)
    // to drive scrollYProgress. For a target much taller than the viewport
    // (this section is 300vh) that native range is degenerate, which desyncs
    // the derived opacity crossfades from real scroll position and lets two
    // statements render at full opacity simultaneously. The equivalent
    // percentage-edge syntax below isn't recognised by Motion's preset
    // matcher, so it keeps the (correct) JS-computed scroll tracking.
    offset: ["0% 0%", "100% 100%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progressRef.current = value;
  });

  const opacity0 = useTransform(scrollYProgress, [0, 0.22, 0.33], [1, 1, 0]);
  const opacity1 = useTransform(
    scrollYProgress,
    [0.33, 0.45, 0.55, 0.66],
    [0, 1, 1, 0]
  );
  const opacity2 = useTransform(scrollYProgress, [0.66, 0.78, 1], [0, 1, 1]);
  const opacities = [opacity0, opacity1, opacity2];

  return (
    <section ref={sectionRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute inset-0">
          {canRender3D ? (
            <MonogramScene progressRef={progressRef} />
          ) : (
            <Image
              src={unsplashUrl(SIGNATURE_FALLBACK_IMAGE_ID)}
              alt="Klinge und Präzision bei Nido Coiffeur"
              fill
              sizes="100vw"
              className="object-cover opacity-70"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
        <div className="relative mx-auto h-40 w-[min(600px,90%)] text-center">
          {STATEMENTS.map((statement, index) => (
            <motion.div
              key={statement.eyebrow}
              style={{ opacity: opacities[index] }}
              className="absolute inset-x-0"
            >
              <Eyebrow>{statement.eyebrow}</Eyebrow>
              <p className="mt-4 font-display text-3xl font-light leading-snug text-paper [text-shadow:0_2px_28px_rgba(0,0,0,0.9),0_0_8px_rgba(0,0,0,0.5)] sm:text-4xl">
                {statement.before}
                <AccentWord>{statement.accent}</AccentWord>
                {statement.after}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
