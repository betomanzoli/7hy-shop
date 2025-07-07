
import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductGridWithSupabase } from '@/components/products/ProductGridWithSupabase';
import { useProducts } from '@/hooks/useProducts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MercadoLivre = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const { trackPageView, trackSearch } = useAnalytics();
  
  const { products, loading } = useProducts({
    searchTerm: currentSearchTerm,
    marketplace: 'mercadolivre'
  });

  useEffect(() => {
    trackPageView('mercadolivre');
  }, [trackPageView]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentSearchTerm(searchTerm);
    trackSearch(searchTerm, products.length);
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl p-8 mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white p-3 rounded-full mr-4">
              <ShoppingCart className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-4xl font-bold text-white">MercadoLivre</h1>
          </div>
          <p className="text-xl text-yellow-100 mb-6 max-w-2xl mx-auto">
            Explore milhões de produtos com as melhores ofertas do maior marketplace da América Latina
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Buscar no MercadoLivre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-white"
            />
            <Button type="submit" className="bg-white text-yellow-600 hover:bg-gray-100">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-6 text-center">
              <ShoppingCart className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-yellow-800 mb-1">80M+</div>
              <div className="text-sm text-yellow-700">Produtos Disponíveis</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-800 mb-1">Frete Grátis</div>
              <div className="text-sm text-green-700">Em milhares de produtos</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-800 mb-1">MercadoPago</div>
              <div className="text-sm text-blue-700">Pagamento Seguro</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Results */}
        {currentSearchTerm && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                Resultados para "{currentSearchTerm}"
              </h2>
              <Badge variant="outline" className="text-sm">
                {products.length} produtos encontrados
              </Badge>
            </div>
            <ProductGridWithSupabase 
              products={products} 
              loading={loading}
            />
          </div>
        )}

        {/* Original Content - Enhanced */}
        <div className="max-w-4xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-lg text-muted-foreground mb-6">
                Acesse os melhores produtos do Mercado Livre em um só lugar. Como parceiros oficiais do programa de afiliados do Mercado Livre, selecionamos as melhores ofertas para você.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Mercado Pontos</h3>
                  <p className="text-muted-foreground">
                    Acumule pontos em suas compras e troque por descontos e benefícios.
                  </p>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Mercado Pago</h3>
                  <p className="text-muted-foreground">
                    Pagamentos seguros e parcelamentos em até 12x sem juros.
                  </p>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Compra Garantida</h3>
                  <p className="text-muted-foreground">
                    Se algo não sair como esperado, devolva o produto e receba seu dinheiro de volta.
                  </p>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Mercado Envios</h3>
                  <p className="text-muted-foreground">
                    Entrega rápida e rastreável para todo o Brasil.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Categorias Populares</h3>
              <ul className="space-y-2">
                <li className="hover:text-yellow-600 cursor-pointer">Celulares e Smartphones</li>
                <li className="hover:text-yellow-600 cursor-pointer">Informática</li>
                <li className="hover:text-yellow-600 cursor-pointer">Eletrodomésticos</li>
                <li className="hover:text-yellow-600 cursor-pointer">Veículos e Acessórios</li>
                <li className="hover:text-yellow-600 cursor-pointer">Casa, Móveis e Decoração</li>
                <li className="hover:text-yellow-600 cursor-pointer">Esportes e Fitness</li>
                <li className="hover:text-yellow-600 cursor-pointer">Ferramentas</li>
                <li className="hover:text-yellow-600 cursor-pointer">Brinquedos e Hobbies</li>
              </ul>
              
              <div className="border-t mt-6 pt-6">
                <h3 className="text-xl font-semibold mb-4">Ofertas do Dia</h3>
                <p className="text-muted-foreground mb-4">
                  Descontos especiais em produtos selecionados, atualizados diariamente.
                </p>
                <div className="bg-white dark:bg-gray-800 p-3 rounded text-center animate-pulse">
                  Carregando ofertas...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MercadoLivre;
