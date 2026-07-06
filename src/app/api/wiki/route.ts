import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 });

  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "PurrPedia/1.0 (hackathon project)" },
      next: { revalidate: 86400 }, // cache 24h
    });

    if (!res.ok) return NextResponse.json({ summary: null });

    const data = await res.json();
    // Return only the extract, strip HTML if any
    const summary = data.extract
      ? data.extract.replace(/<[^>]+>/g, "").slice(0, 600)
      : null;

    return NextResponse.json({ summary, thumbnail: data.thumbnail?.source ?? null });
  } catch {
    return NextResponse.json({ summary: null });
  }
}
