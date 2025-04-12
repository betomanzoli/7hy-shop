
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';

const MercadoLivre = () => {
  return (
    <MainLayout>
      <div className="container px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-marketplace-mercadolivre font-bold text-3xl">M</div>
            <h1 className="text-4xl font-bold">Mercado Livre</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-lg text-muted-foreground mb-6">
                Acesse os melhores produtos do Mercado Livre em um só lugar. Como parceiros oficiais do programa de afiliados do Mercado Livre, selecionamos as melhores ofertas para você.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Mercado Pontos</h3>
                  <p className="text-muted-foreground">
                    Acumule pontos em suas compras e troque por descontos e benefícios.
                  </p>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Mercado Pago</h3>
                  <p className="text-muted-foreground">
                    Pagamentos seguros e parcelamentos em até 12x sem juros.
                  </p>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Compra Garantida</h3>
                  <p className="text-muted-foreground">
                    Se algo não sair como esperado, devolva o produto e receba seu dinheiro de volta.
                  </p>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Mercado Envios</h3>
                  <p className="text-muted-foreground">
                    Entrega rápida e rastreável para todo o Brasil.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Categorias Populares</h3>
              <ul className="space-y-2">
                <li className="hover:text-yellow-600 cursor-pointer">Celulares e Smartphones</li>
                <li className="hover:text-yellow-600 cursor-pointer">Informática</li>
                <li className="hover:text-yellow-600 cursor-pointer">Eletrodomésticos</li>
                <li className="hover:text-yellow-600 cursor-pointer">Veículos e Acessórios</li>
                <li className="hover:text-yellow-600 cursor-pointer">Casa, Móveis e Decoração</li>
                <li className="hover:text-yellow-600 cursor-pointer">Esportes e Fitness</li>
                <li className="hover:text-yellow-600 cursor-pointer">Ferramentas</li>
                <li className="hover:text-yellow-600 cursor-pointer">Brinquedos e Hobbies</li>
              </ul>
              
              <div className="border-t mt-6 pt-6">
                <h3 className="text-xl font-semibold mb-4">Ofertas do Dia</h3>
                <p className="text-muted-foreground mb-4">
                  Descontos especiais em produtos selecionados, atualizados diariamente.
                </p>
                <div className="bg-white dark:bg-gray-800 p-3 rounded text-center animate-pulse">
                  Carregando ofertas...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MercadoLivre;
