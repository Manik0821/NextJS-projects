import OpenAI from "openai";

export const SCHEDULER_MODEL =
  process.env.NVIDIA_SCHEDULER_MODEL ??
  "meta/llama-3.1-8b-instruct";

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ??
  "http://localhost:3000";

export const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY1,
  baseURL:
    process.env.NVIDIA_BASE_URL ??
    "https://integrate.api.nvidia.com/v1",
  timeout: 20_000,
  maxRetries: 0,
});