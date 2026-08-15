/**
 * Prefixes static asset paths with the deployment base path.
 *
 * Vercel serves from the domain root, so this is a no-op there. GitHub Pages
 * serves a project site from /<repo>, and Next only rewrites its own bundles —
 * plain <img src="/art/…"> would 404 — so every asset URL goes through here.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) => `${basePath}${path}`;
