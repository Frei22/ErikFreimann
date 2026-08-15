import type { Metadata } from "next";
import { CinemaPage } from "@/components/cinema/CinemaPage";
import { NIGHT } from "@/components/cinema/theme";
import { getRepos } from "@/lib/github";

/** The same page on a dark ground — for comparison, kept out of search. */
export const metadata: Metadata = {
  title: "Night ground — preview",
  robots: { index: false, follow: false },
};

export const revalidate = 3600;

export default async function NightPreview() {
  const repos = await getRepos();
  return <CinemaPage theme={NIGHT} repos={repos} />;
}
