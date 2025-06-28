import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerSuggestionForm } from '@/components/products/CustomerSuggestionForm';
import { ProductGridWithSupabase } from '@/components/products/ProductGridWithSupabase';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAnalytics } from '@/hooks/useAnalytics';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [selectedMarketplace, setSelectedMarketplace] = useState<'amazon' | 'shopee' | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { trackPageView, trackSearch } = useAnalytics();
  const { categories } = useCategories();
  
  // Track page view on mount
  useEffect(() => {
    trackPageView('products');
  }, [trackPageView]);
  
  // Fetch products based on current filters
  const { products, loading } = useProducts({
    searchTerm: currentSearchTerm,
    marketplace: selectedMarketplace === 'all' ? null : selectedMarketplace,
    categoryId: selectedCategory === 'all' ? null : selectedCategory,
  });

  // Fetch featured products separately
  const { products: featuredProducts, loading: featuredLoading } = useProducts({
    featuredOnly: true,
    limit: 8
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentSearchTerm(searchTerm);
    
    // Track search event with results count
    trackSearch(searchTerm, products.length);
  };

  const getFilteredProducts = () => {
    if (selectedMarketplace === 'all') {
      return products;
    }
    return products.filter(p => p.marketplace === selectedMarketplace);
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Produtos</h1>
        
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="animate-spin mr-2">⭮</span>
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Buscar
            </Button>
          </form>

          <div className="flex gap-4 flex-wrap">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {featuredProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-500">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
              <h2 className="text-2xl font-bold">Produtos Selecionados da Semana</h2>
            </div>
            
            <ProductGridWithSupabase products={featuredProducts} loading={featuredLoading} />
          </div>
        )}
        
        <Tabs value={selectedMarketplace} onValueChange={(value) => setSelectedMarketplace(value as any)} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="shopee">Shopee</TabsTrigger>
            <TabsTrigger value="amazon">Amazon</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <ProductGridWithSupabase products={products} loading={loading} />
          </TabsContent>
          
          <TabsContent value="shopee">
            <ProductGridWithSupabase products={getFilteredProducts()} loading={loading} />
          </TabsContent>
          
          <TabsContent value="amazon">
            <ProductGridWithSupabase products={getFilteredProducts()} loading={loading} />
          </TabsContent>
        </Tabs>
        
        <div className="mt-16 pt-8 border-t">
          <CustomerSuggestionForm />
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;
