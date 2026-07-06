import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTemporalClient, TASK_QUEUE } from "@/lib/temporal";
import { rateLimitPostcard } from "@/lib/rate-limit";
import { z } from "zod";

const createSchema = z.object({
  recipientEmail: z.string().email().max(254),
  recipientName: z.string().max(100).optional(),
  message: z.string().min(1).max(500),
  templateId: z.string().max(50),
  canvasData: z.record(z.string(), z.unknown()),
  scheduledFor: z.string().refine((s) => {
    const d = new Date(s);
    return !isNaN(d.getTime()) && d.getTime() > Date.now();
  }, "Must be a valid future date"),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { success, remaining } = rateLimitPostcard(ip);
  if (!success) {
    return NextResponse.json(
      { error: "Daily limit reached. You can send 5 Purrs per day." },
      { status: 429, headers: { "X-RateLimit-Remaining": "0" } }
    );
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = createSchema.safeParse(await req.json());
  if (!body.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: body.error.issues },
      { status: 400 }
    );
  }

  const postcard = await prisma.postcard.create({
    data: {
      senderId: session.user.id,
      recipientEmail: body.data.recipientEmail,
      recipientName: body.data.recipientName,
      message: body.data.message,
      templateId: body.data.templateId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      canvasData: body.data.canvasData as any,
      scheduledFor: new Date(body.data.scheduledFor),
    },
  });

  try {
    const client = await getTemporalClient();
    const workflowId = `postcard-${postcard.id}`;

    await client.workflow.start("ScheduledPostcardWorkflow", {
      taskQueue: TASK_QUEUE,
      workflowId,
      args: [{ postcardId: postcard.id, scheduledFor: body.data.scheduledFor }],
    });

    await prisma.postcard.update({
      where: { id: postcard.id },
      data: { temporalWorkflowId: workflowId },
    });
  } catch {
    // Temporal unavailable — postcard saved but scheduling deferred
  }

  return NextResponse.json({ id: postcard.id, viewToken: postcard.viewToken });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const postcards = await prisma.postcard.findMany({
    where: { senderId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      recipientEmail: true,
      recipientName: true,
      message: true,
      templateId: true,
      scheduledFor: true,
      sentAt: true,
      status: true,
      viewToken: true,
      createdAt: true,
    },
  });

  return NextResponse.json(postcards);
}
