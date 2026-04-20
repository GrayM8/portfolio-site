import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "graymarshall.dev — portfolio";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage({
    kicker: "Feature · 01",
    title: ["Building", "things that", "don't break"],
    italicSecondLine: true,
    description:
      "Second-year CS at UT Austin. Founder of PitLane Systems, co-founder and CTO at Longhorn Sim Racing and Trophy Sim Solutions, and telemetry + autonomy engineer on Longhorn Racing.",
    footerLeft: "graymarshall.dev",
    footerRight: "2026 · Austin",
  });
}
