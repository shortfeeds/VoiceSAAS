// ══════════════════════════════════════════════════════════════════════════════
// Tenant Config Loader
// Fetches client-specific AI agent configuration from the backend API
// or falls back to a default config for standalone testing.
// ══════════════════════════════════════════════════════════════════════════════

import type { STTProvider } from "../providers/stt.js";
import type { TTSProvider } from "../providers/tts.js";
import type { LLMProvider } from "../providers/llm.js";

export interface TenantConfig {
  tenantId: string;
  businessName: string;
  agentName: string;
  firstLine: string;
  instructions: string;
  sttProvider: STTProvider;
  sttLanguage: string;
  ttsProvider: TTSProvider;
  ttsVoice: string;
  ttsLanguage: string;
  llmProvider: LLMProvider;
  llmModel: string;
  faqEntries: Array<{ q: string; a: string }>;
  transferNumber: string;
  maxTurns: number;
  businessHours: Record<string, string>;
  bookingEnabled: boolean;
  calApiKey?: string;
  calEventType?: string;
  minutesRemaining?: number;
}

/** Default config used when no tenant is found or for testing */
const DEFAULT_CONFIG: TenantConfig = {
  tenantId: "default",
  businessName: "Trinity Pixels",
  agentName: "Receptionist",
  firstLine:
    "Hello! Thank you for calling Trinity Pixels. How can I help you today?",
  instructions: `You are a professional AI receptionist for Trinity Pixels, a digital solutions company.

RULES:
- Keep responses SHORT (1-2 sentences max)
- Be warm, professional, and helpful
- Speak in English or switch to Hindi/Hinglish if the caller does
- Ask clarifying questions when needed
- Guide callers to book a demo or connect with the team
- If you cannot answer confidently, offer to transfer to a human

SERVICES:
- AI Voice Agents for businesses
- Website Development
- Digital Marketing
- Custom Software Solutions

TRANSFER RULES:
- Transfer ONLY when: caller asks for human, asks for detailed pricing, or you cannot confidently answer
- Say "Let me connect you with our team" before transferring`,
  sttProvider: "sarvam",
  sttLanguage: "unknown",
  ttsProvider: "sarvam",
  ttsVoice: "kavya",
  ttsLanguage: "hi-IN",
  llmProvider: "groq",
  llmModel: "llama-3.3-70b-versatile",
  faqEntries: [],
  transferNumber: "+917710884479",
  maxTurns: 25,
  businessHours: {
    mon: "10:00-19:00",
    tue: "10:00-19:00",
    wed: "10:00-19:00",
    thu: "10:00-19:00",
    fri: "10:00-19:00",
    sat: "10:00-17:00",
    sun: "closed",
  },
  bookingEnabled: false,
};

/**
 * Fetch tenant configuration by DID (phone number).
 * First tries the backend API, falls back to default config.
 */
export async function getTenantConfig(
  didNumber: string
): Promise<TenantConfig> {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

  try {
    const response = await fetch(
      `${backendUrl}/api/tenant-config/${encodeURIComponent(didNumber)}`
    );

    if (response.ok) {
      const data = (await response.json()) as any;
      console.log(
        `[TenantConfig] Loaded config for tenant: ${data.businessName} (DID: ${didNumber})`
      );
      return data as TenantConfig;
    }

    console.warn(
      `[TenantConfig] No config found for DID ${didNumber}, using defaults`
    );
    return DEFAULT_CONFIG;
  } catch (error) {
    console.warn(
      `[TenantConfig] Backend unreachable, using default config:`,
      error
    );
    return DEFAULT_CONFIG;
  }
}

/**
 * Build the system prompt from a tenant config.
 * Injects FAQs, business info, and behavioral rules.
 */
export function buildSystemPrompt(config: TenantConfig): string {
  let prompt = config.instructions || DEFAULT_CONFIG.instructions;

  // Inject FAQ entries
  if (config.faqEntries && config.faqEntries.length > 0) {
    prompt += "\n\nFREQUENTLY ASKED QUESTIONS:";
    for (const faq of config.faqEntries) {
      prompt += `\nQ: ${faq.q}\nA: ${faq.a}`;
    }
  }

  // Inject business context
  prompt += `\n\nBUSINESS CONTEXT:`;
  prompt += `\n- Business Name: ${config.businessName}`;
  prompt += `\n- Your Name: ${config.agentName}`;
  prompt += `\n- Transfer Number: ${config.transferNumber}`;
  
  // Inject Current Time and Date
  const currentDateTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
  prompt += `\n- Current Time in India: ${currentDateTime}`;

  // Inject Business Hours
  if (config.businessHours) {
    prompt += `\n- Business Hours: ${JSON.stringify(config.businessHours)}`;
    prompt += `\nIf the current time is outside business hours, inform the caller that the business is closed, and you will note down their message or they can call back later. Do not transfer calls if the business is closed.`;
  }

  return prompt;
}
