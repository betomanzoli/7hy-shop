
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star } from 'lucide-react';
import { MarketplaceLogo } from '@/components/marketplace/MarketplaceLogo';
import { RedirectModal } from './RedirectModal';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils';

interface EnhancedProductCardProps {
  product: Product;
  userId?: string;
  affiliateCode?: string;
  isFeatured?: boolean;
}

export function EnhancedProductCard({ 
  product, 
  userId, 
  affiliateCode, 
  isFeatured = false 
}: EnhancedProductCardProps) {
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  
  const handleViewProduct = () => {
    setShowRedirectModal(true);
  };
  
  const getDiscountPercentage = () => {
    if (!product.originalPrice || product.originalPrice <= product.price) return null;
    
    const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
    return Math.round(discount);
  };
  
  const discountPercentage = getDiscountPercentage();
  
  // Function to get final affiliate URL (add tracking if needed)
  const getFinalAffiliateUrl = () => {
    let url = product.affiliateUrl;
    
    // If a user ID is provided, add it to the URL
    if (userId) {
      url += url.includes('?') ? '&' : '?';
      url += `ref=${userId}`;
    }
    
    // If an affiliate code is provided, add it to the URL
    if (affiliateCode) {
      url += url.includes('?') ? '&' : '?';
      url += `aff=${affiliateCode}`;
    }
    
    return url;
  };

  return (
    <>
      <Card className={`h-full flex flex-col overflow-hidden group transition-all ${
        isFeatured ? 'shadow-md hover:shadow-xl border-amber-200 dark:border-amber-800' : 'hover:shadow-md'
      }`}>
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <img 
              src={product.imageUrl || "https://placehold.co/400x300?text=Sem+Imagem"} 
              alt={product.title} 
              className="object-cover w-full h-full transition-transform group-hover:scale-105"
            />
          </div>
          
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            <MarketplaceLogo 
              type={product.marketplace} 
              className="w-8 h-8"
            />
            
            {isFeatured && (
              <div className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm flex items-center">
                <Star className="h-3 w-3 mr-1 fill-white" />
                Destaque
              </div>
            )}
          </div>
          
          {discountPercentage && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
              -{discountPercentage}%
            </div>
          )}
        </div>
        
        <CardContent className="flex-grow pt-4">
          <div className="mb-2 space-y-1">
            <h3 className="font-semibold line-clamp-2 h-[2.5rem]">{product.title}</h3>
            
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold">{formatCurrency(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">{formatCurrency(product.originalPrice)}</span>
              )}
            </div>
            
            {product.rating && (
              <div className="flex items-center text-amber-500">
                <Star className="h-4 w-4 fill-amber-500 mr-1" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0">
          <Button 
            className="w-full gap-2" 
            onClick={handleViewProduct}
          >
            <ExternalLink className="h-4 w-4" />
            Ver na loja
          </Button>
        </CardFooter>
      </Card>
      
      {showRedirectModal && (
        <RedirectModal
          productTitle={product.title}
          affiliateUrl={getFinalAffiliateUrl()}
          onClose={() => setShowRedirectModal(false)}
          marketplace={product.marketplace}
        />
      )}
    </>
  );
}
