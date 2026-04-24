# graymarshall.dev

Personal portfolio of [Gray Marshall](https://www.graymarshall.dev) — software engineer working on real-time systems, race-car telemetry, and production web platforms.

The site has two modes that share the same data:

- **Editorial** (`/`) — a magazine-style layout with serif display type, engagement history, project tiles, and a live GitHub activity chart.
- **Terminal** (`:terminal`, `/tui`) — a fully keyboard-driven TTY with `help`, `ls`, `cat`, `man`, `goto`, `resume`, and friends. Same content, different render.

Toggle between them from the header; theme (light/dark) persists per mode in `localStorage` and is applied pre-hydration so there's no flash.

## Stack

- **[Next.js 16](https://nextjs.org)** App Router (Turbopack dev) + React 19
- **TypeScript** throughout
- **Tailwind v4** with `@theme` tokens + CSS custom properties for per-mode palettes
- **[Recharts](https://recharts.org)** for the activity graph
- **Satori / `next/og`** for dynamic OG images (home, `/tui`, and every `/projects/[slug]`)
- **Vercel Analytics + Speed Insights**
- Deployed on **Vercel**

## Getting started

```bash
npm install
cp .env.local.example .env.local   # if present — otherwise create manually
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Key | Required | Purpose |
| --- | --- | --- |
| `GITHUB_TOKEN` | yes (for `/api/activity`) | Classic PAT with `read:user`. Powers the GitHub contribution graph; routes through GraphQL `contributionsCollection` so private contributions count (requires **Profile → "Include private contributions on my profile"** enabled). |
| `NEXT_PUBLIC_SITE_URL` | no | Manual override for canonical URL. Falls back to `VERCEL_PROJECT_PRODUCTION_URL`, then `https://www.graymarshall.dev`. |

On Vercel, set `GITHUB_TOKEN` under **Settings → Environment Variables** for Production and Preview. Without it, `/api/activity` returns `500 missing_token`.

## Project layout

```
src/
├── app/
│   ├── page.tsx                    Editorial entry
│   ├── tui/page.tsx                Terminal entry
│   ├── projects/[slug]/            Per-project detail pages + OG image
│   ├── api/activity/route.ts       GitHub GraphQL activity endpoint
│   ├── opengraph-image.tsx         Home OG (Fraunces + headshot)
│   ├── icon.tsx / apple-icon.tsx   Generated favicons
│   ├── manifest.ts                 PWA manifest
│   ├── robots.ts / sitemap.ts      SEO
│   └── not-found.tsx               Editorial-styled 404
├── components/
│   ├── editorial/                  Editorial header, footer, hero, tiles
│   ├── terminal/                   TerminalSite (prompt, commands, history)
│   ├── seo/                        Person/WebSite/ProfilePage + per-project JSON-LD
│   └── ModeThemeProvider.tsx       Theme persistence + sync
├── data/portfolio.ts               Single source of truth for copy, experience, projects, skills
├── lib/
│   ├── site.ts                     Canonical SITE_URL resolver
│   ├── github.ts                   Activity hook + localStorage cache
│   └── og.tsx                      Shared OG image template
└── app/globals.css                 Palettes, tokens, `.soft-link`, pre-hydration theme CSS
```

## Content edits

All portfolio copy lives in a single typed module: [`src/data/portfolio.ts`](src/data/portfolio.ts). Name, tagline, role, engagements, skills, coursework, featured projects, and the project index are all there. Changes propagate to the editorial view, terminal commands, OG images, JSON-LD, and sitemap on save.

## Scripts

```bash
npm run dev      # Next dev (Turbopack)
npm run build    # Production build
npm run start    # Serve the production build
npm run lint     # ESLint (next/core-web-vitals config)
```

## SEO

- `sitemap.ts` emits home, `/tui`, and every featured/indexed project
- `robots.ts` allows `/`, disallows `/api/`
- Home ships a Person + WebSite + ProfilePage `@graph` JSON-LD
- Every `/projects/[slug]` ships a BreadcrumbList + ItemPage, framed as an `ItemPage` *about* the external work so it doesn't conflict with `CreativeWork` schema on linked sites like pitlanesystems.com
- Every page gets a dynamic OG image rendered at the edge via `next/og`

## License

All Rights Reserved. See [LICENSE](LICENSE).

Source is published for transparency and to demonstrate craft — it is **not** an open-source template. Do not reuse the design, copy, or assets without written permission. Bug reports and questions are welcome via [matthew.gray.marshall@utexas.edu](mailto:matthew.gray.marshall@utexas.edu).
