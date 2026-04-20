"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useModeTheme } from "./ModeThemeProvider";

type Props = {
  palette: "editorial" | "terminal";
};

export function ModeControls({ palette }: Props) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useModeTheme();
  const isDark = theme === "dark";
  const isTerminal = pathname?.startsWith("/tui");

  const col =
    palette === "editorial"
      ? {
          active: "var(--ink)",
          activeText: "var(--bg)",
          inactive: "var(--sub)",
          rule: "var(--rule)",
          track: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
          iconColor: "var(--ink)",
        }
      : {
          active: isDark ? "#e8e4d8" : "#14130f",
          activeText: isDark ? "#0a0a09" : "#eeeae4",
          inactive: isDark ? "#8a857a" : "#5a554a",
          rule: isDark ? "#24231f" : "#c7bfad",
          track: isDark ? "#16140d" : "#e3d9c4",
          iconColor: isDark ? "#e8e4d8" : "#14130f",
        };

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-stretch"
        style={{
          border: `1px solid ${col.rule}`,
          background: col.track,
        }}
      >
        <Link
          href="/"
          aria-current={!isTerminal ? "page" : undefined}
          className="px-2.5 py-1 italic font-[family-name:var(--font-serif-alt)] text-[15px] leading-[1] tracking-normal normal-case transition-colors no-underline flex items-center"
          style={{
            background: !isTerminal ? col.active : "transparent",
            color: !isTerminal ? col.activeText : col.inactive,
          }}
        >
          Editorial
        </Link>
        <Link
          href="/tui"
          aria-current={isTerminal ? "page" : undefined}
          className="px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] uppercase transition-colors no-underline flex items-center"
          style={{
            background: isTerminal ? col.active : "transparent",
            color: isTerminal ? col.activeText : col.inactive,
          }}
        >
          :terminal
        </Link>
      </div>
      <button
        type="button"
        onClick={toggleTheme}
        title={isDark ? "Switch to light" : "Switch to dark"}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        className="inline-flex items-center justify-center w-6 h-6 text-[13px] cursor-pointer transition-colors"
        style={{
          background: "transparent",
          color: col.iconColor,
          border: `1px solid ${col.rule}`,
        }}
      >
        {isDark ? "☾" : "☀"}
      </button>
    </div>
  );
}
