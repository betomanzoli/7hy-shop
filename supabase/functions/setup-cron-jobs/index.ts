
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔧 Iniciando configuração de cron jobs...');
    
    const cronJobs = [
      {
        name: 'price-monitor-job',
        schedule: '0 */4 * * *', // A cada 4 horas
        function_name: 'price-monitor'
      },
      {
        name: 'user-alerts-job',
        schedule: '*/15 * * * *', // A cada 15 minutos
        function_name: 'user-alerts'
      },
      {
        name: 'email-processor-job',
        schedule: '*/5 * * * *', // A cada 5 minutos
        function_name: 'email-processor'
      },
      {
        name: 'analytics-processor-job',
        schedule: '0 */6 * * *', // A cada 6 horas
        function_name: 'analytics-processor'
      },
      {
        name: 'product-scraper-job',
        schedule: '0 */8 * * *', // A cada 8 horas
        function_name: 'product-scraper'
      },
      {
        name: 'recommendation-engine-job',
        schedule: '0 */12 * * *', // A cada 12 horas
        function_name: 'recommendation-engine'
      },
      {
        name: 'system-monitor-job',
        schedule: '*/30 * * * *', // A cada 30 minutos
        function_name: 'system-monitor'
      },
      {
        name: 'competitor-analysis-job',
        schedule: '0 0 */2 * *', // A cada 2 dias
        function_name: 'competitor-analysis'
      },
      {
        name: 'import-shopee-products-job',
        schedule: '0 2 * * *', // Diariamente às 2h
        function_name: 'import-shopee-products'
      },
      {
        name: 'auto-import-products-job',
        schedule: '0 4 * * *', // Diariamente às 4h
        function_name: 'auto-import-products'
      },
      {
        name: 'seo-content-gen-job',
        schedule: '0 6 * * *', // Diariamente às 6h
        function_name: 'seo-content-gen'
      },
      {
        name: 'gamification-auto-job',
        schedule: '0 */3 * * *', // A cada 3 horas
        function_name: 'gamification-auto'
      }
    ];

    const results = [];

    // Primeiro, verificar se as extensões estão habilitadas
    console.log('🔍 Verificando extensões pg_cron e pg_net...');
    const { data: extensions, error: extError } = await supabase
      .from('pg_extension')
      .select('extname')
      .in('extname', ['pg_cron', 'pg_net']);

    if (extError) {
      console.log('⚠️ Não foi possível verificar extensões:', extError.message);
    } else {
      console.log('✅ Extensões encontradas:', extensions?.map(e => e.extname));
    }

    for (const job of cronJobs) {
      try {
        console.log(`📅 Configurando job: ${job.name} (${job.schedule})`);
        
        // Primeiro, tentar remover job existente (ignorar erros)
        try {
          const { error: unscheduleError } = await supabase
            .rpc('cron_unschedule', { jobname: job.name });
          
          if (unscheduleError && !unscheduleError.message.includes('does not exist')) {
            console.log(`⚠️ Erro ao remover job ${job.name}:`, unscheduleError.message);
          }
        } catch (e) {
          console.log(`⚠️ Job ${job.name} não existia para remoção`);
        }
        
        // Criar novo job usando SQL direto
        const cronCommand = `
          SELECT net.http_post(
            url := '${Deno.env.get("SUPABASE_URL")}/functions/v1/${job.function_name}',
            headers := '{"Content-Type": "application/json", "Authorization": "Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}"}'::jsonb,
            body := '{}'::jsonb
          ) as request_id;
        `;

        const { data, error } = await supabase
          .rpc('cron_schedule', {
            jobname: job.name,
            schedule: job.schedule,
            command: cronCommand.trim()
          });

        if (error) {
          console.error(`❌ Erro ao criar job ${job.name}:`, error.message);
          results.push({ 
            job: job.name, 
            status: 'error', 
            error: error.message,
            details: error
          });
        } else {
          console.log(`✅ Job ${job.name} criado com sucesso`);
          results.push({ 
            job: job.name, 
            status: 'success', 
            data,
            schedule: job.schedule,
            function_name: job.function_name
          });
        }
      } catch (error) {
        console.error(`❌ Exceção ao configurar job ${job.name}:`, error);
        results.push({ 
          job: job.name, 
          status: 'error', 
          error: error.message || 'Erro desconhecido',
          exception: error
        });
      }
    }

    // Verificar jobs criados
    try {
      console.log('🔍 Verificando jobs criados na tabela cron.job...');
      const { data: cronJobs, error: cronError } = await supabase
        .from('cron.job')
        .select('*');

      if (cronError) {
        console.log('⚠️ Erro ao verificar tabela cron.job:', cronError.message);
      } else {
        console.log(`📊 Total de jobs na tabela cron.job: ${cronJobs?.length || 0}`);
        if (cronJobs && cronJobs.length > 0) {
          cronJobs.forEach(job => {
            console.log(`  - ${job.jobname}: ${job.schedule} (ativo: ${job.active})`);
          });
        }
      }
    } catch (e) {
      console.log('⚠️ Não foi possível verificar jobs criados:', e.message);
    }

    const successCount = results.filter(r => r.status === 'success').length;
    const totalCount = results.length;

    console.log(`🎉 Configuração concluída! Sucesso: ${successCount}/${totalCount}`);

    return new Response(JSON.stringify({
      success: successCount > 0,
      message: `Cron jobs configurados: ${successCount}/${totalCount} com sucesso`,
      results,
      summary: {
        total: totalCount,
        success: successCount,
        errors: totalCount - successCount
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error('💥 Erro crítico ao configurar cron jobs:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: error,
        message: 'Falha crítica na configuração dos cron jobs'
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
