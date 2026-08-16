/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIG — single source of truth for everything personal.
 *  Edit this file; the whole site updates.
 * ─────────────────────────────────────────────────────────────
 *
 *  ⚠ Values marked TODO were inferred and need your confirmation.
 */

export const site = {
  /** Your name, as it should appear in the hero and <title>. */
  name: "Erik Freimann",

  /** One punchy line. Shown as the hero headline. */
  tagline: "I build fast, modern web apps.",

  /** One sentence on what you actually do. Sits under the tagline. */
  intro:
    "Computer engineering student at LTU building full-stack web & mobile products — React, Next.js, Flutter, Firebase. Available for freelance work.",

  /** Short role line used in nav / meta. */
  role: "Full-stack developer",

  /** Degree, spelled out. */
  education: "Högskoleingenjör i datateknik, Luleå tekniska universitet",

  location: "Malmö / Luleå, Sweden",

  /** Confirmed against git config on Erik's machine. */
  email: "erik1.freimann2@gmail.com",

  /** Confirmed against git config on Erik's machine. */
  githubUsername: "Frei22",

  /** Production URL, used for Open Graph / canonical tags. */
  url: "https://frei22.github.io/ErikFreimann",

  /** TODO: add your real profile URLs, or delete the ones you don't want. */
  socials: [
    { label: "GitHub", href: "https://github.com/frei22" },
    { label: "LinkedIn", href: "" },
  ],

  /**
   * Repos featured as full case studies, in display order. Excluded from the
   * "All projects" grid so they are not listed twice. Matched
   * case-insensitively — these are the real slugs, read from the clones on
   * Erik's machine.
   */
  featuredRepos: ["StiLU", "RoamBetter", "mat_ai", "Indiska-grytan"],

  /** Repos that must never appear anywhere on the site. TODO: fill in. */
  hiddenRepos: [] as string[],

  /** Tech stack, used by the marquee / about section. */
  stack: [
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Flutter",
    "Dart",
    "Firebase",
    "Firestore",
    "Cloud Functions",
    "Node.js",
    "Vite",
    "GSAP",
    "Git",
  ],
} as const;

/* ─────────────────────────────────────────────────────────────
   THE DESCENT
   The page is one run down the Vallée Blanche — the same route the
   ASCII plate in the hero was made from. The altimeter bottom-left
   reads out where you are on it, top to bottom, as you scroll.
   ───────────────────────────────────────────────────────────── */

/** Aiguille du Midi at the top, Chamonix at the bottom. Real numbers. */
export const altitude = { top: 3842, bottom: 1035 } as const;

/** Sections, in order. `id` doubles as the anchor and the observer target. */
export const descent = [
  { id: "top", index: "00", label: "Vallée Blanche" },
  { id: "work", index: "01", label: "Selected work" },
  { id: "case", index: "02", label: "Case study" },
  { id: "repos", index: "03", label: "Repositories" },
  { id: "about", index: "04", label: "About" },
  { id: "contact", index: "05", label: "Chamonix" },
] as const;

/**
 * The line the whiteout hands you — the first words after the hero burns
 * out. It is the one sentence the site is allowed, so it carries the claim.
 */
export const statement = {
  label: "What I do",
  lead: "I build the whole thing — from the data model to",
  emphasis: "the last hover state.",
} as const;

/**
 * Projects shown in the Phase 0 slices. Copy is from your brief — every claim
 * gets verified against each repo's README before the full build.
 */
export type Project = {
  index: string;
  name: string;
  year: string;
  role: string;
  summary: string;
  detail: string;
  stack: string[];
  /**
   * Where the row points. Empty means there is nothing public to point at —
   * the row renders as a plain entry rather than a link, so nobody is offered
   * a click that lands on a 404. Checked against the API on 2026-08-16: of
   * these four, every repo is private. Make one public and paste its URL here.
   */
  href: string;
  /** Which patch of the ASCII plate backs this project's detail panel. */
  crop: { col: number; row: number; cols: number; rows: number };
};

/**
 * The featured case study, told in three beats — the pinned, scrubbed section
 * steps through these as you scroll.
 * TODO: verify every claim against the repo README before launch.
 */
export const featuredCase = {
  name: "RoamBetter",
  year: "2025",
  role: "Design & build",
  /** Private repo — see the note on Project["href"]. */
  href: "",
  stack: ["Next.js", "TypeScript", "Tailwind", "Firebase", "Firestore"],
  beats: [
    {
      label: "The problem",
      title: "Two sides that must not meet directly.",
      body: "Tradespeople looking for work abroad, and employers looking for them. The operator sits in the middle — and a marketplace only works if that middle can't be cut out.",
    },
    {
      label: "What I built",
      title: "A placement platform with role-based access throughout.",
      body: "Next.js App Router and TypeScript on the front, Firebase behind it. Workers, employers and admins each see a different application built from the same codebase.",
    },
    {
      label: "The interesting part",
      title: "The database enforces the business model.",
      body: "Contact details live in admin-only Firestore collections. It isn't a UI rule that hides the phone number — the security rules mean the data never reaches the other side's client at all.",
    },
  ],
} as const;

/** About copy — first person, plain. */
export const about = [
  "I'm a computer engineering student at Luleå tekniska universitet, and I build full-stack web and mobile products — usually the whole thing, from the data model to the last hover state.",
  "Most of what I ship is React, Next.js and TypeScript on the web, Flutter on mobile, and Firebase behind both. I like the parts other people skip: security rules that actually hold, admin tooling a client can run without me, and interfaces that stay fast on a mid-range phone.",
  "I'm available for freelance web work — sites, web apps, and the occasional rescue of something half-finished.",
] as const;

export const projects: Project[] = [
  {
    index: "01",
    name: "ALPINA",
    year: "2025",
    role: "Lead developer",
    summary:
      "The website for a student ski association at LTU — bookings, an admin dashboard, and groundwork for multiple languages.",
    detail:
      "Built as lead dev in a small team: booking flow, admin tooling, and a Firebase backend the committee can run themselves.",
    stack: ["React", "TypeScript", "Vite", "Firebase", "Tailwind"],
    href: "",
    crop: { col: 20, row: 66, cols: 150, rows: 40 },
  },
  {
    index: "02",
    name: "RoamBetter",
    year: "2025",
    role: "Design & build",
    summary:
      "A worker-placement platform connecting tradespeople with employers overseas, with role-based access throughout.",
    detail:
      "Firestore keeps contact details in admin-only collections, so neither side of the marketplace can route around the operator.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Firebase"],
    href: "",
    crop: { col: 290, row: 62, cols: 150, rows: 40 },
  },
  {
    index: "03",
    name: "Food Tracker",
    year: "2025",
    role: "Solo build",
    summary:
      "Strava, but for food. Photograph a meal and AI logs it — built as a cross-platform mobile app.",
    detail:
      "A Cloud Function proxies Groq so the API key never ships in the client, with per-user rate limiting and a bring-your-own-key mode.",
    stack: ["Flutter", "Dart", "Firebase", "Groq AI"],
    href: "",
    crop: { col: 560, row: 58, cols: 150, rows: 40 },
  },
  {
    index: "04",
    name: "Indiska Grytan",
    year: "2024",
    role: "Solo build",
    summary:
      "A restaurant site built early on with no framework — hand-written HTML, CSS and JavaScript.",
    detail:
      "Kept in the portfolio deliberately: it shows the range, and that I could build and ship before the tooling did any of it for me.",
    stack: ["HTML", "CSS", "JavaScript"],
    href: "",
    crop: { col: 800, row: 22, cols: 150, rows: 40 },
  },
];
