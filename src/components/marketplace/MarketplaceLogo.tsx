
import React from 'react';
import { Badge } from '@/components/ui/badge';

export type MarketplaceType = 'amazon' | 'shopee' | 'mercadolivre';

interface MarketplaceLogoProps {
  type: MarketplaceType;
  size?: 'sm' | 'md' | 'lg';
  withName?: boolean;
  className?: string;
}

export function MarketplaceLogo({ type, size = 'md', withName = true, className = '' }: MarketplaceLogoProps) {
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
          <div className={`${dimensions[size]} ${className} flex items-center justify-center bg-marketplace-amazon text-white rounded-lg`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M.045 18.02c.072-.116.187-.18.315-.18.072 0 .153.027.234.09 5.443 4.248 12.6 6.57 18.918 6.57 3.582 0 6.79-.664 9.621-1.98.144-.072.279-.108.405-.108.198 0 .351.09.459.27.072.144.108.297.108.459 0 .18-.054.351-.162.513-.126.198-.315.306-.567.324-.405.036-.81-.018-1.215-.162-2.7 1.26-5.724 1.89-9.072 1.89-6.624 0-14.112-2.43-19.872-7.128-.126-.09-.225-.207-.297-.351-.054-.126-.081-.261-.081-.405.009-.153.045-.297.126-.423z"/>
              <path d="M20.106 15.714c-.144-.126-.315-.189-.513-.189-.126 0-.261.027-.405.081-.414.162-.846.306-1.296.432-1.53.414-3.096.621-4.698.621-2.16 0-4.266-.378-6.318-1.134-1.908-.702-3.654-1.746-5.238-3.132-.144-.126-.216-.297-.216-.513 0-.198.072-.378.216-.54.144-.144.324-.216.54-.216.198 0 .378.072.54.216 1.422 1.242 2.988 2.178 4.698 2.808 1.836.675 3.744 1.012 5.724 1.012 1.44 0 2.862-.189 4.266-.567.414-.108.819-.243 1.215-.405.126-.045.252-.072.378-.072.216 0 .405.081.567.243.144.144.216.324.216.54-.009.234-.099.432-.261.576z"/>
            </svg>
          </div>
        );
      case 'shopee':
        return (
          <div className={`${dimensions[size]} ${className} flex items-center justify-center bg-marketplace-shopee text-white rounded-lg`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M21.45 13.325c-.675 1.8-2.025 3.375-3.825 4.5-1.8 1.125-3.9 1.575-6 1.275-2.1-.3-4.05-1.275-5.625-2.85S3.225 12.45 2.925 10.35c-.3-2.1.15-4.2 1.275-6 1.125-1.8 2.7-3.15 4.5-3.825 1.8-.675 3.75-.675 5.55 0 1.8.675 3.375 2.025 4.5 3.825 1.125 1.8 1.575 3.9 1.275 6-.075.525-.225 1.05-.375 1.575z"/>
              <circle cx="8.25" cy="10.5" r="1.5"/>
              <circle cx="15.75" cy="10.5" r="1.5"/>
              <path d="M8.25 15c.75.75 1.875 1.125 3 1.125s2.25-.375 3-1.125"/>
            </svg>
          </div>
        );
      case 'mercadolivre':
        return (
          <div className={`${dimensions[size]} ${className} flex items-center justify-center bg-yellow-500 text-black rounded-lg`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            </svg>
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
