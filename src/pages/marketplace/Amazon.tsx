
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';

const Amazon = () => {
  return (
    <MainLayout>
      <div className="container px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-marketplace-amazon font-bold text-3xl">A</div>
            <h1 className="text-4xl font-bold">Amazon</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-lg text-muted-foreground mb-6">
                Explore os melhores produtos da Amazon em um só lugar. Como parceiros oficiais do Programa Amazon Associates, oferecemos uma seleção curada de produtos com os melhores preços.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Grande Variedade</h3>
                  <p className="text-muted-foreground">
                    Milhões de produtos em diversas categorias, desde eletrônicos até moda e casa.
                  </p>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Entregas Rápidas</h3>
                  <p className="text-muted-foreground">
                    Aproveite a conveniência do Amazon Prime com entregas em até 24 horas.
                  </p>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Avaliações Confiáveis</h3>
                  <p className="text-muted-foreground">
                    Avaliações reais de milhares de compradores para ajudar na sua decisão.
                  </p>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Garantia Amazon</h3>
                  <p className="text-muted-foreground">
                    Compre com segurança com a política de devoluções e suporte da Amazon.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Categorias Populares</h3>
              <ul className="space-y-2">
                <li className="hover:text-blue-600 cursor-pointer">Eletrônicos</li>
                <li className="hover:text-blue-600 cursor-pointer">Computadores e Informática</li>
                <li className="hover:text-blue-600 cursor-pointer">Casa e Cozinha</li>
                <li className="hover:text-blue-600 cursor-pointer">Beleza e Cuidados Pessoais</li>
                <li className="hover:text-blue-600 cursor-pointer">Livros</li>
                <li className="hover:text-blue-600 cursor-pointer">Games e Consoles</li>
                <li className="hover:text-blue-600 cursor-pointer">Moda</li>
                <li className="hover:text-blue-600 cursor-pointer">Bebês</li>
              </ul>
              
              <div className="border-t mt-6 pt-6">
                <h3 className="text-xl font-semibold mb-4">Ofertas do Dia</h3>
                <p className="text-muted-foreground mb-4">
                  Confira as ofertas exclusivas da Amazon atualizadas diariamente.
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

export default Amazon;
