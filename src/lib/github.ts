import { site } from "@/config/site";

export type Repo = {
  name: string;
  description: string;
  language: string;
  stars: number;
  url: string;
  /** Last push, as YYYY.MM. A build-time snapshot on a static export — it is
   *  the repo's own push date, so it stays true between rebuilds. */
  pushed: string;
};

type ApiRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
};

const hidden = new Set(
  [...site.hiddenRepos, ...site.featuredRepos].map((name) => name.toLowerCase()),
);

/**
 * Public repos for the "All projects" grid.
 *
 * Runs on the server: hourly on Vercel, at build time for a static export.
 * Featured repos are excluded — they already have full case studies above —
 * as is anything in `hiddenRepos`, plus forks and archived repos.
 *
 * Never throws: a rate-limited or offline API returns an empty list and the
 * section falls back to a link to the profile rather than failing the build.
 */
export async function getRepos(limit = 9): Promise<Repo[]> {
  // GITHUB_API_BASE lets the fetch be pointed at a stub in tests.
  const api = process.env.GITHUB_API_BASE ?? "https://api.github.com";
  const url = `${api}/users/${site.githubUsername}/repos?per_page=100&sort=pushed`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": `${site.githubUsername}-portfolio`,
        // Set GITHUB_TOKEN in CI to lift the 60/hour anonymous rate limit.
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`[github] ${res.status} ${res.statusText} for ${site.githubUsername}`);
      return [];
    }

    const data: ApiRepo[] = await res.json();

    return data
      .filter((repo) => !repo.fork && !repo.archived && !hidden.has(repo.name.toLowerCase()))
      .sort(
        (a, b) =>
          b.stargazers_count - a.stargazers_count ||
          Date.parse(b.pushed_at) - Date.parse(a.pushed_at),
      )
      .slice(0, limit)
      .map((repo) => ({
        name: repo.name,
        description: repo.description ?? "",
        language: repo.language ?? "",
        stars: repo.stargazers_count,
        url: repo.html_url,
        pushed: repo.pushed_at.slice(0, 7).replace("-", "."),
      }));
  } catch (error) {
    console.warn("[github] repo fetch failed:", error);
    return [];
  }
}
