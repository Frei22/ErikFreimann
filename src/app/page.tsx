import { CinemaPage } from "@/components/cinema/CinemaPage";
import { PAPER } from "@/components/cinema/theme";
import { getRepos } from "@/lib/github";

/** Repos are refetched hourly on a server deploy; baked in on a static export. */
export const revalidate = 3600;

export default async function Home() {
  const repos = await getRepos();
  return <CinemaPage theme={PAPER} repos={repos} />;
}
