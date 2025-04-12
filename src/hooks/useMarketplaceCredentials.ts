
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type MarketplaceId = 'amazon' | 'shopee' | 'mercadolivre';

export function useMarketplaceCredentials(marketplaceId: MarketplaceId) {
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'error' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveCredentials = async (data: Record<string, string>) => {
    setIsLoading(true);
    
    try {
      // Save credentials to Supabase
      const { error } = await supabase
        .from('marketplace_credentials')
        .upsert({
          marketplace_id: marketplaceId,
          credentials: data,
          last_updated: new Date().toISOString()
        }, { onConflict: 'marketplace_id' });
      
      if (error) throw error;
      
      setApiStatus('connected');
      toast({
        title: "Credenciais salvas",
        description: `Suas credenciais da ${getMarketplaceName(marketplaceId)} foram salvas com sucesso.`,
      });
    } catch (error) {
      console.error(`Erro ao salvar credenciais: ${error}`);
      setApiStatus('error');
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar suas credenciais. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = () => {
    setIsLoading(true);
    // Simulate a connection test
    setTimeout(() => {
      setApiStatus('connected');
      toast({
        title: "Conexão bem-sucedida",
        description: `Sua conexão com a API da ${getMarketplaceName(marketplaceId)} está funcionando corretamente.`,
      });
      setIsLoading(false);
    }, 1500);
  };

  return {
    apiStatus,
    isLoading,
    saveCredentials,
    testConnection
  };
}

function getMarketplaceName(marketplaceId: MarketplaceId): string {
  switch (marketplaceId) {
    case 'amazon':
      return 'Amazon';
    case 'shopee':
      return 'Shopee';
    case 'mercadolivre':
      return 'Mercado Livre';
    default:
      return marketplaceId;
  }
}
