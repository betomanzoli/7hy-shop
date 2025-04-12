
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Placeholder component - substituir quando houver uma implementação real
const ProductsPlaceholder = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <div className="bg-muted h-48 animate-pulse"></div>
          <div className="p-4">
            <div className="h-4 bg-muted animate-pulse rounded mb-2"></div>
            <div className="h-4 bg-muted animate-pulse rounded mb-4 w-2/3"></div>
            <div className="h-8 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        
        {isLoading ? (
          <ProductsPlaceholder />
        ) : (
          <>
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Informação</AlertTitle>
              <AlertDescription>
                Estamos em processo de importação de produtos dos diferentes marketplaces. Em breve teremos uma variedade maior de produtos disponíveis.
              </AlertDescription>
            </Alert>
            
            <ProductsPlaceholder />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Products;
