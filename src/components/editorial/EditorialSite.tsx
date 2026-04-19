"use client";

import { Fragment, useEffect, useState } from "react";
import { PORTFOLIO, type FeaturedProject, type Note } from "@/data/portfolio";
import { useModeTheme } from "../ModeThemeProvider";

const o3Styles = {
  light: {
    bg: "#f5ecd8",
    cover: "#e8dcbe",
    ink: "#18140a",
    sub: "#6f6650",
    rule: "#cfc09c",
    accent: "#b94610",
    soft: "#ddcea8",
    card: "#fbf5e6",
  },
  dark: {
    bg: "#0b0a07",
    cover: "#18160f",
    ink: "#f4ecd6",
    sub: "#948b78",
    rule: "#2b2820",
    accent: "#ff7a1a",
    soft: "#1f1c13",
    card: "#16140d",
  },
} as const;

type Palette = typeof o3Styles.light;

const serif = 'var(--font-serif), "Instrument Serif", Georgia, serif';
const display = "var(--font-serif), Georgia, serif";
const sans = "var(--font-sans), -apple-system, sans-serif";
const mono = "var(--font-mono), ui-monospace, monospace";

export function EditorialSite() {
  const { theme } = useModeTheme();
  const c = theme === "dark" ? o3Styles.dark : o3Styles.light;
  const P = PORTFOLIO;

  return (
    <div
      style={{
        background: c.bg,
        color: c.ink,
        fontFamily: sans,
        minHeight: "100%",
        fontSize: 14,
        lineHeight: 1.55,
      }}
    >
      <style>{`
        @keyframes o3-tick { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-2px) } }
        .o3-link { color: inherit; text-decoration: none; position: relative; }
        .o3-link::after { content:''; position:absolute; left:0; right:0; bottom:-2px; height:1px; background:${c.ink}; transform: scaleX(0); transform-origin: right; transition: transform .25s ease; }
        .o3-link:hover::after { transform: scaleX(1); transform-origin: left; }
        .o3-link:hover { color: ${c.accent}; }
        .o3-feat:hover .o3-img { transform: scale(1.02); }
        .o3-feat:hover .o3-title { color: ${c.accent}; }
        .o3-img { transition: transform .5s ease; }
        .o3-title { transition: color .2s; }
        .o3-row:hover { background: ${c.soft} !important; }
        .o3-row:hover .o3-t { color: ${c.accent} !important; }
        .o3-t { transition: color .15s; }
        @keyframes o3-blip { 0%,100% { opacity: 0.3 } 50% { opacity: 1 } }
        .o3-blip { animation: o3-blip 1.8s ease-in-out infinite; }
        .o3-kicker { font-family: ${mono}; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: ${c.sub}; }
      `}</style>

      {/* MASTHEAD */}
      <header
        style={{
          padding: "14px 40px",
          borderBottom: `1px solid ${c.ink}`,
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 24,
          background: c.bg,
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: 10,
            letterSpacing: 1,
            color: c.sub,
            textTransform: "uppercase",
          }}
        >
          Vol. 03 · Issue 01 · April 2026
        </div>
        <div
          style={{
            fontFamily: display,
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: 2,
            textAlign: "center",
          }}
        >
          <span style={{ color: c.accent }}>G.</span>MARSHALL{" "}
          <span style={{ color: c.sub, fontWeight: 400 }}>—</span>{" "}
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>field notes</span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "flex-end",
            alignItems: "center",
            fontFamily: mono,
            fontSize: 11,
          }}
        >
          <span style={{ color: c.sub }}>Austin, TX · 68°F</span>
        </div>
      </header>

      {/* NAV */}
      <nav
        style={{
          padding: "10px 40px",
          borderBottom: `1px solid ${c.rule}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: mono,
          fontSize: 11,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        <div style={{ display: "flex", gap: 28, color: c.sub }}>
          <a href="#about" className="o3-link">About</a>
          <a href="#work" className="o3-link">Work</a>
          <a href="#now" className="o3-link">Now</a>
          <a href="#experience" className="o3-link">Experience</a>
          <a href="#notes" className="o3-link">Notes</a>
          <a href="#contact" className="o3-link">Contact</a>
        </div>
        <div style={{ color: c.accent }}>
          <span className="o3-blip">●</span>{" "}
          <span style={{ color: c.sub }}>Available for Summer 2026</span>
        </div>
      </nav>

      {/* COVER */}
      <section
        style={{
          padding: "64px 40px 56px",
          borderBottom: `1px solid ${c.rule}`,
          background: `
            radial-gradient(ellipse at 50% 30%, transparent 55%, ${theme === "dark" ? "rgba(0,0,0,0.35)" : "rgba(80,50,10,0.10)"} 100%),
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0'/></filter><rect width='180' height='180' filter='url(%23n)' opacity='${theme === "dark" ? "0.5" : "0.7"}'/></svg>"),
            linear-gradient(to bottom, ${c.cover}, ${c.bg})
          `,
          position: "relative",
        }}
      >
        <div className="o3-kicker" style={{ marginBottom: 24 }}>
          Feature · 01
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: 48,
            alignItems: "start",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: display,
                fontWeight: 400,
                fontSize: 132,
                lineHeight: 0.88,
                letterSpacing: -4,
                margin: 0,
                color: c.ink,
              }}
            >
              Building
              <br />
              <span style={{ fontStyle: "italic", fontWeight: 300 }}>things that</span>
              <br />
              don&apos;t break<span style={{ color: c.accent }}>.</span>
            </h1>
            <div
              style={{
                marginTop: 36,
                fontSize: 18,
                lineHeight: 1.5,
                color: c.ink,
                maxWidth: 620,
                fontFamily: serif,
                fontWeight: 400,
              }}
            >
              <span className="o3-kicker" style={{ marginRight: 8 }}>
                Dispatch
              </span>
              Gray Marshall is a second-year CS student at UT Austin building the real-time
              telemetry stack for a Formula SAE electric race car — and co-leading a production
              web platform as CTO of Longhorn Sim Racing. This is where the work lives.
            </div>
            <div
              style={{
                marginTop: 32,
                display: "flex",
                gap: 24,
                alignItems: "center",
                fontFamily: mono,
                fontSize: 12,
                color: c.sub,
              }}
            >
              <span>
                by <span style={{ color: c.ink }}>the engineer himself</span>
              </span>
              <span>·</span>
              <span>{P.about[0].length > 80 ? "6 min read" : "4 min read"}</span>
              <span>·</span>
              <a href="#contact" className="o3-link" style={{ color: c.accent }}>
                Get in touch →
              </a>
            </div>
          </div>

          {/* Portrait + live widget */}
          <div>
            <div
              style={{
                position: "relative",
                aspectRatio: "4/5",
                overflow: "hidden",
                border: `1px solid ${c.rule}`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/headshot.jpg"
                alt="Gray Marshall"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "grayscale(0.35) contrast(1.05) sepia(0.12)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "32px 20px 16px",
                  background: `linear-gradient(to top, ${c.cover}f0, transparent)`,
                  fontFamily: mono,
                  fontSize: 10,
                  color: c.ink,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                <div style={{ color: c.accent }}>Gray Marshall</div>
                <div style={{ color: c.sub }}>Austin · 2026</div>
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  fontFamily: mono,
                  fontSize: 9,
                  color: c.ink,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  background: c.bg,
                  padding: "3px 8px",
                  border: `1px solid ${c.rule}`,
                }}
              >
                PLATE 01
              </div>
            </div>
            <LiveTelemetry c={c} />
          </div>
        </div>
      </section>

      {/* TABLE OF CONTENTS / STATS */}
      <section
        style={{
          padding: "40px 40px",
          borderBottom: `1px solid ${c.rule}`,
          display: "grid",
          gridTemplateColumns: "1fr 1px 1.5fr",
          gap: 40,
        }}
      >
        <div>
          <div className="o3-kicker" style={{ marginBottom: 16 }}>
            In This Issue
          </div>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, fontFamily: serif }}>
            {(
              [
                ["I.", "Featured Projects", "three things, shipping"],
                ["II.", "Now", "currently at the bench"],
                ["III.", "Index", "everything, listed"],
                ["IV.", "Experience", "where I spend my weeks"],
                ["V.", "Education", "ut austin, cs"],
                ["VI.", "Systems", "what I reach for"],
                ["VII.", "Notes", "writing on process"],
              ] as const
            ).map(([r, t, sub]) => (
              <li
                key={r}
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 1fr auto",
                  padding: "10px 0",
                  borderBottom: `1px dotted ${c.rule}`,
                  alignItems: "baseline",
                  gap: 12,
                }}
              >
                <span style={{ fontStyle: "italic", color: c.sub, fontSize: 14 }}>{r}</span>
                <div>
                  <div style={{ fontSize: 20, color: c.ink, lineHeight: 1.1 }}>{t}</div>
                  <div
                    style={{
                      fontSize: 11,
                      fontFamily: mono,
                      color: c.sub,
                      letterSpacing: 0.3,
                      marginTop: 2,
                    }}
                  >
                    {sub}
                  </div>
                </div>
                <span style={{ fontFamily: mono, fontSize: 10, color: c.sub }}>→</span>
              </li>
            ))}
          </ol>
        </div>
        <div style={{ background: c.rule, width: 1 }}></div>
        <div>
          <div className="o3-kicker" style={{ marginBottom: 16 }}>
            At a Glance
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
              marginBottom: 28,
            }}
          >
            {(
              [
                ["2nd", "year at UT Austin"],
                ["1 race car", "shipping telemetry for"],
                ["1 platform", "built as CTO · live"],
                ["3+", "featured projects"],
                ["127", "signals streaming"],
                ["<40ms", "p99 telemetry latency"],
              ] as const
            ).map(([v, k]) => (
              <div key={k} style={{ paddingTop: 14, borderTop: `1px solid ${c.ink}` }}>
                <div
                  style={{
                    fontFamily: display,
                    fontSize: 40,
                    lineHeight: 1,
                    fontWeight: 400,
                    letterSpacing: -1,
                    color: c.ink,
                  }}
                >
                  {v}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: c.sub,
                    marginTop: 6,
                    fontFamily: mono,
                    letterSpacing: 0.3,
                  }}
                >
                  {k}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: 20,
              background: c.soft,
              borderLeft: `3px solid ${c.accent}`,
              fontFamily: serif,
              fontSize: 17,
              fontStyle: "italic",
              lineHeight: 1.5,
              color: c.ink,
            }}
          >
            &ldquo;I optimize for tight feedback loops, clear abstractions, and durable software
            that ships fast and performs under pressure.&rdquo;
            <div
              style={{
                marginTop: 12,
                fontFamily: mono,
                fontSize: 10,
                color: c.sub,
                letterSpacing: 1,
                textTransform: "uppercase",
                fontStyle: "normal",
              }}
            >
              — Gray, on how he works
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section
        id="work"
        style={{ padding: "64px 40px", borderBottom: `1px solid ${c.rule}` }}
      >
        <SpreadHead
          c={c}
          roman="I."
          kicker="Feature"
          title="Projects, shipping"
          sub="Three things I've built this year that I'm proud of."
        />
        <div style={{ marginTop: 48, display: "grid", gap: 48 }}>
          {P.featured.map((p, i) => (
            <EditorialFeature key={p.slug} p={p} c={c} idx={i} />
          ))}
        </div>
      </section>

      {/* NOW */}
      <section
        id="now"
        style={{
          padding: "48px 40px",
          borderBottom: `1px solid ${c.rule}`,
          background: c.soft,
        }}
      >
        <SpreadHead
          c={c}
          roman="II."
          kicker="Dispatch"
          title="Currently at the bench"
          sub={`As of ${new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}`}
        />
        <div
          style={{
            marginTop: 32,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 24,
          }}
        >
          {P.now.map((n, i) => (
            <div key={i} style={{ paddingTop: 16, borderTop: `1px solid ${c.ink}` }}>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  color: c.accent,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                {String(i + 1).padStart(2, "0")} · {n.where}
              </div>
              <div
                style={{
                  fontFamily: display,
                  fontSize: 22,
                  lineHeight: 1.25,
                  color: c.ink,
                  fontWeight: 400,
                }}
              >
                {n.what}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INDEX */}
      <section style={{ padding: "64px 40px", borderBottom: `1px solid ${c.rule}` }}>
        <SpreadHead
          c={c}
          roman="III."
          kicker="Index"
          title="Everything, listed"
          sub={`${P.projects.length + P.featured.length} projects, archived and active.`}
        />
        <div style={{ marginTop: 32 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr 2.5fr 1.5fr 80px",
              padding: "12px 16px",
              borderBottom: `1px solid ${c.ink}`,
              fontFamily: mono,
              fontSize: 10,
              color: c.sub,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            <div>Year</div>
            <div>Title</div>
            <div>Description</div>
            <div>Stack</div>
            <div>Status</div>
          </div>
          {P.projects.map((p, i) => (
            <div
              key={i}
              className="o3-row"
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 2.5fr 1.5fr 80px",
                padding: "18px 16px",
                borderBottom: `1px solid ${c.rule}`,
                alignItems: "baseline",
                cursor: "pointer",
              }}
            >
              <div style={{ fontFamily: mono, fontSize: 11, color: c.sub }}>{p.year}</div>
              <div
                className="o3-t"
                style={{
                  fontFamily: display,
                  fontSize: 22,
                  color: c.ink,
                  lineHeight: 1.15,
                  fontWeight: 400,
                }}
              >
                {p.title}
              </div>
              <div
                style={{
                  color: c.sub,
                  fontSize: 14,
                  fontFamily: serif,
                  fontStyle: "italic",
                }}
              >
                {p.tagline}
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  color: c.sub,
                  letterSpacing: 0.5,
                }}
              >
                {p.tech.join(" · ")}
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  color: p.status === "Live" ? c.accent : c.sub,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {p.status}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section
        id="experience"
        style={{ padding: "64px 40px", borderBottom: `1px solid ${c.rule}` }}
      >
        <SpreadHead
          c={c}
          roman="IV."
          kicker="Engagements"
          title="Where I spend my weeks"
          sub="Two roles, both active."
        />
        <div
          style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
          }}
        >
          {P.experience.map((e, i) => (
            <article key={i} style={{ display: "grid", gap: 16 }}>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "start",
                  paddingBottom: 16,
                  borderBottom: `1px solid ${c.ink}`,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    background: c.soft,
                    border: `1px solid ${c.rule}`,
                    overflow: "hidden",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {e.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={e.logo}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        padding: 8,
                      }}
                    />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    className="o3-kicker"
                    style={{ color: c.accent, marginBottom: 6 }}
                  >
                    ● Currently · {e.tenure}
                  </div>
                  <div
                    style={{
                      fontFamily: display,
                      fontSize: 26,
                      lineHeight: 1.15,
                      color: c.ink,
                      fontWeight: 400,
                    }}
                  >
                    {e.title}
                  </div>
                  <div
                    style={{
                      color: c.sub,
                      fontSize: 13,
                      marginTop: 4,
                      fontFamily: serif,
                      fontStyle: "italic",
                    }}
                  >
                    {e.org} · {e.location} ·{" "}
                    <span
                      style={{ fontStyle: "normal", fontFamily: mono, fontSize: 11 }}
                    >
                      {e.period}
                    </span>
                  </div>
                </div>
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gap: 10,
                }}
              >
                {e.bullets.map((b, j) => (
                  <li
                    key={j}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "24px 1fr",
                      fontSize: 13,
                      lineHeight: 1.55,
                      color: c.ink,
                    }}
                  >
                    <span
                      style={{
                        color: c.accent,
                        fontFamily: serif,
                        fontStyle: "italic",
                      }}
                    >
                      §
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div
                style={{
                  paddingTop: 14,
                  borderTop: `1px solid ${c.rule}`,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 4,
                }}
              >
                {e.skills.map((s) => (
                  <span key={s} style={{ fontFamily: mono, fontSize: 10, color: c.sub }}>
                    {s}
                    <span style={{ color: c.rule, margin: "0 6px" }}>·</span>
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* EDUCATION + SYSTEMS */}
      <section
        style={{
          padding: "64px 40px",
          borderBottom: `1px solid ${c.rule}`,
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: 48,
        }}
      >
        <div>
          <SpreadHead
            c={c}
            roman="V."
            kicker="Schooling"
            title="Education"
            sub=""
            compact
          />
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${c.ink}` }}>
            {P.education.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={P.education.logo}
                alt=""
                style={{
                  width: 48,
                  height: 48,
                  objectFit: "contain",
                  marginBottom: 16,
                  filter: theme === "dark" ? "invert(1) opacity(0.9)" : "",
                }}
              />
            )}
            <div
              style={{
                fontFamily: display,
                fontSize: 26,
                lineHeight: 1.15,
                color: c.ink,
                fontWeight: 400,
              }}
            >
              {P.education.school}
            </div>
            <div
              style={{
                color: c.sub,
                fontSize: 14,
                marginTop: 4,
                fontFamily: serif,
                fontStyle: "italic",
              }}
            >
              {P.education.degree}
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 11,
                color: c.accent,
                marginTop: 8,
                letterSpacing: 0.5,
              }}
            >
              {P.education.period} · {P.education.location}
            </div>
            <div style={{ marginTop: 24 }}>
              <div className="o3-kicker" style={{ marginBottom: 12 }}>
                Coursework
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gap: 6,
                }}
              >
                {P.education.coursework.map((cc, i) => (
                  <li
                    key={cc}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "30px 1fr",
                      fontSize: 13,
                      color: c.ink,
                      fontFamily: serif,
                    }}
                  >
                    <span
                      style={{ color: c.sub, fontFamily: mono, fontSize: 10 }}
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
        <div>
          <SpreadHead
            c={c}
            roman="VI."
            kicker="Toolkit"
            title="Systems & stack"
            sub="What I reach for when shipping."
            compact
          />
          <div style={{ marginTop: 24 }}>
            {Object.entries(P.skills).map(([cat, items], i) => (
              <div
                key={cat}
                style={{
                  display: "grid",
                  gridTemplateColumns: "180px 1fr",
                  gap: 24,
                  padding: "16px 0",
                  borderTop: `1px solid ${i === 0 ? c.ink : c.rule}`,
                }}
              >
                <div
                  style={{
                    fontFamily: display,
                    fontSize: 22,
                    fontStyle: "italic",
                    color: c.ink,
                    fontWeight: 400,
                  }}
                >
                  {cat}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                    alignItems: "baseline",
                  }}
                >
                  {items.map((s, j) => (
                    <Fragment key={s}>
                      <span style={{ fontFamily: serif, fontSize: 15, color: c.ink }}>
                        {s}
                      </span>
                      {j < items.length - 1 && (
                        <span style={{ color: c.accent, margin: "0 4px" }}>·</span>
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOTES */}
      <section
        id="notes"
        style={{
          padding: "64px 40px",
          borderBottom: `1px solid ${c.rule}`,
          background: c.cover,
        }}
      >
        <SpreadHead
          c={c}
          roman="VII."
          kicker="Writing"
          title="Notes from the margin"
          sub="Engineering, process, and occasional trackside observation."
        />
        <div
          style={{
            marginTop: 32,
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr",
            gap: 32,
          }}
        >
          <FeatureNote n={P.notes[0]} c={c} lead />
          <div style={{ display: "grid", gap: 24, alignContent: "start" }}>
            {P.notes.slice(1, 3).map((n, i) => (
              <FeatureNote key={i} n={n} c={c} />
            ))}
          </div>
          <div style={{ display: "grid", gap: 24, alignContent: "start" }}>
            <FeatureNote n={P.notes[3]} c={c} />
            <div
              style={{
                padding: 16,
                background: c.bg,
                border: `1px solid ${c.rule}`,
              }}
            >
              <div className="o3-kicker" style={{ marginBottom: 8 }}>
                Subscribe
              </div>
              <div
                style={{
                  fontFamily: display,
                  fontSize: 18,
                  color: c.ink,
                  lineHeight: 1.2,
                  marginBottom: 10,
                }}
              >
                Dispatches, monthly.
              </div>
              <input
                placeholder="you@domain.dev"
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  background: c.bg,
                  border: `1px solid ${c.rule}`,
                  color: c.ink,
                  fontFamily: mono,
                  fontSize: 12,
                  marginBottom: 6,
                  outline: "none",
                }}
              />
              <button
                style={{
                  width: "100%",
                  padding: 8,
                  background: c.ink,
                  color: c.bg,
                  border: "none",
                  fontFamily: mono,
                  fontSize: 11,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Subscribe →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "80px 40px" }}>
        <div className="o3-kicker" style={{ marginBottom: 20 }}>
          Colophon · Contact
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: 64,
            alignItems: "end",
          }}
        >
          <h2
            style={{
              fontFamily: display,
              fontWeight: 400,
              fontSize: 96,
              lineHeight: 0.92,
              letterSpacing: -3,
              margin: 0,
              color: c.ink,
            }}
          >
            <span style={{ fontStyle: "italic", fontWeight: 300 }}>Write,</span> and
            <br />
            I&apos;ll write back<span style={{ color: c.accent }}>.</span>
          </h2>
          <div style={{ fontFamily: serif }}>
            {(
              [
                ["email", P.email],
                ["github", P.github],
                ["linkedin", P.linkedin],
                ["location", P.location],
                ["best for", "SWE interviews · real-time systems"],
              ] as const
            ).map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 1fr",
                  padding: "10px 0",
                  borderBottom: `1px solid ${c.rule}`,
                  alignItems: "baseline",
                  gap: 16,
                }}
              >
                <div className="o3-kicker">{k}</div>
                <div style={{ fontSize: 16, color: c.ink }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MASTHEAD FOOTER */}
      <footer
        style={{
          padding: "32px 40px",
          borderTop: `2px solid ${c.ink}`,
          background: c.cover,
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: 32,
          fontFamily: mono,
          fontSize: 11,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: display,
              fontSize: 20,
              letterSpacing: 2,
              color: c.ink,
              marginBottom: 8,
            }}
          >
            G.MARSHALL — FIELD NOTES
          </div>
          <div style={{ color: c.sub, lineHeight: 1.6 }}>
            Set in Fraunces &amp; Inter. Built in React. Hosted on the open web.
            <br />
            Best read with a coffee and something loud in the background.
          </div>
        </div>
        <div>
          <div className="o3-kicker" style={{ marginBottom: 8 }}>
            Masthead
          </div>
          <div style={{ color: c.ink, lineHeight: 1.7 }}>
            Editor · Gray Marshall
            <br />
            Engineering · Gray Marshall
            <br />
            Design · Gray Marshall
          </div>
        </div>
        <div>
          <div className="o3-kicker" style={{ marginBottom: 8 }}>
            Publication
          </div>
          <div style={{ color: c.ink, lineHeight: 1.7 }}>
            Vol. 03 · 2026
            <br />© Gray Marshall
            <br />
            Austin, Texas
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
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr",
        gap: 24,
        alignItems: "baseline",
        borderBottom: compact ? "none" : `2px solid ${c.ink}`,
        paddingBottom: compact ? 0 : 20,
      }}
    >
      <div
        style={{
          fontFamily: display,
          fontSize: 48,
          fontStyle: "italic",
          color: c.accent,
          fontWeight: 300,
          lineHeight: 0.9,
        }}
      >
        {roman}
      </div>
      <div>
        <div className="o3-kicker">{kicker}</div>
        <div
          style={{
            fontFamily: display,
            fontSize: 48,
            lineHeight: 1,
            color: c.ink,
            fontWeight: 400,
            letterSpacing: -1,
            marginTop: 4,
          }}
        >
          {title}
        </div>
        {sub && (
          <div
            style={{
              color: c.sub,
              fontSize: 14,
              fontFamily: "inherit",
              marginTop: 6,
              fontStyle: "italic",
            }}
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
    <a
      href="#"
      className="o3-feat"
      style={{
        display: "grid",
        gridTemplateColumns: flip ? "1fr 1.4fr" : "1.4fr 1fr",
        gap: 40,
        textDecoration: "none",
        color: "inherit",
        alignItems: "center",
      }}
    >
      <div
        style={{
          gridColumn: flip ? 2 : 1,
          gridRow: 1,
          aspectRatio: "16/10",
          overflow: "hidden",
          position: "relative",
          border: `1px solid ${c.rule}`,
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
            className="o3-img"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image}
            alt={p.title}
            className="o3-img"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            fontFamily: mono,
            fontSize: 9,
            color: c.ink,
            background: c.bg,
            padding: "3px 8px",
            letterSpacing: 2,
            textTransform: "uppercase",
            border: `1px solid ${c.rule}`,
          }}
        >
          FIG. 0{idx + 2} · {p.slug}
        </div>
      </div>
      <div style={{ gridColumn: flip ? 1 : 2 }}>
        <div
          style={{
            fontFamily: mono,
            fontSize: 10,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: c.sub,
            marginBottom: 12,
          }}
        >
          Case {String(idx + 1).padStart(2, "0")} ·{" "}
          <span style={{ color: p.status === "Live" ? c.accent : c.sub }}>{p.status}</span> ·{" "}
          {p.year}
        </div>
        <h3
          className="o3-title"
          style={{
            fontFamily: display,
            fontSize: 44,
            lineHeight: 0.98,
            margin: "0 0 12px",
            fontWeight: 400,
            letterSpacing: -1,
            color: c.ink,
          }}
        >
          {p.title}
        </h3>
        <div
          style={{
            fontFamily: serif,
            fontSize: 19,
            fontStyle: "italic",
            color: c.sub,
            lineHeight: 1.4,
            marginBottom: 20,
          }}
        >
          {p.tagline}
        </div>
        <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
          {p.bullets.map((b, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "20px 1fr",
                fontSize: 14,
                lineHeight: 1.5,
                color: c.ink,
              }}
            >
              <span
                style={{ color: c.accent, fontFamily: display, fontStyle: "italic" }}
              >
                ›
              </span>
              <span>{b}</span>
            </div>
          ))}
        </div>
        {p.metrics && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 0,
              borderTop: `1px solid ${c.ink}`,
              marginBottom: 16,
            }}
          >
            {p.metrics.map((m, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 0",
                  borderRight:
                    i < (p.metrics?.length ?? 0) - 1 ? `1px solid ${c.rule}` : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: display,
                    fontSize: 28,
                    color: c.ink,
                    fontWeight: 400,
                    letterSpacing: -0.5,
                    lineHeight: 1,
                  }}
                >
                  {m.v}
                </div>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 9,
                    color: c.sub,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginTop: 4,
                  }}
                >
                  {m.k}
                </div>
              </div>
            ))}
          </div>
        )}
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            fontFamily: mono,
            fontSize: 11,
          }}
        >
          <span style={{ color: c.sub }}>{p.tech.join(" · ")}</span>
          <span style={{ marginLeft: "auto", color: c.accent }}>Read the case study →</span>
        </div>
      </div>
    </a>
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
      style={{ display: "block", textDecoration: "none", color: "inherit" }}
      className="o3-feat"
    >
      <div className="o3-kicker" style={{ marginBottom: 10, color: c.accent }}>
        #{n.tag} · {n.date}
      </div>
      <div
        className="o3-title"
        style={{
          fontFamily: display,
          fontSize: lead ? 40 : 22,
          lineHeight: lead ? 1 : 1.2,
          color: c.ink,
          fontWeight: 400,
          letterSpacing: lead ? -1 : 0,
          marginBottom: 10,
        }}
      >
        {n.title}
      </div>
      {lead && (
        <div
          style={{
            fontFamily: serif,
            fontSize: 16,
            fontStyle: "italic",
            color: c.sub,
            lineHeight: 1.5,
            marginBottom: 12,
          }}
        >
          A field report on building a distributed telemetry stack that delivers race-car
          bytes to a driver dashboard in under 20 milliseconds — what worked, what didn&apos;t,
          what I&apos;d do again.
        </div>
      )}
      <div
        style={{
          fontFamily: mono,
          fontSize: 10,
          color: c.sub,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {n.read} · Read →
      </div>
    </a>
  );
}

