CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  api_key TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,

  status TEXT CHECK (status IN ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED')) DEFAULT 'PENDING',
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,

  message TEXT,
  level TEXT CHECK (level IN ('INFO', 'ERROR')),
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_jobs_integration_id ON jobs(integration_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_logs_job_id ON logs(job_id);