
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Cart = () => {
  return (
    <MainLayout>
      <div className="container px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Seu Carrinho</h1>
          
          <div className="bg-muted/30 p-12 rounded-lg flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Seu carrinho está vazio</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              O 7hy.shop não possui um carrinho próprio, pois todas as compras são realizadas diretamente nos sites oficiais dos marketplaces.
            </p>
            <Link to="/products">
              <Button>Explorar Produtos</Button>
            </Link>
          </div>
          
          <Alert className="mt-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Como funciona o processo de compra</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                O 7hy.shop é um agregador de produtos que te ajuda a encontrar as melhores ofertas em diversos marketplaces.
              </p>
              <ol className="list-decimal ml-5 space-y-2 mb-4">
                <li>Você pesquisa e compara produtos de diferentes marketplaces em nossa plataforma</li>
                <li>Ao encontrar o produto desejado, clique em "Comprar"</li>
                <li>Você será redirecionado para o site oficial do marketplace (Amazon, Shopee ou Mercado Livre)</li>
                <li>A finalização da compra e o pagamento acontecem diretamente no site do marketplace</li>
              </ol>
              <p>
                Esta abordagem garante total segurança nas suas transações, aproveitando os sistemas de pagamento e proteção ao consumidor de cada marketplace.
              </p>
            </AlertDescription>
          </Alert>
          
          <div className="mt-12 text-center">
            <h3 className="text-lg font-medium mb-4">Pronto para descobrir ótimas ofertas?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/amazon">
                <Button variant="outline" className="gap-2">
                  Explorar Amazon
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/shopee">
                <Button variant="outline" className="gap-2">
                  Explorar Shopee
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/mercadolivre">
                <Button variant="outline" className="gap-2">
                  Explorar Mercado Livre
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Cart;
