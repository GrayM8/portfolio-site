import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Gray Marshall",
  description: "The story you're looking for couldn't be filed.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div
      className="min-h-[100svh] flex flex-col items-center justify-center px-6 py-16 text-center"
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      <div
        className="font-mono text-[10px] md:text-[11px] tracking-[3px] uppercase mb-6"
        style={{ color: "var(--sub)" }}
      >
        Error · 404 · Misfiled
      </div>

      <h1 className="font-serif font-normal leading-[0.94] tracking-[-3px] md:tracking-[-4px] text-[64px] sm:text-[88px] md:text-[128px]">
        Page not
        <br />
        <span className="italic font-light">found</span>
        <span style={{ color: "var(--accent)" }}>.</span>
      </h1>

      <p
        className="mt-8 max-w-[520px] font-serif italic text-[17px] md:text-[19px] leading-[1.45]"
        style={{ color: "var(--sub)" }}
      >
        The story you're looking for either never went to press, or the
        typesetter misplaced it between issues.
      </p>

      <div
        className="mt-10 flex flex-wrap justify-center items-center gap-4 md:gap-5 font-mono text-[11px] md:text-[12px] tracking-widest uppercase"
      >
        <Link
          href="/"
          className="o3-link"
          style={{ color: "var(--accent)" }}
        >
          ← Back to the masthead
        </Link>
        <span style={{ color: "var(--rule)" }}>·</span>
        <Link
          href="/tui"
          className="o3-link"
          style={{ color: "var(--sub)" }}
        >
          Drop into the terminal
        </Link>
      </div>
    </div>
  );
}
