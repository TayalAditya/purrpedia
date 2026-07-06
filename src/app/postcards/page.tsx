import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PostcardsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const postcards = await prisma.postcard.findMany({
    where: { senderId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto border-b border-stone-200">
        <Link href="/" className="text-xl font-black tracking-tight">🐱 PurrPedia</Link>
        <Link href="/postcards/new" className="bg-amber-400 text-stone-900 text-sm font-bold px-4 py-2 rounded-lg hover:bg-amber-300 transition-colors">
          Send a Purr →
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black tracking-tight mb-8">My Postcards</h1>

        {postcards.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🐾</div>
            <p className="text-stone-500 mb-4">No postcards yet. Send your first Purr!</p>
            <Link href="/postcards/new" className="bg-stone-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-stone-700 transition-colors inline-block">
              Send a Purr →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {postcards.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-stone-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-sm">{p.recipientName ?? p.recipientEmail}</p>
                    <p className="text-stone-400 text-xs">{p.recipientEmail}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    p.status === "SENT" ? "bg-green-100 text-green-700" :
                    p.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                    p.status === "CANCELLED" ? "bg-stone-100 text-stone-500" :
                    "bg-red-100 text-red-600"
                  }`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-stone-600 text-sm line-clamp-2 mb-3">{p.message}</p>
                <p className="text-stone-400 text-xs">
                  {p.status === "SENT" && p.sentAt
                    ? `Sent ${p.sentAt.toLocaleDateString()}`
                    : `Scheduled for ${p.scheduledFor.toLocaleDateString()}`}
                </p>
                {p.status === "SENT" && (
                  <Link
                    href={`/postcards/${p.viewToken}`}
                    className="text-xs font-semibold text-stone-900 hover:underline mt-2 inline-block"
                  >
                    View postcard →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
