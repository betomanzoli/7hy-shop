
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductSearch } from '@/components/admin/products/ProductSearch';
import { ProductCard } from '@/components/admin/products/ProductCard';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  marketplace: 'amazon' | 'shopee' | 'mercadolivre';
  imageUrl: string;
  rating?: number;
  affiliateUrl: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  const handleProductsFound = (foundProducts: Product[]) => {
    setProducts(foundProducts);
  };

  const handleAddToSite = (product: Product) => {
    if (featuredProducts.some(p => p.id === product.id)) {
      toast({
        title: "Produto já adicionado",
        description: "Este produto já está na lista de produtos em destaque",
      });
      return;
    }
    
    setFeaturedProducts([...featuredProducts, product]);
    
    toast({
      title: "Produto adicionado",
      description: "Produto adicionado com sucesso aos destaques do site",
    });
  };

  return (
    <AdminLayout title="Pesquisa de Produtos">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <ProductSearch onProductsFound={handleProductsFound} />
        </div>
        
        {featuredProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Produtos em Destaque</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map(product => (
                <ProductCard 
                  key={`featured-${product.id}`} 
                  product={product} 
                />
              ))}
            </div>
          </div>
        )}
        
        {products.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Resultados da Busca</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToSite={handleAddToSite}
                />
              ))}
            </div>
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Nenhum resultado</AlertTitle>
            <AlertDescription>
              Use a caixa de pesquisa acima para buscar produtos nas plataformas conectadas.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;
