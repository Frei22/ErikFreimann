import type { Metadata } from "next";
import { localePath, locales, type Locale } from "@/config/copy";
import { site } from "@/config/site";
import { asset } from "@/lib/asset";

/**
 * Page metadata for one language.
 *
 * Both languages advertise each other with hreflang, and `x-default` points at
 * English — that is what search engines use to serve a Swedish client the
 * Swedish page. The <html lang> attribute is set client-side per route (see
 * CopyProvider) because a single root layout cannot know which route it is on.
 */
export function metadataFor(locale: Locale): Metadata {
  const copy = locales[locale];
  const title = `${site.name} — ${copy.meta.role}`;
  const path = localePath[locale];

  const languages = Object.fromEntries(
    (Object.keys(locales) as Locale[]).map((other) => [other, localePath[other]]),
  );

  return {
    metadataBase: new URL(site.url),
    title,
    description: copy.meta.description,
    alternates: {
      canonical: path,
      languages: { ...languages, "x-default": localePath.en },
    },
    openGraph: {
      type: "website",
      locale: locale === "sv" ? "sv_SE" : "en_GB",
      url: path,
      siteName: site.name,
      title,
      description: copy.meta.description,
      images: [{ url: asset("/og.png"), width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: copy.meta.description,
      images: [asset("/og.png")],
    },
  };
}
