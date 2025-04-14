
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { MarketplaceCard } from '@/components/admin/marketplaces/MarketplaceCard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMarketplaceCredentials } from '@/hooks/useMarketplaceCredentials';

const Marketplaces = () => {
  const { toast } = useToast();
  const { credentials } = useMarketplaceCredentials();
  
  const handleConnectNew = () => {
    toast({
      title: "Informação",
      description: "Selecione uma das plataformas disponíveis para configurar.",
    });
  };
  
  return (
    <AdminLayout title="Marketplaces">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Plataformas Conectadas</h1>
        <Button onClick={handleConnectNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Conectar Nova Plataforma
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <MarketplaceCard
          title="Amazon"
          description="Maior marketplace global com milhões de produtos em diversas categorias."
          status={credentials.amazon?.accessKeyId ? "connected" : "disconnected"}
          setupLink="/admin/marketplaces/amazon"
          docsLink="https://associados.amazon.com.br/"
          type="amazon"
        />
        
        <MarketplaceCard
          title="Shopee"
          description="Marketplace popular no Brasil com foco em produtos a preços acessíveis."
          status={credentials.shopee?.username ? "connected" : "disconnected"}
          setupLink="/admin/marketplaces/shopee"
          docsLink="https://affiliate.shopee.com.br/"
          type="shopee"
        />
      </div>
    </AdminLayout>
  );
};

export default Marketplaces;
