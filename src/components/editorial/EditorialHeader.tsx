"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ModeControls } from "../ModeControls";
import { useModeTheme } from "../ModeThemeProvider";
import { paletteFor } from "./palette";
import { useAustinTemp } from "@/lib/weather";
import { PORTFOLIO } from "@/data/portfolio";

async function requestResume(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  try {
    const res = await fetch("/resume.pdf", { method: "HEAD", cache: "no-store" });
    const type = res.headers.get("content-type") ?? "";
    if (res.ok && type.includes("pdf")) {
      const a = document.createElement("a");
      a.href = "/resume.pdf";
      a.download = "gray-marshall-resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }
  } catch {
    // fall through to mailto fallback
  }
  const subject = encodeURIComponent("Resume request — graymarshall.dev");
  const body = encodeURIComponent(
    "Hi Gray,\n\nCould you send a copy of your resume?\n\nThanks!",
  );
  window.location.href = `mailto:${PORTFOLIO.email}?subject=${subject}&body=${body}`;
}

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
  const pathname = usePathname();
  const [today, setToday] = useState<Date | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const temp = useAustinTemp();

  useEffect(() => setToday(new Date()), []);

  // Close the drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close on ESC
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const mastheadDate = today
    ? today.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  const hrefFor = (id: NavId) => (homeRoute ? `#${id}` : `/#${id}`);

  return (
    <>
      <header className="border-b border-[color:var(--ink)] bg-[color:var(--bg)]">
        <div
          className={`${WRAP} ${PAD} py-3 md:py-3.5 grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-6`}
        >
          <div className="hidden md:block col-start-1 font-mono text-[10px] tracking-widest uppercase text-[color:var(--sub)]">
            Vol. 03 · Issue 01{mastheadDate ? ` · ${mastheadDate}` : ""}
          </div>
          <Link
            href="/"
            className="col-start-2 font-serif text-[16px] sm:text-[20px] md:text-[22px] font-medium tracking-tight whitespace-nowrap text-center no-underline"
            style={{ color: "inherit" }}
          >
            graymarshall
            <span style={{ color: c.accent }}>.dev</span>{" "}
            <span className="text-[color:var(--sub)] font-normal">—</span>{" "}
            <span className="italic font-normal">portfolio</span>
          </Link>
          <div className="col-start-3 flex items-center justify-end gap-3 font-mono text-[11px] text-[color:var(--sub)]">
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
          {/* Desktop: inline link list */}
          <div className="hidden md:flex gap-4 sm:gap-5 md:gap-7 text-[color:var(--sub)] overflow-x-auto scrollbar-none -mx-1 px-1">
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

          {/* Mobile: hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="md:hidden inline-flex items-center gap-1.5 text-[color:var(--sub)] transition-colors hover:text-[color:var(--accent)]"
          >
            {menuOpen ? (
              <X size={16} strokeWidth={1.75} aria-hidden />
            ) : (
              <Menu size={16} strokeWidth={1.75} aria-hidden />
            )}
            <span>{menuOpen ? "close" : "menu"}</span>
          </button>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/resume.pdf"
              download
              onClick={requestResume}
              className="o3-link hidden lg:inline-block whitespace-nowrap text-[color:var(--sub)]"
            >
              ↓ Resume
            </a>
            <ModeControls palette="editorial" />
          </div>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div
            id="mobile-nav"
            className="md:hidden border-t border-[color:var(--rule)] bg-[color:var(--bg)]"
          >
            <div
              className={`${WRAP} ${PAD} py-3 flex flex-col font-mono text-[12px] tracking-widest uppercase`}
            >
              {NAV_ITEMS.map((item) => {
                const common = {
                  onClick: () => setMenuOpen(false),
                  "data-active": active === item.id,
                  className:
                    "o3-link py-2 text-[color:var(--sub)] w-fit",
                } as const;
                return homeRoute ? (
                  <a key={item.id} href={hrefFor(item.id)} {...common}>
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.id} href={hrefFor(item.id)} {...common}>
                    {item.label}
                  </Link>
                );
              })}
              <a
                href="/resume.pdf"
                download
                onClick={(e) => {
                  setMenuOpen(false);
                  void requestResume(e);
                }}
                className="o3-link py-2 text-[color:var(--sub)] w-fit"
              >
                ↓ Resume
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
