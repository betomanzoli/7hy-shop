
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Star, ShoppingCart } from 'lucide-react';
import { RedirectModal } from './RedirectModal';
import { handleProductRedirect } from '@/services/affiliateService';

interface Product {
  id: string;
  title: string;
  price: number;
  marketplace: 'amazon' | 'shopee' | 'mercadolivre';
  imageUrl: string;
  rating?: number;
  originalUrl: string;
  marketplaceId: string;
}

interface EnhancedProductCardProps {
  product: Product;
  affiliateCode: string;
  userId?: string;
}

export function EnhancedProductCard({ product, affiliateCode, userId }: EnhancedProductCardProps) {
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  
  const marketplaceNames = {
    amazon: 'Amazon',
    shopee: 'Shopee',
    mercadolivre: 'Mercado Livre'
  };
  
  const marketplaceColors = {
    amazon: 'bg-amber-100 text-amber-800',
    shopee: 'bg-orange-100 text-orange-800',
    mercadolivre: 'bg-yellow-100 text-yellow-800'
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  const handleBuyClick = () => {
    setIsRedirectModalOpen(true);
  };
  
  const handleConfirmRedirect = () => {
    const affiliateUrl = handleProductRedirect(
      product.originalUrl,
      affiliateCode,
      product.marketplace,
      product.id,
      product.marketplaceId,
      userId
    );
    
    // Open in new tab
    window.open(affiliateUrl, '_blank');
    setIsRedirectModalOpen(false);
  };
  
  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start mb-2">
            <Badge className={marketplaceColors[product.marketplace]}>
              {marketplaceNames[product.marketplace]}
            </Badge>
            {product.rating && (
              <div className="flex items-center text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{product.rating}</span>
              </div>
            )}
          </div>
          <div className="aspect-square w-full bg-muted/40 rounded-md overflow-hidden mb-2">
            <img 
              src={product.imageUrl} 
              alt={product.title}
              className="w-full h-full object-contain"
            />
          </div>
          <CardTitle className="text-base line-clamp-2">{product.title}</CardTitle>
          <CardDescription className="text-lg font-bold text-foreground">
            {formatPrice(product.price)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {/* Espaço para conteúdo adicional se necessário */}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            className="w-full"
            variant="default"
            onClick={handleBuyClick}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Comprar Agora
          </Button>
          <Button 
            className="w-full"
            variant="outline"
            onClick={handleBuyClick}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver na Loja
          </Button>
        </CardFooter>
      </Card>
      
      <RedirectModal
        isOpen={isRedirectModalOpen}
        onClose={() => setIsRedirectModalOpen(false)}
        onConfirm={handleConfirmRedirect}
        platformName={marketplaceNames[product.marketplace]}
        productTitle={product.title}
      />
    </>
  );
}
