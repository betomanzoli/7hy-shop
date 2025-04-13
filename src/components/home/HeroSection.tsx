
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { MarketplaceLogo } from '@/components/marketplace/MarketplaceLogo';

export function HeroSection() {
  return (
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
  );
}
