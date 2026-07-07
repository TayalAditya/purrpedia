import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { getTemporalClient, TASK_QUEUE } from "../src/lib/temporal";

const prisma = new PrismaClient();

async function main() {
  const stuck = await prisma.postcard.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
  });

  console.log(`Found ${stuck.length} stuck postcard(s) with no workflow.`);
  if (stuck.length === 0) return;

  const client = await getTemporalClient();
  console.log("Temporal client connected.");

  for (const p of stuck) {
    const workflowId = `postcard-${p.id}-retry2`;
    try {
      await client.workflow.start("ScheduledPostcardWorkflow", {
        taskQueue: TASK_QUEUE,
        workflowId,
        args: [{ postcardId: p.id, scheduledFor: p.scheduledFor.toISOString() }],
      });
      await prisma.postcard.update({
        where: { id: p.id },
        data: { temporalWorkflowId: workflowId },
      });
      console.log(`  ✓ started ${workflowId} → ${p.recipientEmail} (sched ${p.scheduledFor.toISOString()})`);
    } catch (e) {
      console.error(`  ✗ failed ${workflowId}:`, (e as Error).message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("FATAL:", e);
    process.exit(1);
  });
