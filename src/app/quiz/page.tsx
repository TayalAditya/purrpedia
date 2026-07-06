"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import { useCatSound } from "@/components/CatSounds";

interface Question {
  q: string;
  emoji: string;
  options: { label: string; scores: Record<string, number> }[];
}

const QUESTIONS: Question[] = [
  {
    q: "It's Saturday morning. What are you doing?",
    emoji: "🌅",
    options: [
      { label: "Still sleeping at noon", scores: { persian: 3, ragdoll: 2, british: 1 } },
      { label: "Already at the gym", scores: { bengal: 3, abyssinian: 2, siamese: 1 } },
      { label: "Reading with coffee", scores: { russian: 3, british: 2, persian: 1 } },
      { label: "Calling friends to hang out", scores: { siamese: 3, burmese: 2, abyssinian: 1 } },
    ],
  },
  {
    q: "Pick your ideal living space:",
    emoji: "🏠",
    options: [
      { label: "Cozy studio apartment", scores: { russian: 3, persian: 2, british: 1 } },
      { label: "Big house with a yard", scores: { maine: 3, bengal: 2, abyssinian: 1 } },
      { label: "Penthouse with a view", scores: { siamese: 3, bengal: 2, sphynx: 1 } },
      { label: "Anywhere with good company", scores: { ragdoll: 3, burmese: 2, siamese: 1 } },
    ],
  },
  {
    q: "How do you handle conflict?",
    emoji: "⚡",
    options: [
      { label: "Walk away and nap on it", scores: { persian: 3, british: 2, ragdoll: 1 } },
      { label: "Talk it out immediately", scores: { siamese: 3, burmese: 2, sphynx: 1 } },
      { label: "Quietly plot my strategy", scores: { russian: 3, abyssinian: 2, bengal: 1 } },
      { label: "What conflict? I'm chill", scores: { ragdoll: 3, maine: 2, british: 1 } },
    ],
  },
  {
    q: "Your friend group role?",
    emoji: "👥",
    options: [
      { label: "The loud one everyone hears", scores: { siamese: 3, bengal: 2, sphynx: 1 } },
      { label: "The mysterious quiet one", scores: { russian: 3, persian: 2, british: 1 } },
      { label: "The one who plans everything", scores: { abyssinian: 3, maine: 2, burmese: 1 } },
      { label: "The hugger / emotional support", scores: { ragdoll: 3, burmese: 2, persian: 1 } },
    ],
  },
  {
    q: "Pick a superpower:",
    emoji: "✨",
    options: [
      { label: "Invisibility", scores: { russian: 3, persian: 2, british: 1 } },
      { label: "Super speed", scores: { bengal: 3, abyssinian: 2, siamese: 1 } },
      { label: "Mind reading", scores: { siamese: 3, sphynx: 2, burmese: 1 } },
      { label: "Teleportation", scores: { maine: 3, ragdoll: 2, abyssinian: 1 } },
    ],
  },
  {
    q: "What's your energy like at parties?",
    emoji: "🎉",
    options: [
      { label: "I AM the party", scores: { sphynx: 3, siamese: 2, bengal: 1 } },
      { label: "Vibing on the couch", scores: { persian: 3, ragdoll: 2, british: 1 } },
      { label: "Deep convos in the corner", scores: { russian: 3, burmese: 2, maine: 1 } },
      { label: "Left after 30 minutes", scores: { british: 3, russian: 2, persian: 1 } },
    ],
  },
  {
    q: "Pick a snack:",
    emoji: "🍿",
    options: [
      { label: "Something fancy & artisan", scores: { persian: 3, sphynx: 2, russian: 1 } },
      { label: "Pure protein — steak or chicken", scores: { bengal: 3, maine: 2, abyssinian: 1 } },
      { label: "Whatever's in the fridge", scores: { british: 3, ragdoll: 2, burmese: 1 } },
      { label: "Sharing someone else's food", scores: { siamese: 3, burmese: 2, sphynx: 1 } },
    ],
  },
];