function LiveTelemetry({ c }: { c: Palette }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setT((x) => x + 1), 200);
    return () => window.clearInterval(id);
  }, []);

  const wave = Array.from({ length: 40 }, (_, i) => {
    const x = i;
    const y = 20 + Math.sin((i + t * 0.4) * 0.35) * 8 + Math.sin((i + t * 0.2) * 0.7) * 4;
    return `${x * 8},${y}`;
  }).join(" ");

  const mph = Math.round(58 + Math.sin(t * 0.15) * 8);
  const kw = Math.round(42 + Math.sin(t * 0.18) * 6);
  const tempMotor = Math.round(68 + Math.sin(t * 0.1) * 2);

  return (
    <div
      style={{
        marginTop: 12,
        padding: 14,
        border: `1px solid ${c.rule}`,
        background: c.card,
        fontFamily: mono,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
          fontSize: 9,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: c.sub,
        }}
      >
        <span>Live · Telemetry</span>
        <span style={{ color: c.accent }}>● streaming</span>
      </div>
      <svg viewBox="0 0 320 40" style={{ width: "100%", height: 30 }}>
        <polyline points={wave} fill="none" stroke={c.accent} strokeWidth="1.2" />
      </svg>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          marginTop: 8,
          fontSize: 10,
        }}
      >
        <div>
          <div
            style={{
              color: c.sub,
              fontSize: 8,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            speed
          </div>
          <div style={{ color: c.ink, fontSize: 14 }}>{mph} mph</div>
        </div>
        <div>
          <div
            style={{
              color: c.sub,
              fontSize: 8,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            pack
          </div>
          <div style={{ color: c.ink, fontSize: 14 }}>{kw} kw</div>
        </div>
        <div>
          <div
            style={{
              color: c.sub,
              fontSize: 8,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            motor
          </div>
          <div style={{ color: c.ink, fontSize: 14 }}>{tempMotor}°C</div>
        </div>
      </div>
    </div>
  );
}
