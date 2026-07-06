import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Nodemailer from "next-auth/providers/nodemailer";
import { prisma } from "./prisma";
import { createTransport } from "nodemailer";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: !!process.env.AUTH_URL,
  adapter: PrismaAdapter(prisma),
  providers: [
    Nodemailer({
      server: {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier: email, url }) {
        const transport = createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });

        await transport.sendMail({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: "🐱 Your PurrPedia magic link",
          html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#08070A;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#08070A;padding:40px 16px;">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="background:#13111A;border-radius:20px;border:1px solid #1F1B2E;overflow:hidden;max-width:520px;width:100%;">
  <tr>
    <td style="background:linear-gradient(135deg,#1C1528,#13111A);padding:32px;text-align:center;border-bottom:1px solid #1F1B2E;">
      <p style="margin:0;font-size:28px;font-weight:900;color:#FAF9F7;letter-spacing:-0.03em;">Purr<span style="color:#F97316;">·</span>Pedia</p>
      <p style="margin:8px 0 0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#6B7280;font-family:monospace;">The Cat Encyclopedia</p>
    </td>
  </tr>
  <tr>
    <td style="padding:40px 32px;text-align:center;">
      <p style="font-size:48px;margin:0 0 16px;">🐱</p>
      <h1 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#FAF9F7;letter-spacing:-0.02em;">Your magic link is ready</h1>
      <p style="margin:0 0 32px;color:#6B7280;font-size:15px;line-height:1.6;">Click below to sign in to PurrPedia.<br>No password. One click. All cats.</p>
      <a href="${url}" style="display:inline-block;background:#F97316;color:#08070A;text-decoration:none;font-weight:800;font-size:15px;padding:16px 40px;border-radius:12px;">Sign in to PurrPedia →</a>
    </td>
  </tr>
  <tr>
    <td style="padding:24px 32px;background:#0D0B14;border-top:1px solid #1F1B2E;">
      <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#F97316;font-family:monospace;">🐾 Cat Fact While You Wait</p>
      <p style="margin:0;color:#6B7280;font-size:13px;line-height:1.6;font-style:italic;">"A group of cats is called a clowder. You're about to join one."</p>
    </td>
  </tr>
  <tr>
    <td style="padding:20px 32px;text-align:center;border-top:1px solid #1F1B2E;">
      <p style="margin:0;color:#6B7280;font-size:11px;font-family:monospace;letter-spacing:0.08em;">LINK EXPIRES IN 24 HOURS · IF YOU DIDN'T REQUEST THIS, IGNORE IT</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`,
          text: `Sign in to PurrPedia\n\n${url}\n\nLink expires in 24 hours.`,
        });
      },
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/verify",
    error: "/login",
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});
