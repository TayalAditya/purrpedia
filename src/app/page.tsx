"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";

const CAT_FACTS = [
  "Cats spend 70% of their lives sleeping — averaging 13–16 hours a day.",
  "A group of cats is called a clowder. A group of kittens is a kindle.",
  "Cats can rotate their ears 180 degrees independently of each other.",
  "The oldest cat ever recorded, Creme Puff, lived to 38 years and 3 days.",
  "Cats have 32 muscles in each ear. Humans have only 6.",
  "A cat's purr vibrates at 25–150 Hz — the same frequency used to heal bones.",
  "Cats can jump up to 6 times their own body length in one bound.",
  "Ancient Egyptians shaved their eyebrows to mourn a cat's death.",
  "A cat's nose print is as unique as a human fingerprint.",
  "Cats cannot taste sweetness — they lack the taste receptor for it.",
  "Cheetahs purr instead of roar, making them more cat than big cat.",
  "Indoor cats live on average 2–3× longer than outdoor cats.",
];

const BREEDS = [
  "Abyssinian","Bengal","Birman","British Shorthair","Burmese",
  "Devon Rex","Egyptian Mau","Himalayan","Maine Coon","Manx",
  "Norwegian Forest","Ocicat","Persian","Ragdoll","Russian Blue",
  "Scottish Fold","Siamese","Siberian","Sphynx","Turkish Angora",
  "American Shorthair","Balinese","Bombay","Chartreux","Cornish Rex",
  "Japanese Bobtail","Korat","LaPerm","Munchkin","Nebelung",
];

function ScrollReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

