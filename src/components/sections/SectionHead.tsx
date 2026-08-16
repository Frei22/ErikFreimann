import type { ReactNode } from "react";
import { Rule } from "@/components/site/Reveal";

/**
 * Every section opens the same way: index and name in mono on the left, a
 * one-line note on the right, a hairline underneath that draws itself. The
 * repetition is the point — it is the page's spine, and it means the eye
 * always knows which of the six sections it is standing in.
 */
export function SectionHead({
  index,
  label,
  note,
  heading,
}: {
  index: string;
  label: string;
  note?: ReactNode;
  heading?: ReactNode;
}) {
  return (
    <div className="pt-24 md:pt-32">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 font-mono text-[11px] tracking-[0.2em] uppercase">
        <p data-fade className="js-anim">
          <span className="text-green">{index}</span>
          <span className="px-2.5 text-line">/</span>
          <span>{label}</span>
        </p>
        {note ? (
          <p data-fade="0.08" className="js-anim text-muted">
            {note}
          </p>
        ) : null}
      </div>

      <Rule className="mt-5" />

      {heading ? (
        <h2 className="mt-10 font-fraunces text-[clamp(1.9rem,5vw,3.6rem)] leading-[1.06] font-normal tracking-[-0.03em] md:mt-14">
          {heading}
        </h2>
      ) : null}
    </div>
  );
}
