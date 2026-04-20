/**
 * Canonical base URL for the site. Used by metadata, sitemap, robots.ts,
 * and JSON-LD schema.
 *
 * Precedence:
 *   1. NEXT_PUBLIC_SITE_URL (manual override, wins in every env)
 *   2. VERCEL_PROJECT_PRODUCTION_URL (set by Vercel on prod builds)
 *   3. https://www.graymarshall.dev (fallback — canonical uses www)
 */
function computeSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.startsWith("http") ? explicit : `https://${explicit}`;
  }
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProd) return `https://${vercelProd}`;
  return "https://www.graymarshall.dev";
}

export const SITE_URL = computeSiteUrl();
