# VoiceSAAS | AI Receptionist Master Pipeline

A production-grade, multi-tenant AI voice receptionist platform built with **LiveKit Agents v1.x**, **NestJS**, and **Next.js**.

## 🚀 Architecture
- **Agent Server**: LiveKit Agents SDK (TS), Sarvam AI (STT/TTS), Groq/OpenAI (LLM).
- **Backend API**: NestJS + Prisma 7 + PostgreSQL (Supabase).
- **Frontend**: Next.js 15 + Vanilla CSS (Glassmorphism design).

## 🛠️ Project Structure
- `/agent`: The AI Voice Agent logic and tools.
- `/backend`: NestJS API for tenant configuration and call logging.
- `/dashboard`: Next.js frontend for clients and admins.

## 🏁 Quick Start

### 1. Environment Setup
Copy the `.env` template and fill in your API keys:
```bash
LIVEKIT_URL=...
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
SARVAM_API_KEY=...
GROQ_API_KEY=...
DATABASE_URL=...
```

### 2. Start the Backend
```bash
cd backend
npm install
npm run start:dev
```

### 3. Start the AI Agent
```bash
cd agent
npm install
npm run dev
```

### 4. Start the Dashboard
```bash
cd dashboard
npm install
npm run dev
```

## 📜 Database Migrations
Initialize the Supabase schema:
```bash
npx prisma db push
```

---
Built by **Antigravity** for **Trinity Pixels**.
