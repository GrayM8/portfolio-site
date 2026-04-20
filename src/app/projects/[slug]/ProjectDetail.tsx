"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";
import {
  PORTFOLIO,
  type AnyProject,
  type FeaturedProject,
} from "@/data/portfolio";
import { paletteFor, paletteToVars } from "@/components/editorial/palette";
import { useModeTheme } from "@/components/ModeThemeProvider";

const WRAP = "mx-auto w-full max-w-[1440px]";
const PAD = "px-5 sm:px-8 md:px-10 lg:px-12";

function hasMetrics(p: AnyProject): p is FeaturedProject {
  return Array.isArray((p as FeaturedProject).metrics) && Boolean((p as FeaturedProject).metrics?.length);
}

function hasBullets(p: AnyProject): p is FeaturedProject {
  return Array.isArray((p as FeaturedProject).bullets) && (p as FeaturedProject).bullets.length > 0;
}

function normalizeUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

export function ProjectDetail({ project }: { project: AnyProject }) {
  const { theme } = useModeTheme();
  const c = paletteFor(theme);
  const cssVars = paletteToVars(c);

  const related = [
    ...PORTFOLIO.featured,
    ...PORTFOLIO.projects.filter(
      (p): p is typeof p & { slug: string } => Boolean(p.slug),
    ),
  ]
    .filter((p) => p.slug !== project.slug)
    .slice(0, 3);

  const statusColor = project.status === "Live" ? c.accent : c.sub;
  const video = (project as FeaturedProject).video;
  const bullets = hasBullets(project) ? project.bullets : [];
  const metrics = hasMetrics(project) ? project.metrics ?? [] : [];

  return (
    <div
      style={cssVars}
      className="min-h-screen bg-[color:var(--bg)] text-[color:var(--ink)] font-sans text-[14px] leading-[1.55]"
    >
      <style>{`
        .pd-link { color: inherit; text-decoration: none; position: relative; padding-bottom: 3px; display: inline-block; }
        .pd-link::after { content:''; position:absolute; left:0; right:0; bottom:0; height:1px; background:currentColor; transform: scaleX(0); transform-origin: right; transition: transform .25s ease; }
        .pd-link:hover::after { transform: scaleX(1); transform-origin: left; }
        .pd-link:hover { color: var(--accent); }
        .pd-kicker { font-family: var(--font-mono); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--sub); }
        .pd-card { transition: border-color .2s ease; }
        .pd-card:hover { border-color: var(--accent); }
        .pd-card:hover .pd-card-title { color: var(--accent); }
        .pd-card-title { transition: color .2s ease; }
      `}</style>

      {/* top bar */}
      <header
        className="sticky top-0 z-40 border-b bg-[color:var(--bg)]/95 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--bg)]/80"
        style={{ borderColor: c.rule }}
      >
        <div
          className={`${WRAP} ${PAD} py-3 md:py-3.5 flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-widest`}
          style={{ color: c.sub }}
        >
          <Link
            href="/#index"
            className="pd-link flex items-center gap-2 shrink-0"
          >
            <ArrowLeft size={13} strokeWidth={1.75} aria-hidden />
            <span>Back to index</span>
          </Link>
          <Link href="/" className="pd-link hidden sm:inline-block">
            <span style={{ color: c.accent }}>G.</span>Marshall
          </Link>
        </div>
      </header>

      {/* hero */}
      <section
        className="border-b"
        style={{ borderColor: c.rule }}
      >
        <div className={`${WRAP} ${PAD} py-12 md:py-16 lg:py-20`}>
          <div className="pd-kicker mb-5 flex items-center gap-3">
            <span style={{ color: statusColor }}>
              {project.status === "Live" ? "●" : "○"} {project.status}
            </span>
            <span style={{ color: c.rule }}>/</span>
            <span>{project.year}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 md:gap-10 lg:gap-14 items-start">
            <div className="min-w-0">
              <h1
                className="font-serif font-normal m-0"
                style={{
                  color: c.ink,
                  fontSize: "clamp(40px, 7vw, 84px)",
                  lineHeight: 0.95,
                  letterSpacing: "clamp(-1.5px, -0.4vw, -3px)",
                }}
              >
                {project.title}
                <span style={{ color: c.accent }}>.</span>
              </h1>
              <p
                className="font-serif italic mt-5 md:mt-6 text-[17px] md:text-[19px] lg:text-[20px] leading-[1.4]"
                style={{ color: c.sub }}
              >
                {project.tagline}
              </p>

              {(project.link || project.repo) && (
                <div className="flex flex-wrap gap-3 mt-7 md:mt-8 font-mono text-[11px] uppercase tracking-widest">
                  {project.link && (
                    <a
                      href={normalizeUrl(project.link)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 border"
                      style={{
                        background: c.ink,
                        color: c.bg,
                        borderColor: c.ink,
                      }}
                    >
                      <ExternalLink size={13} strokeWidth={1.75} aria-hidden />
                      <span>Visit live</span>
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={normalizeUrl(project.repo)}
                      target="_blank"
                      rel="noreferrer"
                      className="pd-card inline-flex items-center gap-2 px-4 py-2.5 border"
                      style={{
                        background: "transparent",
                        color: c.ink,
                        borderColor: c.rule,
                      }}
                    >
                      <Github size={13} strokeWidth={1.75} aria-hidden />
                      <span>Source</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {(project.image || video) && (
              <div
                className="relative overflow-hidden border w-full"
                style={{
                  aspectRatio: video ? "5 / 3" : "16 / 10",
                  borderColor: c.rule,
                  background: c.soft,
                }}
              >
                {video ? (
                  <video
                    src={video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover block"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover block"
                  />
                )}
                <div
                  className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border"
                  style={{
                    background: c.bg,
                    borderColor: c.rule,
                    color: c.ink,
                  }}
                >
                  FIG. · {project.slug}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* body: content + sidebar */}
      <section className="border-b" style={{ borderColor: c.rule }}>
        <div
          className={`${WRAP} ${PAD} py-12 md:py-16 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-14`}
        >
          <div className="min-w-0 space-y-10 md:space-y-12">
            {project.overview && (
              <article>
                <div className="pd-kicker mb-4">Overview</div>
                <p
                  className="font-serif text-[16px] md:text-[18px] leading-[1.55]"
                  style={{ color: c.ink }}
                >
                  {project.overview}
                </p>
              </article>
            )}

            {bullets.length > 0 && (
              <article>
                <div className="pd-kicker mb-4">Highlights</div>
                <ul className="list-none p-0 m-0 grid gap-3.5">
                  {bullets.map((b, i) => (
                    <li
                      key={i}
                      className="grid grid-cols-[20px_1fr] text-[15px] md:text-[16px] leading-[1.55]"
                      style={{ color: c.ink }}
                    >
                      <span
                        className="font-serif italic"
                        style={{ color: c.accent }}
                      >
                        ›
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )}

            {(project.detailBullets ?? []).length > 0 && (
              <article>
                <div className="pd-kicker mb-4">Notes</div>
                <ul className="list-none p-0 m-0 grid gap-3.5">
                  {(project.detailBullets ?? []).map((b, i) => (
                    <li
                      key={i}
                      className="grid grid-cols-[20px_1fr] text-[15px] leading-[1.55]"
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
              </article>
            )}

            {metrics.length > 0 && (
              <article>
                <div className="pd-kicker mb-4">By the numbers</div>
                <div
                  className="grid grid-cols-3 border-t border-b"
                  style={{ borderColor: c.ink }}
                >
                  {metrics.map((m, i) => (
                    <div
                      key={i}
                      className="py-6 md:py-7 px-3 md:px-4"
                      style={{
                        borderRight:
                          i < metrics.length - 1
                            ? `1px solid ${c.rule}`
                            : "none",
                      }}
                    >
                      <div
                        className="font-serif font-normal leading-none"
                        style={{
                          color: c.ink,
                          fontSize: "clamp(26px, 3.5vw, 36px)",
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
              </article>
            )}
          </div>

          {/* sidebar */}
          <aside className="grid gap-5 content-start">
            <div
              className="border p-5 font-mono"
              style={{ borderColor: c.rule, background: c.card }}
            >
              <div className="pd-kicker mb-3">Tech stack</div>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2.5 py-1 border"
                    style={{ borderColor: c.rule, color: c.ink }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="border p-5 font-mono"
              style={{ borderColor: c.rule, background: c.card }}
            >
              <div className="pd-kicker mb-3">Links</div>
              <div className="grid gap-2.5">
                {project.link && (
                  <a
                    href={normalizeUrl(project.link)}
                    target="_blank"
                    rel="noreferrer"
                    className="pd-link flex items-center gap-2 text-[12px]"
                    style={{ color: c.ink }}
                  >
                    <ExternalLink size={12} strokeWidth={1.75} aria-hidden />
                    <span>{project.link}</span>
                  </a>
                )}
                {project.repo && (
                  <a
                    href={normalizeUrl(project.repo)}
                    target="_blank"
                    rel="noreferrer"
                    className="pd-link flex items-center gap-2 text-[12px]"
                    style={{ color: c.ink }}
                  >
                    <Github size={12} strokeWidth={1.75} aria-hidden />
                    <span>{project.repo}</span>
                  </a>
                )}
                {!project.link && !project.repo && (
                  <span
                    className="text-[12px] italic"
                    style={{ color: c.sub }}
                  >
                    No public links yet.
                  </span>
                )}
              </div>
            </div>

            <div
              className="border p-5 font-mono"
              style={{ borderColor: c.rule, background: c.card }}
            >
              <div className="pd-kicker mb-3">Dates</div>
              <div className="grid gap-1.5 text-[12px]">
                <div>
                  <span style={{ color: c.sub }}>Year</span>
                  <div style={{ color: c.ink }}>{project.year}</div>
                </div>
                <div>
                  <span style={{ color: c.sub }}>Status</span>
                  <div style={{ color: statusColor }}>{project.status}</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* related */}
      {related.length > 0 && (
        <section>
          <div className={`${WRAP} ${PAD} py-12 md:py-16`}>
            <div className="pd-kicker mb-5 flex items-center gap-3">
              <span>Other work</span>
              <span
                aria-hidden
                className="flex-1 h-px"
                style={{ background: c.rule }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/projects/${r.slug}`}
                  className="pd-card block border p-5 no-underline"
                  style={{
                    borderColor: c.rule,
                    background: c.card,
                    color: c.ink,
                  }}
                >
                  <div
                    className="pd-kicker mb-2"
                    style={{
                      color: r.status === "Live" ? c.accent : c.sub,
                    }}
                  >
                    {r.status} · {r.year}
                  </div>
                  <div
                    className="pd-card-title font-serif font-normal text-[20px] leading-[1.15]"
                    style={{ color: c.ink }}
                  >
                    {r.title}
                  </div>
                  <div
                    className="font-serif italic text-[13px] mt-1.5"
                    style={{ color: c.sub }}
                  >
                    {r.tagline}
                  </div>
                  <div
                    className="font-mono text-[10px] mt-3 flex items-center justify-between"
                    style={{ color: c.sub, letterSpacing: 0.5 }}
                  >
                    <span>{r.tech.slice(0, 3).join(" · ")}</span>
                    <ArrowRight size={12} strokeWidth={1.75} aria-hidden />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
