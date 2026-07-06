import {
  proxyActivities,
  defineSignal,
  setHandler,
  condition,
  sleep,
} from "@temporalio/workflow";
import type { sendPostcardEmail } from "../activities/sendPostcardEmail";

const { sendPostcardEmail: sendEmail } = proxyActivities<{
  sendPostcardEmail: typeof sendPostcardEmail;
}>({
  startToCloseTimeout: "5 minutes",
  retry: { maximumAttempts: 3 },
});

export const cancelSignal = defineSignal("cancel");

export async function ScheduledPostcardWorkflow(params: {
  postcardId: string;
  scheduledFor: string;
}) {
  let cancelled = false;
  setHandler(cancelSignal, () => {
    cancelled = true;
  });

  const scheduledAt = new Date(params.scheduledFor).getTime();
  const now = Date.now();
  const delay = Math.max(0, scheduledAt - now);

  if (delay > 0) {
    const cancelled_ = await condition(() => cancelled, delay);
    if (cancelled_) return;
  }

  if (!cancelled) {
    await sendEmail(params.postcardId);
  }
}
