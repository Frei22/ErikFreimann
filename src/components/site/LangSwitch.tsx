"use client";

import { useCopy } from "@/components/CopyProvider";
import { localePath, locales, type Locale } from "@/config/copy";
import { asset } from "@/lib/asset";

const ORDER: Locale[] = ["en", "sv"];

/**
 * EN / SV. Each language is a real page at its own URL rather than a toggle
 * over one, so a Swedish link can be sent to a Swedish client and land on
 * Swedish — and so the two can be indexed separately.
 *
 * The current section travels with you: switching from halfway down the work
 * section lands halfway down the work section, not back at the top.
 */
export function LangSwitch() {
  const copy = useCopy();

  return (
    <span className="flex items-center gap-1.5 pl-1 sm:gap-2 sm:pl-2">
      {ORDER.map((locale, i) => {
        const active = locale === copy.locale;

        return (
          <span key={locale} className="flex items-center gap-1.5 sm:gap-2">
            {i > 0 ? (
              <span aria-hidden className="text-line">
                /
              </span>
            ) : null}

            {active ? (
              <span aria-current="true" className="text-ink">
                {locale.toUpperCase()}
              </span>
            ) : (
              <a
                href={asset(localePath[locale])}
                hrefLang={locale}
                lang={locale}
                aria-label={locales[locale].localeName}
                className="text-muted transition-colors hover:text-ink"
                onClick={(event) => {
                  // Carry the anchor across so the switch does not also scroll
                  // the reader back to the top of the page.
                  const hash = window.location.hash;
                  if (!hash) return;
                  event.preventDefault();
                  window.location.href = asset(localePath[locale]) + hash;
                }}
              >
                <span className="wipe">{locale.toUpperCase()}</span>
              </a>
            )}
          </span>
        );
      })}
    </span>
  );
}
