import type { CSSProperties } from "react";

export type Palette = {
  bg: string;
  cover: string;
  ink: string;
  sub: string;
  rule: string;
  accent: string;
  soft: string;
  card: string;
};

export const o3Styles: { light: Palette; dark: Palette } = {
  light: {
    bg: "#f5ecd8",
    cover: "#e8dcbe",
    ink: "#18140a",
    sub: "#6f6650",
    rule: "#cfc09c",
    accent: "#b94610",
    soft: "#ddcea8",
    card: "#fbf5e6",
  },
  dark: {
    bg: "#0b0a07",
    cover: "#18160f",
    ink: "#f4ecd6",
    sub: "#948b78",
    rule: "#2b2820",
    accent: "#ff7a1a",
    soft: "#1f1c13",
    card: "#16140d",
  },
};

export function paletteFor(theme: "light" | "dark"): Palette {
  return theme === "dark" ? o3Styles.dark : o3Styles.light;
}

export function paletteToVars(c: Palette): CSSProperties {
  return {
    "--bg": c.bg,
    "--cover": c.cover,
    "--ink": c.ink,
    "--sub": c.sub,
    "--rule": c.rule,
    "--accent": c.accent,
    "--soft": c.soft,
    "--card": c.card,
  } as CSSProperties;
}
