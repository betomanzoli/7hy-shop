-- Ativar extensão pg_cron para suporte a jobs agendados
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Ativar extensão pg_net para suporte a HTTP requests nos cron jobs
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Garantir que o schema cron existe e tem as permissões corretas
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Configurar permissões para executar funções net.http_post
GRANT EXECUTE ON FUNCTION net.http_post TO postgres;