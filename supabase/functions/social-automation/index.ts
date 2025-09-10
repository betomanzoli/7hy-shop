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
    console.log('Iniciando automação social...');

    // Buscar produtos em promoção (>30% desconto)
    const { data: dealProducts, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .eq('is_deal', true)
      .order('price', { ascending: true })
      .limit(5);

    if (productsError) {
      throw productsError;
    }

    // Buscar produtos mais clicados recentemente
    const { data: trendingProducts, error: trendingError } = await supabase
      .from('products')
      .select(`
        *,
        click_count
      `)
      .eq('status', 'active')
      .order('click_count', { ascending: false })
      .limit(3);

    if (trendingError) {
      console.error('Erro buscando produtos trending:', trendingError);
    }

    const posts = [];
    
    // Gerar posts para produtos em promoção
    if (dealProducts && dealProducts.length > 0) {
      for (const product of dealProducts.slice(0, 2)) { // Máximo 2 posts de promoção
        const post = await generateDealPost(product);
        if (post) posts.push(post);
      }
    }

    // Gerar posts para produtos trending
    if (trendingProducts && trendingProducts.length > 0) {
      const trendingPost = await generateTrendingPost(trendingProducts[0]);
      if (trendingPost) posts.push(trendingPost);
    }

    // Gerar post educativo semanal
    const educationalPost = await generateEducationalPost();
    if (educationalPost) posts.push(educationalPost);

    // Salvar posts gerados
    const savedPosts = [];
    for (const post of posts) {
      const { data: savedPost, error: saveError } = await supabase
        .from('system_settings')
        .insert({
          key: `social_post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          value: post,
          description: 'Post gerado automaticamente para redes sociais',
          is_public: true
        })
        .select()
        .single();

      if (!saveError && savedPost) {
        savedPosts.push(savedPost);
      }
    }

    // Simular publicação (aqui você integraria com APIs das redes sociais)
    const publishResults = await simulatePublishing(posts);

    const duration = Date.now() - startTime;

    // Log da execução
    await supabase
      .from('automation_logs')
      .insert({
        job_id: null,
        status: 'success',
        message: 'Automação social concluída',
        details: {
          posts_generated: posts.length,
          posts_saved: savedPosts.length,
          deal_products_found: dealProducts?.length || 0,
          trending_products_found: trendingProducts?.length || 0,
          publish_results: publishResults
        },
        duration_ms: duration
      });

    return new Response(JSON.stringify({
      success: true,
      message: 'Automação social concluída',
      posts_generated: posts.length,
      posts_saved: savedPosts.length,
      duration_ms: duration
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error('Erro na automação social:', error);
    
    await supabase
      .from('automation_logs')
      .insert({
        job_id: null,
        status: 'error',
        message: `Erro na automação social: ${error.message}`,
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

async function generateDealPost(product: any) {
  if (!perplexityApiKey) return null;

  try {
    const discount = product.original_price 
      ? Math.round((1 - product.price / product.original_price) * 100)
      : 0;

    const prompt = `
    Crie um post promocional para redes sociais (Instagram/Facebook) para este produto:
    
    Produto: ${product.title}
    Preço: R$ ${product.price}
    ${product.original_price ? `Preço Original: R$ ${product.original_price}` : ''}
    ${discount > 0 ? `Desconto: ${discount}%` : ''}
    Marketplace: ${product.marketplace}
    
    O post deve ser:
    - Atrativo e promocional
    - Incluir emojis relevantes
    - Mencionar o desconto se houver
    - Incluir call-to-action
    - Máximo 280 caracteres
    - Usar hashtags brasileiras de e-commerce
    
    Responda apenas com o texto do post.
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
            content: 'Você é um especialista em marketing digital e copywriting para redes sociais brasileiras.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const postText = data.choices[0]?.message?.content;
      
      return {
        type: 'deal',
        text: postText,
        product_id: product.id,
        product_title: product.title,
        product_price: product.price,
        product_image: product.image_url,
        marketplace: product.marketplace,
        discount_percentage: discount,
        scheduled_for: new Date().toISOString(),
        platforms: ['instagram', 'facebook', 'twitter']
      };
    }
  } catch (error) {
    console.error('Erro gerando post promocional:', error);
  }
  
  return null;
}

async function generateTrendingPost(product: any) {
  if (!perplexityApiKey) return null;

  try {
    const prompt = `
    Crie um post para redes sociais destacando este produto TRENDING:
    
    Produto: ${product.title}
    Preço: R$ ${product.price}
    Rating: ${product.rating || 'N/A'}
    Marketplace: ${product.marketplace}
    Cliques recentes: ${product.click_count || 0}
    
    O post deve:
    - Destacar que é tendência/popular
    - Ser envolvente e informativo
    - Incluir emojis de tendência (🔥📈⭐)
    - Máximo 280 caracteres
    - Usar hashtags #Trending #Popular
    
    Responda apenas com o texto do post.
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
            content: 'Você é um especialista em marketing digital focado em produtos trending.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 300
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const postText = data.choices[0]?.message?.content;
      
      return {
        type: 'trending',
        text: postText,
        product_id: product.id,
        product_title: product.title,
        product_price: product.price,
        product_image: product.image_url,
        marketplace: product.marketplace,
        click_count: product.click_count,
        scheduled_for: new Date().toISOString(),
        platforms: ['instagram', 'twitter', 'linkedin']
      };
    }
  } catch (error) {
    console.error('Erro gerando post trending:', error);
  }
  
  return null;
}

async function generateEducationalPost() {
  if (!perplexityApiKey) return null;

  try {
    const topics = [
      'Como comparar preços de forma inteligente',
      'Dicas para economizar em compras online',
      'Como identificar ofertas falsas',
      'Melhores épocas para comprar eletrônicos',
      'Como usar alertas de preço',
      'Diferenças entre marketplaces brasileiros'
    ];

    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    const prompt = `
    Crie um post educativo para redes sociais sobre: "${randomTopic}"
    
    O post deve:
    - Ser educativo e útil
    - Incluir 3-4 dicas práticas
    - Ser envolvente e fácil de ler
    - Incluir emojis educativos (💡📚✅)
    - Máximo 350 caracteres
    - Incluir hashtags #DicasDeCompra #Economia
    - Mencionar o 7hy-shop sutilmente
    
    Responda apenas com o texto do post.
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
            content: 'Você é um especialista em educação financeira e compras inteligentes.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 400
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const postText = data.choices[0]?.message?.content;
      
      return {
        type: 'educational',
        text: postText,
        topic: randomTopic,
        scheduled_for: new Date().toISOString(),
        platforms: ['instagram', 'facebook', 'linkedin', 'twitter']
      };
    }
  } catch (error) {
    console.error('Erro gerando post educativo:', error);
  }
  
  return null;
}

async function simulatePublishing(posts: any[]) {
  // Esta função simula a publicação nas redes sociais
  // Em uma implementação real, você integraria com APIs do Instagram, Facebook, Twitter, etc.
  
  const results = {
    instagram: { success: 0, failed: 0 },
    facebook: { success: 0, failed: 0 },
    twitter: { success: 0, failed: 0 },
    linkedin: { success: 0, failed: 0 }
  };

  for (const post of posts) {
    for (const platform of post.platforms || []) {
      // Simular sucesso/falha (90% sucesso)
      const success = Math.random() > 0.1;
      
      if (success) {
        results[platform].success++;
      } else {
        results[platform].failed++;
      }
    }
  }

  // Log dos resultados simulados
  console.log('Resultados da publicação simulada:', results);
  
  return results;
}

serve(handler);