
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { MarketplaceCard } from '@/components/admin/marketplaces/MarketplaceCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MarketplaceStatus {
  id: string;
  status: 'active' | 'inactive' | 'pending' | 'error';
  lastSync?: string;
}

interface MarketplaceCredentialsData {
  marketplace_id: string;
  last_updated: string;
}

const Marketplaces = () => {
  const [marketplaceStatuses, setMarketplaceStatuses] = useState<MarketplaceStatus[]>([
    { id: 'amazon', status: 'inactive' },
    { id: 'shopee', status: 'inactive' }
  ]);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarketplaceCredentials = async () => {
      try {
        const { data, error } = await supabase
          .from('marketplace_credentials')
          .select('marketplace_id, last_updated');

        if (error) throw error;

        if (data && data.length > 0) {
          const newStatuses = [...marketplaceStatuses];
          
          data.forEach((item: MarketplaceCredentialsData) => {
            const index = newStatuses.findIndex(s => s.id === item.marketplace_id);
            if (index !== -1) {
              newStatuses[index] = {
                ...newStatuses[index],
                status: 'active',
                lastSync: new Date(item.last_updated).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              };
            }
          });
          
          setMarketplaceStatuses(newStatuses);
        }
      } catch (error) {
        console.error('Erro ao buscar credenciais:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketplaceCredentials();
  }, []);

  return (
    <AdminLayout title="Integrações de Afiliados">
      <div className="max-w-5xl">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Diretrizes de Integração</AlertTitle>
          <AlertDescription>
            Comece configurando sua integração com a Amazon. Uma vez funcionando, você pode prosseguir com Shopee. Siga os guias passo a passo para cada plataforma de afiliados.
          </AlertDescription>
        </Alert>
        
        <div className="grid gap-6 md:grid-cols-2">
          <MarketplaceCard
            title="Amazon"
            description="Conectar ao programa Amazon Associates"
            icon={
              <div className="text-marketplace-amazon font-bold text-xl">A</div>
            }
            status={marketplaceStatuses.find(s => s.id === 'amazon')?.status || 'inactive'}
            lastSync={marketplaceStatuses.find(s => s.id === 'amazon')?.lastSync}
            setupLink="/admin/marketplaces/amazon"
            docsLink="https://associados.amazon.com.br/"
          />
          
          <MarketplaceCard
            title="Shopee"
            description="Conectar ao programa Shopee Affiliates"
            icon={
              <div className="text-marketplace-shopee font-bold text-xl">S</div>
            }
            status={marketplaceStatuses.find(s => s.id === 'shopee')?.status || 'inactive'}
            lastSync={marketplaceStatuses.find(s => s.id === 'shopee')?.lastSync}
            setupLink="/admin/marketplaces/shopee"
            docsLink="https://affiliate.shopee.com.br/"
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Marketplaces;
