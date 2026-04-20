export type Metric = { k: string; v: string };

export type RepoRef = { label: string; url: string };

export type FeaturedProject = {
  title: string;
  slug: string;
  tagline: string;
  year: string;
  status: "Live" | "In Development" | "Archived" | string;
  tech: string[];
  bullets: string[];
  image?: string;
  video?: string;
  link?: string;
  linkNote?: string;
  repo?: string;
  repos?: RepoRef[];
  metrics?: Metric[];
  overview?: string;
  detailBullets?: string[];
};

export type IndexProject = {
  title: string;
  tagline: string;
  tech: string[];
  status: "Live" | "In Development" | "Archived" | string;
  year: string;
  image?: string;
  slug?: string;
  link?: string;
  linkNote?: string;
  repo?: string;
  repos?: RepoRef[];
  overview?: string;
  detailBullets?: string[];
};

export type AnyProject = FeaturedProject | (IndexProject & { slug: string });

export function getProjectBySlug(slug: string): AnyProject | undefined {
  const featured = PORTFOLIO.featured.find((p) => p.slug === slug);
  if (featured) return featured;
  const indexed = PORTFOLIO.projects.find(
    (p): p is IndexProject & { slug: string } => p.slug === slug,
  );
  return indexed;
}

export function getAllProjectSlugs(): string[] {
  return [
    ...PORTFOLIO.featured.map((p) => p.slug),
    ...PORTFOLIO.projects
      .filter((p): p is IndexProject & { slug: string } => Boolean(p.slug))
      .map((p) => p.slug),
  ];
}

export type Experience = {
  title: string;
  org: string;
  period: string;
  tenure: string;
  location: string;
  logo?: string;
  bullets: string[];
  skills: string[];
};

export type Education = {
  school: string;
  degree: string;
  period: string;
  location: string;
  logo?: string;
  coursework: string[];
};

export type NowItem = { what: string; where: string };

export type Note = {
  title: string;
  date: string;
  tag: string;
  read: string;
  url?: string;
  description?: string;
};

export type Portfolio = {
  name: string;
  role: string;
  tagline: string;
  location: string;
  status: string;
  email: string;
  github: string;
  linkedin: string;
  about: string[];
  now: NowItem[];
  featured: FeaturedProject[];
  projects: IndexProject[];
  experience: Experience[];
  education: Education;
  skills: Record<string, string[]>;
  notes: Note[];
};