interface Result {
  key: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  traits: string[];
  color: string;
}

const RESULTS: Record<string, Result> = {
  persian: {
    key: "persian",
    name: "Persian",
    emoji: "👑",
    tagline: "The Elegant Royalty",
    description: "You're calm, refined, and prefer the finer things in life. Chaos? Not your vibe. You'd rather curl up somewhere beautiful and let the world come to you.",
    traits: ["Calm", "Luxurious", "Low-key", "Elegant"],
    color: "#FBBF24",
  },
  siamese: {
    key: "siamese",
    name: "Siamese",
    emoji: "🗣️",
    tagline: "The Social Butterfly",
    description: "You're vocal, opinionated, and the life of every conversation. Silence makes you uncomfortable — you'd rather meow about it than bottle it up.",
    traits: ["Talkative", "Social", "Dramatic", "Loyal"],
    color: "#38BDF8",
  },
  bengal: {
    key: "bengal",
    name: "Bengal",
    emoji: "🐆",
    tagline: "The Wild Adventurer",
    description: "High-energy, fearless, and always looking for the next adrenaline hit. You're basically a wildcat trapped in a domestic body.",
    traits: ["Athletic", "Bold", "Energetic", "Curious"],
    color: "#F97316",
  },
  ragdoll: {
    key: "ragdoll",
    name: "Ragdoll",
    emoji: "🧸",
    tagline: "The Gentle Giant",
    description: "You go limp with love — literally. The ultimate cuddle buddy who follows people around and trusts everyone. Confrontation? Never heard of it.",
    traits: ["Affectionate", "Trusting", "Relaxed", "Gentle"],
    color: "#F472B6",
  },
  russian: {
    key: "russian",
    name: "Russian Blue",
    emoji: "🌙",
    tagline: "The Quiet Intellectual",
    description: "Mysterious, intelligent, and fiercely independent. You watch from the shadows, analyze everything, and only open up to your inner circle.",
    traits: ["Introverted", "Smart", "Loyal", "Reserved"],
    color: "#A78BFA",
  },
  british: {
    key: "british",
    name: "British Shorthair",
    emoji: "🫖",
    tagline: "The Chill Observer",
    description: "You're the calm in every storm. Unbothered, well-mannered, and perfectly content with routine. Dramatic people exhaust you.",
    traits: ["Calm", "Independent", "Patient", "Steady"],
    color: "#6B7280",
  },
  maine: {
    key: "maine",
    name: "Maine Coon",
    emoji: "🦁",
    tagline: "The Gentle Leader",
    description: "Big presence, big heart. You're the one everyone looks up to but you'd never boss anyone around. A natural leader who leads by being kind.",
    traits: ["Friendly", "Playful", "Large-hearted", "Adaptable"],
    color: "#34D399",
  },
  sphynx: {
    key: "sphynx",
    name: "Sphynx",
    emoji: "👽",
    tagline: "The Eccentric Showstopper",
    description: "You're unapologetically unique and you LOVE attention. Weird? Maybe. Iconic? Absolutely. You walk into a room and everyone stares.",
    traits: ["Extroverted", "Affectionate", "Unique", "Fearless"],
    color: "#C084FC",
  },
  abyssinian: {
    key: "abyssinian",
    name: "Abyssinian",
    emoji: "🏃",
    tagline: "The Restless Explorer",
    description: "You can't sit still. Every day is an adventure and every shelf needs climbing. Boredom is your worst enemy.",
    traits: ["Active", "Curious", "Playful", "Independent"],
    color: "#FB923C",
  },
  burmese: {
    key: "burmese",
    name: "Burmese",
    emoji: "💛",
    tagline: "The Devoted Companion",
    description: "You're warm, loyal, and thrive on deep connections. You'd rather have 3 close friends than 300 followers. Quality over quantity, always.",
    traits: ["Loving", "Social", "Loyal", "Warm"],
    color: "#FBBF24",
  },
};

