import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "gray@austin:~$ — Gray Marshall";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage({
    kicker: "Terminal · Mode",
    title: ["gray@austin", "~$ help"],
    italicSecondLine: true,
    description:
      "Interactive TUI portfolio. Type help, work, projects, case <slug>, resume, or neofetch.",
    footerLeft: "graymarshall.dev/tui",
    footerRight: "zsh · 120×32",
  });
}
