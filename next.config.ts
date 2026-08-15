import type { NextConfig } from "next";

/**
 * Two deploy shapes from one config:
 *
 *  - Vercel (default): a normal server build. The GitHub repo feed refetches
 *    hourly.
 *  - GitHub Pages: `NEXT_OUTPUT=export` writes a static ./out. A project site
 *    is served from /<repo>, so NEXT_PUBLIC_BASE_PATH must match it — see
 *    .github/workflows/deploy-pages.yml.
 */
const isExport = process.env.NEXT_OUTPUT === "export";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // trailingSlash makes the export emit <route>/index.html rather than
  // <route>.html, so every route resolves on a plain static host.
  ...(isExport ? { output: "export" as const, trailingSlash: true } : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  images: {
    formats: ["image/avif", "image/webp"],
    // Static export has no image optimiser; the site uses plain <img> anyway.
    unoptimized: isExport,
  },
};

export default nextConfig;
