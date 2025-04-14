
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Star } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  marketplace: 'amazon' | 'shopee';
  imageUrl: string;
  rating?: number;
  affiliateUrl: string;
}

interface ProductCardProps {
  product: Product;
  onAddToSite?: (product: Product) => void;
}

export function ProductCard({ product, onAddToSite }: ProductCardProps) {
  const marketplaceColors = {
    amazon: 'bg-amber-100 text-amber-800',
    shopee: 'bg-orange-100 text-orange-800'
  };
  
  const marketplaceNames = {
    amazon: 'Amazon',
    shopee: 'Shopee'
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  const handleAddToSite = () => {
    if (onAddToSite) {
      onAddToSite(product);
    }
  };
  
  const handleViewOriginal = () => {
    window.open(product.affiliateUrl, '_blank');
  };
  
  return (
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
          onClick={handleAddToSite}
        >
          Adicionar ao Site
        </Button>
        <Button 
          className="w-full"
          variant="outline"
          onClick={handleViewOriginal}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Ver na Loja
        </Button>
      </CardFooter>
    </Card>
  );
}
