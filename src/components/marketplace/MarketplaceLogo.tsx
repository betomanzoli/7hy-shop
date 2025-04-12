
import React from 'react';
import { Badge } from '@/components/ui/badge';

type MarketplaceType = 'amazon' | 'shopee' | 'mercadolivre';

interface MarketplaceLogoProps {
  type: MarketplaceType;
  size?: 'sm' | 'md' | 'lg';
  withName?: boolean;
}

export function MarketplaceLogo({ type, size = 'md', withName = true }: MarketplaceLogoProps) {
  const dimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const fontSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl'
  };

  const getLogoContent = () => {
    switch (type) {
      case 'amazon':
        return (
          <div className={`${dimensions[size]} flex items-center justify-center bg-marketplace-amazon text-white rounded-full`}>
            <span className={`${fontSize[size]} font-bold`}>A</span>
          </div>
        );
      case 'shopee':
        return (
          <div className={`${dimensions[size]} flex items-center justify-center bg-marketplace-shopee text-white rounded-full`}>
            <span className={`${fontSize[size]} font-bold`}>S</span>
          </div>
        );
      case 'mercadolivre':
        return (
          <div className={`${dimensions[size]} flex items-center justify-center bg-marketplace-mercadolivre text-black rounded-full`}>
            <span className={`${fontSize[size]} font-bold`}>M</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getName = () => {
    switch (type) {
      case 'amazon':
        return 'Amazon';
      case 'shopee':
        return 'Shopee';
      case 'mercadolivre':
        return 'Mercado Livre';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {getLogoContent()}
      {withName && <span className="font-medium">{getName()}</span>}
    </div>
  );
}
