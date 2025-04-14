import React from 'react';
import { EnhancedProductCard } from './EnhancedProductCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarketplaceType } from '@/components/marketplace/MarketplaceLogo';

// Define product category types
type ProductCategory = 'electronics' | 'fashion' | 'home' | 'beauty' | 'accessories' | 'sports' | 'other';

// Define product interface
interface Product {
  id: string;
  title: string;
  price: number;
  marketplace: MarketplaceType;
  imageUrl: string;
  rating?: number;
  originalUrl: string;
  marketplaceId: string;
  category: ProductCategory;
}

// Sample product data based on the Shopee affiliate links
const shopeeProducts: Product[] = [
  // Electronics Category
  {
    id: 'shopee-1',
    title: 'Smartphone com Carregamento Rápido',
    price: 799.99,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Smartphone',
    rating: 4.5,
    originalUrl: 'https://s.shopee.com.br/5puqNwGojV',
    marketplaceId: '18357850294',
    category: 'electronics'
  },
  {
    id: 'shopee-2',
    title: 'Fone de Ouvido Bluetooth',
    price: 129.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Fone+Bluetooth',
    rating: 4.2,
    originalUrl: 'https://s.shopee.com.br/5VHzzLHc6C',
    marketplaceId: '18357850294',
    category: 'electronics'
  },
  {
    id: 'shopee-3',
    title: 'Smart TV 43 Polegadas 4K',
    price: 1599.00,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Smart+TV',
    rating: 4.7,
    originalUrl: 'https://s.shopee.com.br/20i7ov4Cj2',
    marketplaceId: '18357850294',
    category: 'electronics'
  },
  {
    id: 'shopee-4',
    title: 'Notebook Ultrafino',
    price: 2799.00,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Notebook',
    rating: 4.6,
    originalUrl: 'https://s.shopee.com.br/VtK2BIJIG',
    marketplaceId: '18357850294',
    category: 'electronics'
  },
  
  // Fashion Category
  {
    id: 'shopee-5',
    title: 'Calça Jeans Feminina',
    price: 89.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Cal%C3%A7a+Jeans',
    rating: 4.1,
    originalUrl: 'https://s.shopee.com.br/7KjeAmzsqz',
    marketplaceId: '18357850294',
    category: 'fashion'
  },
  {
    id: 'shopee-6',
    title: 'Camiseta Básica Masculina',
    price: 39.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Camiseta',
    rating: 4.3,
    originalUrl: 'https://s.shopee.com.br/4fiszua1ul',
    marketplaceId: '18357850294',
    category: 'fashion'
  },
  {
    id: 'shopee-7',
    title: 'Vestido Midi Estampado',
    price: 119.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Vestido',
    rating: 4.5,
    originalUrl: 'https://s.shopee.com.br/7fMUZTWCG3',
    marketplaceId: '18357850294',
    category: 'fashion'
  },
  
  // Home & Decoration
  {
    id: 'shopee-8',
    title: 'Conjunto de Panelas Antiaderentes',
    price: 259.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Panelas',
    rating: 4.7,
    originalUrl: 'https://s.shopee.com.br/x3RQTNCw',
    marketplaceId: '18357850294',
    category: 'home'
  },
  {
    id: 'shopee-9',
    title: 'Jogo de Cama Casal',
    price: 129.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Jogo+de+Cama',
    rating: 4.4,
    originalUrl: 'https://s.shopee.com.br/1qOhcnr7hN',
    marketplaceId: '18357850294',
    category: 'home'
  },
  {
    id: 'shopee-10',
    title: 'Luminária de Mesa LED',
    price: 79.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Lumin%C3%A1ria',
    rating: 4.2,
    originalUrl: 'https://s.shopee.com.br/4fit01Jvzh',
    marketplaceId: '18357850294',
    category: 'home'
  },
  
  // Beauty & Personal Care
  {
    id: 'shopee-11',
    title: 'Kit Skincare Facial',
    price: 149.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Skincare',
    rating: 4.6,
    originalUrl: 'https://s.shopee.com.br/9zkPLsG5Qt',
    marketplaceId: '18357850294',
    category: 'beauty'
  },
  {
    id: 'shopee-12',
    title: 'Secador de Cabelo Profissional',
    price: 189.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Secador',
    rating: 4.3,
    originalUrl: 'https://s.shopee.com.br/8fF1lRBxWg',
    marketplaceId: '18357850294',
    category: 'beauty'
  },
  {
    id: 'shopee-13',
    title: 'Perfume Feminino 100ml',
    price: 119.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Perfume',
    rating: 4.5,
    originalUrl: 'https://s.shopee.com.br/5VHzzeaPDB',
    marketplaceId: '18357850294',
    category: 'beauty'
  },
  
  // Accessories
  {
    id: 'shopee-14',
    title: 'Relógio Inteligente SmartWatch',
    price: 199.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=SmartWatch',
    rating: 4.4,
    originalUrl: 'https://s.shopee.com.br/5fbQBzCxrn',
    marketplaceId: '18357850294',
    category: 'accessories'
  },
  {
    id: 'shopee-15',
    title: 'Bolsa Feminina Transversal',
    price: 89.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Bolsa',
    rating: 4.2,
    originalUrl: 'https://s.shopee.com.br/2B1Y1Z3t0q',
    marketplaceId: '18357850294',
    category: 'accessories'
  },
  {
    id: 'shopee-16',
    title: 'Óculos de Sol Polarizado',
    price: 99.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=%C3%93culos',
    rating: 4.1,
    originalUrl: 'https://s.shopee.com.br/6AXgmvfSHz',
    marketplaceId: '18357850294',
    category: 'accessories'
  },
  
  // Sports & Fitness
  {
    id: 'shopee-17',
    title: 'Tênis para Corrida',
    price: 229.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=T%C3%AAnis',
    rating: 4.5,
    originalUrl: 'https://s.shopee.com.br/x3Rbkvd8',
    marketplaceId: '18357850294',
    category: 'sports'
  },
  {
    id: 'shopee-18',
    title: 'Kit de Yoga com Tapete',
    price: 149.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Kit+Yoga',
    rating: 4.3,
    originalUrl: 'https://s.shopee.com.br/30af19qEJi',
    marketplaceId: '18357850294',
    category: 'sports'
  },
  {
    id: 'shopee-19',
    title: 'Garrafa Térmica para Academia',
    price: 49.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Garrafa',
    rating: 4.4,
    originalUrl: 'https://s.shopee.com.br/AKNFkdxZxP',
    marketplaceId: '18357850294',
    category: 'sports'
  },
  
  // Other products - using remaining links
  {
    id: 'shopee-20',
    title: 'Cadeira Gamer Ergonômica',
    price: 699.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Cadeira+Gamer',
    rating: 4.6,
    originalUrl: 'https://s.shopee.com.br/4L62bcp9MY',
    marketplaceId: '18357850294',
    category: 'other'
  },
  {
    id: 'shopee-21',
    title: 'Mochila para Notebook',
    price: 109.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Mochila',
    rating: 4.3,
    originalUrl: 'https://s.shopee.com.br/AUgfwynGhs',
    marketplaceId: '18357850294',
    category: 'other'
  },
  {
    id: 'shopee-22',
    title: 'Ferramentas para Jardinagem',
    price: 89.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Ferramentas',
    rating: 4.1,
    originalUrl: 'https://s.shopee.com.br/8fF1ldOdqy',
    marketplaceId: '18357850294',
    category: 'other'
  },
  // Continue with remaining links - adding a few more to show the pattern
  {
    id: 'shopee-23',
    title: 'Câmera de Segurança WiFi',
    price: 249.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=C%C3%A2mera',
    rating: 4.5,
    originalUrl: 'https://s.shopee.com.br/3Au5DXIqXL',
    marketplaceId: '18357850294',
    category: 'electronics'
  },
  {
    id: 'shopee-24',
    title: 'Air Fryer Digital 4L',
    price: 359.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Air+Fryer',
    rating: 4.7,
    originalUrl: 'https://s.shopee.com.br/qWARGMrBM',
    marketplaceId: '18357850294',
    category: 'home'
  },
  {
    id: 'shopee-25',
    title: 'Pulseira Inteligente Fitness',
    price: 89.90,
    marketplace: 'shopee',
    imageUrl: 'https://placehold.co/300x300?text=Pulseira',
    rating: 4.2,
    originalUrl: 'https://s.shopee.com.br/9zkPM7EMHW',
    marketplaceId: '18357850294',
    category: 'accessories'
  }
  // Note: We've mapped 25 of the links to example products in different categories
  // In a real implementation, you would map all links to actual product data
];

interface ShopeeProductsGridProps {
  userId?: string;
  affiliateCode?: string;
}

export function ShopeeProductsGrid({ userId, affiliateCode }: ShopeeProductsGridProps) {
  // Get unique categories
  const categories = Array.from(new Set(shopeeProducts.map(product => product.category)));
  
  return (
    <div className="w-full">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="all">Todos</TabsTrigger>
          {categories.includes('electronics') && <TabsTrigger value="electronics">Eletrônicos</TabsTrigger>}
          {categories.includes('fashion') && <TabsTrigger value="fashion">Moda</TabsTrigger>}
          {categories.includes('home') && <TabsTrigger value="home">Casa & Decoração</TabsTrigger>}
          {categories.includes('beauty') && <TabsTrigger value="beauty">Beleza & Cuidados</TabsTrigger>}
          {categories.includes('accessories') && <TabsTrigger value="accessories">Acessórios</TabsTrigger>}
          {categories.includes('sports') && <TabsTrigger value="sports">Esportes</TabsTrigger>}
          {categories.includes('other') && <TabsTrigger value="other">Outros</TabsTrigger>}
        </TabsList>
        
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
