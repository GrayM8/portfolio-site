import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const BG = "#18160f";
const INK = "#f4ecd6";
const ACCENT = "#ff7a1a";

async function loadFraunces(): Promise<ArrayBuffer | null> {
  try {
    const cssRes = await fetch(
      "https://fonts.googleapis.com/css2?family=Fraunces:wght@600&text=g.",
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

export default async function AppleIcon() {
  const fontData = await loadFraunces();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BG,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
          fontFamily: "Fraunces, serif",
          fontWeight: 600,
          fontSize: 148,
          lineHeight: 1,
          letterSpacing: -6,
          color: INK,
          paddingTop: 8,
        }}
      >
        g<span style={{ color: ACCENT }}>.</span>
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