export default function LandingPage() {
  const [factIndex, setFactIndex] = useState(0);
  const [factKey, setFactKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setFactIndex(i => (i + 1) % CAT_FACTS.length);
      setFactKey(k => k + 1);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  const doubled = [...BREEDS, ...BREEDS];

  return (
    <main className="min-h-screen bg-[#08070A] overflow-x-hidden">

      {/* Ticker */}
      <div className="bg-[#F97316] text-[#08070A] py-2 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center gap-4 px-4 text-xs font-mono font-semibold tracking-widest uppercase shrink-0">
              <span>🐱 World Cat Domination Day</span>
              <span>·</span>
              <span>247 Breeds</span>
              <span>·</span>
              <span>Daily Digest</span>
              <span>·</span>
              <span>Purr Postcards</span>
              <span>·</span>
            </span>
          ))}
        </div>
      </div>

      <MobileNav />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 text-center overflow-hidden py-16">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 sm:w-[600px] h-64 sm:h-[600px] rounded-full bg-[#F97316]/5 blur-3xl" />
        </div>

        {/* Floating particles — hidden on small screens */}
        <span className="hidden sm:block absolute top-[12%] left-[8%] text-4xl float-1 pointer-events-none select-none opacity-50">🐱</span>
        <span className="hidden sm:block absolute top-[20%] right-[12%] text-3xl float-2 pointer-events-none select-none opacity-50">🐾</span>
        <span className="hidden md:block absolute top-[45%] right-[7%] text-3xl float-1 pointer-events-none select-none opacity-50">🐈</span>
        <span className="hidden md:block absolute top-[60%] left-[5%] text-2xl float-3 pointer-events-none select-none opacity-50">😸</span>

        <div className="relative z-10 w-full max-w-4xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-[#1C1928] border border-[#1F1B2E] text-[#A78BFA] text-[10px] sm:text-xs font-mono tracking-widest uppercase px-3 sm:px-4 py-2 rounded-full mb-6 sm:mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] animate-pulse shrink-0" />
            <span>The Internet&apos;s Cat Encyclopedia</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-6xl sm:text-8xl md:text-[10rem] font-black leading-none tracking-tight mb-4 sm:mb-6">
            <span className="gradient-text">Purr</span>
            <span className="text-[#1F1B2E]">·</span>
            <span className="text-[#FAF9F7]">Pedia</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#6B7280] max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed font-light px-2">
            Everything the internet knows about cats — daily digest, encyclopedic breed index, and cat postcards scheduled for any date.
          </p>

          {/* Live fact */}
          <div className="bg-[#13111A] border border-[#1F1B2E] rounded-2xl p-4 sm:p-5 max-w-xl mx-auto mb-8 sm:mb-10 text-left">
            <p className="text-[10px] font-mono tracking-widest uppercase text-[#F97316] mb-2">
              🐱 Cat Fact #{(factIndex + 1).toString().padStart(3, "0")}
            </p>
            <p key={factKey} className="fact-animate text-[#FAF9F7] text-sm leading-relaxed">
              {CAT_FACTS[factIndex]}
            </p>
          </div>

          {/* CTAs — stack on mobile */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <Link href="/login"
              className="w-full sm:w-auto bg-[#F97316] text-[#08070A] font-black px-6 sm:px-8 py-4 rounded-xl text-sm sm:text-base hover:bg-[#ea6a0f] transition-all active:scale-95 text-center">
              Subscribe to Daily Digest →
            </Link>
            <Link href="/postcards/new"
              className="w-full sm:w-auto bg-transparent border border-[#1F1B2E] text-[#FAF9F7] font-semibold px-6 sm:px-8 py-4 rounded-xl text-sm sm:text-base hover:border-[#F97316] hover:text-[#F97316] transition-all text-center">
              Send a Purr 🐾
            </Link>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#6B7280] text-xs font-mono animate-bounce">
          <span>SCROLL</span><span>↓</span>
        </div>
      </section>

      {/* Breed marquee */}
      <div className="border-y border-[#1F1B2E] py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {doubled.map((breed, i) => (
            <span key={i} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 text-xs sm:text-sm font-mono text-[#6B7280]">
              <span className="text-[#1F1B2E]">◆</span>{breed}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-24">
        <ScrollReveal className="text-center mb-10 sm:mb-16">
          <p className="text-xs font-mono tracking-widest uppercase text-[#F97316] mb-3">What is PurrPedia</p>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-[#FAF9F7] tracking-tight">
            Five ways to love cats
          </h2>
        </ScrollReveal>

        {/* Stack on mobile, 3-col on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gridAutoRows: "1fr" }}>
          <ScrollReveal>
            <div className="card-hover bg-[#13111A] border border-[#1F1B2E] rounded-2xl p-6 sm:p-8 group">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">📬</div>
              <span className="text-xs font-mono tracking-widest uppercase text-[#F97316]">Feature 01</span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FAF9F7] mt-2 mb-3 tracking-tight">Daily Digest</h3>
              <p className="text-[#6B7280] leading-relaxed text-sm">
                Every morning at 8am — a cat fact, breed spotlight, and cat of the day. Delivered by Temporal so it never misses, even if the server restarts.
              </p>
              <div className="mt-5 pt-5 border-t border-[#1F1B2E] flex items-center justify-between">
                <span className="text-xs font-mono text-[#6B7280]">POWERED BY TEMPORAL</span>
                <span className="text-[#F97316] group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="card-hover bg-gradient-to-b from-[#1C1528] to-[#13111A] border border-[#A78BFA]/30 rounded-2xl p-6 sm:p-8 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#A78BFA]/5 to-transparent pointer-events-none" />
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">🐾</div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono tracking-widest uppercase text-[#A78BFA]">Feature 02</span>
                <span className="text-xs bg-[#A78BFA]/20 text-[#A78BFA] px-2 py-0.5 rounded-full font-mono">POPULAR</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FAF9F7] mt-2 mb-3 tracking-tight">Purr Postcards</h3>
              <p className="text-[#6B7280] leading-relaxed text-sm">
                Design a cat postcard, add stickers, write your message — then schedule it for any date. Arrives on time, every time.
              </p>
              <div className="mt-5 pt-5 border-t border-[#A78BFA]/20 flex items-center justify-between">
                <span className="text-xs font-mono text-[#6B7280]">5 FREE PER DAY</span>
                <span className="text-[#A78BFA] group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <Link href="/breeds" className="block h-full">
              <div className="card-hover bg-[#13111A] border border-[#1F1B2E] rounded-2xl p-6 sm:p-8 group">
                <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">📖</div>
                <span className="text-xs font-mono tracking-widest uppercase text-[#FBBF24]">Feature 03</span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FAF9F7] mt-2 mb-3 tracking-tight">The Breed Index</h3>
                <p className="text-[#6B7280] leading-relaxed text-sm">
                  247 breeds. Full profiles with photos, temperament ratings, lifespan data, and origin stories.
                </p>
                <div className="mt-5 pt-5 border-t border-[#1F1B2E] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#6B7280]">247 BREEDS</span>
                  <span className="text-[#FBBF24] group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal>
            <Link href="/quiz" className="block">
              <div className="card-hover bg-[#13111A] border border-[#1F1B2E] rounded-2xl p-6 sm:p-8 group">
                <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">✨</div>
                <span className="text-xs font-mono tracking-widest uppercase text-[#34D399]">Feature 04</span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FAF9F7] mt-2 mb-3 tracking-tight">Which Cat Are You?</h3>
                <p className="text-[#6B7280] leading-relaxed text-sm">
                  Take a 7-question personality quiz and discover which cat breed matches your soul. Share your result with friends.
                </p>
                <div className="mt-5 pt-5 border-t border-[#1F1B2E] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#6B7280]">7 QUESTIONS</span>
                  <span className="text-[#34D399] group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal>
            <Link href="/name-generator" className="block">
              <div className="card-hover bg-[#13111A] border border-[#1F1B2E] rounded-2xl p-6 sm:p-8 group">
                <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">🎲</div>
                <span className="text-xs font-mono tracking-widest uppercase text-[#38BDF8]">Feature 05</span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FAF9F7] mt-2 mb-3 tracking-tight">Name Generator</h3>
                <p className="text-[#6B7280] leading-relaxed text-sm">
                  Generate ridiculously royal cat names — complete with titles, prefixes, and noble designations. Copy & share instantly.
                </p>
                <div className="mt-5 pt-5 border-t border-[#1F1B2E] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#6B7280]">∞ COMBINATIONS</span>
                  <span className="text-[#38BDF8] group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats */}
      <ScrollReveal>
        <div className="border-y border-[#1F1B2E] bg-[#13111A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 text-center">
            {[
              { value: "247", label: "Breeds", suffix: "" },
              { value: "12", label: "Daily Facts", suffix: "+" },
              { value: "5", label: "Purrs / Day", suffix: "" },
              { value: "10", label: "Cat Personalities", suffix: "" },
              { value: "8", label: "AM Delivery", suffix: "am" },
            ].map(s => (
              <div key={s.label}>
                <p className="font-display text-3xl sm:text-4xl font-black text-[#F97316]">
                  {s.value}<span className="text-[#FBBF24]">{s.suffix}</span>
                </p>
                <p className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-[#6B7280] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-24">
        <ScrollReveal className="text-center mb-10 sm:mb-16">
          <p className="text-xs font-mono tracking-widest uppercase text-[#FBBF24] mb-3">How it works</p>
          <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight">Simple as a cat nap</h2>
        </ScrollReveal>
        <div className="space-y-3">
          {[
            { step: "01", icon: "✉️", title: "Sign in with a magic link", desc: "No password. Just your email. One click and you're in." },
            { step: "02", icon: "📬", title: "Subscribe to your daily digest", desc: "Set your timezone. Cat fact, breed spotlight, and cat photo every morning at 8am via Temporal." },
            { step: "03", icon: "🎨", title: "Design a Purr Postcard", desc: "Pick a template, drag stickers, write your message. Schedule for any future date." },
            { step: "04", icon: "🐾", title: "They open a link, you spread cat love", desc: "Recipient gets a beautiful email with a public view link. No account needed." },
          ].map(item => (
            <ScrollReveal key={item.step}>
              <div className="bg-[#13111A] border border-[#1F1B2E] rounded-2xl p-4 sm:p-6 flex items-start gap-3 sm:gap-6">
                <span className="font-mono text-xs text-[#1F1B2E] font-bold shrink-0 mt-1 hidden sm:block">{item.step}</span>
                <span className="text-2xl sm:text-3xl shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-[#FAF9F7] mb-1">{item.title}</h3>
                  <p className="text-[#6B7280] text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <ScrollReveal>
        <section className="mx-3 sm:mx-4 mb-10 sm:mb-12 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1C1928] via-[#13111A] to-[#1C1020] border border-[#1F1B2E] p-8 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-[#F97316]/8 blur-3xl" />
          </div>
          <div className="relative">
            <p className="text-4xl sm:text-6xl mb-4 sm:mb-6">🐱</p>
            <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight mb-3 sm:mb-4">
              The cats are taking over.<br />
              <span className="gradient-text">Help them.</span>
            </h2>
            <p className="text-[#6B7280] mb-6 sm:mb-10 text-sm sm:text-lg">Free. No credit card. Just pure cat content, every day.</p>
            <Link href="/login"
              className="inline-block bg-[#F97316] text-[#08070A] font-black px-8 sm:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl text-base sm:text-lg hover:bg-[#ea6a0f] transition-all active:scale-95 glow-pulse">
              Join the Clowder →
            </Link>
            <p className="text-xs font-mono text-[#6B7280] mt-4 tracking-widest uppercase">
              A clowder is what you call a group of cats.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* Footer */}
      <footer className="border-t border-[#1F1B2E] py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <span className="font-display text-lg font-black">Purr<span className="text-[#F97316]">·</span>Pedia</span>
          <p className="text-xs font-mono text-[#6B7280] tracking-widest uppercase">Built for #hackthekitty 2026</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-[#6B7280]">
            <Link href="/login" className="hover:text-[#F97316] transition-colors">Sign In</Link>
            <Link href="/breeds" className="hover:text-[#F97316] transition-colors">Breeds</Link>
            <Link href="/quiz" className="hover:text-[#F97316] transition-colors">Quiz</Link>
            <Link href="/name-generator" className="hover:text-[#F97316] transition-colors">Name Gen</Link>
            <Link href="/postcards/new" className="hover:text-[#F97316] transition-colors">Send a Purr</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
