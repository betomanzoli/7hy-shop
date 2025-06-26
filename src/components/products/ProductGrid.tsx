
import React from 'react';
import { Product } from '@/types/product';
import { EnhancedProductCard } from './EnhancedProductCard';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <EnhancedProductCard 
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}
