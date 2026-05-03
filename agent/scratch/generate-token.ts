import { AccessToken } from 'livekit-server-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function createToken() {
  const roomName = 'test-room-' + Math.random().toString(36).substring(7);
  const participantName = 'test-user';

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: participantName,
    },
  );

  at.addGrant({
    roomJoin: true,
    room: roomName,
  });

  const token = await at.toJwt();
  console.log(`ROOM_NAME: ${roomName}`);
  console.log(`TOKEN: ${token}`);
  console.log(`URL: ${process.env.LIVEKIT_URL}`);
}

createToken();
