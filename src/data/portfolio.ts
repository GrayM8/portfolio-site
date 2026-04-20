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
    { what: "Redesigning the telemetry backend for 2026 season", where: "Longhorn Racing" },
    { what: "Shipping payment integration on LSR platform", where: "Longhorn Sim Racing" },
    { what: "Reading: Designing Data-Intensive Applications", where: "evenings" },
    { what: "Refactoring dashd frontend for sub-20ms latency", where: "side-of-desk" },
  ],
  featured: [
    {
      title: "Longhorn Sim Racing Platform",
      slug: "lsr",
      tagline: "Events, Membership & Competition Management Platform",
      year: "2025 — Present",
      status: "Live",
      tech: ["TypeScript", "Next.js", "PostgreSQL", "React"],
      bullets: [
        "Centralized membership, events, and competition results into a single self-serve platform.",
        "Automated race result ingestion and leaderboard/statistics processing.",
        "Reduced administrative workload and improved consistency across event operations.",
      ],
      overview:
        "A unified operations hub for Longhorn Sim Racing that replaced scattered spreadsheets and manual workflows with structured registration, admin tools, and automated results processing — built for real day-to-day use.",
      detailBullets: [
        "Architected and shipped the club's core digital platform end-to-end in TypeScript (React / Next.js), used for day-to-day operations.",
        "Implemented member accounts and event registration workflows with officer-facing admin tooling for management and approvals.",
        "Built automated race results ingestion and computation pipelines powering driver statistics, leaderboards, and season standings.",
        "Integrated a custom merchandise storefront with Shopify-backed checkout, payments, and fulfillment workflows.",
        "Owned platform discoverability and indexing (structured metadata, sitemaps, Search Console) to ensure reliable SEO and sharing previews.",
      ],
      image: "/assets/proj-lsr.png",
      link: "https://www.longhornsimracing.org",
      repo: "https://github.com/GrayM8/lsr-site",
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
        "Distributed Systems",
        "Real-Time Data",
        "TypeScript",
        "Python",
        "Telemetry",
      ],
      bullets: [
        "Powers live telemetry, timing, and analytics for engineers and drivers during testing and competition.",
        "Streams high-frequency vehicle data end-to-end with low latency and fault tolerance.",
        "Enables trackside decision-making through real-time visualization and post-session analysis.",
      ],
      overview:
        "A distributed, real-time telemetry platform for a Formula SAE electric vehicle, supporting live data ingestion, streaming, storage, and visualization during testing and competition. Designed to deliver reliable, low-latency insight to engineers and drivers under real-world track conditions.",
      detailBullets: [
        "Co-architected and maintain a distributed telemetry system spanning on-car ingestion, real-time streaming, persistent storage, and live visualization.",
        "Led system redesign and modernization after original authorship transitioned, replacing legacy components with a more robust and scalable architecture.",
        "Owned the design and implementation of the web backend and frontend, delivering real-time dashboards for timing, deltas, vehicle state, driver inputs, and energy usage across mobile and trackside devices.",
        "Built trackside tooling and configuration workflows to support session setup, data grouping, and reliable live operation.",
        "Integrated streaming data with backend storage and processing pipelines to support analytics such as energy prediction and performance modeling.",
        "Focused on system reliability and latency, ensuring graceful behavior under intermittent connectivity and high-frequency data loads.",
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
      status: "In Development",
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
      title: "Founder & CTO",
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
        "Architected and shipped the club's full-stack TypeScript platform end-to-end (Next.js / React).",
        "Built internal admin tools for event, registration, and member management.",
        "Integrated Shopify-backed checkout with a custom storefront UI.",
        "Established the foundation for digital payments and notifications.",
      ],
      skills: ["Next.js", "TypeScript", "Full-Stack", "SEO", "Technical Leadership"],
    },
    {
      title: "Telemetry Software Engineer",
      org: "Longhorn Racing (FSAE EV)",
      period: "Sep 2024 — Present",
      tenure: "1 yr 8 mos",
      location: "Austin, TX",
      logo: "/assets/lhr.png",
      bullets: [
        "Develop and maintain a distributed real-time telemetry system for an FSAE EV race car.",
        "Designed the on-car telemetry dashboard for safety-critical conditions.",
        "Built web-based visualization tools in TypeScript/React for live timing and vehicle state.",
        "Integrated streaming with backend stores for analytics (energy prediction, performance).",
      ],
      skills: ["Distributed Systems", "TypeScript", "Python", "Real-Time Data", "Embedded"],
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
    { title: "Building a sub-20ms telemetry pipeline", date: "Apr 2026", tag: "systems", read: "8 min" },
    { title: "What I learned co-founding an org at 19", date: "Mar 2026", tag: "notes", read: "5 min" },
    { title: "Durable Objects vs. traditional WebSocket rooms", date: "Feb 2026", tag: "systems", read: "12 min" },
    { title: "Writing the driver dash: clarity at 70 mph", date: "Jan 2026", tag: "design", read: "6 min" },
  ],
};
