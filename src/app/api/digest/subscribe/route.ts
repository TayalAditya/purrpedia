import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTemporalClient, TASK_QUEUE } from "@/lib/temporal";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({
  timezone: z.string().max(50).refine((tz) => {
    try { Intl.DateTimeFormat(undefined, { timeZone: tz }); return true; } catch { return false; }
  }, "Invalid timezone"),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = rateLimit(`subscribe:${ip}`, 5, 60_000);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = schema.safeParse(await req.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.digestSubscription.findUnique({
    where: { userId: session.user.id },
  });

  if (existing?.isActive) {
    return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
  }

  const subscription = existing
    ? await prisma.digestSubscription.update({
        where: { id: existing.id },
        data: { isActive: true, timezone: body.data.timezone },
      })
    : await prisma.digestSubscription.create({
        data: {
          userId: session.user.id,
          email: session.user.email!,
          timezone: body.data.timezone,
        },
      });

  try {
    const client = await getTemporalClient();
    const workflowId = `digest-${subscription.id}`;

    await client.workflow.start("DigestSchedulerWorkflow", {
      taskQueue: TASK_QUEUE,
      workflowId,
      args: [
        {
          subscriptionId: subscription.id,
          email: subscription.email,
          unsubscribeToken: subscription.unsubscribeToken,
          timezone: subscription.timezone,
        },
      ],
    });

    await prisma.digestSubscription.update({
      where: { id: subscription.id },
      data: { temporalWorkflowId: workflowId },
    });
  } catch {
    // Temporal unavailable — subscription saved but workflow deferred
  }

  return NextResponse.json({ success: true });
}
