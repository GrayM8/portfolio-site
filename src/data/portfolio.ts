export type Metric = { k: string; v: string };

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
  repo?: string;
  metrics?: Metric[];
};

export type IndexProject = {
  title: string;
  tagline: string;
  tech: string[];
  status: "Live" | "In Development" | "Archived" | string;
  year: string;
  image?: string;
};

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
      tagline: "Events, membership & competition management",
      year: "2025—",
      status: "Live",
      tech: ["TypeScript", "Next.js", "PostgreSQL", "React"],
      bullets: [
        "Centralized membership, events, and competition results into a single self-serve platform.",
        "Automated race result ingestion and leaderboard/statistics processing.",
        "Reduced admin workload and improved consistency across event operations.",
      ],
      image: "/assets/proj-lsr.png",
      link: "longhornsimracing.org",
      repo: "github.com/GrayM8/lsr-site",
      metrics: [
        { k: "users", v: "200+" },
        { k: "events", v: "24" },
        { k: "uptime", v: "99.9%" },
      ],
    },
    {
      title: "Formula SAE EV Telemetry",
      slug: "fsae",
      tagline: "Distributed real-time vehicle telemetry",
      year: "2024—",
      status: "In Development",
      tech: ["Distributed Systems", "TypeScript", "Python", "Real-Time"],
      bullets: [
        "Powers live telemetry, timing, and analytics trackside.",
        "Streams high-frequency vehicle data end-to-end with low latency.",
        "Enables trackside decisions through real-time dashboards.",
      ],
      image: "/assets/proj-telemetry.png",
      link: "lhrelectric.org",
      repo: "github.com/LonghornRacingElectric/lhre-2026",
      metrics: [
        { k: "hz", v: "1000" },
        { k: "p99", v: "<40ms" },
        { k: "signals", v: "120+" },
      ],
    },
    {
      title: "In-Vehicle Driver Dash",
      slug: "dash",
      tagline: "Real-time driver display: timing, energy, vehicle state",
      year: "2025—",
      status: "In Development",
      tech: ["WebSockets", "TypeScript", "Real-Time", "HMI"],
      bullets: [
        "Displays live timing, energy deltas, and vehicle state to the driver.",
        "Designed for clarity and reliability under high-speed conditions.",
        "Integrates telemetry + CAN bus through a low-latency pipeline.",
      ],
      image: "/assets/proj-dash.png",
      video: "/assets/proj-dash.mp4",
      repo: "github.com/LonghornRacingElectric/lhre-2026",
      metrics: [
        { k: "refresh", v: "60fps" },
        { k: "latency", v: "<20ms" },
        { k: "screens", v: "1 car" },
      ],
    },
  ],
  projects: [
    { title: "Personal Website (v2)", tagline: "Technical portfolio & personal platform", tech: ["TypeScript", "Next.js"], status: "Live", year: "2025", image: "/assets/proj-portfolio.png" },
    { title: "AgentWorkspaces", tagline: "Real-time AI collaboration platform", tech: ["TypeScript", "React", "Cloudflare Workers", "Durable Objects"], status: "Live", year: "2024", image: "/assets/proj-agents.png" },
    { title: "Pintos OS Kernel", tagline: "Scheduling, virtual memory, file systems", tech: ["C", "Operating Systems"], status: "Archived", year: "2025" },
    { title: "chArm-v3 CPU Simulator", tagline: "Cycle-accurate pipelined CPU + cache", tech: ["C", "Computer Architecture"], status: "Archived", year: "2025" },
    { title: "Dynamic Memory Allocator", tagline: "Explicit free-list, coalescing, validation", tech: ["C", "Memory Mgmt"], status: "Archived", year: "2024" },
    { title: "Command Interpreter", tagline: "Parser + execution control", tech: ["C", "Systems"], status: "Archived", year: "2024" },
  ],
  experience: [
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
