import { sendMail } from "@/lib/mailer";
import { prisma } from "@/lib/prisma";

interface DigestContent {
  fact: string;
  breed: {
    name: string;
    description: string;
    temperament: string;
    lifeSpan: string;
    origin: string;
    imageUrl?: string;
  };
  memeUrl: string;
}

export async function sendDigestEmail(
  subscriptionId: string,
  to: string,
  content: DigestContent,
  unsubscribeToken: string
) {
  const unsubscribeUrl = `${process.env.NEXTAUTH_URL}/digest/unsubscribe?token=${unsubscribeToken}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>PurrPedia Daily Digest</title></head>
<body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fafaf9;color:#1c1917;">
  <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #e7e5e4;">
    <h1 style="font-size:24px;font-weight:800;margin:0 0 4px 0;color:#1c1917;">🐱 PurrPedia Daily Digest</h1>
    <p style="color:#78716c;margin:0 0 28px 0;font-size:14px;">Your daily dose of cat content</p>

    <div style="background:#fef3c7;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#92400e;margin:0 0 8px 0;">Cat Fact</p>
      <p style="margin:0;font-size:16px;line-height:1.6;color:#1c1917;">${content.fact}</p>
    </div>

    <div style="margin-bottom:24px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#78716c;margin:0 0 12px 0;">Breed Spotlight</p>
      ${content.breed.imageUrl ? `<img src="${content.breed.imageUrl}" alt="${content.breed.name}" style="width:100%;border-radius:12px;margin-bottom:16px;object-fit:cover;max-height:240px;" />` : ""}
      <h2 style="font-size:20px;font-weight:700;margin:0 0 8px 0;">${content.breed.name}</h2>
      <p style="color:#57534e;margin:0 0 12px 0;line-height:1.6;">${content.breed.description}</p>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <span style="font-size:13px;color:#78716c;">🌍 ${content.breed.origin}</span>
        <span style="font-size:13px;color:#78716c;">⏱ ${content.breed.lifeSpan} years</span>
        <span style="font-size:13px;color:#78716c;">😸 ${content.breed.temperament}</span>
      </div>
    </div>

    <div style="margin-bottom:32px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#78716c;margin:0 0 12px 0;">Cat of the Day</p>
      <img src="${content.memeUrl}" alt="Cat of the day" style="width:100%;border-radius:12px;object-fit:cover;max-height:320px;" />
    </div>

    <hr style="border:none;border-top:1px solid #e7e5e4;margin:24px 0;" />
    <p style="font-size:12px;color:#a8a29e;text-align:center;margin:0;">
      You're receiving this because you subscribed to PurrPedia.
      <a href="${unsubscribeUrl}" style="color:#a8a29e;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`;

  await sendMail({ to, subject: "🐱 Your Daily Cat Digest is Here", html });

  await prisma.digestLog.create({
    data: {
      subscriptionId,
      catFact: content.fact,
      breedName: content.breed.name,
      memeUrl: content.memeUrl,
      status: "SENT",
    },
  });
}
