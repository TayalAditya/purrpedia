import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MORE_FACTS = [
  // Body & Anatomy
  { fact: "A cat's tongue is covered in hollow spines called papillae that act like a built-in comb.", category: "biology", emoji: "👅" },
  { fact: "Cats have a specialized collarbone that rotates freely, allowing them to always right themselves mid-fall.", category: "biology", emoji: "🦴" },
  { fact: "The cat's eye has a reflective layer called the tapetum lucidum — that's why their eyes glow in photos.", category: "biology", emoji: "✨" },
  { fact: "Cats lose almost as much fluid through their paws as through urination.", category: "biology", emoji: "🐾" },
  { fact: "A cat's front paws turn inward, which is why they're better at pulling things toward them than pushing.", category: "biology", emoji: "🐾" },
  { fact: "Cats have a separate upper range of hearing from other animals — they can hear ultrasonic sounds.", category: "senses", emoji: "👂" },
  { fact: "A cat's resting heart rate is 140–220 BPM — nearly three times that of a human.", category: "biology", emoji: "❤️" },
  { fact: "Cats can drink salt water when fresh water is unavailable. Their kidneys are remarkably efficient.", category: "biology", emoji: "🌊" },
  { fact: "The domestic cat genome is 95.6% identical to tigers — making your cat basically a tiny tiger.", category: "science", emoji: "🐅" },
  { fact: "Cats have true binocular vision — they can judge distances precisely for pouncing.", category: "senses", emoji: "👁️" },
  // Sleep & Behaviour
  { fact: "Cats have three distinct sleep stages including deep REM sleep where they likely dream.", category: "behaviour", emoji: "💭" },
  { fact: "When cats expose their belly, they're not always asking for a rub — it's a trust display.", category: "behaviour", emoji: "🐱" },
  { fact: "Cats bring home dead animals as gifts — they may be trying to teach you to hunt.", category: "behaviour", emoji: "🎁" },
  { fact: "A cat's tail position is a complete communication system: vertical = happy, puffed = scared, low = aggressive.", category: "behaviour", emoji: "🐱" },
  { fact: "Cats walk silently by placing their back feet in the same spots as their front feet — called direct registering.", category: "behaviour", emoji: "🐾" },
  { fact: "Cats knead to self-soothe — it's rooted in kitten behavior from nursing.", category: "behaviour", emoji: "🐾" },
  { fact: "A cat that headbutts you (bunts) is marking you as safe territory using scent glands on its face.", category: "behaviour", emoji: "🐱" },
  { fact: "Cats chirp at birds outside windows — scientists think it mimics prey sounds to confuse birds.", category: "behaviour", emoji: "🐦" },
  { fact: "When cats slow-blink at you, they're saying 'I trust you.' Slow blink back — it's real communication.", category: "behaviour", emoji: "😊" },
  { fact: "Cats rarely meow at other cats — they reserve meowing almost exclusively for humans.", category: "behaviour", emoji: "🗣️" },
  { fact: "Cats groom each other (allogrooming) to strengthen social bonds — it's the cat equivalent of a hug.", category: "behaviour", emoji: "🛁" },
  { fact: "A cat that follows you to the bathroom is doing what cats do in the wild — staying close to their group.", category: "behaviour", emoji: "🐱" },
  // Science & Research
  { fact: "Cats may have a magnetic compass in their bodies — they can find their way home from miles away.", category: "science", emoji: "🧭" },
  { fact: "Research shows cats genuinely recognize their owner's voice — they just often choose not to respond.", category: "science", emoji: "🎧" },
  { fact: "The purring frequency of 25–50 Hz promotes bone density, wound healing, and reduces pain.", category: "science", emoji: "💜" },
  { fact: "Cats experience something close to PTSD — they can develop anxiety disorders from trauma.", category: "science", emoji: "🧠" },
  { fact: "Cats have been used in therapeutic settings — their purring and presence reduce blood pressure.", category: "science", emoji: "🏥" },
  { fact: "Scientists have mapped the complete cat genome — over 20,000 genes with surprising overlap with humans.", category: "science", emoji: "🧬" },
  { fact: "Cats display theory of mind — they understand that humans have different knowledge than they do.", category: "science", emoji: "🧠" },
  { fact: "Cat parasites (Toxoplasma gondii) may subtly alter human personality — one of biology's wildest findings.", category: "science", emoji: "🔬" },
  { fact: "Research confirms cats form attachment bonds with humans similar to how babies bond with parents.", category: "science", emoji: "💙" },
  // History
  { fact: "Cats were domesticated approximately 10,000 years ago in the Fertile Crescent alongside agriculture.", category: "history", emoji: "🌾" },
  { fact: "Ancient Egyptians had a death penalty for killing a cat — even accidentally.", category: "history", emoji: "⚖️" },
  { fact: "The word 'cat' exists in almost every language — 'chat' in French, 'gato' in Spanish, 'neko' in Japanese.", category: "history", emoji: "🌍" },
  { fact: "The Black Death in Europe may have worsened because cats were associated with witchcraft and killed en masse.", category: "history", emoji: "📜" },
  { fact: "Leonardo da Vinci wrote: 'The smallest feline is a masterpiece.' He regularly drew cats.", category: "history", emoji: "🎨" },
  { fact: "Charles Dickens had a cat named Williamina who raised her kittens in his study to stay close to him.", category: "history", emoji: "📚" },
  { fact: "A cat named Unsinkable Sam survived three WWII ships sinking — HMS Cossack, Bismarck, and Ark Royal.", category: "history", emoji: "⚓" },
  { fact: "The Colosseum in Rome has housed a feral cat colony for centuries — there are now around 150 cats there.", category: "history", emoji: "🏛️" },
  { fact: "Mark Twain owned 11 cats at one time and named them things like 'Sour Mash' and 'Blatherskite.'", category: "history", emoji: "✍️" },
  { fact: "Ancient Romans brought cats to Britain — before that, Britain had no domestic cats.", category: "history", emoji: "🏰" },
  // Records & Famous Cats
  { fact: "Dusty, a Texas cat, holds the record for most kittens in a lifetime — 420 kittens total.", category: "records", emoji: "🏆" },
  { fact: "A cat named Larry has lived at 10 Downing Street since 2011 and has served under multiple UK Prime Ministers.", category: "records", emoji: "🎩" },
  { fact: "The most expensive cat ever sold was a Bengal–Asian Leopard hybrid that sold for $50,000.", category: "records", emoji: "💰" },
  { fact: "Creme Puff of Austin, Texas was the world's oldest cat — she lived to 38 years and 3 days (1967–2005).", category: "records", emoji: "🏆" },
  { fact: "Towser, a female tortoiseshell, is estimated to have caught over 28,899 mice during her 21 years at a Scottish distillery.", category: "records", emoji: "🏆" },
  { fact: "The Guinness record for loudest purr goes to Merlin, a black-and-white cat from Devon — 67.8 dB.", category: "records", emoji: "🔊" },
  { fact: "A tabby named Nyan Cat became an internet meme in 2011 and the video has over 200 million YouTube views.", category: "internet", emoji: "🌈" },
  { fact: "Cats have more neurons in their cerebral cortex than dogs — roughly 300 million vs. 160 million.", category: "science", emoji: "🧠" },
  // Fun & Quirky
  { fact: "Cats can't move their jaw sideways — so they literally cannot chew. Everything is bite, tear, swallow.", category: "fun", emoji: "😬" },
  { fact: "Orange cats have a reputation for being chaotic and cuddly — and studies suggest it might be genetic.", category: "fun", emoji: "🟠" },
  { fact: "A cat's meow is specifically tuned to fall in the frequency range humans find most difficult to ignore.", category: "fun", emoji: "😤" },
  { fact: "Cats have 18 claws total — 5 on each front paw, 4 on each back paw.", category: "fun", emoji: "🐾" },
  { fact: "Cats have scent glands between their toes — every scratch on your furniture is territory marking.", category: "fun", emoji: "🪑" },
  { fact: "A cat's lifespan in cat years is roughly: 1 year = 15 human years. A 10-year-old cat ≈ 56 human years.", category: "fun", emoji: "📅" },
  { fact: "Cats have a third eyelid (nictitating membrane) that you only see when they're sick or sleepy.", category: "biology", emoji: "👁️" },
  { fact: "Some cats are allergic to humans — they can develop skin reactions from human dander.", category: "fun", emoji: "🤧" },
  { fact: "Cats can survive falls from great heights partly because they reach terminal velocity quickly and relax their body.", category: "fun", emoji: "⬇️" },
  { fact: "Polydactyl cats (extra toes) were favored by sailors — Ernest Hemingway's famous cats were polydactyl.", category: "fun", emoji: "✋" },
  { fact: "A cat can rotate its ears 180 degrees and move them independently — like satellite dishes.", category: "senses", emoji: "📡" },
  { fact: "The average cat takes about 4 naps per day on top of their main sleep — totaling 15+ hours.", category: "behaviour", emoji: "😴" },
  { fact: "Cats have been shown to prefer their owner's voice over a stranger's — even if they don't respond.", category: "science", emoji: "🎧" },
  // Cats & Tech
  { fact: "Cat images were used in the early internet specifically because they were universally appealing to humans.", category: "internet", emoji: "📱" },
  { fact: "More than 2 million cat videos are uploaded to YouTube every day.", category: "internet", emoji: "📹" },
  { fact: "Studies show that watching cat videos makes people happier and more energized — it's science.", category: "internet", emoji: "😄" },
  { fact: "The first famous internet cat was probably Keyboard Cat, filmed in 1984 by Charlie Schmidt.", category: "internet", emoji: "🎹" },
  // Weird but True
  { fact: "Cats and humans have nearly identical emotional centers in the brain — including areas for fear and joy.", category: "science", emoji: "🧠" },
  { fact: "Cats can dream — their REM patterns are identical to humans, suggesting vivid dream experiences.", category: "science", emoji: "💭" },
  { fact: "Cats have been found to self-medicate using plants — much like chimpanzees and other primates.", category: "science", emoji: "🌿" },
  { fact: "A group of feral cats living together is called a colony, and they establish strict social hierarchies.", category: "fun", emoji: "🐱" },
  { fact: "Cats have been recorded using tools — specifically, one researcher observed cats using sticks to fetch food.", category: "science", emoji: "🔧" },
  { fact: "Cats can get acne on their chin — it looks like blackheads and is often caused by plastic food bowls.", category: "fun", emoji: "😬" },
  { fact: "A cat's nose is as unique as a fingerprint — no two cats have the same nose print pattern.", category: "biology", emoji: "👃" },
  { fact: "Cats can sense changes in barometric pressure, possibly explaining why they seem to 'predict' weather.", category: "science", emoji: "🌦️" },
  { fact: "Cats have been known to communicate using a 'trill' — a sound between a purr and a meow — used for friendly greeting.", category: "behaviour", emoji: "🎵" },
  { fact: "Studies show cats display clear preferences for music — they prefer music composed specifically for them.", category: "science", emoji: "🎵" },
];

async function main() {
  console.log("Seeding additional cat facts...");
  const existing = await prisma.catFact.count();

  await prisma.catFact.createMany({
    data: MORE_FACTS,
    skipDuplicates: true,
  });

  const total = await prisma.catFact.count();
  console.log(`✓ Was ${existing}, now ${total} cat facts`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
