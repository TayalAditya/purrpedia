import { Connection, Client } from "@temporalio/client";

let client: Client | null = null;

export async function getTemporalClient(): Promise<Client> {
  if (client) return client;

  const address = process.env.TEMPORAL_ADDRESS ?? "localhost:7233";
  const apiKey = process.env.TEMPORAL_API_KEY;
  const namespace = process.env.TEMPORAL_NAMESPACE ?? "default";

  const connection = await Connection.connect({
    address,
    tls: !!apiKey,
    apiKey: apiKey || undefined,
    metadata: apiKey ? { "temporal-namespace": namespace } : undefined,
  });

  client = new Client({ connection, namespace });

  return client;
}

export const TASK_QUEUE = process.env.TEMPORAL_TASK_QUEUE ?? "purrpedia-main";
