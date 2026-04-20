"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ModeControls } from "../ModeControls";
import { useModeTheme } from "../ModeThemeProvider";
import { paletteFor } from "./palette";
import { useAustinTemp } from "@/lib/weather";

const WRAP = "mx-auto w-full max-w-[1440px]";
const PAD = "px-5 sm:px-8 md:px-10 lg:px-12";

export type NavId =
  | "about"
  | "work"
  | "now"
  | "index"
  | "experience"
  | "education"
  | "systems"
  | "notes"
  | "contact";

export const NAV_ITEMS: ReadonlyArray<{ id: NavId; label: string }> = [
  { id: "about", label: "About" },
  { id: "work", label: "Featured" },
  { id: "now", label: "Now" },
  { id: "index", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education & Systems" },
  { id: "notes", label: "Notes" },
  { id: "contact", label: "Contact" },
];

type Props = {
  /** The currently-active section id on the home page, or null/undefined on other routes. */
  active?: NavId | null;
  /** When true, nav links are fragment-only (#id); otherwise they route to the home page (/#id). */
  homeRoute?: boolean;
};

export function EditorialHeader({ active, homeRoute = false }: Props) {
  const { theme } = useModeTheme();
  const c = paletteFor(theme);
  const [today, setToday] = useState<Date | null>(null);
  const temp = useAustinTemp();

  useEffect(() => setToday(new Date()), []);

  const mastheadDate = today
    ? today.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  const hrefFor = (id: NavId) => (homeRoute ? `#${id}` : `/#${id}`);

  return (
    <>
      <header
        className="border-b border-[color:var(--ink)] bg-[color:var(--bg)]"
      >
        <div
          className={`${WRAP} ${PAD} py-3 md:py-3.5 grid grid-cols-[auto_1fr] md:grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-6`}
        >
          <div className="hidden md:block font-mono text-[10px] tracking-widest uppercase text-[color:var(--sub)]">
            Vol. 03 · Issue 01{mastheadDate ? ` · ${mastheadDate}` : ""}
          </div>
          <Link
            href="/"
            className="font-serif text-[18px] sm:text-[20px] md:text-[22px] font-medium tracking-[0.12em] md:tracking-[0.18em] whitespace-nowrap text-left md:text-center no-underline"
            style={{ color: "inherit" }}
          >
            <span style={{ color: c.accent }}>G.</span>MARSHALL{" "}
            <span className="text-[color:var(--sub)] font-normal">—</span>{" "}
            <span className="italic font-normal">field notes</span>
          </Link>
          <div className="flex items-center justify-end gap-3 font-mono text-[11px] text-[color:var(--sub)]">
            <span className="hidden sm:inline">
              Austin, TX{temp !== null ? ` · ${temp}°F` : ""}
            </span>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-40 border-b border-[color:var(--rule)] bg-[color:var(--bg)]/95 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--bg)]/80">
        <div
          className={`${WRAP} ${PAD} py-2.5 md:py-3 flex justify-between items-center gap-4 font-mono text-[11px] tracking-widest uppercase`}
        >
          <div className="flex gap-4 sm:gap-5 md:gap-7 text-[color:var(--sub)] overflow-x-auto scrollbar-none -mx-1 px-1">
            {NAV_ITEMS.map((item) =>
              homeRoute ? (
                <a
                  key={item.id}
                  href={hrefFor(item.id)}
                  data-active={active === item.id}
                  className="o3-link shrink-0"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.id}
                  href={hrefFor(item.id)}
                  className="o3-link shrink-0"
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/resume.pdf"
              download
              className="o3-link hidden lg:inline-block whitespace-nowrap text-[color:var(--sub)]"
            >
              ↓ Resume
            </a>
            <ModeControls palette="editorial" />
          </div>
        </div>
      </nav>
    </>
  );
}
