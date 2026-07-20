# Nido Coiffeur — Dark Luxury Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the one-pager Next.js draft for Nido Coiffeur — a dark-luxury marketing site with a monochrome-plus-chrome-accent visual system, a Jost/Playfair Display type pairing, and a procedural 3D straight-razor scroll centerpiece — per `docs/superpowers/specs/2026-07-20-nido-coiffeur-redesign-design.md`.

**Architecture:** A single `app/page.tsx` assembles ten section components (`app/_components/sections/`) built from a small shared UI primitives layer (`app/_components/ui/`) and a centralized placeholder-content module (`lib/content.ts`). The signature 3D sequence lives in its own `app/_components/three/` folder, isolated from ordinary UI so the WebGL/animation concerns don't leak into simpler components.

**Tech Stack:** Next.js 16.2.10 (App Router, Turbopack default), React 19.2.4, Tailwind CSS v4 (CSS-based `@theme`, no `tailwind.config.ts`), `motion` (React bindings via `motion/react`) for scroll reveals and scroll coupling, `@react-three/fiber` + `@react-three/drei` for the 3D razor, `next/font/google` for Jost + Playfair Display. Package manager: **bun** (`bun.lock` present).

## Global Constraints

- All UI copy is in **German**.
- Design tokens are fixed by the spec: background `#0c0b09`, foreground `#f2ede4`, accent `#a9c4d6` / glow `#e4f1fa` — no additional color literals anywhere in components; secondary tones are `paper` at opacity steps (`/10`, `/15`, `/20`, `/40`, `/50`, `/60`, `/70`).
- Two font families only: **Jost** (`font-display`, weight 300 for body/headlines) and **Playfair Display Italic** (`font-accent`, for exactly one emphasized word per headline).
- Shape system: pill radius for buttons/badges (`rounded-full`), `28px` (`rounded-card`) for cards/images — never mixed, never sharp corners.
- One easing curve for all scroll reveals: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Real business data (must match exactly): address `Hauptstrasse 20, 4053 Reinach`, phone `+41 61 711 20 25` (`tel:+41617112025`), hours Mon–Sat `10:00–20:00 Uhr`, Sunday closed.
- All prices, team names/photos, and testimonials are explicitly-labeled placeholders (see spec) — use exactly the placeholder content defined in Task 4, do not invent different values in later tasks.
- Next.js 16 breaking changes to honor: use `preload` on `next/image`, not the deprecated `priority`; use `images.remotePatterns` in `next.config.ts`, not `images.domains`; set `data-scroll-behavior="smooth"` explicitly on `<html>`.
- **No test framework is introduced.** This is a pure frontend visual draft with no business logic to unit-test; introducing Jest/Vitest for markup-only components would be pure overhead (YAGNI). The verification gate for every task is: `bunx tsc --noEmit` (type safety) + `bun run lint` (ESLint) +, for anything visual, a dev-server check (`bun run dev` + `curl`/browser). The final task additionally runs a full production build and a real browser pass via the `run` skill.
- Component boundaries: one file per section under `app/_components/sections/`, shared primitives under `app/_components/ui/`, 3D-only code isolated under `app/_components/three/`. Don't extract a shared abstraction that's only used once.

---

### Task 1: Dependencies & Next.js image config

**Files:**
- Modify: `package.json` (via `bun add`)
- Modify: `next.config.ts`

**Interfaces:**
- Produces: `images.remotePatterns` allowing `images.unsplash.com`, so every later task's `next/image` usage with Unsplash URLs works without a config error.

- [ ] **Step 1: Install runtime dependencies**

Run:
```bash
bun add motion three @react-three/fiber @react-three/drei
bun add -d @types/three
```

- [ ] **Step 2: Configure remote image patterns**

Replace the contents of `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 3: Verify**

Run: `bunx tsc --noEmit`
Expected: no errors (project has no source changes yet beyond config, so this just confirms the toolchain still resolves).

- [ ] **Step 4: Commit**

```bash
git add package.json bun.lock next.config.ts
git commit -m "chore: add motion/three-fiber deps and Unsplash remote image pattern"
```

---

### Task 2: Design tokens & global CSS

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Produces: Tailwind v4 theme tokens `--color-ink`, `--color-paper`, `--color-accent`, `--color-accent-glow`, `--font-display`, `--font-accent`, `--radius-card` — consumed by every component task via utilities `bg-ink`, `text-paper`, `text-accent`, `font-display`, `font-accent`, `rounded-card`.

- [ ] **Step 1: Replace the theme block**

Replace the full contents of `app/globals.css`:

```css
@import "tailwindcss";

