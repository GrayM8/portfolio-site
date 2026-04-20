import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "graymarshall.dev — Gray Marshall",
    short_name: "graymarshall.dev",
    description:
      "Portfolio of Gray Marshall — real-time systems, race-car telemetry, and production web platforms.",
    start_url: "/",
    display: "minimal-ui",
    background_color: "#0b0a07",
    theme_color: "#18160f",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
