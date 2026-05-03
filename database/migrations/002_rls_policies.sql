-- ══════════════════════════════════════════════════════════════════════════════
-- VoiceSAAS — Row Level Security Policies
-- Migration 002: Ensures tenants can only access their own data
-- ══════════════════════════════════════════════════════════════════════════════

-- Enable RLS on all tenant-scoped tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- ── Clients: owners see their own tenant ────────────────────────────────────
DROP POLICY IF EXISTS "clients_owner_access" ON clients;
CREATE POLICY "clients_owner_access" ON clients
    FOR ALL USING (owner_id = auth.uid());

-- ── Agent Configs: via client ownership ─────────────────────────────────────
DROP POLICY IF EXISTS "agent_configs_owner_access" ON agent_configs;
CREATE POLICY "agent_configs_owner_access" ON agent_configs
    FOR ALL USING (
        client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
    );

-- ── Calls: via client ownership ─────────────────────────────────────────────
DROP POLICY IF EXISTS "calls_owner_access" ON calls;
CREATE POLICY "calls_owner_access" ON calls
    FOR SELECT USING (
        client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
    );

-- ── Usage: via client ownership ─────────────────────────────────────────────
DROP POLICY IF EXISTS "usage_owner_access" ON usage;
CREATE POLICY "usage_owner_access" ON usage
    FOR SELECT USING (
        client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
    );

-- ── API Keys: via client ownership ──────────────────────────────────────────
DROP POLICY IF EXISTS "api_keys_owner_access" ON api_keys;
CREATE POLICY "api_keys_owner_access" ON api_keys
    FOR ALL USING (
        client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
    );

-- ── Bookings: via client ownership ──────────────────────────────────────────
DROP POLICY IF EXISTS "bookings_owner_access" ON bookings;
CREATE POLICY "bookings_owner_access" ON bookings
    FOR SELECT USING (
        client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
    );

-- ── Plans: publicly readable ────────────────────────────────────────────────
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "plans_public_read" ON plans;
CREATE POLICY "plans_public_read" ON plans
    FOR SELECT USING (true);

-- ── DID Pool: admin-only (no public RLS, managed via backend) ───────────────
-- DID pool is managed exclusively by the backend API with service role key
