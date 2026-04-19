"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Mode = "editorial" | "terminal";
export type Theme = "light" | "dark";

type Ctx = {
  mode: Mode;
  theme: Theme;
  setMode: (m: Mode) => void;
  setTheme: (t: Theme) => void;
  toggleMode: () => void;
  toggleTheme: () => void;
  transitioning: boolean;
};

const ModeThemeContext = createContext<Ctx | null>(null);

const MODE_KEY = "gm_mode";
const THEME_KEY = "gm_theme";

function bodyBgFor(mode: Mode, theme: Theme): string {
  if (mode === "terminal") return theme === "dark" ? "#0a0a09" : "#eeeae4";
  return theme === "dark" ? "#0b0a07" : "#f8f5ef";
}

export function ModeThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>("editorial");
  const [theme, setThemeState] = useState<Theme>("dark");
  const [transitioning, setTransitioning] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedMode = localStorage.getItem(MODE_KEY) as Mode | null;
      const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
      if (savedMode === "editorial" || savedMode === "terminal") setModeState(savedMode);
      if (savedTheme === "light" || savedTheme === "dark") setThemeState(savedTheme);
    } catch {
      // no-op: localStorage unavailable
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch {}
  }, [mode, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme, hydrated]);

  useEffect(() => {
    document.body.style.background = bodyBgFor(mode, theme);
  }, [mode, theme]);

  const setMode = useCallback((next: Mode) => {
    setModeState((prev) => {
      if (prev === next) return prev;
      setTransitioning(true);
      window.setTimeout(() => setTransitioning(false), 300);
      return next;
    });
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === "editorial" ? "terminal" : "editorial");
  }, [mode, setMode]);

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "m" || e.key === "M") {
        toggleMode();
      } else if (e.key === "t" || e.key === "T") {
        toggleTheme();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleMode, toggleTheme]);

  const value = useMemo<Ctx>(
    () => ({ mode, theme, setMode, setTheme, toggleMode, toggleTheme, transitioning }),
    [mode, theme, setMode, setTheme, toggleMode, toggleTheme, transitioning],
  );

  return <ModeThemeContext.Provider value={value}>{children}</ModeThemeContext.Provider>;
}

export function useModeTheme(): Ctx {
  const ctx = useContext(ModeThemeContext);
  if (!ctx) throw new Error("useModeTheme must be used within ModeThemeProvider");
  return ctx;
}
