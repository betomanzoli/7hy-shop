-- Habilitar extensão pg_cron para jobs automáticos
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Habilitar extensão pg_net para requisições HTTP
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Garantir que automation_jobs tenham configurações corretas
UPDATE automation_jobs 
SET 
  next_run = CASE 
    WHEN schedule = '0 */4 * * *' THEN NOW() + INTERVAL '4 hours'  -- price-monitor
    WHEN schedule = '*/15 * * * *' THEN NOW() + INTERVAL '15 minutes'  -- user-alerts  
    WHEN schedule = '*/5 * * * *' THEN NOW() + INTERVAL '5 minutes'   -- email-processor
    WHEN schedule = '0 */6 * * *' THEN NOW() + INTERVAL '6 hours'     -- analytics
    WHEN schedule = '0 */8 * * *' THEN NOW() + INTERVAL '8 hours'     -- product-scraper
    WHEN schedule = '0 6 * * *' THEN NOW() + INTERVAL '6 hours'       -- recommendation-engine  
    WHEN schedule = '*/30 * * * *' THEN NOW() + INTERVAL '30 minutes' -- system-monitor
    WHEN schedule = '0 0 */2 * *' THEN NOW() + INTERVAL '2 days'      -- competitor-analysis
    WHEN schedule = '0 3 * * 0' THEN DATE_TRUNC('week', NOW()) + INTERVAL '1 week' + INTERVAL '3 hours' -- import-shopee (weekly)
    ELSE NOW() + INTERVAL '1 hour'
  END
WHERE next_run IS NULL;