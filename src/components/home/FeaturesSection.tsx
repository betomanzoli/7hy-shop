
import React from 'react';
import { Badge } from '@/components/ui/badge';

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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Experiência Unificada de Compras</h3>
            <p className="text-muted-foreground">
              Navegue por produtos de diversos marketplaces em uma única interface intuitiva.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Comparação de Preços</h3>
            <p className="text-muted-foreground">
              Compare preços entre Amazon, Shopee e Mercado Livre para encontrar as melhores ofertas.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
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
