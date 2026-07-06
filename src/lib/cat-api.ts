const CAT_API_BASE = "https://api.thecatapi.com/v1";
const headers = { "x-api-key": process.env.THE_CAT_API_KEY ?? "" };

export async function getRandomCatFact(): Promise<string> {
  const res = await fetch("https://catfact.ninja/fact");
  const data = await res.json();
  return data.fact as string;
}

export async function getRandomBreed() {
  const res = await fetch(`${CAT_API_BASE}/breeds?limit=50`, { headers });
  const breeds = await res.json();
  const breed = breeds[Math.floor(Math.random() * breeds.length)];
  return {
    id: breed.id as string,
    name: breed.name as string,
    description: breed.description as string,
    temperament: breed.temperament as string,
    lifeSpan: breed.life_span as string,
    origin: breed.origin as string,
    imageUrl: breed.image?.url as string | undefined,
  };
}

export async function getRandomCatMeme(): Promise<string> {
  const res = await fetch(
    `${CAT_API_BASE}/images/search?limit=1&mime_types=jpg,png`,
    { headers }
  );
  const data = await res.json();
  return data[0]?.url as string;
}
