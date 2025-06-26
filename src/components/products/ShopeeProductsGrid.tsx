
import React from 'react';
import { EnhancedProductCard } from './EnhancedProductCard';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ProductCategoryTabs } from './ProductCategoryTabs';
import { shopeeProducts, ProductCategory, getWeeklyFeaturedProducts, ShopeeProduct } from '@/data/shopeeProducts';
import { Star } from 'lucide-react';
import { Product } from '@/types/product';

interface ShopeeProductsGridProps {
  userId?: string;
  affiliateCode?: string;
  showFeaturedSection?: boolean;
}

export function ShopeeProductsGrid({ userId, affiliateCode, showFeaturedSection = true }: ShopeeProductsGridProps) {
  // Get unique categories
  const categories = Array.from(new Set(shopeeProducts.map(product => product.category))) as ProductCategory[];
  
  // Get weekly featured products
  const featuredProducts = getWeeklyFeaturedProducts();
  
  // Convert shopeeProducts to match the Product type from types/product.ts
  const convertToProductType = (shopeeProduct: ShopeeProduct): Product => {
    return {
      id: shopeeProduct.id,
      title: shopeeProduct.title,
      price: shopeeProduct.price,
      original_price: shopeeProduct.originalPrice,
      description: shopeeProduct.description || '',
      image_url: shopeeProduct.imageUrl,
      affiliate_url: shopeeProduct.affiliateUrl || shopeeProduct.originalUrl,
      marketplace: shopeeProduct.marketplace,
      category: shopeeProduct.category,
      rating: shopeeProduct.rating,
      is_deal: shopeeProduct.isWeeklyFeatured,
      featured: shopeeProduct.isWeeklyFeatured
    };
  };
  
  return (
    <div className="w-full">
      {showFeaturedSection && featuredProducts.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            <h2 className="text-2xl font-bold">Produtos Selecionados da Semana</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <EnhancedProductCard 
                key={product.id}
                product={convertToProductType(product)}
                userId={userId}
                affiliateCode={affiliateCode}
                isFeatured={true}
              />
            ))}
          </div>
        </div>
      )}
      
      <Tabs defaultValue="all" className="w-full">
        <ProductCategoryTabs categories={categories} />
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shopeeProducts.map(product => (
              <EnhancedProductCard 
                key={product.id}
                product={convertToProductType(product)}
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
                    product={convertToProductType(product)}
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
