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
  "help",
  "whoami",
  "about",
  "work",
  "projects",
  "case",
  "experience",
  "education",
  "skills",
  "now",
  "notes",
  "cv",
  "contact",
  "resume",
  "cat",
  "ls",
  "systemctl",
  "clear",
  "theme",
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
        content:
          "commands: work · projects · case <slug> · experience · education · skills · now · notes · cv · contact · about · whoami · resume · ls · cat · systemctl · help · theme · clear",
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
        {
          t: "out",
          content:
            "  work         — featured projects",
          color: "accent",
        },
        {
          t: "out",
          content: "  projects     — full project index (incl. archived)",
          color: "accent",
        },
        {
          t: "out",
          content: "  case <slug>  — deep dive on one project",
          color: "accent",
        },
        { t: "out", content: "  experience   — roles & tenures", color: "accent" },
        { t: "out", content: "  education    — school & coursework", color: "accent" },
        { t: "out", content: "  skills       — stack by category", color: "accent" },
        { t: "out", content: "  now          — currently shipping", color: "accent" },
        { t: "out", content: "  notes        — writing", color: "accent" },
        { t: "out", content: "  cv           — experience + education", color: "accent" },
        { t: "out", content: "  contact      — how to reach me", color: "accent" },
        { t: "out", content: "  about        — longer introduction", color: "accent" },
        { t: "out", content: "  whoami       — one-liner", color: "accent" },
        { t: "out", content: "  resume       — download resume.pdf", color: "accent" },
        { t: "out", content: "" },
        { t: "out", content: "shell:", muted: true },
        { t: "out", content: "  ls [-l]      — list virtual files", muted: true },
        { t: "out", content: "  cat <file>   — print file (supports | head -N)", muted: true },
        { t: "out", content: "  systemctl    — status · list-units", muted: true },
        { t: "out", content: "  theme        — toggle light/dark", muted: true },
        { t: "out", content: "  clear        — wipe screen", muted: true },
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
        if (!arg) {
          return [
            {
              t: "out",
              content:
                "usage: case <slug>  (slugs: lsr, fsae, dash, personal-website-v3, agentworkspaces)",
              color: "red",
            },
          ];
        }
        const slug = arg.trim().toLowerCase();
        const pool = [
          ...P.featured,
          ...P.projects.filter(
            (p): p is typeof p & { slug: string } => Boolean(p.slug),
          ),
        ];
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
        ...P.notes.map((n) => ({
          t: "out" as const,
          content: `  ${n.date.padEnd(10)} #${n.tag.padEnd(8)} ${n.title}  (${n.read})`,
        })),
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
          const a = document.createElement("a");
          a.href = "/resume.pdf";
          a.download = "gray-marshall-resume.pdf";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        return [
          { t: "out", content: "fetching resume.pdf ...", color: "accent" },
          { t: "out", content: "→ /resume.pdf", color: "blue" },
          { t: "out", content: "check your browser downloads.", muted: true },
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
        const lookup = VFS[src] ?? VFS[`~/${src}`] ?? VFS[srcRaw];
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
          const flag = tokens[1] ?? "";
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
        const subcmd = (arg ?? "").trim().split(/\s+/)[0] || "status";
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
      clear: () => "CLEAR",
    }),
    [P, VFS, theme, toggleTheme],
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
        .tui-slash { cursor: pointer; transition: color .15s ease; background: none; border: none; padding: 0; font: inherit; }
        .tui-slash:hover { color: ${c.ink}; }
      `}</style>

      {/* Top bar — preserved terminal chrome, pinned so it never scrolls away */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          borderBottom: `1px solid ${c.rule}`,
          background: c.panel,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          fontSize: 11,
          letterSpacing: 0.3,
          flexWrap: "wrap",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 20,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontWeight: 700, letterSpacing: 1.5 }}>
            <span style={{ color: c.accent }}>$</span>&nbsp;gray@austin:
            <span style={{ color: c.blue }}>~</span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 14,
              color: c.sub,
              flexWrap: "wrap",
            }}
          >
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
        </div>
        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "center",
            color: c.sub,
            flexWrap: "wrap",
          }}
        >
          <span>
            status: <span style={{ color: c.green }}>available</span>
          </span>
          <span>tz: CST</span>
          {temp !== null && <span>aus: {temp}°F</span>}
          <ModeControls palette="terminal" />
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
