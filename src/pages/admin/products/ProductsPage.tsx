
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Search, Edit, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ProductFromDB } from '@/hooks/useProducts';
import { Badge } from '@/components/ui/badge';
import { MarketplaceLogo } from '@/components/marketplace/MarketplaceLogo';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          title,
          price,
          original_price,
          marketplace,
          is_featured,
          is_deal,
          rating,
          review_count,
          seller_name,
          created_at,
          categories:category_id (
            name,
            slug
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (productId: string) => {
    toast.info(`Editar produto: ${productId}`);
    // TODO: Implementar navegação para página de edição
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);

        if (error) throw error;

        toast.success('Produto excluído com sucesso!');
        fetchProducts();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        toast.error('Erro ao excluir produto.');
      }
    }
  };

  const toggleFeatured = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_featured: !currentStatus })
        .eq('id', productId);

      if (error) throw error;

      toast.success(
        !currentStatus 
          ? 'Produto adicionado aos destaques!' 
          : 'Produto removido dos destaques!'
      );
      fetchProducts();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast.error('Erro ao atualizar produto.');
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Gerenciar Produtos</CardTitle>
          <Button onClick={() => toast.info('Navegar para adicionar novo produto')}>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Produto
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-sm"
            />
            <Search className="ml-2 h-4 w-4 text-gray-500" />
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Carregando produtos...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Marketplace</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length ? (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  {product.title.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-sm max-w-xs truncate">
                                {product.title}
                              </div>
                              {product.seller_name && (
                                <div className="text-xs text-muted-foreground">
                                  {product.seller_name}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              R$ {product.price.toFixed(2)}
                            </div>
                            {product.original_price && product.original_price > product.price && (
                              <div className="text-xs text-muted-foreground line-through">
                                R$ {product.original_price.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <MarketplaceLogo marketplace={product.marketplace} size="sm" />
                        </TableCell>
                        <TableCell>
                          {product.categories ? (
                            <Badge variant="outline">{product.categories.name}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">Sem categoria</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {product.rating ? (
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{product.rating.toFixed(1)}</span>
                              {product.review_count && (
                                <span className="text-xs text-muted-foreground">
                                  ({product.review_count})
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            {product.is_featured && (
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                Destaque
                              </Badge>
                            )}
                            {product.is_deal && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                Oferta
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                                <Edit className="mr-2 h-4 w-4" /> Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleFeatured(product.id, product.is_featured || false)}>
                                <Star className="mr-2 h-4 w-4" />
                                {product.is_featured ? 'Remover destaque' : 'Destacar'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        {searchTerm ? 'Nenhum produto encontrado para sua busca.' : 'Nenhum produto cadastrado.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
