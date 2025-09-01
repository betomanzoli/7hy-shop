
-- Habilitar extensões necessárias para automação
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Tabela para controlar jobs de automação
CREATE TABLE IF NOT EXISTS automation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name VARCHAR NOT NULL UNIQUE,
  job_type VARCHAR NOT NULL,
  schedule VARCHAR NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_run TIMESTAMP WITH TIME ZONE,
  next_run TIMESTAMP WITH TIME ZONE,
  run_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  last_error TEXT,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para logs de automação
CREATE TABLE IF NOT EXISTS automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES automation_jobs(id),
  status VARCHAR NOT NULL, -- 'success', 'error', 'running'
  message TEXT,
  details JSONB DEFAULT '{}',
  duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para email queue
CREATE TABLE IF NOT EXISTS email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email VARCHAR NOT NULL,
  subject VARCHAR NOT NULL,
  html_content TEXT NOT NULL,
  template_name VARCHAR,
  template_data JSONB DEFAULT '{}',
  status VARCHAR DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS policies
ALTER TABLE automation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem gerenciar automações
CREATE POLICY "Only admins can manage automation jobs" ON automation_jobs
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.is_admin = true
  )
);

CREATE POLICY "Only admins can view automation logs" ON automation_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.is_admin = true
  )
);

CREATE POLICY "System can manage email queue" ON email_queue
FOR ALL USING (true);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_automation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER automation_jobs_updated_at
  BEFORE UPDATE ON automation_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_automation_updated_at();

-- Inserir jobs de automação iniciais
INSERT INTO automation_jobs (job_name, job_type, schedule, config) VALUES
('price-monitor', 'price_monitoring', '0 */4 * * *', '{"check_threshold": 5}'),
('user-alerts', 'user_engagement', '*/15 * * * *', '{"batch_size": 50}'),
('daily-reports', 'analytics', '0 6 * * *', '{"report_type": "daily"}'),
('competitor-analysis', 'market_intelligence', '0 2 * * *', '{"competitors": ["buscape", "zoom"]}'),
('email-processor', 'email_automation', '*/5 * * * *', '{"batch_size": 20}')
ON CONFLICT (job_name) DO NOTHING;
