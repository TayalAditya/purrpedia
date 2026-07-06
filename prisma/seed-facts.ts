import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FACTS = [
  // Senses
  { fact: "Cats can hear frequencies up to 79,000 Hz — humans max out at 20,000 Hz.", category: "senses", emoji: "👂" },
  { fact: "A cat's night vision is 6× better than a human's. They only need 1/6th the light we do.", category: "senses", emoji: "👁️" },
  { fact: "Cats have a third eyelid called the nictitating membrane — a pale protective inner eyelid.", category: "senses", emoji: "👁️" },
  { fact: "Cats can't taste sweetness at all. They lack the gene for sweet taste receptors.", category: "senses", emoji: "👅" },
  { fact: "A cat's sense of smell is 14× stronger than a human's, with 200 million scent receptors.", category: "senses", emoji: "👃" },
  { fact: "Cats have whiskers on the backs of their forelegs too — not just on their face.", category: "senses", emoji: "🐾" },
  { fact: "A cat's whiskers are roughly as wide as its body — used to gauge if it can fit through gaps.", category: "senses", emoji: "📏" },
  { fact: "Cats can rotate their ears 180 degrees independently using 32 muscles per ear.", category: "senses", emoji: "👂" },
  // Biology
  { fact: "Cats purr at 25–150 Hz — the same frequency range used in medical therapy to heal bones.", category: "biology", emoji: "💜" },
  { fact: "A cat's heart beats 140–220 times per minute — twice the rate of a human heart.", category: "biology", emoji: "❤️" },
  { fact: "Cats have 230 bones — 24 more than humans, mostly in their flexible spine and tail.", category: "biology", emoji: "🦴" },
  { fact: "A cat's collarbone doesn't connect to other bones — it floats, letting them squeeze through tight spaces.", category: "biology", emoji: "🦴" },
  { fact: "Cats walk on their toes, not their feet. They're digitigrade animals.", category: "biology", emoji: "🐾" },
  { fact: "A cat's tongue has backward-facing hooks called papillae — perfect for stripping meat from bones.", category: "biology", emoji: "👅" },
  { fact: "Cats can't move their jaws sideways, so they can't chew — only bite and swallow.", category: "biology", emoji: "😬" },
  { fact: "The average cat body temperature is 38–39°C (101–102.5°F).", category: "biology", emoji: "🌡️" },
  { fact: "Cats have 32 muscles in each ear. Humans have only 6.", category: "biology", emoji: "👂" },
  { fact: "A cat's brain is 90% similar to a human brain in structure.", category: "biology", emoji: "🧠" },
  // Behaviour
  { fact: "Cats spend 70% of their lives sleeping — averaging 13–16 hours a day.", category: "behaviour", emoji: "😴" },
  { fact: "Cats spend 30–50% of their waking hours grooming themselves.", category: "behaviour", emoji: "🛁" },
  { fact: "Cats knead soft surfaces as a leftover instinct from nursing as kittens.", category: "behaviour", emoji: "🐾" },
  { fact: "A cat that shows you its belly is displaying trust — not always an invitation to touch.", category: "behaviour", emoji: "🐱" },
  { fact: "Cats slow-blink at you as a sign of love and trust. Slow-blink back — it works.", category: "behaviour", emoji: "😊" },
  { fact: "Cats chirp and chatter at birds due to a mix of excitement and frustration.", category: "behaviour", emoji: "🐦" },
  { fact: "Cats rarely meow at other cats — they meow almost exclusively to communicate with humans.", category: "behaviour", emoji: "🗣️" },
  { fact: "A cat rubbing its face on you (bunting) is marking you as its territory with scent glands.", category: "behaviour", emoji: "🐱" },
  { fact: "Cats walk in direct register — their back paws land exactly where their front paws were.", category: "behaviour", emoji: "🐾" },
  { fact: "Cats can jump 6× their body length in a single leap.", category: "behaviour", emoji: "⬆️" },
  // History & Culture
  { fact: "Ancient Egyptians worshipped cats and mummified them as offerings to the goddess Bastet.", category: "history", emoji: "🏛️" },
  { fact: "Ancient Egyptians shaved their eyebrows to mourn the death of a household cat.", category: "history", emoji: "😢" },
  { fact: "In ancient Egypt, exporting cats was illegal. They were considered sacred property of the pharaoh.", category: "history", emoji: "🚫" },
  { fact: "The word 'cat' in English comes from the Old English 'catt,' derived from Late Latin 'catus.'", category: "history", emoji: "📚" },
  { fact: "Cats were brought aboard ships for centuries to control rats and mice — making them global travelers.", category: "history", emoji: "⛵" },
  { fact: "Pope Gregory IX declared cats to be associated with the devil in 1233 — leading to cat massacres across Europe.", category: "history", emoji: "📜" },
  { fact: "The first cat show was held at Crystal Palace, London, in 1871.", category: "history", emoji: "🏆" },
  { fact: "Abraham Lincoln was the first US president to bring cats to the White House.", category: "history", emoji: "🏛️" },
  { fact: "Florence Nightingale owned more than 60 cats throughout her life.", category: "history", emoji: "🏥" },
  { fact: "Nikola Tesla was inspired to study electricity after his cat, Macak, sparked static electricity.", category: "history", emoji: "⚡" },
  // Records
  { fact: "The oldest cat ever recorded was Creme Puff from Austin, Texas — she lived 38 years and 3 days.", category: "records", emoji: "🏆" },
  { fact: "The world's longest cat was Stewie, a Maine Coon measuring 123 cm (48.5 inches).", category: "records", emoji: "📏" },
  { fact: "The loudest purr ever recorded was 67.8 decibels — louder than a conversation.", category: "records", emoji: "🔊" },
  { fact: "The richest cat in history was Blackie, who inherited £15 million from his owner Ben Rea in 1988.", category: "records", emoji: "💰" },
  { fact: "The most expensive cat breed is the Ashera, which can cost up to $125,000.", category: "records", emoji: "💎" },
  { fact: "The most prolific mother cat on record had 420 kittens in her lifetime.", category: "records", emoji: "🐾" },
  { fact: "A cat named Stubbs was mayor of Talkeetna, Alaska for 20 years.", category: "records", emoji: "🎩" },
  { fact: "The first cat in space was Félicette, a French cat launched in 1963. She survived.", category: "records", emoji: "🚀" },
  // Fun & Weird
  { fact: "A group of cats is called a clowder. A group of kittens is a kindle.", category: "fun", emoji: "🐱" },
  { fact: "A cat's nose print is as unique as a human fingerprint.", category: "fun", emoji: "👃" },
  { fact: "Cats can make over 100 different vocal sounds. Dogs can only make about 10.", category: "fun", emoji: "🗣️" },
  { fact: "Cats dream — their REM sleep brain patterns are similar to humans.", category: "fun", emoji: "💭" },
  { fact: "Orange cats are almost always male — the gene for orange fur is on the X chromosome.", category: "fun", emoji: "🟠" },
  { fact: "Calico and tortoiseshell cats are almost always female for the same genetic reason.", category: "fun", emoji: "🎨" },
  { fact: "A cat's meow is a frequency specifically tuned to be impossible for humans to ignore.", category: "fun", emoji: "😤" },
  { fact: "Cats always land on their feet due to a reflex called 'aerial righting reflex.'", category: "fun", emoji: "⬇️" },
  { fact: "Cats can fall from great heights and survive — the record is 32 stories onto concrete.", category: "fun", emoji: "🏙️" },
  { fact: "Cats have a dominant paw — 40% are right-pawed, 40% left-pawed, 20% ambidextrous.", category: "fun", emoji: "🐾" },
  { fact: "A cat's homing instinct is so strong that it's called 'psi-trailing.'", category: "fun", emoji: "🧭" },
  { fact: "Indoor cats live on average 12–18 years. Outdoor cats live 2–5 years.", category: "fun", emoji: "🏠" },
  { fact: "Cats spend more time grooming themselves than they do sleeping each day.", category: "fun", emoji: "🛁" },
  { fact: "A cat's back can arch so far that it can touch its face to its tail.", category: "fun", emoji: "🌀" },
  { fact: "Cats can run up to 48 km/h (30 mph) in short bursts.", category: "fun", emoji: "💨" },
  // Internet
  { fact: "There are more than 3.8 billion cat images on the internet.", category: "internet", emoji: "📱" },
  { fact: "The first cat video on YouTube was uploaded in 2005. The cat was named Pajamas.", category: "internet", emoji: "📹" },
  { fact: "Keyboard Cat was created in 1984 but didn't go viral until YouTube in 2007.", category: "internet", emoji: "🎹" },
  { fact: "Nyan Cat, the pop-tart rainbow cat meme, was sold as an NFT for $600,000 in 2021.", category: "internet", emoji: "🌈" },
  { fact: "Lil Bub was born with genetic mutations — polydactyl, toothless, and had a constantly protruding tongue.", category: "internet", emoji: "😛" },
  { fact: "Grumpy Cat (Tardar Sauce) earned an estimated $100 million for her owners.", category: "internet", emoji: "😾" },
  { fact: "'Cat content' is the most watched category of video on the internet.", category: "internet", emoji: "📺" },
  // Science
  { fact: "Cats have a special organ called the Jacobson's organ that lets them 'taste' smells.", category: "science", emoji: "🔬" },
  { fact: "The Flehmen response — when cats curl their lips — helps them process scents via the Jacobson's organ.", category: "science", emoji: "😬" },
  { fact: "Scientists have decoded 10,000 years of cat domestication through ancient DNA.", category: "science", emoji: "🧬" },
  { fact: "Cats were domesticated twice independently — once in the Middle East, once in China.", category: "science", emoji: "🌍" },
  { fact: "Unlike most mammals, cats don't have a sweet tooth because they lack Tas1r2, a key taste receptor gene.", category: "science", emoji: "🧬" },
  { fact: "A cat's kidneys are so efficient they can rehydrate by drinking seawater — unlike humans.", category: "science", emoji: "🌊" },
  { fact: "Cats have a third type of cone cell that lets them see in the blue-violet and greenish-yellow spectrum.", category: "science", emoji: "🎨" },
  { fact: "The domestic cat's genome is 95.6% identical to a tiger's.", category: "science", emoji: "🐅" },
  { fact: "Cats have a flexible spine with 30 vertebrae — humans have 33 but fewer movable ones.", category: "science", emoji: "🦴" },
  { fact: "Purring may be a self-healing mechanism — the vibrations promote bone density and healing.", category: "science", emoji: "💜" },
  // Breeds
  { fact: "Maine Coons are the largest domestic cat breed, sometimes reaching 11 kg (25 lbs).", category: "breeds", emoji: "🦁" },
  { fact: "Sphynx cats aren't actually hairless — they have a fine peach-fuzz covering their skin.", category: "breeds", emoji: "🍑" },
  { fact: "Scottish Folds' folded ears are caused by a cartilage mutation — the same gene causes joint pain.", category: "breeds", emoji: "👂" },
  { fact: "The Savannah cat is a cross between a domestic cat and an African serval — it can be as tall as a medium dog.", category: "breeds", emoji: "🐆" },
  { fact: "Norwegian Forest Cats evolved to survive Scandinavian winters — their coats are waterproof.", category: "breeds", emoji: "❄️" },
  { fact: "Siamese cats are born white and develop their color points due to a temperature-sensitive enzyme.", category: "breeds", emoji: "🌡️" },
  { fact: "The Ragdoll breed was developed in California in the 1960s by Ann Baker.", category: "breeds", emoji: "🪆" },
  { fact: "Turkish Van cats love water — they're known as 'swimming cats.'", category: "breeds", emoji: "🏊" },
  { fact: "The Manx cat has no tail due to a genetic mutation on the Isle of Man.", category: "breeds", emoji: "🏝️" },
  { fact: "Bengal cats were created by crossing domestic cats with Asian leopard cats.", category: "breeds", emoji: "🐆" },
  // Japan
  { fact: "Japan has over 10 cat cafés in Tokyo alone — the first cat café opened in Osaka in 2004.", category: "culture", emoji: "☕" },
  { fact: "The Maneki-neko (beckoning cat) is believed to bring good luck and prosperity in Japanese culture.", category: "culture", emoji: "🐱" },
  { fact: "Tashirojima, a Japanese island, has more cats than people. It's known as Cat Island.", category: "culture", emoji: "🏝️" },
  { fact: "In Scotland, a strange black cat arriving at your home is considered good luck.", category: "culture", emoji: "🐈‍⬛" },
  { fact: "In French, a cat is 'un chat.' In Spanish, 'un gato.' In Arabic, 'qitta.' In Japanese, 'neko.'", category: "culture", emoji: "🌍" },
  { fact: "Cats are considered bad luck in some parts of Europe but good luck in Japan and the UK.", category: "culture", emoji: "🍀" },
  { fact: "In Ancient Rome, cats were the only animals allowed inside temples.", category: "culture", emoji: "🏛️" },
  { fact: "The Prophet Muhammad's favorite cat was Muezza — he reportedly cut off his robe sleeve rather than disturb her sleep.", category: "culture", emoji: "📿" },
  // Random
  { fact: "Cats can make over 100 distinct vocalizations, while dogs can only manage about 10.", category: "fun", emoji: "🎵" },
  { fact: "A cat's paw pads contain scent glands — every step marks their territory.", category: "biology", emoji: "🐾" },
  { fact: "Cats have been known to predict earthquakes — they become agitated hours before tremors.", category: "science", emoji: "🌍" },
  { fact: "A 2010 study found that cats recognize their owner's voice but often choose to ignore it.", category: "science", emoji: "🎧" },
  { fact: "Cats can't see directly under their noses — they use whiskers to navigate close objects.", category: "senses", emoji: "👃" },
  { fact: "A cat's purr is produced by rapid movement of the laryngeal muscles — 25 times per second.", category: "biology", emoji: "💜" },
  { fact: "Cats have a specialized collarbone that allows them to always land feet-first.", category: "biology", emoji: "🦴" },
  { fact: "The average cat sleeps 12,775 hours per year — 1.5 years out of every 10 spent sleeping.", category: "behaviour", emoji: "😴" },
  { fact: "Cats have better short-term memory than dogs — they remember for 16 hours; dogs only 5 minutes.", category: "science", emoji: "🧠" },
  { fact: "A group of wild cats is called a destruction. A group of domestic cats is a clowder.", category: "fun", emoji: "🐱" },
];

async function main() {
  console.log("Seeding cat facts...");

  // Delete existing facts first
  await prisma.catFact.deleteMany();

  // Insert in batches
  for (let i = 0; i < FACTS.length; i += 20) {
    const batch = FACTS.slice(i, i + 20);
    await prisma.catFact.createMany({
      data: batch,
      skipDuplicates: true,
    });
    console.log(`Inserted ${Math.min(i + 20, FACTS.length)}/${FACTS.length}`);
  }

  console.log(`✓ Seeded ${FACTS.length} cat facts`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
