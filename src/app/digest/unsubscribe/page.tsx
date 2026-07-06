import Link from "next/link";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  return (
    <main className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-6 text-center">
      <Link href="/" className="text-2xl font-black tracking-tight mb-12">🐱 PurrPedia</Link>

      <div className="w-full max-w-sm bg-white rounded-2xl border border-stone-200 p-8">
        {status === "done" ? (
          <>
            <div className="text-5xl mb-4">👋</div>
            <h1 className="text-2xl font-black tracking-tight mb-2">Unsubscribed</h1>
            <p className="text-stone-500 text-sm mb-6">
              You&apos;ve been removed from the daily digest. We&apos;ll miss you!
            </p>
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-stone-900 hover:underline"
            >
              Re-subscribe from dashboard →
            </Link>
          </>
        ) : status === "already" ? (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-black tracking-tight mb-2">Already unsubscribed</h1>
            <p className="text-stone-500 text-sm">You&apos;re already off the list.</p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">❓</div>
            <h1 className="text-2xl font-black tracking-tight mb-2">Invalid link</h1>
            <p className="text-stone-500 text-sm">This unsubscribe link is invalid or expired.</p>
          </>
        )}
      </div>
    </main>
  );
}
