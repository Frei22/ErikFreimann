import type { ProjectId } from "./site";
import { en } from "./copy.en";
import { sv } from "./copy.sv";

/**
 * ─────────────────────────────────────────────────────────────
 *  Every word the visitor reads.
 *
 *  A new language is a new file satisfying `Copy`, added to
 *  `locales` below and given a route under src/app. Nothing
 *  user-facing is hard-coded in a component, so translating is
 *  translating — not a trawl through JSX.
 *
 *  Plain language is a requirement, not a style: someone running
 *  a modelling agency has to finish a sentence and know what they
 *  would be buying.
 * ─────────────────────────────────────────────────────────────
 */

export type Beat = { title: string; body: string };

export type ProjectCopy = {
  role: string;
  /** One sentence a non-technical reader finishes and understands. */
  summary: string;
  /** The two or three things worth knowing. Each is a small case study. */
  beats: Beat[];
};

export type Copy = {
  locale: "en" | "sv";
  /** Shown on the language switch, and used as the switch's accessible name. */
  localeName: string;

  meta: {
    /** Follows the name in <title>. The term people actually search for. */
    role: string;
    description: string;
  };

  hero: {
    plate: string;
    role: string;
    cue: string;
  };

  statement: {
    label: string;
    lead: string;
    emphasis: string;
  };

  nav: { label: string; href: string }[];

  work: {
    label: string;
    /** Plural noun after the project count, e.g. "2 projects". */
    countNoun: string;
    lead: string;
    viewRepo: string;
    privateRepo: string;
    projects: Record<ProjectId, ProjectCopy>;
  };

  about: {
    label: string;
    headline: { lead: string; emphasis: string };
    stackLabel: string;
    education: string;
    location: string;
    facts: { degree: string; based: string; status: string; statusValue: string };
    paragraphs: string[];
  };

  contact: {
    label: string;
    /** Suffix on the clock in the section head, e.g. "16:28 local". */
    localTime: string;
    headline: string;
    body: string;
    backToTop: string;
  };
};

export const locales = { en, sv } as const;

export type Locale = keyof typeof locales;

/** Where each language lives. Used by the switch and by the hreflang tags. */
export const localePath: Record<Locale, string> = { en: "/", sv: "/sv/" };
