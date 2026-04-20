"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { PORTFOLIO } from "@/data/portfolio";
import { ModeControls } from "../ModeControls";
import { useModeTheme } from "../ModeThemeProvider";
import { useAustinTemp } from "@/lib/weather";

type Palette = {
  bg: string;
  panel: string;
  panel2: string;
  ink: string;
  sub: string;
  rule: string;
  accent: string;
  green: string;
  blue: string;
};

const o2Styles: { light: Palette; dark: Palette } = {
  light: {
    bg: "#eeeae4",
    panel: "#e3ddd3",
    panel2: "#d8d0c2",
    ink: "#14130f",
    sub: "#5a554a",
    rule: "#c7bfad",
    accent: "#bf4711",
    green: "#527a2e",
    blue: "#2b5e87",
  },
  dark: {
    bg: "#0a0a09",
    panel: "#131311",
    panel2: "#1b1b18",
    ink: "#e8e4d8",
    sub: "#8a857a",
    rule: "#24231f",
    accent: "#ff7321",
    green: "#9fc766",
    blue: "#6bb0db",
  },
};

const mono = "var(--font-mono), ui-monospace, monospace";

type LineColor = "accent" | "green" | "red" | "blue";
type Line = {
  t: "out" | "cmd" | "rule";
  content: string;
  color?: LineColor;
  muted?: boolean;
};

const COMMAND_NAMES = [
  // content
  "help",
  "whoami",
  "about",
  "work",
  "projects",
  "case",
  "experience",
  "education",
  "skills",
  "stack",
  "now",
  "notes",
  "cv",
  "contact",
  "resume",
  // shell
  "ls",
  "cat",
  "echo",
  "date",
  "pwd",
  "uname",
  "uptime",
  "history",
  "which",
  "man",
  "systemctl",
  "neofetch",
  "theme",
  "clear",
  // nav
  "open",
  "goto",
  "exit",
  "logout",
  // fun
  "fortune",
  "cowsay",
  "sl",
  "sudo",
  "rm",
  "mkdir",
];

const SLASH_NAV: Array<{ label: string; cmd: string }> = [
  { label: "about", cmd: "about" },
  { label: "work", cmd: "work" },
  { label: "projects", cmd: "projects" },
  { label: "now", cmd: "now" },
  { label: "experience", cmd: "experience" },
  { label: "education", cmd: "education" },
  { label: "notes", cmd: "notes" },
  { label: "contact", cmd: "contact" },
];

