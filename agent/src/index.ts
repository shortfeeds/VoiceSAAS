// ══════════════════════════════════════════════════════════════════════════════
// VoiceSAAS — Agent Entrypoint
// Starts the LiveKit Agents worker that listens for incoming SIP calls.
// ══════════════════════════════════════════════════════════════════════════════

import {
  WorkerOptions,
  defineAgent,
  cli,
} from "@livekit/agents";
import { JobType } from "@livekit/protocol";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { voiceAgentEntry } from "./voice-agent.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the project root
config({ path: resolve(__dirname, "../../.env") });

// ── Define the agent ────────────────────────────────────────────────────────
export default defineAgent({
  entry: voiceAgentEntry,
});

// ── Start the CLI worker ────────────────────────────────────────────────────
// This connects to LiveKit Cloud and listens for dispatch events.
// When a SIP call comes in, LiveKit dispatches it to this agent.
cli.runApp(
  new WorkerOptions({
    agent: __filename,
    // The server type determines how jobs are dispatched
    serverType: JobType.JT_ROOM,
  })
);