function getResult(scores: Record<string, number>): Result {
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const topKey = sorted[0]?.[0] ?? "ragdoll";
  return RESULTS[topKey] ?? RESULTS.ragdoll;
}

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { playMeow, playSwipe } = useCatSound();

  const handleAnswer = useCallback(
    (optionScores: Record<string, number>, optionIndex: number) => {
      playSwipe();
      setSelectedOption(optionIndex);

      const newScores = { ...scores };
      Object.entries(optionScores).forEach(([k, v]) => {
        newScores[k] = (newScores[k] ?? 0) + v;
      });
      setScores(newScores);

      setTimeout(() => {
        setSelectedOption(null);
        if (step < QUESTIONS.length - 1) {
          setStep(step + 1);
        } else {
          playMeow(2);
          setResult(getResult(newScores));
        }
      }, 400);
    },
    [scores, step, playMeow, playSwipe],
  );

  const restart = () => {
    setStep(0);
    setScores({});
    setResult(null);
    setSelectedOption(null);
  };

  const question = QUESTIONS[step];
  const progress = ((step + (result ? 1 : 0)) / QUESTIONS.length) * 100;

  return (
    <main className="min-h-screen bg-[#08070A]">
      <MobileNav backHref="/" backLabel="Home" />

      <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">
        {!result ? (
          <>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-mono tracking-widest uppercase text-[#F97316]">
                  Question {step + 1} of {QUESTIONS.length}
                </p>
                <p className="text-xs font-mono text-[#6B7280]">{Math.round(progress)}%</p>
              </div>
              <div className="h-1 bg-[#1F1B2E] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#F97316] to-[#FBBF24] rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="text-center mb-8">
              <span className="text-5xl block mb-4">{question.emoji}</span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-[#FAF9F7] tracking-tight">
                {question.q}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.scores, i)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left bg-[#13111A] border rounded-2xl px-5 py-4 text-sm transition-all duration-300 ${
                    selectedOption === i
                      ? "border-[#F97316] bg-[#F97316]/10 scale-[0.98]"
                      : "border-[#1F1B2E] hover:border-[#F97316] hover:bg-[#1C1928]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 shrink-0 rounded-full border border-[#1F1B2E] flex items-center justify-center text-xs font-mono text-[#6B7280]">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-[#FAF9F7] font-medium">{opt.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Result */
          <div className="text-center">
            <p className="text-xs font-mono tracking-widest uppercase text-[#F97316] mb-6">
              Your result is in...
            </p>

            <div
              className="rounded-3xl border p-8 sm:p-10 mb-6"
              style={{ borderColor: `${result.color}40`, background: `${result.color}08` }}
            >
              <span className="text-7xl block mb-4">{result.emoji}</span>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-[#FAF9F7] mb-1">
                {result.name}
              </h2>
              <p className="text-sm font-mono mb-6" style={{ color: result.color }}>
                {result.tagline}
              </p>
              <p className="text-[#6B7280] leading-relaxed text-sm sm:text-base mb-6">
                {result.description}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {result.traits.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono px-3 py-1.5 rounded-full border"
                    style={{ color: result.color, borderColor: `${result.color}40` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={restart}
                className="flex-1 bg-[#13111A] border border-[#1F1B2E] text-[#FAF9F7] font-semibold px-6 py-3 rounded-xl hover:border-[#F97316] transition-all text-sm"
              >
                Retake Quiz 🔄
              </button>
              <Link
                href={`/breeds`}
                className="flex-1 bg-[#F97316] text-[#08070A] font-black px-6 py-3 rounded-xl hover:bg-[#ea6a0f] transition-all text-sm text-center"
              >
                Browse All Breeds →
              </Link>
            </div>

            <Link
              href="/postcards/new"
              className="inline-block mt-4 text-xs font-mono text-[#6B7280] hover:text-[#F97316] transition-colors"
            >
              Send a {result.name} postcard to a friend 🐾
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
