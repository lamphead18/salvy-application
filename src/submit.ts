import type { ApplicationPayload } from "./types.js";

const ENDPOINT = "https://salvy.app.n8n.cloud/webhook/vaga-estagio/apply";

export async function submitApplication(payload: ApplicationPayload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "accept": "application/json, text/plain;q=0.9"
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    const body = await response.text();

    if (!response.ok) {
      throw new Error(
        `Falha no envio (${response.status} ${response.statusText})${body ? `: ${body}` : ""}`
      );
    }

    return {
      status: response.status,
      body
    };
  } finally {
    clearTimeout(timeout);
  }
}
