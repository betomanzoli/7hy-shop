
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProductFromDB {
  id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  price: number;
  original_price: number | null;
  currency: string;
  affiliate_url: string;
  image_url: string | null;
  marketplace: 'amazon' | 'shopee' | 'mercadolivre';
  rating: number | null;
  review_count: number | null;
  is_featured: boolean | null;
  is_deal: boolean | null;
  seller_name: string | null;
  category_id: string | null;
  categories: {
    name: string;
    slug: string;
  } | null;
}

export interface UseProductsOptions {
  searchTerm?: string;
  marketplace?: 'amazon' | 'shopee' | 'mercadolivre' | null;
  categoryId?: string | null;
  featuredOnly?: boolean;
  limit?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<ProductFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('products')
        .select(`
          id,
          title,
          description,
          short_description,
          price,
          original_price,
          currency,
          affiliate_url,
          image_url,
          marketplace,
          rating,
          review_count,
          is_featured,
          is_deal,
          seller_name,
          category_id,
          categories:category_id (
            name,
            slug
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Apply filters
      if (options.marketplace) {
        query = query.eq('marketplace', options.marketplace);
      }

      if (options.categoryId) {
        query = query.eq('category_id', options.categoryId);
      }

      if (options.featuredOnly) {
        query = query.eq('is_featured', true);
      }

      if (options.searchTerm && options.searchTerm.trim()) {
        query = query.textSearch('search_vector', options.searchTerm.trim(), {
          type: 'websearch',
          config: 'portuguese'
        });
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      setProducts(data || []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message);
      toast({
        title: "Erro ao carregar produtos",
        description: "Ocorreu um erro ao buscar os produtos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [options.searchTerm, options.marketplace, options.categoryId, options.featuredOnly, options.limit]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  };
}
