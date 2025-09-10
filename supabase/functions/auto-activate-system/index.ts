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
    const startTime = Date.now();
    console.log('🚀 Iniciando ativação automática completa do sistema...');

    const results = [];
    let totalSuccess = 0;
    let totalErrors = 0;

    // Configurar IDs de afiliado - usar existentes se disponíveis, senão usar defaults
    let affiliateConfig = {
      amazon_associate_id: "7hy01-20", // Default fallback
      shopee_affiliate_id: "18357850294", // Default fallback
      configured_at: new Date().toISOString()
    };

    // Buscar credenciais existentes primeiro
    try {
      const { data: existingCreds } = await supabase
        .from('marketplace_credentials')
        .select('marketplace_id, credentials')
        .in('marketplace_id', ['amazon', 'shopee']);

      if (existingCreds && existingCreds.length > 0) {
        existingCreds.forEach((cred: any) => {
          if (cred.marketplace_id === 'amazon' && cred.credentials?.associateTag) {
            affiliateConfig.amazon_associate_id = cred.credentials.associateTag;
            console.log('Usando ID Amazon existente:', cred.credentials.associateTag);
          } else if (cred.marketplace_id === 'shopee' && cred.credentials?.affiliateId) {
            affiliateConfig.shopee_affiliate_id = cred.credentials.affiliateId;
            console.log('Usando ID Shopee existente:', cred.credentials.affiliateId);
          }
        });
      } else {
        console.log('Nenhuma credencial existente encontrada, usando defaults');
      }
    } catch (error) {
      console.error('Erro ao buscar credenciais existentes:', error);
      console.log('Usando configuração padrão');
    }

    // 1. Garantir que credenciais individuais por marketplace existem
    try {
      // Salvar/atualizar credenciais Amazon
      const { error: amazonError } = await supabase
        .from('marketplace_credentials')
        .upsert({
          marketplace_id: 'amazon',
          credentials: {
            associateTag: affiliateConfig.amazon_associate_id
          }
        }, { onConflict: 'marketplace_id' });

      if (amazonError) throw amazonError;

      // Salvar/atualizar credenciais Shopee  
      const { error: shopeeError } = await supabase
        .from('marketplace_credentials')
        .upsert({
          marketplace_id: 'shopee',
          credentials: {
            affiliateId: affiliateConfig.shopee_affiliate_id
          }
        }, { onConflict: 'marketplace_id' });

      if (shopeeError) throw shopeeError;

      // Também manter o registro de configuração do sistema para compatibilidade
      const { error: configError } = await supabase
        .from('marketplace_credentials')
        .upsert({
          marketplace_id: 'system_config',
          credentials: affiliateConfig
        }, { onConflict: 'marketplace_id' });

      if (configError) throw configError;
      
      results.push({ 
        step: 'Configurar IDs de Afiliado', 
        status: 'success', 
        data: affiliateConfig 
      });
      totalSuccess++;
      console.log('✅ IDs de afiliado configurados');
    } catch (error) {
      results.push({ 
        step: 'Configurar IDs de Afiliado', 
        status: 'error', 
        error: error.message 
      });
      totalErrors++;
      console.error('❌ Erro ao configurar IDs:', error);
    }

    // 2. Executar setup-cron-jobs
    try {
      console.log('🔧 Executando setup-cron-jobs...');
      const cronResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/setup-cron-jobs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      const cronResult = await cronResponse.json();
      
      if (cronResponse.ok) {
        results.push({ 
          step: 'Setup Cron Jobs', 
          status: 'success', 
          data: cronResult 
        });
        totalSuccess++;
        console.log('✅ Cron jobs configurados');
      } else {
        throw new Error(cronResult.error || 'Erro no setup-cron-jobs');
      }
    } catch (error) {
      results.push({ 
        step: 'Setup Cron Jobs', 
        status: 'error', 
        error: error.message 
      });
      totalErrors++;
      console.error('❌ Erro no cron jobs:', error);
    }

    // 3. Executar import-shopee-products
    try {
      console.log('📦 Importando produtos Shopee...');
      const importResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/import-shopee-products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ affiliate_id: affiliateConfig.shopee_affiliate_id })
      });

      const importResult = await importResponse.json();
      
      if (importResponse.ok) {
        results.push({ 
          step: 'Import Produtos Shopee', 
          status: 'success', 
          data: importResult 
        });
        totalSuccess++;
        console.log('✅ Produtos importados');
      } else {
        throw new Error(importResult.error || 'Erro no import de produtos');
      }
    } catch (error) {
      results.push({ 
        step: 'Import Produtos Shopee', 
        status: 'error', 
        error: error.message 
      });
      totalErrors++;
      console.error('❌ Erro no import:', error);
    }

    // 4. Executar analytics-processor para dados iniciais
    try {
      console.log('📊 Processando analytics iniciais...');
      const analyticsResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/analytics-processor`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      const analyticsResult = await analyticsResponse.json();
      
      if (analyticsResponse.ok) {
        results.push({ 
          step: 'Analytics Iniciais', 
          status: 'success', 
          data: analyticsResult 
        });
        totalSuccess++;
        console.log('✅ Analytics processados');
      } else {
        throw new Error(analyticsResult.error || 'Erro no analytics');
      }
    } catch (error) {
      results.push({ 
        step: 'Analytics Iniciais', 
        status: 'error', 
        error: error.message 
      });
      totalErrors++;
      console.error('❌ Erro no analytics:', error);
    }

    // 5. Executar recommendation-engine
    try {
      console.log('🤖 Gerando recomendações iniciais...');
      const recResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/recommendation-engine`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      const recResult = await recResponse.json();
      
      if (recResponse.ok) {
        results.push({ 
          step: 'Recomendações Iniciais', 
          status: 'success', 
          data: recResult 
        });
        totalSuccess++;
        console.log('✅ Recomendações geradas');
      } else {
        throw new Error(recResult.error || 'Erro nas recomendações');
      }
    } catch (error) {
      results.push({ 
        step: 'Recomendações Iniciais', 
        status: 'error', 
        error: error.message 
      });
      totalErrors++;
      console.error('❌ Erro nas recomendações:', error);
    }

    // 6. Executar system-monitor para verificar saúde
    try {
      console.log('🔍 Verificando saúde do sistema...');
      const monitorResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/system-monitor`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      const monitorResult = await monitorResponse.json();
      
      if (monitorResponse.ok) {
        results.push({ 
          step: 'Verificação do Sistema', 
          status: 'success', 
          data: monitorResult 
        });
        totalSuccess++;
        console.log('✅ Sistema verificado');
      } else {
        throw new Error(monitorResult.error || 'Erro no monitor');
      }
    } catch (error) {
      results.push({ 
        step: 'Verificação do Sistema', 
        status: 'error', 
        error: error.message 
      });
      totalErrors++;
      console.error('❌ Erro no monitor:', error);
    }

    const duration = Date.now() - startTime;
    const successRate = Math.round((totalSuccess / (totalSuccess + totalErrors)) * 100);

    // Log da execução
    await supabase
      .from('automation_logs')
      .insert({
        job_id: null,
        status: successRate >= 80 ? 'success' : 'partial_success',
        message: `Ativação automática completa do sistema`,
        details: {
          total_steps: results.length,
          successful_steps: totalSuccess,
          failed_steps: totalErrors,
          success_rate: successRate,
          affiliate_config: affiliateConfig,
          execution_results: results
        },
        duration_ms: duration
      });

    console.log(`🎉 Ativação concluída! Sucesso: ${totalSuccess}/${results.length} (${successRate}%)`);

    return new Response(JSON.stringify({
      success: true,
      message: `Sistema ativado com sucesso! ${totalSuccess}/${results.length} passos concluídos`,
      affiliate_config: affiliateConfig,
      execution_results: results,
      summary: {
        total_steps: results.length,
        successful_steps: totalSuccess,
        failed_steps: totalErrors,
        success_rate: successRate,
        duration_ms: duration
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error('💥 Erro crítico na ativação:', error);
    
    await supabase
      .from('automation_logs')
      .insert({
        job_id: null,
        status: 'error',
        message: `Erro crítico na ativação automática: ${error.message}`,
        details: { error: error.message },
        duration_ms: Date.now() - Date.now()
      });

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