
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ShopeeProductsGrid } from '@/components/products/ShopeeProductsGrid';
import { getDefaultAffiliateId } from '@/services/affiliateService';
import { CustomerSuggestionForm } from '@/components/products/CustomerSuggestionForm';

const Shopee = () => {
  // Get the default affiliate ID for Shopee
  const affiliateCode = getDefaultAffiliateId('shopee');

  return (
    <MainLayout>
      <div className="container px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 flex items-center justify-center bg-marketplace-shopee text-white text-xl font-bold rounded-full">S</div>
            <h1 className="text-4xl font-bold">Ofertas Shopee</h1>
          </div>
          
          <div className="mb-8">
            <p className="text-lg text-muted-foreground">
              Descubra os melhores produtos da Shopee com preços incríveis. Como parceiros oficiais do Programa Shopee Affiliates, trazemos até você as melhores ofertas da plataforma.
            </p>
          </div>
          
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-orange-50 dark:bg-orange-950/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-2">Preços Imbatíveis</h3>
                <p className="text-muted-foreground">
                  Encontre produtos com os menores preços do mercado e frete grátis.
                </p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-950/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-2">Cupons Exclusivos</h3>
                <p className="text-muted-foreground">
                  Aproveite cupons e descontos diários exclusivos da Shopee.
                </p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-950/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-2">Vendedores Verificados</h3>
                <p className="text-muted-foreground">
                  Compre com segurança de vendedores verificados e bem avaliados.
                </p>
              </div>
            </div>
          </div>
          
          <ShopeeProductsGrid affiliateCode={affiliateCode} />
          
          <div className="mt-16 pt-8 border-t">
            <CustomerSuggestionForm />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Shopee;
