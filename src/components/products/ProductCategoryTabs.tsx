
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCategory } from '@/data/shopeeProducts';

interface ProductCategoryTabsProps {
  categories: ProductCategory[];
}

export function ProductCategoryTabs({ categories }: ProductCategoryTabsProps) {
  const categoryNames: Record<ProductCategory, string> = {
    electronics: 'Eletrônicos',
    fashion: 'Moda',
    home: 'Casa & Decoração',
    beauty: 'Beleza & Cuidados',
    accessories: 'Acessórios',
    sports: 'Esportes',
    other: 'Outros'
  };

  return (
    <TabsList className="mb-6 flex flex-wrap">
      <TabsTrigger value="all">Todos</TabsTrigger>
      {categories.map(category => (
        categories.includes(category) && 
        <TabsTrigger key={category} value={category}>
          {categoryNames[category]}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
