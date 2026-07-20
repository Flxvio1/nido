# Nido Coiffeur — Dark Luxury Redesign (Entwurf)

**Status:** Design genehmigt, bereit für Implementierungsplan
**Datum:** 2026-07-20

## Kontext & Ziel

Nido Coiffeur ist ein lokaler Herren-Barbershop in Reinach (Schweiz). Die aktuelle Webseite
(https://barber.ch.ivof.com/nido-coiffeur/) ist ein generisches Buchungsportal-Template ohne
Preisliste, Team-Namen oder eigene Identität. Ziel dieses Projekts ist ein **visueller Verkaufs-
Entwurf** (Next.js, im selben Repo), der dem Betreiber gezeigt wird, um die neue Seite zu verkaufen:
Design und Interaktion müssen fertig und beeindruckend wirken ("richtig krass flashen"). Inhalte wie
Preise, Team-Namen und Fotos sind bewusst Platzhalter und werden nach Zusage verfeinert.

**Out of scope für diesen Entwurf:** echtes Buchungs-Backend, CMS-Anbindung, Formular-Verarbeitung,
echte Kundenfotos (folgen später).

## Design-Philosophie (verbindlich für alle Entscheidungen)

Der Auftraggeber hat eine explizite Philosophie vorgegeben, abgeleitet von einer Referenzseite, aber
**nicht** deren konkrete Farben/Schriften/Motive kopierend, sondern deren Prinzipien:

1. **Fast monochrome Palette + genau ein Akzent** — keine zusätzlichen Grautöne als eigene Farben;
   alle "Grauwerte" sind Weiß-Transparenzstufen über dem dunklen Hintergrund.
2. **Ein Schrift-Kontrastpaar**, konsequent an derselben Stelle eingesetzt (schlanke Grotesk vs.
   kursive Serif für genau ein betontes Wort pro Headline).
3. **Weißraum durch Scroll-Zeit statt durch leere Fläche** — Sections dürfen mehrere Bildschirmhöhen
   lang sein, Inhalt entfaltet sich graduell beim Scrollen.
4. **Durchgängige Detail-Regeln**: ein Radius-System (Pill für Buttons/Badges, 28px für Karten),
   durchgehend 1px-Trennlinien bei gleicher Transparenz — nirgends gemischt, nirgends scharfe Ecken.
5. **Eine Signatur-Easing-Kurve** für praktisch jede Reveal-Animation, plus **genau eine** groß
   inszenierte "Wow"-Sequenz als Herzstück der Seite.
6. **Feine Textur statt harter Flächen** — Filmkorn-Rauschen + Vignette, Glas-Elemente mit feinem
   Rand-Schimmer.
7. **Inhaltlich begründetes Leitmotiv statt generischer Deko** — Motiv muss aus dem Thema (Barbershop)
   abgeleitet sein, nicht kopiert.

## Leitmotiv: "Klinge & Präzision"

Das durchgängige visuelle Leitmotiv ist die Klinge des Rasiermessers als Symbol für Präzision und
Handwerk. Es zeigt sich in: dem großen 3D-Rasiermesser als Signature-Sequenz, feinen Präzisionslinien
als wiederkehrendes Trennlinien-/Detail-Element, und der Wortwahl in Überschriften (Präzision,
Schärfe, Handwerk, Ritual).

## Visuelles System

### Farbe

- Hintergrund: warmes Beinahe-Schwarz `#0C0B09`
- Text/Vordergrund: warmes Beinahe-Weiß `#F2EDE4`
- Alle sekundären Flächen/Text/Trennlinien: `#F2EDE4` mit Transparenzstufen (6%, 10%, 15%, 20%) —
  keine zusätzlichen Grau-Hexwerte
- Akzent (genau einer, konsequent gleich verwendet): Chrom-Blau `#A9C4D6`, Glanz-Variante `#E4F1FA`
  für Leuchten/Glow. Verwendung: ein Leucht-Akzent im Hero, Scroll-/Progress-Linie, Hover-Zustände.

### Typografie

- **Jost** (Light 300) — Grotesk für Headlines und Fließtext. Große Headlines: enges
  Letter-Spacing, niedrige Zeilenhöhe. Kleine Eyebrow-/Label-Texte: weites Letter-Spacing, Versalien.
- **Playfair Display Italic** — Serif-Akzent für genau ein betontes Wort pro Headline, an
  wiederkehrender, vorhersehbarer Stelle.
- Nur diese zwei Font-Familien im gesamten Auftritt.

### Form & Struktur

- Container schmal, zentriert, großzügiger konsistenter Außenabstand
- Radius-System: Buttons/Badges = voll gerundet (Pill), Karten = 28px — nie gemischt, nie scharfe Ecken
- Trennlinien: immer 1px bei 10% Weiß-Transparenz

### Bewegung

- Eine Signatur-Easing-Kurve (`cubic-bezier(0.16, 1, 0.3, 1)`) für alle Scroll-Reveals: Element
  erscheint versetzt + unscharf + transparent → an Ort + scharf + sichtbar, ausgelöst beim Scrollen
  ins Sichtfeld
- Eine große Inszenierung als Herzstück: die 3D-Rasiermesser-Sequenz (siehe unten)

### Textur

- Feines Filmkorn-Rauschen (SVG-Noise, ~3–4% Opacity) über der gesamten Seite
- Sanfte Vignette in den Ecken
- Glas-Elemente (Nav, Kontakt-Panel): Backdrop-Blur + feiner heller Rand-Schimmer oben

## Seitenstruktur (One-Pager, deutsch)

Anker-Navigation, eine lange Scroll-Seite:

1. **Nav** (sticky, Glas-Effekt): Logo "Nido", Anchor-Links (Über uns · Leistungen · Team · Galerie ·
   Kontakt), CTA-Pill "Termin anfragen"
2. **Hero**: Eyebrow-Label ("HERREN BARBIER · REINACH"), Headline mit Serif-Akzentwort, Subtext,
   Scroll-Cue
3. **Signature-Sequenz "Klinge & Präzision"**: 3D-Rasiermesser-Szene, scroll-gekoppelt (siehe
   Technische Architektur), mehrere Bildschirmhöhen lang, begleitet von kurzen
   Markenaussagen zu Präzision/Handwerk
4. **Über uns**: kurzer editorialer Text + Portrait-Bild
5. **Leistungen & Preise**: Zeilen-Liste (Pfeil, Name, Beschreibung, "ab CHF XX"), gruppiert nach
   Haarschnitt/Bart/Rasur/Pflege — Preise als Platzhalter
6. **Team**: Grid mit Barbier-Portraits (Platzhalter-Namen/Fotos), Hover zeigt Spezialisierung
7. **Galerie**: Bild-Mosaik (Laden/Arbeiten), Platzhalterbilder
8. **Bewertungen**: 5-Sterne-Callout + 2–3 Testimonial-Zitate (Platzhalter)
9. **Kontakt/Standort**: Adresse (Hauptstrasse 20, 4053 Reinach), Telefon (+41 61 711 20 25),
   Öffnungszeiten (Mo–Sa 10–20 Uhr, So geschlossen), gestaltetes "Termin anfragen"-Panel (Links zu
   Tel/E-Mail/WhatsApp, kein Backend)
10. **Footer**: Logo, Nav-Wiederholung, Social-Platzhalter, Impressum/Datenschutz-Platzhalter

## Technische Architektur

### Stack-Ergänzungen

- `@react-three/fiber` + `@react-three/drei` — 3D-Rasiermesser-Szene
- `motion` (React-Animationsbibliothek, ehem. Framer Motion) — Scroll-Reveals und Scroll-Kopplung
  der 3D-Szene

### 3D-Rasiermesser ("Klinge & Präzision"-Sequenz)

- Prozedural aus Geometrie gebaut (Klinge: flache, leicht gebogene Extrusion; Griff:
  Kapsel-/Zylinder-Segmente) — kein importiertes 3D-Asset, keine Lizenzfragen, im Code fein
  einstellbar
- `MeshPhysicalMaterial` mit hoher Metalness/niedriger Roughness + `drei`'s `Environment`
  (neutrales HDRI-Preset) für Chrom-Reflexionen
- Rotation/Position an Scroll-Fortschritt gekoppelt (`useScroll` + `useTransform` aus `motion`):
  Messer öffnet sich und dreht sich beim Scrollen durch die Signature-Section
- **Fallback**: auf sehr kleinen/leistungsschwachen Geräten (schmaler Viewport oder kein WebGL) wird
  ein statisches Bild gerendert statt der 3D-Szene, damit Mobile nicht leidet

### Scroll-Reveals

- Ein wiederverwendbarer `Reveal`-Wrapper (`motion`'s `whileInView`), der überall dieselbe
  Easing-Kurve/Transform-Sequenz anwendet — eine Komponente, konsequent wiederverwendet

### Bilder

- Kuratierte Unsplash-Platzhalterbilder (dunkel, moody: Rasur, Werkzeuge, Herrenfrisuren,
  Ladenatmosphäre) über `next/image`
- `images.remotePatterns` in `next.config.ts` auf `images.unsplash.com` beschränkt
- Hero-/LCP-Bild bekommt `preload` (Next 16: `priority`-Prop ist deprecated)

### Fonts

- `next/font/google` für Jost (300) und Playfair Display (italic), als CSS-Variablen im
  Root-Layout, in Tailwind-Konfiguration gemappt

### Next.js-16-spezifische Punkte (Breaking Changes beachtet)

- `next/image`: `priority` → `preload`; `images.domains` → `images.remotePatterns`
- `data-scroll-behavior="smooth"` explizit auf `<html>` setzen (Next 16 überschreibt
  `scroll-behavior: smooth` bei Navigation nicht mehr automatisch)
- `params`/`searchParams` sind Promises (für diese Seite ohne dynamische Routen nicht direkt
  relevant, aber zu beachten falls Unterseiten dazukommen)

### Datei-/Komponentenstruktur (wartbar, aber nicht überteilt)

- `app/page.tsx` — setzt Section-Komponenten zusammen, enthält selbst keine Section-Logik
- `app/_components/sections/` — ein File pro Section (`Hero.tsx`, `SignatureRazorScene.tsx`,
  `About.tsx`, `Services.tsx`, `Team.tsx`, `Gallery.tsx`, `Testimonials.tsx`, `Contact.tsx`,
  `Footer.tsx`, `Nav.tsx`)
- `app/_components/ui/` — generische, wiederverwendete Bausteine (`Reveal.tsx`, `PillButton.tsx`,
  `SectionContainer.tsx`, `Eyebrow.tsx`)
- `app/_components/three/` — 3D-Rasiermesser-Komponenten getrennt von normalen UI-Komponenten
  (eigene Materie: WebGL/Canvas-Setup, Geometrie, Scroll-Kopplung)
- Leitprinzip: eine Section = eine Datei; gemeinsame visuelle Bausteine (Buttons, Reveal-Wrapper,
  Container) werden extrahiert, sobald sie mehr als einmal identisch gebraucht werden — keine
  Vorab-Abstraktion für Dinge, die nur einmal vorkommen

## Content-Platzhalter (explizit als vorläufig markiert)

- Preise in "Leistungen & Preise": grobe, plausible Platzhalter-Beträge in CHF
- Team-Namen/Fotos: erfundene Platzhalter-Personas
- Testimonials: plausible Platzhalter-Zitate
- Bilder: kuratierte Unsplash-Fotos passend zum Moodboard (dunkel, moody, Barbershop-Ästhetik)
- Reale Daten (Adresse, Telefon, Öffnungszeiten) aus der bestehenden Nido-Seite übernommen

## Erfolgskriterien

- Design wirkt sofort hochwertig/luxuriös, nicht wie ein Template
- Alle Prinzipien aus der Design-Philosophie sind konsequent (nicht nur punktuell) umgesetzt
- 3D-Signature-Sequenz funktioniert flüssig auf Desktop und degradiert sauber auf Mobile/schwacher
  Hardware
- Seite ist auf Deutsch, inhaltlich vollständig als Entwurf (auch wenn Preise/Fotos noch Platzhalter
  sind)
- Codebasis bleibt wartbar: klare Section-Trennung, keine Monolith-Datei, keine unnötige
  Fragmentierung
