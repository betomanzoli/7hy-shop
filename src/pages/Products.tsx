import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Star, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface Product {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  marketplace: 'amazon' | 'shopee' | 'mercadolivre';
  image_url: string;
  rating?: number;
  review_count?: number;
  affiliate_url: string;
  category?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterMarketplace, setFilterMarketplace] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const productsPerPage = 12; // Número de produtos por página

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/search?q=${searchTerm}&page=${currentPage}&limit=${productsPerPage}&sort=${sortBy}`;
      if (filterMarketplace !== 'all' ) {
        url += `&marketplace=${filterMarketplace}`;
      }
      if (filterCategory !== 'all') {
        url += `&category=${filterCategory}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos');
      }
      const data = await response.json();
      setProducts(data.results);
      setTotalPages(Math.ceil(data.total / productsPerPage));
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, currentPage, sortBy, filterMarketplace, filterCategory]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Resetar para a primeira página na nova busca
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleMarketplaceFilterChange = (value: string) => {
    setFilterMarketplace(value);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (value: string) => {
    setFilterCategory(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Todos os Produtos</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Input
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="col-span-full md:col-span-2"
        />
        <Select onValueChange={handleSortChange} defaultValue={sortBy}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevância</SelectItem>
            <SelectItem value="price_asc">Preço: Menor para Maior</SelectItem>
            <SelectItem value="price_desc">Preço: Maior para Menor</SelectItem>
            <SelectItem value="rating">Avaliação</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handleMarketplaceFilterChange} defaultValue={filterMarketplace}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrar por Marketplace" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="amazon">Amazon</SelectItem>
            <SelectItem value="shopee">Shopee</SelectItem>
            <SelectItem value="mercadolivre">Mercado Livre</SelectItem>
          </SelectContent>
        </Select>
        {/* Você pode adicionar um Select para categorias aqui, se tiver uma lista de categorias */}
        {/* <Select onValueChange={handleCategoryFilterChange} defaultValue={filterCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrar por Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="electronics">Eletrônicos</SelectItem>
            <SelectItem value="home">Casa</SelectItem>
          </SelectContent>
        </Select> */}
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Carregando produtos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <Card key={product.id} className="flex flex-col h-full">
                <CardHeader className="pb-2">
                  <div className="relative w-full h-48 overflow-hidden rounded-md">
                    <img
                      src={product.image_url || 'https://via.placeholder.com/150'}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <Badge className="absolute top-2 left-2 capitalize">
                      {product.marketplace}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold line-clamp-2 mb-2">{product.title}</h3>
                    <div className="flex items-center mb-2">
                      <span className="text-xl font-bold text-green-600">R$ {product.price.toFixed(2 )}</span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-sm text-gray-500 line-through ml-2">R$ {product.original_price.toFixed(2)}</span>
                      )}
                    </div>
                    {product.rating && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{product.rating.toFixed(1)} ({product.review_count || 0} avaliações)</span>
                      </div>
                    )}
                  </div>
                  <Button asChild className="mt-4 w-full">
                    <a href={product.affiliate_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Ver na {product.marketplace === 'amazon' ? 'Amazon' : product.marketplace === 'shopee' ? 'Shopee' : 'Loja'}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">Nenhum produto encontrado com os critérios de busca.</p>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <Button
                  variant={currentPage === index + 1 ? 'default' : 'outline'}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Button>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
