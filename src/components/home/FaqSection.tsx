
import React from 'react';
import { Badge } from '@/components/ui/badge';

export function FaqSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-sm">Perguntas Frequentes</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Como Podemos Ajudar?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Respostas para as dúvidas mais comuns sobre o 7hy.shop
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-blue-50 dark:bg-gray-900 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Como o 7hy.shop ganha dinheiro?</h3>
            <p className="text-muted-foreground">
              Somos parceiros dos programas de afiliados oficiais da Amazon, Shopee e Mercado Livre. Quando você realiza uma compra através dos nossos links, recebemos uma pequena comissão, sem qualquer custo adicional para você.
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-gray-900 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Os preços são os mesmos dos sites oficiais?</h3>
            <p className="text-muted-foreground">
              Sim! Você verá exatamente os mesmos preços que estão nos sites oficiais dos marketplaces. Não adicionamos nenhuma taxa ou custo extra.
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-gray-900 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Onde faço o pagamento da minha compra?</h3>
            <p className="text-muted-foreground">
              Todas as compras e pagamentos são realizados diretamente nos sites oficiais dos marketplaces. O 7hy.shop apenas direciona você para o produto desejado no site oficial.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
