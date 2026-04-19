"use client";

import { useModeTheme } from "./ModeThemeProvider";

export function ModeBanner() {
  const { mode, theme, setMode, toggleTheme } = useModeTheme();
  const isDark = theme === "dark";
  const bg = isDark ? "#0b0a07" : "#f8f5ef";
  const ink = isDark ? "#f4ecd6" : "#14120d";
  const sub = isDark ? "#948b78" : "#6a6456";
  const rule = isDark ? "#2b2820" : "#cfc5b0";
  const accent = isDark ? "#ff7a1a" : "#b94610";

  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        right: 12,
        zIndex: 1000,
        display: "flex",
        gap: 6,
        alignItems: "center",
        background: bg,
        border: `1px solid ${rule}`,
        padding: 4,
        borderRadius: 2,
        boxShadow: isDark
          ? "0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,122,26,0.08)"
          : "0 8px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
      }}
      className="font-mono"
    >
      <div
        style={{
          fontSize: 9,
          color: sub,
          padding: "0 8px",
          letterSpacing: 1.2,
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span className="gm-blip" style={{ color: accent }}>
          ●
        </span>{" "}
        mode
      </div>
      <div
        style={{
          display: "flex",
          background: isDark ? "#16140d" : "#e3d9c4",
          borderRadius: 1,
        }}
      >
        <button
          onClick={() => setMode("editorial")}
          className="font-sans"
          style={{
            padding: "7px 14px",
            fontSize: 11,
            fontWeight: 600,
            background: mode === "editorial" ? ink : "transparent",
            color: mode === "editorial" ? bg : sub,
            border: "none",
            cursor: "pointer",
            letterSpacing: 0.3,
            transition: "all .2s",
          }}
        >
          Editorial
        </button>
        <button
          onClick={() => setMode("terminal")}
          className="font-mono"
          style={{
            padding: "7px 14px",
            fontSize: 11,
            fontWeight: 600,
            background: mode === "terminal" ? ink : "transparent",
            color: mode === "terminal" ? bg : sub,
            border: "none",
            cursor: "pointer",
            letterSpacing: 0.3,
            transition: "all .2s",
          }}
        >
          :terminal
        </button>
      </div>
      <button
        onClick={toggleTheme}
        title="Toggle theme"
        style={{
          width: 28,
          height: 28,
          borderRadius: 1,
          background: "transparent",
          border: "none",
          color: ink,
          cursor: "pointer",
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isDark ? "☾" : "☀"}
      </button>
    </div>
  );
}
