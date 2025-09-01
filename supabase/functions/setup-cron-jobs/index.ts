
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
      }
    ];

    const results = [];

    for (const job of cronJobs) {
      try {
        // Remover job existente se houver
        await supabase.rpc('cron_unschedule', { jobname: job.name });
        
        // Criar novo job
        const { data, error } = await supabase.rpc('cron_schedule', {
          jobname: job.name,
          schedule: job.schedule,
          command: `
            select
              net.http_post(
                  url:='${Deno.env.get("SUPABASE_URL")}/functions/v1/${job.function_name}',
                  headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}"}'::jsonb,
                  body:='{}'::jsonb
              ) as request_id;
          `
        });

        if (error) {
          results.push({ job: job.name, status: 'error', error: error.message });
        } else {
          results.push({ job: job.name, status: 'success', data });
        }
      } catch (error) {
        results.push({ job: job.name, status: 'error', error: error.message });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Cron jobs configurados',
      results
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error('Erro ao configurar cron jobs:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
