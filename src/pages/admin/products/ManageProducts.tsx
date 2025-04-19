
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductForm } from '@/components/admin/products/ProductForm';
import { ProductsList } from '@/components/admin/products/ProductsList';
import { useToast } from '@/hooks/use-toast';
import { MarketplaceType } from '@/components/marketplace/MarketplaceLogo';
import { Product } from '@/types/product';

// Mock storage for products - in a real app this would use Supabase or another database
const STORAGE_KEY = 'affiliate_products';

const loadProducts = (): Product[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>(loadProducts);
  const { toast } = useToast();

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  const handleAddProduct = (product: Product) => {
    // Generate a unique ID
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    setProducts([...products, newProduct]);
    
    toast({
      title: "Produto adicionado com sucesso",
      description: `${product.title} foi adicionado à lista de produtos.`,
    });
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    
    toast({
      title: "Produto removido",
      description: "O produto foi removido da lista.",
    });
  };

  const handleFeatureProduct = (productId: string, featured: boolean) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, featured } : p
    ));
    
    toast({
      title: featured ? "Produto destacado" : "Destaque removido",
      description: featured 
        ? "O produto foi adicionado aos destaques da semana." 
        : "O produto foi removido dos destaques da semana.",
    });
  };

  return (
    <AdminLayout title="Gerenciar Produtos">
      <div className="space-y-6">
        <Tabs defaultValue="add" className="w-full">
          <TabsList>
            <TabsTrigger value="add">Adicionar Produto</TabsTrigger>
            <TabsTrigger value="manage">Gerenciar Produtos</TabsTrigger>
            <TabsTrigger value="featured">Produtos em Destaque</TabsTrigger>
          </TabsList>
          
          <TabsContent value="add" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Novo Produto</CardTitle>
                <CardDescription>
                  Adicione produtos da Shopee ou Amazon utilizando links de afiliado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductForm onSubmit={handleAddProduct} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manage" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Todos os Produtos</CardTitle>
                <CardDescription>
                  Gerencie todos os produtos cadastrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductsList 
                  products={products} 
                  onRemove={handleRemoveProduct}
                  onFeature={handleFeatureProduct}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="featured" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Produtos em Destaque</CardTitle>
                <CardDescription>
                  Gerencie os produtos que aparecem na seção de destaques da semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductsList 
                  products={products.filter(p => p.featured)} 
                  onRemove={handleRemoveProduct}
                  onFeature={handleFeatureProduct}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ManageProducts;
