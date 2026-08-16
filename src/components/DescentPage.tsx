"use client";

import { AsciiHero } from "@/components/ascii/AsciiHero";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Work } from "@/components/sections/Work";
import { FlightStripe } from "@/components/site/FlightStripe";
import { Nav } from "@/components/site/Nav";
import { useLenis } from "@/lib/useLenis";

/**
 * The hero owns the motion. Everything below it is type on paper that arrives
 * and then holds still — including the chrome: the flight stripe is the only
 * instrument, and it leaves with the flight.
 */
export function DescentPage() {
  useLenis();

  return (
    <>
      <Nav />
      <FlightStripe />

      <main>
        <AsciiHero />
        <Work />
        <About />
        <Contact />
      </main>
    </>
  );
}
