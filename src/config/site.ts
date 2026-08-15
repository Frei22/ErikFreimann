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

/**
 * The featured case study, told in three beats — the pinned, scrubbed section
 * steps through these as you scroll.
 * TODO: verify every claim against the repo README before launch.
 */
export const featuredCase = {
  name: "RoamBetter",
  year: "2025",
  role: "Design & build",
  href: "#",
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

/**
 * Stand-in for the live GitHub feed. The real grid pulls public repos from the
 * REST API for `githubUsername`, minus anything in `hiddenRepos`.
 */
export const sampleRepos = [
  { name: "alpina-web", description: "Student ski association site — bookings + admin.", language: "TypeScript", stars: 4 },
  { name: "roambetter", description: "Worker placement platform.", language: "TypeScript", stars: 2 },
  { name: "food-tracker", description: "Flutter app that logs meals from a photo.", language: "Dart", stars: 3 },
  { name: "indiska-grytan", description: "Restaurant site, hand-written HTML/CSS/JS.", language: "HTML", stars: 1 },
  { name: "ltu-labs", description: "Coursework and experiments from LTU.", language: "C", stars: 0 },
  { name: "portfolio", description: "This site.", language: "TypeScript", stars: 1 },
];

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
