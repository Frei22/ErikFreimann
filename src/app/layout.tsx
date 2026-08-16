import type { Viewport } from "next";
import { Fraunces, Inter, Space_Mono } from "next/font/google";
import { asset } from "@/lib/asset";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--f-fraunces",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--f-inter",
  display: "swap",
});
const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--f-mono",
  display: "swap",
});

/**
 * Title and description are per-route — see src/lib/metadata.ts — because they
 * differ by language. Only the things that do not live here.
 */
export const metadata = {
  // SVG first for anything that takes one, PNG behind it for anything that
  // does not — an SVG-only icon simply shows nothing in older Safari and Edge.
  icons: {
    icon: [
      { url: asset("/favicon.svg"), type: "image/svg+xml" },
      { url: asset("/favicon-32.png"), type: "image/png", sizes: "32x32" },
    ],
    apple: asset("/apple-touch-icon.png"),
  },
};

export const viewport: Viewport = {
  themeColor: "#faf8f3",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Swedish routes correct this on mount (CopyProvider): a single root layout
  // cannot know which route is rendering inside it.
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
