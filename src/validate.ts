import type { ApplicationPayload } from "./types.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HTTP_URL = /^https?:\/\//i;

export function validateApplication(payload: ApplicationPayload): string[] {
  const errors: string[] = [];

  for (const [field, value] of Object.entries(payload)) {
    if (!value.trim()) errors.push(`${field} é obrigatório.`);
  }

  if (!EMAIL.test(payload.email)) {
    errors.push("email não parece válido.");
  }

  if (!HTTP_URL.test(payload.linkedin_url)) {
    errors.push("linkedin_url precisa ser uma URL http/https.");
  }

  if (!payload.linkedin_url.includes("linkedin.com/")) {
    errors.push("linkedin_url precisa apontar para linkedin.com.");
  }

  if (payload.projeto_orgulho.length < 80) {
    errors.push("projeto_orgulho está curto demais para explicar o projeto com clareza.");
  }

  return errors;
}
