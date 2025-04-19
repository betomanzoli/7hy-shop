
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MarketplaceType } from '@/components/marketplace/MarketplaceLogo';

interface MarketplaceButtonProps {
  type: MarketplaceType;
  href: string;
  className?: string;
}

function MarketplaceButton({ type, href, className }: MarketplaceButtonProps) {
  const baseClasses = "flex-1 py-3 rounded-lg font-medium text-white";
  
  const marketplaceClasses = {
    amazon: "bg-marketplace-amazon hover:bg-marketplace-amazon/90",
    shopee: "bg-marketplace-shopee hover:bg-marketplace-shopee/90",
    mercadolivre: "bg-yellow-400 hover:bg-yellow-500"
  };
  
  const marketplaceNames = {
    amazon: "Amazon",
    shopee: "Shopee",
    mercadolivre: "Mercado Livre"
  };

  return (
    <a
      href={href}
      className={cn(baseClasses, marketplaceClasses[type], className)}
    >
      {marketplaceNames[type]}
    </a>
  );
}

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-muted/50 to-background">
      <div className="container px-4 py-20 md:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            As melhores ofertas<br className="hidden sm:inline" /> em um só lugar
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-muted-foreground md:text-xl">
            Descubra produtos incríveis das maiores lojas online com descontos exclusivos. 
            Curadoria feita especialmente para suas necessidades.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="sm:w-auto">
              <a href="/products">Ver Todas as Ofertas</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="sm:w-auto">
              <a href="/about">Saiba Mais</a>
            </Button>
          </div>
          
          <div className="p-4 bg-card rounded-xl shadow-sm border">
            <h2 className="mb-4 text-xl font-semibold">Navegue por Marketplace</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <MarketplaceButton type="amazon" href="/amazon" />
              <MarketplaceButton type="shopee" href="/shopee" />
              <MarketplaceButton type="mercadolivre" href="/mercadolivre" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
