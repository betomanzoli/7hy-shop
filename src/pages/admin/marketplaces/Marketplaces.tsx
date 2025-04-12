
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { MarketplaceCard } from '@/components/admin/marketplaces/MarketplaceCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Marketplaces = () => {
  return (
    <AdminLayout title="Marketplace Integrations">
      <div className="max-w-5xl">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Integration Guidelines</AlertTitle>
          <AlertDescription>
            Start by setting up your Amazon integration. Once that's working, you can proceed with Shopee and Mercado Livre. Follow the step-by-step guides for each marketplace.
          </AlertDescription>
        </Alert>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MarketplaceCard
            title="Amazon"
            description="Connect to Amazon Seller Central API"
            icon={
              <div className="text-marketplace-amazon font-bold text-xl">A</div>
            }
            status="inactive"
            setupLink="/admin/marketplaces/amazon"
            docsLink="https://developer-docs.amazon.com/sp-api/"
          />
          
          <MarketplaceCard
            title="Shopee"
            description="Connect to Shopee Open Platform API"
            icon={
              <div className="text-marketplace-shopee font-bold text-xl">S</div>
            }
            status="inactive"
            setupLink="/admin/marketplaces/shopee"
            docsLink="https://open.shopee.com/"
          />
          
          <MarketplaceCard
            title="Mercado Livre"
            description="Connect to Mercado Livre API"
            icon={
              <div className="text-marketplace-mercadolivre font-bold text-xl">M</div>
            }
            status="inactive"
            setupLink="/admin/marketplaces/mercadolivre"
            docsLink="https://developers.mercadolivre.com.br/"
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Marketplaces;
