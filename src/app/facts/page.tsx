"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useCatSound } from "@/components/CatSounds";

interface Fact {
  id: string;
  fact: string;
  category: string;
  emoji: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  senses:    { bg: "#1C1528", text: "#A78BFA", border: "#A78BFA40" },
  biology:   { bg: "#1A1520", text: "#F97316", border: "#F9731640" },
  behaviour: { bg: "#0F1A1A", text: "#34D399", border: "#34D39940" },
  history:   { bg: "#1A1510", text: "#FBBF24", border: "#FBBF2440" },
  records:   { bg: "#1A1010", text: "#F87171", border: "#F8717140" },
  fun:       { bg: "#10181A", text: "#38BDF8", border: "#38BDF840" },
  internet:  { bg: "#1A1520", text: "#C084FC", border: "#C084FC40" },
  science:   { bg: "#101A15", text: "#4ADE80", border: "#4ADE8040" },
  breeds:    { bg: "#1A1510", text: "#FB923C", border: "#FB923C40" },
  culture:   { bg: "#1A1018", text: "#F472B6", border: "#F472B640" },
  general:   { bg: "#13111A", text: "#FAF9F7", border: "#1F1B2E" },
};

export default function FactsPage() {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seenIds, setSeenIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("purrpedia_seen_facts") ?? "[]"); } catch { return []; }
  });
  const { playMeow, playSwipe } = useCatSound();
  const touchStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchFact = useCallback(async (currentSeen: string[] = []) => {
    try {
      const params = currentSeen.length ? `?seen=${currentSeen.slice(-80).join(",")}` : "";
      const res = await fetch(`/api/facts${params}`);
      const data = await res.json();
      if (data.id) {
        setFacts(f => [...f, data]);
        setSeenIds(s => {
          const next = [...s, data.id];
          try { localStorage.setItem("purrpedia_seen_facts", JSON.stringify(next.slice(-200))); } catch {}
          return next;
        });
      }
    } catch { /* ignore */ }
  }, []);

  const prefetch = useCallback(async (seen: string[]) => {
    for (let i = 0; i < 3; i++) await fetchFact(seen);
  }, [fetchFact]);

  useEffect(() => {
    const initialSeen: string[] = [];
    try { JSON.parse(localStorage.getItem("purrpedia_seen_facts") ?? "[]").forEach((id: string) => initialSeen.push(id)); } catch {}
    prefetch(initialSeen).then(() => setLoading(false));
  }, [prefetch]);

  const goNext = useCallback(() => {
    playSwipe();
    if (index >= facts.length - 2) fetchFact(seenIds);
    setIndex(i => Math.min(i + 1, facts.length - 1));
  }, [index, facts.length, fetchFact, playSwipe, seenIds]);

  const goPrev = useCallback(() => {
    playSwipe();
    setIndex(i => Math.max(i - 1, 0));
  }, [playSwipe]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) {
      if (dx > 0) goNext(); else goPrev();
    }
  };

  const current = facts[index];
  const colors = current ? (CATEGORY_COLORS[current.category] ?? CATEGORY_COLORS.general) : CATEGORY_COLORS.general;

  return (
    <main
      className="min-h-screen flex flex-col select-none overflow-hidden"
      style={{ background: "#08070A" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F1B2E] z-10">
        <Link href="/" className="font-display text-lg font-black">
          Purr<span className="text-[#F97316]">·</span>Pedia
        </Link>
        <span className="text-xs font-mono text-[#6B7280]">
          {facts.length > 0 ? `${index + 1} / ${facts.length}+` : "Loading..."}
        </span>
        <Link href="/breeds" className="text-xs font-mono text-[#6B7280] hover:text-white transition-colors">
          Breeds →
        </Link>
      </div>

      {/* Progress dots */}
      {facts.length > 0 && (
        <div className="flex gap-1 px-5 pt-3 overflow-hidden">
          {facts.slice(Math.max(0, index - 4), index + 6).map((_, i) => {
            const actualI = Math.max(0, index - 4) + i;
            return (
              <div key={actualI}
                className="h-0.5 flex-1 rounded-full transition-all duration-300"
                style={{ background: actualI === index ? "#F97316" : actualI < index ? "#6B7280" : "#1F1B2E" }}
              />
            );
          })}
        </div>
      )}

      {/* Main fact card */}
      <div ref={containerRef} className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative">
        {loading ? (
          <div className="text-center">
            <div className="text-6xl animate-bounce mb-4">🐱</div>
            <p className="text-[#6B7280] font-mono text-sm">Loading cat wisdom...</p>
          </div>
        ) : current ? (
          <div
            className="w-full max-w-lg rounded-3xl p-8 sm:p-10 border transition-all duration-300 cursor-pointer"
            style={{ background: colors.bg, borderColor: colors.border }}
            onClick={() => { playMeow(); }}
          >
            {/* Category badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-mono tracking-widest uppercase px-3 py-1.5 rounded-full border"
                style={{ color: colors.text, borderColor: colors.border, background: `${colors.border}50` }}>
                {current.category}
              </span>
            </div>

            {/* Emoji */}
            <div className="text-6xl sm:text-8xl mb-6 text-center">{current.emoji}</div>

            {/* Fact */}
            <p className="text-[#FAF9F7] text-lg sm:text-xl leading-relaxed font-light text-center">
              {current.fact}
            </p>

            {/* Tap hint */}
            <p className="text-xs font-mono text-center mt-6" style={{ color: colors.text, opacity: 0.6 }}>
              Tap to meow • Swipe to explore
            </p>
          </div>
        ) : null}

        {/* Side nav arrows */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2">
          <button onClick={goPrev} disabled={index === 0}
            className="w-10 h-10 rounded-full bg-[#13111A] border border-[#1F1B2E] flex items-center justify-center text-[#6B7280] hover:border-[#F97316] hover:text-[#F97316] transition-all disabled:opacity-20">
            ←
          </button>
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <button onClick={goNext}
            className="w-10 h-10 rounded-full bg-[#13111A] border border-[#1F1B2E] flex items-center justify-center text-[#6B7280] hover:border-[#F97316] hover:text-[#F97316] transition-all">
            →
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="border-t border-[#1F1B2E] px-5 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex gap-2">
            {Object.keys(CATEGORY_COLORS).slice(0,6).map(cat => (
              <button key={cat} onClick={async () => {
                playSwipe();
                const res = await fetch(`/api/facts?category=${cat}`);
                const data = await res.json();
                if (data.id) { setFacts(f => [...f, data]); setIndex(facts.length); }
              }}
                className="text-xs font-mono px-2.5 py-1 rounded-full border border-[#1F1B2E] text-[#6B7280] hover:border-[#F97316] hover:text-[#F97316] transition-all capitalize hidden sm:block">
                {cat}
              </button>
            ))}
          </div>
          <p className="text-xs font-mono text-[#6B7280]">← → or swipe to navigate</p>
        </div>
      </div>
    </main>
  );
}
