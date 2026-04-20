import type { Metadata } from "next";
import { TerminalSite } from "@/components/terminal/TerminalSite";

export const metadata: Metadata = {
  title: "gray@austin:~$ | Gray Marshall",
  description:
    "Interactive terminal-style portfolio. Type `help` for commands, `resume` to download the PDF.",
};

export default function TuiPage() {
  return <TerminalSite />;
}
