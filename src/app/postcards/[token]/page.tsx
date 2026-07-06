import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PostcardViewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const postcard = await prisma.postcard.findUnique({
    where: { viewToken: token },
    include: { sender: { select: { name: true } } },
  });

  if (!postcard || postcard.status !== "SENT") notFound();

  return (
    <main className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-6 py-12">
      <Link href="/" className="text-xl font-black tracking-tight mb-10">🐱 PurrPedia</Link>

      <div className="w-full max-w-lg bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {postcard.previewImageUrl ? (
          <img
            src={postcard.previewImageUrl}
            alt="Postcard"
            className="w-full object-cover"
          />
        ) : (
          <div className="bg-amber-50 h-48 flex items-center justify-center text-6xl">
            🐱
          </div>
        )}

        <div className="p-8">
          <p className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-1">
            A Purr for you
          </p>
          {postcard.recipientName && (
            <h1 className="text-2xl font-black tracking-tight mb-4">
              Hey {postcard.recipientName}!
            </h1>
          )}
          <div className="bg-amber-50 rounded-xl p-5 mb-6">
            <p className="text-stone-800 leading-relaxed">{postcard.message}</p>
          </div>
          {postcard.sender?.name && (
            <p className="text-stone-400 text-sm">
              Sent with love by <strong className="text-stone-600">{postcard.sender.name}</strong>
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-stone-400 text-sm mb-3">Want to send a Purr to someone you love?</p>
        <Link
          href="/login"
          className="bg-stone-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-stone-700 transition-colors inline-block text-sm"
        >
          Send a Purr on PurrPedia →
        </Link>
      </div>
    </main>
  );
}
