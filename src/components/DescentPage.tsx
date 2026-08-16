"use client";

import { AsciiHero } from "@/components/ascii/AsciiHero";
import { About } from "@/components/sections/About";
import { Case } from "@/components/sections/Case";
import { Contact } from "@/components/sections/Contact";
import { Repos } from "@/components/sections/Repos";
import { Work } from "@/components/sections/Work";
import { Altimeter } from "@/components/site/Altimeter";
import { Nav } from "@/components/site/Nav";
import type { Repo } from "@/lib/github";
import { useLenis } from "@/lib/useLenis";

/**
 * One run down the Vallée Blanche: 3842 m at the top of the ASCII plate,
 * 1035 m at the footer. The hero owns the motion — everything below it is
 * type on paper that arrives and then holds still.
 */
export function DescentPage({ repos }: { repos: Repo[] }) {
  useLenis();

  return (
    <>
      <Nav />
      <Altimeter />

      <main>
        <AsciiHero />
        <Work />
        <Case />
        <Repos repos={repos} />
        <About />
        <Contact />
      </main>
    </>
  );
}
