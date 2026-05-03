-- ══════════════════════════════════════════════════════════════════════════════
-- VoiceSAAS — Base Schema
-- Migration 001: Core tables for the multi-tenant AI receptionist platform
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Plans ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plans (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL UNIQUE,
    display_name    TEXT NOT NULL,
    minutes_limit   INTEGER NOT NULL,
    price           NUMERIC(10,2) NOT NULL,
    currency        TEXT DEFAULT 'INR',
    features        JSONB DEFAULT '[]',
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Clients (Tenants) ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    email           TEXT UNIQUE NOT NULL,
    phone_number    TEXT,
    plan_id         UUID REFERENCES plans(id),
    stt_provider    TEXT DEFAULT 'sarvam',
    tts_provider    TEXT DEFAULT 'sarvam',
    llm_provider    TEXT DEFAULT 'groq',
    status          TEXT DEFAULT 'active',       -- active, suspended, cancelled
    razorpay_sub_id TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Agent Configs (per-client AI persona) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS agent_configs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id       UUID REFERENCES clients(id) ON DELETE CASCADE UNIQUE,
    agent_name      TEXT DEFAULT 'Receptionist',
    first_line      TEXT DEFAULT 'Hello! How can I help you today?',
    instructions    TEXT,
    voice           TEXT DEFAULT 'kavya',
    language        TEXT DEFAULT 'hi-IN',
    stt_language    TEXT DEFAULT 'unknown',
    faq_entries     JSONB DEFAULT '[]',
    services_list   TEXT,
    transfer_number TEXT,
    max_turns       INTEGER DEFAULT 25,
    business_hours  JSONB DEFAULT '{"mon":"10:00-19:00","tue":"10:00-19:00","wed":"10:00-19:00","thu":"10:00-19:00","fri":"10:00-19:00","sat":"10:00-17:00","sun":"closed"}',
    booking_enabled BOOLEAN DEFAULT false,
    cal_api_key     TEXT,
    cal_event_type  TEXT,
    webhook_url     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── DID Number Pool ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS did_pool (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number    TEXT UNIQUE NOT NULL,
    provider        TEXT DEFAULT 'plivo',
    region          TEXT,
    monthly_cost    NUMERIC(8,2) DEFAULT 299.00,
    assigned_to     UUID REFERENCES clients(id),
    sip_trunk_id    TEXT,
    status          TEXT DEFAULT 'available',     -- available, assigned, porting
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Calls ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS calls (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id       UUID REFERENCES clients(id) ON DELETE CASCADE,
    caller_number   TEXT,
    caller_name     TEXT,
    duration        INTEGER DEFAULT 0,             -- seconds
    turns           INTEGER DEFAULT 0,
    transcript      TEXT,
    summary         TEXT,
    audio_url       TEXT,
    recording_url   TEXT,
    status          TEXT DEFAULT 'completed',       -- completed, missed, transferred, failed
    sentiment       TEXT,                            -- positive, neutral, negative
    was_booked      BOOLEAN DEFAULT false,
    was_transferred BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Usage Tracking ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usage (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id       UUID REFERENCES clients(id) ON DELETE CASCADE,
    month           TEXT NOT NULL,                  -- '2026-05'
    total_calls     INTEGER DEFAULT 0,
    minutes_used    NUMERIC(10,2) DEFAULT 0,
    minutes_remaining NUMERIC(10,2),
    overage_calls   INTEGER DEFAULT 0,
    overage_charge  NUMERIC(10,2) DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(client_id, month)
);

-- ── API Keys (encrypted storage) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_keys (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id       UUID REFERENCES clients(id) ON DELETE CASCADE,
    provider        TEXT NOT NULL,                  -- sarvam, openai, groq, elevenlabs
    api_key_encrypted TEXT NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(client_id, provider)
);

-- ── Bookings ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id       UUID REFERENCES clients(id) ON DELETE CASCADE,
    call_id         UUID REFERENCES calls(id),
    caller_name     TEXT,
    caller_phone    TEXT,
    caller_email    TEXT,
    preferred_date  TEXT,
    purpose         TEXT,
    status          TEXT DEFAULT 'pending',         -- pending, confirmed, cancelled
    cal_booking_id  TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_clients_owner ON clients(owner_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_calls_client ON calls(client_id);
CREATE INDEX IF NOT EXISTS idx_calls_created ON calls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_client_month ON usage(client_id, month);
CREATE INDEX IF NOT EXISTS idx_did_pool_status ON did_pool(status);
CREATE INDEX IF NOT EXISTS idx_did_pool_assigned ON did_pool(assigned_to);

-- ── Seed Plans ──────────────────────────────────────────────────────────────
INSERT INTO plans (name, display_name, minutes_limit, price, features) VALUES
    ('starter', 'Starter', 200, 999.00, '["200 minutes/month", "1 AI agent", "Call logs", "Basic analytics"]'),
    ('growth', 'Growth', 500, 2499.00, '["500 minutes/month", "1 AI agent", "Call logs", "Advanced analytics", "FAQ builder", "Booking integration"]'),
    ('business', 'Business', 1500, 4999.00, '["1500 minutes/month", "Custom voice", "Priority support", "API access", "Webhook integrations", "White-label"]')
ON CONFLICT (name) DO NOTHING;
