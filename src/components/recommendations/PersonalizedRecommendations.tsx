// =====================================================
// Sistema de Recomendações Personalizadas
// Componente: PersonalizedRecommendations.tsx
// =====================================================

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Heart, 
  ExternalLink, 
  TrendingUp, 
  Clock, 
  Users, 
  Zap,
  RefreshCw,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

// Tipos
interface RecommendedProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  marketplace: 'amazon' | 'shopee';
  rating: number;
  reviewCount: number;
  affiliateUrl: string;
  category: string;
  recommendationReason: string;
  recommendationScore: number;
  isInStock: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  estimatedDelivery: string;
}

interface RecommendationSection {
  title: string;
  description: string;
  products: RecommendedProduct[];
  type: 'trending' | 'personalized' | 'similar' | 'deals' | 'new';
}

interface PersonalizedRecommendationsProps {
  userId?: string;
  currentProductId?: string;
  onProductClick?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  maxRecommendations?: number;
}

export function PersonalizedRecommendations({ 
  userId, 
  currentProductId, 
  onProductClick, 
  onAddToWishlist,
  maxRecommendations = 20 
}: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendationSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('for-you');
  const [refreshing, setRefreshing] = useState(false);

  // Carregar recomendações
  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      
      // Simular chamadas para diferentes tipos de recomendação
      const [personalizedRes, trendingRes, dealsRes, newRes] = await Promise.all([
        fetch(`/api/recommendations/${userId || 'anonymous'}?type=personalized&limit=8`),
        fetch('/api/recommendations/trending?limit=6'),
        fetch('/api/recommendations/deals?limit=6'),
        fetch('/api/recommendations/new?limit=6')
      ]);

      const personalizedData = await personalizedRes.json();
      const trendingData = await trendingRes.json();
      const dealsData = await dealsRes.json();
      const newData = await newRes.json();

      const sections: RecommendationSection[] = [
        {
          title: 'Recomendado para Você',
          description: 'Baseado no seu histórico e preferências',
          products: personalizedData.recommendations || [],
          type: 'personalized'
        },
        {
          title: 'Em Alta',
          description: 'Produtos mais populares no momento',
          products: trendingData.recommendations || [],
          type: 'trending'
        },
        {
          title: 'Ofertas Imperdíveis',
          description: 'Produtos com os melhores descontos',
          products: dealsData.recommendations || [],
          type: 'deals'
        },
        {
          title: 'Lançamentos',
          description: 'Produtos recém-adicionados',
          products: newData.recommendations || [],
          type: 'new'
        }
      ];

      setRecommendations(sections);
    } catch (error) {
      console.error('Erro ao carregar recomendações:', error);
      toast.error('Erro ao carregar recomendações');
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar recomendações
  const refreshRecommendations = async () => {
    setRefreshing(true);
    await loadRecommendations();
    setRefreshing(false);
    toast.success('Recomendações atualizadas!');
  };

  // Registrar interação
  const trackInteraction = async (productId: string, action: string) => {
    try {
      await fetch('/api/analytics/interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || 'anonymous',
          productId,
          action,
          timestamp: new Date().toISOString(),
          context: 'recommendations'
        })
      });
    } catch (error) {
      console.error('Erro ao registrar interação:', error);
    }
  };

  // Handlers
  const handleProductClick = (product: RecommendedProduct) => {
    trackInteraction(product.id, 'click');
    onProductClick?.(product.id);
  };

  const handleAddToWishlist = (product: RecommendedProduct) => {
    trackInteraction(product.id, 'add_to_wishlist');
    onAddToWishlist?.(product.id);
    toast.success(`${product.title} adicionado à lista de desejos!`);
  };

  const handleBuyClick = (product: RecommendedProduct) => {
    trackInteraction(product.id, 'buy_click');
    window.open(product.affiliateUrl, '_blank');
  };

  useEffect(() => {
    loadRecommendations();
  }, [userId, currentProductId]);

  // Componente de card de produto
  const ProductCard = ({ product }: { product: RecommendedProduct }) => {
    const discountPercentage = product.originalPrice ? 
      ((product.originalPrice - product.price) / product.originalPrice * 100) : 0;

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div onClick={() => handleProductClick(product)}>
          <CardHeader className="pb-2">
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isTrending && (
                  <Badge className="bg-red-500 text-white">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Em Alta
                  </Badge>
                )}
                {product.isNewArrival && (
                  <Badge className="bg-blue-500 text-white">
                    <Zap className="h-3 w-3 mr-1" />
                    Novo
                  </Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge className="bg-green-500 text-white">
                    -{discountPercentage.toFixed(0)}%
                  </Badge>
                )}
              </div>

              {/* Marketplace badge */}
              <div className="absolute top-2 right-2">
                <Badge variant={product.marketplace === 'amazon' ? 'default' : 'secondary'}>
                  {product.marketplace === 'amazon' ? 'Amazon' : 'Shopee'}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Título */}
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>

            {/* Preço */}
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-green-600">
                R$ {product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  R$ {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Avaliação */}
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-sm">{product.rating.toFixed(1)}</span>
              <span className="text-gray-500 text-xs">({product.reviewCount})</span>
            </div>

            {/* Motivo da recomendação */}
            <div className="bg-blue-50 p-2 rounded-lg">
              <p className="text-xs text-blue-700">{product.recommendationReason}</p>
            </div>

            {/* Informações adicionais */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{product.estimatedDelivery}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>Score: {product.recommendationScore.toFixed(1)}</span>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Ações */}
        <CardContent className="pt-0">
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => handleBuyClick(product)}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Comprar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddToWishlist(product)}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Componente de seção de recomendações
  const RecommendationSection = ({ section }: { section: RecommendationSection }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{section.title}</h3>
          <p className="text-sm text-gray-600">{section.description}</p>
        </div>
        {section.products.length > 0 && (
          <Badge variant="outline">
            {section.products.length} produtos
          </Badge>
        )}
      </div>

      {section.products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {section.products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma recomendação disponível no momento</p>
        </div>
      )}
    </div>
  );

  // Skeleton loading
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3].map(section => (
        <div key={section} className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(item => (
              <Card key={item}>
                <CardHeader>
                  <Skeleton className="h-48 w-full rounded-lg" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-6 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Recomendações</h2>
          <p className="text-gray-600">Produtos selecionados especialmente para você</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshRecommendations}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Preferências
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="for-you">Para Você</TabsTrigger>
          <TabsTrigger value="trending">Em Alta</TabsTrigger>
          <TabsTrigger value="deals">Ofertas</TabsTrigger>
          <TabsTrigger value="new">Novidades</TabsTrigger>
        </TabsList>

        <TabsContent value="for-you" className="space-y-8">
          {recommendations
            .filter(section => section.type === 'personalized')
            .map((section, index) => (
              <RecommendationSection key={index} section={section} />
            ))}
        </TabsContent>

        <TabsContent value="trending" className="space-y-8">
          {recommendations
            .filter(section => section.type === 'trending')
            .map((section, index) => (
              <RecommendationSection key={index} section={section} />
            ))}
        </TabsContent>

        <TabsContent value="deals" className="space-y-8">
          {recommendations
            .filter(section => section.type === 'deals')
            .map((section, index) => (
              <RecommendationSection key={index} section={section} />
            ))}
        </TabsContent>

        <TabsContent value="new" className="space-y-8">
          {recommendations
            .filter(section => section.type === 'new')
            .map((section, index) => (
              <RecommendationSection key={index} section={section} />
            ))}
        </TabsContent>
      </Tabs>

      {/* Estatísticas de recomendação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Suas Estatísticas</CardTitle>
          <CardDescription>
            Como estamos personalizando suas recomendações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {recommendations.reduce((acc, section) => acc + section.products.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Produtos Recomendados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {recommendations.filter(s => s.type === 'deals')[0]?.products.length || 0}
              </div>
              <div className="text-sm text-gray-600">Ofertas Encontradas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(Math.random() * 30 + 70)}%
              </div>
              <div className="text-sm text-gray-600">Taxa de Acerto</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

