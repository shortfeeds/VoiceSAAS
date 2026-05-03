// ══════════════════════════════════════════════════════════════════════════════
// VoiceSAAS — Core Voice Agent
// The brain of the AI receptionist. Handles the complete voice pipeline:
//   Caller Audio → STT → LLM → TTS → Response Audio
// ══════════════════════════════════════════════════════════════════════════════

import {
  type JobContext,
  voice,
} from "@livekit/agents";
import * as silero from "@livekit/agents-plugin-silero";
import { createSTT } from "./providers/stt.js";
import { createTTS } from "./providers/tts.js";
import { createLLM } from "./providers/llm.js";
import {
  getTenantConfig,
  buildSystemPrompt,
} from "./utils/tenant-config.js";
import {
  bookAppointmentTool,
} from "./tools/book-appointment.js";
import {
  transferCallTool,
} from "./tools/transfer-call.js";

/**
 * Entry function called by LiveKit when a new call arrives.
 * This is where the magic happens — we identify the tenant,
 * load their config, and spin up a personalized AI agent.
 */
export async function voiceAgentEntry(ctx: JobContext) {
  console.log(`[VoiceAgent] New call in room: ${ctx.room.name}`);

  // ── Step 0: Connect to the room ──────────────────────────────────────
  await ctx.connect();

  // ── Step 1: Identify the tenant from the SIP call metadata ───────────
  let didNumber = "";

  // Wait for a SIP participant to join (the caller)
  await ctx.waitForParticipant();

  // Extract the DID number from SIP participant attributes
  for (const [, participant] of ctx.room.remoteParticipants) {
    const sipCallTo =
      participant.attributes?.["sip.calledNumber"] ||
      participant.attributes?.["sip.trunkPhoneNumber"] ||
      "";
    if (sipCallTo) {
      didNumber = sipCallTo;
      console.log(`[VoiceAgent] Caller dialed DID: ${didNumber}`);
      break;
    }
  }

  // ── Step 2: Load tenant-specific configuration ───────────────────────
  const config = await getTenantConfig(didNumber);
  console.log(
    `[VoiceAgent] Using config for: ${config.businessName} (Agent: ${config.agentName})`
  );

  // ── Step 3: Check usage limits ───────────────────────────────────────
  if (
    config.minutesRemaining !== undefined &&
    config.minutesRemaining <= 0
  ) {
    console.warn(
      `[VoiceAgent] Tenant ${config.tenantId} has exceeded their quota. Disconnecting.`
    );
    // TODO: Play a "quota exceeded" message before disconnecting
    await ctx.room.disconnect();
    return;
  }

  // ── Step 4: Create provider instances (swappable per tenant) ─────────
  const stt = createSTT({
    provider: config.sttProvider,
    language: config.sttLanguage,
  });

  const tts = createTTS({
    provider: config.ttsProvider,
    voice: config.ttsVoice,
    language: config.ttsLanguage,
  });

  const llm = createLLM({
    provider: config.llmProvider,
    model: config.llmModel,
  });

  // Load VAD (Voice Activity Detection)
  const vad = await silero.VAD.load();

  // ── Step 5: Build the system prompt ──────────────────────────────────
  const systemPrompt = buildSystemPrompt(config);

  // ── Step 6: Create the AI Agent ──────────────────────────────────────
  const agent = new voice.Agent({
    instructions: systemPrompt,
    stt,
    llm,
    tts,
    vad,
    tools: {
      book_appointment: bookAppointmentTool,
      transfer_call: transferCallTool,
    },
  });

  // ── Step 8: Track conversation state ─────────────────────────────────
  let turnCount = 0;
  const callStartTime = Date.now();

  // Create the session
  const session = new voice.AgentSession({
    stt,
    llm,
    tts,
    vad,
    userData: {
      tenantId: config.tenantId,
      transferNumber: config.transferNumber,
    },
  });

  session.on(voice.AgentSessionEventTypes.UserInputTranscribed, (ev) => {
    turnCount++;
    console.log(`[VoiceAgent] Turn ${turnCount} — User: ${ev.transcript}`);

    // Enforce max turns
    if (turnCount >= config.maxTurns) {
      console.warn(
        `[VoiceAgent] Max turns (${config.maxTurns}) reached. Wrapping up.`
      );
    }
  });

  // ── Step 9: Start the agent session ──────────────────────────────────
  await session.start({
    agent,
    room: ctx.room,
  });

  // Greet the caller with the configured first line
  if (config.firstLine) {
    await session.say(config.firstLine);
  }

  // ── Step 10: Handle call end ─────────────────────────────────────────
  ctx.room.on("participantDisconnected", async () => {
    const callDurationSecs = Math.round((Date.now() - callStartTime) / 1000);
    console.log(
      `[VoiceAgent] Call ended. Duration: ${callDurationSecs}s, Turns: ${turnCount}`
    );

    // Report call data to the backend
    try {
      const backendUrl =
        process.env.BACKEND_URL || "http://localhost:4000";
      await fetch(`${backendUrl}/api/calls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: config.tenantId,
          callerNumber: didNumber,
          duration: callDurationSecs,
          turns: turnCount,
          status: "completed",
        }),
      });
    } catch (error) {
      console.warn("[VoiceAgent] Failed to report call data:", error);
    }
  });

  console.log(`[VoiceAgent] Agent session active. Waiting for caller...`);
}
