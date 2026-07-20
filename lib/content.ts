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
