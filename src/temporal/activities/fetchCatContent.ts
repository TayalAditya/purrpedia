import { getRandomBreed, getRandomCatFact, getRandomCatMeme } from "@/lib/cat-api";

export async function fetchCatContent() {
  const [fact, breed, memeUrl] = await Promise.all([
    getRandomCatFact(),
    getRandomBreed(),
    getRandomCatMeme(),
  ]);
  return { fact, breed, memeUrl };
}
