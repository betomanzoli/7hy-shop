
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Search, CircleDollarSign, ShieldCheck, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MarketplaceLogo } from '@/components/marketplace/MarketplaceLogo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

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
              <div className="group flex items-center transform transition-all duration-300 hover:scale-110">
                <MarketplaceLogo type="amazon" size="md" />
              </div>
              <div className="group flex items-center transform transition-all duration-300 hover:scale-110">
                <MarketplaceLogo type="shopee" size="md" />
              </div>
              <div className="group flex items-center transform transition-all duration-300 hover:scale-110">
                <MarketplaceLogo type="mercadolivre" size="md" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm">Como Funciona</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tudo o que Você Precisa em Um Só Lugar</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nós simplificamos sua experiência de compras, mas a compra e o pagamento são sempre realizados 
              diretamente na plataforma original do marketplace.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pesquise & Compare</h3>
              <p className="text-muted-foreground">
                Busque produtos em diversos marketplaces simultaneamente e compare preços, avaliações e condições de entrega.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <CircleDollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Escolha o Melhor</h3>
              <p className="text-muted-foreground">
                Identifique o marketplace que oferece as melhores condições para o produto que você deseja comprar.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Compra Segura</h3>
              <p className="text-muted-foreground">
                Finalize sua compra diretamente no site oficial do marketplace escolhido, com toda a segurança e garantias.
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            <Alert className="max-w-3xl mx-auto">
              <Info className="h-4 w-4" />
              <AlertTitle>Importante</AlertTitle>
              <AlertDescription>
                O 7hy.shop não é uma loja virtual. Somos um agregador que facilita sua pesquisa e comparação de produtos. 
                Todas as compras e pagamentos são realizados diretamente nos sites oficiais dos marketplaces (Amazon, Shopee, Mercado Livre), 
                garantindo total segurança nas suas transações.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-blue-50 dark:bg-gray-900">
        <div className="container px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm">Benefícios</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que usar o 7hy.shop?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Economize tempo e dinheiro enquanto encontra os melhores produtos em múltiplas plataformas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Experiência Unificada de Compras</h3>
              <p className="text-muted-foreground">
                Navegue por produtos de diversos marketplaces em uma única interface intuitiva.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Comparação de Preços</h3>
              <p className="text-muted-foreground">
                Compare preços entre Amazon, Shopee e Mercado Livre para encontrar as melhores ofertas.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
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
      
      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm">Perguntas Frequentes</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Como Podemos Ajudar?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Respostas para as dúvidas mais comuns sobre o 7hy.shop
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-blue-50 dark:bg-gray-900 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Como o 7hy.shop ganha dinheiro?</h3>
              <p className="text-muted-foreground">
                Somos parceiros dos programas de afiliados oficiais da Amazon, Shopee e Mercado Livre. Quando você realiza uma compra através dos nossos links, recebemos uma pequena comissão, sem qualquer custo adicional para você.
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-gray-900 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Os preços são os mesmos dos sites oficiais?</h3>
              <p className="text-muted-foreground">
                Sim! Você verá exatamente os mesmos preços que estão nos sites oficiais dos marketplaces. Não adicionamos nenhuma taxa ou custo extra.
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-gray-900 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Onde faço o pagamento da minha compra?</h3>
              <p className="text-muted-foreground">
                Todas as compras e pagamentos são realizados diretamente nos sites oficiais dos marketplaces. O 7hy.shop apenas direciona você para o produto desejado no site oficial.
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
