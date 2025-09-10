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
    console.log('Iniciando engine de recomendações...');

    // Buscar dados de analytics dos usuários
    const { data: analytics, error: analyticsError } = await supabase
      .from('user_analytics')
      .select(`
        user_id,
        product_id,
        event_type,
        created_at,
        products:product_id (
          id,
          title,
          category_id,
          price,
          marketplace,
          rating
        )
      `)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1000);

    if (analyticsError) {
      console.error('Erro ao buscar analytics:', analyticsError);
    }

    // Buscar produtos ativos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('rating', { ascending: false });

    if (productsError) {
      throw productsError;
    }

    // Algoritmo básico de recomendação
    const recommendations = generateRecommendations(analytics || [], products || []);

    // Usar Perplexity para análise de tendências se disponível
    let trendAnalysis = null;
    if (perplexityApiKey) {
      try {
        const trendResponse = await fetch('https://api.perplexity.ai/chat/completions', {
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
                content: 'Você é um especialista em e-commerce brasileiro. Analise tendências de produtos.'
              },
              {
                role: 'user',
                content: `Quais são as principais tendências de produtos em e-commerce no Brasil para esta época do ano? Foque em eletrônicos, moda, casa e beleza.`
              }
            ],
            temperature: 0.2,
            max_tokens: 500
          }),
        });

        if (trendResponse.ok) {
          const trendData = await trendResponse.json();
          trendAnalysis = trendData.choices[0]?.message?.content;
        }
      } catch (error) {
        console.error('Erro ao buscar tendências:', error);
      }
    }

    // Salvar recomendações no banco
    const { error: saveError } = await supabase
      .from('system_settings')
      .upsert({
        key: 'daily_recommendations',
        value: {
          recommendations: recommendations.slice(0, 20),
          trend_analysis: trendAnalysis,
          generated_at: new Date().toISOString(),
          total_products_analyzed: products?.length || 0
        },
        description: 'Recomendações diárias geradas automaticamente',
        is_public: true
      });

    if (saveError) {
      console.error('Erro ao salvar recomendações:', saveError);
    }

    const duration = Date.now() - startTime;

    // Log da execução
    await supabase
      .from('automation_logs')
      .insert({
        job_id: null,
        status: 'success',
        message: 'Engine de recomendações executada com sucesso',
        details: {
          recommendations_generated: recommendations.length,
          products_analyzed: products?.length || 0,
          trend_analysis: !!trendAnalysis,
          users_analyzed: new Set(analytics?.map(a => a.user_id)).size || 0
        },
        duration_ms: duration
      });

    return new Response(JSON.stringify({
      success: true,
      message: 'Recomendações geradas com sucesso',
      recommendations_count: recommendations.length,
      trend_analysis: !!trendAnalysis,
      duration_ms: duration
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error('Erro na engine de recomendações:', error);
    
    await supabase
      .from('automation_logs')
      .insert({
        job_id: null,
        status: 'error',
        message: `Erro na engine de recomendações: ${error.message}`,
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

function generateRecommendations(analytics: any[], products: any[]) {
  // Algoritmo simples de recomendação baseado em:
  // 1. Popularidade (views/clicks)
  // 2. Rating
  // 3. Categoria de interesse do usuário
  // 4. Novidade

  const productScores = products.map(product => {
    let score = 0;
    
    // Score por rating
    score += (product.rating || 0) * 2;
    
    // Score por popularidade
    const productAnalytics = analytics.filter(a => a.product_id === product.id);
    score += productAnalytics.length * 0.5;
    
    // Score por ser featured
    if (product.is_featured) score += 1;
    
    // Score por preço (produtos mais baratos são mais atrativos)
    if (product.price < 100) score += 1;
    if (product.price < 50) score += 0.5;
    
    // Score por marketplace (diversificar)
    const marketplaceBonus = {
      'shopee': 1.2,
      'amazon': 1.1,
      'mercadolivre': 1.0
    };
    score *= marketplaceBonus[product.marketplace] || 1;

    return {
      ...product,
      recommendation_score: score
    };
  });

  return productScores
    .sort((a, b) => b.recommendation_score - a.recommendation_score)
    .slice(0, 50);
}

serve(handler);