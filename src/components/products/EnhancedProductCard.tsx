
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { MarketplaceLogo } from '@/components/marketplace/MarketplaceLogo';
import { useAnalytics } from '@/hooks/useAnalytics';

export interface EnhancedProductCardProps {
  product: Product;
  userId?: string;
  affiliateCode?: string;
  isFeatured?: boolean;
}

export function EnhancedProductCard({ product, userId, affiliateCode, isFeatured }: EnhancedProductCardProps) {
  const { trackProductView, trackProductClick } = useAnalytics();

  // Validar UUID antes de fazer tracking
  const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  React.useEffect(() => {
    // Só fazer tracking se for um UUID válido
    if (isValidUUID(product.id)) {
      trackProductView(product.id, product.title);
    }
  }, [product.id, product.title, trackProductView]);

  const handleProductClick = () => {
    // Só fazer tracking se for um UUID válido
    if (isValidUUID(product.id)) {
      trackProductClick(product.id, product.title, product.affiliate_url);
    }
    
    // Abrir link de afiliado
    window.open(product.affiliate_url, '_blank');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 relative overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {isFeatured && (
            <Badge className="absolute top-2 left-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold">
              ⭐ Destaque
            </Badge>
          )}
          {product.is_deal && (
            <Badge className="absolute top-2 right-2 z-10 bg-red-500 text-white font-semibold animate-pulse">
              🔥 Oferta
            </Badge>
          )}
          <div className="aspect-square overflow-hidden bg-gray-100">
            <img
              src={product.image_url || '/placeholder.svg'}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <MarketplaceLogo type={product.marketplace} size="sm" />
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-500">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
            {product.title}
          </h3>
          
          {product.rating && (
            <div className="flex items-center gap-1 text-sm">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-medium">{product.rating.toFixed(1)}</span>
              </div>
              {product.review_count && (
                <span className="text-muted-foreground">({product.review_count})</span>
              )}
            </div>
          )}
          
          <div className="space-y-1">
            {product.original_price && product.original_price > product.price && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.original_price)}
                </span>
                <Badge variant="destructive" className="text-xs">
                  -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                </Badge>
              </div>
            )}
            <div className="text-xl font-bold text-primary">
              {formatCurrency(product.price)}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleProductClick}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-200"
          size="sm"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Ver Oferta
        </Button>
      </CardFooter>
    </Card>
  );
}
