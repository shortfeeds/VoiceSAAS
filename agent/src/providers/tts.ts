// ══════════════════════════════════════════════════════════════════════════════
// Provider Factory: TTS (Text-to-Speech)
// Dynamically creates TTS instances based on client configuration
// ══════════════════════════════════════════════════════════════════════════════

import * as sarvam from "@livekit/agents-plugin-sarvam";

export type TTSProvider = "sarvam" | "elevenlabs";

export interface TTSConfig {
  provider: TTSProvider;
  voice?: string;
  language?: string;
  apiKey?: string;
}

/**
 * Creates a TTS instance based on the provider config.
 * Default: Sarvam bulbul:v3 with kavya voice (natural Indian female)
 */
export function createTTS(config: TTSConfig) {
  switch (config.provider) {
    case "sarvam":
      return new sarvam.TTS({
        model: "bulbul:v3",
        speaker: config.voice || "kavya",
        targetLanguageCode: config.language || "hi-IN",
        pace: 1.0,
        temperature: 0.7,
        apiKey: config.apiKey || process.env.SARVAM_API_KEY,
      });

    // Future: Add ElevenLabs, etc.
    // case "elevenlabs":
    //   return new elevenlabs.TTS({ ... });

    default:
      return new sarvam.TTS({
        model: "bulbul:v3",
        speaker: "kavya",
        targetLanguageCode: "hi-IN",
        apiKey: process.env.SARVAM_API_KEY,
      });
  }
}
