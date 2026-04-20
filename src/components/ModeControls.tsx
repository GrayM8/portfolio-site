"use client";

import { useModeTheme } from "./ModeThemeProvider";

type Props = {
  /** Visual density — "editorial" uses site colors; "terminal" is tuned for dark terminal header. */
  palette: "editorial" | "terminal";
};

export function ModeControls({ palette }: Props) {
  const { mode, theme, setMode, toggleTheme } = useModeTheme();
  const isDark = theme === "dark";

  // Resolve colors for the two call sites so the control blends cleanly in either header.
  const col =
    palette === "editorial"
      ? {
          active: "var(--ink)",
          activeText: "var(--bg)",
          inactive: "var(--sub)",
          rule: "var(--rule)",
          track: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
        }
      : {
          active: isDark ? "#e8e4d8" : "#14130f",
          activeText: isDark ? "#0a0a09" : "#eeeae4",
          inactive: isDark ? "#8a857a" : "#5a554a",
          rule: isDark ? "#24231f" : "#c7bfad",
          track: isDark ? "#16140d" : "#e3d9c4",
        };

  return (
    <div className="flex items-center gap-2 font-mono">
      <div
        className="flex items-center"
        style={{
          border: `1px solid ${col.rule}`,
          background: col.track,
        }}
      >
        <button
          onClick={() => setMode("editorial")}
          aria-pressed={mode === "editorial"}
          className="px-2.5 py-1 text-[10px] tracking-[0.12em] uppercase cursor-pointer transition-colors"
          style={{
            background: mode === "editorial" ? col.active : "transparent",
            color: mode === "editorial" ? col.activeText : col.inactive,
            border: "none",
          }}
        >
          Editorial
        </button>
        <button
          onClick={() => setMode("terminal")}
          aria-pressed={mode === "terminal"}
          className="px-2.5 py-1 text-[10px] tracking-[0.12em] uppercase cursor-pointer transition-colors"
          style={{
            background: mode === "terminal" ? col.active : "transparent",
            color: mode === "terminal" ? col.activeText : col.inactive,
            border: "none",
          }}
        >
          :terminal
        </button>
      </div>
      <button
        onClick={toggleTheme}
        title={isDark ? "Switch to light" : "Switch to dark"}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        className="inline-flex items-center justify-center w-6 h-6 text-[13px] cursor-pointer transition-colors"
        style={{
          background: "transparent",
          color: palette === "editorial" ? "var(--ink)" : col.active,
          border: `1px solid ${col.rule}`,
        }}
      >
        {isDark ? "☾" : "☀"}
      </button>
    </div>
  );
}
