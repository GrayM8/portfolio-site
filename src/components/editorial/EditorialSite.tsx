"use client";

import { Fragment, useEffect, useState, type ElementType } from "react";
import Link from "next/link";
import { Github } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PORTFOLIO, type FeaturedProject, type Note } from "@/data/portfolio";
import { useGithubActivity } from "@/lib/github";
import { useAustinTemp } from "@/lib/weather";
import { useModeTheme } from "../ModeThemeProvider";
import { paletteFor, paletteToVars, type Palette } from "./palette";

const WRAP = "mx-auto w-full max-w-[1440px]";
const PAD = "px-5 sm:px-8 md:px-10 lg:px-12";

type NavId = "about" | "work" | "now" | "experience" | "notes" | "contact";

const NAV_ITEMS: ReadonlyArray<{ id: NavId; label: string }> = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "now", label: "Now" },
  { id: "experience", label: "Experience" },
  { id: "notes", label: "Notes" },
  { id: "contact", label: "Contact" },
];

export function EditorialSite() {
  const { theme } = useModeTheme();
  const c = paletteFor(theme);
  const P = PORTFOLIO;
  const [active, setActive] = useState<NavId>(NAV_ITEMS[0].id);
  const [today, setToday] = useState<Date | null>(null);
  const temp = useAustinTemp();

  useEffect(() => setToday(new Date()), []);

  const mastheadDate = today
    ? today.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;
  const nowSub = today
    ? `As of ${today.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`
    : "";
  const currentYear = today ? today.getFullYear() : 2026;

  useEffect(() => {
    const threshold = 96;
    let raf = 0;
    const handle = () => {
      raf = 0;
      let current: NavId = NAV_ITEMS[0].id;
      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) current = id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(handle);
    };
    handle();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const cssVars = paletteToVars(c);

  return (
    <div
      style={cssVars}
      className="min-h-full bg-[color:var(--bg)] text-[color:var(--ink)] font-sans text-[14px] leading-[1.55]"
    >
      <style>{`
        .o3-link { color: inherit; text-decoration: none; position: relative; padding-bottom: 3px; display: inline-block; }
        .o3-link::after { content:''; position:absolute; left:0; right:0; bottom:0; height:1px; background:currentColor; transform: scaleX(0); transform-origin: right; transition: transform .25s ease; }
        .o3-link:hover::after,
        .o3-link[data-active="true"]::after { transform: scaleX(1); transform-origin: left; }
        .o3-link:hover,
        .o3-link[data-active="true"] { color: var(--accent); }
        .o3-feat:hover .o3-img { transform: scale(1.02); }
        .o3-feat:hover .o3-title { color: var(--accent); }
        .o3-img { transition: transform .5s ease; }
        .o3-title { transition: color .2s; }
        .o3-row:hover { background: var(--soft); }
        .o3-row:hover .o3-t { color: var(--accent); }
        .o3-t { transition: color .15s; }
        @keyframes o3-blip { 0%,100% { opacity: 0.3 } 50% { opacity: 1 } }
        .o3-blip { animation: o3-blip 1.8s ease-in-out infinite; }
        @keyframes o3-pulse { 0%,100% { transform: scale(1); opacity: 0.65 } 50% { transform: scale(1.8); opacity: 0 } }
        .o3-pulse { transform-origin: center; transform-box: fill-box; animation: o3-pulse 1.8s ease-out infinite; }
        .o3-kicker { font-family: var(--font-mono); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--sub); }
        .o3-tile { transition: border-color .2s ease, transform .2s ease; }
        .o3-tile:hover { border-color: var(--accent); }
        .o3-tile:hover .o3-tile-title { color: var(--accent); }
        .o3-tile:hover .o3-tile-img { transform: translateY(-50%) rotateX(50deg) rotateZ(20deg) scale(2.35); }
        .o3-tile-img { transition: transform .6s ease; transform: translateY(-50%) rotateX(50deg) rotateZ(20deg) scale(2.2); }
        .o3-tile-title { transition: color .2s ease; }
      `}</style>

      {/* MASTHEAD */}
      <header
        className={`border-b border-[color:var(--ink)] bg-[color:var(--bg)]`}
      >
        <div
          className={`${WRAP} ${PAD} py-3 md:py-3.5 grid grid-cols-[auto_1fr] md:grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-6`}
        >
          <div className="hidden md:block font-mono text-[10px] tracking-widest uppercase text-[color:var(--sub)]">
            Vol. 03 · Issue 01{mastheadDate ? ` · ${mastheadDate}` : ""}
          </div>
          <div className="font-serif text-[18px] sm:text-[20px] md:text-[22px] font-medium tracking-[0.12em] md:tracking-[0.18em] whitespace-nowrap text-left md:text-center">
            <span style={{ color: c.accent }}>G.</span>MARSHALL{" "}
            <span className="text-[color:var(--sub)] font-normal">—</span>{" "}
            <span className="italic font-normal">field notes</span>
          </div>
          <div className="flex items-center justify-end gap-3 font-mono text-[11px] text-[color:var(--sub)]">
            <span className="hidden sm:inline">
              Austin, TX{temp !== null ? ` · ${temp}°F` : ""}
            </span>
          </div>
        </div>
      </header>

      {/* NAV */}
      <nav className="sticky top-0 z-40 border-b border-[color:var(--rule)] bg-[color:var(--bg)]/95 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--bg)]/80">
        <div
          className={`${WRAP} ${PAD} py-2.5 md:py-3 flex justify-between items-center gap-4 font-mono text-[11px] tracking-widest uppercase`}
        >
          <div className="flex gap-4 sm:gap-5 md:gap-7 text-[color:var(--sub)] overflow-x-auto scrollbar-none -mx-1 px-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-active={active === item.id}
                className="o3-link shrink-0"
              >
                {item.label}
              </a>
            ))}
          </div>
          <a
            href="/resume.pdf"
            download
            className="o3-link hidden md:inline-block whitespace-nowrap text-[color:var(--sub)]"
          >
            ↓ Download Resume
          </a>
        </div>
      </nav>

      {/* COVER */}
      <section
        id="about"
        className="border-b border-[color:var(--rule)] relative scroll-mt-20"
        style={{
          background: `
            radial-gradient(ellipse at 50% 30%, transparent 55%, ${
              theme === "dark" ? "rgba(0,0,0,0.35)" : "rgba(80,50,10,0.10)"
            } 100%),
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0'/></filter><rect width='180' height='180' filter='url(%23n)' opacity='${
              theme === "dark" ? "0.5" : "0.7"
            }'/></svg>"),
            linear-gradient(to bottom, ${c.cover}, ${c.bg})
          `,
        }}
      >
        <div className={`${WRAP} ${PAD} py-12 md:py-16 lg:py-20`}>
          <div className="o3-kicker mb-6">Feature · 01</div>
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 md:gap-10 lg:gap-12 items-center">
            <div>
              <h1
                className="font-serif font-normal m-0 text-[color:var(--ink)]"
                style={{
                  fontSize: "clamp(48px, 11vw, 132px)",
                  lineHeight: 0.9,
                  letterSpacing: "clamp(-2px, -0.5vw, -4px)",
                }}
              >
                Building
                <br />
                <span className="italic font-light">things that</span>
                <br />
                don&apos;t break<span style={{ color: c.accent }}>.</span>
              </h1>
              <div
                className="mt-7 md:mt-9 text-[15px] md:text-[17px] lg:text-[18px] leading-[1.5] max-w-[620px] font-serif"
                style={{ color: c.ink }}
              >
                <span className="o3-kicker mr-2">Summary</span>
                Gray Marshall is a second-year CS student at UT Austin building the real-time
                telemetry stack for a Formula SAE electric race car — and co-leading a
                production web platform as CTO of Longhorn Sim Racing. This is where the work
                lives.
              </div>
              <div className="mt-6 md:mt-8 flex flex-wrap gap-x-5 gap-y-1 items-center font-mono text-[11px] md:text-[12px] text-[color:var(--sub)]">
                <span>
                  by <span style={{ color: c.ink }}>Gray Marshall</span>
                </span>
                <span className="hidden sm:inline">·</span>
                <span>{P.about[0].length > 80 ? "6 min read" : "4 min read"}</span>
                <span className="hidden sm:inline">·</span>
                <a href="#contact" className="o3-link" style={{ color: c.accent }}>
                  Get in touch →
                </a>
              </div>
            </div>

            {/* Portrait + live widget */}
            <div className="max-w-[460px] w-full mx-auto lg:mx-0">
              <div
                className="relative overflow-hidden border border-[color:var(--rule)]"
                style={{ aspectRatio: "1 / 1" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/headshot.jpg"
                  alt="Gray Marshall"
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(0.35) contrast(1.05) sepia(0.12)" }}
                />
                <div
                  className="absolute inset-x-0 bottom-0 px-5 pb-4 pt-8 font-mono text-[10px] uppercase tracking-widest"
                  style={{
                    background: `linear-gradient(to top, ${c.cover}f0, transparent)`,
                    color: c.ink,
                  }}
                >
                  <div style={{ color: c.accent }}>Gray Marshall</div>
                  <div style={{ color: c.sub }}>Tokyo · 2023</div>
                </div>
                <div
                  className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border border-[color:var(--rule)] bg-[color:var(--bg)]"
                  style={{ color: c.ink }}
                >
                  PLATE 01
                </div>
              </div>
              <LiveTelemetry c={c} username={P.github.replace(/^github\.com\//, "")} />
            </div>
          </div>
        </div>
      </section>

      {/* TABLE OF CONTENTS / STATS */}
      <section className="border-b border-[color:var(--rule)]">
        <div
          className={`${WRAP} ${PAD} py-10 md:py-12 grid grid-cols-1 lg:grid-cols-[1fr_1px_1.5fr] gap-8 lg:gap-10`}
        >
          <div>
            <div className="o3-kicker mb-4">In This Issue</div>
            <ol className="list-none p-0 m-0 font-serif">
              {(
                [
                  ["I.", "Featured Projects", "three things, shipping", "#work"],
                  ["II.", "Now", "currently at the bench", "#now"],
                  ["III.", "Index", "everything, listed", "#index"],
                  ["IV.", "Experience", "where I spend my weeks", "#experience"],
                  ["V.", "Education", "ut austin, cs", "#education"],
                  ["VI.", "Systems", "what I reach for", "#systems"],
                  ["VII.", "Notes", "writing on process", "#notes"],
                ] as const
              ).map(([r, t, sub, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="group grid grid-cols-[36px_1fr_auto] py-2.5 border-b border-dotted border-[color:var(--rule)] items-baseline gap-3 no-underline"
                  >
                    <span className="italic text-[14px] text-[color:var(--sub)]">
                      {r}
                    </span>
                    <div>
                      <div className="text-[17px] sm:text-[19px] md:text-[20px] leading-[1.15] text-[color:var(--ink)] transition-colors group-hover:text-[color:var(--accent)]">
                        {t}
                      </div>
                      <div
                        className="text-[11px] font-mono mt-0.5 text-[color:var(--sub)]"
                        style={{ letterSpacing: 0.3 }}
                      >
                        {sub}
                      </div>
                    </div>
                    <span className="inline-block font-mono text-[10px] text-[color:var(--sub)] transition group-hover:text-[color:var(--accent)] group-hover:translate-x-0.5">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
          <div
            className="hidden lg:block w-px self-stretch"
            style={{ background: c.rule }}
          />
          <div className="flex flex-col gap-6 lg:gap-7">
            <div>
              <div className="o3-kicker mb-4">At a Glance</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
                {(
                  [
                    ["2nd", "year at UT Austin"],
                    ["2 race cars", "shipping telemetry for"],
                    ["1 platform", "built as CTO · live"],
                    ["3+", "featured projects"],
                    ["100+", "drivers on LSR"],
                    ["<40ms", "p99 telemetry latency"],
                  ] as const
                ).map(([v, k]) => (
                  <div
                    key={k}
                    className="pt-3 border-t"
                    style={{ borderColor: c.ink }}
                  >
                    <div
                      className="font-serif font-normal leading-none"
                      style={{
                        color: c.ink,
                        fontSize: "clamp(28px, 4.5vw, 40px)",
                        letterSpacing: -1,
                      }}
                    >
                      {v}
                    </div>
                    <div
                      className="text-[11px] mt-1.5 font-mono"
                      style={{ color: c.sub, letterSpacing: 0.3 }}
                    >
                      {k}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="flex flex-col justify-center p-5 md:p-6 lg:flex-1 font-serif italic text-[15px] md:text-[17px] leading-[1.5]"
              style={{
                background: c.soft,
                borderLeft: `3px solid ${c.accent}`,
                color: c.ink,
              }}
            >
              <div>
                &ldquo;I optimize for tight feedback loops, clear abstractions, and
                durable software that ships fast and performs under pressure.&rdquo;
                <div
                  className="mt-3 font-mono text-[10px] uppercase tracking-widest not-italic"
                  style={{ color: c.sub }}
                >
                  — Gray, on how he works
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section id="work" className="border-b border-[color:var(--rule)] scroll-mt-20">
        <div className={`${WRAP} ${PAD} py-16 md:py-24 lg:py-28`}>
          <SpreadHead
            c={c}
            roman="I."
            kicker="Feature"
            title="Projects, shipping"
            sub="Three things I've built this year that I'm proud of."
          />
          <div className="mt-14 md:mt-20 grid gap-20 md:gap-28 lg:gap-32">
            {P.featured.map((p, i) => (
              <EditorialFeature key={p.slug} p={p} c={c} idx={i} />
            ))}
          </div>
        </div>
      </section>

      {/* NOW */}
      <section
        id="now"
        className="border-b border-[color:var(--rule)] scroll-mt-20"
        style={{ background: c.soft }}
      >
        <div className={`${WRAP} ${PAD} py-10 md:py-12`}>
          <SpreadHead
            c={c}
            roman="II."
            kicker="Dispatch"
            title="Currently at the bench"
            sub={nowSub}
          />
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {P.now.map((n, i) => (
              <div key={i}>
                <div
                  className="font-mono text-[10px] uppercase tracking-widest mb-2.5"
                  style={{ color: c.accent }}
                >
                  {String(i + 1).padStart(2, "0")} · {n.where}
                </div>
                <div
                  className="font-serif leading-[1.25] font-normal text-[18px] md:text-[20px] lg:text-[22px]"
                  style={{ color: c.ink }}
                >
                  {n.what}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDEX */}
      <section
        id="index"
        className="border-b border-[color:var(--rule)] scroll-mt-20"
      >
        <div className={`${WRAP} ${PAD} py-12 md:py-16`}>
          <SpreadHead
            c={c}
            roman="III."
            kicker="Index"
            title="Everything, listed"
            sub={`${P.projects.length + P.featured.length} projects, archived and active.`}
          />
          {(() => {
            const active: TileItem[] = [
              ...P.featured,
              ...P.projects.filter((p) => p.status !== "Archived"),
            ];
            const archived: TileItem[] = P.projects.filter(
              (p) => p.status === "Archived",
            );
            return (
              <>
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  {active.map((p, i) => (
                    <ProjectTile key={`a-${i}`} p={p} c={c} />
                  ))}
                </div>
                {archived.length > 0 && (
                  <div className="mt-10 md:mt-12">
                    <div
                      className="o3-kicker mb-4 flex items-baseline gap-3"
                    >
                      <span>Archived · {archived.length}</span>
                      <span
                        aria-hidden
                        className="flex-1 h-px"
                        style={{ background: c.rule }}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {archived.map((p, i) => (
                        <ProjectTile
                          key={`x-${i}`}
                          p={p}
                          c={c}
                          compact
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section
        id="experience"
        className="border-b border-[color:var(--rule)] scroll-mt-20"
      >
        <div className={`${WRAP} ${PAD} py-12 md:py-16`}>
          <SpreadHead
            c={c}
            roman="IV."
            kicker="Engagements"
            title="Where I spend my weeks"
            sub="Two roles, both active."
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {P.experience.map((e, i) => (
              <article key={i} className="grid gap-4">
                <div
                  className="flex gap-4 items-start pb-4 border-b"
                  style={{ borderColor: c.ink }}
                >
                  <div
                    className="w-14 h-14 overflow-hidden flex-shrink-0 flex items-center justify-center border"
                    style={{ background: c.soft, borderColor: c.rule }}
                  >
                    {e.logo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={e.logo}
                        alt=""
                        className="w-full h-full object-contain p-2"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="o3-kicker mb-1.5"
                      style={{ color: c.accent }}
                    >
                      ● Currently · {e.tenure}
                    </div>
                    <div
                      className="font-serif font-normal text-[22px] md:text-[24px] lg:text-[26px] leading-[1.15]"
                      style={{ color: c.ink }}
                    >
                      {e.title}
                    </div>
                    <div
                      className="text-[13px] mt-1 font-serif italic"
                      style={{ color: c.sub }}
                    >
                      {e.org} · {e.location} ·{" "}
                      <span className="not-italic font-mono text-[11px]">
                        {e.period}
                      </span>
                    </div>
                  </div>
                </div>
                <ul className="list-none p-0 m-0 grid gap-2.5">
                  {e.bullets.map((b, j) => (
                    <li
                      key={j}
                      className="grid grid-cols-[20px_1fr] text-[13px] leading-[1.55]"
                      style={{ color: c.ink }}
                    >
                      <span
                        className="font-serif italic"
                        style={{ color: c.accent }}
                      >
                        §
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div
                  className="pt-3.5 border-t flex flex-wrap gap-x-0 gap-y-1"
                  style={{ borderColor: c.rule }}
                >
                  {e.skills.map((s, j) => (
                    <span
                      key={s}
                      className="font-mono text-[10px]"
                      style={{ color: c.sub }}
                    >
                      {s}
                      {j < e.skills.length - 1 && (
                        <span style={{ color: c.rule, margin: "0 6px" }}>·</span>
                      )}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION + SYSTEMS */}
      <section className="border-b border-[color:var(--rule)]">
        <div
          className={`${WRAP} ${PAD} py-12 md:py-16 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-12`}
        >
          <div id="education" className="scroll-mt-20">
            <SpreadHead
              c={c}
              roman="V."
              kicker="Schooling"
              title="Education"
              sub=""
              compact
            />
            <div
              className="mt-6 pt-4 border-t"
              style={{ borderColor: c.ink }}
            >
              {P.education.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={P.education.logo}
                  alt=""
                  className="w-12 h-12 object-contain mb-4"
                  style={{
                    filter: theme === "dark" ? "invert(1) opacity(0.9)" : "",
                  }}
                />
              )}
              <div
                className="font-serif font-normal text-[22px] md:text-[24px] lg:text-[26px] leading-[1.15]"
                style={{ color: c.ink }}
              >
                {P.education.school}
              </div>
              <div
                className="text-[14px] mt-1 font-serif italic"
                style={{ color: c.sub }}
              >
                {P.education.degree}
              </div>
              <div
                className="font-mono text-[11px] mt-2"
                style={{ color: c.accent, letterSpacing: 0.5 }}
              >
                {P.education.period} · {P.education.location}
              </div>
              <div className="mt-6">
                <div className="o3-kicker mb-3">Coursework</div>
                <ul className="list-none p-0 m-0 grid gap-1.5">
                  {P.education.coursework.map((cc, i) => (
                    <li
                      key={cc}
                      className="grid grid-cols-[30px_1fr] text-[13px] font-serif"
                      style={{ color: c.ink }}
                    >
                      <span
                        className="font-mono text-[10px]"
                        style={{ color: c.sub }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{cc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div id="systems" className="scroll-mt-20">
            <SpreadHead
              c={c}
              roman="VI."
              kicker="Toolkit"
              title="Systems & stack"
              sub="What I reach for when shipping."
              compact
            />
            <div className="mt-6">
              {Object.entries(P.skills).map(([cat, items], i) => (
                <div
                  key={cat}
                  className="grid grid-cols-1 sm:grid-cols-[150px_1fr] md:grid-cols-[180px_1fr] gap-2 sm:gap-6 py-4 border-t"
                  style={{ borderColor: i === 0 ? c.ink : c.rule }}
                >
                  <div
                    className="font-serif italic font-normal text-[20px] md:text-[22px]"
                    style={{ color: c.ink }}
                  >
                    {cat}
                  </div>
                  <div className="flex flex-wrap gap-x-1 items-baseline">
                    {items.map((s, j) => (
                      <Fragment key={s}>
                        <span
                          className="font-serif text-[14px] md:text-[15px]"
                          style={{ color: c.ink }}
                        >
                          {s}
                        </span>
                        {j < items.length - 1 && (
                          <span
                            style={{ color: c.accent, margin: "0 4px" }}
                          >
                            ·
                          </span>
                        )}
                      </Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NOTES */}
      <section
        id="notes"
        className="border-b border-[color:var(--rule)] scroll-mt-20"
        style={{ background: c.cover }}
      >
        <div className={`${WRAP} ${PAD} py-12 md:py-16`}>
          <SpreadHead
            c={c}
            roman="VII."
            kicker="Writing"
            title="Notes from the margin"
            sub="Engineering, process, and occasional trackside observation."
          />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] gap-8 md:gap-10">
            <FeatureNote n={P.notes[0]} c={c} lead />
            <div className="grid gap-6 content-start">
              {P.notes.slice(1, 3).map((n, i) => (
                <FeatureNote key={i} n={n} c={c} />
              ))}
            </div>
            <div className="grid gap-6 content-start md:col-span-2 lg:col-span-1">
              <FeatureNote n={P.notes[3]} c={c} />
              <div
                className="p-4 border"
                style={{ background: c.bg, borderColor: c.rule }}
              >
                <div className="o3-kicker mb-2">Subscribe</div>
                <div
                  className="font-serif text-[17px] md:text-[18px] leading-[1.2] mb-2.5"
                  style={{ color: c.ink }}
                >
                  Dispatches, monthly.
                </div>
                <input
                  placeholder="you@domain.dev"
                  className="w-full px-2.5 py-2 font-mono text-[12px] mb-1.5 outline-none"
                  style={{
                    background: c.bg,
                    border: `1px solid ${c.rule}`,
                    color: c.ink,
                  }}
                />
                <button
                  className="w-full py-2 font-mono text-[11px] uppercase tracking-widest cursor-pointer"
                  style={{ background: c.ink, color: c.bg, border: "none" }}
                >
                  Subscribe →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="scroll-mt-20">
        <div className={`${WRAP} ${PAD} py-16 md:py-20`}>
          <div className="o3-kicker mb-5">Colophon · Contact</div>
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16 items-end">
            <h2
              className="font-serif font-normal m-0"
              style={{
                color: c.ink,
                fontSize: "clamp(44px, 9vw, 96px)",
                lineHeight: 0.92,
                letterSpacing: "clamp(-1.5px, -0.4vw, -3px)",
              }}
            >
              <span className="italic font-light">Write,</span> and
              <br />
              I&apos;ll write back<span style={{ color: c.accent }}>.</span>
            </h2>
            <div className="font-serif">
              {(
                [
                  ["email", P.email],
                  ["github", P.github],
                  ["linkedin", P.linkedin],
                  ["location", P.location],
                  ["best for", "technical leadership · distributed systems · real-time infrastructure"],
                ] as const
              ).map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] py-2.5 border-b items-baseline gap-4"
                  style={{ borderColor: c.rule }}
                >
                  <div className="o3-kicker">{k}</div>
                  <div
                    className="text-[14px] sm:text-[15px] md:text-[16px] break-words"
                    style={{ color: c.ink }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MASTHEAD FOOTER */}
      <footer
        style={{ background: c.cover, borderTop: `2px solid ${c.ink}` }}
      >
        <div
          className={`${WRAP} ${PAD} py-8 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-8 font-mono text-[11px]`}
        >
          <div>
            <div
              className="font-serif text-[18px] md:text-[20px] tracking-[0.15em] mb-2"
              style={{ color: c.ink }}
            >
              G.MARSHALL — FIELD NOTES
            </div>
            <div className="leading-[1.6]" style={{ color: c.sub }}>
              Set in Fraunces &amp; Inter. Built in React. Hosted on the open web.
              <br />
              Best read with a coffee and something loud in the background.
            </div>
          </div>
          <div>
            <div className="o3-kicker mb-2">Masthead</div>
            <div className="leading-[1.7]" style={{ color: c.ink }}>
              Editor, engineer &amp; designer
              <br />
              Gray Marshall
            </div>
          </div>
          <div>
            <div className="o3-kicker mb-2">Publication</div>
            <div className="leading-[1.7]" style={{ color: c.ink }}>
              Vol. 03 · {currentYear}
              <br />© Gray Marshall
              <br />
              Austin, Texas
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SpreadHead({
  c,
  roman,
  kicker,
  title,
  sub,
  compact,
}: {
  c: Palette;
  roman: string;
  kicker: string;
  title: string;
  sub?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr] gap-5 md:gap-6 items-baseline ${
        compact ? "" : "border-b-2 pb-4 md:pb-5"
      }`}
      style={{ borderColor: compact ? "transparent" : c.ink }}
    >
      <div
        className="font-serif italic font-light leading-[0.9]"
        style={{
          color: c.accent,
          fontSize: "clamp(32px, 5vw, 48px)",
        }}
      >
        {roman}
      </div>
      <div>
        <div className="o3-kicker">{kicker}</div>
        <div
          className="font-serif font-normal mt-1"
          style={{
            color: c.ink,
            fontSize: "clamp(28px, 5vw, 48px)",
            lineHeight: 1,
            letterSpacing: -1,
          }}
        >
          {title}
        </div>
        {sub && (
          <div
            className="text-[13px] md:text-[14px] mt-1.5 italic"
            style={{ color: c.sub }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

function EditorialFeature({
  p,
  c,
  idx,
}: {
  p: FeaturedProject;
  c: Palette;
  idx: number;
}) {
  const flip = idx % 2 === 1;
  return (
    <Link
      href={`/projects/${p.slug}`}
      className="o3-feat grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 no-underline items-center"
      style={{ color: "inherit" }}
    >
      <div
        className={`relative overflow-hidden border w-full ${
          flip ? "lg:order-2" : "lg:order-1"
        }`}
        style={{
          aspectRatio: "16 / 10",
          borderColor: c.rule,
          background: c.soft,
        }}
      >
        {p.video ? (
          <video
            src={p.video}
            autoPlay
            loop
            muted
            playsInline
            className="o3-img w-full h-full object-cover block"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image}
            alt={p.title}
            className="o3-img w-full h-full object-cover block"
          />
        )}
        <div
          className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border"
          style={{ background: c.bg, borderColor: c.rule, color: c.ink }}
        >
          FIG. 0{idx + 2} · {p.slug}
        </div>
      </div>
      <div className={`min-w-0 ${flip ? "lg:order-1" : "lg:order-2"}`}>
        <div
          className="font-mono text-[10px] uppercase tracking-[0.15em] mb-5 md:mb-6"
          style={{ color: c.sub }}
        >
          Case {String(idx + 1).padStart(2, "0")} ·{" "}
          <span style={{ color: p.status === "Live" ? c.accent : c.sub }}>
            {p.status}
          </span>{" "}
          · {p.year}
        </div>
        <h3
          className="o3-title font-serif font-normal m-0 mb-4 md:mb-5"
          style={{
            color: c.ink,
            fontSize: "clamp(28px, 5vw, 44px)",
            lineHeight: 0.98,
            letterSpacing: -1,
          }}
        >
          {p.title}
        </h3>
        <div
          className="font-serif italic leading-[1.45] mb-8 md:mb-10 text-[16px] md:text-[18px] lg:text-[19px]"
          style={{ color: c.sub }}
        >
          {p.tagline}
        </div>
        <div className="grid gap-3.5 md:gap-4 mb-10 md:mb-12">
          {p.bullets.map((b, i) => (
            <div
              key={i}
              className="grid grid-cols-[20px_1fr] text-[13px] md:text-[14px] leading-[1.6]"
              style={{ color: c.ink }}
            >
              <span
                className="font-serif italic"
                style={{ color: c.accent }}
              >
                ›
              </span>
              <span>{b}</span>
            </div>
          ))}
        </div>
        {p.metrics && (
          <div
            className="grid grid-cols-3 border-t border-b mb-8 md:mb-10"
            style={{ borderColor: c.ink }}
          >
            {p.metrics.map((m, i) => (
              <div
                key={i}
                className="py-6 md:py-7 px-3 md:px-4 text-left"
                style={{
                  borderRight:
                    i < (p.metrics?.length ?? 0) - 1
                      ? `1px solid ${c.rule}`
                      : "none",
                }}
              >
                <div
                  className="font-serif font-normal leading-none"
                  style={{
                    color: c.ink,
                    fontSize: "clamp(24px, 3.5vw, 32px)",
                    letterSpacing: -0.5,
                  }}
                >
                  {m.v}
                </div>
                <div
                  className="font-mono text-[9px] uppercase tracking-widest mt-2"
                  style={{ color: c.sub }}
                >
                  {m.k}
                </div>
              </div>
            ))}
          </div>
        )}
        <div
          className="flex flex-wrap gap-x-5 gap-y-2 items-center font-mono text-[11px] pt-2"
        >
          <span style={{ color: c.sub }}>{p.tech.join(" · ")}</span>
          <span
            className="sm:ml-auto"
            style={{ color: c.accent }}
          >
            Read the case study →
          </span>
        </div>
      </div>
    </Link>
  );
}

type TileItem = {
  title: string;
  tagline: string;
  tech: string[];
  status: string;
  year: string;
  image?: string;
  slug?: string;
};

function ProjectTile({
  p,
  c,
  compact,
}: {
  p: TileItem;
  c: Palette;
  compact?: boolean;
}) {
  const hasImage = Boolean(p.image) && !compact;
  const statusColor = p.status === "Live" ? c.accent : c.sub;
  const isLinked = Boolean(p.slug);

  const Outer = (isLinked ? Link : "article") as ElementType;
  const outerProps = isLinked
    ? { href: `/projects/${p.slug}` }
    : ({} as Record<string, never>);

  return (
    <Outer
      {...outerProps}
      className="o3-tile relative overflow-hidden border font-mono block no-underline"
      style={{
        borderColor: c.rule,
        background: c.card,
        color: "inherit",
        minHeight: compact ? 96 : 180,
      }}
    >
      {hasImage && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          <div
            className="absolute inset-0"
            style={{ perspective: "600px", perspectiveOrigin: "85% 50%" }}
          >
            <div
              className="o3-tile-img absolute"
              style={{
                width: 300,
                aspectRatio: "16 / 10",
                left: "56%",
                top: "50%",
                transformOrigin: "center center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 50% 170% at 72% 50%, transparent 22%, ${c.card}ee 52%, ${c.card} 70%)`,
            }}
          />
        </div>
      )}

      {/* header row */}
      <div
        className={`relative z-10 flex items-center justify-between border-b uppercase tracking-widest ${
          compact ? "px-3 py-2 text-[8px]" : "px-4 py-2.5 text-[9px]"
        }`}
        style={{ borderColor: c.rule, color: c.sub }}
      >
        <span>{p.year}</span>
        <span style={{ color: statusColor }}>
          {p.status === "Live" ? "● " : "○ "}
          {p.status}
        </span>
      </div>

      {/* body */}
      <div
        className={`relative z-10 ${
          compact ? "px-3 py-3" : "px-4 py-4 md:px-5 md:py-5"
        }`}
      >
        <h3
          className="o3-tile-title font-serif font-normal leading-[1.15] m-0"
          style={{
            color: c.ink,
            fontSize: compact
              ? "clamp(15px, 1.6vw, 18px)"
              : "clamp(20px, 2.5vw, 26px)",
            letterSpacing: compact ? -0.2 : -0.3,
          }}
        >
          {p.title}
        </h3>
        <div
          className={`font-serif italic ${
            compact ? "text-[12px] mt-1.5" : "text-[14px] md:text-[15px] mt-2 max-w-[70%]"
          }`}
          style={{ color: c.sub }}
        >
          {p.tagline}
        </div>
        <div
          className={`font-mono ${
            compact ? "text-[9px] mt-2" : "text-[10px] mt-4 max-w-[70%]"
          }`}
          style={{ color: c.sub, letterSpacing: 0.5 }}
        >
          {p.tech.join(" · ")}
        </div>
      </div>
    </Outer>
  );
}

function FeatureNote({
  n,
  c,
  lead,
}: {
  n: Note;
  c: Palette;
  lead?: boolean;
}) {
  return (
    <a
      href="#"
      className="o3-feat block no-underline"
      style={{ color: "inherit" }}
    >
      <div
        className="o3-kicker mb-2.5"
        style={{ color: c.accent }}
      >
        #{n.tag} · {n.date}
      </div>
      <div
        className="o3-title font-serif font-normal mb-2.5"
        style={{
          color: c.ink,
          fontSize: lead ? "clamp(28px, 4.5vw, 40px)" : "clamp(18px, 2.5vw, 22px)",
          lineHeight: lead ? 1 : 1.2,
          letterSpacing: lead ? -1 : 0,
        }}
      >
        {n.title}
      </div>
      {lead && (
        <div
          className="font-serif italic text-[15px] md:text-[16px] leading-[1.5] mb-3"
          style={{ color: c.sub }}
        >
          A field report on building a distributed telemetry stack that delivers race-car
          bytes to a driver dashboard in under 20 milliseconds — what worked, what didn&apos;t,
          what I&apos;d do again.
        </div>
      )}
      <div
        className="font-mono text-[10px] uppercase tracking-widest"
        style={{ color: c.sub }}
      >
        {n.read} · Read →
      </div>
    </a>
  );
}

type ChartPoint = { date: string; label: string; count: number };

function LiveTelemetry({ c, username }: { c: Palette; username: string }) {
  const activity = useGithubActivity(username);

  const daily = activity?.daily ?? new Array<number>(30).fill(0);

  const chartData: ChartPoint[] = daily.map((count, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (daily.length - 1 - i));
    return {
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count,
    };
  });

  const metrics: Array<[string, string, string]> = activity
    ? [
        ["prs", `${activity.prsOpened}`, "opened"],
        ["reviews", `${activity.reviewsGiven}`, "given"],
        ["repos", `${activity.reposTouched}`, "touched"],
      ]
    : [
        ["prs", "—", "opened"],
        ["reviews", "—", "given"],
        ["repos", "—", "touched"],
      ];

  const gradientId = `o3-area-${username}`;

  return (
    <div
      className="mt-4 border font-mono"
      style={{ borderColor: c.rule, background: c.card }}
    >
      {/* header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b text-[9px] uppercase tracking-widest"
        style={{ borderColor: c.rule, color: c.sub }}
      >
        <span>Activity (excluding private repos)</span>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 no-underline"
          style={{ color: c.accent }}
        >
          <span>{username}</span>
          <Github size={13} strokeWidth={1.75} aria-hidden />
        </a>
      </div>

      {/* chart */}
      <div className="px-2 pt-3 pb-2" style={{ height: 84 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 6, bottom: 0, left: 6 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.accent} stopOpacity={0.28} />
                <stop offset="100%" stopColor={c.accent} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke={c.rule}
              strokeDasharray="2 3"
              opacity={0.7}
            />
            <XAxis dataKey="label" hide />
            <YAxis hide domain={[0, (max: number) => Math.max(1, max)]} />
            <Tooltip
              cursor={{ stroke: c.accent, strokeWidth: 0.6, strokeDasharray: "2 3" }}
              contentStyle={{
                background: c.card,
                border: `1px solid ${c.rule}`,
                borderRadius: 0,
                padding: "6px 8px",
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: c.ink,
                boxShadow: "none",
              }}
              labelStyle={{
                color: c.sub,
                fontSize: 9,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                marginBottom: 2,
              }}
              itemStyle={{ color: c.ink, padding: 0 }}
              formatter={(v) => [`${v}`, "events"]}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke={c.accent}
              strokeWidth={1.4}
              strokeLinejoin="round"
              strokeLinecap="round"
              fill={`url(#${gradientId})`}
              isAnimationActive
              animationDuration={600}
              dot={false}
              activeDot={{ r: 3, fill: c.accent, stroke: c.card, strokeWidth: 1.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* metrics */}
      <div
        className="grid grid-cols-3 border-t"
        style={{ borderColor: c.rule }}
      >
        {metrics.map(([label, value, unit], i) => (
          <div
            key={label}
            className="px-4 py-3"
            style={{
              borderRight:
                i < metrics.length - 1 ? `1px solid ${c.rule}` : "none",
            }}
          >
            <div
              className="text-[8px] uppercase tracking-widest"
              style={{ color: c.sub }}
            >
              {label}
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span
                className="text-[18px] leading-none font-medium tabular-nums"
                style={{ color: c.ink }}
              >
                {value}
              </span>
              <span
                className="text-[10px] uppercase tracking-wider"
                style={{ color: c.sub }}
              >
                {unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
