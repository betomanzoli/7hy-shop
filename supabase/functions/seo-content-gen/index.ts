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

const perplexityApiKey = Deno.env.get("PERPLEXITY_API_KEY");

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();
    console.log('Iniciando geração de conteúdo SEO...');

    if (!perplexityApiKey) {
      throw new Error('Perplexity API key não configurada');
    }

    // Buscar produtos sem meta descriptions ou com conteúdo básico
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .or('meta_description.is.null,meta_title.is.null')
      .eq('status', 'active')
      .limit(20); // Processar 20 produtos por vez

    if (productsError) {
      throw productsError;
    }

    if (!products || products.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Nenhum produto precisa de otimização SEO',
        products_processed: 0
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let processedCount = 0;
    let errorCount = 0;

    // Processar cada produto
    for (const product of products) {
      try {
        const prompt = `
        Crie conteúdo SEO otimizado para este produto de e-commerce:
        
        Título: ${product.title}
        Preço: R$ ${product.price}
        Marketplace: ${product.marketplace}
        Categoria: ${product.category_id || 'Geral'}
        
        Por favor, gere:
        1. Meta título (máximo 60 caracteres)
        2. Meta descrição (máximo 160 caracteres)
        3. Descrição otimizada (2-3 parágrafos)
        
        Use palavras-chave relevantes para e-commerce brasileiro e foque em conversão.
        Responda APENAS em formato JSON com as chaves: meta_title, meta_description, description
        `;

        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${perplexityApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [
              {
                role: 'system',
                content: 'Você é um especialista em SEO para e-commerce brasileiro. Sempre responda em JSON válido.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.3,
            max_tokens: 800
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0]?.message?.content;
          
          try {
            const seoContent = JSON.parse(content);
            
            // Atualizar produto com conteúdo SEO
            const { error: updateError } = await supabase
              .from('products')
              .update({
                meta_title: seoContent.meta_title,
                meta_description: seoContent.meta_description,
                description: seoContent.description || product.description,
                updated_at: new Date().toISOString()
              })
              .eq('id', product.id);

            if (updateError) {
              console.error(`Erro ao atualizar produto ${product.id}:`, updateError);
              errorCount++;
            } else {
              processedCount++;
            }
          } catch (parseError) {
            console.error(`Erro ao parsear resposta para produto ${product.id}:`, parseError);
            errorCount++;
          }
        } else {
          console.error(`Erro na API Perplexity para produto ${product.id}`);
          errorCount++;
        }

        // Delay para respeitar rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Erro processando produto ${product.id}:`, error);
        errorCount++;
      }
    }

    const duration = Date.now() - startTime;

    // Log da execução
    await supabase
      .from('automation_logs')
      .insert({
        job_id: null,
        status: processedCount > 0 ? 'success' : 'error',
        message: `Geração de conteúdo SEO concluída`,
        details: {
          products_processed: processedCount,
          products_with_errors: errorCount,
          total_products: products.length
        },
        duration_ms: duration
      });

    return new Response(JSON.stringify({
      success: true,
      message: `Conteúdo SEO gerado para ${processedCount} produtos`,
      products_processed: processedCount,
      products_with_errors: errorCount,
      duration_ms: duration
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error('Erro na geração de conteúdo SEO:', error);
    
    await supabase
      .from('automation_logs')
      .insert({
        job_id: null,
        status: 'error',
        message: `Erro na geração de conteúdo SEO: ${error.message}`,
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