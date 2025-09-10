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

// Produtos da Shopee para importar
const shopeeProducts = [
  {
    title: 'Fone De Ouvido Bluetooth Xiaomi Redmi Buds 4 Lite TWS',
    price: 84.99,
    marketplace: 'shopee',
    image_url: 'https://down-br.img.susercontent.com/file/br-11134207-7qukw-liu9vk4qlsz5bb',
    rating: 4.8,
    original_url: 'https://s.shopee.com.br/5puqNwGojV',
    affiliate_url: 'https://s.shopee.com.br/5puqNwGojV',
    marketplace_id: '18357850294',
    category: 'electronics',
    is_featured: true,
    short_description: 'Fone de ouvido Bluetooth TWS com qualidade premium'
  },
  {
    title: 'Headset Gamer P3 Haiz Compatível com PS4/PS5/XBOX/PC/Celular',
    price: 58.49,
    marketplace: 'shopee',
    image_url: 'https://down-br.img.susercontent.com/file/br-11134207-7r98p-lq5p1qp2wdm48b',
    rating: 4.5,
    original_url: 'https://s.shopee.com.br/5VHzzLHc6C',
    affiliate_url: 'https://s.shopee.com.br/5VHzzLHc6C',
    marketplace_id: '18357850294',
    category: 'electronics',
    is_featured: false,
    short_description: 'Headset gamer universal compatível com múltiplas plataformas'
  },
  {
    title: 'Smart TV LED 32" Philco Smart Netflix YouTube HD PTV32G70RCH',
    price: 999.00,
    marketplace: 'shopee',
    image_url: 'https://down-br.img.susercontent.com/file/br-11134201-7r98p-lpj6kgdawz417f',
    rating: 4.7,
    original_url: 'https://s.shopee.com.br/20i7ov4Cj2',
    affiliate_url: 'https://s.shopee.com.br/20i7ov4Cj2',
    marketplace_id: '18357850294',
    category: 'electronics',
    is_featured: true,
    short_description: 'Smart TV 32" com Netflix, YouTube e resolução HD'
  },
  {
    title: 'Suporte Magnético Veicular Para Celular Smartphone',
    price: 15.99,
    marketplace: 'shopee',
    image_url: 'https://down-br.img.susercontent.com/file/7af4a3c8f40142c44096136c92b0df5d',
    rating: 4.6,
    original_url: 'https://s.shopee.com.br/VtK2BIJIG',
    affiliate_url: 'https://s.shopee.com.br/VtK2BIJIG',
    marketplace_id: '18357850294',
    category: 'electronics',
    is_featured: false,
    short_description: 'Suporte magnético prático para uso no carro'
  },
  {
    title: 'Calça Jeans Feminina Mom Cintura Alta Destroyed',
    price: 89.90,
    marketplace: 'shopee',
    image_url: 'https://down-br.img.susercontent.com/file/br-11134201-7r98s-lqfqtbcr6l7m12',
    rating: 4.5,
    original_url: 'https://s.shopee.com.br/7KjeAmzsqz',
    affiliate_url: 'https://s.shopee.com.br/7KjeAmzsqz',
    marketplace_id: '18357850294',
    category: 'fashion',
    is_featured: false,
    short_description: 'Calça jeans mom destroyed, tendência da moda feminina'
  },
  {
    title: 'Conjunto Feminino Moda Verão Blusa e Short Lançamento',
    price: 56.90,
    marketplace: 'shopee',
    image_url: 'https://down-br.img.susercontent.com/file/sg-11134201-7rbmk-llx1q2q3jgpja0',
    rating: 4.3,
    original_url: 'https://s.shopee.com.br/4fiszua1ul',
    affiliate_url: 'https://s.shopee.com.br/4fiszua1ul',
    marketplace_id: '18357850294',
    category: 'fashion',
    is_featured: true,
    short_description: 'Conjunto feminino verão, peça em lançamento'
  },
  {
    title: 'Vestido Midi Feminino Moda Verão Com Cinto e Babado',
    price: 68.90,
    marketplace: 'shopee',
    image_url: 'https://down-br.img.susercontent.com/file/br-11134207-7r98r-lpv4emn6mxu49f',
    rating: 4.5,
    original_url: 'https://s.shopee.com.br/7fMUZTWCG3',
    affiliate_url: 'https://s.shopee.com.br/7fMUZTWCG3',
    marketplace_id: '18357850294',
    category: 'fashion',
    is_featured: false,
    short_description: 'Vestido midi com cinto e babado, elegante e versátil'
  },
  {
    title: 'Conjunto de Panelas 5 Peças Antiaderente com Tampa de Vidro',
    price: 139.90,
    marketplace: 'shopee',
    image_url: 'https://down-br.img.susercontent.com/file/sg-11134201-7rbm1-ln9rjthhkgm66c',
    rating: 4.7,
    original_url: 'https://s.shopee.com.br/x3RQTNCw',
    affiliate_url: 'https://s.shopee.com.br/x3RQTNCw',
    marketplace_id: '18357850294',
    category: 'home',
    is_featured: true,
    short_description: 'Conjunto completo de panelas antiaderente'
  },
  {
    title: 'Jogo de Cama Casal 4 Peças 150 Fios Premium Lençol Fronha',
    price: 59.90,
    marketplace: 'shopee',
    image_url: 'https://down-br.img.susercontent.com/file/br-11134207-7qukw-livdl0xt0j4b46',
    rating: 4.4,
    original_url: 'https://s.shopee.com.br/1qOhcnr7hN',
    affiliate_url: 'https://s.shopee.com.br/1qOhcnr7hN',
    marketplace_id: '18357850294',
    category: 'home',
    is_featured: false,
    short_description: 'Jogo de cama premium 150 fios, máxima qualidade'
  },
  {
    title: 'Luminária de Mesa LED com 3 Níveis de Brilho e Recarregável',
    price: 38.90,
    marketplace: 'shopee',
    image_url: 'https://down-br.img.susercontent.com/file/br-11134201-7r98o-lp48eapiqwdc5d',
    rating: 4.6,
    original_url: 'https://s.shopee.com.br/4fit01Jvzh',
    affiliate_url: 'https://s.shopee.com.br/4fit01Jvzh',
    marketplace_id: '18357850294',
    category: 'home',
    is_featured: false,
    short_description: 'Luminária LED recarregável com controle de brilho'
  }
];

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Iniciando importação de produtos da Shopee...');

    // Buscar IDs de afiliado dinâmicos
    let shopeeAffiliateId = '18357850294'; // Default fallback
    
    try {
      const { data: credentials } = await supabase
        .from('marketplace_credentials')
        .select('credentials')
        .eq('marketplace_id', 'shopee')
        .single();

      if (credentials?.credentials?.affiliateId) {
        shopeeAffiliateId = credentials.credentials.affiliateId;
        console.log('ID de afiliado Shopee carregado:', shopeeAffiliateId);
      } else {
        console.log('Usando ID de afiliado Shopee padrão:', shopeeAffiliateId);
      }
    } catch (error) {
      console.error('Erro ao buscar credenciais Shopee, usando default:', error);
    }

    // Primeiro, vamos criar as categorias se não existirem
    const categories = [
      { name: 'Eletrônicos', slug: 'electronics' },
      { name: 'Moda', slug: 'fashion' },
      { name: 'Casa & Decoração', slug: 'home' },
      { name: 'Beleza', slug: 'beauty' },
      { name: 'Acessórios', slug: 'accessories' },
      { name: 'Esportes', slug: 'sports' }
    ];

    // Inserir categorias (usando upsert para evitar duplicatas)
    for (const category of categories) {
      const { error: categoryError } = await supabase
        .from('categories')
        .upsert(category, { onConflict: 'slug' });
      
      if (categoryError) {
        console.error('Erro ao inserir categoria:', categoryError);
      }
    }

    // Buscar categorias criadas para obter IDs
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('id, slug');

    if (categoriesError) {
      throw categoriesError;
    }

    const categoryMap = categoriesData.reduce((acc: any, cat: any) => {
      acc[cat.slug] = cat.id;
      return acc;
    }, {});

    // Preparar produtos para inserção com IDs de afiliado dinâmicos
    const productsToInsert = shopeeProducts.map(product => {
      // Otimizar URL de afiliado com ID dinâmico
      let affiliateUrl = product.original_url;
      if (!product.original_url.includes('smtt=')) {
        const separator = product.original_url.includes('?') ? '&' : '?';
        affiliateUrl = `${product.original_url}${separator}smtt=${shopeeAffiliateId}`;
      }

      return {
        title: product.title,
        price: product.price,
        original_price: null,
        marketplace: product.marketplace,
        image_url: product.image_url,
        rating: product.rating,
        original_url: product.original_url,
        affiliate_url: affiliateUrl,
        marketplace_id: product.marketplace_id,
        category_id: categoryMap[product.category] || null,
        is_featured: product.is_featured,
        short_description: product.short_description,
        description: `${product.short_description}. Produto disponível na Shopee com entrega rápida e garantia.`,
        currency: 'BRL',
        status: 'active',
        is_deal: false,
        is_in_stock: true,
        review_count: Math.floor(Math.random() * 500) + 50, // Reviews simuladas
        sales_count: Math.floor(Math.random() * 1000) + 100, // Vendas simuladas
        tags: JSON.stringify([product.category, 'shopee', 'promoção'])
      };
    });

    // Inserir produtos (usando upsert para evitar duplicatas baseado na constraint unique_marketplace_product)
    const { data: insertedProducts, error: insertError } = await supabase
      .from('products')
      .upsert(productsToInsert, { onConflict: 'marketplace,marketplace_id' })
      .select();

    if (insertError) {
      throw insertError;
    }

    console.log(`${insertedProducts?.length || 0} produtos importados com sucesso`);

    // Atualizar job de automação
    const { error: jobError } = await supabase
      .from('automation_jobs')
      .update({
        last_run: new Date().toISOString(),
        run_count: 1,
        next_run: null
      })
      .eq('job_name', 'import-shopee-products');

    // Log da execução
    await supabase
      .from('automation_logs')
      .insert({
        job_id: null,
        status: 'success',
        message: `Importação de produtos da Shopee concluída`,
        details: {
          products_imported: insertedProducts?.length || 0,
          categories_created: categories.length
        },
        duration_ms: Date.now() - Date.now() // Placeholder
      });

    return new Response(JSON.stringify({
      success: true,
      message: 'Produtos importados com sucesso',
      products_imported: insertedProducts?.length || 0,
      categories_created: categories.length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error('Erro na importação:', error);
    
    // Log do erro
    await supabase
      .from('automation_logs')
      .insert({
        job_id: null,
        status: 'error',
        message: `Erro na importação de produtos: ${error.message}`,
        details: { error: error.message },
        duration_ms: 0
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