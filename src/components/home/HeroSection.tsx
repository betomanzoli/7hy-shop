
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
  const baseClasses = "flex-1 py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2";
  
  const marketplaceConfig = {
    amazon: {
      bg: "bg-marketplace-amazon hover:bg-marketplace-amazon/90",
      name: "Amazon",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.045 18.02c.072-.116.187-.18.315-.18.072 0 .153.027.234.09 5.443 4.248 12.6 6.57 18.918 6.57 3.582 0 6.79-.664 9.621-1.98.144-.072.279-.108.405-.108.198 0 .351.09.459.27.072.144.108.297.108.459 0 .18-.054.351-.162.513-.126.198-.315.306-.567.324-.405.036-.81-.018-1.215-.162-2.7 1.26-5.724 1.89-9.072 1.89-6.624 0-14.112-2.43-19.872-7.128-.126-.09-.225-.207-.297-.351-.054-.126-.081-.261-.081-.405.009-.153.045-.297.126-.423z"/>
          <path d="M20.106 15.714c-.144-.126-.315-.189-.513-.189-.126 0-.261.027-.405.081-.414.162-.846.306-1.296.432-1.53.414-3.096.621-4.698.621-2.16 0-4.266-.378-6.318-1.134-1.908-.702-3.654-1.746-5.238-3.132-.144-.126-.216-.297-.216-.513 0-.198.072-.378.216-.54.144-.144.324-.216.54-.216.198 0 .378.072.54.216 1.422 1.242 2.988 2.178 4.698 2.808 1.836.675 3.744 1.012 5.724 1.012 1.44 0 2.862-.189 4.266-.567.414-.108.819-.243 1.215-.405.126-.045.252-.072.378-.072.216 0 .405.081.567.243.144.144.216.324.216.54-.009.234-.099.432-.261.576z"/>
        </svg>
      )
    },
    shopee: {
      bg: "bg-marketplace-shopee hover:bg-marketplace-shopee/90",
      name: "Shopee",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.45 13.325c-.675 1.8-2.025 3.375-3.825 4.5-1.8 1.125-3.9 1.575-6 1.275-2.1-.3-4.05-1.275-5.625-2.85S3.225 12.45 2.925 10.35c-.3-2.1.15-4.2 1.275-6 1.125-1.8 2.7-3.15 4.5-3.825 1.8-.675 3.75-.675 5.55 0 1.8.675 3.375 2.025 4.5 3.825 1.125 1.8 1.575 3.9 1.275 6-.075.525-.225 1.05-.375 1.575z"/>
          <circle cx="8.25" cy="10.5" r="1.5"/>
          <circle cx="15.75" cy="10.5" r="1.5"/>
          <path d="M8.25 15c.75.75 1.875 1.125 3 1.125s2.25-.375 3-1.125"/>
        </svg>
      )
    }
  };

  const config = marketplaceConfig[type];

  return (
    <a
      href={href}
      className={cn(baseClasses, config.bg, className)}
    >
      {config.icon}
      <span>{config.name}</span>
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
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <MarketplaceButton type="amazon" href="/amazon" />
              <MarketplaceButton type="shopee" href="/shopee" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