export function TerminalSite() {
  const { theme, toggleTheme } = useModeTheme();
  const c = theme === "dark" ? o2Styles.dark : o2Styles.light;
  const P = PORTFOLIO;
  const temp = useAustinTemp();
  const router = useRouter();

  const [history, setHistory] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [booted, setBooted] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [inputWidth, setInputWidth] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);

  // Measure the rendered width of whatever the user has typed, so the cursor
  // block can sit flush against it instead of relying on the browser's `size`
  // attribute which includes padding slack.
  useEffect(() => {
    if (measureRef.current) {
      setInputWidth(measureRef.current.getBoundingClientRect().width);
    }
  }, [input]);

  // Boot sequence: every line below is sourced from PORTFOLIO so the terminal
  // stays identical to the editorial home content.
  useEffect(() => {
    const bootLines: Line[] = [
      { t: "out", content: `gray@austin : ~ — zsh`, muted: true },
      {
        t: "out",
        content: `Last login: ${new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })} from austin`,
        muted: true,
      },
      { t: "cmd", content: "whoami" },
      { t: "out", content: `${P.name.toLowerCase()} — ${P.role.toLowerCase()}` },
      {
        t: "out",
        content: `${P.location.toLowerCase()} · ${P.status.toLowerCase()}`,
        muted: true,
      },
      { t: "cmd", content: "cat ~/about.md | head -1" },
      { t: "out", content: P.about[0] },
      { t: "cmd", content: "systemctl status" },
      {
        t: "out",
        content: "● gray.service — loaded, active (running)",
        color: "green",
      },
      ...P.now.slice(0, 2).map((n, idx) => ({
        t: "out" as const,
        content: `  ${idx === 0 ? "shipping" : "also    "}: ${n.what} (${n.where})`,
        muted: true,
      })),
      {
        t: "out",
        content: `  ${P.status.toLowerCase()}`,
        color: "accent",
      },
      { t: "cmd", content: "help" },
      {
        t: "out",
        content: `commands: ${COMMAND_NAMES.join(" · ")}`,
      },
      {
        t: "out",
        content: "hint: click any /slash item in the header to jump to a section.",
        muted: true,
      },
    ];

    let i = 0;
    let timer: number | undefined;
    const tick = () => {
      if (i < bootLines.length) {
        const line = bootLines[i];
        setHistory((h) => [...h, line]);
        i++;
        timer = window.setTimeout(tick, i < 3 ? 150 : i < 10 ? 100 : 70);
      } else {
        setBooted(true);
      }
    };
    tick();
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [P]);

  // Auto-scroll on new content
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, booted]);

  const printRule = (label?: string): Line[] =>
    label
      ? [
          { t: "rule", content: `── ${label} ${"─".repeat(Math.max(0, 52 - label.length))}` },
        ]
      : [{ t: "rule", content: "─".repeat(60) }];

  // Virtual filesystem backing `cat` / `ls`. All content sourced from PORTFOLIO.
  const VFS = useMemo<Record<string, string[]>>(
    () => ({
      "about.md": P.about,
      ".now": P.now.map((n) => `• ${n.where.padEnd(22)} ${n.what}`),
      "contact.txt": [
        `email    ${P.email}`,
        `github   ${P.github}`,
        `linkedin ${P.linkedin}`,
        `location ${P.location}`,
      ],
      "skills.txt": Object.entries(P.skills).map(
        ([k, v]) => `${k.padEnd(12)} ${v.join(" · ")}`,
      ),
      "education.md": [
        `${P.education.school}`,
        `${P.education.degree}`,
        `${P.education.period} · ${P.education.location}`,
        "",
        "Coursework:",
        ...P.education.coursework.map((c) => `  - ${c}`),
      ],
      "experience.md": P.experience.flatMap((e) => [
        `${e.title} — ${e.org}`,
        `  ${e.period} · ${e.location} · ${e.tenure}`,
        ...e.bullets.map((b) => `  - ${b}`),
        "",
      ]),
      "README.md": [
        `${P.name} — ${P.role}`,
        `${P.location} · ${P.status}`,
        "",
        P.tagline,
        "",
        "Type `help` for commands.",
      ],
    }),
    [P],
  );

  const commands = useMemo<Record<string, (arg?: string) => Line[] | "CLEAR">>(
    () => ({
      help: () => [
        { t: "out", content: "available commands:" },
        { t: "out", content: "" },
        { t: "out", content: "content:", muted: true },
        { t: "out", content: "  work         — featured projects", color: "accent" },
        { t: "out", content: "  projects     — full project index (incl. archived)", color: "accent" },
        { t: "out", content: "  case <slug>  — deep dive on one project", color: "accent" },
        { t: "out", content: "  experience   — roles & tenures", color: "accent" },
        { t: "out", content: "  education    — school & coursework", color: "accent" },
        { t: "out", content: "  skills       — stack by category", color: "accent" },
        { t: "out", content: "  stack        — skills as ascii bar chart", color: "accent" },
        { t: "out", content: "  now          — currently shipping", color: "accent" },
        { t: "out", content: "  notes        — writing", color: "accent" },
        { t: "out", content: "  cv           — experience + education", color: "accent" },
        { t: "out", content: "  contact      — how to reach me", color: "accent" },
        { t: "out", content: "  about        — longer introduction", color: "accent" },
        { t: "out", content: "  whoami       — one-liner", color: "accent" },
        { t: "out", content: "  resume       — fetch resume.pdf (emails me if unavailable)", color: "accent" },
        { t: "out", content: "" },
        { t: "out", content: "shell:", muted: true },
        { t: "out", content: "  ls [-l]      — list virtual files", muted: true },
        { t: "out", content: "  cat <file>   — print file (| head -N | tail -N | wc -l)", muted: true },
        { t: "out", content: "  echo <text>  — print arguments", muted: true },
        { t: "out", content: "  date         — current time (CST)", muted: true },
        { t: "out", content: "  pwd          — current directory", muted: true },
        { t: "out", content: "  uname [-a]   — system banner", muted: true },
        { t: "out", content: "  uptime       — time since Aug 2024", muted: true },
        { t: "out", content: "  history      — command history", muted: true },
        { t: "out", content: "  which <cmd>  — resolve command path", muted: true },
        { t: "out", content: "  man <cmd>    — manual page", muted: true },
        { t: "out", content: "  systemctl    — status · list-units", muted: true },
        { t: "out", content: "  neofetch     — ascii banner + system info", muted: true },
        { t: "out", content: "  theme        — toggle light/dark", muted: true },
        { t: "out", content: "  clear        — wipe screen", muted: true },
        { t: "out", content: "" },
        { t: "out", content: "nav:", muted: true },
        { t: "out", content: "  open <t>     — github · linkedin · email · site · tui · resume · <slug>", muted: true },
        { t: "out", content: "  goto <slug>  — jump to a project detail page", muted: true },
        { t: "out", content: "  exit / logout — back to /", muted: true },
        { t: "out", content: "" },
        { t: "out", content: "fun:", muted: true },
        { t: "out", content: "  fortune      — random quote", muted: true },
        { t: "out", content: "  cowsay <txt> — ascii cow", muted: true },
        { t: "out", content: "  sl           — oops, try ls", muted: true },
        { t: "out", content: "  sudo <cmd>   — denied, always", muted: true },
        { t: "out", content: "  rm <path>    — write-protected by laziness", muted: true },
        { t: "out", content: "  mkdir <name> — generates a polite refusal", muted: true },
        { t: "out", content: "" },
        {
          t: "out",
          content:
            "tab to complete · ↑↓ to recall history · click a /slash item above to jump",
          muted: true,
        },
      ],
      whoami: () => [
        { t: "out", content: `${P.name.toLowerCase()} — ${P.role.toLowerCase()}` },
        {
          t: "out",
          content: `${P.location.toLowerCase()} · ${P.status.toLowerCase()}`,
          muted: true,
        },
      ],
      about: () => [
        ...printRule("about"),
        ...P.about.map((line) => ({ t: "out" as const, content: line })),
      ],
      work: () => [
        ...printRule("featured"),
        ...P.featured.flatMap((p) => [
          { t: "out" as const, content: `▸ ${p.slug.padEnd(6)} — ${p.title}`, color: "accent" as const },
          { t: "out" as const, content: `  ${p.tagline}`, muted: true },
          {
            t: "out" as const,
            content: `  stack: ${p.tech.join(" · ")}`,
            muted: true,
          },
          {
            t: "out" as const,
            content: `  status: ${p.status.toLowerCase()} · ${p.year}`,
            muted: true,
          },
          ...(p.link
            ? [
                {
                  t: "out" as const,
                  content: `  → ${p.link.replace(/^https?:\/\//, "")}`,
                  color: "blue" as const,
                },
              ]
            : []),
          { t: "out" as const, content: "" },
        ]),
        {
          t: "out",
          content: "type `case <slug>` for a deep dive, or `projects` for the full index.",
          muted: true,
        },
      ],
      projects: () => [
        ...printRule("projects · all"),
        { t: "out", content: "FEATURED:", color: "accent" },
        ...P.featured.map((p) => ({
          t: "out" as const,
          content: `  ${p.year.padEnd(18)} ${p.title}`,
        })),
        { t: "out", content: "" },
        { t: "out", content: "ARCHIVE:", color: "accent" },
        ...P.projects.map((p) => ({
          t: "out" as const,
          content: `  ${p.year.padEnd(18)} ${p.title}`,
          muted: p.status === "Archived",
        })),
      ],
      case: (arg) => {
        const pool = [
          ...P.featured,
          ...P.projects.filter(
            (p): p is typeof p & { slug: string } => Boolean(p.slug),
          ),
        ];
        const slugList = pool.map((p) => p.slug).join(", ");
        if (!arg) {
          return [
            {
              t: "out",
              content: `usage: case <slug>  (slugs: ${slugList})`,
              color: "red",
            },
          ];
        }
        const slug = arg.trim().toLowerCase();
        const match = pool.find((p) => p.slug === slug);
        if (!match) {
          return [{ t: "out", content: `case: no project with slug "${slug}"`, color: "red" }];
        }
        const m = match as {
          bullets?: string[];
          overview?: string;
          detailBullets?: string[];
          metrics?: Array<{ k: string; v: string }>;
          repos?: Array<{ label: string; url: string }>;
          repo?: string;
        };
        const bullets = m.bullets ?? [];
        const overview = m.overview;
        const detail = m.detailBullets ?? [];
        const metrics = m.metrics ?? [];
        const repos =
          m.repos ?? (m.repo ? [{ label: "source", url: m.repo }] : []);
        return [
          ...printRule(`case · ${match.slug}`),
          { t: "out", content: match.title, color: "accent" },
          { t: "out", content: match.tagline, muted: true },
          { t: "out", content: `${match.status.toLowerCase()} · ${match.year}`, muted: true },
          { t: "out", content: "" },
          ...(overview ? [{ t: "out" as const, content: overview }] : []),
          ...(bullets.length
            ? [
                { t: "out" as const, content: "" },
                { t: "out" as const, content: "highlights:", color: "accent" as const },
                ...bullets.map((b) => ({ t: "out" as const, content: `  › ${b}` })),
              ]
            : []),
          ...(detail.length
            ? [
                { t: "out" as const, content: "" },
                { t: "out" as const, content: "notes:", color: "accent" as const },
                ...detail.map((b) => ({ t: "out" as const, content: `  § ${b}` })),
              ]
            : []),
          ...(metrics.length
            ? [
                { t: "out" as const, content: "" },
                { t: "out" as const, content: "metrics:", color: "accent" as const },
                ...metrics.map((m) => ({
                  t: "out" as const,
                  content: `  ${m.k.padEnd(10)} ${m.v}`,
                })),
              ]
            : []),
          ...(match.link || repos.length
            ? [
                { t: "out" as const, content: "" },
                { t: "out" as const, content: "links:", color: "accent" as const },
                ...(match.link
                  ? [
                      {
                        t: "out" as const,
                        content: `  live      ${match.link.replace(/^https?:\/\//, "")}`,
                        color: "blue" as const,
                      },
                    ]
                  : []),
                ...repos.map((r) => ({
                  t: "out" as const,
                  content: `  ${r.label.padEnd(9)} ${r.url.replace(/^https?:\/\//, "")}`,
                  color: "blue" as const,
                })),
              ]
            : []),
        ];
      },
      experience: () => [
        ...printRule("experience"),
        ...P.experience.flatMap((e) => [
          { t: "out" as const, content: `▸ ${e.title} — ${e.org}`, color: "accent" as const },
          { t: "out" as const, content: `  ${e.period} · ${e.location} · ${e.tenure}`, muted: true },
          ...e.bullets.map((b) => ({ t: "out" as const, content: `  · ${b}` })),
          { t: "out" as const, content: `  [${e.skills.join(" · ")}]`, muted: true },
          { t: "out" as const, content: "" },
        ]),
      ],
      education: () => [
        ...printRule("education"),
        { t: "out", content: `▸ ${P.education.school}`, color: "accent" },
        { t: "out", content: `  ${P.education.degree}`, muted: true },
        { t: "out", content: `  ${P.education.period} · ${P.education.location}`, muted: true },
        { t: "out", content: "" },
        { t: "out", content: "coursework:", color: "accent" },
        ...P.education.coursework.map((cc) => ({
          t: "out" as const,
          content: `  ✓ ${cc}`,
          color: "green" as const,
        })),
        { t: "out", content: "" },
        ...printRule("systems · stack"),
        ...Object.entries(P.skills).map(([k, v]) => ({
          t: "out" as const,
          content: `${k.padEnd(12)} ${v.join(" · ")}`,
        })),
      ],
      skills: () => [
        ...printRule("skills"),
        ...Object.entries(P.skills).flatMap(([k, v]) => [
          { t: "out" as const, content: `${k.padEnd(12)} ${v.join(" · ")}` },
        ]),
      ],
      now: () => [
        ...printRule("now · currently shipping"),
        ...P.now.map((n, i) => ({
          t: "out" as const,
          content: `[${String(i + 1).padStart(2, "0")}] ${n.where.padEnd(22)} ${n.what}`,
        })),
      ],
      notes: () => [
        ...printRule("notes · writing"),
        ...P.notes.flatMap((n) => {
          const rows: Line[] = [
            {
              t: "out" as const,
              content: `▸ ${n.date} · #${n.tag} · ${n.read}`,
              color: "accent" as const,
            },
            {
              t: "out" as const,
              content: `  ${n.title}`,
            },
          ];
          if (n.description) {
            rows.push({
              t: "out" as const,
              content: `  ${n.description}`,
              muted: true,
            });
          }
          if (n.url) {
            rows.push({
              t: "out" as const,
              content: `  ↗ ${n.url.replace(/^https?:\/\//, "")}`,
              color: "blue" as const,
            });
          }
          rows.push({ t: "out" as const, content: "" });
          return rows;
        }),
      ],
      cv: () => [
        ...printRule("cv · gray marshall"),
        { t: "out", content: `${P.name} — ${P.role}` },
        { t: "out", content: `${P.location} · ${P.status}`, muted: true },
        { t: "out", content: "" },
        { t: "out", content: "EXPERIENCE", color: "accent" },
        ...P.experience.flatMap((e) => [
          { t: "out" as const, content: `  ${e.title} — ${e.org}` },
          { t: "out" as const, content: `    ${e.period} · ${e.location}`, muted: true },
          ...e.bullets.map((b) => ({ t: "out" as const, content: `    - ${b}` })),
          { t: "out" as const, content: "" },
        ]),
        { t: "out", content: "EDUCATION", color: "accent" },
        { t: "out", content: `  ${P.education.school}` },
        { t: "out", content: `    ${P.education.degree}`, muted: true },
        { t: "out", content: `    ${P.education.period}`, muted: true },
      ],
      contact: () => [
        ...printRule("contact"),
        { t: "out", content: `email    ${P.email}`, color: "accent" },
        { t: "out", content: `github   ${P.github}`, color: "blue" },
        { t: "out", content: `linkedin ${P.linkedin}`, color: "blue" },
        { t: "out", content: `location ${P.location}`, muted: true },
      ],
      theme: () => {
        toggleTheme();
        return [
          {
            t: "out",
            content: `theme → ${theme === "dark" ? "light" : "dark"}`,
            color: "accent",
          },
        ];
      },
      resume: () => {
        if (typeof window !== "undefined") {
          void (async () => {
            try {
              const res = await fetch("/resume.pdf", {
                method: "HEAD",
                cache: "no-store",
              });
              const type = res.headers.get("content-type") ?? "";
              if (res.ok && type.includes("pdf")) {
                const a = document.createElement("a");
                a.href = "/resume.pdf";
                a.download = "gray-marshall-resume.pdf";
                document.body.appendChild(a);
                a.click();
                a.remove();
                setHistory((h) => [
                  ...h,
                  { t: "out", content: "→ /resume.pdf", color: "blue" },
                  {
                    t: "out",
                    content: "check your browser downloads.",
                    muted: true,
                  },
                ]);
                return;
              }
            } catch {
              // fall through to missing-file branch
            }
            setHistory((h) => [
              ...h,
              {
                t: "out",
                content: "curl: (22) /resume.pdf returned 404",
                color: "red",
              },
              {
                t: "out",
                content: `resume.pdf isn't posted yet — email ${PORTFOLIO.email} for a copy.`,
                muted: true,
              },
              {
                t: "out",
                content: "hint: `open email` drafts a message.",
                muted: true,
              },
            ]);
          })();
        }
        return [
          { t: "out", content: "fetching resume.pdf ...", color: "accent" },
        ];
      },
      ls: (arg) => {
        const flag = (arg ?? "").trim();
        const files = Object.keys(VFS).sort();
        if (flag.startsWith("-l") || flag.startsWith("-la")) {
          return files.map((f) => ({
            t: "out" as const,
            content: `-rw-r--r--  1 gray  staff  ${String(
              VFS[f].join("\n").length,
            ).padStart(5)}  ${f}`,
          }));
        }
        return [{ t: "out", content: files.join("  ") }];
      },
      cat: (arg) => {
        if (!arg) {
          return [
            {
              t: "out",
              content: "cat: missing file operand",
              color: "red",
            },
            {
              t: "out",
              content: `try: ls  (files: ${Object.keys(VFS).join(", ")})`,
              muted: true,
            },
          ];
        }
        const [srcRaw, ...pipeParts] = arg.split("|").map((s) => s.trim());
        const src = srcRaw.replace(/^~\//, "").replace(/^\.\//, "");
        const needle = src.toLowerCase();
        const key = Object.keys(VFS).find(
          (k) => k.toLowerCase() === needle,
        );
        const lookup = key ? VFS[key] : undefined;
        if (!lookup) {
          return [
            {
              t: "out",
              content: `cat: ${srcRaw}: No such file or directory`,
              color: "red",
            },
          ];
        }
        let lines: string[] = [...lookup];
        for (const part of pipeParts) {
          const tokens = part.split(/\s+/);
          const op = tokens[0]?.toLowerCase();
          const flag = (tokens[1] ?? "").toLowerCase();
          if (op === "head") {
            const n = Math.max(0, parseInt(flag.replace(/^-/, ""), 10) || 10);
            lines = lines.slice(0, n);
          } else if (op === "tail") {
            const n = Math.max(0, parseInt(flag.replace(/^-/, ""), 10) || 10);
            lines = lines.slice(-n);
          } else if (op === "wc" && flag === "-l") {
            lines = [String(lines.length)];
          } else if (op) {
            return [
              {
                t: "out",
                content: `zsh: no such pipe target: ${op}`,
                color: "red",
              },
            ];
          }
        }
        return lines.map((line) => ({ t: "out" as const, content: line }));
      },
      systemctl: (arg) => {
        const subcmd =
          (arg ?? "").trim().split(/\s+/)[0]?.toLowerCase() || "status";
        if (subcmd === "status") {
          return [
            {
              t: "out",
              content: "● gray.service — loaded, active (running)",
              color: "green",
            },
            ...P.now.slice(0, 2).map((n, idx) => ({
              t: "out" as const,
              content: `  ${idx === 0 ? "shipping" : "also    "}: ${n.what} (${n.where})`,
              muted: true,
            })),
            {
              t: "out",
              content: `  ${P.status.toLowerCase()}`,
              color: "accent",
            },
          ];
        }
        if (subcmd === "list-units") {
          return [
            { t: "out", content: "UNIT                     LOAD   ACTIVE" },
            {
              t: "out",
              content: "gray.service             loaded active",
              color: "green",
            },
            {
              t: "out",
              content: "telemetry.service        loaded active",
              color: "green",
            },
            {
              t: "out",
              content: "lsr.service              loaded active",
              color: "green",
            },
          ];
        }
        return [
          {
            t: "out",
            content: `systemctl: unknown subcommand: ${subcmd}`,
            color: "red",
          },
          {
            t: "out",
            content: "usage: systemctl status | systemctl list-units",
            muted: true,
          },
        ];
      },
      echo: (arg) => [{ t: "out", content: arg ?? "" }],
      date: () => [
        {
          t: "out",
          content: new Date().toLocaleString("en-US", {
            timeZone: "America/Chicago",
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            timeZoneName: "short",
          }),
        },
      ],
      pwd: () => [{ t: "out", content: "/home/gray" }],
      history: () => {
        if (cmdHistory.length === 0)
          return [{ t: "out", content: "(no commands yet)", muted: true }];
        return [...cmdHistory].reverse().map((cmd, i) => ({
          t: "out" as const,
          content: `  ${String(i + 1).padStart(4)}  ${cmd}`,
        }));
      },
      uname: (arg) => {
        const flag = (arg ?? "").trim().toLowerCase();
        if (flag === "-a" || flag === "--all") {
          return [
            {
              t: "out",
              content:
                "portfolio 3.0.0 gray@austin #1 SMP Next.js 16.2 React 19 x86_64 editorial/terminal",
            },
          ];
        }
        return [{ t: "out", content: "portfolio" }];
      },
      uptime: () => {
        const start = new Date("2024-08-26T00:00:00-05:00");
        const now = new Date();
        const diffDays = Math.max(
          0,
          Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
        );
        const years = Math.floor(diffDays / 365);
        const remainAfterYears = diffDays - years * 365;
        const months = Math.floor(remainAfterYears / 30);
        const days = remainAfterYears - months * 30;
        const parts: string[] = [];
        if (years) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
        if (months) parts.push(`${months} month${months !== 1 ? "s" : ""}`);
        if (days || parts.length === 0)
          parts.push(`${days} day${days !== 1 ? "s" : ""}`);
        return [
          {
            t: "out",
            content: `up ${parts.join(", ")} (since Aug 26 2024 · UT Austin)`,
          },
        ];
      },
      stack: () => {
        const entries = Object.entries(P.skills);
        const max = Math.max(...entries.map(([, v]) => v.length));
        const barWidth = 18;
        return [
          ...printRule("stack"),
          ...entries.map(([k, v]) => {
            const filled = Math.max(1, Math.round((v.length / max) * barWidth));
            const bar = "█".repeat(filled) + "░".repeat(barWidth - filled);
            const preview =
              v.slice(0, 3).join(" · ") +
              (v.length > 3 ? ` · +${v.length - 3}` : "");
            return {
              t: "out" as const,
              content: `${k.padEnd(12)} ${bar}  ${preview}`,
            };
          }),
        ];
      },
      neofetch: () => {
        const ascii = [
          "   ██████╗   ███╗   ███╗",
          "   ██╔═══╝   ████╗ ████║",
          "   ██║  ██╗  ██╔████╔██║",
          "   ██║  ╚██╗ ██║╚██╔╝██║",
          "   ╚██████╔╝ ██║ ╚═╝ ██║",
          "    ╚═════╝  ╚═╝     ╚═╝",
        ];
        const start = new Date("2024-08-26T00:00:00-05:00");
        const now = new Date();
        const days = Math.max(
          0,
          Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
        );
        const host =
          typeof window !== "undefined" ? window.location.host : "vercel.app";
        const res =
          typeof window !== "undefined"
            ? `${window.innerWidth}x${window.innerHeight}`
            : "responsive";
        const info: string[] = [
          `${P.name.toLowerCase().replace(/ /g, "")}@austin`,
          "───────────────────────────",
          `OS ········· portfolio v3 (next.js 16.2)`,
          `Host ······· ${host}`,
          `Kernel ····· react 19 / tailwind v4`,
          `Shell ······ portfolio-zsh`,
          `Uptime ····· ${days} days (since Aug 2024)`,
          `Resolution · ${res}`,
          `Theme ······ ${theme}`,
          `Stack ······ ${P.skills.Languages.slice(0, 3).join(" · ")}`,
          `Role ······· ${P.role}`,
          `Status ····· ${P.status}`,
        ];
        const rows = Math.max(ascii.length, info.length);
        const out: Line[] = [];
        for (let i = 0; i < rows; i++) {
          const left = (ascii[i] ?? "").padEnd(26);
          const right = info[i] ?? "";
          out.push({
            t: "out",
            content: `${left}  ${right}`,
            color: i < ascii.length ? "accent" : undefined,
          });
        }
        return out;
      },
      open: (arg) => {
        if (!arg) {
          return [
            {
              t: "out",
              content: "open: missing target",
              color: "red",
            },
            {
              t: "out",
              content:
                "targets: github · linkedin · email · site · tui · resume · <project-slug>",
              muted: true,
            },
          ];
        }
        const target = arg.trim().toLowerCase();
        const slugs = [
          ...P.featured.map((p) => p.slug),
          ...P.projects
            .map((p) => p.slug)
            .filter((s): s is string => Boolean(s)),
        ];
        if (slugs.includes(target)) {
          router.push(`/projects/${target}`);
          return [
            { t: "out", content: `→ /projects/${target}`, color: "blue" },
          ];
        }
        const map: Record<string, string> = {
          github: `https://${P.github}`,
          gh: `https://${P.github}`,
          linkedin: `https://${P.linkedin}`,
          li: `https://${P.linkedin}`,
          email: `mailto:${P.email}`,
          mail: `mailto:${P.email}`,
          site: "/",
          home: "/",
          editorial: "/",
          tui: "/tui",
          terminal: "/tui",
          resume: "/resume.pdf",
          cv: "/resume.pdf",
        };
        const url = map[target];
        if (!url) {
          return [
            {
              t: "out",
              content: `open: unknown target: ${target}`,
              color: "red",
            },
          ];
        }
        if (typeof window !== "undefined") {
          if (url.startsWith("/")) router.push(url);
          else if (url.startsWith("mailto:")) window.location.href = url;
          else window.open(url, "_blank", "noreferrer");
        }
        return [{ t: "out", content: `→ ${url}`, color: "blue" }];
      },
      goto: (arg) => {
        const slugs = [
          ...P.featured.map((p) => p.slug),
          ...P.projects
            .map((p) => p.slug)
            .filter((s): s is string => Boolean(s)),
        ];
        if (!arg) {
          return [
            {
              t: "out",
              content: `goto: missing project slug (${slugs.join(", ")})`,
              color: "red",
            },
          ];
        }
        const slug = arg.trim().toLowerCase();
        if (!slugs.includes(slug)) {
          return [
            { t: "out", content: `goto: no such project: ${slug}`, color: "red" },
          ];
        }
        router.push(`/projects/${slug}`);
        return [{ t: "out", content: `→ /projects/${slug}`, color: "blue" }];
      },
      exit: () => {
        router.push("/");
        return [{ t: "out", content: "goodbye.", muted: true }];
      },
      logout: () => {
        router.push("/");
        return [{ t: "out", content: "logout", muted: true }];
      },
      which: (arg) => {
        if (!arg)
          return [
            {
              t: "out",
              content: "which: usage: which <command>",
              color: "red",
            },
          ];
        const cmd = arg.trim().toLowerCase().split(/\s+/)[0];
        if (COMMAND_NAMES.includes(cmd)) {
          return [{ t: "out", content: `/usr/local/bin/${cmd}` }];
        }
        return [
          {
            t: "out",
            content: `which: no ${cmd} in (/usr/local/bin:/usr/bin:/bin)`,
            color: "red",
          },
        ];
      },
      man: (arg) => {
        if (!arg)
          return [
            { t: "out", content: "What manual page do you want?" },
            { t: "out", content: "try: man help", muted: true },
          ];
        const cmd = arg.trim().toLowerCase();
        const pages: Record<string, string[]> = {
          help: [
            "HELP(1)                  Portfolio Manual",
            "",
            "NAME",
            "    help — list every command, grouped.",
            "",
            "DESCRIPTION",
            "    Prints the full command set, split into content, shell, nav, and fun.",
            "    All commands are case-insensitive.",
          ],
          work: [
            "WORK(1)                  Portfolio Manual",
            "",
            "NAME",
            "    work — list the featured projects.",
            "",
            "DESCRIPTION",
            `    Prints ${P.featured
              .map((p) => p.title)
              .join(
                ", ",
              )} with status, stack, and live links.`,
            "    For a deep dive on one: case <slug>.",
          ],
          projects: [
            "PROJECTS(1)              Portfolio Manual",
            "",
            "NAME",
            "    projects — full project index.",
            "",
            "DESCRIPTION",
            "    Prints FEATURED and ARCHIVE sections with year + title per row.",
          ],
          case: [
            "CASE(1)                  Portfolio Manual",
            "",
            "NAME",
            "    case — deep dive on one project.",
            "",
            "SYNOPSIS",
            "    case <slug>",
            "",
            "SLUGS",
            `    ${[
              ...P.featured.map((p) => p.slug),
              ...P.projects
                .map((p) => p.slug)
                .filter((s): s is string => Boolean(s)),
            ].join(" · ")}`,
          ],
          cv: [
            "CV(1)                    Portfolio Manual",
            "",
            "NAME",
            "    cv — resume-formatted experience + education.",
          ],
          resume: [
            "RESUME(1)                Portfolio Manual",
            "",
            "NAME",
            "    resume — fetch the resume PDF.",
            "",
            "DESCRIPTION",
            "    HEAD-probes /resume.pdf. If the file is live, downloads it as",
            "    gray-marshall-resume.pdf. If it's missing (common — the PDF isn't",
            "    always posted), prints a 404 line and points you at `open email`.",
          ],
          open: [
            "OPEN(1)                  Portfolio Manual",
            "",
            "NAME",
            "    open — navigate to a named target.",
            "",
            "SYNOPSIS",
            "    open <target>",
            "",
            "TARGETS",
            "    github · linkedin · email · site · tui · resume · <project-slug>",
          ],
          goto: [
            "GOTO(1)                  Portfolio Manual",
            "",
            "NAME",
            "    goto — client-side navigate to a project detail page.",
            "",
            "SYNOPSIS",
            "    goto <slug>",
          ],
          cat: [
            "CAT(1)                   Portfolio Manual",
            "",
            "NAME",
            "    cat — print the contents of a virtual file.",
            "",
            "SYNOPSIS",
            "    cat <file> [| head -N | tail -N | wc -l]",
            "",
            "FILES",
            "    ls to see what's available.",
          ],
          ls: [
            "LS(1)                    Portfolio Manual",
            "",
            "NAME",
            "    ls — list virtual filesystem entries.",
            "",
            "SYNOPSIS",
            "    ls [-l | -la]",
          ],
          echo: [
            "ECHO(1)                  Portfolio Manual",
            "",
            "NAME",
            "    echo — print arguments to stdout.",
          ],
          neofetch: [
            "NEOFETCH(1)              Portfolio Manual",
            "",
            "NAME",
            "    neofetch — ASCII banner + system info.",
          ],
          theme: [
            "THEME(1)                 Portfolio Manual",
            "",
            "NAME",
            "    theme — toggle between light and dark.",
          ],
          exit: [
            "EXIT(1)                  Portfolio Manual",
            "",
            "NAME",
            "    exit — leave the TUI and return to the editorial site.",
          ],
        };
        const page = pages[cmd];
        if (page) return page.map((line) => ({ t: "out" as const, content: line }));
        if (COMMAND_NAMES.includes(cmd)) {
          return [
            {
              t: "out",
              content: `${cmd.toUpperCase()}(1)`,
              color: "accent",
            },
            {
              t: "out",
              content: `no detailed page yet — try 'help' for the one-liner`,
              muted: true,
            },
          ];
        }
        return [
          { t: "out", content: `No manual entry for ${cmd}`, color: "red" },
        ];
      },
      fortune: () => {
        const quotes = [
          P.tagline,
          P.about[0],
          "I optimize for tight feedback loops, clear abstractions, and durable software that ships fast and performs under pressure.",
          "Ship small, ship often.",
          "There are only two hard things: naming things, cache invalidation, and off-by-one errors.",
          "Always tired, never done.",
          "Code is cheap; correctness is expensive.",
          "The best error message is the one that never shows up.",
          "Move fast with stable infrastructure.",
          "Make it work, make it right, make it fast — in that order.",
        ];
        return [
          {
            t: "out",
            content: quotes[Math.floor(Math.random() * quotes.length)],
            color: "accent",
          },
        ];
      },
      cowsay: (arg) => {
        const text = (arg ?? "Moo.").trim() || "Moo.";
        const top = " " + "_".repeat(text.length + 2);
        const mid = `< ${text} >`;
        const bot = " " + "-".repeat(text.length + 2);
        return [
          { t: "out", content: top },
          { t: "out", content: mid },
          { t: "out", content: bot },
          { t: "out", content: "        \\   ^__^" },
          { t: "out", content: "         \\  (oo)\\_______" },
          { t: "out", content: "            (__)\\       )\\/\\" },
          { t: "out", content: "                ||----w |" },
          { t: "out", content: "                ||     ||" },
        ];
      },
      sl: () => {
        const train = [
          "      ====        ________                ___________",
          "  _D _|  |_______/        \\__I_I_____===__|_________|",
          "   |(_)---  |   H\\________/ |   |        =|___ ___|  ",
          "   /     |  |   H  |  |     |   |         ||_| |_||  ",
          "  |      |  |   H  |__--------------------| [___] |  ",
          "  | ________|___H__/__|_____/[][]~\\_______|       |  ",
          "  |/ |   |-----------I_____I [][] []  D   |=======|__",
          "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__",
          " |/-=|___|=    ||    ||    ||    |_____/~\\___/        ",
          "  \\_/      \\O=====O=====O=====O_/      \\_/            ",
        ];
        return train.map((l) => ({ t: "out" as const, content: l, color: "accent" as const }));
      },
      sudo: (arg) => [
        {
          t: "out",
          content: `gray is not in the sudoers file. This incident will be reported.${arg ? ` (attempted: ${arg})` : ""}`,
          color: "red",
        },
      ],
      rm: (arg) => {
        const a = (arg ?? "").trim();
        if (/-[rR]f/.test(a) && (a.endsWith("/") || a.includes(" /"))) {
          return [
            { t: "out", content: "nice try.", color: "accent" },
            {
              t: "out",
              content: "this shell is write-protected by laziness.",
              muted: true,
            },
          ];
        }
        return [
          {
            t: "out",
            content: "rm: operation not permitted in this shell",
            color: "red",
          },
        ];
      },
      mkdir: (arg) => {
        const name = (arg ?? "").trim();
        if (!name) {
          return [
            { t: "out", content: "mkdir: missing operand", color: "red" },
          ];
        }
        const quips = [
          `mkdir: ${name}: not today — you already have enough side projects.`,
          `mkdir: ${name}: starting new projects is how you avoid finishing old ones.`,
          `mkdir: ${name}: the filesystem is a carefully curated illusion.`,
          `mkdir: ${name}: permission denied. too busy shipping.`,
          `mkdir: ${name}: yes chef. … just kidding, no.`,
        ];
        return [
          {
            t: "out",
            content: quips[Math.floor(Math.random() * quips.length)],
            color: "red",
          },
          { t: "out", content: "(try `ls` to see what already exists.)", muted: true },
        ];
      },
      clear: () => "CLEAR",
    }),
    [P, VFS, theme, toggleTheme, cmdHistory, router],
  );

  const runCmd = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed) setCmdHistory((h) => [trimmed, ...h].slice(0, 50));
    setHistIdx(-1);
    setHistory((h) => [...h, { t: "cmd", content: raw }]);
    if (!trimmed) return;

    const [headRaw, ...rest] = trimmed.split(/\s+/);
    const head = headRaw.toLowerCase();
    const arg = rest.join(" ");
    const fn = commands[head];
    if (!fn) {
      setHistory((h) => [
        ...h,
        { t: "out", content: `zsh: command not found: ${head}`, color: "red" },
      ]);
      return;
    }
    const result = fn(arg);
    if (result === "CLEAR") {
      setHistory([]);
      return;
    }
    setHistory((h) => [...h, ...result, { t: "out", content: "" }]);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    runCmd(input);
    setInput("");
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length) {
        const next = Math.min(histIdx + 1, cmdHistory.length - 1);
        setHistIdx(next);
        setInput(cmdHistory[next] ?? "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : cmdHistory[next] ?? "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const v = input.trim().toLowerCase();
      if (!v) return;
      const matches = COMMAND_NAMES.filter((n) => n.startsWith(v));
      if (matches.length === 1) setInput(matches[0]);
      else if (matches.length > 1) {
        setHistory((h) => [
          ...h,
          { t: "cmd", content: input },
          { t: "out", content: matches.join("  "), muted: true },
        ]);
      }
    } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setHistory([]);
    }
  };

  const lineColor = (l: Line): string => {
    if (l.color === "accent") return c.accent;
    if (l.color === "green") return c.green;
    if (l.color === "red") return "#ff5555";
    if (l.color === "blue") return c.blue;
    if (l.t === "rule") return c.sub;
    if (l.muted) return c.sub;
    return c.ink;
  };

  const rootStyle: CSSProperties = {
    background: c.bg,
    color: c.ink,
    fontFamily: mono,
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div style={rootStyle}>
      <style>{`
        @keyframes o2-cursor { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }
        .o2-cursor { animation: o2-cursor 1s step-end infinite; display: inline-block; width: 8px; height: 14px; vertical-align: middle; margin-left: 2px; }
        .tui-slash { cursor: pointer; transition: color .15s ease; background: none; border: none; padding: 0; font: inherit; white-space: nowrap; }
        .tui-slash:hover { color: ${c.ink}; }

        .tui-header {
          position: sticky; top: 0; z-index: 40;
          background: ${c.panel};
          border-bottom: 1px solid ${c.rule};
          font-size: 11px; letter-spacing: .3px;
          flex-shrink: 0;
          display: flex; flex-direction: column;
        }
        .tui-header-row {
          display: flex; align-items: center; gap: 16px;
          padding: 10px 16px;
        }
        .tui-prompt {
          font-weight: 700; letter-spacing: 1.5px; white-space: nowrap;
        }
        .tui-slash-strip {
          display: flex; align-items: center; gap: 14px;
          color: ${c.sub};
          overflow-x: auto; overflow-y: hidden;
          scrollbar-width: none;
          flex: 1; min-width: 0;
        }
        .tui-slash-strip::-webkit-scrollbar { display: none; }
        .tui-meta {
          display: flex; align-items: center; gap: 14px;
          color: ${c.sub}; white-space: nowrap; margin-left: auto;
        }
        .tui-meta-chip { display: inline-flex; align-items: center; gap: 4px; }

        /* Mobile: split header into two rows — prompt + meta on top,
           slash nav below in a horizontally-scrolling strip. */
        @media (max-width: 720px) {
          .tui-header-row { padding: 8px 12px; gap: 10px; }
          .tui-header-row--primary { justify-content: space-between; }
          .tui-header-row--primary .tui-slash-strip { display: none; }
          .tui-header-row--nav {
            border-top: 1px dashed ${c.rule};
            padding: 8px 12px;
          }
          .tui-meta { gap: 10px; }
          .tui-meta-long { display: none; }
          .tui-slash-strip { gap: 12px; }
        }
        @media (min-width: 721px) {
          .tui-header-row--nav { display: none; }
        }
      `}</style>

      {/* Top bar — preserved terminal chrome, pinned so it never scrolls away.
          Mobile (≤720px) stacks into two rows: prompt + meta on top, slash nav
          below in a horizontally-scrolling strip. */}
      <header className="tui-header">
        <div className="tui-header-row tui-header-row--primary">
          <div className="tui-prompt">
            <span style={{ color: c.accent }}>$</span>&nbsp;gray@austin:
            <span style={{ color: c.blue }}>~</span>
          </div>
          <div className="tui-slash-strip">
            {SLASH_NAV.map((item) => (
              <button
                key={item.cmd}
                onClick={() => runCmd(item.cmd)}
                className="tui-slash"
                style={{ color: c.sub }}
              >
                <span style={{ color: c.accent }}>/</span>
                {item.label}
              </button>
            ))}
          </div>
          <div className="tui-meta">
            <span className="tui-meta-chip tui-meta-long">
              status:&nbsp;<span style={{ color: c.green }}>available</span>
            </span>
            <span className="tui-meta-chip tui-meta-long">tz: CST</span>
            {temp !== null && (
              <span className="tui-meta-chip tui-meta-long">
                aus&nbsp;{temp}°F
              </span>
            )}
            <ModeControls palette="terminal" />
          </div>
        </div>
        <div className="tui-header-row tui-header-row--nav">
          <div className="tui-slash-strip">
            {SLASH_NAV.map((item) => (
              <button
                key={`m-${item.cmd}`}
                onClick={() => runCmd(item.cmd)}
                className="tui-slash"
                style={{ color: c.sub }}
              >
                <span style={{ color: c.accent }}>/</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Full-height TUI — scrolls internally; header stays pinned above it */}
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          padding: "18px 20px 24px",
          fontSize: 13,
          lineHeight: 1.55,
          cursor: "text",
        }}
      >
        {history.map((l, i) => (
          <div
            key={i}
            style={{
              color: lineColor(l),
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {l.t === "cmd" ? (
              <>
                <span style={{ color: c.green }}>gray@austin</span>
                <span style={{ color: c.sub }}>:</span>
                <span style={{ color: c.blue }}>~</span>
                <span style={{ color: c.accent }}>$</span> {l.content}
              </>
            ) : (
              l.content
            )}
          </div>
        ))}
        {booted && (
          <form
            onSubmit={onSubmit}
            style={{ display: "flex", alignItems: "center", marginTop: 4 }}
            onClick={() => inputRef.current?.focus()}
          >
            <span style={{ color: c.green }}>gray@austin</span>
            <span style={{ color: c.sub }}>:</span>
            <span style={{ color: c.blue }}>~</span>
            <span style={{ color: c.accent, marginRight: 6 }}>$</span>
            <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                autoFocus
                spellCheck={false}
                autoComplete="off"
                style={{
                  width: `${Math.max(inputWidth, 1)}px`,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: c.ink,
                  fontFamily: mono,
                  fontSize: 13,
                  lineHeight: 1.55,
                  padding: 0,
                  margin: 0,
                  caretColor: "transparent",
                }}
              />
              <span
                aria-hidden
                ref={measureRef}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  visibility: "hidden",
                  whiteSpace: "pre",
                  fontFamily: mono,
                  fontSize: 13,
                  lineHeight: 1.55,
                  pointerEvents: "none",
                }}
              >
                {input || " "}
              </span>
              <span
                aria-hidden
                className="o2-cursor"
                style={{ background: c.accent, marginLeft: 0 }}
              />
            </span>
          </form>
        )}
      </div>
    </div>
  );
}
