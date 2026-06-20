// src/models/tasks.ts

import { MODELS } from "./models";

export const TASK_CONFIG = {
  classifier: {
    model: MODELS.LLAMA_8B,
    temperature: 0,
    maxTokens: 100,
  },

  chat: {
    model: MODELS.LLAMA_70B,
    temperature: 0.3,
    maxTokens: 1024,
  },

  reasoning: {
    model: MODELS.DEEPSEEK_R1,
    temperature: 0,
    maxTokens: 2048,
  },
} as const;