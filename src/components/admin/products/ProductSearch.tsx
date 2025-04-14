
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MarketplaceType } from '@/components/marketplace/MarketplaceLogo';

type SearchMarketplaceType = MarketplaceType | 'all';

interface ProductSearchProps {
  onProductsFound?: (products: any[]) => void;
}

export function ProductSearch({ onProductsFound }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [marketplace, setMarketplace] = useState<SearchMarketplaceType>('all');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: "Termo de busca vazio",
        description: "Por favor, digite algo para pesquisar",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API search
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock products data
      const mockProducts = [
        {
          id: '1',
          title: 'Smartphone XYZ 128GB',
          price: 1299.99,
          marketplace: 'amazon' as MarketplaceType,
          imageUrl: 'https://placehold.co/200x200',
          rating: 4.5,
          affiliateUrl: 'https://amazon.com/product/1?tag=affiliate-tag'
        },
        {
          id: '2',
          title: 'Notebook Ultra Slim 15"',
          price: 3499.99,
          marketplace: 'amazon' as MarketplaceType,
          imageUrl: 'https://placehold.co/200x200',
          rating: 4.2,
          affiliateUrl: 'https://amazon.com/product/2?tag=affiliate-tag'
        },
        {
          id: '3',
          title: 'Smartwatch Sport Fitness',
          price: 499.99,
          marketplace: 'shopee' as MarketplaceType,
          imageUrl: 'https://placehold.co/200x200',
          rating: 4.0,
          affiliateUrl: 'https://shopee.com.br/product/3?tag=affiliate-tag'
        }
      ];
      
      // Filter by marketplace if needed
      const filteredProducts = marketplace === 'all' 
        ? mockProducts 
        : mockProducts.filter(p => p.marketplace === marketplace);
      
      if (filteredProducts.length === 0) {
        toast({
          title: "Nenhum produto encontrado",
          description: `Não encontramos produtos para "${searchQuery}" no marketplace selecionado`,
        });
      } else {
        toast({
          title: "Produtos encontrados",
          description: `Encontrados ${filteredProducts.length} produtos para "${searchQuery}"`,
        });
        
        if (onProductsFound) {
          onProductsFound(filteredProducts);
        }
      }
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buscar Produtos</CardTitle>
        <CardDescription>
          Pesquise produtos nas plataformas conectadas usando suas contas de afiliado
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSearch}>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Smartphone, notebook, fones de ouvido..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-40">
              <Select 
                value={marketplace} 
                onValueChange={(value) => setMarketplace(value as SearchMarketplaceType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Plataforma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="amazon">Amazon</SelectItem>
                  <SelectItem value="shopee">Shopee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Buscar Produtos
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
