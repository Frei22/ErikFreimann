"use client";

/**
 * Letters roll to a duplicate copy on hover, staggered left-to-right.
 * Pure CSS transforms with per-letter delay — no JS on the hover path, so it
 * stays smooth even on a mid-range phone. Screen readers get the plain word.
 */
export function RollingText({
  text,
  className = "",
  stagger = 0.022,
}: {
  text: string;
  className?: string;
  stagger?: number;
}) {
  const letters = [...text];

  return (
    <span className={`roll relative inline-flex overflow-hidden align-bottom ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-flex">
        {letters.map((ch, i) => (
          <span key={i} className="relative inline-block overflow-hidden">
            <span
              className="roll-in inline-block will-change-transform"
              style={{ transitionDelay: `${i * stagger}s` }}
            >
              {ch === " " ? " " : ch}
            </span>
            <span
              aria-hidden
              className="roll-out absolute left-0 top-0 inline-block will-change-transform"
              style={{ transitionDelay: `${i * stagger}s` }}
            >
              {ch === " " ? " " : ch}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
