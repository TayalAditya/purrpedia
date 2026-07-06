import { Worker } from "@temporalio/worker";
import { fetchCatContent } from "./activities/fetchCatContent";
import { sendDigestEmail } from "./activities/sendDigestEmail";
import { sendPostcardEmail } from "./activities/sendPostcardEmail";
import { TASK_QUEUE } from "@/lib/temporal";

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve("./workflows/dailyDigest"),
    activities: { fetchCatContent, sendDigestEmail, sendPostcardEmail },
    taskQueue: TASK_QUEUE,
  });

  console.log("PurrPedia Temporal worker started on queue:", TASK_QUEUE);
  await worker.run();
}

run().catch((err) => {
  console.error("Worker crashed:", err);
  process.exit(1);
});
