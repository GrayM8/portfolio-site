import { readFile } from "node:fs/promises";
import path from "node:path";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "graymarshall.dev — portfolio";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

async function loadHeadshotDataUrl(): Promise<string | undefined> {
  try {
    const buf = await readFile(
      path.join(process.cwd(), "public", "assets", "headshot.jpg"),
    );
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    return undefined;
  }
}

function formatToday(): string {
  const now = new Date();
  const month = now.toLocaleString("en-US", { month: "short" });
  return `${month} ${now.getDate()} · ${now.getFullYear()}`;
}

export default async function Image() {
  const headshot = await loadHeadshotDataUrl();
  return renderOgImage({
    kicker: "Feature · 01",
    title: ["Building", "things that", "don't break"],
    italicSecondLine: true,
    description:
      "Second-year CS at UT Austin. Founder of PitLane Systems, co-founder and CTO at Longhorn Sim Racing and Trophy Sim Solutions, telemetry + autonomy engineer on Longhorn Racing.",
    image: headshot,
    imageCaption: "Tokyo · 2023",
    footerLeft: "graymarshall.dev",
    footerRight: formatToday(),
  });
}
