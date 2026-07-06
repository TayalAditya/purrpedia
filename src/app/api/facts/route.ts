import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

// Fetch a fresh fact from catfact.ninja and save if new
async function fetchExternalFact(): Promise<string | null> {
  try {
    const res = await fetch("https://catfact.ninja/fact", {
      signal: AbortSignal.timeout(3000),
    });
    const data = await res.json();
    return data.fact as string ?? null;
  } catch {
    return null;
  }
}

// GET /api/facts?seen=id1,id2,id3
// Returns least-recently-seen fact NOT in the seen list (per-user LRU)
export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = rateLimit(`facts:${ip}`, 30, 60_000);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const seenParam = req.nextUrl.searchParams.get("seen") ?? "";
  const category = req.nextUrl.searchParams.get("category");
  const seenIds = seenParam ? seenParam.split(",").filter(Boolean) : [];

  // 15% chance: try to fetch a fresh external fact and save it
  if (Math.random() < 0.15) {
    const external = await fetchExternalFact();
    if (external && external.length > 20) {
      try {
        await prisma.catFact.create({
          data: { fact: external, category: "general", emoji: "🐱" },
        });
      } catch { /* duplicate, ignore */ }
    }
  }

  const where = {
    ...(category ? { category } : {}),
    ...(seenIds.length > 0 ? { id: { notIn: seenIds } } : {}),
  };

  // Get least recently shown fact not in seen list
  let fact = await prisma.catFact.findFirst({
    where,
    orderBy: [{ lastShownAt: "asc" }, { showCount: "asc" }],
  });

  // If all facts seen, pick globally least-recent (ignore seen list)
  if (!fact) {
    fact = await prisma.catFact.findFirst({
      where: category ? { category } : {},
      orderBy: [{ lastShownAt: "asc" }],
    });
  }

  if (!fact) return NextResponse.json({ error: "No facts found" }, { status: 404 });

  // Update async (don't await)
  prisma.catFact.update({
    where: { id: fact.id },
    data: { showCount: { increment: 1 }, lastShownAt: new Date() },
  }).catch(() => {});

  return NextResponse.json(fact);
}

// POST /api/facts — bulk fetch from external and save to DB
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch("https://catfact.ninja/facts?limit=50", {
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    const facts = (data.data as { fact: string }[]) ?? [];

    let added = 0;
    for (const f of facts) {
      try {
        await prisma.catFact.create({
          data: { fact: f.fact, category: "general", emoji: "🐱" },
        });
        added++;
      } catch { /* duplicate */ }
    }

    return NextResponse.json({ added, total: await prisma.catFact.count() });
  } catch {
    return NextResponse.json({ error: "Failed to fetch external facts" }, { status: 500 });
  }
}
