CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  api_key TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,

  status TEXT DEFAULT 'PENDING',
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,

  message TEXT,
  level TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_status_check;
ALTER TABLE jobs
  ADD CONSTRAINT jobs_status_check
  CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'));

ALTER TABLE logs DROP CONSTRAINT IF EXISTS logs_level_check;
ALTER TABLE logs
  ADD CONSTRAINT logs_level_check
  CHECK (level IN ('INFO', 'ERROR'));

CREATE INDEX IF NOT EXISTS idx_jobs_integration_id ON jobs(integration_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_logs_job_id ON logs(job_id);