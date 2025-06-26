
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Star, TrendingUp, Award } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  marketplace: string;
  imageUrl?: string;
}

export const ProductComparator = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    originalPrice: '',
    rating: '',
    marketplace: 'Amazon'
  });

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error('Nome e preço são obrigatórios');
      return;
    }

    if (products.length >= 3) {
      toast.error('Máximo de 3 produtos para comparação');
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
      rating: parseFloat(newProduct.rating) || 0,
      marketplace: newProduct.marketplace
    };

    setProducts([...products, product]);
    setNewProduct({
      name: '',
      price: '',
      originalPrice: '',
      rating: '',
      marketplace: 'Amazon'
    });
    toast.success('Produto adicionado à comparação');
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Produto removido da comparação');
  };

  const getBestPrice = () => {
    if (products.length === 0) return null;
    return Math.min(...products.map(p => p.price));
  };

  const getBestRating = () => {
    if (products.length === 0) return null;
    return Math.max(...products.map(p => p.rating));
  };

  const getBestValue = () => {
    if (products.length === 0) return null;
    return products.reduce((best, current) => {
      const currentValue = current.rating / current.price;
      const bestValue = best.rating / best.price;
      return currentValue > bestValue ? current : best;
    });
  };

  const bestPrice = getBestPrice();
  const bestRating = getBestRating();
  const bestValue = getBestValue();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Comparador de Produtos
          </CardTitle>
          <CardDescription>
            Compare até 3 produtos lado a lado para tomar a melhor decisão
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Input
              placeholder="Nome do produto"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            />
            <Input
              placeholder="Preço (R$)"
              type="number"
              step="0.01"
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            />
            <Input
              placeholder="Preço original (R$)"
              type="number"
              step="0.01"
              value={newProduct.originalPrice}
              onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
            />
            <Input
              placeholder="Avaliação (0-5)"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={newProduct.rating}
              onChange={(e) => setNewProduct({...newProduct, rating: e.target.value})}
            />
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={newProduct.marketplace}
              onChange={(e) => setNewProduct({...newProduct, marketplace: e.target.value})}
            >
              <option value="Amazon">Amazon</option>
              <option value="Shopee">Shopee</option>
              <option value="MercadoLivre">MercadoLivre</option>
            </select>
            <Button onClick={addProduct} className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>

          {products.length > 0 && (
            <>
              <Separator className="my-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="relative">
                    <CardContent className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-red-500 hover:bg-red-50"
                        onClick={() => removeProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                          <Badge variant="outline" className="text-xs mt-1">
                            {product.marketplace}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-green-600">
                              R$ {product.price.toFixed(2)}
                            </span>
                            {product.price === bestPrice && (
                              <Badge className="bg-green-600 text-xs">
                                Melhor Preço
                              </Badge>
                            )}
                          </div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500 line-through">
                                R$ {product.originalPrice.toFixed(2)}
                              </span>
                              <Badge variant="destructive" className="text-xs">
                                {(((product.originalPrice - product.price) / product.originalPrice) * 100).toFixed(0)}% OFF
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm ml-1">{product.rating.toFixed(1)}</span>
                          </div>
                          {product.rating === bestRating && (
                            <Badge className="bg-yellow-600 text-xs">
                              Melhor Avaliação
                            </Badge>
                          )}
                        </div>
                        
                        {bestValue && product.id === bestValue.id && (
                          <Badge className="bg-purple-600 text-xs w-full justify-center">
                            <Award className="w-3 h-3 mr-1" />
                            Melhor Custo-Benefício
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {products.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Adicione produtos para começar a comparação</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
