import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import CatCursor from "@/components/CatCursor";
import AmbientCatSounds from "@/components/CatSounds";
import PawTrail from "@/components/PawTrail";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "PurrPedia — The Cat Encyclopedia",
  description:
    "The internet's most encyclopedic cat resource. Breeds, facts, daily digests & cat postcards — for everyone who loves cats.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "PurrPedia",
    description: "The internet's most encyclopedic cat resource.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="min-h-screen bg-[#08070A] text-[#FAF9F7] font-sans antialiased md:cursor-none">
        <CatCursor />
        <AmbientCatSounds />
        <PawTrail />
        {children}
      </body>
    </html>
  );
}
