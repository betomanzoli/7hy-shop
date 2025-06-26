
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ExternalLink, Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { useAnalytics } from '@/hooks/useAnalytics';

interface EnhancedProductCardProps {
  product: Product;
  onWishlistToggle?: (product: Product) => void;
  isInWishlist?: boolean;
  context?: string;
}

export const EnhancedProductCard = ({ 
  product, 
  onWishlistToggle, 
  isInWishlist = false,
  context = 'product_grid'
}: EnhancedProductCardProps) => {
  const { trackProductView, trackProductClick } = useAnalytics();

  React.useEffect(() => {
    // Track product view when card is rendered
    trackProductView(product.id, {
      title: product.title,
      price: product.price,
      marketplace: product.marketplace,
      context,
    });
  }, [product.id, trackProductView, context]);

  const handleProductClick = () => {
    trackProductClick(product.id, context);
    window.open(product.affiliate_url, '_blank');
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onWishlistToggle) {
      onWishlistToggle(product);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getMarketplaceBadgeColor = (marketplace: string) => {
    switch (marketplace.toLowerCase()) {
      case 'amazon':
        return 'bg-orange-500 text-white';
      case 'shopee':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={handleProductClick}>
      <CardContent className="p-4">
        <div className="relative mb-4">
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-48 object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
            />
          )}
          
          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
            onClick={handleWishlistClick}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>

          {/* Marketplace Badge */}
          <Badge className={`absolute top-2 left-2 ${getMarketplaceBadgeColor(product.marketplace)}`}>
            {product.marketplace.toUpperCase()}
          </Badge>

          {/* Deal Badge */}
          {product.is_deal && (
            <Badge className="absolute bottom-2 left-2 bg-green-500 text-white">
              OFERTA
            </Badge>
          )}
        </div>

        <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">
                {product.rating} ({product.review_count || 0})
              </span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600">
              {formatPrice(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
          
          {product.original_price && product.original_price > product.price && (
            <div className="text-sm text-green-600 font-medium">
              Economize {formatPrice(product.original_price - product.price)}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full group-hover:bg-primary/90" onClick={handleProductClick}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Ver Produto
        </Button>
      </CardFooter>
    </Card>
  );
};
