import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Fraunces, Instrument_Serif } from "next/font/google";
import { ModeThemeProvider } from "@/components/ModeThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif-alt",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://graymarshall.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Gray Marshall — Software Engineer",
  description:
    "Real-time systems. Race-car telemetry. Production web platforms. Portfolio of Gray Marshall.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${fraunces.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ModeThemeProvider>{children}</ModeThemeProvider>
      </body>
    </html>
  );
}
