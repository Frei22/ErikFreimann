"use client";

import { CopyProvider } from "@/components/CopyProvider";
import { AsciiHero } from "@/components/ascii/AsciiHero";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Work } from "@/components/sections/Work";
import { FlightStripe } from "@/components/site/FlightStripe";
import { Nav } from "@/components/site/Nav";
import type { Copy } from "@/config/copy";
import { useLenis } from "@/lib/useLenis";

/**
 * The whole page, in one language. Both routes render this — the only
 * difference between them is which copy object comes in.
 *
 * The hero owns the motion. Everything below it is type on paper that arrives
 * and then holds still, including the chrome: the flight stripe is the only
 * instrument, and it leaves with the flight.
 */
export function DescentPage({ copy }: { copy: Copy }) {
  useLenis();

  return (
    <CopyProvider copy={copy}>
      <Nav />
      <FlightStripe />

      <main>
        <AsciiHero />
        <Work />
        <About />
        <Contact />
      </main>
    </CopyProvider>
  );
}
