import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png" as const;

/* Editorial-dark palette, matching the site's dark theme. */
const BG = "#0b0a07";
const COVER = "#18160f";
const INK = "#f4ecd6";
const SUB = "#948b78";
const RULE = "#2b2820";
const ACCENT = "#ff7a1a";

/*
 * Loads a Google font subset that Satori can parse. Sending NO User-Agent
 * header makes Google return a TTF; a modern UA returns WOFF2 which Satori
 * can't read. The `text=` param only includes glyphs we actually need.
 */
async function loadGoogleFont(
  family: string,
  weight: number,
  text: string,
  italic = false,
): Promise<ArrayBuffer | null> {
  try {
    const wghtPart = italic ? `ital,wght@1,${weight}` : `wght@${weight}`;
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      family,
    )}:${wghtPart}&text=${encodeURIComponent(text)}`;
    const cssRes = await fetch(url);
    const css = await cssRes.text();
    const match = css.match(
      /src:\s*url\(([^)]+)\)\s*format\(['"](?:opentype|truetype)['"]\)/,
    );
    if (!match) return null;
    const fontRes = await fetch(match[1]);
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

type FontEntry = {
  name: string;
  data: ArrayBuffer;
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  style: "normal" | "italic";
};

export type OgTemplateOptions = {
  /** Small uppercase kicker, e.g. "FEATURE · 01" or "CASE · lsr" */
  kicker: string;
  /** Main serif headline, up to 3 lines. Each array entry renders as its own line. */
  title: string[];
  /** Whether the 2nd line of the title should be italic (like the hero). */
  italicSecondLine?: boolean;
  /** Optional serif lede under the title. */
  description?: string;
  /** Bottom-left label, e.g. "graymarshall.dev/projects/lsr". */
  footerLeft: string;
  /** Bottom-right label, e.g. "2026 · AUSTIN". */
  footerRight?: string;
};

export async function renderOgImage(
  opts: OgTemplateOptions,
): Promise<ImageResponse> {
  const allText = [
    ...opts.title,
    opts.kicker,
    opts.description ?? "",
    opts.footerLeft,
    opts.footerRight ?? "",
    "graymarshall.dev",
    "portfolio",
    "—",
    "·",
  ].join(" ");

  const [frauncesRegular, frauncesItalicLight] = await Promise.all([
    loadGoogleFont("Fraunces", 400, allText),
    loadGoogleFont("Fraunces", 300, allText, true),
  ]);

  const fonts: FontEntry[] = [];
  if (frauncesRegular) {
    fonts.push({
      name: "Fraunces",
      data: frauncesRegular,
      weight: 400,
      style: "normal",
    });
  }
  if (frauncesItalicLight) {
    fonts.push({
      name: "Fraunces",
      data: frauncesItalicLight,
      weight: 300,
      style: "italic",
    });
  }

  // Scale title with length so long project names stay on the card.
  const longestLine = Math.max(...opts.title.map((l) => l.length));
  const titleSize =
    longestLine > 24 ? 82 : longestLine > 16 ? 108 : 132;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(to bottom, ${COVER}, ${BG})`,
          color: INK,
          fontFamily: "Fraunces, serif",
          display: "flex",
          flexDirection: "column",
          padding: "42px 56px 36px",
        }}
      >
        {/* masthead strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 14,
            borderBottom: `1px solid ${INK}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontSize: 26,
              fontWeight: 400,
              letterSpacing: -0.5,
              color: INK,
            }}
          >
            graymarshall<span style={{ color: ACCENT }}>.dev</span>
            <span style={{ color: SUB, marginLeft: 10, marginRight: 10 }}>—</span>
            <span
              style={{ fontStyle: "italic", fontWeight: 300, color: INK }}
            >
              portfolio
            </span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 13,
              color: SUB,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Vol. 03 · Austin, TX
          </div>
        </div>

        {/* kicker */}
        <div
          style={{
            display: "flex",
            marginTop: 44,
            fontSize: 14,
            color: SUB,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          {opts.kicker}
        </div>

        {/* headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 18,
            color: INK,
            fontSize: titleSize,
            lineHeight: 0.94,
            letterSpacing: -4,
          }}
        >
          {opts.title.map((line, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                fontStyle:
                  opts.italicSecondLine && i === 1 ? "italic" : "normal",
                fontWeight:
                  opts.italicSecondLine && i === 1 ? 300 : 400,
              }}
            >
              {i === opts.title.length - 1 ? (
                <>
                  {line}
                  <span style={{ color: ACCENT }}>.</span>
                </>
              ) : (
                line
              )}
            </div>
          ))}
        </div>

        {/* description */}
        {opts.description && (
          <div
            style={{
              display: "flex",
              marginTop: 26,
              maxWidth: 900,
              fontSize: 22,
              lineHeight: 1.4,
              color: SUB,
              fontStyle: "italic",
              fontWeight: 300,
            }}
          >
            {opts.description}
          </div>
        )}

        {/* spacer */}
        <div style={{ display: "flex", flex: 1 }} />

        {/* footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 16,
            borderTop: `1px solid ${RULE}`,
            fontSize: 14,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex", color: INK }}>{opts.footerLeft}</div>
          <div style={{ display: "flex", color: SUB }}>
            {opts.footerRight ?? "by Gray Marshall"}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: fonts.length > 0 ? fonts : undefined },
  );
}
