import type { CSSProperties } from "react";

/**
 * Theme for the site. Colours are CSS custom properties set on the page
 * wrapper, so every section reads them with bg-[var(--bg)] / text-[var(--ink)]
 * and stays theme-agnostic. Swapping the ground is a one-line change.
 */
export type CinemaTheme = {
  id: string;
  name: string;
  /** Prefix of the generated poster art in /public/art. */
  artPrefix: string;
  heroLayout: "left" | "centered";
  grain: number;
  cursorColor: string;
  vars: CSSProperties;
};

const vars = (bg: string, ink: string, muted: string, line: string, accent: string) =>
  ({
    "--bg": bg,
    "--ink": ink,
    "--muted": muted,
    "--line": line,
    "--accent": accent,
  }) as CSSProperties;

/** The live site: warm paper, deep green, hero anchored bottom-left. */
export const PAPER: CinemaTheme = {
  id: "paper",
  name: "Paper",
  artPrefix: "g",
  heroLayout: "left",
  grain: 0.28,
  cursorColor: "#14150f",
  vars: vars("#efebe1", "#14150f", "#6e7266", "#d5d3c4", "#2f5d3a"),
};

/** Same page, dark ground — kept at /preview/night to compare on a phone. */
export const NIGHT: CinemaTheme = {
  id: "night",
  name: "Night",
  artPrefix: "gn",
  heroLayout: "centered",
  grain: 0.2,
  cursorColor: "#e9e6da",
  vars: vars("#0d0f0c", "#e9e6da", "#828777", "#232720", "#5f9e6b"),
};
