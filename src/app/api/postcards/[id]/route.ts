import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTemporalClient } from "@/lib/temporal";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const postcard = await prisma.postcard.findUnique({
    where: { viewToken: id },
    select: {
      id: true,
      recipientName: true,
      message: true,
      templateId: true,
      canvasData: true,
      previewImageUrl: true,
      sentAt: true,
      status: true,
      sender: { select: { name: true } },
    },
  });

  if (!postcard) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(postcard);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const postcard = await prisma.postcard.findUnique({ where: { id } });

  if (!postcard || postcard.senderId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (postcard.status !== "PENDING") {
    return NextResponse.json(
      { error: "Cannot cancel a postcard that has already been sent" },
      { status: 400 }
    );
  }

  await prisma.postcard.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  if (postcard.temporalWorkflowId) {
    try {
      const client = await getTemporalClient();
      const handle = client.workflow.getHandle(postcard.temporalWorkflowId);
      await handle.signal("cancel");
    } catch {
      // workflow may have already completed
    }
  }

  return NextResponse.json({ success: true });
}
