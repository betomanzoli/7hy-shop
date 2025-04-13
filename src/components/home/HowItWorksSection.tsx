
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Search, CircleDollarSign, ShieldCheck, Info } from 'lucide-react';

export function HowItWorksSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-sm">Como Funciona</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tudo o que Você Precisa em Um Só Lugar</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nós simplificamos sua experiência de compras, mas a compra e o pagamento são sempre realizados 
            diretamente na plataforma original do marketplace.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Pesquise & Compare</h3>
            <p className="text-muted-foreground">
              Busque produtos em diversos marketplaces simultaneamente e compare preços, avaliações e condições de entrega.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <CircleDollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Escolha o Melhor</h3>
            <p className="text-muted-foreground">
              Identifique o marketplace que oferece as melhores condições para o produto que você deseja comprar.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Compra Segura</h3>
            <p className="text-muted-foreground">
              Finalize sua compra diretamente no site oficial do marketplace escolhido, com toda a segurança e garantias.
            </p>
          </div>
        </div>
        
        <div className="mt-12">
          <Alert className="max-w-3xl mx-auto">
            <Info className="h-4 w-4" />
            <AlertTitle>Importante</AlertTitle>
            <AlertDescription>
              O 7hy.shop não é uma loja virtual. Somos um agregador que facilita sua pesquisa e comparação de produtos. 
              Todas as compras e pagamentos são realizados diretamente nos sites oficiais dos marketplaces (Amazon, Shopee, Mercado Livre), 
              garantindo total segurança nas suas transações.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </section>
  );
}
