"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";
import {
  PORTFOLIO,
  type AnyProject,
  type FeaturedProject,
} from "@/data/portfolio";
import { EditorialFooter } from "@/components/editorial/EditorialFooter";
import { EditorialHeader } from "@/components/editorial/EditorialHeader";
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

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
function toRoman(n: number): string {
  return ROMAN[n - 1] ?? String(n);
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

  const repoList: { label: string; url: string }[] =
    project.repos && project.repos.length > 0
      ? project.repos
      : project.repo
        ? [{ label: "Source", url: project.repo }]
        : [];

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
        .pd-card { transition: border-color .2s ease, background-color .2s ease; }
        .pd-card:hover { border-color: var(--accent); }
        .pd-card:hover .pd-card-title { color: var(--accent); }
        .pd-card:hover .pd-card-arrow { transform: translateX(4px); color: var(--accent); }
        .pd-card-title { transition: color .2s ease; }
        .pd-card-arrow { transition: transform .25s ease, color .2s ease; }
        .pd-btn { transition: background-color .2s ease, border-color .2s ease, color .2s ease; }
        .pd-btn-primary { background: var(--ink); color: var(--bg); border-color: var(--ink); }
        .pd-btn-primary:hover { background: var(--accent); border-color: var(--accent); color: var(--bg); }
        .pd-btn-secondary { background: transparent; color: var(--ink); border-color: var(--rule); }
        .pd-btn-secondary:hover { border-color: var(--accent); color: var(--accent); background: color-mix(in srgb, var(--accent) 8%, transparent); }
        .pd-crumb { transition: color .2s ease, gap .2s ease; }
        .pd-crumb:hover { color: var(--accent); }
        .pd-crumb:hover svg { transform: translateX(-2px); }
        .pd-crumb svg { transition: transform .2s ease; }
        .pd-dropcap::first-letter {
          float: left;
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 300;
          font-size: 5em;
          line-height: 0.82;
          padding-right: 14px;
          padding-top: 6px;
          color: var(--accent);
        }
      `}</style>

      <EditorialHeader />

      {/* hero */}
      <section
        className="border-b"
        style={{ borderColor: c.rule }}
      >
        <div className={`${WRAP} ${PAD} py-12 md:py-16 lg:py-20`}>
          <Link
            href="/#index"
            className="pd-crumb inline-flex items-center gap-2 mb-8 md:mb-10 font-mono text-[10px] md:text-[11px] uppercase tracking-widest"
            style={{ color: c.sub }}
          >
            <ArrowLeft size={12} strokeWidth={1.75} aria-hidden />
            <span>Back to index</span>
          </Link>

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

              {(project.link || repoList.length > 0) && (
                <div className="flex flex-wrap gap-3 mt-7 md:mt-8 font-mono text-[11px] uppercase tracking-widest">
                  {project.link && (
                    <a
                      href={normalizeUrl(project.link)}
                      target="_blank"
                      rel="noreferrer"
                      className="pd-btn pd-btn-primary inline-flex items-center gap-2 px-4 py-2.5 border"
                    >
                      <ExternalLink size={13} strokeWidth={1.75} aria-hidden />
                      <span>Visit live</span>
                    </a>
                  )}
                  {repoList[0] && (
                    <a
                      href={normalizeUrl(repoList[0].url)}
                      target="_blank"
                      rel="noreferrer"
                      className="pd-btn pd-btn-secondary inline-flex items-center gap-2 px-4 py-2.5 border"
                    >
                      <Github size={13} strokeWidth={1.75} aria-hidden />
                      <span>
                        {repoList.length > 1 ? repoList[0].label : "Source"}
                      </span>
                    </a>
                  )}
                </div>
              )}
              {project.linkNote && (
                <div
                  className="mt-3 font-mono text-[10px] italic"
                  style={{ color: c.sub }}
                >
                  {project.linkNote}
                </div>
              )}
            </div>

            {(project.image || video) && (
              <div
                className="relative overflow-hidden border border-[color:var(--rule)] w-full"
                style={{
                  aspectRatio: video ? "5 / 3" : "16 / 10",
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
                  className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border border-[color:var(--rule)]"
                  style={{
                    background: c.bg,
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

      {/* metadata strip — full-width band right under the hero */}
      <div className="border-b" style={{ borderColor: c.rule, background: c.soft }}>
        <div
          className={`${WRAP} ${PAD} py-4 md:py-5 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[10px] md:text-[11px] uppercase tracking-widest`}
        >
          <span>
            <span style={{ color: c.sub }}>Year </span>
            <span style={{ color: c.ink }}>{project.year}</span>
          </span>
          <span>
            <span style={{ color: c.sub }}>Status </span>
            <span style={{ color: statusColor }}>
              {project.status === "Live" ? "●" : "○"} {project.status}
            </span>
          </span>
          <span className="flex items-center gap-x-2 gap-y-1 flex-wrap">
            <span style={{ color: c.sub }}>Stack</span>
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 border normal-case tracking-normal text-[10px]"
                style={{ borderColor: c.rule, color: c.ink }}
              >
                {t}
              </span>
            ))}
          </span>
          <span className="md:ml-auto flex items-center gap-4">
            {project.link && (
              <a
                href={normalizeUrl(project.link)}
                target="_blank"
                rel="noreferrer"
                className="pd-link inline-flex items-center gap-1.5"
                style={{ color: c.accent }}
              >
                <ExternalLink size={12} strokeWidth={1.75} aria-hidden />
                <span>Visit</span>
              </a>
            )}
            {repoList[0] && (
              <a
                href={normalizeUrl(repoList[0].url)}
                target="_blank"
                rel="noreferrer"
                className="pd-link inline-flex items-center gap-1.5"
                style={{ color: c.ink }}
              >
                <Github size={12} strokeWidth={1.75} aria-hidden />
                <span>
                  {repoList.length > 1 ? repoList[0].label : "Source"}
                </span>
              </a>
            )}
          </span>
        </div>
      </div>

      {/* reading body — single centered column */}
      <section>
        <div className={`${WRAP} ${PAD} py-14 md:py-20`}>
          <div className="mx-auto max-w-[960px] space-y-14 md:space-y-16">
            {project.overview && (
              <SectionHead c={c} roman="I." kicker="Summary" title="Overview" />
            )}
            {project.overview && (
              <div className="-mt-8 md:-mt-10">
                <p
                  className="pd-dropcap font-serif text-[17px] md:text-[19px] leading-[1.65]"
                  style={{ color: c.ink }}
                >
                  {project.overview}
                </p>
              </div>
            )}

            {bullets.length > 0 && (
              <>
                <SectionHead c={c} roman="II." kicker="Breakdown" title="Highlights" />
                <ol className="list-none p-0 m-0 grid gap-5 md:gap-6 -mt-8 md:-mt-10">
                  {bullets.map((b, i) => (
                    <li
                      key={i}
                      className="grid grid-cols-[44px_1fr] md:grid-cols-[60px_1fr] gap-4 md:gap-5 items-baseline"
                    >
                      <span
                        className="font-serif italic font-light leading-[0.9] tabular-nums"
                        style={{
                          color: c.accent,
                          fontSize: "clamp(22px, 2.6vw, 30px)",
                        }}
                      >
                        {toRoman(i + 1)}.
                      </span>
                      <span
                        className="font-serif text-[16px] md:text-[17px] leading-[1.55]"
                        style={{ color: c.ink }}
                      >
                        {b}
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            )}

            {(project.detailBullets ?? []).length > 0 && (
              <>
                <SectionHead
                  c={c}
                  roman={bullets.length > 0 ? "III." : "II."}
                  kicker="Margin"
                  title="Notes"
                />
                <ul className="list-none p-0 m-0 grid gap-4 -mt-8 md:-mt-10">
                  {(project.detailBullets ?? []).map((b, i) => (
                    <li
                      key={i}
                      className="grid grid-cols-[24px_1fr] gap-3 text-[15px] md:text-[16px] leading-[1.55]"
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
              </>
            )}

            {!project.overview && bullets.length === 0 && (project.detailBullets ?? []).length === 0 && (
              <div
                className="font-serif italic text-center text-[16px] py-8"
                style={{ color: c.sub }}
              >
                Write-up forthcoming.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* metrics — full-width break-out */}
      {metrics.length > 0 && (
        <section
          className="border-t border-b"
          style={{ borderColor: c.ink, background: c.cover }}
        >
          <div className={`${WRAP} ${PAD} py-8 md:py-12`}>
            <div className="pd-kicker mb-4 md:mb-6">By the numbers</div>
            <div className="grid grid-cols-3">
              {metrics.map((m, i) => (
                <div
                  key={i}
                  className="py-4 md:py-6 px-3 md:px-6"
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
                      fontSize: "clamp(32px, 5vw, 56px)",
                      letterSpacing: -1,
                    }}
                  >
                    {m.v}
                  </div>
                  <div
                    className="font-mono text-[10px] md:text-[11px] uppercase tracking-widest mt-3"
                    style={{ color: c.sub }}
                  >
                    {m.k}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* related */}
      {related.length > 0 && (
        <section className="border-b" style={{ borderColor: c.rule }}>
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
                    className="pd-card-title font-serif font-normal text-[20px] leading-[1.15] text-[color:var(--ink)]"
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
                    <ArrowRight
                      size={12}
                      strokeWidth={1.75}
                      aria-hidden
                      className="pd-card-arrow"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <EditorialFooter />
    </div>
  );
}

function SectionHead({
  c,
  roman,
  kicker,
  title,
}: {
  c: ReturnType<typeof paletteFor>;
  roman: string;
  kicker: string;
  title: string;
}) {
  return (
    <div
      className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr] gap-5 md:gap-6 items-baseline border-b pb-4 md:pb-5"
      style={{ borderColor: c.ink }}
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
        <div className="pd-kicker">{kicker}</div>
        <div
          className="font-serif font-normal mt-1"
          style={{
            color: c.ink,
            fontSize: "clamp(28px, 5vw, 44px)",
            lineHeight: 1,
            letterSpacing: -1,
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}
