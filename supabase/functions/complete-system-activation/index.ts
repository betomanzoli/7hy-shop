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
    console.log('🚀 Iniciando ativação completa do sistema...');
    
    const executionResults = [];
    let overallSuccess = true;

    // PASSO 1: Verificar e habilitar extensões necessárias
    console.log('🔍 Verificando extensões pg_cron e pg_net...');
    try {
      // Tentar habilitar pg_cron
      const { error: cronError } = await supabase.rpc('enable_extension', { name: 'pg_cron' });
      if (cronError && !cronError.message.includes('already exists')) {
        console.log('⚠️ Erro ao habilitar pg_cron:', cronError.message);
      } else {
        console.log('✅ Extensão pg_cron habilitada');
      }

      // Tentar habilitar pg_net  
      const { error: netError } = await supabase.rpc('enable_extension', { name: 'pg_net' });
      if (netError && !netError.message.includes('already exists')) {
        console.log('⚠️ Erro ao habilitar pg_net:', netError.message);
      } else {
        console.log('✅ Extensão pg_net habilitada');
      }
    } catch (e) {
      console.log('⚠️ Não foi possível verificar extensões automaticamente');
    }

    // PASSO 2: Configurar cron jobs
    console.log('🔧 Executando setup-cron-jobs...');
    try {
      const setupResponse = await supabase.functions.invoke('setup-cron-jobs', {
        body: {}
      });
      
      if (setupResponse.error) {
        console.error('❌ Erro no setup-cron-jobs:', setupResponse.error);
        executionResults.push({
          step: 'setup-cron-jobs',
          status: 'error',
          error: setupResponse.error
        });
        overallSuccess = false;
      } else {
        console.log('✅ Cron jobs configurados com sucesso');
        executionResults.push({
          step: 'setup-cron-jobs',
          status: 'success',
          data: setupResponse.data
        });
      }
    } catch (error) {
      console.error('❌ Exceção no setup-cron-jobs:', error);
      executionResults.push({
        step: 'setup-cron-jobs',
        status: 'error',
        error: error.message
      });
      overallSuccess = false;
    }

    // PASSO 3: Importar produtos da Shopee
    console.log('📦 Executando import-shopee-products...');
    try {
      const importResponse = await supabase.functions.invoke('import-shopee-products', {
        body: {}
      });
      
      if (importResponse.error) {
        console.error('❌ Erro no import-shopee-products:', importResponse.error);
        executionResults.push({
          step: 'import-shopee-products',
          status: 'error',
          error: importResponse.error
        });
      } else {
        console.log('✅ Produtos Shopee importados com sucesso');
        executionResults.push({
          step: 'import-shopee-products',
          status: 'success',
          data: importResponse.data
        });
      }
    } catch (error) {
      console.error('❌ Exceção no import-shopee-products:', error);
      executionResults.push({
        step: 'import-shopee-products',
        status: 'error',
        error: error.message
      });
    }

    // PASSO 4: Processar analytics iniciais
    console.log('📊 Executando analytics-processor...');
    try {
      const analyticsResponse = await supabase.functions.invoke('analytics-processor', {
        body: {}
      });
      
      if (analyticsResponse.error) {
        console.error('❌ Erro no analytics-processor:', analyticsResponse.error);
        executionResults.push({
          step: 'analytics-processor',
          status: 'error',
          error: analyticsResponse.error
        });
      } else {
        console.log('✅ Analytics processados com sucesso');
        executionResults.push({
          step: 'analytics-processor',
          status: 'success',
          data: analyticsResponse.data
        });
      }
    } catch (error) {
      console.error('❌ Exceção no analytics-processor:', error);
      executionResults.push({
        step: 'analytics-processor',
        status: 'error',
        error: error.message
      });
    }

    // PASSO 5: Gerar recomendações iniciais
    console.log('🤖 Executando recommendation-engine...');
    try {
      const recommendationResponse = await supabase.functions.invoke('recommendation-engine', {
        body: {}
      });
      
      if (recommendationResponse.error) {
        console.error('❌ Erro no recommendation-engine:', recommendationResponse.error);
        executionResults.push({
          step: 'recommendation-engine',
          status: 'error',
          error: recommendationResponse.error
        });
      } else {
        console.log('✅ Recomendações geradas com sucesso');
        executionResults.push({
          step: 'recommendation-engine',
          status: 'success',
          data: recommendationResponse.data
        });
      }
    } catch (error) {
      console.error('❌ Exceção no recommendation-engine:', error);
      executionResults.push({
        step: 'recommendation-engine',
        status: 'error',
        error: error.message
      });
    }

    // PASSO 6: Monitorar sistema
    console.log('🔍 Executando system-monitor...');
    try {
      const monitorResponse = await supabase.functions.invoke('system-monitor', {
        body: {}
      });
      
      if (monitorResponse.error) {
        console.error('❌ Erro no system-monitor:', monitorResponse.error);
        executionResults.push({
          step: 'system-monitor',
          status: 'error',
          error: monitorResponse.error
        });
      } else {
        console.log('✅ Sistema monitorado com sucesso');
        executionResults.push({
          step: 'system-monitor',
          status: 'success',
          data: monitorResponse.data
        });
      }
    } catch (error) {
      console.error('❌ Exceção no system-monitor:', error);
      executionResults.push({
        step: 'system-monitor',
        status: 'error',
        error: error.message
      });
    }

    // PASSO 7: Verificar resultados finais
    console.log('📊 Verificando estado final do sistema...');
    
    // Verificar cron jobs criados
    const { data: cronJobs, error: cronError } = await supabase
      .from('cron.job')
      .select('*');
    
    // Verificar produtos ativos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id')
      .eq('status', 'active');

    // Verificar automation jobs
    const { data: automationJobs, error: automationError } = await supabase
      .from('automation_jobs')
      .select('*')
      .eq('is_active', true);

    const finalStats = {
      cron_jobs: cronJobs?.length || 0,
      active_products: products?.length || 0,
      automation_jobs: automationJobs?.length || 0,
      cron_jobs_error: cronError?.message,
      products_error: productsError?.message,
      automation_error: automationError?.message
    };

    // Log final da ativação
    const successCount = executionResults.filter(r => r.status === 'success').length;
    const totalSteps = executionResults.length;
    const successRate = Math.round((successCount / totalSteps) * 100);

    const logEntry = {
      job_id: null,
      status: overallSuccess ? 'success' : 'partial_success',
      message: `Ativação completa do sistema executada: ${successCount}/${totalSteps} passos concluídos (${successRate}%)`,
      details: {
        execution_results: executionResults,
        final_stats: finalStats,
        success_rate: successRate
      },
      duration_ms: Date.now()
    };

    // Salvar log de execução
    await supabase.from('automation_logs').insert(logEntry);

    console.log(`🎉 Ativação do sistema concluída! Sucesso: ${successCount}/${totalSteps} (${successRate}%)`);

    return new Response(JSON.stringify({
      success: overallSuccess,
      message: `Sistema ativado com ${successCount}/${totalSteps} passos concluídos`,
      results: executionResults,
      final_stats: finalStats,
      success_rate: successRate,
      next_steps: overallSuccess ? [
        'Sistema está ativo e rodando',
        'Cron jobs configurados e executando automaticamente',
        'Monitorar logs de automação no dashboard'
      ] : [
        'Verificar erros nos steps que falharam',
        'Executar steps individuais se necessário',
        'Verificar configurações de extensões PostgreSQL'
      ]
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error('💥 Erro crítico na ativação do sistema:', error);
    
    // Log de erro crítico
    const errorLogEntry = {
      job_id: null,
      status: 'error',
      message: `Erro crítico na ativação completa do sistema: ${error.message}`,
      details: {
        error: error.message,
        stack: error.stack
      },
      duration_ms: Date.now()
    };

    await supabase.from('automation_logs').insert(errorLogEntry);

    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: 'Falha crítica na ativação do sistema'
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);