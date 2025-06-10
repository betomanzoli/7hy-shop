import React from 'react';
import { PersonalizedRecommendations } from '@/components/recommendations/PersonalizedRecommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function IndexPage() {
  // Você pode obter o userId de um contexto de autenticação, se tiver um
  const userId = 'user-example-123'; // Exemplo: substitua por um ID de usuário real

  const handleProductClick = (productId: string) => {
    console.log(`Produto ${productId} clicado na página inicial.`);
    // Lógica para navegar para a página de detalhes do produto
    // Ex: navigate(`/product/${productId}`);
  };

  const handleAddToWishlist = (productId: string) => {
    console.log(`Produto ${productId} adicionado à wishlist.`);
    // Lógica para adicionar o produto à wishlist do usuário
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo ao 7hy-Shop: Seu Guia Inteligente de Compras!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Encontre as melhores ofertas na Amazon e Shopee, compare produtos e descubra recomendações personalizadas.
        </p>
        <div className="space-x-4">
          <Button asChild size="lg">
            <Link to="/products">Explorar Produtos</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/compare">Comparar Produtos</Link>
          </Button>
        </div>
      </div>

      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Recomendações para Você</CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalizedRecommendations 
              userId={userId} 
              onProductClick={handleProductClick}
              onAddToWishlist={handleAddToWishlist}
            />
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Comece a Comparar Agora!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Cole as URLs de produtos da Amazon e Shopee e veja lado a lado as diferenças de preço, especificações e avaliações.
            </p>
            <Button asChild size="lg">
              <Link to="/compare">Ir para Comparação</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Você pode adicionar mais seções aqui, como produtos em destaque, categorias populares, etc. */}

    </div>
  );
}
