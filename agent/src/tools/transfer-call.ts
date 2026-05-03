import { llm } from "@livekit/agents";
import { z } from "zod";
import { SipClient } from "livekit-server-sdk";

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

    try {
      // 1. Identify the SIP participant (the caller)
      // We look for participants whose identity starts with 'sip_' or who have 'sip' metadata
      const sipParticipant = Array.from(ctx.room.remoteParticipants.values()).find(
        (p) => p.identity.startsWith("sip") || p.kind === 2 // SIP participant kind is usually 2 in RTC
      );

      if (!sipParticipant) {
        console.error("[Transfer] No SIP participant found in the room to transfer.");
        return "I'm sorry, I'm having trouble connecting you to our team right now. Is there anything else I can help you with?";
      }

      // 2. Initialize SIP client
      const sipClient = new SipClient(
        process.env.LIVEKIT_URL!.replace("wss://", "https://"),
        process.env.LIVEKIT_API_KEY!,
        process.env.LIVEKIT_API_SECRET!
      );

      // 3. Trigger the transfer (SIP REFER)
      await sipClient.transferSIPParticipant(
        ctx.room.name,
        sipParticipant.identity,
        transferNumber
      );

      console.log(`[Transfer] Successfully initiated transfer for ${sipParticipant.identity}`);

      return "Connecting you to our team now. Please stay on the line.";
    } catch (error) {
      console.error("[Transfer] Error during SIP transfer:", error);
      return "I'm trying to connect you to a human agent, but I encountered a technical issue. Please try calling back in a few minutes.";
    }
  },
});
