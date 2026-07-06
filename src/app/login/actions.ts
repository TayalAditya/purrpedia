"use server";

import { signIn } from "@/lib/auth";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";

export async function signInWithEmail(email: string) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "unknown";

  // 3 magic link requests per IP per hour — prevents account spam
  const { success } = rateLimit(`magic-link:${ip}`, 3, 60 * 60 * 1000);
  if (!success) {
    throw new Error("Too many sign-in attempts from this device. Please wait an hour.");
  }

  await signIn("nodemailer", {
    email,
    redirectTo: "/dashboard",
  });
}

