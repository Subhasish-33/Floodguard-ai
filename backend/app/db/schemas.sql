-- ============================================================
-- FloodGuard AI — PostGIS Production Schema
-- Phase-4: Supabase/PostgreSQL deployment schema
-- Run: psql -U postgres -d floodguard -f schemas.sql
-- ============================================================

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Villages ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS villages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT NOT NULL,
    district_id     TEXT NOT NULL,
    geom            GEOMETRY(Point, 4326) NOT NULL,
    elevation       FLOAT NOT NULL DEFAULT 0,
    population      INTEGER NOT NULL DEFAULT 0,
    base_risk       FLOAT NOT NULL DEFAULT 0 CHECK (base_risk BETWEEN 0 AND 1),
    evacuation_zone TEXT,
    safe_zone_id    TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_villages_district ON villages (district_id);
CREATE INDEX IF NOT EXISTS idx_villages_geom     ON villages USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_villages_risk     ON villages (base_risk DESC);

-- ─── Replay Logs ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS replay_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scenario_id     TEXT NOT NULL,
    session_id      UUID NOT NULL,
    frame_data      JSONB NOT NULL DEFAULT '{}',
    recorded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_replay_scenario ON replay_logs (scenario_id);
CREATE INDEX IF NOT EXISTS idx_replay_session  ON replay_logs (session_id);
CREATE INDEX IF NOT EXISTS idx_replay_time     ON replay_logs (recorded_at DESC);

-- ─── Incidents ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS incidents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type            TEXT NOT NULL DEFAULT 'FLOOD',
    severity        TEXT NOT NULL DEFAULT 'MEDIUM'
                    CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    lifecycle       TEXT NOT NULL DEFAULT 'DETECTED'
                    CHECK (lifecycle IN ('DETECTED', 'ESCALATED', 'RESPONDING', 'RESOLVED')),
    district_id     TEXT,
    village_name    TEXT,
    title           TEXT NOT NULL,
    description     TEXT NOT NULL DEFAULT '',
    geom            GEOMETRY(Point, 4326),
    simulation_frame INTEGER,
    tags            TEXT[] DEFAULT '{}',
    metadata        JSONB NOT NULL DEFAULT '{}',
    notes           JSONB NOT NULL DEFAULT '[]',
    audit_trail     JSONB NOT NULL DEFAULT '[]',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incidents_lifecycle  ON incidents (lifecycle);
CREATE INDEX IF NOT EXISTS idx_incidents_severity   ON incidents (severity);
CREATE INDEX IF NOT EXISTS idx_incidents_district   ON incidents (district_id);
CREATE INDEX IF NOT EXISTS idx_incidents_geom       ON incidents USING GIST (geom) WHERE geom IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_incidents_created    ON incidents (created_at DESC);

-- ─── Simulation Events (Audit Trail) ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS simulation_events (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id      UUID NOT NULL,
    event_type      TEXT NOT NULL,
    payload         JSONB NOT NULL DEFAULT '{}',
    frame_index     INTEGER NOT NULL DEFAULT 0,
    ts              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sim_events_session ON simulation_events (session_id);
CREATE INDEX IF NOT EXISTS idx_sim_events_type    ON simulation_events (event_type);
CREATE INDEX IF NOT EXISTS idx_sim_events_ts      ON simulation_events (ts DESC);

-- ─── Weather Readings (Time-Series Archive) ───────────────────────────────────

CREATE TABLE IF NOT EXISTS weather_readings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id     TEXT NOT NULL,
    rainfall_mm_hr  FLOAT NOT NULL DEFAULT 0,
    rainfall_accum  FLOAT NOT NULL DEFAULT 0,
    wind_kph        FLOAT NOT NULL DEFAULT 0,
    alert_level     TEXT NOT NULL DEFAULT 'NONE',
    source          TEXT NOT NULL DEFAULT 'OWM',  -- OWM | IMD | MANUAL
    reading_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weather_district ON weather_readings (district_id);
CREATE INDEX IF NOT EXISTS idx_weather_time     ON weather_readings (reading_at DESC);

-- ─── Auto-update updated_at triggers ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_villages_updated_at
    BEFORE UPDATE ON villages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_incidents_updated_at
    BEFORE UPDATE ON incidents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security (Supabase) ───────────────────────────────────────────

ALTER TABLE villages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents          ENABLE ROW LEVEL SECURITY;
ALTER TABLE replay_logs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_events  ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_readings   ENABLE ROW LEVEL SECURITY;

-- Public read access for operational dashboard (anon key)
CREATE POLICY "Public read villages"          ON villages           FOR SELECT USING (true);
CREATE POLICY "Public read incidents"         ON incidents          FOR SELECT USING (true);
CREATE POLICY "Public read replay logs"       ON replay_logs        FOR SELECT USING (true);
CREATE POLICY "Public read sim events"        ON simulation_events  FOR SELECT USING (true);
CREATE POLICY "Public read weather readings"  ON weather_readings   FOR SELECT USING (true);

-- Write requires service role key
CREATE POLICY "Service write villages"    ON villages           FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write incidents"   ON incidents          FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Anon insert incidents"     ON incidents          FOR INSERT WITH CHECK (true);
CREATE POLICY "Service write replay"      ON replay_logs        FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Anon insert sim events"    ON simulation_events  FOR INSERT WITH CHECK (true);
CREATE POLICY "Service write weather"     ON weather_readings   FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Anon insert weather"       ON weather_readings   FOR INSERT WITH CHECK (true);
