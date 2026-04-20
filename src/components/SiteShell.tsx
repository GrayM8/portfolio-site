"use client";

import { EditorialSite } from "./editorial/EditorialSite";
import { TerminalSite } from "./terminal/TerminalSite";
import { useModeTheme } from "./ModeThemeProvider";

export function SiteShell() {
  const { mode, transitioning } = useModeTheme();
  return (
    <div
      style={{
        opacity: transitioning ? 0 : 1,
        transition: "opacity .3s ease",
      }}
    >
      {mode === "terminal" ? <TerminalSite /> : <EditorialSite />}
    </div>
  );
}
