
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProductData {
  title: string;
  price: number;
  original_price?: number;
  description?: string;
  image_url: string;
  marketplace: 'amazon' | 'shopee' | 'mercadolivre';
  marketplace_id: string;
  rating?: number;
  review_count?: number;
  is_in_stock: boolean;
  shipping_info?: {
    is_free: boolean;
    estimated_days: number;
    cost?: number;
  };
  seller_name?: string;
  seller_rating?: number;
  seller_verified?: boolean;
  specifications?: Record<string, any>;
  features?: string[];
  category?: string;
  price_history?: Array<{
    date: string;
    price: number;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, save_to_db = false } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL é obrigatória' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Scraping URL:', url);

    // Tentar usar o Flask backend primeiro (se disponível)
    let productData: ProductData | null = null;
    
    try {
      const flaskResponse = await fetch('http://localhost:5000/api/scrape-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (flaskResponse.ok) {
        productData = await flaskResponse.json();
        console.log('Produto extraído via Flask:', productData?.title);
      }
    } catch (flaskError) {
      console.log('Flask backend não disponível, usando scraping nativo...');
    }

    // Se Flask não estiver disponível, usar scraping básico
    if (!productData) {
      productData = await performBasicScraping(url);
    }

    if (!productData) {
      throw new Error('Não foi possível extrair dados do produto');
    }

    // Criar cliente Supabase para buscar IDs de afiliado
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Otimizar links de afiliado com IDs dinâmicos
    productData = await optimizeAffiliateLinks(productData, url, supabase);

    // Salvar no banco se solicitado
    if (save_to_db) {

      const { data, error } = await supabase
        .from('products')
        .insert({
          title: productData.title,
          description: productData.description || '',
          price: productData.price,
          original_price: productData.original_price,
          currency: 'BRL',
          affiliate_url: productData.affiliate_url || url,
          original_url: url,
          image_url: productData.image_url,
          marketplace: productData.marketplace,
          marketplace_id: productData.marketplace_id,
          rating: productData.rating,
          review_count: productData.review_count || 0,
          is_featured: false,
          is_deal: productData.original_price && productData.original_price > productData.price,
          seller_name: productData.seller_name,
          status: 'active',
          specifications: productData.specifications || {},
          features: productData.features || [],
          shipping_info: productData.shipping_info || {}
        });

      if (error) {
        console.error('Erro ao salvar produto:', error);
        throw new Error('Erro ao salvar produto no banco de dados');
      }

      console.log('Produto salvo no banco:', data);
    }

    return new Response(
      JSON.stringify(productData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro no scraping:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro ao processar produto', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function performBasicScraping(url: string): Promise<ProductData | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    
    // Detectar marketplace
    const marketplace = detectMarketplace(url);
    if (!marketplace) {
      throw new Error('Marketplace não suportado');
    }

    // Extrair dados básicos usando regex (implementação simplificada)
    const title = extractTitle(html, marketplace);
    const price = extractPrice(html, marketplace);
    const imageUrl = extractImage(html, marketplace);
    const marketplaceId = extractMarketplaceId(url, marketplace);

    if (!title || !price || !marketplaceId) {
      throw new Error('Dados essenciais não encontrados');
    }

    return {
      title,
      price,
      image_url: imageUrl,
      marketplace,
      marketplace_id: marketplaceId,
      is_in_stock: true,
      rating: 0,
      review_count: 0
    };

  } catch (error) {
    console.error('Erro no scraping básico:', error);
    return null;
  }
}

function detectMarketplace(url: string): 'amazon' | 'shopee' | 'mercadolivre' | null {
  const domain = new URL(url).hostname.toLowerCase();
  
  if (domain.includes('amazon')) return 'amazon';
  if (domain.includes('shopee')) return 'shopee';
  if (domain.includes('mercadolivre') || domain.includes('mercadolibre')) return 'mercadolivre';
  
  return null;
}

function extractTitle(html: string, marketplace: string): string {
  const patterns: Record<string, RegExp[]> = {
    amazon: [
      /<title[^>]*>([^<]+)/i,
      /<h1[^>]*id="productTitle"[^>]*>([^<]+)/i
    ],
    shopee: [
      /<title[^>]*>([^<]+)/i,
      /<h1[^>]*>([^<]+)/i
    ],
    mercadolivre: [
      /<title[^>]*>([^<]+)/i,
      /<h1[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)/i
    ]
  };

  const marketplacePatterns = patterns[marketplace] || patterns.amazon;
  
  for (const pattern of marketplacePatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim().replace(/\s+/g, ' ').substring(0, 200);
    }
  }
  
  return 'Produto';
}

function extractPrice(html: string, marketplace: string): number {
  const pricePatterns = [
    /R\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/g,
    /(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)(?:\s*reais?)/gi,
    /"price"[^:]*:\s*"?(\d+(?:\.\d+)?)"?/gi
  ];

  for (const pattern of pricePatterns) {
    const matches = [...html.matchAll(pattern)];
    if (matches.length > 0) {
      const priceStr = matches[0][1];
      const price = parseFloat(priceStr.replace(/\./g, '').replace(',', '.'));
      if (price > 0) {
        return price;
      }
    }
  }

  return 0;
}

function extractImage(html: string, marketplace: string): string {
  const imagePatterns = [
    /<img[^>]+src="([^"]+)"[^>]*(?:id="landingImage"|class="[^"]*product[^"]*")/i,
    /<img[^>]+class="[^"]*product[^"]*"[^>]+src="([^"]+)"/i,
    /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i
  ];

  for (const pattern of imagePatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return 'https://placehold.co/400x400?text=Produto';
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

async function optimizeAffiliateLinks(productData: ProductData, originalUrl: string, supabase: any): Promise<ProductData> {
  // Buscar IDs de afiliado dinâmicamente do banco de dados
  let affiliateIds = {
    amazon: '7hy01-20',      // Default fallback
    shopee: '18357850294'    // Default fallback
  };

  try {
    const { data: credentials } = await supabase
      .from('marketplace_credentials')
      .select('marketplace_id, credentials')
      .in('marketplace_id', ['amazon', 'shopee']);

    if (credentials && credentials.length > 0) {
      credentials.forEach((cred: any) => {
        if (cred.marketplace_id === 'amazon' && cred.credentials?.associateTag) {
          affiliateIds.amazon = cred.credentials.associateTag;
        } else if (cred.marketplace_id === 'shopee' && cred.credentials?.affiliateId) {
          affiliateIds.shopee = cred.credentials.affiliateId;
        }
      });
    }
    
    console.log('IDs de afiliado carregados:', affiliateIds);
  } catch (error) {
    console.error('Erro ao buscar IDs de afiliado, usando defaults:', error);
  }

  let optimizedUrl = originalUrl;

  if (productData.marketplace === 'amazon') {
    const url = new URL(originalUrl);
    url.searchParams.set('tag', affiliateIds.amazon);
    optimizedUrl = url.toString();
  } else if (productData.marketplace === 'shopee') {
    if (!originalUrl.includes('smtt=')) {
      const separator = originalUrl.includes('?') ? '&' : '?';
      optimizedUrl = `${originalUrl}${separator}smtt=${affiliateIds.shopee}`;
    }
  }

  console.log(`URL otimizada para ${productData.marketplace}: ${optimizedUrl}`);

  return {
    ...productData,
    affiliate_url: optimizedUrl
  };
}
