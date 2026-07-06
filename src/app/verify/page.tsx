import Link from "next/link";
import PurrPediaLogo from "@/components/PurrPediaLogo";

export default function VerifyPage() {
  return (
    <main className="min-h-screen bg-[#08070A] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[400px] rounded-full bg-[#F97316]/5 blur-3xl" />
      </div>

      <div className="relative z-10">
        <Link href="/" className="flex items-center gap-3 justify-center mb-12 hover:opacity-80 transition-opacity">
          <PurrPediaLogo size={36} />
          <span className="font-display text-2xl font-black">
            Purr<span className="text-[#F97316]">·</span>Pedia
          </span>
        </Link>

        <div className="bg-[#13111A] border border-[#1F1B2E] rounded-2xl p-10 max-w-sm mx-auto">
          <div className="text-6xl mb-5">📬</div>
          <h1 className="font-display text-2xl font-bold text-[#FAF9F7] mb-3">
            Check your inbox
          </h1>
          <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
            A magic link is on its way. Click it to sign in — no password needed.
          </p>

          <div className="bg-[#08070A] border border-[#1F1B2E] rounded-xl p-4 mb-6">
            <p className="text-[10px] font-mono tracking-widest uppercase text-[#F97316] mb-1">
              Note
            </p>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Link expires in <span className="text-[#FAF9F7]">24 hours</span>. Check spam if you don&apos;t see it.
            </p>
          </div>

          <Link
            href="/"
            className="text-sm font-mono text-[#6B7280] hover:text-[#F97316] transition-colors"
          >
            ← Back to PurrPedia
          </Link>
        </div>

        <p className="text-xs font-mono text-[#6B7280] mt-6 tracking-widest uppercase">
          FREE · NO PASSWORD · JUST CATS
        </p>
      </div>
    </main>
  );
}
