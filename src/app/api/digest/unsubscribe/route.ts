import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTemporalClient } from "@/lib/temporal";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const subscription = await prisma.digestSubscription.findUnique({
    where: { unsubscribeToken: token },
  });

  if (!subscription) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  if (!subscription.isActive) {
    return NextResponse.redirect(
      new URL("/digest/unsubscribe?status=already", req.url)
    );
  }

  await prisma.digestSubscription.update({
    where: { id: subscription.id },
    data: { isActive: false },
  });

  if (subscription.temporalWorkflowId) {
    try {
      const client = await getTemporalClient();
      const handle = client.workflow.getHandle(subscription.temporalWorkflowId);
      await handle.signal("unsubscribe");
    } catch {
      // workflow may have already completed
    }
  }

  return NextResponse.redirect(
    new URL("/digest/unsubscribe?status=done", req.url)
  );
}
