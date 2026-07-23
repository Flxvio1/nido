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
  { href: "#atmosphaere", label: "Atmosphäre" },
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
          "Rasiermesser mit heissem Handtuch — gründlich und entspannt.",
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

export const ATMOSPHERE = {
  images: {
    chairs: {
      id: "/nido-shop-interior-01.png",
      alt: "Barber-Stühle in gedämpftem Licht bei Nido Coiffeur",
      caption: "Der Raum",
    },
    interior: {
      id: "/nido-shop-team-02.png",
      alt: "Backstein, Spiegel und warmes Licht im Barbershop",
      caption: "Das Team",
    },
    tools: {
      id: "/nido-haircut-03.png",
      alt: "Schere, Kamm und Klinge auf einem Tuch",
      caption: "Der Schnitt",
    },
  },
  keywords: ["Espresso inklusive", "Ohne Zeitdruck", "Mit Termin"],
};

export const ABOUT_IMAGE_ID = "1517832606299-7ae9b720a186";
export const SIGNATURE_FALLBACK_IMAGE_ID = "1549271568-e87e07c5406b";

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
    quote: "Die heisse Rasur mit dem Messer ist jedes Mal ein Erlebnis.",
    author: "D. Baumann",
  },
  {
    quote: "Termin gebucht, pünktlich drangekommen, perfekt beraten.",
    author: "S. Gerber",
  },
  {
    quote: "Mein Bart war noch nie so sauber in Form. Absolute Empfehlung.",
    author: "L. Steiner",
  },
  {
    quote: "Ruhige Atmosphäre, ehrliche Beratung — man fühlt sich wohl.",
    author: "R. Widmer",
  },
];

export function unsplashUrl(
  id: string,
  params = "w=1200&q=80&auto=format&fit=crop"
) {
  if (id.startsWith("/")) return id;
  return `https://images.unsplash.com/photo-${id}?${params}`;
}
