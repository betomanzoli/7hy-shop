import React from 'react';
import { AutoProductForm } from '@/components/admin/products/AutoProductForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface ProductData {
  title: string;
  price: number;
  marketplace: string;
  // Adicione outros campos relevantes do produto aqui
}

export default function NewProductPage( ) {
  const handleProductScraped = (product: ProductData) => {
    toast.success(`Produto '${product.title}' extraído com sucesso!`);
    console.log('Produto extraído:', product);
    // Aqui você pode pré-popular um formulário de revisão ou exibir os dados extraídos
  };

  const handleProductSaved = (productId: string) => {
    toast.success(`Produto com ID '${productId}' salvo no banco de dados!`);
    console.log('Produto salvo:', productId);
    // Redirecionar para a página de listagem de produtos ou exibir mensagem de sucesso
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Adicionar Novo Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Cole a URL de um produto da Amazon ou Shopee abaixo para extrair automaticamente seus detalhes e adicioná-lo ao seu catálogo.
          </p>
          <AutoProductForm
            onProductScraped={handleProductScraped}
            onProductSaved={handleProductSaved}
          />
        </CardContent>
      </Card>
    </div>
  );
}
