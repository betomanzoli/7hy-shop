
import React from 'react';
import { ProductFromDB } from '@/hooks/useProducts';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink } from 'lucide-react';
import { MarketplaceLogo } from '@/components/marketplace/MarketplaceLogo';
import { supabase } from '@/integrations/supabase/client';

interface ProductGridProps {
  products: ProductFromDB[];
  loading?: boolean;
}

export function ProductGridWithSupabase({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-4">
          Nenhum produto encontrado
        </p>
        <p className="text-sm text-muted-foreground">
          Tente ajustar seus filtros de busca ou volte mais tarde.
        </p>
      </div>
    );
  }

  const handleProductClick = (product: ProductFromDB) => {
    // Track click analytics
    const trackClick = async () => {
      try {
        await supabase.from('affiliate_clicks').insert({
          product_id: product.id,
          marketplace_id: product.marketplace,
          clicked_at: new Date().toISOString(),
          referrer: window.location.href
        });
      } catch (error) {
        console.error('Error tracking click:', error);
      }
    };

    trackClick();
    window.open(product.affiliate_url, '_blank');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="relative mb-4">
              {product.is_featured && (
                <Badge className="absolute top-2 left-2 z-10 bg-yellow-500 text-yellow-900">
                  Destaque
                </Badge>
              )}
              {product.is_deal && (
                <Badge className="absolute top-2 right-2 z-10 bg-red-500">
                  Oferta
                </Badge>
              )}
              <img
                src={product.image_url || '/placeholder.svg'}
                alt={product.title}
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <MarketplaceLogo type={product.marketplace} size="sm" />
              {product.categories && (
                <Badge variant="outline" className="text-xs">
                  {product.categories.name}
                </Badge>
              )}
            </div>
            
            <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {product.title}
            </h3>
            
            {product.short_description && (
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {product.short_description}
              </p>
            )}
            
            <div className="flex items-center gap-2 mb-3">
              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
                  {product.review_count && (
                    <span className="text-xs text-muted-foreground">
                      ({product.review_count})
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-1 mb-4">
              {product.original_price && product.original_price > product.price && (
                <div className="text-xs text-muted-foreground line-through">
                  R$ {product.original_price.toFixed(2)}
                </div>
              )}
              <div className="text-lg font-bold text-primary">
                R$ {product.price.toFixed(2)}
              </div>
              {product.original_price && product.original_price > product.price && (
                <div className="text-xs text-green-600 font-medium">
                  Economize R$ {(product.original_price - product.price).toFixed(2)}
                </div>
              )}
            </div>
            
            {product.seller_name && (
              <p className="text-xs text-muted-foreground mb-3">
                Vendido por: {product.seller_name}
              </p>
            )}
          </CardContent>
          
          <CardFooter className="p-4 pt-0">
            <Button 
              onClick={() => handleProductClick(product)}
              className="w-full"
              size="sm"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              Ver Oferta
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
