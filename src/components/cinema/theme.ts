import type { CSSProperties } from "react";

/**
 * Variants of the "Cinema" direction. Same motion language and structure —
 * what changes is the ground, the accent, and how the hero is composed.
 * Colours are CSS custom properties set on the page wrapper, so every section
 * reads them with bg-[var(--bg)] / text-[var(--ink)] and stays theme-agnostic.
 */
export type CinemaTheme = {
  id: string;
  name: string;
  note: string;
  /** Prefix of the generated poster art in /public/art. */
  artPrefix: string;
  heroLayout: "left" | "centered" | "split";
  grain: number;
  cursorColor: string;
  vars: CSSProperties;
};

const vars = (bg: string, ink: string, muted: string, line: string, accent: string, paper: string) =>
  ({
    "--bg": bg,
    "--ink": ink,
    "--muted": muted,
    "--line": line,
    "--accent": accent,
    "--paper": paper,
  }) as CSSProperties;

export const IVORY: CinemaTheme = {
  id: "c",
  name: "Cinema / Ivory",
  note: "Warm paper, burnt red, hero anchored bottom-left.",
  artPrefix: "c",
  heroLayout: "left",
  grain: 0.3,
  cursorColor: "#16130f",
  vars: vars("#ece6da", "#16130f", "#7a7266", "#d3ccbd", "#b23a2e", "#f4f0e6"),
};

export const NIGHT: CinemaTheme = {
  id: "c2",
  name: "Cinema / Night",
  note: "Ink ground, ember accent, hero centred like a title card.",
  artPrefix: "n",
  heroLayout: "centered",
  grain: 0.22,
  cursorColor: "#ede7da",
  vars: vars("#0e0d0c", "#ede7da", "#8a8175", "#262320", "#e0552f", "#171513"),
};

export const PRESS: CinemaTheme = {
  id: "c3",
  name: "Cinema / Press",
  note: "Bright paper, deep green, hero split across a rule with the name set right.",
  artPrefix: "p",
  heroLayout: "split",
  grain: 0.26,
  cursorColor: "#12140f",
  vars: vars("#f4f1e8", "#12140f", "#6e7266", "#cfd2c4", "#2f5d3a", "#ffffff"),
};

export const CINEMA_THEMES = [IVORY, NIGHT, PRESS];
