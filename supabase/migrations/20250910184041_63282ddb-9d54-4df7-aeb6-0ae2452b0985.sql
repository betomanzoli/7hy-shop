-- Atualizar automation_jobs com próximas execuções
UPDATE automation_jobs 
SET 
  next_run = CASE 
    WHEN job_name = 'price-monitor' THEN NOW() + INTERVAL '4 hours'
    WHEN job_name = 'user-alerts' THEN NOW() + INTERVAL '15 minutes'  
    WHEN job_name = 'email-processor' THEN NOW() + INTERVAL '5 minutes'
    WHEN job_name = 'analytics-processor' THEN NOW() + INTERVAL '6 hours'
    WHEN job_name = 'system-monitor' THEN NOW() + INTERVAL '30 minutes'
    WHEN job_name = 'recommendation-engine' THEN NOW() + INTERVAL '6 hours'
    WHEN job_name = 'import-shopee-products' THEN DATE_TRUNC('day', NOW()) + INTERVAL '1 day' + INTERVAL '3 hours'
    ELSE NOW() + INTERVAL '1 hour'
  END,
  updated_at = NOW()
WHERE next_run IS NULL;