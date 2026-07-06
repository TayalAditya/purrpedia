"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";

interface Breed {
  id: string;
  name: string;
  description: string;
  temperament: string;
  life_span: string;
  origin: string;
  image?: { url: string };
  intelligence: number;
  affection_level: number;
  energy_level: number;
  grooming: number;
}

function BreedCard({ breed }: { breed: Breed }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <Link href={`/breeds/${breed.id}`}>
      <div className="card-hover bg-[#13111A] border border-[#1F1B2E] rounded-2xl overflow-hidden group cursor-pointer h-full">
        <div className="aspect-[4/3] bg-[#0D0B14] relative overflow-hidden">
          {breed.image?.url && !imgErr ? (
            <img
              src={breed.image.url}
              alt={breed.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🐱</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#13111A] via-transparent to-transparent" />
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-display text-lg font-bold text-[#FAF9F7] leading-tight">{breed.name}</h3>
            <span className="text-xs font-mono text-[#6B7280] shrink-0 ml-2">{breed.origin}</span>
          </div>
          <p className="text-[#6B7280] text-xs leading-relaxed line-clamp-2 mb-3">{breed.description}</p>
          <div className="flex flex-wrap gap-1">
            {breed.temperament.split(", ").slice(0, 3).map(t => (
              <span key={t} className="text-[10px] font-mono bg-[#0D0B14] border border-[#1F1B2E] text-[#6B7280] px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function BreedsPage() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [filtered, setFiltered] = useState<Breed[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/breeds`)
      .then(r => r.json())
      .then((data: Breed[]) => {
        setBreeds(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(breeds); return; }
    const q = search.toLowerCase();
    setFiltered(breeds.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.origin?.toLowerCase().includes(q) ||
      b.temperament?.toLowerCase().includes(q)
    ));
  }, [search, breeds]);

  return (
    <main className="min-h-screen bg-[#08070A]">
      <MobileNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <p className="text-xs font-mono tracking-widest uppercase text-[#F97316] mb-3">Breed Index</p>
          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-[#FAF9F7] mb-3 sm:mb-4">
            The Cat Encyclopedia
          </h1>
          <p className="text-[#6B7280] text-base sm:text-lg mb-6 sm:mb-8">
            {breeds.length} breeds catalogued. Every one with photos, temperament data, and origin stories.
          </p>

          <div className="relative max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">🔍</span>
            <input
              type="text"
              placeholder="Search breeds, origins, traits..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#13111A] border border-[#1F1B2E] rounded-xl pl-11 pr-4 py-3 text-sm text-[#FAF9F7] placeholder-[#6B7280] outline-none focus:border-[#F97316] transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-[#13111A] border border-[#1F1B2E] rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-[#1C1928]" />
                <div className="p-3 sm:p-5 space-y-2">
                  <div className="h-4 bg-[#1C1928] rounded w-3/4" />
                  <div className="h-3 bg-[#1C1928] rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🙀</p>
            <p className="text-[#6B7280]">No breeds found for &quot;{search}&quot;</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map(breed => <BreedCard key={breed.id} breed={breed} />)}
          </div>
        )}
      </div>
    </main>
  );
}
