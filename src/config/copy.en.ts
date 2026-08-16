import type { Copy } from "./copy";

export const en: Copy = {
  locale: "en",
  localeName: "English",

  meta: {
    role: "Full-stack developer",
    description:
      "I build complete web and mobile products on my own — the app, the admin panel behind it, and the AI inside it. Computer engineering student at LTU, available for freelance work.",
  },

  hero: {
    plate: "Vallée Blanche — 3842 m",
    role: "I build web and mobile systems end to end",
    cue: "Scroll into the sun",
  },

  statement: {
    label: "What I do",
    lead: "I build the whole thing — the app,",
    emphasis: "the admin behind it, and the AI inside it.",
  },

  nav: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],

  work: {
    label: "Selected work",
    countNoun: "projects",
    lead: "Two products, both built alone — the app people use, the database behind it, the admin panel that runs it, and the hosting it lives on.",
    viewRepo: "View the repo ↗",
    privateRepo: "Private repo — walkthrough on request",
    projects: {
      stilu: {
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
            body: "Alpina, Frilufts, Längd & Löp and Orientering each get their own section, members and events, all built from a single codebase. One fix lands in all four at once instead of being repeated four times.",
          },
          {
            title: "Photo uploads without handing out keys.",
            body: "The browser never holds storage credentials. It asks a small server function for a one-time upload link, and that function is the only thing that knows the secret.",
          },
        ],
      },
      vana: {
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
      },
    },
  },

  about: {
    label: "About",
    headline: { lead: "I like the parts", emphasis: "other people skip." },
    stackLabel: "Stack",
    education: "Högskoleingenjör i datateknik, Luleå tekniska universitet — graduating 2028",
    location: "Malmö / Luleå, Sweden",
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
  },

  contact: {
    label: "Contact",
    localTime: "local",
    headline: "Got something you want built?",
    body: "A site, a web app, or an AI feature inside something you already run. Tell me what it needs to do and I'll tell you what it takes. Reply usually the same day.",
    backToTop: "Back to the top ↑",
  },
};
