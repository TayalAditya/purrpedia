import { NativeConnection, Worker } from "@temporalio/worker";
import { fetchCatContent } from "./activities/fetchCatContent";
import { sendDigestEmail } from "./activities/sendDigestEmail";
import { sendPostcardEmail } from "./activities/sendPostcardEmail";

const TASK_QUEUE = process.env.TEMPORAL_TASK_QUEUE ?? "purrpedia-main";

async function run() {
  const address = process.env.TEMPORAL_ADDRESS ?? "localhost:7233";
  const apiKey = process.env.TEMPORAL_API_KEY;
  const namespace = process.env.TEMPORAL_NAMESPACE ?? "default";

  const connection = await NativeConnection.connect({
    address,
    tls: !!apiKey,
    apiKey: apiKey || undefined,
    metadata: apiKey ? { "temporal-namespace": namespace } : undefined,
  });

  const worker = await Worker.create({
    connection,
    namespace,
    workflowsPath: require.resolve("./workflows"),
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