@theme inline {
  --color-ink: #0c0b09;
  --color-paper: #f2ede4;
  --color-accent: #a9c4d6;
  --color-accent-glow: #e4f1fa;
  --font-display: var(--font-jost);
  --font-accent: var(--font-playfair);
  --radius-card: 28px;
}

html,
body {
  background-color: var(--color-ink);
  color: var(--color-paper);
}

body {
  overflow-x: hidden;
}
```

- [ ] **Step 2: Verify**

Run: `bunx tsc --noEmit`
Expected: no errors. (CSS isn't type-checked; this step just confirms the repo still compiles. The `--font-jost`/`--font-playfair` variables don't exist yet — that's expected until Task 3 — Tailwind silently falls back, no build error.)

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: define dark-luxury design tokens (ink/paper/accent/radius)"
```

---

### Task 3: Root layout — fonts, metadata, smooth scroll

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: CSS variables `--font-jost` and `--font-playfair` on `<html>` (consumed by Task 2's theme tokens), German `lang="de"`, `data-scroll-behavior="smooth"`.

- [ ] **Step 1: Replace the root layout**

Replace the full contents of `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Jost, Playfair_Display } from "next/font/google";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Nido Coiffeur — Herren Barbershop in Reinach",
  description:
    "Nido Coiffeur ist ein Herren-Barbershop in Reinach: Präzisionsschnitte, klassische Rasur und Bartstyling in edler, ruhiger Atmosphäre.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      data-scroll-behavior="smooth"
      className={`${jost.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink font-display text-paper">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify**

Run: `bunx tsc --noEmit`
Expected: no errors.

Run: `bun run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: wire Jost/Playfair Display fonts, German metadata, smooth scroll"
```

---

### Task 4: Placeholder content module

**Files:**
- Create: `lib/content.ts`

**Interfaces:**
- Produces: `CONTACT`, `NAV_LINKS`, `SERVICE_GROUPS`, `TEAM`, `GALLERY_IMAGE_IDS`, `HERO_IMAGE_ID`, `ABOUT_IMAGE_ID`, `SIGNATURE_FALLBACK_IMAGE_ID`, `TESTIMONIALS`, `unsplashUrl(id, params?)` — imported via the `@/lib/content` path alias (already configured in `tsconfig.json`) by every section task below.
- Image IDs are real, verified Unsplash photo IDs (checked to resolve with HTTP 200 and to visually match a dark, moody men's-barbershop aesthetic during planning).

- [ ] **Step 1: Create the content module**

Create `lib/content.ts`:

```ts
export const CONTACT = {
  name: "Nido Coiffeur",
  address: "Hauptstrasse 20, 4053 Reinach",
  phone: "+41 61 711 20 25",
  phoneHref: "tel:+41617112025",
  email: "info@nido-coiffeur.ch",
  emailHref: "mailto:info@nido-coiffeur.ch",
  whatsappHref: "https://wa.me/41617112025",
  hours: [
    { days: "Montag – Freitag", time: "10:00 – 20:00 Uhr" },
    { days: "Samstag", time: "10:00 – 20:00 Uhr" },
    { days: "Sonntag", time: "Geschlossen" },
  ],
};

export const NAV_LINKS = [
  { href: "#ueber-uns", label: "Über uns" },
  { href: "#leistungen", label: "Leistungen" },
  { href: "#team", label: "Team" },
  { href: "#galerie", label: "Galerie" },
  { href: "#kontakt", label: "Kontakt" },
];

export const SERVICE_GROUPS = [
  {
    category: "Haarschnitt",
    items: [
      {
        name: "Classic Cut",
        description: "Präzisionsschnitt nach Wahl, inkl. Waschen & Styling.",
        price: "ab CHF 45",
      },
      {
        name: "Skin Fade",
        description: "Sauberer Verlauf, nahtlos ausrasiert.",
        price: "ab CHF 55",
      },
    ],
  },
  {
    category: "Bart",
    items: [
      {
        name: "Bartkontur",
        description: "Konturenschnitt & Formgebung mit dem Messer.",
        price: "ab CHF 30",
      },
      {
        name: "Vollbart-Styling",
        description: "Vollständige Bartpflege mit warmem Öl.",
        price: "ab CHF 40",
      },
    ],
  },
  {
    category: "Rasur",
    items: [
      {
        name: "Klassische Rasur",
        description:
          "Rasiermesser mit heissem Handtuch, traditionelles Ritual.",
        price: "ab CHF 50",
      },
    ],
  },
  {
    category: "Pflege",
    items: [
      {
        name: "Gesichtsbehandlung",
        description: "Reinigung & Pflege speziell für den Mann.",
        price: "ab CHF 35",
      },
    ],
  },
];

export const TEAM = [
  {
    name: "Luca Meier",
    role: "Inhaber & Master Barbier",
    imageId: "1583864697784-a0efc8379f70",
  },
  {
    name: "Dino Rossi",
    role: "Senior Barbier, Bart-Spezialist",
    imageId: "1499996860823-5214fcc65f8f",
  },
  {
    name: "Elias Frei",
    role: "Barbier, Fade-Spezialist",
    imageId: "1506634572416-48cdfe530110",
  },
];

export const GALLERY_IMAGE_IDS = [
  "1599351431202-1e0f0137899a",
  "1622286342621-4bd786c2447c",
  "1517832606299-7ae9b720a186",
  "1567894340315-735d7c361db0",
  "1512690459411-b9245aed614b",
];

export const HERO_IMAGE_ID = "1503951914875-452162b0f3f1";
export const ABOUT_IMAGE_ID = "1585747860715-2ba37e788b70";
export const SIGNATURE_FALLBACK_IMAGE_ID = "1517832606299-7ae9b720a186";

export const TESTIMONIALS = [
  {
    quote: "Bester Fade der Stadt. Ich komme seit Jahren alle drei Wochen.",
    author: "M. Huber",
  },
  {
    quote: "Endlich ein Barbier, der sich wirklich Zeit nimmt.",
    author: "A. Keller",
  },
  {
    quote: "Die heisse Rasur mit dem Messer ist ein Ritual für sich.",
    author: "D. Baumann",
  },
];

export function unsplashUrl(
  id: string,
  params = "w=1200&q=80&auto=format&fit=crop"
) {
  return `https://images.unsplash.com/photo-${id}?${params}`;
}
```

- [ ] **Step 2: Verify**

Run: `bunx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/content.ts
git commit -m "feat: add centralized placeholder content module"
```

---

### Task 5: UI primitives + atmosphere overlay

**Files:**
- Create: `app/_components/ui/Reveal.tsx`
- Create: `app/_components/ui/PillButton.tsx`
- Create: `app/_components/ui/SectionContainer.tsx`
- Create: `app/_components/ui/Eyebrow.tsx`
- Create: `app/_components/ui/AccentWord.tsx`
- Create: `app/_components/ui/Atmosphere.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `Reveal({ children, delay?, className? })`, `PillButton({ href, children, variant? })`, `SectionContainer({ id?, className?, children })`, `Eyebrow({ children })`, `AccentWord({ children })`, `Atmosphere()` — consumed by every section task below with these exact prop names.

- [ ] **Step 1: Create the scroll-reveal wrapper**

Create `app/_components/ui/Reveal.tsx`:

```tsx
"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Create the pill button**

Create `app/_components/ui/PillButton.tsx`:

```tsx
import Link from "next/link";
import type { ReactNode } from "react";

export function PillButton({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-display tracking-wide transition-colors duration-300";
  const styles =
    variant === "solid"
      ? "bg-paper text-ink hover:bg-accent"
      : "border border-paper/20 text-paper hover:border-accent hover:text-accent";

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}
```

- [ ] **Step 3: Create the section container, eyebrow, and accent word**

Create `app/_components/ui/SectionContainer.tsx`:

```tsx
import type { ReactNode } from "react";

export function SectionContainer({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-5xl px-6 py-32 ${className ?? ""}`}
    >
      {children}
    </section>
  );
}
```

Create `app/_components/ui/Eyebrow.tsx`:

```tsx
import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-display text-xs uppercase tracking-[0.3em] text-paper/60">
      {children}
    </p>
  );
}
```

Create `app/_components/ui/AccentWord.tsx`:

```tsx
import type { ReactNode } from "react";

export function AccentWord({ children }: { children: ReactNode }) {
  return <em className="font-accent italic text-accent">{children}</em>;
}
```

- [ ] **Step 4: Create the film-grain + vignette overlay**

Create `app/_components/ui/Atmosphere.tsx`:

```tsx
export function Atmosphere() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(12,11,9,0.7) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      />
    </>
  );
}
```

- [ ] **Step 5: Mount the atmosphere overlay in the root layout**

In `app/layout.tsx`, add the import and render it inside `<body>`, after `{children}`:

```tsx
import { Atmosphere } from "./_components/ui/Atmosphere";
```

```tsx
      <body className="min-h-full bg-ink font-display text-paper">
        {children}
        <Atmosphere />
      </body>
```

- [ ] **Step 6: Verify**

Run: `bunx tsc --noEmit`
Expected: no errors.

Run: `bun run lint`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add app/_components/ui app/layout.tsx
git commit -m "feat: add UI primitives (Reveal, PillButton, SectionContainer, Eyebrow, AccentWord) and atmosphere overlay"
```

---

### Task 6: Navigation

**Files:**
- Create: `app/_components/sections/Nav.tsx`

**Interfaces:**
- Consumes: `NAV_LINKS`, `CONTACT` from `@/lib/content`; `PillButton` from `../ui/PillButton`.
- Produces: `Nav()` — consumed by Task 17 (`app/page.tsx`).

- [ ] **Step 1: Create the nav**

Create `app/_components/sections/Nav.tsx`:

```tsx
import Link from "next/link";
import { NAV_LINKS, CONTACT } from "@/lib/content";
import { PillButton } from "../ui/PillButton";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <div className="mx-auto mt-4 flex w-[min(1100px,92%)] items-center justify-between rounded-full border border-paper/10 bg-ink/60 px-6 py-3 shadow-[inset_0_1px_0_rgba(242,237,228,0.15)] backdrop-blur-md">
        <Link href="#hero" className="font-accent text-xl italic text-paper">
          Nido
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-sm tracking-wide text-paper/70 transition-colors duration-300 hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <PillButton href={CONTACT.phoneHref} variant="outline">
          Termin anfragen
        </PillButton>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Verify**

Run: `bunx tsc --noEmit`
Expected: no errors. (Not yet rendered from `page.tsx` — that happens in Task 17 — this only confirms the file compiles in isolation.)

- [ ] **Step 3: Commit**

```bash
git add app/_components/sections/Nav.tsx
git commit -m "feat: add sticky glass navigation"
```

---

### Task 7: Hero section

**Files:**
- Create: `app/_components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `HERO_IMAGE_ID`, `unsplashUrl` from `@/lib/content`; `Eyebrow`, `AccentWord`, `PillButton`, `Reveal` from `../ui/*`.
- Produces: `Hero()`, section with `id="hero"` — consumed by Task 17.

- [ ] **Step 1: Create the hero section**

Create `app/_components/sections/Hero.tsx`:

```tsx
import Image from "next/image";
import { HERO_IMAGE_ID, unsplashUrl } from "@/lib/content";
import { Eyebrow } from "../ui/Eyebrow";
import { AccentWord } from "../ui/AccentWord";
import { PillButton } from "../ui/PillButton";
import { Reveal } from "../ui/Reveal";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-end overflow-hidden px-6 pb-24 pt-40"
    >
      <Image
        src={unsplashUrl(HERO_IMAGE_ID)}
        alt="Rasur mit dem Messer bei Nido Coiffeur"
        fill
        preload
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
      <div className="relative mx-auto w-full max-w-5xl">
        <Reveal>
          <Eyebrow>Herren Barbier · Reinach</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-6 max-w-3xl font-display text-6xl font-light leading-[1.05] tracking-tight text-paper sm:text-7xl">
            Präzision, die man <AccentWord>spürt</AccentWord>.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-lg text-paper/70">
            Klassisches Handwerk, ruhige Atmosphäre und ein Schnitt, der sitzt
            — Nido Coiffeur ist der Herren-Barbershop in Reinach.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-10">
            <PillButton href="#kontakt">Termin anfragen</PillButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `bunx tsc --noEmit`
Expected: no errors. If TypeScript complains that `preload` isn't a recognized prop on `next/image`'s `Image`, check the installed Next version's type defs (`node_modules/next/dist/client/image-component.d.ts` or similar) match the researched `preload` API — if a mismatch is found, fall back to reading the actual `ImageProps` type in that file and use whatever the installed version calls it.

- [ ] **Step 3: Commit**

```bash
git add app/_components/sections/Hero.tsx
git commit -m "feat: add hero section with headline and CTA"
```

---

### Task 8: 3D razor model, scene, and device-capability fallback hook

**Files:**
- Create: `app/_components/three/useCanRender3D.ts`
- Create: `app/_components/three/RazorModel.tsx`
- Create: `app/_components/three/RazorScene.tsx`

**Interfaces:**
- Produces: `useCanRender3D(): boolean`, `RazorModel({ progressRef: MutableRefObject<number> })`, `RazorScene({ progressRef: MutableRefObject<number> })` — all consumed by Task 9 (`SignatureSequence`).

- [ ] **Step 1: Create the capability-detection hook**

Create `app/_components/three/useCanRender3D.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

export function useCanRender3D() {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const isWideEnough = window.matchMedia("(min-width: 768px)").matches;
    let hasWebGL = false;
    try {
      const canvas = document.createElement("canvas");
      hasWebGL = Boolean(
        canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl")
      );
    } catch {
      hasWebGL = false;
    }
    setCanRender(isWideEnough && hasWebGL);
  }, []);

  return canRender;
}
```

- [ ] **Step 2: Create the procedural razor geometry**

Create `app/_components/three/RazorModel.tsx`:

```tsx
"use client";

import { useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group, Mesh } from "three";

const BLADE_MATERIAL_PROPS = {
  color: "#c7d4dc",
  metalness: 1,
  roughness: 0.12,
  clearcoat: 1,
  clearcoatRoughness: 0.08,
} as const;

const SCALE_MATERIAL_PROPS = {
  color: "#1c1a17",
  metalness: 0.3,
  roughness: 0.4,
} as const;

export function RazorModel({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  const rootRef = useRef<Group>(null);
  const handleGroupRef = useRef<Group>(null);
  const tipRef = useRef<Mesh>(null);

  useFrame(() => {
    const progress = progressRef.current;
    if (rootRef.current) {
      rootRef.current.rotation.y = progress * Math.PI * 0.7 - 0.3;
    }
    if (handleGroupRef.current) {
      handleGroupRef.current.rotation.y = progress * -2.7;
    }
    if (tipRef.current) {
      tipRef.current.rotation.z = -0.4;
    }
  });

  return (
    <group ref={rootRef}>
      <group position={[-1.4, 0, 0]}>
        <RoundedBox args={[2.6, 0.26, 0.05]} radius={0.02} position={[1.3, 0, 0]}>
          <meshPhysicalMaterial {...BLADE_MATERIAL_PROPS} />
        </RoundedBox>
        <RoundedBox
          ref={tipRef}
          args={[0.5, 0.16, 0.05]}
          radius={0.02}
          position={[2.85, -0.05, 0]}
        >
          <meshPhysicalMaterial {...BLADE_MATERIAL_PROPS} />
        </RoundedBox>
        <group ref={handleGroupRef}>
          <RoundedBox
            args={[1.5, 0.46, 0.11]}
            radius={0.05}
            position={[-0.75, 0, 0.1]}
          >
            <meshPhysicalMaterial {...SCALE_MATERIAL_PROPS} />
          </RoundedBox>
          <RoundedBox
            args={[1.5, 0.46, 0.11]}
            radius={0.05}
            position={[-0.75, 0, -0.1]}
          >
            <meshPhysicalMaterial {...SCALE_MATERIAL_PROPS} />
          </RoundedBox>
        </group>
      </group>
    </group>
  );
}
```

- [ ] **Step 3: Create the canvas/scene wrapper**

Create `app/_components/three/RazorScene.tsx`:

```tsx
"use client";

import type { MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { RazorModel } from "./RazorModel";

export function RazorScene({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  return (
    <Canvas camera={{ position: [0, 0.6, 4.2], fov: 35 }} dpr={[1, 2]}>
      <ambientLight intensity={0.4} />
      <spotLight position={[3, 4, 5]} angle={0.3} penumbra={0.6} intensity={2.2} />
      <Environment preset="studio" />
      <RazorModel progressRef={progressRef} />
    </Canvas>
  );
}
```

- [ ] **Step 4: Verify**

Run: `bunx tsc --noEmit`
Expected: no errors. If `RoundedBox`'s ref type doesn't line up with `Mesh` (drei's `RoundedBox` forwards its ref to the underlying mesh), check `node_modules/@react-three/drei/core/RoundedBox.d.ts` for the exact forwarded ref type and adjust the `useRef<Mesh>` generic to match.

- [ ] **Step 5: Commit**

```bash
git add app/_components/three
git commit -m "feat: add procedural 3D straight-razor model and scene"
```

---

### Task 9: Signature scroll sequence ("Klinge & Präzision")

**Files:**
- Create: `app/_components/sections/SignatureSequence.tsx`

**Interfaces:**
- Consumes: `RazorScene`, `useCanRender3D` from `../three/*`; `SIGNATURE_FALLBACK_IMAGE_ID`, `unsplashUrl` from `@/lib/content`; `Eyebrow`, `AccentWord` from `../ui/*`.
- Produces: `SignatureSequence()` — consumed by Task 17.

- [ ] **Step 1: Create the signature sequence section**

Create `app/_components/sections/SignatureSequence.tsx`:

```tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { RazorScene } from "../three/RazorScene";
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
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progressRef.current = value;
  });

  const opacities = [
    useTransform(scrollYProgress, [0, 0.22, 0.33], [1, 1, 0]),
    useTransform(scrollYProgress, [0.33, 0.45, 0.55, 0.66], [0, 1, 1, 0]),
    useTransform(scrollYProgress, [0.66, 0.78, 1], [0, 1, 1]),
  ];

  return (
    <section ref={sectionRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute inset-0">
          {canRender3D ? (
            <RazorScene progressRef={progressRef} />
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
              <p className="mt-4 font-display text-3xl font-light leading-snug text-paper sm:text-4xl">
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
```

- [ ] **Step 2: Verify**

Run: `bunx tsc --noEmit`
Expected: no errors.

Run: `bun run lint`
Expected: no errors. React hooks rules require `useTransform` to not be called conditionally — it isn't here (fixed array of 3 literal calls), but confirm ESLint's `react-hooks/rules-of-hooks` passes.

- [ ] **Step 3: Commit**

```bash
git add app/_components/sections/SignatureSequence.tsx
git commit -m "feat: add scroll-driven 3D razor signature sequence with fallback"
```

---

### Task 10: About section

**Files:**
- Create: `app/_components/sections/About.tsx`

**Interfaces:**
- Consumes: `ABOUT_IMAGE_ID`, `unsplashUrl` from `@/lib/content`; `SectionContainer`, `Eyebrow`, `AccentWord`, `Reveal` from `../ui/*`.
- Produces: `About()`, section with `id="ueber-uns"` — consumed by Task 17.

- [ ] **Step 1: Create the section**

Create `app/_components/sections/About.tsx`:

```tsx
import Image from "next/image";
import { ABOUT_IMAGE_ID, unsplashUrl } from "@/lib/content";
import { SectionContainer } from "../ui/SectionContainer";
import { Eyebrow } from "../ui/Eyebrow";
import { AccentWord } from "../ui/AccentWord";
import { Reveal } from "../ui/Reveal";

export function About() {
  return (
    <SectionContainer id="ueber-uns">
      <div className="grid items-center gap-16 md:grid-cols-2">
        <Reveal>
          <div>
            <Eyebrow>Über uns</Eyebrow>
            <h2 className="mt-6 font-display text-4xl font-light leading-tight text-paper sm:text-5xl">
              Handwerk, das sich <AccentWord>Zeit</AccentWord> nimmt.
            </h2>
            <p className="mt-6 text-paper/70">
              Bei Nido Coiffeur treffen klassische Barbier-Techniken auf ein
              ruhiges, unaufgeregtes Umfeld. Jeder Schnitt beginnt mit einem
              Gespräch, nicht mit der Schere — damit das Ergebnis zu dir
              passt, nicht zum Trend der Woche.
            </p>
            <p className="mt-4 text-paper/70">
              Von der klassischen Rasur mit dem Messer bis zum präzisen Skin
              Fade: unser Team arbeitet mit Werkzeugen, die genauso viel
              Sorgfalt verdienen wie das Gesicht, dem sie gelten.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-card">
            <Image
              src={unsplashUrl(ABOUT_IMAGE_ID)}
              alt="Innenraum von Nido Coiffeur"
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </SectionContainer>
  );
}
```

- [ ] **Step 2: Verify**

Run: `bunx tsc --noEmit` and `bun run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/_components/sections/About.tsx
git commit -m "feat: add about section"
```

---

### Task 11: Services & pricing section

**Files:**
- Create: `app/_components/sections/Services.tsx`

**Interfaces:**
- Consumes: `SERVICE_GROUPS` from `@/lib/content`; `SectionContainer`, `Eyebrow`, `AccentWord`, `Reveal` from `../ui/*`.
- Produces: `Services()`, section with `id="leistungen"` — consumed by Task 17.

- [ ] **Step 1: Create the section**

Create `app/_components/sections/Services.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify**

Run: `bunx tsc --noEmit` and `bun run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/_components/sections/Services.tsx
git commit -m "feat: add services and pricing section"
```

---

### Task 12: Team section

**Files:**
- Create: `app/_components/sections/Team.tsx`

**Interfaces:**
- Consumes: `TEAM`, `unsplashUrl` from `@/lib/content`; `SectionContainer`, `Eyebrow`, `AccentWord`, `Reveal` from `../ui/*`.
- Produces: `Team()`, section with `id="team"` — consumed by Task 17.

- [ ] **Step 1: Create the section**

Create `app/_components/sections/Team.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify**

Run: `bunx tsc --noEmit` and `bun run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/_components/sections/Team.tsx
git commit -m "feat: add team section"
```

---

### Task 13: Gallery section

**Files:**
- Create: `app/_components/sections/Gallery.tsx`

**Interfaces:**
- Consumes: `GALLERY_IMAGE_IDS`, `unsplashUrl` from `@/lib/content`; `SectionContainer`, `Eyebrow`, `AccentWord`, `Reveal` from `../ui/*`.
- Produces: `Gallery()`, section with `id="galerie"` — consumed by Task 17.

- [ ] **Step 1: Create the section**

Create `app/_components/sections/Gallery.tsx`:

```tsx
import Image from "next/image";
import { GALLERY_IMAGE_IDS, unsplashUrl } from "@/lib/content";
import { SectionContainer } from "../ui/SectionContainer";
import { Eyebrow } from "../ui/Eyebrow";
import { AccentWord } from "../ui/AccentWord";
import { Reveal } from "../ui/Reveal";

export function Gallery() {
  return (
    <SectionContainer id="galerie">
      <Reveal>
        <Eyebrow>Galerie</Eyebrow>
        <h2 className="mt-6 font-display text-4xl font-light leading-tight text-paper sm:text-5xl">
          Einblicke in den <AccentWord>Alltag</AccentWord>.
        </h2>
      </Reveal>
      <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {GALLERY_IMAGE_IDS.map((id, index) => (
          <Reveal key={id} delay={index * 0.05}>
            <div className="relative aspect-square overflow-hidden rounded-card">
              <Image
                src={unsplashUrl(id)}
                alt="Impression aus dem Nido Coiffeur Barbershop"
                fill
                sizes="(min-width: 640px) 30vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </SectionContainer>
  );
}
```

- [ ] **Step 2: Verify**

Run: `bunx tsc --noEmit` and `bun run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/_components/sections/Gallery.tsx
git commit -m "feat: add gallery section"
```

---

### Task 14: Testimonials section

**Files:**
- Create: `app/_components/sections/Testimonials.tsx`

**Interfaces:**
- Consumes: `TESTIMONIALS` from `@/lib/content`; `SectionContainer`, `Eyebrow`, `AccentWord`, `Reveal` from `../ui/*`.
- Produces: `Testimonials()`, section with `id="bewertungen"` — consumed by Task 17.

- [ ] **Step 1: Create the section**

Create `app/_components/sections/Testimonials.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify**

Run: `bunx tsc --noEmit` and `bun run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/_components/sections/Testimonials.tsx
git commit -m "feat: add testimonials section"
```

---

### Task 15: Contact section

**Files:**
- Create: `app/_components/sections/Contact.tsx`

**Interfaces:**
- Consumes: `CONTACT` from `@/lib/content`; `SectionContainer`, `Eyebrow`, `AccentWord`, `PillButton`, `Reveal` from `../ui/*`.
- Produces: `Contact()`, section with `id="kontakt"` — consumed by Task 17.

- [ ] **Step 1: Create the section**

Create `app/_components/sections/Contact.tsx`:

```tsx
import { CONTACT } from "@/lib/content";
import { SectionContainer } from "../ui/SectionContainer";
import { Eyebrow } from "../ui/Eyebrow";
import { AccentWord } from "../ui/AccentWord";
import { PillButton } from "../ui/PillButton";
import { Reveal } from "../ui/Reveal";

export function Contact() {
  return (
    <SectionContainer id="kontakt">
      <div className="overflow-hidden rounded-card border border-paper/10 bg-paper/5 p-10 shadow-[inset_0_1px_0_rgba(242,237,228,0.12)] sm:p-16">
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <div>
              <Eyebrow>Kontakt</Eyebrow>
              <h2 className="mt-6 font-display text-4xl font-light leading-tight text-paper sm:text-5xl">
                Zeit für einen <AccentWord>Termin</AccentWord>.
              </h2>
              <p className="mt-6 text-paper/70">
                Ruf an, schreib uns oder komm vorbei — wir freuen uns auf
                dich.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <PillButton href={CONTACT.phoneHref}>Anrufen</PillButton>
                <PillButton href={CONTACT.whatsappHref} variant="outline">
                  WhatsApp
                </PillButton>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="space-y-8">
              <div>
                <p className="font-display text-xs uppercase tracking-[0.3em] text-paper/50">
                  Adresse
                </p>
                <p className="mt-2 text-paper/80">{CONTACT.address}</p>
              </div>
              <div>
                <p className="font-display text-xs uppercase tracking-[0.3em] text-paper/50">
                  Kontakt
                </p>
                <p className="mt-2 text-paper/80">{CONTACT.phone}</p>
                <p className="text-paper/80">{CONTACT.email}</p>
              </div>
              <div>
                <p className="font-display text-xs uppercase tracking-[0.3em] text-paper/50">
                  Öffnungszeiten
                </p>
                <div className="mt-2 space-y-1">
                  {CONTACT.hours.map((entry) => (
                    <div
                      key={entry.days}
                      className="flex justify-between text-paper/80"
                    >
                      <span>{entry.days}</span>
                      <span>{entry.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </SectionContainer>
  );
}
```

- [ ] **Step 2: Verify**

Run: `bunx tsc --noEmit` and `bun run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/_components/sections/Contact.tsx
git commit -m "feat: add contact section with hours and booking CTAs"
```

---

### Task 16: Footer

**Files:**
- Create: `app/_components/sections/Footer.tsx`

**Interfaces:**
- Consumes: `CONTACT`, `NAV_LINKS` from `@/lib/content`.
- Produces: `Footer()` — consumed by Task 17.

- [ ] **Step 1: Create the footer**

Create `app/_components/sections/Footer.tsx`:

```tsx
import Link from "next/link";
import { CONTACT, NAV_LINKS } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-paper/10 px-6 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-accent text-xl italic text-paper">Nido</p>
          <p className="mt-1 text-sm text-paper/50">{CONTACT.address}</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-paper/60 transition-colors duration-300 hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex gap-6 text-sm text-paper/40">
          <span>Impressum</span>
          <span>Datenschutz</span>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-paper/30">
        © {new Date().getFullYear()} Nido Coiffeur, Reinach
      </p>
    </footer>
  );
}
```

- [ ] **Step 2: Verify**

Run: `bunx tsc --noEmit` and `bun run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/_components/sections/Footer.tsx
git commit -m "feat: add footer"
```

---

### Task 17: Assemble the page and final verification

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Nav`, `Hero`, `SignatureSequence`, `About`, `Services`, `Team`, `Gallery`, `Testimonials`, `Contact`, `Footer` — every component produced by Tasks 6–16.

- [ ] **Step 1: Replace the page**

Replace the full contents of `app/page.tsx`:

```tsx
import { Nav } from "./_components/sections/Nav";
import { Hero } from "./_components/sections/Hero";
import { SignatureSequence } from "./_components/sections/SignatureSequence";
import { About } from "./_components/sections/About";
import { Services } from "./_components/sections/Services";
import { Team } from "./_components/sections/Team";
import { Gallery } from "./_components/sections/Gallery";
import { Testimonials } from "./_components/sections/Testimonials";
import { Contact } from "./_components/sections/Contact";
import { Footer } from "./_components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SignatureSequence />
        <About />
        <Services />
        <Team />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Type-check and lint**

Run: `bunx tsc --noEmit`
Expected: no errors.

Run: `bun run lint`
Expected: no errors.

- [ ] **Step 3: Production build**

Run: `bun run build`
Expected: build completes successfully (no type errors, no failed static generation). If Turbopack reports an issue with the `@react-three/fiber`/`three` bundle (e.g. an ESM/CJS interop warning), read the actual error message and resolve it there — don't pre-guess a fix.

- [ ] **Step 4: Automated smoke check**

Run in background: `bun run dev`

Then run:
```bash
curl -s http://localhost:3000 | grep -o 'id="hero"'
curl -s http://localhost:3000 | grep -o 'id="kontakt"'
curl -s http://localhost:3000 | grep -o 'Nido Coiffeur'
```
Expected: each command prints a match (confirms the page renders server-side with the expected section anchors and brand name).

- [ ] **Step 5: Visual verification in a real browser**

Use the `run` skill to launch the dev server and drive the app in a browser. Confirm, at both a desktop width (≥1280px) and a mobile width (≤480px):
- Hero renders with the Unsplash image, Jost headline, and Playfair italic accent word visible.
- Scrolling into the signature section shows the 3D razor rotating/opening on desktop, and the static fallback image on the narrow/mobile viewport.
- Every section (`Über uns`, `Leistungen`, `Team`, `Galerie`, `Bewertungen`, `Kontakt`) renders its content and images without broken/404 images.
- No errors are printed to the browser console.
- The nav stays fixed and its anchor links scroll to the right sections.

Fix anything found before proceeding.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble Nido Coiffeur one-pager from all sections"
```

---

## Self-Review Notes

- **Spec coverage:** every section in the spec's "Seitenstruktur" list has a task (Nav→6, Hero→7, Signature→9, About→10, Services→11, Team→12, Gallery→13, Testimonials→14, Contact→15, Footer→16); every item in "Visuelles System" is encoded as tokens in Task 2/3 and consumed via Tailwind utilities throughout; the 3D razor + fallback + scroll coupling from "Technische Architektur" is Task 8/9; Next 16 breaking-change notes are called out in Global Constraints and applied in Tasks 1, 3, 7.
- **Placeholder scan:** no TBD/TODO markers; all copy, prices, names, and image IDs are concrete values carried over from the spec.
- **Type consistency:** `progressRef: MutableRefObject<number>` is used identically in `RazorModel`, `RazorScene` (Task 8), and `SignatureSequence` (Task 9). `unsplashUrl(id, params?)` and all named content exports are used with matching names in every consuming task.
