
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Send } from 'lucide-react';
import { ShopeeProductsGrid } from '@/components/products/ShopeeProductsGrid';
import { getDefaultAffiliateId } from '@/services/affiliateService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerSuggestionForm } from '@/components/products/CustomerSuggestionForm';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const shopeeAffiliateCode = getDefaultAffiliateId('shopee');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular uma busca com tempo de espera
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
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
        
        <Tabs defaultValue="shopee" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="shopee">Shopee</TabsTrigger>
            <TabsTrigger value="amazon">Amazon</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shopee">
            <ShopeeProductsGrid affiliateCode={shopeeAffiliateCode} />
          </TabsContent>
          
          <TabsContent value="amazon">
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Produtos da Amazon serão adicionados em breve.</p>
            </div>
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
