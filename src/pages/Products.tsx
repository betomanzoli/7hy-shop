
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerSuggestionForm } from '@/components/products/CustomerSuggestionForm';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Product } from '@/types/product';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Load products from localStorage
  useEffect(() => {
    const storedProducts = localStorage.getItem('affiliate_products');
    if (storedProducts) {
      const parsedProducts = JSON.parse(storedProducts);
      setProducts(parsedProducts);
      setFilteredProducts(parsedProducts);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Filter products by search term
    const results = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Simulate loading
    setTimeout(() => {
      setFilteredProducts(results);
      setIsLoading(false);
    }, 500);
  };

  const getFeaturedProducts = () => {
    return products.filter(p => p.featured);
  };

  const getProductsByMarketplace = (marketplace: string) => {
    return filteredProducts.filter(p => p.marketplace === marketplace);
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Produtos</h1>
        
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="animate-spin mr-2">⭮</span>
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Buscar
            </Button>
          </form>
        </div>
        
        {getFeaturedProducts().length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-500">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
              <h2 className="text-2xl font-bold">Produtos Selecionados da Semana</h2>
            </div>
            
            <ProductGrid products={getFeaturedProducts()} />
          </div>
        )}
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="shopee">Shopee</TabsTrigger>
            <TabsTrigger value="amazon">Amazon</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Nenhum produto encontrado. Tente uma nova busca ou volte mais tarde.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="shopee">
            {getProductsByMarketplace('shopee').length > 0 ? (
              <ProductGrid products={getProductsByMarketplace('shopee')} />
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Nenhum produto da Shopee encontrado. Tente uma nova busca ou volte mais tarde.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="amazon">
            {getProductsByMarketplace('amazon').length > 0 ? (
              <ProductGrid products={getProductsByMarketplace('amazon')} />
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Nenhum produto da Amazon encontrado. Tente uma nova busca ou volte mais tarde.</p>
              </div>
            )}
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
