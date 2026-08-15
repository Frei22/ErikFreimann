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

  /** TODO: confirm — inferred from your account email. */
  email: "erik1.freimann2@gmail.com",

  /** TODO: confirm — inferred from the repo owner (frei22/erikfreimann). */
  githubUsername: "frei22",

  /** Production URL, used for Open Graph / canonical tags. */
  url: "https://erikfreimann.vercel.app",

  /** TODO: add your real profile URLs, or delete the ones you don't want. */
  socials: [
    { label: "GitHub", href: "https://github.com/frei22" },
    { label: "LinkedIn", href: "" },
  ],

  /**
   * Repos featured as full case studies, in display order.
   * TODO: confirm the exact repo slugs — these are best guesses and are
   * matched case-insensitively against your public repos.
   */
  featuredRepos: ["ALPINA", "RoamBetter", "food-tracker", "indiska-grytan"],

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
  href: string;
};

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
    href: "#",
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
    href: "#",
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
    href: "#",
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
    href: "#",
  },
];
