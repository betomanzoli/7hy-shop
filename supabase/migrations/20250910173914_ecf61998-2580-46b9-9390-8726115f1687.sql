-- Atualizar jobs de automação com as novas edge functions
INSERT INTO automation_jobs (job_name, job_type, schedule, config) VALUES
('import-shopee-products', 'data_import', '0 3 * * 0', '{"batch_size": 25}'),
('recommendation-engine', 'machine_learning', '0 6 * * *', '{"max_recommendations": 50}'),
('seo-content-gen', 'content_generation', '0 4 * * *', '{"products_per_batch": 20}'),
('competitor-analysis', 'market_intelligence', '0 2 * * 1', '{"competitors": ["buscape", "zoom"]}'),
('gamification-auto', 'user_engagement', '0 */6 * * *', '{"points_multiplier": 1.0}'),
('analytics-processor', 'analytics', '0 5 * * *', '{"retention_days": 30}'),
('social-automation', 'marketing', '0 9 * * *', '{"max_posts_per_day": 5}'),
('system-monitor', 'monitoring', '*/30 * * * *', '{"alert_thresholds": {"health": 80}}'
)
ON CONFLICT (job_name) DO UPDATE SET
  schedule = EXCLUDED.schedule,
  config = EXCLUDED.config,
  updated_at = now();