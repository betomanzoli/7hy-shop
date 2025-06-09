// =====================================================
// Sistema de Automação de Cadastro de Produtos
// Componente: AutoProductForm.tsx
// =====================================================

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink, Check, X, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// Schema de validação
const urlSchema = z.object({
  url: z.string().url({ message: 'Por favor, insira uma URL válida' }),
});

// Tipos
interface ScrapedProduct {
  title: string;
  price: number;
  originalPrice?: number;
  description: string;
  imageUrl: string;
  additionalImages: string[];
  marketplace: 'amazon' | 'shopee';
  marketplaceId: string;
  rating?: number;
  reviewCount?: number;
  isInStock: boolean;
  specifications: Record<string, any>;
  features: string[];
  sellerName?: string;
  category?: string;
}

interface AutoProductFormProps {
  onProductScraped: (product: ScrapedProduct) => void;
  onProductSaved: (productId: string) => void;
}

export function AutoProductForm({ onProductScraped, onProductSaved }: AutoProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedProduct, setScrapedProduct] = useState<ScrapedProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: '',
    },
  });

  // Função para detectar marketplace pela URL
  const detectMarketplace = (url: string): 'amazon' | 'shopee' | null => {
    if (url.includes('amazon.com') || url.includes('amazon.com.br')) {
      return 'amazon';
    }
    if (url.includes('shopee.com') || url.includes('shopee.com.br')) {
      return 'shopee';
    }
    return null;
  };

  // Função para extrair ID do produto
  const extractProductId = (url: string, marketplace: 'amazon' | 'shopee'): string | null => {
    if (marketplace === 'amazon') {
      const asinMatch = url.match(/\/([A-Z0-9]{10})(?:[/?]|$)/);
      return asinMatch ? asinMatch[1] : null;
    }
    
    if (marketplace === 'shopee') {
      const idMatch = url.match(/\.(\d+)\.(\d+)$/);
      return idMatch ? `${idMatch[1]}.${idMatch[2]}` : null;
    }
    
    return null;
  };

  // Função principal de scraping
  const scrapeProduct = async (url: string): Promise<ScrapedProduct> => {
    const marketplace = detectMarketplace(url);
    if (!marketplace) {
      throw new Error('Marketplace não suportado. Use links da Amazon ou Shopee.');
    }

    const productId = extractProductId(url, marketplace);
    if (!productId) {
      throw new Error('Não foi possível extrair o ID do produto da URL.');
    }

    // Simular chamada para API de scraping
    const response = await fetch('/api/scrape-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, marketplace, productId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao extrair dados do produto');
    }

    return await response.json();
  };

  // Handler para submissão do formulário
  const onSubmit = async (values: z.infer<typeof urlSchema>) => {
    setIsLoading(true);
    setError(null);
    setScrapedProduct(null);

    try {
      const product = await scrapeProduct(values.url);
      setScrapedProduct(product);
      onProductScraped(product);
      toast.success('Produto extraído com sucesso!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler para salvar produto
  const handleSaveProduct = async () => {
    if (!scrapedProduct) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scrapedProduct),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar produto');
      }

      const savedProduct = await response.json();
      onProductSaved(savedProduct.id);
      toast.success('Produto salvo com sucesso!');
      
      // Reset form
      form.reset();
      setScrapedProduct(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar produto';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Handler para nova extração
  const handleNewExtraction = () => {
    setScrapedProduct(null);
    setError(null);
    form.reset();
  };

  return (
    <div className="space-y-6">
      {/* Formulário de URL */}
      <Card>
        <CardHeader>
          <CardTitle>Cadastro Automático de Produto</CardTitle>
          <CardDescription>
            Cole o link do produto da Amazon ou Shopee para extrair automaticamente todas as informações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Produto</FormLabel>
                    <FormControl>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="https://www.amazon.com.br/produto... ou https://shopee.com.br/produto..."
                          {...field}
                          disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading || !field.value}>
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Extrair'
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Suportamos links da Amazon e Shopee Brasil
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <X className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Preview do produto extraído */}
      {scrapedProduct && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Produto Extraído</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleNewExtraction}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Nova Extração
                </Button>
                <Button onClick={handleSaveProduct} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Salvar Produto
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Imagem do produto */}
              <div className="space-y-4">
                <img
                  src={scrapedProduct.imageUrl}
                  alt={scrapedProduct.title}
                  className="w-full h-64 object-cover rounded-lg border"
                />
                {scrapedProduct.additionalImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {scrapedProduct.additionalImages.slice(0, 4).map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${scrapedProduct.title} - ${index + 1}`}
                        className="w-full h-16 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Informações do produto */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{scrapedProduct.title}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant={scrapedProduct.marketplace === 'amazon' ? 'default' : 'secondary'}>
                      {scrapedProduct.marketplace === 'amazon' ? 'Amazon' : 'Shopee'}
                    </Badge>
                    <Badge variant={scrapedProduct.isInStock ? 'default' : 'destructive'}>
                      {scrapedProduct.isInStock ? 'Em Estoque' : 'Fora de Estoque'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-green-600">
                      R$ {scrapedProduct.price.toFixed(2)}
                    </span>
                    {scrapedProduct.originalPrice && scrapedProduct.originalPrice > scrapedProduct.price && (
                      <span className="text-sm text-gray-500 line-through">
                        R$ {scrapedProduct.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  {scrapedProduct.rating && (
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">★</span>
                      <span>{scrapedProduct.rating.toFixed(1)}</span>
                      {scrapedProduct.reviewCount && (
                        <span className="text-gray-500">({scrapedProduct.reviewCount} avaliações)</span>
                      )}
                    </div>
                  )}
                </div>

                {scrapedProduct.description && (
                  <div>
                    <h4 className="font-medium mb-1">Descrição</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {scrapedProduct.description}
                    </p>
                  </div>
                )}

                {scrapedProduct.features.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-1">Características</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {scrapedProduct.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-1">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {scrapedProduct.sellerName && (
                  <div>
                    <h4 className="font-medium mb-1">Vendedor</h4>
                    <p className="text-sm text-gray-600">{scrapedProduct.sellerName}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Especificações técnicas */}
            {Object.keys(scrapedProduct.specifications).length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">Especificações Técnicas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {Object.entries(scrapedProduct.specifications).slice(0, 6).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-medium">{key}:</span>
                      <span className="text-gray-600">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

