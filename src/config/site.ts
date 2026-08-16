/**
 * ─────────────────────────────────────────────────────────────
 *  Language-neutral facts. Nothing here needs translating.
 *
 *  Every word a visitor reads lives in copy.en.ts / copy.sv.ts
 *  instead — see copy.ts for the shape they both satisfy.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Erik Freimann",

  email: "erik1.freimann2@gmail.com",

  /** Production URL, used for Open Graph, canonical and hreflang tags. */
  url: "https://frei22.github.io/ErikFreimann",

  socials: [
    { label: "GitHub", href: "https://github.com/frei22" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/erik-freimann-a42b1b294/" },
  ],

  /** Product names, so the same in both languages. */
  stack: [
    "TypeScript",
    "React",
    "Next.js",
    "Flutter",
    "Dart",
    "Tailwind CSS",
    "Firebase",
    "Firestore",
    "Cloud Functions",
    "Node.js",
    "Vite",
    "Groq / Gemini",
    "Git",
  ],
} as const;

/**
 * The parts of a project that do not change with language: what it is called,
 * when it was built, what it was built with, and which patch of the ASCII
 * plate backs it. The prose lives in the copy files, keyed by `id`.
 *
 * Years are first-commit years, read from the repos.
 */
export const projects = [
  {
    id: "stilu",
    index: "01",
    name: "StiLU",
    year: "2026",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind",
      "Firebase",
      "Firestore",
      "Cloud Functions",
      "Cloudflare R2",
    ],
    /** Empty means private — the entry renders without a link rather than
     *  offering a click that 404s. Both were private as of 2026-08-16. */
    href: "",
    crop: { col: 20, row: 66, cols: 150, rows: 40 },
  },
  {
    id: "vana",
    index: "02",
    name: "Vana",
    year: "2026",
    stack: ["Flutter", "Dart", "Firebase", "Firestore", "Cloud Functions", "Groq", "Gemini"],
    href: "",
    crop: { col: 800, row: 22, cols: 150, rows: 40 },
  },
] as const;

export type ProjectId = (typeof projects)[number]["id"];
