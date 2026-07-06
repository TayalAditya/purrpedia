"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import { useCatSound } from "@/components/CatSounds";

interface Breed {
  id: string;
  name: string;
  description: string;
  temperament: string;
  life_span: string;
  origin: string;
  weight: { metric: string };
  intelligence: number;
  affection_level: number;
  energy_level: number;
  grooming: number;
  child_friendly: number;
  dog_friendly: number;
  stranger_friendly: number;
  indoor: number;
  adaptability: number;
  wikipedia_url?: string;
  alt_names?: string;
  image?: { url: string };
}

function StatBar({ label, value, color = "#F97316" }: { label: string; value: number; color?: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-mono text-[#6B7280] uppercase tracking-wider">{label}</span>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="w-4 h-1.5 rounded-full transition-all duration-500"
              style={{ background: i <= value ? color : "#1F1B2E" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BreedDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [breed, setBreed] = useState<Breed | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [wikiSummary, setWikiSummary] = useState<string>("");
  const { playMeow } = useCatSound();

  useEffect(() => {
    fetch(`/api/breeds?id=${id}`)
      .then(r => r.json())
      .then(({ breed: b, images: imgs }: { breed: Breed; images: { url: string }[] }) => {
        setBreed(b);
        setImages(imgs.map((i) => i.url));
        setLoading(false);
        // Fetch Wikipedia summary via our proxy
        if (b?.name) {
          fetch(`/api/wiki?name=${encodeURIComponent(b.name + " cat")}`)
            .then(r => r.json())
            .then(d => { if (d.summary) setWikiSummary(d.summary); })
            .catch(() => {});
        }
      }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <main className="min-h-screen bg-[#08070A] flex items-center justify-center">
      <div className="text-5xl animate-bounce">🐱</div>
    </main>
  );

  if (!breed) return (
    <main className="min-h-screen bg-[#08070A] flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">🙀</p>
        <p className="text-[#6B7280]">Breed not found</p>
        <Link href="/breeds" className="text-[#F97316] mt-4 inline-block">← Back to breeds</Link>
      </div>
    </main>
  );

  const traitGroups = [
    { label: "Intelligence", value: breed.intelligence, color: "#A78BFA" },
    { label: "Affection", value: breed.affection_level, color: "#F472B6" },
    { label: "Energy", value: breed.energy_level, color: "#F97316" },
    { label: "Grooming needs", value: breed.grooming, color: "#FBBF24" },
    { label: "Child friendly", value: breed.child_friendly, color: "#34D399" },
    { label: "Dog friendly", value: breed.dog_friendly, color: "#38BDF8" },
    { label: "Stranger friendly", value: breed.stranger_friendly, color: "#C084FC" },
    { label: "Adaptability", value: breed.adaptability, color: "#FB923C" },
    { label: "Indoor suitability", value: breed.indoor, color: "#4ADE80" },
  ];

  return (
    <main className="min-h-screen bg-[#08070A]">
      <MobileNav backHref="/breeds" backLabel="All Breeds" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-mono tracking-widest uppercase text-[#F97316] mb-2">Breed Profile</p>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-5xl font-black text-[#FAF9F7] mb-1"
                  onClick={() => playMeow()} style={{ cursor: "default" }}>
                {breed.name}
              </h1>
              {breed.alt_names && (
                <p className="text-sm text-[#6B7280] font-mono">Also known as: {breed.alt_names}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="bg-[#13111A] border border-[#1F1B2E] px-3 py-1.5 rounded-full text-[#6B7280]">📍 {breed.origin}</span>
              <span className="bg-[#13111A] border border-[#1F1B2E] px-3 py-1.5 rounded-full text-[#6B7280]">⏱ {breed.life_span} yrs</span>
              <span className="bg-[#13111A] border border-[#1F1B2E] px-3 py-1.5 rounded-full text-[#6B7280]">⚖️ {breed.weight?.metric} kg</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6 sm:gap-8">
          {/* Left — images + about */}
          <div className="space-y-4 sm:space-y-6">
            {/* Image gallery */}
            <div className="rounded-2xl overflow-hidden bg-[#13111A] aspect-[4/3]">
              {images[activeImg] ? (
                <img src={images[activeImg]} alt={breed.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">🐱</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((url, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? "border-[#F97316]" : "border-[#1F1B2E]"}`}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="bg-[#13111A] border border-[#1F1B2E] rounded-2xl p-5 sm:p-6">
              <p className="text-xs font-mono tracking-widest uppercase text-[#6B7280] mb-3">About</p>
              <p className="text-[#FAF9F7] leading-relaxed text-sm sm:text-base">{breed.description}</p>
            </div>

            {/* Wikipedia summary — fetched server-side, shown inline */}
            {wikiSummary && (
              <div className="bg-[#0D0B14] border border-[#1F1B2E] rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs font-mono tracking-widest uppercase text-[#6B7280]">Encyclopedia Entry</p>
                  <span className="text-[10px] font-mono bg-[#1F1B2E] text-[#6B7280] px-2 py-0.5 rounded-full">via Wikipedia</span>
                </div>
                <p className="text-[#6B7280] leading-relaxed text-sm">{wikiSummary}</p>
              </div>
            )}

            {/* Send postcard CTA */}
            <Link href="/postcards/new"
              className="block text-center bg-[#F97316] text-[#08070A] font-black py-4 rounded-xl hover:bg-[#ea6a0f] transition-colors">
              Send a {breed.name} Purr Postcard 🐾
            </Link>
          </div>

          {/* Right — traits + temperament */}
          <div className="space-y-4">
            {/* Temperament */}
            <div className="bg-[#13111A] border border-[#1F1B2E] rounded-2xl p-5">
              <p className="text-xs font-mono tracking-widest uppercase text-[#6B7280] mb-4">Temperament</p>
              <div className="flex flex-wrap gap-1.5">
                {breed.temperament.split(", ").map(t => (
                  <span key={t} className="text-xs font-mono bg-[#0D0B14] border border-[#1F1B2E] text-[#FBBF24] px-2.5 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Trait ratings */}
            <div className="bg-[#13111A] border border-[#1F1B2E] rounded-2xl p-5">
              <p className="text-xs font-mono tracking-widest uppercase text-[#6B7280] mb-4">Trait Ratings</p>
              <div className="space-y-3">
                {traitGroups.filter(t => t.value > 0).map(t => (
                  <StatBar key={t.label} label={t.label} value={t.value} color={t.color} />
                ))}
              </div>
            </div>

            {/* Quick facts */}
            <div className="bg-[#13111A] border border-[#1F1B2E] rounded-2xl p-5">
              <p className="text-xs font-mono tracking-widest uppercase text-[#6B7280] mb-4">Quick Facts</p>
              <div className="space-y-3">
                {[
                  { label: "Origin", value: breed.origin },
                  { label: "Life span", value: `${breed.life_span} years` },
                  { label: "Weight", value: `${breed.weight?.metric} kg` },
                ].map(f => (
                  <div key={f.label} className="flex justify-between items-center py-2 border-b border-[#1F1B2E] last:border-0">
                    <span className="text-xs font-mono text-[#6B7280] uppercase tracking-wider">{f.label}</span>
                    <span className="text-sm text-[#FAF9F7] font-medium">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related breeds */}
            <div className="bg-[#13111A] border border-[#1F1B2E] rounded-2xl p-5">
              <p className="text-xs font-mono tracking-widest uppercase text-[#6B7280] mb-3">Explore More</p>
              <Link href="/breeds" className="flex items-center justify-between text-sm text-[#FAF9F7] hover:text-[#F97316] transition-colors group">
                <span>Browse all 247 breeds</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <div className="border-t border-[#1F1B2E] mt-3 pt-3">
                <Link href="/facts" className="flex items-center justify-between text-sm text-[#FAF9F7] hover:text-[#F97316] transition-colors group">
                  <span>Explore cat facts</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