export const PORTFOLIO: Portfolio = {
  name: "Gray Marshall",
  role: "Software Engineer",
  tagline: "Real-time systems. Race-car telemetry. Production web platforms.",
  location: "Austin, TX",
  status: "Open to Summer 2026 SWE internships",
  email: "matthew.gray.marshall@gmail.com",
  github: "github.com/GrayM8",
  linkedin: "linkedin.com/in/graymarshall",
  about: [
    "I'm a second-year CS major translating raw race-car bytes into winning insights for UT Austin's Formula SAE EV Team — and building the real-time systems that keep competition software reliable under pressure.",
    "At Longhorn Racing, I work on a distributed telemetry stack spanning on-car data ingest, real-time streaming, persistent storage, and live visualization.",
    "I co-founded and lead the technical direction of Longhorn Sim Racing, where I've designed and shipped a production-grade web platform built with Next.js, React, and TypeScript.",
    "Across both domains, I optimize for tight feedback loops, clear abstractions, and durable software that ships fast and performs under pressure.",
  ],
  now: [
    {
      what: "Building the perception pipeline and simulation suite for next year's autonomous program.",
      where: "Longhorn Racing",
    },
    {
      what: "Tightening user experience and admin workflows across the platform.",
      where: "Longhorn Sim Racing",
    },
    {
      what: "Developing PitLane Director AC through closed beta.",
      where: "PitLane Systems",
    },
    {
      what: "Ideating an affiliate-linking sim configuration tool.",
      where: "Trophy Sim Solutions",
    },
  ],
  featured: [
    {
      title: "Longhorn Sim Racing Platform",
      slug: "lsr",
      tagline: "Events, Membership & Competition Management Platform",
      year: "2025 — Present",
      status: "Live",
      tech: [
        "Next.js 16",
        "TypeScript",
        "Prisma",
        "PostgreSQL",
        "Supabase",
        "Tailwind v4",
      ],
      bullets: [
        "Single self-serve platform for membership, events, race competitions, content, and merchandise — used day-to-day by the whole club.",
        "Race-condition-safe event registration with Postgres FOR UPDATE row locks and automatic FIFO waitlist promotion.",
        "Automated results ingestion feeds driver statistics, leaderboards, and season standings out of a League → Season → Round → Session data model.",
      ],
      overview:
        "A unified operations hub for Longhorn Sim Racing that replaced scattered spreadsheets and manual workflows with structured registration, officer-facing admin tools, and automated results processing — built as the system of record for membership, events, race competitions, content, and merchandise across the whole club.",
      detailBullets: [
        "Architected and shipped the platform end-to-end as a pnpm + Turborepo monorepo: Next.js 16 App Router with React Server Components, Prisma on PostgreSQL via Supabase, Supabase Auth with just-in-time user provisioning.",
        "Role-based authorization across six roles (member, competition, officer, president, alumni, admin) backed by an email-allowlist bypass for admin seeding and a typed authz helper layer (`isAdmin()`, `requireAdmin()`).",
        "Event registration with database-level FOR UPDATE locking to prevent capacity race conditions, a FIFO waitlist with automatic promotion on cancellations, and officer-facing admin tooling for attendance, approvals, and audit logging.",
        "League → Season → Round → Session → Entry → Result data model, with automated race-results ingestion and computation pipelines powering driver statistics, leaderboards, and season standings.",
        "Content layer (news posts, CMS pages) and a club merchandise storefront running under the same unified auth + role system.",
        "Engineering workflow ownership: monorepo tooling (pnpm + Turborepo), Dockerized local Supabase stack, PR-gated CI (lint / typecheck / build), and the CODEOWNERS-enforced Digital Platforms review flow.",
      ],
      image: "/assets/proj-lsr.png",
      link: "https://www.longhornsimracing.org",
      repo: "https://github.com/longhorn-sim-racing/lsr-monorepo",
      metrics: [
        { k: "drivers", v: "100+" },
        { k: "events", v: "50+" },
        { k: "uptime", v: "99.9%" },
      ],
    },
    {
      title: "Formula SAE EV Telemetry System",
      slug: "fsae",
      tagline: "Distributed Real-Time Vehicle Telemetry & Analytics Platform",
      year: "2024 — Present",
      status: "In Development",
      tech: [
        "Next.js",
        "TypeScript",
        "Python",
        "Kafka",
        "PostgreSQL",
        "Grafana",
        "Protobuf",
      ],
      bullets: [
        "Multi-car distributed telemetry: on-car protobuf → MQTT → Kafka → Postgres, fed into live Grafana dashboards and a custom Next.js viewer tool.",
        "Own the web viewer end-to-end — NextAuth, Prisma across three schemas, live Kafka + historical Postgres, Leaflet track maps, D3 / Chart.js / three.js plots.",
        "Drive overall data pathing and schema planning across the stack — from CAN signals on-car through to engineers' screens in the pit.",
      ],
      overview:
        "A distributed, multi-car telemetry platform for Longhorn Racing Electric's FSAE fleet — on-car protobuf emission over MQTT, Kafka streaming, multi-schema Postgres persistence, and live visualization via both Grafana and a custom Next.js viewer tool. Built alongside the rest of the telemetry team; I own the web layer and drive the overall data architecture.",
      detailBullets: [
        "Co-architected and maintain a multi-car telemetry platform spanning on-car protobuf emission, MQTT + Kafka streaming, multi-schema Postgres persistence, and live visualization via Grafana alongside a custom Next.js viewer — built as a team, with other engineers owning the processor services and parts of the ingest layer.",
        "Own the Next.js 15 viewer tool end-to-end: NextAuth + Prisma across three schemas (auth / telemetry / per-car), a kafkajs live consumer for realtime plots, historical Postgres queries, Leaflet track maps, D3 / Chart.js / three.js visualizations, and a drag-and-drop dashboard layout. Runs trackside over Tailscale/LAN.",
        "Drive overall data pathing and schema planning — whiteboarded how signals flow CAN → protobuf → MQTT → Kafka → processors → Postgres + live viewers, and locked in the database schemas (`angelique`, `orion`, `nightwatch`) before implementation began.",
        "Led system redesign and modernization after original authorship transitioned: moved the stack into a Bazel + docker-compose monorepo layout and stood up `server_devtool.sh` as a single-command trackside launcher (Kafka + Postgres + MQTT handler + auto-generated Prisma clients + viewer dev server).",
        "Live + retrospective dashboarding: realtime Grafana panels fed by a custom Kafka datasource plus retrospective Postgres-sourced dashboards for post-session analysis, all co-hosted at `lhrelectric.org/grafana` alongside the viewer tool.",
        "Focused on reliability and latency under real track conditions — spotty trackside connectivity, high-frequency CAN data loads, and a team-built platform where other engineers own processor services (lap timing, GPS classification, track mapping, GG-plot) that plug into the same Kafka + database layer.",
      ],
      image: "/assets/proj-telemetry.png",
      link: "https://lhrelectric.org/",
      linkNote: "Login may be required",
      repos: [
        {
          label: "Monorepo",
          url: "https://github.com/LonghornRacingElectric/lhre-2026/tree/main",
        },
        {
          label: "Telemetry",
          url: "https://github.com/LonghornRacingElectric/lhre-2026/tree/main/telemtry",
        },
        {
          label: "Web Tool",
          url: "https://github.com/LonghornRacingElectric/lhre-2026/tree/main/telemtry/analysis/database/viewer_tool",
        },
      ],
      metrics: [
        { k: "hz", v: "1000" },
        { k: "p99", v: "<40ms" },
        { k: "signals", v: "120+" },
      ],
    },
    {
      title: "In-Vehicle Driver Dash System",
      slug: "dash",
      tagline: "Real-Time Driver Display for Vehicle State, Timing, and Energy Data",
      year: "2025 — Present",
      status: "In Development",
      tech: ["Real-Time Systems", "WebSockets", "HMI", "TypeScript", "Systems Integration"],
      bullets: [
        "Displays live timing, energy deltas, and vehicle state directly to the driver in real time.",
        "Designed for clarity and reliability under high-speed, safety-critical conditions.",
        "Integrates live telemetry and vehicle bus data through a structured, low-latency pipeline.",
      ],
      overview:
        "A real-time, in-vehicle driver display designed to present critical telemetry, timing, and energy information during testing and competition. Built to operate under strict latency, reliability, and clarity constraints in a high-speed driving environment.",
      detailBullets: [
        "Designed and implemented the in-vehicle driver dashboard frontend, presenting real-time telemetry, timing, and energy data with an emphasis on clarity and reliability.",
        "Defined the data schema and WebSocket interface used to transmit live data to the dash, establishing a clear contract between vehicle-side systems and the display layer.",
        "Architected the end-to-end data flow from backend telemetry processors through cellular transport to the vehicle, ensuring low-latency delivery of driver-relevant signals.",
        "Integrated telemetry-derived data (e.g., lap and energy deltas) with vehicle bus signals provided by a Rust-based CAN interface, combining multiple data sources into a unified display model.",
        "Designed the display for use in a safety- and latency-sensitive environment, prioritizing readable layouts, stable updates, and graceful degradation over visual complexity.",
      ],
      image: "/assets/proj-dash.png",
      video: "/assets/proj-dash.mp4",
      repos: [
        {
          label: "Monorepo",
          url: "https://github.com/LonghornRacingElectric/lhre-2026/tree/main",
        },
        {
          label: "Dash Frontend",
          url: "https://github.com/LonghornRacingElectric/lhre-2026/tree/main/BEVO/dashd/frontend",
        },
      ],
      metrics: [
        { k: "refresh", v: "60fps" },
        { k: "latency", v: "<20ms" },
        { k: "screens", v: "1 car" },
      ],
    },
  ],
  projects: [
    {
      title: "Longhorn Racing Autonomous Platform",
      slug: "lhr-autonomy",
      tagline:
        "FSAE driverless simulation + control stack for Longhorn Racing's autonomous program.",
      tech: ["ROS 2", "Python", "Gazebo", "RViz", "Pure Pursuit"],
      status: "In Development",
      year: "2026 — Present",
      overview:
        "A ROS 2 workspace implementing the full FSAE driverless pipeline — procedural cone track generation, FOV-limited sensor simulation, centerline extraction, pure-pursuit control, the competition state machine, and a metrics harness — running on a pluggable simulation backend (lightweight kinematic model or Gazebo physics). Built as the starting point for next season's autonomous program at Longhorn Racing.",
      detailBullets: [
        "Built a 9-package ROS 2 workspace covering the full driverless loop — track generation, sensor simulation, centerline extraction, mission state machine, pure-pursuit control, vehicle simulation, metrics, and a Gazebo physics backend — orchestrated by a single `lhr_demo` launch file.",
        "Procedural cone track generator (`lhr_trackgen`) — Catmull-Rom spline autocross courses parameterized by seed, waypoint count, radius, jitter, track width, and cone spacing, publishing ground-truth blue/yellow cone markers.",
        "FOV-limited sensor simulation (`lhr_sensor_sim`) — configurable field-of-view, max/min range, Gaussian position noise, and false-negative rate; accumulates detections over time and publishes bright/dim seen-vs-unseen visualization plus an FOV frustum.",
        "Pure-pursuit controller (`lhr_control`) with a curvature-driven speed law — `v = clamp(sqrt(a_lat_max / |κ|), v_min, v_max)` — plus separate longitudinal accel/decel limits. Parametric lookahead, wheelbase, and curvature estimation window.",
        "FSAE driverless state machine (`lhr_mission_manager`) — `Off → Ready → Driving → Finished` with an `Emergency → Off` reset path. Mission selectors for inspection / autocross / acceleration / skidpad / EBS-test / manual. The control node is gated by mission state and only publishes drive commands when `DRIVING`.",
        "Metrics harness (`lhr_metrics`) — live cross-track error, off-track threshold events, and lap detection with start-radius + hysteresis + min-lap-time filters. Emits lap-complete events back to the mission manager and appends a per-run row to `data/metrics.csv`.",
        "Two interchangeable simulation backends: a lightweight kinematic bicycle model for fast iteration, and a full Gazebo physics world generated from the same track definition — identical downstream ROS 2 topic surface, so the upper stack doesn't know which is running.",
        "Developer ergonomics: Humble/Jazzy auto-detecting build and run scripts, pre-configured RViz layout, PlotJuggler integration for curvature / speed / state debug plots, single-command full-stack launch.",
      ],
    },
    {
      title: "PitLane Director AC",
      slug: "pitlane",
      tagline: "Broadcast director for Assetto Corsa sim racing leagues",
      tech: [
        "Electron",
        "TypeScript",
        "React",
        "CSP Lua",
        "WebSockets",
        "OBS",
      ],
      status: "Closed Beta",
      year: "2026 — Present",
      image: "/assets/proj-pitlane.png",
      link: "https://www.pitlanesystems.com",
      overview:
        "A desktop broadcast director for Assetto Corsa sim racing leagues that gives one operator full control of camera, timing, and on-air graphics without ever touching the sim's window. Built on Electron with a CSP Lua sidecar feeding live session data and executing camera commands, a local overlay server with broadcast-grade OBS overlays, and direct OBS integration for scene and replay control.",
      detailBullets: [
        "Architected a phased data layer where the broadcaster is the only required install — AC SharedMemory plus a CSP Lua sidecar on WebSocket :9101 delivers full session-wide data with zero driver coordination.",
        "Shipped a director dashboard with live leaderboard, battle detection, minimap, program monitor, and one-click camera cuts — the goal being to run an entire race broadcast without ever alt-tabbing into AC.",
        "Built an AI director that scores live race action (battles, incidents, leader, pit activity) and switches cameras automatically with broadcaster override and cooldown.",
        "Ships a local overlay server on :9100 plus 5 Pro overlays — Timing Tower, Lower Third, Battle Graphic, Telemetry HUD, and Track Map — each with a manifest-driven control panel and hot-reload dev workflow.",
        "Direct OBS integration via obs-websocket for scene/source control, recording, and replay buffer from within the director dashboard.",
        "Windows-only desktop app with Electron Builder, auto-updater proxy, and activation via RSA-2048 JWT tokens issued by the distribution site.",
      ],
    },
    {
      title: "trophysim.com",
      slug: "trophysim",
      tagline: "Marketing site for Trophy Sim Solutions — championship-standard sim rigs.",
      tech: [
        "Next.js 16",
        "TypeScript",
        "Tailwind v4",
        "shadcn/ui",
        "Framer Motion",
        "Resend",
      ],
      status: "Live",
      year: "2026 — Present",
      image: "/assets/proj-trophysim.png",
      link: "https://www.trophysim.com",
      overview:
        "Marketing site for Trophy Sim Solutions LLC — a company I co-founded to design, source, install, and calibrate professional sim racing systems for teams and training facilities. Built as a content-driven site where a single TypeScript source feeds both rendered pages and JSON-LD schema to prevent Google-penalized drift between what a page says and what its schema claims.",
      detailBullets: [
        "Single-source-of-truth content layer: tier specs, FAQ, founders, and site config live as plain TS modules under `lib/`, read by both rendering components and JSON-LD schema generators. Eliminates the entire class of FAQ-schema-vs-visible-FAQ mismatches Google penalizes.",
        "Six routes: Home, Services (three package tiers with FAQ), About (founder profiles), Contact (Zod-validated + Resend-backed), Privacy, and a custom 404.",
        "Schema cross-linking via stable `@id`s — all JSON-LD references a single ProfessionalService entity; Service and Person schemas point to it as provider / worksFor, consolidating E-E-A-T signals into one graph.",
        "Custom design system on Tailwind v4 with CSS-first config: brand tokens (gold / amber / carbon / titanium / ivory) exposed as utilities, uniform `rounded-sm` shape language, hover-invert button pattern with uppercase `tracking-[0.12em]`.",
        "Contact form gracefully degrades when `RESEND_API_KEY` is unset (logs + success state); Cloudflare Turnstile gating, native `<select>` + radios for clean FormData submission.",
        "Deployed on Vercel — `main` auto-deploys, `dev` skips builds via `vercel.json` ignoreCommand to conserve build minutes.",
      ],
    },
    {
      title: "pitlanesystems.com",
      slug: "pitlane-site",
      tagline: "Marketing, auth, and licensing hub for PitLane Director AC",
      tech: [
        "Next.js 16",
        "TypeScript",
        "Better Auth",
        "Stripe",
        "Neon",
        "Cloudflare R2",
      ],
      status: "Live",
      year: "2026 — Present",
      image: "/assets/proj-pitlane-site.png",
      link: "https://www.pitlanesystems.com",
      overview:
        "The marketing and distribution hub for PitLane Director — landing page, blog, docs, auth, Stripe subscriptions, and the licensing + release-proxy server for the Electron desktop app. Built as a production platform so a one-person company can sell and ship a paid desktop product end-to-end.",
      detailBullets: [
        "Single-page scrolling landing with alternating dark/surface stripes, mouse-tracked 3D showcase tiles, and a staggered-entrance hero — tuned to look credible to sim racing broadcasters who find the site via search or outreach.",
        "Full Better Auth stack: email+password with required OTP verification, 7-day sessions, and Stripe plugin auto-creating customers on signup and handling subscription webhooks.",
        "Electron app activation via RSA-2048 JWTs — `/api/activate` and `/api/refresh` issue 30-day offline-capable tokens, with per-plan device limits enforced at activation and revocable from the dashboard.",
        "Cloudflare R2 as the release bucket with presigned-URL flows for both the dashboard installer download and the auto-updater proxy — subscription state is checked at download time, not baked into the app.",
        "MDX blog + docs pipeline with frontmatter, reading-time, per-post OG image generation via Satori, RSS feed, and a JSON-LD entity graph (Organization, SoftwareApplication, Person, WebSite) stitched by stable @ids.",
        "Stripe billing in test mode (pricing TBD, no amounts on page), Resend for transactional email, Neon Postgres, Vercel analytics, auto-deploy gated to `main` only.",
      ],
    },
    {
      title: "Personal Website (v3)",
      slug: "personal-website-v3",
      tagline: "Third-Generation Editorial + Terminal Portfolio Platform",
      tech: ["TypeScript", "Next.js 16", "Tailwind v4", "Recharts"],
      status: "Live",
      year: "2026",
      image: "/assets/proj-portfolio.png",
      repo: "https://github.com/GrayM8/portfolio-site",
      overview:
        "A third-generation personal platform with two distinct theming modes — an editorial magazine layout and a terminal REPL — each with its own light and dark variants. Built on Next.js 16, Tailwind v4, and TypeScript, with live data integrations and dedicated case-study pages per project.",
      detailBullets: [
        "Designed and implemented dual-mode theming with a shared content layer: editorial (serif magazine) and terminal (mono REPL), each with independent light/dark palettes.",
        "Live GitHub activity sparkline backed by a cached Route Handler, powered by Recharts and a localStorage hydrate-then-refresh client pattern for instant repeat-visit paint.",
        "Sticky scroll-spy navigation with animated underline, fluid clamp-based typography, and max-width container scaling to keep layouts usable from mobile to ultrawide.",
        "Statically generated project detail pages under /projects/[slug] with shared editorial chrome, metadata strip, metrics break-out, and colophon footer.",
        "Real-time Austin temperature in the masthead via Open-Meteo (no auth) and a dynamic month/year header that updates on mount to avoid hydration mismatch.",
      ],
    },
    {
      title: "AgentWorkspaces",
      slug: "agentworkspaces",
      tagline: "Real-Time AI Collaboration Platform",
      tech: ["TypeScript", "React", "Cloudflare Workers", "Durable Objects", "WebSockets"],
      status: "Live",
      year: "2025",
      image: "/assets/proj-agents.png",
      link: "https://agentworkspaces.pages.dev/",
      repo: "https://github.com/GrayM8/cf_ai_agentworkspaces",
      overview:
        "A real-time, multi-user collaboration platform built on Cloudflare's edge infrastructure. Combines persistent WebSocket rooms, shared state synchronization, and a structured LLM tool-calling engine to enable autonomous AI-driven workflows alongside human participants.",
      detailBullets: [
        "Engineered a real-time multi-user collaboration platform on Cloudflare's edge using Durable Objects and WebSocket Hibernation to maintain stateful, cost-efficient persistent connections per room.",
        "Designed a custom WebSocket protocol to synchronize chat, shared memory, todos, artifacts, and settings across concurrent clients with debounced batched writes to durable storage.",
        "Implemented a structured AI tool-calling engine (Llama 3.3 70B) using a two-pass inference architecture and 9 typed function tools enabling deterministic, autonomous state mutation across sessions.",
        "Architected a full-stack TypeScript monorepo (React 19, Vite, Tailwind) deployed serverlessly via Cloudflare Pages + Workers, eliminating traditional server infrastructure and minimizing cold-start latency.",
      ],
    },
    { title: "Pintos OS Kernel", tagline: "Scheduling, virtual memory, file systems", tech: ["C", "Operating Systems"], status: "Archived", year: "2025" },
    { title: "chArm-v3 CPU Simulator", tagline: "Cycle-accurate pipelined CPU + cache", tech: ["C", "Computer Architecture"], status: "Archived", year: "2025" },
    { title: "Dynamic Memory Allocator", tagline: "Explicit free-list, coalescing, validation", tech: ["C", "Memory Mgmt"], status: "Archived", year: "2024" },
    { title: "Command Interpreter", tagline: "Parser + execution control", tech: ["C", "Systems"], status: "Archived", year: "2024" },
  ],
  experience: [
    {
      title: "Co-Founder & CTO",
      org: "Trophy Sim Solutions",
      period: "Apr 2026 — Present",
      tenure: "1 mo",
      location: "Austin, TX",
      logo: "/assets/trophysim.png",
      bullets: [
        "Co-founded Trophy Sim Solutions LLC (operating as TrophySim) with Mark Yuan (CEO) and Dylan Foley (CDO) to design, source, install, and calibrate professional sim racing systems for motorsport teams and training facilities.",
        "Architected and shipped the marketing platform (Next.js 16, TypeScript, Tailwind v4) as a content-driven site where a single TS source feeds both rendered pages and JSON-LD schema, eliminating drift between visible copy and structured data.",
        "Built the Zod-validated, Resend-backed contact pipeline and Cloudflare Turnstile gating for quote intake from early prospects.",
        "Leading technical direction, including an in-progress affiliate-linking sim configuration tool to streamline spec → quote → purchase.",
      ],
      skills: [
        "Next.js",
        "TypeScript",
        "Tailwind",
        "Full-Stack",
        "SEO",
        "Entrepreneurship",
        "Technical Leadership",
      ],
    },
    {
      title: "Founder",
      org: "PitLane Systems",
      period: "Apr 2026 — Present",
      tenure: "1 mo",
      location: "Austin, TX",
      logo: "/assets/pitlane.svg",
      bullets: [
        "Founded PitLane Systems LLC to build broadcast software for sim racing leagues — selected as a 2026 McCombs Entrepreneur Summer Fellow at UT Austin.",
        "Architected PitLane Director AC, a Windows desktop broadcast director (Electron + React + TypeScript) with a CSP Lua sidecar feeding live session data over WebSocket and direct OBS integration for scene control.",
        "Designed and shipped 5 broadcast-grade Pro overlays (timing tower, lower third, battle graphic, telemetry HUD, track map) served from a local overlay server consumed by OBS browser sources.",
        "Built the full distribution stack end-to-end: Next.js 16 marketing site, Better Auth + Stripe subscriptions, RSA-JWT licensing, and Cloudflare R2 release delivery with auto-updater proxy.",
      ],
      skills: [
        "Electron",
        "TypeScript",
        "React",
        "Next.js",
        "Stripe",
        "Better Auth",
        "Entrepreneurship",
        "Technical Leadership",
      ],
    },
    {
      title: "Co-Founder & CTO",
      org: "Longhorn Sim Racing",
      period: "Mar 2025 — Present",
      tenure: "1 yr 2 mos",
      location: "Austin, TX",
      logo: "/assets/lsr.png",
      bullets: [
        "Co-founded Longhorn Sim Racing at UT Austin and own the technical direction of the club's platform — the system of record for membership, events, race competitions, content, and merchandise.",
        "Architected the monorepo end-to-end: Next.js 16 App Router with React Server Components, Prisma on PostgreSQL via Supabase, Supabase Auth with just-in-time user provisioning and role-based authz across six roles (member, competition, officer, president, alumni, admin).",
        "Built race-condition-safe event registration using Postgres FOR UPDATE row locks, a FIFO waitlist with automatic promotion on cancellations, and officer-facing admin tooling for attendance, approvals, and audit logging.",
        "Stood up the engineering workflow: pnpm + Turborepo monorepo, Dockerized local Supabase stack, PR-gated CI (lint / typecheck / build), and the CODEOWNERS-enforced Digital Platforms review flow.",
      ],
      skills: [
        "Next.js",
        "TypeScript",
        "Prisma",
        "PostgreSQL",
        "Supabase",
        "Full-Stack",
        "Technical Leadership",
      ],
    },
    {
      title: "Telemetry Software Engineer",
      org: "Longhorn Racing (FSAE EV)",
      period: "Sep 2024 — Present",
      tenure: "1 yr 8 mos",
      location: "Austin, TX",
      logo: "/assets/lhr.png",
      bullets: [
        "Own the web layer and data architecture of a distributed multi-car telemetry platform (protobuf → MQTT → Kafka → multi-schema Postgres → Grafana + a custom Next.js viewer tool), built alongside the rest of the telemetry team.",
        "Designed and implemented the in-vehicle driver dashboard — real-time timing, energy deltas, and vehicle-state display built for clarity and reliability under high-speed conditions; defined the WebSocket contract between the telemetry backend and the dash.",
        "Building the team's ROS 2 driverless simulation and control stack from scratch for next season's autonomous program — a 9-package workspace covering track generation, FOV-limited sensor sim, pure-pursuit control with a curvature-driven speed law, the FSAE mission state machine, metrics, and an interchangeable Gazebo physics backend.",
        "Drive cross-system data-flow planning and monorepo tooling: schemas and protocols across telemetry / dash / autonomy, the Bazel + docker-compose migration, and a single-command trackside launcher (`server_devtool.sh`) that boots the full ingest stack plus the viewer.",
      ],
      skills: [
        "TypeScript",
        "Python",
        "ROS 2",
        "Kafka",
        "PostgreSQL",
        "Distributed Systems",
        "Real-Time Systems",
      ],
    },
  ],
  education: {
    school: "The University of Texas at Austin",
    degree: "B.S. Computer Science",
    period: "Aug 2024 — May 2028 (expected)",
    location: "Austin, TX",
    logo: "/assets/texas.png",
    coursework: ["Data Structures", "Operating Systems", "Algorithms & Complexity", "Computer Architecture", "Cloud Computing", "Machine Learning I"],
  },
  skills: {
    Languages: ["TypeScript", "Python", "C", "Java", "Rust", "SQL", "Assembly"],
    Frameworks: ["React", "Next.js", "Node.js", "Tailwind"],
    Systems: ["Distributed Systems", "Real-Time", "WebSockets", "Embedded", "CAN Bus"],
    Infra: ["PostgreSQL", "Cloudflare Workers", "Durable Objects", "AWS EC2", "Grafana"],
    Practices: ["TDD", "SEO", "Perf Analysis", "Reliability Eng"],
  },
  notes: [
    {
      title: "PitLane Systems Selected as a 2026 McCombs Entrepreneur Summer Fellow",
      date: "Apr 2026",
      tag: "milestone",
      read: "2 min",
      url: "https://www.pitlanesystems.com/blog/mccombs-entrepreneur-summer-fellow-2026",
      description:
        "PitLane Systems is backed by the Harkey Institute at UT Austin's McCombs School of Business through the 2026 McCombs Entrepreneur Summer Fellowship.",
    },
    {
      title: "Announcing PitLane Systems",
      date: "Apr 2026",
      tag: "founder",
      read: "3 min",
      url: "https://www.pitlanesystems.com/blog/announcing-pitlane-systems",
      description:
        "Over a year of producing sim racing broadcasts at UT Austin, and we kept hitting the same wall: the tool we needed didn't exist. So I built it.",
    },
  ],
};
