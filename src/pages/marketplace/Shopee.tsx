
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';

const Shopee = () => {
  return (
    <MainLayout>
      <div className="container px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-marketplace-shopee font-bold text-3xl">S</div>
            <h1 className="text-4xl font-bold">Shopee</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-lg text-muted-foreground mb-6">
                Descubra os melhores produtos da Shopee com preços incríveis. Como parceiros oficiais do Programa Shopee Affiliates, trazemos até você as melhores ofertas da plataforma.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Preços Imbatíveis</h3>
                  <p className="text-muted-foreground">
                    Encontre produtos com os menores preços do mercado e frete grátis.
                  </p>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Cupons Exclusivos</h3>
                  <p className="text-muted-foreground">
                    Aproveite cupons e descontos diários exclusivos da Shopee.
                  </p>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Vendedores Verificados</h3>
                  <p className="text-muted-foreground">
                    Compre com segurança de vendedores verificados e bem avaliados.
                  </p>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Frete Grátis</h3>
                  <p className="text-muted-foreground">
                    Muitos produtos com opção de frete grátis para todo o Brasil.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-950 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Categorias Populares</h3>
              <ul className="space-y-2">
                <li className="hover:text-orange-600 cursor-pointer">Moda Feminina</li>
                <li className="hover:text-orange-600 cursor-pointer">Eletrônicos</li>
                <li className="hover:text-orange-600 cursor-pointer">Casa e Decoração</li>
                <li className="hover:text-orange-600 cursor-pointer">Beleza</li>
                <li className="hover:text-orange-600 cursor-pointer">Acessórios para Celular</li>
                <li className="hover:text-orange-600 cursor-pointer">Bolsas e Calçados</li>
                <li className="hover:text-orange-600 cursor-pointer">Brinquedos e Hobbies</li>
                <li className="hover:text-orange-600 cursor-pointer">Ferramentas</li>
              </ul>
              
              <div className="border-t mt-6 pt-6">
                <h3 className="text-xl font-semibold mb-4">Promoções Flash</h3>
                <p className="text-muted-foreground mb-4">
                  Ofertas relâmpago com grandes descontos por tempo limitado.
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

export default Shopee;
