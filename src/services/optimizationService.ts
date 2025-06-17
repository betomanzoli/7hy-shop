
import { supabase } from "@/integrations/supabase/client";

interface OptimizationReport {
  affiliate_links: {
    total_products: number;
    optimized_links: number;
    missing_affiliate_codes: string[];
    optimization_rate: number;
  };
  seo: {
    products_with_meta: number;
    missing_meta_descriptions: number;
    missing_structured_data: number;
    seo_score: number;
  };
  performance: {
    total_clicks: number;
    conversion_rate: number;
    estimated_commissions: number;
    top_performing_products: Array<{
      id: string;
      title: string;
      clicks: number;
      marketplace: string;
    }>;
  };
}

export class OptimizationService {
  static async generateReport(): Promise<OptimizationReport> {
    try {
      // Buscar todos os produtos ativos
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;

      const totalProducts = products?.length || 0;
      
      // Verificar otimização de links de afiliado
      const optimizedLinks = products?.filter(product => 
        this.isAffiliateOptimized(product.affiliate_url, product.marketplace)
      ).length || 0;

      const missingAffiliateCodes = products?.filter(product => 
        !this.isAffiliateOptimized(product.affiliate_url, product.marketplace)
      ).map(product => product.id) || [];

      // Verificar SEO
      const productsWithMeta = products?.filter(product => 
        product.meta_title && product.meta_description
      ).length || 0;

      const missingMetaDescriptions = totalProducts - productsWithMeta;

      // Buscar dados de analytics
      const { data: clicks } = await supabase
        .from('affiliate_clicks')
        .select('*')
        .gte('created_at', this.getLastMonthDate());

      const totalClicks = clicks?.length || 0;
      const estimatedConversions = Math.floor(totalClicks * 0.03); // 3% conversão
      const estimatedCommissions = estimatedConversions * 50 * 0.05; // R$ 50 ticket médio, 5% comissão

      // Produtos com melhor performance
      const topPerformingProducts = products
        ?.sort((a, b) => (b.click_count || 0) - (a.click_count || 0))
        .slice(0, 5)
        .map(product => ({
          id: product.id,
          title: product.title,
          clicks: product.click_count || 0,
          marketplace: product.marketplace
        })) || [];

      return {
        affiliate_links: {
          total_products: totalProducts,
          optimized_links: optimizedLinks,
          missing_affiliate_codes: missingAffiliateCodes,
          optimization_rate: totalProducts > 0 ? (optimizedLinks / totalProducts) * 100 : 0
        },
        seo: {
          products_with_meta: productsWithMeta,
          missing_meta_descriptions: missingMetaDescriptions,
          missing_structured_data: totalProducts - productsWithMeta, // Simplificado
          seo_score: totalProducts > 0 ? (productsWithMeta / totalProducts) * 100 : 0
        },
        performance: {
          total_clicks: totalClicks,
          conversion_rate: totalClicks > 0 ? (estimatedConversions / totalClicks) * 100 : 0,
          estimated_commissions: estimatedCommissions,
          top_performing_products: topPerformingProducts
        }
      };

    } catch (error) {
      console.error('Erro ao gerar relatório de otimização:', error);
      throw error;
    }
  }

  static async optimizeAffiliateLinks(): Promise<number> {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;

      let optimizedCount = 0;
      const affiliateIds = {
        amazon: '7hy01-20',
        shopee: '18357850294'
      };

      for (const product of products || []) {
        if (!this.isAffiliateOptimized(product.affiliate_url, product.marketplace)) {
          const optimizedUrl = this.optimizeAffiliateUrl(
            product.affiliate_url, 
            product.marketplace, 
            affiliateIds
          );

          const { error: updateError } = await supabase
            .from('products')
            .update({ affiliate_url: optimizedUrl })
            .eq('id', product.id);

          if (!updateError) {
            optimizedCount++;
          }
        }
      }

      return optimizedCount;
    } catch (error) {
      console.error('Erro ao otimizar links de afiliado:', error);
      throw error;
    }
  }

  static async updateSEOMetadata(): Promise<number> {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .or('meta_title.is.null,meta_description.is.null');

      if (error) throw error;

      let updatedCount = 0;

      for (const product of products || []) {
        const metaTitle = `${product.title} - Melhor Preço R$ ${product.price} | 7hy Shop`;
        const metaDescription = `Compre ${product.title} por R$ ${product.price} na ${product.marketplace}. Melhor preço garantido! Ofertas imperdíveis no 7hy Shop.`;

        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            meta_title: metaTitle.substring(0, 60), 
            meta_description: metaDescription.substring(0, 160) 
          })
          .eq('id', product.id);

        if (!updateError) {
          updatedCount++;
        }
      }

      return updatedCount;
    } catch (error) {
      console.error('Erro ao atualizar metadados SEO:', error);
      throw error;
    }
  }

  private static isAffiliateOptimized(url: string, marketplace: string): boolean {
    const affiliateIds = {
      amazon: '7hy01-20',
      shopee: '18357850294'
    };

    const affiliateId = affiliateIds[marketplace as keyof typeof affiliateIds];
    if (!affiliateId) return false;

    if (marketplace === 'amazon') {
      return url.includes(`tag=${affiliateId}`);
    } else if (marketplace === 'shopee') {
      return url.includes(`smtt=${affiliateId}`);
    }

    return false;
  }

  private static optimizeAffiliateUrl(
    url: string, 
    marketplace: string, 
    affiliateIds: Record<string, string>
  ): string {
    const affiliateId = affiliateIds[marketplace];
    if (!affiliateId) return url;

    try {
      const urlObj = new URL(url);

      if (marketplace === 'amazon') {
        urlObj.searchParams.set('tag', affiliateId);
      } else if (marketplace === 'shop`ee') {
        urlObj.searchParams.set('smtt', affiliateId);
      }

      return urlObj.toString();
    } catch {
      // Se a URL for inválida, adicionar parâmetros manualmente
      const separator = url.includes('?') ? '&' : '?';
      const param = marketplace === 'amazon' ? `tag=${affiliateId}` : `smtt=${affiliateId}`;
      return `${url}${separator}${param}`;
    }
  }

  private static getLastMonthDate(): string {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString();
  }
}
