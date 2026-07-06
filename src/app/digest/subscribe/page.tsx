"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PurrPediaLogo from "@/components/PurrPediaLogo";

// Popular timezones grouped, India first
const TZ_GROUPS = [
  {
    group: "🇮🇳 India",
    zones: [{ label: "India (IST, UTC+5:30)", value: "Asia/Kolkata" }],
  },
  {
    group: "🌏 Asia & Pacific",
    zones: [
      { label: "Tokyo (JST, UTC+9)", value: "Asia/Tokyo" },
      { label: "Shanghai / Beijing (CST, UTC+8)", value: "Asia/Shanghai" },
      { label: "Singapore (SGT, UTC+8)", value: "Asia/Singapore" },
      { label: "Dubai (GST, UTC+4)", value: "Asia/Dubai" },
      { label: "Karachi (PKT, UTC+5)", value: "Asia/Karachi" },
      { label: "Dhaka (BST, UTC+6)", value: "Asia/Dhaka" },
      { label: "Bangkok (ICT, UTC+7)", value: "Asia/Bangkok" },
      { label: "Sydney (AEST, UTC+10)", value: "Australia/Sydney" },
      { label: "Auckland (NZST, UTC+12)", value: "Pacific/Auckland" },
    ],
  },
  {
    group: "🌍 Europe & Africa",
    zones: [
      { label: "London (GMT/BST)", value: "Europe/London" },
      { label: "Paris / Berlin (CET, UTC+1)", value: "Europe/Paris" },
      { label: "Moscow (MSK, UTC+3)", value: "Europe/Moscow" },
      { label: "Istanbul (TRT, UTC+3)", value: "Europe/Istanbul" },
      { label: "Nairobi (EAT, UTC+3)", value: "Africa/Nairobi" },
      { label: "Lagos (WAT, UTC+1)", value: "Africa/Lagos" },
    ],
  },
  {
    group: "🌎 Americas",
    zones: [
      { label: "New York (EST/EDT, UTC-5)", value: "America/New_York" },
      { label: "Chicago (CST/CDT, UTC-6)", value: "America/Chicago" },
      { label: "Denver (MST/MDT, UTC-7)", value: "America/Denver" },
      { label: "Los Angeles (PST/PDT, UTC-8)", value: "America/Los_Angeles" },
      { label: "São Paulo (BRT, UTC-3)", value: "America/Sao_Paulo" },
      { label: "Mexico City (CST, UTC-6)", value: "America/Mexico_City" },
    ],
  },
  {
    group: "🌐 Universal",
    zones: [
      { label: "UTC (Universal)", value: "UTC" },
    ],
  },
];

export default function SubscribePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detectedTz, setDetectedTz] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  // Auto-detect timezone from browser
  useEffect(() => {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detected) {
      setDetectedTz(detected);
      setTimezone(detected);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/digest/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timezone }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#08070A] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-[#F97316]/5 blur-3xl" />
      </div>

      <Link href="/" className="relative z-10 flex items-center gap-3 mb-10 hover:opacity-80 transition-opacity">
        <PurrPediaLogo size={36} />
        <span className="font-display text-2xl font-black">
          Purr<span className="text-[#F97316]">·</span>Pedia
        </span>
      </Link>

      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-[#13111A] border border-[#1F1B2E] rounded-2xl p-8">
          <div className="text-4xl mb-4">📬</div>
          <h1 className="font-display text-2xl font-bold text-[#FAF9F7] mb-1">Daily Digest</h1>
          <p className="text-[#6B7280] text-sm mb-6 leading-relaxed">
            A cat fact, breed spotlight & cat of the day — every morning at <span className="text-[#F97316] font-mono">8:00am</span> your time, delivered by Temporal.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono tracking-widest uppercase text-[#6B7280]">
                  Your timezone
                </label>
                {detectedTz && (
                  <span className="text-[10px] font-mono text-[#F97316] bg-[#F97316]/10 px-2 py-0.5 rounded-full">
                    Auto-detected ✓
                  </span>
                )}
              </div>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-[#08070A] border border-[#1F1B2E] rounded-lg px-4 py-3 text-sm text-[#FAF9F7] outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-colors"
              >
                {/* Auto-detected option at top */}
                {detectedTz && (
                  <option value={detectedTz}>
                    📍 {detectedTz} (detected)
                  </option>
                )}
                {TZ_GROUPS.map((g) => (
                  <optgroup key={g.group} label={g.group}>
                    {g.zones.map((z) => (
                      <option key={z.value} value={z.value}>{z.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <p className="text-xs text-[#6B7280] font-mono mt-1.5">
                Your digest will arrive at 8:00am <span className="text-[#FAF9F7]">{timezone}</span>
              </p>
            </div>

            {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F97316] text-[#08070A] font-black py-3 rounded-lg hover:bg-[#ea6a0f] transition-colors disabled:opacity-50"
            >
              {loading ? "Subscribing..." : "Subscribe to Daily Digest →"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs font-mono text-[#6B7280] mt-5 tracking-wider">
          UNSUBSCRIBE ANYTIME · ONE CLICK
        </p>
      </div>
    </main>
  );
}
