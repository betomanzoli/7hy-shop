// =====================================================
// Sistema de Comparação Inteligente de Produtos
// Componente: ProductComparison.tsx
// =====================================================

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Truck, 
  Shield, 
  ExternalLink, 
  Heart,
  Share2,
  BarChart3,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

// Tipos
interface ComparisonProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  marketplace: 'amazon' | 'shopee' | 'mercadolivre';
  rating: number;
  reviewCount: number;
  affiliateUrl: string;
  isInStock: boolean;
  shippingInfo: {
    isFree: boolean;
    estimatedDays: number;
    cost?: number;
  };
  sellerInfo: {
    name: string;
    rating: number;
    isVerified: boolean;
  };
  specifications: Record<string, any>;
  features: string[];
  priceHistory: Array<{
    date: string;
    price: number;
  }>;
}

interface ComparisonMetrics {
  priceScore: number;
  ratingScore: number;
  shippingScore: number;
  sellerScore: number;
  overallScore: number;
  bestValue: boolean;
  bestRating: boolean;
  fastestShipping: boolean;
  lowestPrice: boolean;
}

interface ProductComparisonProps {
  products: ComparisonProduct[];
  onAddToWishlist?: (productId: string) => void;
  onShare?: (comparisonId: string) => void;
}

export function ProductComparison({ products, onAddToWishlist, onShare }: ProductComparisonProps) {
  const [metrics, setMetrics] = useState<Record<string, ComparisonMetrics>>({});
  const [selectedTab, setSelectedTab] = useState('overview');

  // Calcular métricas de comparação
  useEffect(() => {
    if (products.length === 0) return;

    const calculatedMetrics: Record<string, ComparisonMetrics> = {};
    
    // Encontrar valores extremos para normalização
    const prices = products.map(p => p.price);
    const ratings = products.map(p => p.rating);
    const shippingDays = products.map(p => p.shippingInfo.estimatedDays);
    const sellerRatings = products.map(p => p.sellerInfo.rating);

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const maxRating = Math.max(...ratings);
    const minShippingDays = Math.min(...shippingDays);
    const maxSellerRating = Math.max(...sellerRatings);

    products.forEach(product => {
      // Calcular scores normalizados (0-100)
      const priceScore = maxPrice === minPrice ? 100 : 
        ((maxPrice - product.price) / (maxPrice - minPrice)) * 100;
      
      const ratingScore = maxRating === 0 ? 0 : (product.rating / maxRating) * 100;
      
      const shippingScore = product.shippingInfo.isFree ? 
        (minShippingDays === product.shippingInfo.estimatedDays ? 100 : 80) : 60;
      
      const sellerScore = maxSellerRating === 0 ? 0 : 
        (product.sellerInfo.rating / maxSellerRating) * 100;

      // Score geral ponderado
      const overallScore = (
        priceScore * 0.3 + 
        ratingScore * 0.25 + 
        shippingScore * 0.25 + 
        sellerScore * 0.2
      );

      calculatedMetrics[product.id] = {
        priceScore,
        ratingScore,
        shippingScore,
        sellerScore,
        overallScore,
        bestValue: false,
        bestRating: false,
        fastestShipping: false,
        lowestPrice: false,
      };
    });

    // Identificar os melhores em cada categoria
    const bestOverall = Object.entries(calculatedMetrics)
      .sort(([,a], [,b]) => b.overallScore - a.overallScore)[0];
    
    const bestRatingProduct = products
      .sort((a, b) => b.rating - a.rating)[0];
    
    const fastestShippingProduct = products
      .sort((a, b) => a.shippingInfo.estimatedDays - b.shippingInfo.estimatedDays)[0];
    
    const lowestPriceProduct = products
      .sort((a, b) => a.price - b.price)[0];

    if (bestOverall) calculatedMetrics[bestOverall[0]].bestValue = true;
    calculatedMetrics[bestRatingProduct.id].bestRating = true;
    calculatedMetrics[fastestShippingProduct.id].fastestShipping = true;
    calculatedMetrics[lowestPriceProduct.id].lowestPrice = true;

    setMetrics(calculatedMetrics);
  }, [products]);

  // Componente de score visual
  const ScoreBar = ({ score, label, color = "blue" }: { score: number; label: string; color?: string }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{score.toFixed(0)}/100</span>
      </div>
      <Progress value={score} className="h-2" />
    </div>
  );

  // Componente de badge de destaque
  const HighlightBadge = ({ type }: { type: 'bestValue' | 'bestRating' | 'fastestShipping' | 'lowestPrice' }) => {
    const badges = {
      bestValue: { label: 'Melhor Custo-Benefício', icon: Zap, variant: 'default' as const },
      bestRating: { label: 'Melhor Avaliado', icon: Star, variant: 'secondary' as const },
      fastestShipping: { label: 'Entrega Mais Rápida', icon: Truck, variant: 'outline' as const },
      lowestPrice: { label: 'Menor Preço', icon: TrendingDown, variant: 'destructive' as const },
    };

    const badge = badges[type];
    const Icon = badge.icon;

    return (
      <Badge variant={badge.variant} className="text-xs">
        <Icon className="h-3 w-3 mr-1" />
        {badge.label}
      </Badge>
    );
  };

  // Componente de card de produto
  const ProductCard = ({ product }: { product: ComparisonProduct }) => {
    const productMetrics = metrics[product.id];
    if (!productMetrics) return null;

    const discountPercentage = product.originalPrice ? 
      ((product.originalPrice - product.price) / product.originalPrice * 100) : 0;

    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="space-y-2">
            {/* Badges de destaque */}
            <div className="flex flex-wrap gap-1">
              {productMetrics.bestValue && <HighlightBadge type="bestValue" />}
              {productMetrics.bestRating && <HighlightBadge type="bestRating" />}
              {productMetrics.fastestShipping && <HighlightBadge type="fastestShipping" />}
              {productMetrics.lowestPrice && <HighlightBadge type="lowestPrice" />}
            </div>
            
            {/* Imagem do produto */}
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              {discountPercentage > 0 && (
                <Badge className="absolute top-2 right-2 bg-red-500">
                  -{discountPercentage.toFixed(0)}%
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Título e marketplace */}
          <div>
            <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.title}</h3>
            <Badge variant={
              product.marketplace === 'amazon' ? 'default' : 
              product.marketplace === 'shopee' ? 'secondary' : 
              'outline'
            }>
              {product.marketplace === 'amazon' ? 'Amazon' : 
               product.marketplace === 'shopee' ? 'Shopee' : 
               'Mercado Livre'}
            </Badge>
          </div>

          {/* Preço */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">
                R$ {product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  R$ {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Avaliação */}
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-gray-500 text-sm">({product.reviewCount})</span>
          </div>

          {/* Informações de entrega */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Truck className="h-4 w-4" />
              <span>
                {product.shippingInfo.isFree ? 'Frete grátis' : `Frete R$ ${product.shippingInfo.cost?.toFixed(2)}`}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Entrega em {product.shippingInfo.estimatedDays} dias úteis
            </div>
          </div>

          {/* Vendedor */}
          <div className="flex items-center space-x-2 text-sm">
            <Shield className="h-4 w-4" />
            <span>{product.sellerInfo.name}</span>
            {product.sellerInfo.isVerified && (
              <Badge variant="outline" className="text-xs">Verificado</Badge>
            )}
          </div>

          {/* Scores de comparação */}
          <div className="space-y-2">
            <ScoreBar score={productMetrics.priceScore} label="Preço" />
            <ScoreBar score={productMetrics.ratingScore} label="Avaliação" />
            <ScoreBar score={productMetrics.shippingScore} label="Entrega" />
            <ScoreBar score={productMetrics.overallScore} label="Geral" color="green" />
          </div>

          {/* Ações */}
          <div className="flex space-x-2">
            <Button asChild className="flex-1">
              <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Comprar
              </a>
            </Button>
            {onAddToWishlist && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onAddToWishlist(product.id)}
              >
                <Heart className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Componente de especificações comparativas
  const SpecificationsComparison = () => {
    // Obter todas as especificações únicas
    const allSpecs = new Set<string>();
    products.forEach(product => {
      Object.keys(product.specifications).forEach(spec => allSpecs.add(spec));
    });

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Especificações Técnicas</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Especificação</th>
                {products.map(product => (
                  <th key={product.id} className="text-left p-2 font-medium min-w-[200px]">
                    {product.title.substring(0, 30)}...
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from(allSpecs).map(spec => (
                <tr key={spec} className="border-b">
                  <td className="p-2 font-medium">{spec}</td>
                  {products.map(product => (
                    <td key={product.id} className="p-2">
                      {product.specifications[spec] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Componente de gráfico de histórico de preços
  const PriceHistoryChart = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Histórico de Preços (30 dias)</h3>
      <div className="h-64 flex items-center justify-center border rounded-lg">
        <div className="text-center text-gray-500">
          <BarChart3 className="h-12 w-12 mx-auto mb-2" />
          <p>Gráfico de histórico de preços</p>
          <p className="text-sm">Implementar com biblioteca de gráficos (Recharts)</p>
        </div>
      </div>
    </div>
  );

  if (products.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          Nenhum produto selecionado para comparação. Adicione produtos para começar a comparar.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header da comparação */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Comparação de Produtos</h2>
          <p className="text-gray-600">Compare {products.length} produtos lado a lado</p>
        </div>
        {onShare && (
          <Button variant="outline" onClick={() => onShare('comparison-id')}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        )}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="specifications">Especificações</TabsTrigger>
          <TabsTrigger value="price-history">Histórico de Preços</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="specifications">
          <SpecificationsComparison />
        </TabsContent>

        <TabsContent value="price-history">
          <PriceHistoryChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}
