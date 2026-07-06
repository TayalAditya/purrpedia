import {
  proxyActivities,
  defineSignal,
  setHandler,
  condition,
  sleep,
} from "@temporalio/workflow";
import type { fetchCatContent } from "../activities/fetchCatContent";
import type { sendDigestEmail } from "../activities/sendDigestEmail";

const { fetchCatContent: fetchContent, sendDigestEmail: sendEmail } =
  proxyActivities<{
    fetchCatContent: typeof fetchCatContent;
    sendDigestEmail: typeof sendDigestEmail;
  }>({
    startToCloseTimeout: "5 minutes",
    retry: { maximumAttempts: 3 },
  });

export const unsubscribeSignal = defineSignal("unsubscribe");

function msUntilNext8am(timezone: string): number {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const s = Number(parts.find((p) => p.type === "second")?.value ?? 0);

  const currentSecondsInDay = h * 3600 + m * 60 + s;
  const targetSeconds = 8 * 3600;

  const secondsUntil =
    currentSecondsInDay < targetSeconds
      ? targetSeconds - currentSecondsInDay
      : 86400 - currentSecondsInDay + targetSeconds;

  return secondsUntil * 1000;
}

export async function DigestSchedulerWorkflow(params: {
  subscriptionId: string;
  email: string;
  unsubscribeToken: string;
  timezone: string;
}) {
  let cancelled = false;
  setHandler(unsubscribeSignal, () => {
    cancelled = true;
  });

  while (!cancelled) {
    const delay = msUntilNext8am(params.timezone);
    await sleep(delay);

    if (cancelled) break;

    const content = await fetchContent();
    await sendEmail(
      params.subscriptionId,
      params.email,
      content,
      params.unsubscribeToken
    );
  }
}
