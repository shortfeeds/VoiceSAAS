// ══════════════════════════════════════════════════════════════════════════════
// Provider Factory: STT (Speech-to-Text)
// Dynamically creates STT instances based on client configuration
// ══════════════════════════════════════════════════════════════════════════════

import * as sarvam from "@livekit/agents-plugin-sarvam";

export type STTProvider = "sarvam" | "deepgram";

export interface STTConfig {
  provider: STTProvider;
  language?: string;
  apiKey?: string;
}

/**
 * Creates an STT instance based on the provider config.
 * Default: Sarvam saaras:v3 (best for Indian languages)
 */
export function createSTT(config: STTConfig) {
  switch (config.provider) {
    case "sarvam":
      return new sarvam.STT({
        model: "saaras:v3",
        languageCode: config.language || "unknown", // auto-detect
        apiKey: config.apiKey || process.env.SARVAM_API_KEY,
      });

    // Future: Add Deepgram, Whisper, etc.
    // case "deepgram":
    //   return new deepgram.STT({ ... });

    default:
      return new sarvam.STT({
        model: "saaras:v3",
        languageCode: "unknown",
        apiKey: process.env.SARVAM_API_KEY,
      });
  }
}
