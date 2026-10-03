import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://missionwealth.in"),

  title: {
    default: "MISSION WEALTH™ | Investment Research & Advisory",
    template: "%s | MISSION WEALTH™",
  },

  description:
    "MISSION WEALTH™ is an independent investment research platform focused on disciplined analysis of Indian equities using the TECH-FUNDA™ framework.",

  keywords: [
    "MISSION WEALTH",
    "investment research",
    "Indian equities",
    "NSE stocks",
    "BSE stocks",
    "fundamental analysis",
    "technical analysis",
    "stock research",
    "equity research",
    "TECH-FUNDA",
  ],

  authors: [{ name: "MISSION WEALTH™" }],
  creator: "MISSION WEALTH™",
  publisher: "MISSION WEALTH™",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    siteName: "MISSION WEALTH™",
    title: "MISSION WEALTH™ | Investment Research & Advisory",
    description:
      "Independent investment research for disciplined decision-making in Indian equities.",
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    title: "MISSION WEALTH™ | Investment Research & Advisory",
    description:
      "Independent investment research for disciplined decision-making in Indian equities.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
