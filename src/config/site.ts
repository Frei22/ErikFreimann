/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIG — single source of truth for everything personal.
 *  Edit this file; the whole site updates.
 * ─────────────────────────────────────────────────────────────
 *
 *  Every sentence the visitor reads lives in this file, including
 *  section labels and headings. That is deliberate: a Swedish
 *  version is a copy of this file with the strings translated and
 *  a one-line swap in the import, not a trawl through components.
 *
 *  Plain language is a requirement, not a style. Someone running a
 *  modelling agency has to finish a sentence and know what they
 *  would be buying. Where a technical word is unavoidable, the
 *  sentence around it explains itself.
 */

export const site = {
  /** Your name, as it should appear in the hero and <title>. */
  name: "Erik Freimann",

  /** Short role line. Used in the page <title> and meta — kept as the term
   *  people actually search for, even though the page itself talks plainer. */
  role: "Full-stack developer",

  /** Meta description. One sentence, no jargon. */
  intro:
    "I build complete web and mobile products on my own — the app, the admin panel behind it, and the AI inside it. Computer engineering student at LTU, available for freelance work.",

  /**
   * The degree is in progress, not held — first year done, graduating 2028.
   * The year has to be on it: "Högskoleingenjör i datateknik, LTU" on its own
   * reads as a qualification he already has.
   */
  education: "Högskoleingenjör i datateknik, Luleå tekniska universitet — graduating 2028",

  location: "Malmö / Luleå, Sweden",

  /** Confirmed against git config on Erik's machine. */
  email: "erik1.freimann2@gmail.com",

  /** Production URL, used for Open Graph / canonical tags. */
  url: "https://frei22.github.io/ErikFreimann",

  /** Shown in the footer. A blank href is skipped rather than rendered dead. */
  socials: [
    { label: "GitHub", href: "https://github.com/frei22" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/erik-freimann-a42b1b294/" },
  ],

  /** Shown as a plain list in About. */
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

/* ── The hero ─────────────────────────────────────────────────── */

export const hero = {
  /** Caption for the ASCII plate. */
  plate: "Vallée Blanche — 3842 m",
  /** One line under the name. Says what he does, in words anyone follows. */
  role: "I build web and mobile systems end to end",
  cue: "Scroll into the sun",
} as const;

/**
 * The line the whiteout hands you — the first words after the hero burns out.
 * It is the one sentence the site is allowed, so it carries the whole claim:
 * one person, the entire system, AI included.
 */
export const statement = {
  label: "What I do",
  lead: "I build the whole thing — the app,",
  emphasis: "the admin behind it, and the AI inside it.",
} as const;

/* ── Work ─────────────────────────────────────────────────────── */

export type Beat = { title: string; body: string };

export type Project = {
  index: string;
  name: string;
  year: string;
  role: string;
  /** One sentence a non-technical reader finishes and understands. */
  summary: string;
  /** The two or three things worth knowing. Each is a small case study. */
  beats: Beat[];
  stack: string[];
  /**
   * Where the row points. Empty means there is nothing public to point at, and
   * the entry renders without a link rather than offering a click that 404s.
   * Both of these repos are private (checked against the API, 2026-08-16).
   */
  href: string;
  /** Which patch of the ASCII plate backs this entry. */
  crop: { col: number; row: number; cols: number; rows: number };
};

export const work = {
  label: "Selected work",
  /** Sets up both projects in client terms before either is named. */
  lead: "Two products, both built alone — the app people use, the database behind it, the admin panel that runs it, and the hosting it lives on.",
} as const;

/**
 * Written from the repos themselves — README, architecture notes and commit
 * history — not from memory. Years are first-commit years.
 */
export const projects: Project[] = [
  {
    index: "01",
    name: "StiLU",
    year: "2026",
    role: "Lead developer",
    summary:
      "The website and membership system for a student sports association in Luleå — four clubs under one roof, with events, trips, bookings and a member register.",
    beats: [
      {
        title: "The committee runs it, not me.",
        body: "Every piece of text on the site can be rewritten from inside the site itself, by anyone with an admin login. Nobody needs a developer to correct a date or add a trip — which matters when the committee changes every year.",
      },
      {
        title: "Four clubs, one system.",
        body: "Alpina, Friluft, Längd & Löp and Orientering each get their own section, members and events, all built from a single codebase. One fix lands in all four at once instead of being repeated four times.",
      },
      {
        title: "Photo uploads without handing out keys.",
        body: "The browser never holds storage credentials. It asks a small server function for a one-time upload link, and that function is the only thing that knows the secret.",
      },
    ],
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
    href: "",
    crop: { col: 20, row: 66, cols: 150, rows: 40 },
  },
  {
    index: "02",
    name: "Vana",
    year: "2026",
    role: "Solo build",
    summary:
      "Photograph a meal and it is logged. Vana reads the picture, works out roughly what is in it, and scores the day out of 100 — with consent, data export and account deletion built in from the start.",
    beats: [
      {
        title: "The AI key never leaves the server.",
        body: "The app talks to a function I control. That function checks who you are, adds the secret key and forwards the request. Nothing sensitive is ever shipped inside the app, where anyone could read it out.",
      },
      {
        title: "AI that cannot run up a bill.",
        body: "Every account has a daily limit, counted in a place the app itself is not allowed to read or change, and only approved models are let through. A stolen login cannot turn into an unbounded invoice.",
      },
      {
        title: "The score does not depend on the AI.",
        body: "Once a meal is logged, the daily score is plain arithmetic — energy, protein, quality, balance. Same input, same answer, every time, and testable without ever calling a model.",
      },
    ],
    stack: ["Flutter", "Dart", "Firebase", "Firestore", "Cloud Functions", "Groq", "Gemini"],
    href: "",
    crop: { col: 800, row: 22, cols: 150, rows: 40 },
  },
];

/* ── About ────────────────────────────────────────────────────── */

export const about = {
  label: "About",
  headline: { lead: "I like the parts", emphasis: "other people skip." },
  stackLabel: "Stack",
  facts: {
    degree: "Studying",
    based: "Based",
    status: "Status",
    statusValue: "Available for freelance work",
  },
  paragraphs: [
    "I'm a computer engineering student at Luleå tekniska universitet, and I build complete web and mobile products on my own — the part people click, the database behind it, the admin panel that runs it, and the hosting it sits on.",
    "AI is part of how I work and part of what I build. It's why one person can now deliver what used to take a team. And when a product needs AI inside it, I build that side properly: keys kept on the server, limits that actually hold, and results you can check without trusting the model.",
    // Deliberately does not restate the headline above it — it lists what the
    // headline means instead.
    "Access rules that hold up under someone actually trying. Admin tools a client can run without calling me. Screens that stay quick on a mid-range phone, not just on the laptop they were built on.",
    "I'm available for freelance work — a new site, a web app, or finishing something that stalled halfway.",
  ],
} as const;

/* ── Contact ──────────────────────────────────────────────────── */

export const contact = {
  label: "Contact",
  headline: "Got something you want built?",
  body: "A site, a web app, or an AI feature inside something you already run. Tell me what it needs to do and I'll tell you what it takes. Reply usually the same day.",
  available: "Available for freelance work",
  backToTop: "Back to the top ↑",
} as const;

/* ── Navigation ───────────────────────────────────────────────── */

export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;
