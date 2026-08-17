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
 *
 * On `crop`: the inset is a 2 : 1 box, and a cell is GRID_ASPECT (1.875) times
 * taller than it is wide, so 60 × 16 fills it exactly — no letterboxing at any
 * width. Keep the count near that: the panel is ~427 px on a desktop column and
 * ~350 px on a phone, so 60 columns puts a glyph at 12 px and 10 px
 * respectively, which is type. The first pass asked for 150 × 40 and got 4.8 px
 * glyphs — under the size the rasteriser can hold a letterform, so both insets
 * came out as grey haze rather than a picture made of characters.
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
    crop: { col: 328, row: 120, cols: 60, rows: 16 },
  },
  {
    id: "vana",
    index: "02",
    name: "Vana",
    year: "2026",
    stack: ["Flutter", "Dart", "Firebase", "Firestore", "Cloud Functions", "Groq", "Gemini"],
    href: "",
    crop: { col: 644, row: 66, cols: 60, rows: 16 },
  },
] as const;

export type ProjectId = (typeof projects)[number]["id"];
