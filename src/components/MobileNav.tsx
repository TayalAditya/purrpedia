"use client";

import { useState } from "react";
import Link from "next/link";
import PurrPediaLogo from "./PurrPediaLogo";
import ThemeToggle from "./ThemeToggle";
import GetStartedLink from "./GetStartedLink";

interface MobileNavProps {
  backHref?: string;
  backLabel?: string;
}

export default function MobileNav({ backHref, backLabel }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between px-5 py-4 max-w-7xl mx-auto border-b border-[#1F1B2E]">
        {/* Left: back button OR logo */}
        {backHref ? (
          <Link href={backHref} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
            <span>←</span>
            <span className="hidden sm:block">{backLabel ?? "Back"}</span>
          </Link>
        ) : (
          <Link href="/" className="flex items-center gap-2.5">
            <PurrPediaLogo size={32} />
            <span className="font-display text-xl font-black hidden xs:block">
              Purr<span className="text-[#F97316]">·</span>Pedia
            </span>
          </Link>
        )}

        {/* Center: logo when back button shown */}
        {backHref && (
          <Link href="/" className="flex items-center gap-2">
            <PurrPediaLogo size={28} />
            <span className="font-display text-lg font-black">
              Purr<span className="text-[#F97316]">·</span>Pedia
            </span>
          </Link>
        )}

        {/* Right: hamburger on mobile, links on desktop */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4">
            <Link href="/facts" className="text-sm text-muted-foreground hover:text-white transition-colors">Facts</Link>
            <Link href="/breeds" className="text-sm text-muted-foreground hover:text-white transition-colors">Breeds</Link>
            <Link href="/quiz" className="text-sm text-muted-foreground hover:text-white transition-colors">Quiz</Link>
            <Link href="/postcards/new" className="text-sm text-muted-foreground hover:text-white transition-colors">Send a Purr</Link>
            <GetStartedLink className="bg-[#F97316] text-[#08070A] text-sm font-bold px-4 py-2 rounded-lg hover:bg-[#ea6a0f] transition-colors" />
          </div>
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-[#13111A] border border-[#1F1B2E] text-[#FAF9F7] hover:border-[#F97316] transition-colors"
            aria-label="Menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-[#13111A] border-b border-[#1F1B2E] px-5 py-4 space-y-1">
          {[
            { href: "/facts", label: "🐱 Cat Facts" },
            { href: "/breeds", label: "📖 Breed Index" },
            { href: "/quiz", label: "✨ Which Cat Are You?" },
            { href: "/postcards/new", label: "🐾 Send a Purr" },
            { href: "/digest/subscribe", label: "📬 Daily Digest" },
            { href: "/dashboard", label: "⚡ Dashboard" },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#FAF9F7] hover:bg-[#1C1928] transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2">
            <GetStartedLink
              className="block text-center bg-[#F97316] text-[#08070A] font-bold px-4 py-3 rounded-xl text-sm hover:bg-[#ea6a0f] transition-colors"
            />
          </div>
        </div>
      )}
    </>
  );
}
