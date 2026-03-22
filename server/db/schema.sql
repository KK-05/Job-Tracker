-- ═══════════════════════════════════════════════════════
-- AI Job Application Tracker — Database Schema
-- PostgreSQL
-- ═══════════════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Enum Type ──────────────────────────────────────────
CREATE TYPE application_status AS ENUM ('Applied', 'Interview', 'Offer', 'Rejected');

-- ─── Users ──────────────────────────────────────────────
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- ─── Applications ───────────────────────────────────────
CREATE TABLE applications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name    VARCHAR(255) NOT NULL,
    role            VARCHAR(255) NOT NULL,
    status          application_status NOT NULL DEFAULT 'Applied',
    job_description TEXT,
    applied_date    DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_applications_user   ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);

-- ─── Notes ──────────────────────────────────────────────
CREATE TABLE notes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notes_application ON notes(application_id);

-- ─── Resumes ────────────────────────────────────────────
CREATE TABLE resumes (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_url    TEXT NOT NULL,
    parsed_text TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_resumes_user ON resumes(user_id);

-- ─── AI Insights ────────────────────────────────────────
CREATE TABLE ai_insights (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    match_score     INTEGER CHECK (match_score >= 0 AND match_score <= 100),
    feedback        TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_insights_application ON ai_insights(application_id);
