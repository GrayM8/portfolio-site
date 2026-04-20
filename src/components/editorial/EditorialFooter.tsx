"use client";

import { useEffect, useState } from "react";
import { PORTFOLIO } from "@/data/portfolio";
import { paletteFor } from "./palette";
import { useModeTheme } from "../ModeThemeProvider";

const WRAP = "mx-auto w-full max-w-[1440px]";
const PAD = "px-5 sm:px-8 md:px-10 lg:px-12";

export function EditorialFooter() {
  const { theme } = useModeTheme();
  const c = paletteFor(theme);
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => setToday(new Date()), []);

  const currentYear = today ? today.getFullYear() : 2026;

  return (
    <footer style={{ background: c.cover, borderTop: `2px solid ${c.ink}` }}>
      <div
        className={`${WRAP} ${PAD} py-8 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-8 font-mono text-[11px]`}
      >
        <div>
          <div
            className="font-serif font-medium text-[18px] md:text-[20px] tracking-tight mb-2"
            style={{ color: c.ink }}
          >
            graymarshall<span style={{ color: c.accent }}>.dev</span>{" "}
            <span style={{ color: c.sub, fontWeight: 400 }}>—</span>{" "}
            <span className="italic font-normal">portfolio</span>
          </div>
          <div className="leading-[1.6]" style={{ color: c.sub }}>
            Set in Fraunces &amp; Inter. Built in React. Hosted on the open web.
            <br />
            Best read with a coffee and something loud in the background.
          </div>
        </div>
        <div>
          <div className="o3-kicker mb-2">Masthead</div>
          <div className="leading-[1.7]" style={{ color: c.ink }}>
            Editor, engineer &amp; designer
            <br />
            <a
              href={`https://${PORTFOLIO.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="o3-link"
            >
              Gray Marshall
            </a>
          </div>
        </div>
        <div>
          <div className="o3-kicker mb-2">Publication</div>
          <div className="leading-[1.7]" style={{ color: c.ink }}>
            Vol. 03 · {currentYear}
            <br />© Gray Marshall
            <br />
            Austin, Texas
          </div>
        </div>
      </div>
    </footer>
  );
}
