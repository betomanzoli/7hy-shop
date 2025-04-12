
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container px-4 py-20 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Seu Hub de Integração <span className="text-brand-600">de Marketplaces</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
            Descubra produtos da Amazon, Shopee e Mercado Livre em um só lugar. Compre de forma mais inteligente, rápida e fácil com 7hy.shop.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/products">
              <Button size="lg" className="gap-2">
                <ShoppingBag className="h-5 w-5" />
                Ver Produtos
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="gap-2">
                Saiba Mais
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Marketplace Logos */}
        <div className="container px-4 pb-12 flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <p className="text-sm text-center text-muted-foreground mb-6">
              Integrado com seus marketplaces favoritos
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="flex items-center h-8">
                <div className="marketplace-icon amazon mr-2">A</div>
                <span className="font-semibold">Amazon</span>
              </div>
              <div className="flex items-center h-8">
                <div className="marketplace-icon shopee mr-2">S</div>
                <span className="font-semibold">Shopee</span>
              </div>
              <div className="flex items-center h-8">
                <div className="marketplace-icon mercadolivre mr-2">M</div>
                <span className="font-semibold">Mercado Livre</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tudo o que Você Precisa em Um Só Lugar</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compre em várias plataformas sem o incômodo de alternar entre sites.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 dark:bg-gray-900 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Experiência Unificada de Compras</h3>
              <p className="text-muted-foreground">
                Navegue por produtos de diversos marketplaces em uma única interface intuitiva.
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-gray-900 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Checkout Simplificado</h3>
              <p className="text-muted-foreground">
                Um carrinho para todas as suas compras, independentemente do marketplace de origem.
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-gray-900 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Produtos Verificados</h3>
              <p className="text-muted-foreground">
                Todos os anúncios são verificados quanto à autenticidade e qualidade em todos os marketplaces.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-brand-600 text-white">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para Transformar sua Experiência de Compras?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a milhares de compradores satisfeitos que simplificaram suas compras online com o 7hy.shop.
          </p>
          <Link to="/products">
            <Button size="lg" variant="secondary" className="gap-2">
              Comece a Comprar Agora
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
