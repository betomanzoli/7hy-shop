
import React from 'react';
import { EnhancedProductCard } from './EnhancedProductCard';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ProductCategoryTabs } from './ProductCategoryTabs';
import { shopeeProducts, Product, ProductCategory } from '@/data/shopeeProducts';

interface ShopeeProductsGridProps {
  userId?: string;
  affiliateCode?: string;
}

export function ShopeeProductsGrid({ userId, affiliateCode }: ShopeeProductsGridProps) {
  // Get unique categories
  const categories = Array.from(new Set(shopeeProducts.map(product => product.category))) as ProductCategory[];
  
  return (
    <div className="w-full">
      <Tabs defaultValue="all" className="w-full">
        <ProductCategoryTabs categories={categories} />
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shopeeProducts.map(product => (
              <EnhancedProductCard 
                key={product.id}
                product={product}
                userId={userId}
                affiliateCode={affiliateCode}
              />
            ))}
          </div>
        </TabsContent>
        
        {categories.map(category => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {shopeeProducts
                .filter(product => product.category === category)
                .map(product => (
                  <EnhancedProductCard 
                    key={product.id}
                    product={product}
                    userId={userId}
                    affiliateCode={affiliateCode}
                  />
                ))
              }
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
