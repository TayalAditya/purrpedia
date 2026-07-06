import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const CAT_API_BASE = "https://api.thecatapi.com/v1";
const headers = { "x-api-key": process.env.THE_CAT_API_KEY ?? "" };

const BREED_ID_RE = /^[a-z]{3,4}$/;

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = rateLimit(`breeds:${ip}`, 30, 60_000);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");

  if (id) {
    if (!BREED_ID_RE.test(id)) {
      return NextResponse.json({ error: "Invalid breed ID" }, { status: 400 });
    }
    const [breed, images] = await Promise.all([
      fetch(`${CAT_API_BASE}/breeds/${id}`, { headers }).then(r => r.json()),
      fetch(`${CAT_API_BASE}/images/search?breed_ids=${id}&limit=6`, { headers }).then(r => r.json()),
    ]);
    return NextResponse.json({ breed, images });
  }

  const breeds = await fetch(`${CAT_API_BASE}/breeds`, { headers }).then(r => r.json());
  return NextResponse.json(breeds);
}
