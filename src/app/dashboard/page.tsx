import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import PurrPediaLogo from "@/components/PurrPediaLogo";
import LogoutButton from "@/components/LogoutButton";
import LocalDate from "@/components/LocalDate";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [subscription, recentPostcards] = await Promise.all([
    prisma.digestSubscription.findUnique({
      where: { userId: session.user.id },
      include: { digestLogs: { orderBy: { sentAt: "desc" }, take: 5 } },
    }),
    prisma.postcard.findMany({
      where: { senderId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#08070A]">
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto border-b border-[#1F1B2E]">
        <Link href="/" className="flex items-center gap-2.5">
          <PurrPediaLogo size={32} />
          <span className="font-display text-xl font-black">
            Purr<span className="text-[#F97316]">·</span>Pedia
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-[#6B7280] tracking-wider hidden sm:block">{session.user.email}</span>
          <LogoutButton />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-[#F97316] mb-2">Dashboard</p>
            <h1 className="font-display text-4xl font-black tracking-tight text-[#FAF9F7]">Your Cat HQ</h1>
          </div>
          <Link
            href="/postcards/new"
            className="bg-[#F97316] text-[#08070A] font-bold px-5 py-2.5 rounded-xl hover:bg-[#ea6a0f] transition-colors text-sm"
          >
            Send a Purr →
          </Link>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Digests Sent", value: subscription?.digestLogs.length ?? 0, icon: "📬", color: "#F97316" },
            { label: "Postcards Sent", value: recentPostcards.filter(p => p.status === "SENT").length, icon: "🐾", color: "#A78BFA" },
            { label: "Digest Status", value: subscription?.isActive ? "ACTIVE" : "OFF", icon: "⚡", color: "#FBBF24" },
          ].map(s => (
            <div key={s.label} className="bg-[#13111A] border border-[#1F1B2E] rounded-2xl p-6">
              <span className="text-2xl block mb-3">{s.icon}</span>
              <p className="font-display text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs font-mono tracking-widest uppercase text-[#6B7280] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Digest card */}
          <div className="bg-[#13111A] border border-[#1F1B2E] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-mono tracking-widest uppercase text-[#F97316] mb-1">Feature 01</p>
                <h2 className="font-display text-xl font-bold text-[#FAF9F7]">Daily Digest</h2>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full ${subscription?.isActive ? "bg-green-400" : "bg-[#1F1B2E]"}`} />
            </div>

            {subscription?.isActive ? (
              <div className="space-y-4">
                <p className="text-sm text-[#6B7280]">
                  Delivering at <span className="text-[#FBBF24] font-mono">8:00am</span> {subscription.timezone} every day via Temporal.
                </p>
                {subscription.digestLogs.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-mono text-[#6B7280] uppercase tracking-wider">Recent deliveries</p>
                    {subscription.digestLogs.slice(0, 3).map(log => (
                      <div key={log.id} className="flex items-center justify-between py-2 border-b border-[#1F1B2E]">
                        <span className="text-xs text-[#6B7280] font-mono">{log.breedName}</span>
                        <span className="text-xs text-green-400 font-mono">✓ SENT</span>
                      </div>
                    ))}
                  </div>
                )}
                <form action="/api/digest/unsubscribe" method="get">
                  <input type="hidden" name="token" value={subscription.unsubscribeToken} />
                  <button type="submit" className="text-xs text-red-400 hover:text-red-300 font-mono transition-colors">
                    Unsubscribe →
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-[#6B7280]">Get a cat fact, breed spotlight & cat photo every morning at 8am.</p>
                <Link
                  href="/digest/subscribe"
                  className="inline-block bg-[#F97316] text-[#08070A] text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#ea6a0f] transition-colors"
                >
                  Subscribe →
                </Link>
              </div>
            )}
          </div>

          {/* Postcards card */}
          <div className="bg-[#13111A] border border-[#1F1B2E] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-mono tracking-widest uppercase text-[#A78BFA] mb-1">Feature 02</p>
                <h2 className="font-display text-xl font-bold text-[#FAF9F7]">Purr Postcards</h2>
              </div>
              <span className="text-xs font-mono text-[#6B7280] bg-[#1C1928] px-2 py-1 rounded-full">5/day limit</span>
            </div>

            {recentPostcards.length === 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-[#6B7280]">Design a cat postcard, schedule it for any date. Delivered by Temporal.</p>
                <Link
                  href="/postcards/new"
                  className="inline-block bg-[#A78BFA] text-[#08070A] text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#9b7af5] transition-colors"
                >
                  Send your first Purr →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentPostcards.map(p => (
                  <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-[#1F1B2E]">
                    <div>
                      <p className="text-sm text-[#FAF9F7] font-medium">{p.recipientName ?? p.recipientEmail}</p>
                      <p className="text-xs text-[#6B7280] font-mono mt-0.5">
                        <LocalDate
                          date={(p.status === "SENT" ? p.sentAt ?? p.scheduledFor : p.scheduledFor).toISOString()}
                          prefix={p.status === "SENT" ? "Sent" : "Scheduled"}
                        />
                      </p>
                    </div>
                    <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-full ${
                      p.status === "SENT" ? "bg-green-900/30 text-green-400" :
                      p.status === "PENDING" ? "bg-amber-900/30 text-amber-400" :
                      "bg-[#1C1928] text-[#6B7280]"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                ))}
                <Link href="/postcards" className="text-xs font-mono text-[#6B7280] hover:text-[#F97316] transition-colors pt-2 inline-block">
                  View all postcards →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Explore */}
        <div className="bg-gradient-to-r from-[#1C1528] to-[#13111A] border border-[#A78BFA]/20 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-[#A78BFA] mb-1">Explore</p>
            <h3 className="font-display text-xl font-bold text-[#FAF9F7]">Browse 247 Breeds</h3>
            <p className="text-sm text-[#6B7280] mt-1">Full profiles, photos, temperament data.</p>
          </div>
          <Link href="/breeds"
            className="shrink-0 bg-[#A78BFA] text-[#08070A] font-bold px-5 py-2.5 rounded-xl hover:bg-[#9b7af5] transition-colors text-sm">
            Open Index →
          </Link>
        </div>
      </div>
    </main>
  );
}
