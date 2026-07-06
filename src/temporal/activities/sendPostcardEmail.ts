import { sendMail } from "@/lib/mailer";
import { prisma } from "@/lib/prisma";

export async function sendPostcardEmail(postcardId: string) {
  const postcard = await prisma.postcard.findUniqueOrThrow({
    where: { id: postcardId },
  });

  const viewUrl = `${process.env.NEXTAUTH_URL}/postcards/${postcard.viewToken}`;

  const recipientName = postcard.recipientName ?? "there";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>You got a Purr!</title></head>
<body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fafaf9;color:#1c1917;">
  <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #e7e5e4;text-align:center;">
    <p style="font-size:40px;margin:0 0 8px 0;">🐱</p>
    <h1 style="font-size:24px;font-weight:800;margin:0 0 8px 0;">Hey ${recipientName}!</h1>
    <p style="color:#57534e;margin:0 0 24px 0;font-size:16px;">Someone sent you a Purr — a cat-themed digital postcard.</p>

    ${postcard.previewImageUrl ? `<img src="${postcard.previewImageUrl}" alt="Postcard preview" style="width:100%;border-radius:12px;margin-bottom:24px;object-fit:cover;" />` : ""}

    <div style="background:#fef3c7;border-radius:12px;padding:20px;margin-bottom:24px;text-align:left;">
      <p style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#92400e;margin:0 0 8px 0;">Their message</p>
      <p style="margin:0;font-size:16px;line-height:1.6;color:#1c1917;">${postcard.message}</p>
    </div>

    <a href="${viewUrl}" style="display:inline-block;background:#1c1917;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;">View Your Purr →</a>

    <p style="font-size:12px;color:#a8a29e;margin-top:24px;">Sent via PurrPedia · The cat love platform</p>
  </div>
</body>
</html>`;

  await sendMail({
    to: postcard.recipientEmail,
    subject: `🐾 You got a Purr from PurrPedia!`,
    html,
  });

  await prisma.postcard.update({
    where: { id: postcardId },
    data: { status: "SENT", sentAt: new Date() },
  });
}
