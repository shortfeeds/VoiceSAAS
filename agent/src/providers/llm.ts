// ══════════════════════════════════════════════════════════════════════════════
// Provider Factory: LLM (Large Language Model)
// Dynamically creates LLM instances based on client configuration
// ══════════════════════════════════════════════════════════════════════════════

import * as openai from "@livekit/agents-plugin-openai";

export type LLMProvider = "groq" | "openai";

export interface LLMConfig {
  provider: LLMProvider;
  model?: string;
  apiKey?: string;
}

/**
 * Creates an LLM instance based on the provider config.
 * Default: Groq llama-3.3-70b (ultra-fast, cheapest)
 *
 * Note: Groq uses OpenAI-compatible API, so we use the OpenAI plugin
 * with a custom baseURL pointed to Groq's endpoint.
 */
export function createLLM(config: LLMConfig) {
  switch (config.provider) {
    case "groq":
      return new openai.LLM({
        model: config.model || "llama-3.3-70b-versatile",
        apiKey: config.apiKey || process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
      });

    case "openai":
      return new openai.LLM({
        model: config.model || "gpt-4o-mini",
        apiKey: config.apiKey || process.env.OPENAI_API_KEY,
      });

    default:
      return new openai.LLM({
        model: "llama-3.3-70b-versatile",
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
      });
  }
}
