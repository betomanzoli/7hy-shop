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

// Produto da Shopee com dados reais
const shopeeProducts: Product[] = [
  // Electronics Category
  {
    id: 'shopee-1',
    title: 'Fone De Ouvido Bluetooth Xiaomi Redmi Buds 4 Lite TWS',
    price: 84.99,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/br-11134207-7qukw-liu9vk4qlsz5bb',
    rating: 4.8,
    originalUrl: 'https://s.shopee.com.br/5puqNwGojV',
    marketplaceId: '18357850294',
    category: 'electronics'
  },
  {
    id: 'shopee-2',
    title: 'Headset Gamer P3 Haiz Compatível com PS4/PS5/XBOX/PC/Celular',
    price: 58.49,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/br-11134207-7r98p-lq5p1qp2wdm48b',
    rating: 4.5,
    originalUrl: 'https://s.shopee.com.br/5VHzzLHc6C',
    marketplaceId: '18357850294',
    category: 'electronics'
  },
  {
    id: 'shopee-3',
    title: 'Smart TV LED 32" Philco Smart Netflix YouTube HD PTV32G70RCH',
    price: 999.00,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/br-11134201-7r98p-lpj6kgdawz417f',
    rating: 4.7,
    originalUrl: 'https://s.shopee.com.br/20i7ov4Cj2',
    marketplaceId: '18357850294',
    category: 'electronics'
  },
  {
    id: 'shopee-4',
    title: 'Suporte Magnético Veicular Para Celular Smartphone',
    price: 15.99,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/7af4a3c8f40142c44096136c92b0df5d',
    rating: 4.6,
    originalUrl: 'https://s.shopee.com.br/VtK2BIJIG',
    marketplaceId: '18357850294',
    category: 'electronics'
  },
  
  // Fashion Category
  {
    id: 'shopee-5',
    title: 'Calça Jeans Feminina Mom Cintura Alta Destroyed',
    price: 89.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/br-11134201-7r98s-lqfqtbcr6l7m12',
    rating: 4.5,
    originalUrl: 'https://s.shopee.com.br/7KjeAmzsqz',
    marketplaceId: '18357850294',
    category: 'fashion'
  },
  {
    id: 'shopee-6',
    title: 'Conjunto Feminino Moda Verão Blusa e Short Lançamento',
    price: 56.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/sg-11134201-7rbmk-llx1q2q3jgpja0',
    rating: 4.3,
    originalUrl: 'https://s.shopee.com.br/4fiszua1ul',
    marketplaceId: '18357850294',
    category: 'fashion'
  },
  {
    id: 'shopee-7',
    title: 'Vestido Midi Feminino Moda Verão Com Cinto e Babado',
    price: 68.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/br-11134207-7r98r-lpv4emn6mxu49f',
    rating: 4.5,
    originalUrl: 'https://s.shopee.com.br/7fMUZTWCG3',
    marketplaceId: '18357850294',
    category: 'fashion'
  },
  
  // Home & Decoration
  {
    id: 'shopee-8',
    title: 'Conjunto de Panelas 5 Peças Antiaderente com Tampa de Vidro',
    price: 139.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/sg-11134201-7rbm1-ln9rjthhkgm66c',
    rating: 4.7,
    originalUrl: 'https://s.shopee.com.br/x3RQTNCw',
    marketplaceId: '18357850294',
    category: 'home'
  },
  {
    id: 'shopee-9',
    title: 'Jogo de Cama Casal 4 Peças 150 Fios Premium Lençol Fronha',
    price: 59.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/br-11134207-7qukw-livdl0xt0j4b46',
    rating: 4.4,
    originalUrl: 'https://s.shopee.com.br/1qOhcnr7hN',
    marketplaceId: '18357850294',
    category: 'home'
  },
  {
    id: 'shopee-10',
    title: 'Luminária de Mesa LED com 3 Níveis de Brilho e Recarregável',
    price: 38.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/br-11134201-7r98o-lp48eapiqwdc5d',
    rating: 4.6,
    originalUrl: 'https://s.shopee.com.br/4fit01Jvzh',
    marketplaceId: '18357850294',
    category: 'home'
  },
  
  // Beauty & Personal Care
  {
    id: 'shopee-11',
    title: 'Kit Skincare Coreano Facial com 3 Produtos Hidratação Profunda',
    price: 99.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/br-11134207-7r98o-lp67c25o1vhd65',
    rating: 4.6,
    originalUrl: 'https://s.shopee.com.br/9zkPLsG5Qt',
    marketplaceId: '18357850294',
    category: 'beauty'
  },
  {
    id: 'shopee-12',
    title: 'Secador de Cabelo Profissional 2200W com Difusor e 3 Temperaturas',
    price: 79.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/br-11134207-7qukv-li8hn9ntwfl17e',
    rating: 4.3,
    originalUrl: 'https://s.shopee.com.br/8fF1lRBxWg',
    marketplaceId: '18357850294',
    category: 'beauty'
  },
  {
    id: 'shopee-13',
    title: 'Perfume Feminino Importado Floral Frutal 100ml Longa Duração',
    price: 89.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/br-11134207-7qukw-lk1pq1h9w0t3be',
    rating: 4.5,
    originalUrl: 'https://s.shopee.com.br/5VHzzeaPDB',
    marketplaceId: '18357850294',
    category: 'beauty'
  },
  
  // Accessories
  {
    id: 'shopee-14',
    title: 'Smartwatch D20 Relógio Inteligente Fitness Android/iOS',
    price: 49.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/58ca507add7f50c40c9793a6d2e62087',
    rating: 4.4,
    originalUrl: 'https://s.shopee.com.br/5fbQBzCxrn',
    marketplaceId: '18357850294',
    category: 'accessories'
  },
  {
    id: 'shopee-15',
    title: 'Bolsa Feminina Transversal Pequena de Couro Sintético',
    price: 42.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/d1264466dfeadca5f7f40f9ec3df6b9a',
    rating: 4.6,
    originalUrl: 'https://s.shopee.com.br/2B1Y1Z3t0q',
    marketplaceId: '18357850294',
    category: 'accessories'
  },
  {
    id: 'shopee-16',
    title: 'Óculos de Sol Polarizado UV400 Proteção Unissex',
    price: 39.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/br-11134207-7r98o-lpfdnnucdtqc7c',
    rating: 4.3,
    originalUrl: 'https://s.shopee.com.br/6AXgmvfSHz',
    marketplaceId: '18357850294',
    category: 'accessories'
  },
  
  // Sports & Fitness
  {
    id: 'shopee-17',
    title: 'Tênis Esportivo Masculino Confortável para Caminhada e Corrida',
    price: 79.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/br-11134207-7r98p-lqhvwm6iq7qf56',
    rating: 4.5,
    originalUrl: 'https://s.shopee.com.br/x3Rbkvd8',
    marketplaceId: '18357850294',
    category: 'sports'
  },
  {
    id: 'shopee-18',
    title: 'Kit Yoga Completo 5 Peças com Tapete Antiderrapante',
    price: 89.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/br-11134201-7qukw-lkc2yrjlnlkv97',
    rating: 4.3,
    originalUrl: 'https://s.shopee.com.br/30af19qEJi',
    marketplaceId: '18357850294',
    category: 'sports'
  },
  {
    id: 'shopee-19',
    title: 'Garrafa Térmica para Academia 1L com Alça Inox',
    price: 35.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/br-11134201-23030-hl9wt75w88nvf3',
    rating: 4.7,
    originalUrl: 'https://s.shopee.com.br/AKNFkdxZxP',
    marketplaceId: '18357850294',
    category: 'sports'
  },
  
  // Other products
  {
    id: 'shopee-20',
    title: 'Cadeira Gamer Ergonômica com Apoio Lombar Altura Ajustável',
    price: 489.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/br-11134201-7qukw-ljfgxbz3zgw9ba',
    rating: 4.6,
    originalUrl: 'https://s.shopee.com.br/4L62bcp9MY',
    marketplaceId: '18357850294',
    category: 'other'
  },
  {
    id: 'shopee-21',
    title: 'Mochila para Notebook 15.6" Impermeável com Porta USB',
    price: 59.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/br-11134207-7qukw-ljjcrmcqh6j8a2',
    rating: 4.4,
    originalUrl: 'https://s.shopee.com.br/AUgfwynGhs',
    marketplaceId: '18357850294',
    category: 'other'
  },
  {
    id: 'shopee-22',
    title: 'Kit Ferramentas para Jardinagem 10 Peças com Estojo',
    price: 69.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/c7dc6ec4eb0e75b1d9ddb736d95559d8',
    rating: 4.2,
    originalUrl: 'https://s.shopee.com.br/8fF1ldOdqy',
    marketplaceId: '18357850294',
    category: 'other'
  },
  {
    id: 'shopee-23',
    title: 'Câmera de Segurança WiFi 360° HD com Visão Noturna',
    price: 89.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/sg-11134201-22100-3f3kk8xpg3iv2f',
    rating: 4.5,
    originalUrl: 'https://s.shopee.com.br/3Au5DXIqXL',
    marketplaceId: '18357850294',
    category: 'electronics'
  },
  {
    id: 'shopee-24',
    title: 'Air Fryer Digital 4L Fritadeira Sem Óleo 1500W',
    price: 249.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/br-11134207-7qukw-lk2r3liwkcl9e6',
    rating: 4.7,
    originalUrl: 'https://s.shopee.com.br/qWARGMrBM',
    marketplaceId: '18357850294',
    category: 'home'
  },
  {
    id: 'shopee-25',
    title: 'Pulseira Inteligente Fitness Monitor Cardíaco Pressão Arterial',
    price: 38.90,
    marketplace: 'shopee',
    imageUrl: 'https://down-br.img.susercontent.com/file/br-11134207-7qukz-lkcc1bkx12eu4e',
    rating: 4.3,
    originalUrl: 'https://s.shopee.com.br/9zkPM7EMHW',
    marketplaceId: '18357850294',
    category: 'accessories'
  }
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
