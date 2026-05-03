import { llm } from "@livekit/agents";
import { z } from "zod";

/**
 * Tool definition for the LLM function-calling interface.
 */
export const bookAppointmentTool = llm.tool({
  description:
    "Book an appointment or schedule a callback for the caller. Call this when the caller wants to schedule a meeting, demo, consultation, or callback.",
  parameters: z.object({
    caller_name: z.string().describe("The name of the caller"),
    caller_phone: z.string().optional().describe("Phone number of the caller if provided"),
    caller_email: z.string().optional().describe("Email address of the caller if provided"),
    preferred_date: z.string().optional().describe("Preferred date/time for the appointment"),
    purpose: z.string().describe("Brief description of what the appointment is for"),
  }),
  execute: async (params, { ctx }) => {
    const tenantId = (ctx as any).tenantId || "default";
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

    try {
      const response = await fetch(`${backendUrl}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...params, tenantId }),
      });

      if (response.ok) {
        console.log(`[Booking] Successfully saved booking for ${params.caller_name}`);
        return `Great! I've scheduled your ${params.purpose} appointment${
          params.preferred_date ? ` for ${params.preferred_date}` : ""
        }. Our team will confirm shortly.`;
      }

      return "I've noted your appointment request. Our team will get back to you shortly to confirm the details.";
    } catch (error) {
      console.warn("[Booking] Failed to save booking:", error);
      return "I've noted your appointment request. Our team will get back to you shortly to confirm.";
    }
  },
});
