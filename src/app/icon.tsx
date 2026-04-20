import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Editorial-dark palette — matches the site's wordmark accent.
const BG = "#18160f";
const ACCENT = "#ff7a1a";

/*
 * Loads Fraunces subset-limited to the single glyph we render. Sending
 * no UA to fonts.googleapis.com makes it return TTF (Satori can't parse
 * the modern WOFF2 a normal UA would get).
 */
async function loadFraunces(): Promise<ArrayBuffer | null> {
  try {
    const cssRes = await fetch(
      "https://fonts.googleapis.com/css2?family=Fraunces:wght@600&text=g",
    );
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

export default async function Icon() {
  const fontData = await loadFraunces();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BG,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Fraunces, serif",
          fontWeight: 600,
          fontSize: 30,
          lineHeight: 1,
          color: ACCENT,
          letterSpacing: -1,
        }}
      >
        g
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: "Fraunces",
              data: fontData,
              weight: 600,
              style: "normal",
            },
          ]
        : undefined,
    },
  );
}
