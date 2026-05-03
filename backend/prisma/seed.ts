import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('Seeding database...');

  // 1. Create Plans
  const proPlan = await prisma.plan.upsert({
    where: { name: 'pro' },
    update: {},
    create: {
      name: 'pro',
      displayName: 'Pro Plan',
      minutesLimit: 1000,
      price: 9999.00,
      currency: 'INR',
      features: ['24/7 Agent', 'Custom Voice', 'Appointment Booking', 'Call Transfer'],
    },
  });

  // 2. Create Test Client
  const client = await prisma.client.upsert({
    where: { email: 'trinitypixels.com@gmail.com' },
    update: {},
    create: {
      name: 'Trinity Pixels',
      email: 'trinitypixels.com@gmail.com',
      phoneNumber: '+917710884479',
      planId: proPlan.id,
      status: 'active',
      sttProvider: 'sarvam',
      ttsProvider: 'sarvam',
      llmProvider: 'groq',
    },
  });

  // 3. Create Agent Config
  await prisma.agentConfig.upsert({
    where: { clientId: client.id },
    update: {},
    create: {
      clientId: client.id,
      agentName: 'Aria',
      firstLine: 'Hello! Thanks for calling Trinity Pixels. How can I help you today?',
      instructions: 'You are Aria, a friendly and professional AI receptionist for Trinity Pixels. Your goal is to help callers with service inquiries, book appointments, or transfer them to a human agent if needed.',
      voice: 'kavya',
      language: 'hi-IN',
      sttLanguage: 'en-IN',
      maxTurns: 30,
      transferNumber: '+917710884479',
      bookingEnabled: true,
      calEventType: '1234567',
    },
  });

  // 4. Create DID Entry
  await prisma.didPool.upsert({
    where: { phoneNumber: '+8031337777' },
    update: { assignedTo: client.id, status: 'assigned' },
    create: {
      phoneNumber: '+8031337777',
      assignedTo: client.id,
      status: 'assigned',
      provider: 'plivo',
    },
  });

  // 5. Initialize Usage
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  await prisma.usage.upsert({
    where: { clientId_month: { clientId: client.id, month: currentMonth } },
    update: {},
    create: {
      clientId: client.id,
      month: currentMonth,
      totalCalls: 0,
      minutesUsed: 0,
      minutesRemaining: 1000,
    },
  });

  // 6. Create Test User (Admin)
  // Password is 'password' hashed with bcrypt
  await prisma.user.upsert({
    where: { email: 'trinitypixels.com@gmail.com' },
    update: { clientId: client.id },
    create: {
      email: 'trinitypixels.com@gmail.com',
      password: '$2b$10$EPXk9sJ2vW2x/hE5VnE7QO.vH/NfB3E1aE6rW1W3W.x/B1B.m/W1G', // 'password'
      role: 'admin',
      clientId: client.id,
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
