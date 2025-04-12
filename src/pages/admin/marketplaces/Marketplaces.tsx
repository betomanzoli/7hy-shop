
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { MarketplaceCard } from '@/components/admin/marketplaces/MarketplaceCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Marketplaces = () => {
  return (
    <AdminLayout title="Integrações de Afiliados">
      <div className="max-w-5xl">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Diretrizes de Integração</AlertTitle>
          <AlertDescription>
            Comece configurando sua integração com a Amazon. Uma vez funcionando, você pode prosseguir com Shopee e Mercado Livre. Siga os guias passo a passo para cada plataforma de afiliados.
          </AlertDescription>
        </Alert>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MarketplaceCard
            title="Amazon"
            description="Conectar ao programa Amazon Associates"
            icon={
              <div className="text-marketplace-amazon font-bold text-xl">A</div>
            }
            status="inactive"
            setupLink="/admin/marketplaces/amazon"
            docsLink="https://associados.amazon.com.br/"
          />
          
          <MarketplaceCard
            title="Shopee"
            description="Conectar ao programa Shopee Affiliates"
            icon={
              <div className="text-marketplace-shopee font-bold text-xl">S</div>
            }
            status="inactive"
            setupLink="/admin/marketplaces/shopee"
            docsLink="https://affiliate.shopee.com.br/"
          />
          
          <MarketplaceCard
            title="Mercado Livre"
            description="Conectar ao programa de afiliados do Mercado Livre"
            icon={
              <div className="text-marketplace-mercadolivre font-bold text-xl">M</div>
            }
            status="inactive"
            setupLink="/admin/marketplaces/mercadolivre"
            docsLink="https://www.mercadolivre.com.br/brandprotection/affiliates"
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Marketplaces;
