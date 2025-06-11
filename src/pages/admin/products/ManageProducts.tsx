
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductForm } from '@/components/admin/products/ProductForm';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { ProductFromDB, useProducts } from '@/hooks/useProducts';
import { ProductGridWithSupabase } from '@/components/products/ProductGridWithSupabase';
import { supabase } from '@/integrations/supabase/client';

const ManageProducts = () => {
  const { toast } = useToast();
  const { products, loading, refetch } = useProducts({});
  const { products: featuredProducts, loading: featuredLoading, refetch: refetchFeatured } = useProducts({ featuredOnly: true });

  const handleAddProduct = async (product: Product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          title: product.title,
          description: product.description,
          short_description: product.category,
          price: product.price,
          original_price: product.originalPrice,
          currency: 'BRL',
          affiliate_url: product.affiliateUrl,
          original_url: product.affiliateUrl,
          image_url: product.imageUrl,
          marketplace: product.marketplace as any,
          marketplace_id: product.id,
          rating: product.rating,
          review_count: 0,
          is_featured: product.featured || false,
          is_deal: false,
          seller_name: 'Vendedor',
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Produto adicionado com sucesso",
        description: `${product.title} foi adicionado à lista de produtos.`,
      });

      refetch();
    } catch (error: any) {
      console.error('Erro ao adicionar produto:', error);
      toast({
        title: "Erro ao adicionar produto",
        description: error.message || "Ocorreu um erro ao adicionar o produto.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Produto removido",
        description: "O produto foi removido da lista.",
      });

      refetch();
      refetchFeatured();
    } catch (error: any) {
      console.error('Erro ao remover produto:', error);
      toast({
        title: "Erro ao remover produto",
        description: error.message || "Ocorreu um erro ao remover o produto.",
        variant: "destructive",
      });
    }
  };

  const handleFeatureProduct = async (productId: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_featured: featured })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: featured ? "Produto destacado" : "Destaque removido",
        description: featured 
          ? "O produto foi adicionado aos destaques da semana." 
          : "O produto foi removido dos destaques da semana.",
      });

      refetch();
      refetchFeatured();
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: "Erro ao atualizar produto",
        description: error.message || "Ocorreu um erro ao atualizar o produto.",
        variant: "destructive",
      });
    }
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
                  Gerencie todos os produtos cadastrados ({products.length} produtos)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductGridWithSupabase products={products} loading={loading} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="featured" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Produtos em Destaque</CardTitle>
                <CardDescription>
                  Gerencie os produtos que aparecem na seção de destaques da semana ({featuredProducts.length} produtos)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductGridWithSupabase products={featuredProducts} loading={featuredLoading} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ManageProducts;
