
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Product {
  id: string;
  title: string;
  price: number;
  original_url: string;
  marketplace: string;
  affiliate_url: string;
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  let jobId: string | null = null;

  try {
    // Registrar início do job
    const { data: job } = await supabase
      .from('automation_jobs')
      .select('id')
      .eq('job_name', 'price-monitor')
      .single();

    if (job) {
      jobId = job.id;
      await supabase
        .from('automation_jobs')
        .update({ 
          last_run: new Date().toISOString(),
          run_count: supabase.rpc('increment', { x: 1 })
        })
        .eq('id', jobId);
    }

    // Buscar produtos ativos para monitoramento
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, price, original_url, marketplace, affiliate_url, last_price_check')
      .eq('status', 'active')
      .lt('last_price_check', new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()) // 4 horas atrás
      .limit(50); // Processar em lotes

    if (productsError) {
      throw new Error(`Erro ao buscar produtos: ${productsError.message}`);
    }

    if (!products || products.length === 0) {
      const message = "Nenhum produto precisa de atualização de preço";
      
      if (jobId) {
        await supabase.from('automation_logs').insert({
          job_id: jobId,
          status: 'success',
          message,
          duration_ms: Date.now() - startTime
        });
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message,
        processed: 0
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let updatedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Processar cada produto
    for (const product of products) {
      try {
        // Chamar função de scraping para atualizar preço
        const scrapingResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/product-scraper`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`
          },
          body: JSON.stringify({ 
            url: product.original_url,
            product_id: product.id,
            update_existing: true
          })
        });

        if (scrapingResponse.ok) {
          const scrapingData = await scrapingResponse.json();
          
          // Verificar se houve mudança significativa de preço (>5%)
          const oldPrice = product.price;
          const newPrice = scrapingData.price || oldPrice;
          const priceChange = Math.abs((newPrice - oldPrice) / oldPrice) * 100;

          if (priceChange >= 5) {
            // Enviar alerta de mudança de preço significativa
            await supabase.from('email_queue').insert({
              to_email: 'admin@7hy.shop', // Email do administrador
              subject: `Alerta: Mudança de preço significativa - ${product.title}`,
              html_content: `
                <h2>Mudança de Preço Detectada</h2>
                <p><strong>Produto:</strong> ${product.title}</p>
                <p><strong>Preço anterior:</strong> R$ ${oldPrice.toFixed(2)}</p>
                <p><strong>Preço atual:</strong> R$ ${newPrice.toFixed(2)}</p>
                <p><strong>Variação:</strong> ${priceChange.toFixed(1)}%</p>
                <p><strong>Marketplace:</strong> ${product.marketplace}</p>
                <a href="${product.affiliate_url}" target="_blank">Ver produto</a>
              `,
              template_name: 'price_alert'
            });
          }

          updatedCount++;
        } else {
          errorCount++;
          errors.push(`${product.title}: Erro no scraping`);
        }
      } catch (error) {
        errorCount++;
        errors.push(`${product.title}: ${error.message}`);
        console.error(`Erro ao processar produto ${product.id}:`, error);
      }
    }

    const duration = Date.now() - startTime;
    const message = `Processados ${products.length} produtos. Atualizados: ${updatedCount}, Erros: ${errorCount}`;

    // Registrar resultado do job
    if (jobId) {
      await supabase.from('automation_logs').insert({
        job_id: jobId,
        status: errorCount === 0 ? 'success' : 'partial_success',
        message,
        details: { 
          processed: products.length,
          updated: updatedCount,
          errors: errorCount,
          error_details: errors.slice(0, 10) // Primeiros 10 erros
        },
        duration_ms: duration
      });

      if (errorCount > 0) {
        await supabase
          .from('automation_jobs')
          .update({ 
            error_count: supabase.rpc('increment', { x: errorCount }),
            last_error: errors[0] || 'Erros múltiplos'
          })
          .eq('id', jobId);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message,
      processed: products.length,
      updated: updatedCount,
      errors: errorCount
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error('Erro no monitoramento de preços:', error);
    
    const duration = Date.now() - startTime;
    const errorMessage = error.message;

    if (jobId) {
      await supabase.from('automation_logs').insert({
        job_id: jobId,
        status: 'error',
        message: errorMessage,
        duration_ms: duration
      });

      await supabase
        .from('automation_jobs')
        .update({ 
          error_count: supabase.rpc('increment', { x: 1 }),
          last_error: errorMessage
        })
        .eq('id', jobId);
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
