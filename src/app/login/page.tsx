"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import PurrPediaLogo from "@/components/PurrPediaLogo";
import { signInWithEmail } from "./actions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setError("");
    startTransition(async () => {
      try {
        await signInWithEmail(email);
      } catch (err: unknown) {
        // NextAuth throws a redirect — that's expected success behavior
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("NEXT_REDIRECT") || msg.includes("redirect")) return;
        if (msg.includes("Too many")) {
          setError(msg);
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    });
  }

  return (
    <main className="min-h-screen bg-[#08070A] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-125 h-125 rounded-full bg-[#F97316]/5 blur-3xl" />
      </div>

      <Link href="/" className="relative z-10 flex items-center gap-3 mb-12 hover:opacity-80 transition-opacity">
        <PurrPediaLogo size={40} />
        <span className="font-display text-2xl font-black">
          Purr<span className="text-[#F97316]">·</span>Pedia
        </span>
      </Link>

      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-[#13111A] border border-[#1F1B2E] rounded-2xl p-8">
          <div className="text-3xl mb-4">🐱</div>
          <h1 className="font-display text-2xl font-bold mb-1">Sign in</h1>
          <p className="text-muted-foreground text-sm mb-6">
            We&apos;ll send a magic link — no password needed.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isPending}
                className="w-full bg-[#08070A] border border-[#1F1B2E] rounded-lg px-4 py-3 text-sm text-[#FAF9F7] placeholder-muted-foreground outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-colors disabled:opacity-50"
              />
            </div>

            {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#F97316] text-[#08070A] font-black py-3 rounded-lg hover:bg-[#ea6a0f] transition-colors disabled:opacity-50 text-sm"
            >
              {isPending ? "Sending..." : "Send Magic Link →"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs font-mono text-muted-foreground mt-6 tracking-wider">
          FREE · NO CREDIT CARD · JUST CATS
        </p>
      </div>
    </main>
  );
}
