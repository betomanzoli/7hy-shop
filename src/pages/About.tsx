
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';

const About = () => {
  return (
    <MainLayout>
      <div className="container px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Sobre a 7hy.shop</h1>
          
          <div className="prose prose-lg">
            <p className="lead mb-6">
              A 7hy.shop é uma plataforma inovadora que integra produtos de diversos marketplaces em um único lugar, facilitando sua experiência de compra online.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Nossa Missão</h2>
            <p>
              Simplificar sua experiência de compra online, unificando os melhores produtos da Amazon, Shopee e Mercado Livre em uma única plataforma intuitiva e fácil de usar.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Nossa Visão</h2>
            <p>
              Ser a principal referência em agregação de produtos online no Brasil, oferecendo a melhor experiência de compra comparativa entre marketplaces.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Como Funcionamos</h2>
            <p>
              Através de integrações oficiais com os programas de afiliados da Amazon, Shopee e Mercado Livre, consolidamos ofertas em um único lugar para que você possa:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Comparar preços entre diferentes marketplaces</li>
              <li>Encontrar as melhores ofertas sem precisar alternar entre sites</li>
              <li>Ter acesso a avaliações e informações detalhadas de produtos</li>
              <li>Garantir compras seguras através de parceiros confiáveis</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Nossa Equipe</h2>
            <p>
              Somos um grupo de entusiastas de tecnologia e e-commerce, dedicados a criar a melhor plataforma de compras integrada do Brasil.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;
