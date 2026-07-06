"use client";

import { useState, useCallback } from "react";
import MobileNav from "@/components/MobileNav";
import { useCatSound } from "@/components/CatSounds";

const PREFIXES = [
  "Sir", "Lady", "Professor", "Captain", "Baron", "Duchess", "Lord", "Princess",
  "General", "Count", "Dr.", "Agent", "King", "Queen", "Saint", "Grand Master",
  "El", "Don", "The Honorable", "Señor", "Empress", "Chancellor", "Admiral",
];
const FIRST_NAMES = [
  "Whiskers", "Mittens", "Shadow", "Biscuit", "Noodle", "Muffin", "Pickle",
  "Cheddar", "Waffle", "Pumpkin", "Nugget", "Tofu", "Mochi", "Pepper",
  "Ginger", "Oreo", "Socks", "Boots", "Marble", "Velvet", "Cinnamon",
  "Butterscotch", "Pancake", "Dumpling", "Pretzel", "Cashew", "Truffle",
  "Pudding", "Wonton", "Taco", "Nacho", "Churro", "Boba", "Chai",
  "Espresso", "Latte", "Mocha", "Caramel", "Fudge", "Brownie",
];
const LAST_NAMES = [
  "McFluffington", "Von Purrington", "Whiskersworth", "Pawsley", "Meowington",
  "Fluffbottom", "Snugglepaws", "Cattington", "Purrwell", "Floofsworth",
  "McSnoot", "Von Beans", "Biscuitface", "Toe-Beans III", "Nappington",
  "Fuzzbucket", "Loafington", "Chonksworth", "Scratchmore", "De La Whisker",
  "Hissington", "McMeow", "Purrfect", "Clawsworth", "Catticus",
  "Furrdinand", "Meowzer", "Tabbytha", "Kittsworth", "Pawdington",
];
const TITLES = [
  "Destroyer of Curtains", "Keeper of the Litter Box", "Lord of the Sunbeam",
  "Guardian of the Cardboard Box", "Ruler of the Red Dot", "Master of 3am Zoomies",
  "Protector of the Couch Corner", "Conqueror of the Kitchen Counter",
  "Defender of the Empty Bowl", "Champion of Knocking Things Off Tables",
  "Warden of the Warm Laptop", "Sovereign of the Paper Bag", "Herald of the Midnight Yowl",
  "Duke of Belly Traps", "Architect of Hairballs", "Overlord of Ignored Toys",
  "Governor of the Windowsill", "Chief Inspector of Grocery Bags",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface GeneratedName {
  prefix: string;
  first: string;
  last: string;
  title: string;
  color: string;
}

const COLORS = ["#F97316", "#A78BFA", "#34D399", "#F472B6", "#38BDF8", "#FBBF24", "#C084FC", "#FB923C"];

export default function NameGeneratorPage() {
  const [names, setNames] = useState<GeneratedName[]>([]);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const { playMeow, playSwipe } = useCatSound();

  const generate = useCallback(() => {
    playSwipe();
    setGenerating(true);
    setTimeout(() => {
      const batch: GeneratedName[] = Array.from({ length: 4 }, () => ({
        prefix: pick(PREFIXES),
        first: pick(FIRST_NAMES),
        last: pick(LAST_NAMES),
        title: pick(TITLES),
        color: pick(COLORS),
      }));
      setNames(batch);
      setGenerating(false);
      playMeow(1);
    }, 500);
  }, [playMeow, playSwipe]);

  const copyName = (name: GeneratedName, index: number) => {
    const full = `${name.prefix} ${name.first} ${name.last}, ${name.title}`;
    navigator.clipboard.writeText(full);
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <main className="min-h-screen bg-[#08070A]">
      <MobileNav backHref="/" backLabel="Home" />

      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-xs font-mono tracking-widest uppercase text-[#FBBF24] mb-3">Cat Name Generator</p>
          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-[#FAF9F7] mb-3">
            Name Your <span className="gradient-text">Royal Feline</span>
          </h1>
          <p className="text-[#6B7280] text-sm sm:text-base max-w-md mx-auto">
            Every cat deserves a name worthy of their magnificence. Generate ridiculous, royal, and utterly perfect cat names.
          </p>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={generate}
            disabled={generating}
            className="bg-[#F97316] text-[#08070A] font-black px-8 py-4 rounded-xl text-sm sm:text-base hover:bg-[#ea6a0f] transition-all active:scale-95 disabled:opacity-50 glow-pulse"
          >
            {generating ? "Summoning names..." : names.length ? "Generate More Names 🎲" : "Generate Cat Names 🐱"}
          </button>
        </div>

        {names.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {names.map((name, i) => (
              <button
                key={`${name.first}-${name.last}-${i}`}
                onClick={() => copyName(name, i)}
                className="card-hover bg-[#13111A] border border-[#1F1B2E] rounded-2xl p-5 text-left group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl pointer-events-none" style={{ background: `${name.color}10` }} />
                <p className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: name.color }}>
                  {name.prefix}
                </p>
                <h3 className="font-display text-xl font-bold text-[#FAF9F7] mb-0.5">
                  {name.first} {name.last}
                </h3>
                <p className="text-xs text-[#6B7280] font-mono italic">
                  {name.title}
                </p>
                <div className="mt-3 pt-3 border-t border-[#1F1B2E] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider">
                    {copied === i ? "✓ Copied!" : "Click to copy"}
                  </span>
                  <span className="text-xs group-hover:translate-x-1 transition-transform" style={{ color: name.color }}>→</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {names.length === 0 && !generating && (
          <div className="text-center py-10">
            <div className="text-7xl mb-4">🐱</div>
            <p className="text-[#6B7280] text-sm font-mono">Press the button to generate majestic cat names</p>
          </div>
        )}
      </div>
    </main>
  );
}
