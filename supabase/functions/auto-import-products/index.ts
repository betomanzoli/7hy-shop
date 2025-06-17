
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// URLs de produtos populares para importação automática
const POPULAR_PRODUCTS = {
  amazon: [
    'https://www.amazon.com.br/dp/B08N5WRWNW', // Echo Dot
    'https://www.amazon.com.br/dp/B07PDHSJ9B', // Fire TV Stick
    'https://www.amazon.com.br/dp/B08C1W5N87', // Kindle
  ],
  shopee: [
    'https://shopee.com.br/Smartphone-Android-128GB-RAM-4GB-Dual-SIM-i.123.456789',
    'https://shopee.com.br/Fone-Bluetooth-Sem-Fio-TWS-i.234.567890',
  ]
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      category = 'all',
      limit = 10,
      force_update = false 
    } = await req.json();

    console.log(`Iniciando importação automática: categoria=${category}, limite=${limit}`);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const results = {
      imported: 0,
      updated: 0,
      errors: 0,
      details: [] as any[]
    };

    // Importar produtos populares
    const allUrls = [
      ...POPULAR_PRODUCTS.amazon.slice(0, Math.ceil(limit / 2)),
      ...POPULAR_PRODUCTS.shopee.slice(0, Math.floor(limit / 2))
    ];

    for (const url of allUrls) {
      try {
        // Verificar se o produto já existe
        const marketplace = detectMarketplace(url);
        const marketplaceId = extractMarketplaceId(url, marketplace);
        
        const { data: existingProduct } = await supabase
          .from('products')
          .select('id, updated_at')
          .eq('marketplace_id', marketplaceId)
          .eq('marketplace', marketplace)
          .single();

        // Se existe e não forçar atualização, pular
        if (existingProduct && !force_update) {
          console.log(`Produto já existe: ${marketplaceId}`);
          continue;
        }

        // Chamar o scraper
        const scrapingResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/product-scraper`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
          },
          body: JSON.stringify({ url, save_to_db: true })
        });

        if (scrapingResponse.ok) {
          const productData = await scrapingResponse.json();
          
          if (existingProduct) {
            results.updated++;
            results.details.push({
              action: 'updated',
              product: productData.title,
              marketplace: productData.marketplace
            });
          } else {
            results.imported++;
            results.details.push({
              action: 'imported',
              product: productData.title,
              marketplace: productData.marketplace
            });
          }
        } else {
          throw new Error(`Erro no scraping: ${scrapingResponse.status}`);
        }

        // Aguardar um pouco entre requisições
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`Erro ao processar ${url}:`, error);
        results.errors++;
        results.details.push({
          action: 'error',
          url,
          error: error.message
        });
      }
    }

    // Atualizar estatísticas do sistema
    await supabase
      .from('system_settings')
      .upsert({
        key: 'last_auto_import',
        value: {
          timestamp: new Date().toISOString(),
          results
        },
        description: 'Última execução da importação automática'
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Importação concluída: ${results.imported} novos, ${results.updated} atualizados, ${results.errors} erros`,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro na importação automática:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Erro na importação automática', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function detectMarketplace(url: string): 'amazon' | 'shopee' | 'mercadolivre' {
  const domain = new URL(url).hostname.toLowerCase();
  
  if (domain.includes('amazon')) return 'amazon';
  if (domain.includes('shopee')) return 'shopee';
  if (domain.includes('mercadolivre') || domain.includes('mercadolibre')) return 'mercadolivre';
  
  return 'amazon';
}

function extractMarketplaceId(url: string, marketplace: string): string {
  const patterns: Record<string, RegExp> = {
    amazon: /\/([A-Z0-9]{10})(?:[/?]|$)/,
    shopee: /\.(\d+)\.(\d+)(?:\?|$)/,
    mercadolivre: /\/([A-Z0-9\-]+)(?:[/?]|$)/
  };

  const pattern = patterns[marketplace];
  if (pattern) {
    const match = url.match(pattern);
    if (match) {
      return marketplace === 'shopee' ? `${match[1]}.${match[2]}` : match[1];
    }
  }

  return Math.random().toString(36).substring(2, 15);
}
