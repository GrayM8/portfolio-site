"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { PORTFOLIO, type FeaturedProject, type Portfolio } from "@/data/portfolio";
import { useModeTheme } from "../ModeThemeProvider";

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
const sans = "var(--font-sans), -apple-system, sans-serif";

export function TerminalSite() {
  const { theme } = useModeTheme();
  const c = theme === "dark" ? o2Styles.dark : o2Styles.light;
  const P = PORTFOLIO;

  return (
    <div
      style={{
        background: c.bg,
        color: c.ink,
        fontFamily: mono,
        minHeight: "100%",
        fontSize: 13,
        lineHeight: 1.55,
      }}
    >
      <style>{`
        .o2-btn { transition: all .15s; cursor: pointer; }
        .o2-btn:hover { background: ${c.accent} !important; color: ${c.bg} !important; border-color: ${c.accent} !important; }
        .o2-row:hover { background: ${c.panel} !important; }
        .o2-row:hover .o2-arr { color: ${c.accent} !important; transform: translateX(4px); }
        .o2-arr { transition: transform .15s, color .15s; display: inline-block; }
        .o2-card { transition: border-color .15s; }
        .o2-card:hover { border-color: ${c.accent}; }
        @keyframes o2-cursor { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }
        .o2-cursor { animation: o2-cursor 1s step-end infinite; }
      `}</style>

      {/* TOP BAR */}
      <header
        style={{
          borderBottom: `1px solid ${c.rule}`,
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 11,
          letterSpacing: 0.3,
        }}
      >
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <div style={{ fontWeight: 700, letterSpacing: 1.5 }}>
            <span style={{ color: c.accent }}>$</span>&nbsp;gray@austin:
            <span style={{ color: c.blue }}>~</span>
          </div>
          <div style={{ display: "flex", gap: 14, color: c.sub }}>
            {["work", "now", "notes", "cv", "contact"].map((x) => (
              <a
                key={x}
                href={`#${x}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <span style={{ color: c.accent }}>/</span>
                {x}
              </a>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center", color: c.sub }}>
          <span>
            status: <span style={{ color: c.green }}>available</span>
          </span>
          <span>tz: CST</span>
        </div>
      </header>

      {/* HERO — terminal + identity card */}
      <section
        style={{
          padding: 24,
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 16,
          borderBottom: `1px solid ${c.rule}`,
        }}
      >
        <Terminal c={c} P={P} />
        <IdentityCard c={c} P={P} />
      </section>

      {/* STATS STRIP */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          borderBottom: `1px solid ${c.rule}`,
        }}
      >
        {(
          [
            ["years coding", "6"],
            ["projects shipped", "12"],
            ["org founded", "1"],
            ["race cars", "1"],
            ["languages", "7"],
            ["coffees/day", "3"],
          ] as const
        ).map(([k, v], i) => (
          <div
            key={k}
            style={{
              padding: "20px 24px",
              borderRight: i < 5 ? `1px solid ${c.rule}` : "none",
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontFamily: sans,
                fontWeight: 700,
                letterSpacing: -1,
                color: c.ink,
              }}
            >
              {v}
            </div>
            <div
              style={{
                fontSize: 10,
                color: c.sub,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              {k}
            </div>
          </div>
        ))}
      </section>

      {/* FEATURED */}
      <section
        id="work"
        style={{ padding: 24, borderBottom: `1px solid ${c.rule}` }}
      >
        <H
          c={c}
          num="01"
          t="featured_projects"
          note={`ls -la ./featured  (${P.featured.length} items)`}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginTop: 20,
          }}
        >
          {P.featured.map((p) => (
            <FeatProj key={p.slug} p={p} c={c} />
          ))}
        </div>
      </section>

      {/* NOW */}
      <section
        id="now"
        style={{
          padding: 24,
          borderBottom: `1px solid ${c.rule}`,
          background: c.panel,
        }}
      >
        <H
          c={c}
          num="02"
          t="/now"
          note={`cat ~/.now  (updated ${new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })})`}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginTop: 16,
          }}
        >
          {P.now.map((n, i) => (
            <div
              key={i}
              style={{
                padding: 16,
                background: c.bg,
                border: `1px solid ${c.rule}`,
              }}
            >
              <div style={{ color: c.accent, fontSize: 10, marginBottom: 6 }}>
                [{String(i).padStart(2, "0")}]{" "}
                <span style={{ color: c.sub }}>{n.where}</span>
              </div>
              <div style={{ fontSize: 13, color: c.ink, lineHeight: 1.45 }}>{n.what}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECT INDEX */}
      <section style={{ padding: 24, borderBottom: `1px solid ${c.rule}` }}>
        <H c={c} num="03" t="project_index" note="all" />
        <div style={{ marginTop: 16, border: `1px solid ${c.rule}` }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "50px 60px 1fr 2fr 2fr 80px 40px",
              padding: "10px 16px",
              background: c.panel,
              borderBottom: `1px solid ${c.rule}`,
              fontSize: 10,
              color: c.sub,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            <div>#</div>
            <div>yr</div>
            <div>name</div>
            <div>tagline</div>
            <div>stack</div>
            <div>status</div>
            <div></div>
          </div>
          {P.projects.map((p, i) => (
            <div
              key={i}
              className="o2-row"
              style={{
                display: "grid",
                gridTemplateColumns: "50px 60px 1fr 2fr 2fr 80px 40px",
                padding: "12px 16px",
                borderBottom:
                  i < P.projects.length - 1 ? `1px solid ${c.rule}` : "none",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <div style={{ color: c.sub }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ color: c.sub }}>{p.year}</div>
              <div style={{ color: c.ink, fontWeight: 600 }}>{p.title}</div>
              <div style={{ color: c.sub }}>{p.tagline}</div>
              <div style={{ color: c.blue, fontSize: 11 }}>{p.tech.join(" ")}</div>
              <div
                style={{
                  color: p.status === "Live" ? c.green : c.sub,
                  fontSize: 10,
                }}
              >
                {p.status.toLowerCase()}
              </div>
              <div className="o2-arr" style={{ color: c.sub, textAlign: "right" }}>
                →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE + EDUCATION */}
      <section
        style={{
          padding: 24,
          borderBottom: `1px solid ${c.rule}`,
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
        }}
      >
        <div>
          <H c={c} num="04" t="experience" note="current" />
          <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
            {P.experience.map((e, i) => (
              <div
                key={i}
                className="o2-card"
                style={{
                  padding: 20,
                  border: `1px solid ${c.rule}`,
                  background: c.panel,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: c.bg,
                      border: `1px solid ${c.rule}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
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
                          padding: 4,
                        }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: sans,
                        fontSize: 17,
                        fontWeight: 600,
                        color: c.ink,
                      }}
                    >
                      {e.title}
                    </div>
                    <div style={{ color: c.sub, fontSize: 11 }}>
                      {e.org} · {e.location}
                    </div>
                  </div>
                  <div style={{ color: c.accent, fontSize: 10, textAlign: "right" }}>
                    {e.period}
                    <br />
                    <span style={{ color: c.sub }}>{e.tenure}</span>
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gap: 4,
                    fontSize: 12,
                    color: c.ink,
                    marginBottom: 12,
                  }}
                >
                  {e.bullets.map((b, j) => (
                    <div
                      key={j}
                      style={{ display: "grid", gridTemplateColumns: "14px 1fr" }}
                    >
                      <span style={{ color: c.accent }}>{">"}</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {e.skills.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: 10,
                        padding: "2px 8px",
                        background: c.bg,
                        border: `1px solid ${c.rule}`,
                        color: c.sub,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <H c={c} num="05" t="edu" note="" />
          <div
            style={{
              marginTop: 16,
              padding: 20,
              border: `1px solid ${c.rule}`,
              background: c.panel,
            }}
          >
            {P.education.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={P.education.logo}
                alt=""
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "contain",
                  marginBottom: 12,
                }}
              />
            )}
            <div
              style={{
                fontFamily: sans,
                fontSize: 17,
                fontWeight: 600,
                color: c.ink,
                lineHeight: 1.25,
              }}
            >
              {P.education.school}
            </div>
            <div style={{ color: c.sub, fontSize: 11, marginTop: 4 }}>
              {P.education.degree}
            </div>
            <div style={{ color: c.accent, fontSize: 11, marginTop: 4 }}>
              {P.education.period}
            </div>
            <div
              style={{
                marginTop: 16,
                paddingTop: 12,
                borderTop: `1px solid ${c.rule}`,
              }}
            >
              <div
                style={{
                  color: c.sub,
                  fontSize: 10,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                coursework
              </div>
              <div style={{ display: "grid", gap: 4, fontSize: 11 }}>
                {P.education.coursework.map((cc) => (
                  <div key={cc} style={{ color: c.ink }}>
                    <span style={{ color: c.green }}>✓</span> {cc}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS MATRIX */}
      <section
        style={{
          padding: 24,
          borderBottom: `1px solid ${c.rule}`,
          background: c.panel,
        }}
      >
        <H c={c} num="06" t="/skills" note="grep -r ~/stack" />
        <div
          style={{
            marginTop: 16,
            background: c.bg,
            border: `1px solid ${c.rule}`,
          }}
        >
          {Object.entries(P.skills).map(([cat, items], i, arr) => (
            <div
              key={cat}
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr",
                borderBottom: i < arr.length - 1 ? `1px solid ${c.rule}` : "none",
              }}
            >
              <div
                style={{
                  padding: "14px 16px",
                  color: c.accent,
                  fontSize: 11,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  borderRight: `1px solid ${c.rule}`,
                  background: c.panel,
                }}
              >
                {cat.toLowerCase().replace(/\s/g, "_")}
              </div>
              <div
                style={{
                  padding: "14px 16px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 4,
                }}
              >
                {items.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: 11,
                      padding: "3px 10px",
                      border: `1px solid ${c.rule}`,
                      color: c.ink,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NOTES */}
      <section
        id="notes"
        style={{ padding: 24, borderBottom: `1px solid ${c.rule}` }}
      >
        <H c={c} num="07" t="notes" note={`cd ~/writing && ls`} />
        <div style={{ marginTop: 16, border: `1px solid ${c.rule}` }}>
          {P.notes.map((n, i) => (
            <a
              key={i}
              href="#"
              className="o2-row"
              style={{
                display: "grid",
                gridTemplateColumns: "80px 60px 1fr 80px 40px",
                padding: "14px 16px",
                alignItems: "center",
                textDecoration: "none",
                color: c.ink,
                borderBottom:
                  i < P.notes.length - 1 ? `1px solid ${c.rule}` : "none",
              }}
            >
              <div style={{ color: c.sub, fontSize: 11 }}>{n.date}</div>
              <div style={{ color: c.accent, fontSize: 10 }}>#{n.tag}</div>
              <div style={{ fontFamily: sans, fontSize: 15, fontWeight: 500 }}>
                {n.title}
              </div>
              <div style={{ color: c.sub, fontSize: 11, textAlign: "right" }}>
                {n.read}
              </div>
              <div className="o2-arr" style={{ color: c.sub, textAlign: "right" }}>
                ↗
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "40px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: c.sub,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              08 / /contact
            </div>
            <div
              style={{
                fontFamily: sans,
                fontSize: 48,
                fontWeight: 700,
                letterSpacing: -2,
                lineHeight: 1,
                color: c.ink,
              }}
            >
              want to build
              <br />
              something
              <span style={{ color: c.accent }}> together</span>?
            </div>
            <div style={{ color: c.sub, marginTop: 16, fontSize: 13 }}>
              Best for: SWE internship convos · real-time systems · web platforms
              <br />
              Reply time: usually within 24h
            </div>
          </div>
          <div
            style={{
              border: `1px solid ${c.rule}`,
              background: c.panel,
              padding: 20,
            }}
          >
            <div
              style={{
                color: c.sub,
                fontSize: 10,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              $ contact --all
            </div>
            {(
              [
                ["email", P.email, c.accent],
                ["github", P.github, c.ink],
                ["linkedin", P.linkedin, c.ink],
                ["resume", "~/Downloads/gray-marshall.pdf", c.ink],
                ["location", `${P.location} · UTC-6`, c.sub],
              ] as const
            ).map(([k, v, col]) => (
              <div
                key={k}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr",
                  padding: "6px 0",
                }}
              >
                <div style={{ color: c.sub }}>{k}</div>
                <div style={{ color: col }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer
        style={{
          padding: "16px 24px",
          borderTop: `1px solid ${c.rule}`,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
          color: c.sub,
          letterSpacing: 0.3,
        }}
      >
        <div>© 2026 gray marshall · built with typescript &amp; taste</div>
        <div>
          last deploy: 4h ago · <span style={{ color: c.green }}>●</span> all systems
          nominal
        </div>
      </footer>
    </div>
  );
}

function H({
  c,
  num,
  t,
  note,
}: {
  c: Palette;
  num: string;
  t: string;
  note?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        paddingBottom: 10,
        borderBottom: `1px solid ${c.rule}`,
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
        <span style={{ color: c.accent, fontSize: 11, letterSpacing: 1 }}>§{num}</span>
        <h2
          style={{
            fontFamily: "inherit",
            fontSize: 14,
            margin: 0,
            fontWeight: 700,
            color: c.ink,
            letterSpacing: 0,
          }}
        >
          <span style={{ color: c.accent }}>~/</span>
          {t}
        </h2>
      </div>
      {note && <div style={{ fontSize: 10, color: c.sub }}>{note}</div>}
    </div>
  );
}

function FeatProj({ p, c }: { p: FeaturedProject; c: Palette }) {
  return (
    <a
      href="#"
      className="o2-card"
      style={{
        display: "block",
        border: `1px solid ${c.rule}`,
        background: c.panel,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "16/10",
          overflow: "hidden",
          background: c.panel2,
          borderBottom: `1px solid ${c.rule}`,
        }}
      >
        {p.video ? (
          <video
            src={p.video}
            autoPlay
            loop
            muted
            playsInline
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
            top: 0,
            left: 0,
            right: 0,
            padding: "6px 10px",
            fontSize: 10,
            color: c.ink,
            background: `linear-gradient(to bottom, ${c.bg}f0, transparent)`,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>// {p.slug}</span>
          <span
            style={{ color: p.status === "Live" ? c.green : c.accent }}
          >
            ● {p.status.toLowerCase()}
          </span>
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <div
          style={{
            fontFamily: sans,
            fontSize: 18,
            fontWeight: 700,
            color: c.ink,
            letterSpacing: -0.3,
            lineHeight: 1.2,
            marginBottom: 4,
          }}
        >
          {p.title}
        </div>
        <div style={{ color: c.sub, fontSize: 12, marginBottom: 14 }}>
          {p.tagline}
        </div>
        {p.metrics && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 0,
              border: `1px solid ${c.rule}`,
              marginBottom: 12,
            }}
          >
            {p.metrics.map((m, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 6px",
                  textAlign: "center",
                  borderRight:
                    i < (p.metrics?.length ?? 0) - 1 ? `1px solid ${c.rule}` : "none",
                  background: c.bg,
                }}
              >
                <div
                  style={{
                    fontFamily: sans,
                    fontSize: 16,
                    fontWeight: 700,
                    color: c.ink,
                    letterSpacing: -0.5,
                  }}
                >
                  {m.v}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: c.sub,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    marginTop: 2,
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
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 10,
            fontSize: 10,
            color: c.sub,
          }}
        >
          {p.tech.slice(0, 4).join(" · ")}
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            fontSize: 11,
            paddingTop: 10,
            borderTop: `1px solid ${c.rule}`,
          }}
        >
          {p.link && <span style={{ color: c.blue }}>↗ visit</span>}
          {p.repo && <span style={{ color: c.sub }}>git</span>}
          <span style={{ marginLeft: "auto", color: c.accent }}>case study →</span>
        </div>
      </div>
    </a>
  );
}

function IdentityCard({ c, P }: { c: Palette; P: Portfolio }) {
  return (
    <div
      style={{
        border: `1px solid ${c.rule}`,
        background: c.panel,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", gap: 14 }}>
        <div
          style={{
            width: 64,
            height: 64,
            overflow: "hidden",
            border: `1px solid ${c.rule}`,
            flexShrink: 0,
            filter: "grayscale(0.3) contrast(1.05)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/headshot.jpg"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div>
          <div
            style={{
              fontFamily: sans,
              fontSize: 22,
              fontWeight: 700,
              color: c.ink,
              letterSpacing: -0.5,
              lineHeight: 1.1,
            }}
          >
            Gray Marshall
          </div>
          <div style={{ color: c.sub, fontSize: 12, marginTop: 2 }}>
            Software Engineer · UT Austin &apos;28
          </div>
          <div style={{ color: c.accent, fontSize: 11, marginTop: 4 }}>
            <span style={{ color: c.green }}>●</span> open to Summer 2026 SWE
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: c.ink, lineHeight: 1.55 }}>
        Building real-time systems at{" "}
        <span style={{ color: c.accent }}>Longhorn Racing</span> and co-founded{" "}
        <span style={{ color: c.accent }}>Longhorn Sim Racing</span> as CTO. Interested in
        distributed systems, observability, and infra that stays up at 70&nbsp;mph.
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          paddingTop: 14,
          borderTop: `1px solid ${c.rule}`,
        }}
      >
        {(
          [
            ["loc", P.location],
            ["avail", "Summer 2026"],
            ["focus", "Real-time / Infra"],
            ["stack", "TS · Py · C"],
          ] as const
        ).map(([k, v]) => (
          <div key={k}>
            <div
              style={{
                color: c.sub,
                fontSize: 10,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              {k}
            </div>
            <div style={{ color: c.ink, fontSize: 12 }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
        <button
          className="o2-btn"
          style={{
            flex: 1,
            padding: 10,
            background: c.ink,
            color: c.bg,
            border: `1px solid ${c.ink}`,
            fontFamily: mono,
            fontSize: 11,
          }}
        >
          $ mail gray
        </button>
        <button
          className="o2-btn"
          style={{
            padding: "10px 14px",
            background: "transparent",
            color: c.ink,
            border: `1px solid ${c.rule}`,
            fontFamily: mono,
            fontSize: 11,
          }}
        >
          resume.pdf
        </button>
      </div>
    </div>
  );
}

type Line = { t: "out" | "cmd"; content: string; color?: "accent" | "green" | "red"; muted?: boolean };

function Terminal({ c, P }: { c: Palette; P: Portfolio }) {
  const [history, setHistory] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [booted, setBooted] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const COMMAND_NAMES = [
    "projects",
    "experience",
    "education",
    "skills",
    "contact",
    "help",
    "clear",
    "theme",
    "whoami",
    "about",
    "now",
  ];

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
      { t: "out", content: "gray marshall — software engineer" },
      {
        t: "out",
        content: "sophomore @ ut austin · cs · class of 2028",
        muted: true,
      },
      { t: "cmd", content: "cat about.md | head -3" },
      { t: "out", content: "➤ telemetry eng @ longhorn racing (fsae ev)" },
      { t: "out", content: "➤ co-founder & cto @ longhorn sim racing" },
      {
        t: "out",
        content: "➤ interested in: real-time systems, dist. systems, infra",
      },
      { t: "cmd", content: "systemctl status" },
      {
        t: "out",
        content: "● gray.service — loaded, active (running)",
        color: "green",
      },
      { t: "out", content: "  shipping: telemetry v3, lsr payments", muted: true },
      {
        t: "out",
        content: "  open to: summer 2026 swe internships",
        color: "accent",
      },
      { t: "cmd", content: "help" },
      {
        t: "out",
        content:
          "available commands: projects · experience · education · skills · contact · theme · clear",
      },
      { t: "out", content: "try typing a command below ↓", muted: true },
    ];

    let i = 0;
    let timer: number | undefined;
    const tick = () => {
      if (i < bootLines.length) {
        const line = bootLines[i];
        setHistory((h) => [...h, line]);
        i++;
        timer = window.setTimeout(tick, i < 3 ? 150 : i < 10 ? 100 : 80);
      } else {
        setBooted(true);
      }
    };
    tick();
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const commands: Record<string, () => Line[] | "CLEAR"> = {
    projects: () => [
      { t: "out", content: "FEATURED:" },
      ...P.featured.map((p) => ({
        t: "out" as const,
        content: `  ${p.slug.padEnd(10)} ${p.title}`,
        color: "accent" as const,
      })),
      { t: "out", content: "" },
      { t: "out", content: "ALL:" },
      ...P.projects.map((p) => ({
        t: "out" as const,
        content: `  ${p.year}  ${p.title}`,
        muted: true,
      })),
    ],
    experience: () =>
      P.experience.flatMap((e) => [
        {
          t: "out" as const,
          content: `▸ ${e.title} — ${e.org}`,
          color: "accent" as const,
        },
        {
          t: "out" as const,
          content: `  ${e.period} · ${e.location}`,
          muted: true,
        },
      ]),
    education: () => [
      {
        t: "out",
        content: `▸ ${P.education.school}`,
        color: "accent",
      },
      { t: "out", content: `  ${P.education.degree}`, muted: true },
      { t: "out", content: `  ${P.education.period}`, muted: true },
    ],
    skills: () =>
      Object.entries(P.skills).map(([k, v]) => ({
        t: "out" as const,
        content: `${k.padEnd(12)}${v.join(" · ")}`,
      })),
    contact: () => [
      { t: "out", content: `email    ${P.email}`, color: "accent" },
      { t: "out", content: `github   ${P.github}` },
      { t: "out", content: `linkedin ${P.linkedin}` },
    ],
    help: () => [
      {
        t: "out",
        content:
          "projects · experience · education · skills · contact · theme · clear",
      },
    ],
    clear: () => "CLEAR",
    theme: () => [{ t: "out", content: "use toggle in top-right ↗", muted: true }],
    whoami: () => [{ t: "out", content: "gray marshall — software engineer" }],
    about: () => P.about.map((line) => ({ t: "out" as const, content: line })),
    now: () =>
      P.now.map((n) => ({
        t: "out" as const,
        content: `• ${n.what} — ${n.where}`,
      })),
  };

  const runCmd = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (trimmed) setCmdHistory((h) => [trimmed, ...h].slice(0, 50));
    setHistIdx(-1);
    setHistory((h) => [...h, { t: "cmd", content: cmd }]);
    const fn = commands[trimmed];
    if (fn) {
      const result = fn();
      if (result === "CLEAR") {
        setHistory([]);
        return;
      }
      setHistory((h) => [...h, ...result]);
    } else if (trimmed) {
      setHistory((h) => [
        ...h,
        { t: "out", content: `zsh: command not found: ${trimmed}`, color: "red" },
      ]);
    }
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
      else if (matches.length > 1)
        setHistory((h) => [
          ...h,
          { t: "cmd", content: input },
          { t: "out", content: matches.join("  "), muted: true },
        ]);
    }
  };

  return (
    <div
      style={{
        background: c.panel,
        border: `1px solid ${c.rule}`,
        fontFamily: mono,
        fontSize: 12,
        display: "flex",
        flexDirection: "column",
        minHeight: 480,
      }}
    >
      {/* chrome */}
      <div
        style={{
          padding: "8px 12px",
          borderBottom: `1px solid ${c.rule}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: c.panel2,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <div
            style={{ width: 11, height: 11, borderRadius: 6, background: "#ff5f56" }}
          />
          <div
            style={{ width: 11, height: 11, borderRadius: 6, background: "#ffbd2e" }}
          />
          <div
            style={{ width: 11, height: 11, borderRadius: 6, background: "#27c93f" }}
          />
        </div>
        <div style={{ flex: 1, textAlign: "center", color: c.sub, fontSize: 11 }}>
          gray@austin ─ zsh ─ 120×32
        </div>
        <div style={{ color: c.sub, fontSize: 10 }}>⌥</div>
      </div>

      {/* content */}
      <div
        ref={scrollRef}
        style={{ flex: 1, padding: 16, overflow: "auto", minHeight: 380 }}
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((l, i) => (
          <div
            key={i}
            style={{
              color:
                l.color === "accent"
                  ? c.accent
                  : l.color === "green"
                    ? c.green
                    : l.color === "red"
                      ? "#ff5555"
                      : l.muted
                        ? c.sub
                        : c.ink,
              whiteSpace: "pre-wrap",
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
          >
            <span style={{ color: c.green }}>gray@austin</span>
            <span style={{ color: c.sub }}>:</span>
            <span style={{ color: c.blue }}>~</span>
            <span style={{ color: c.accent, marginRight: 6 }}>$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              onKeyDown={onKey}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: c.ink,
                fontFamily: mono,
                fontSize: 12,
                padding: 0,
              }}
            />
            <span
              className="o2-cursor"
              style={{
                display: "inline-block",
                width: 8,
                height: 14,
                background: c.accent,
                marginLeft: -2,
              }}
            />
          </form>
        )}
      </div>

      {/* hints */}
      <div
        style={{
          padding: "8px 12px",
          borderTop: `1px solid ${c.rule}`,
          display: "flex",
          gap: 12,
          fontSize: 10,
          color: c.sub,
          background: c.panel2,
        }}
      >
        {["projects", "experience", "skills", "contact", "help"].map((cmd) => (
          <button
            key={cmd}
            onClick={() => runCmd(cmd)}
            style={{
              background: "transparent",
              border: "none",
              color: c.sub,
              cursor: "pointer",
              fontFamily: mono,
              fontSize: 10,
              padding: 0,
            }}
          >
            <span style={{ color: c.accent }}>›</span> {cmd}
          </button>
        ))}
        <span style={{ marginLeft: "auto" }}>↑↓ history · tab to complete</span>
      </div>
    </div>
  );
}
