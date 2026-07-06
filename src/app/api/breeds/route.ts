import { NextRequest, NextResponse } from "next/server";

const CAT_API_BASE = "https://api.thecatapi.com/v1";
const headers = { "x-api-key": process.env.THE_CAT_API_KEY ?? "" };

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");

  if (id) {
    const [breed, images] = await Promise.all([
      fetch(`${CAT_API_BASE}/breeds/${id}`, { headers }).then(r => r.json()),
      fetch(`${CAT_API_BASE}/images/search?breed_ids=${id}&limit=6`, { headers }).then(r => r.json()),
    ]);
    return NextResponse.json({ breed, images });
  }

  const breeds = await fetch(`${CAT_API_BASE}/breeds`, { headers }).then(r => r.json());
  return NextResponse.json(breeds);
}
