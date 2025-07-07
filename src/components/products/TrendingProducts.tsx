import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Eye, Heart, Share2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { EnhancedProductCard } from './EnhancedProductCard';
import { useAnalytics } from '@/hooks/useAnalytics';

export function TrendingProducts() {
  const { trackPageView } = useAnalytics();
  const { products, loading } = useProducts({ 
    limit: 6,
    // Simula produtos trending baseado em is_featured ou outros critérios
    featuredOnly: false 
  });

  useEffect(() => {
    trackPageView('trending_products_section');
  }, [trackPageView]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const trendingProducts = products.slice(0, 6).map((product, index) => ({
    ...product,
    trendingScore: 100 - (index * 15), // Simula score de trending
    views24h: Math.floor(Math.random() * 500) + 100,
    wishlisted: Math.floor(Math.random() * 50) + 10
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl font-bold">Produtos em Alta</h2>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Últimas 24h
          </Badge>
        </div>
      </div>

      {/* Trending Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <Eye className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-700">
              {trendingProducts.reduce((sum, p) => sum + p.views24h, 0).toLocaleString()}
            </div>
            <div className="text-sm text-orange-600">Visualizações hoje</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-pink-700">
              {trendingProducts.reduce((sum, p) => sum + p.wishlisted, 0)}
            </div>
            <div className="text-sm text-pink-600">Adicionados à wishlist</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Share2 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">
              {Math.floor(Math.random() * 100) + 50}
            </div>
            <div className="text-sm text-blue-600">Compartilhamentos</div>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingProducts.map((product, index) => (
          <div key={product.id} className="relative">
            {/* Trending Position */}
            <div className="absolute -top-2 -left-2 z-10">
              <Badge 
                className={`
                  ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : ''}
                  ${index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-white' : ''}
                  ${index === 2 ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white' : ''}
                  ${index > 2 ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white' : ''}
                  font-bold shadow-md
                `}
              >
                #{index + 1}
              </Badge>
            </div>

            {/* Product Card */}
            <div className="relative">
              <EnhancedProductCard 
                product={{
                  ...product,
                  category: product.categories?.name || 'Geral'
                }}
                isFeatured={index < 3}
              />
              
              {/* Trending Metrics Overlay */}
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs space-y-1">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-gray-600" />
                  <span className="font-medium">{product.views24h}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="font-medium text-green-600">+{product.trendingScore}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trending Insights */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Insights de Tendências
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-800">📱 Eletrônicos</h4>
              <p className="text-purple-700">Categoria mais visualizada hoje (+35%)</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-800">⏰ Melhor Horário</h4>
              <p className="text-purple-700">Pico de atividade entre 18h-21h</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-800">💰 Faixa de Preço</h4>
              <p className="text-purple-700">R$ 50-200 mais populares hoje</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-800">🏪 Marketplace</h4>
              <p className="text-purple-700">Amazon lidera em vendas hoje</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}