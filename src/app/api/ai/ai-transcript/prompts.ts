import { langfuse } from "./langfuse";

const promptCache = new Map();

export async function getCachedPrompt(name: string) {
  const cached = promptCache.get(name);

  if (cached) {
    return cached;
  }

  const prompt = await langfuse.getPrompt(name);

  promptCache.set(name, prompt);

  return prompt;
}