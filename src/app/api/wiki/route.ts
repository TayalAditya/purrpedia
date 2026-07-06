import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = rateLimit(`wiki:${ip}`, 20, 60_000);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const name = req.nextUrl.searchParams.get("name");
  if (!name || name.length > 100) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "PurrPedia/1.0 (hackathon project)" },
      next: { revalidate: 86400 },
    });

    if (!res.ok) return NextResponse.json({ summary: null });

    const data = await res.json();
    const summary = data.extract
      ? data.extract.replace(/<[^>]+>/g, "").slice(0, 600)
      : null;

    return NextResponse.json({ summary, thumbnail: data.thumbnail?.source ?? null });
  } catch {
    return NextResponse.json({ summary: null });
  }
}
