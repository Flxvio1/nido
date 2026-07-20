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
