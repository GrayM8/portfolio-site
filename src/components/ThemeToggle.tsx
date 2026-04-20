"use client";

import { useModeTheme } from "./ModeThemeProvider";

type Props = {
  palette: "editorial" | "terminal";
};

export function ThemeToggle({ palette }: Props) {
  const { theme, toggleTheme } = useModeTheme();
  const isDark = theme === "dark";

  const colors =
    palette === "editorial"
      ? {
          border: "var(--rule)",
          color: "var(--ink)",
          hover: "var(--accent)",
        }
      : {
          border: isDark ? "#24231f" : "#c7bfad",
          color: isDark ? "#e8e4d8" : "#14130f",
          hover: isDark ? "#ff7321" : "#bf4711",
        };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? "Switch to light" : "Switch to dark"}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="inline-flex items-center justify-center w-6 h-6 text-[12px] cursor-pointer transition-colors"
      style={{
        background: "transparent",
        color: colors.color,
        border: `1px solid ${colors.border}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = colors.hover;
        e.currentTarget.style.borderColor = colors.hover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = colors.color;
        e.currentTarget.style.borderColor = colors.border;
      }}
    >
      {isDark ? "☾" : "☀"}
    </button>
  );
}
