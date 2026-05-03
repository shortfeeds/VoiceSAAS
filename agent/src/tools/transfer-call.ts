import { llm } from "@livekit/agents";
import { z } from "zod";

/**
 * Tool definition for call transfer.
 */
export const transferCallTool = llm.tool({
  description:
    "Transfer the current call to a human agent. Use this when: (1) the caller explicitly asks to speak to a person, (2) the caller asks for detailed pricing or custom quotes, or (3) you cannot confidently answer a question.",
  parameters: z.object({
    reason: z
      .string()
      .describe(
        "Brief reason for the transfer, e.g. 'Caller requested human agent', 'Pricing inquiry', 'Complex technical question'"
      ),
  }),
  execute: async (params, { ctx }) => {
    const tenantId = (ctx as any).tenantId || "default";
    const transferNumber = (ctx as any).transferNumber || "+917710884479";

    console.log(
      `[Transfer] Transferring call for tenant ${tenantId} to ${transferNumber} — Reason: ${params.reason}`
    );

    // TODO: Implement actual SIP transfer via LiveKit API
    // Actually, in v1.x, you might need to use the room or participant object
    // but for now we just return the confirmation message.

    return "Let me connect you with our team right away. Please hold for a moment.";
  },
});
