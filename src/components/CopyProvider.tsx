"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { en } from "@/config/copy.en";
import type { Copy } from "@/config/copy";

const CopyContext = createContext<Copy>(en);

/** Every word on the page comes through here. */
export const useCopy = () => useContext(CopyContext);

export function CopyProvider({ copy, children }: { copy: Copy; children: ReactNode }) {
  useEffect(() => {
    // The root layout renders one <html>, so it cannot know which language the
    // route is in. Setting it here keeps the attribute honest for screen
    // readers, hyphenation and translation prompts; the hreflang tags in each
    // page's metadata are what search engines actually go on.
    document.documentElement.lang = copy.locale;
  }, [copy.locale]);

  return <CopyContext.Provider value={copy}>{children}</CopyContext.Provider>;
}
