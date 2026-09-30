import { readFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import type { ApplicationPayload } from "./types.js";
import { validateApplication } from "./validate.js";
import { submitApplication } from "./submit.js";

const raw = await readFile(new URL("../application.json", import.meta.url), "utf8");
const payload = JSON.parse(raw) as ApplicationPayload;

const errors = validateApplication(payload);

if (errors.length > 0) {
  console.error("\n✗ A candidatura contém problemas:\n");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log("\nSalvy Application");
console.log("────────────────────────────────────────");
console.log(JSON.stringify(payload, null, 2));
console.log("────────────────────────────────────────");

if (process.argv.includes("--preview")) {
  console.log("\n✓ Payload validado. Nenhuma requisição foi enviada.");
  process.exit(0);
}

console.log("\n⚠ Este endpoint aceita apenas um cadastro por e-mail.");

const rl = createInterface({ input, output });
const answer = (await rl.question('Digite "ENVIAR" para confirmar o POST: ')).trim();
rl.close();

if (answer !== "ENVIAR") {
  console.log("\nEnvio cancelado. Nenhuma requisição foi feita.");
  process.exit(0);
}

try {
  const result = await submitApplication(payload);
  console.log(`\n✓ Candidatura enviada com sucesso. HTTP ${result.status}`);
  if (result.body) console.log(result.body);
  console.log("\nsalvy! 👋");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\n✗ ${message}`);
  process.exit(1);
}
