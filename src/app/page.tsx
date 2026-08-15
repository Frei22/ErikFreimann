import Link from "next/link";
import { site } from "@/config/site";

const directions = [
  {
    id: "a",
    name: "Takeover",
    note: "Black + acid lime. Counter loader, name at billboard scale, work rows that flood with colour while the project image chases your cursor.",
  },
  {
    id: "b",
    name: "Pop",
    note: "Cream, orange and cobalt. Colour curtain on load, chunky expanded type, sticker badges, and a deck of project cards that stacks as you scroll.",
  },
  {
    id: "c",
    name: "Cinema",
    note: "Warm ivory and burnt red. Enormous serif, a window that opens to full bleed as you scroll, then a pinned gallery that tracks sideways.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-24 font-inter">
      <h1 className="text-2xl font-medium tracking-tight">
        {site.name} — portfolio, Phase 0
      </h1>
      <p className="mt-3 text-neutral-500">
        Three directions. Pick one and the full site gets built on it.
      </p>
      <ul className="mt-10 divide-y divide-neutral-200 border-y border-neutral-200">
        {directions.map((d) => (
          <li key={d.id}>
            <Link href={`/d/${d.id}`} className="group block py-5">
              <span className="flex items-baseline gap-3">
                <span className="text-sm text-neutral-400 uppercase">{d.id}</span>
                <span className="font-medium group-hover:underline">{d.name}</span>
              </span>
              <span className="mt-1 block text-sm text-neutral-500">{d.note}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
