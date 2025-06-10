import React, { useState, useEffect } from 'react';
import { ProductComparison } from '@/components/products/ProductComparison';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProductForComparison {
  id: string;
  title: string;
  price: number;
  marketplace: string;
  imageUrl: string;
  // Adicione outros campos relevantes para comparação
}

export default function ComparisonPage() {
  const [productUrls, setProductUrls] = useState<string[]>(['', '']);
  const [productsToCompare, setProductsToCompare] = useState<ProductForComparison[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...productUrls];
    newUrls[index] = value;
    setProductUrls(newUrls);
  };

  const addUrlInput = () => {
    setProductUrls([...productUrls, '']);
  };

  const removeUrlInput = (index: number) => {
    const newUrls = productUrls.filter((_, i) => i !== index);
    setProductUrls(newUrls);
  };

  const fetchProductDetails = async (url: string): Promise<ProductForComparison | null> => {
    try {
      // Chamada para o endpoint de scraping da sua API Flask
      const response = await fetch('http://localhost:5000/api/scrape-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url } ),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao extrair dados do produto.');
      }

      const data = await response.json();
      // Mapear os dados do scraper para o formato esperado pelo ProductComparison
      return {
        id: data.marketplace_id || data.id, // Usar marketplace_id ou um ID gerado
        title: data.title,
        price: data.price,
        marketplace: data.marketplace,
        imageUrl: data.image_url,
        // ... outros campos que você queira passar para comparação
      };
    } catch (error: any) {
      console.error(`Erro ao buscar detalhes do produto da URL ${url}:`, error);
      toast.error(`Falha ao carregar produto: ${error.message}`);
      return null;
    }
  };

  const handleCompare = async () => {
    setLoading(true);
    const validUrls = productUrls.filter(url => url.trim() !== '');
    if (validUrls.length < 2) {
      toast.error('Por favor, insira pelo menos duas URLs de produtos para comparar.');
      setLoading(false);
      return;
    }

    const fetchedProducts: ProductForComparison[] = [];
    for (const url of validUrls) {
      const product = await fetchProductDetails(url);
      if (product) {
        fetchedProducts.push(product);
      }
    }

    if (fetchedProducts.length < 2) {
      toast.error('Não foi possível obter detalhes suficientes para a comparação. Verifique as URLs.');
      setLoading(false);
      return;
    }

    setProductsToCompare(fetchedProducts);
    setLoading(false);
    toast.success('Produtos prontos para comparação!');
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Comparar Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Cole as URLs de produtos da Amazon ou Shopee que você deseja comparar.
          </p>
          <div className="space-y-4 mb-6">
            {productUrls.map((url, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder="URL do Produto (Amazon ou Shopee)"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                />
                {productUrls.length > 2 && (
                  <Button variant="outline" size="icon" onClick={() => removeUrlInput(index)}>
                    X
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={addUrlInput}>
              Adicionar mais URL
            </Button>
          </div>
          <Button onClick={handleCompare} disabled={loading || productUrls.filter(url => url.trim() !== '').length < 2}>
            {loading ? 'Carregando...' : 'Comparar Produtos'}
          </Button>
        </CardContent>
      </Card>

      {productsToCompare.length > 0 && (
        <div className="mt-8">
          <ProductComparison products={productsToCompare} />
        </div>
      )}
    </div>
  );
}
