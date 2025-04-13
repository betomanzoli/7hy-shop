
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, ShoppingCart, Shield } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section className="py-20 bg-blue-50 dark:bg-gray-900">
      <div className="container px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-sm">Benefícios</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que usar o 7hy.shop?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Economize tempo e dinheiro enquanto encontra os melhores produtos em múltiplas plataformas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <ShoppingBag className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Experiência Unificada de Compras</h3>
            <p className="text-muted-foreground">
              Navegue por produtos de diversos marketplaces em uma única interface intuitiva.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <ShoppingCart className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Comparação de Preços</h3>
            <p className="text-muted-foreground">
              Compare preços entre Amazon, Shopee e Mercado Livre para encontrar as melhores ofertas.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <Shield className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Produtos Verificados</h3>
            <p className="text-muted-foreground">
              Todos os anúncios são verificados quanto à autenticidade e qualidade em todos os marketplaces.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
