import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getRandomBreed, getRandomCatFact, getRandomCatMeme } from "@/lib/cat-api";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = rateLimit(`cat-content:${ip}`, 30, 60_000);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const type = req.nextUrl.searchParams.get("type") ?? "all";

  if (type === "fact") {
    const fact = await getRandomCatFact();
    return NextResponse.json({ fact });
  }

  if (type === "breed") {
    const breed = await getRandomBreed();
    return NextResponse.json({ breed });
  }

  if (type === "meme") {
    const memeUrl = await getRandomCatMeme();
    return NextResponse.json({ memeUrl });
  }

  const [fact, breed, memeUrl] = await Promise.all([
    getRandomCatFact(),
    getRandomBreed(),
    getRandomCatMeme(),
  ]);

  return NextResponse.json({ fact, breed, memeUrl });
}
