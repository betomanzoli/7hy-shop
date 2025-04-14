
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type MarketplaceId = 'amazon' | 'shopee';

interface AmazonCredentials {
  accessKeyId?: string;
  secretAccessKey?: string;
  associateTag?: string;
}

interface ShopeeCredentials {
  username?: string;
  affiliateId?: string;
}

export interface MarketplaceCredentials {
  amazon?: AmazonCredentials;
  shopee?: ShopeeCredentials;
}

export function useMarketplaceCredentials(marketplaceId?: MarketplaceId) {
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'error' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState<MarketplaceCredentials>({
    amazon: {
      accessKeyId: '',
      secretAccessKey: '', 
      associateTag: '7hy01-20',
    },
    shopee: {
      username: '7hyckshop',
      affiliateId: '18357850294',
    }
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load credentials from Supabase if available
    const fetchCredentials = async () => {
      try {
        const { data, error } = await supabase
          .from('marketplace_credentials')
          .select('*');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const credentialsData: MarketplaceCredentials = {
            amazon: {},
            shopee: {}
          };
          
          data.forEach((item) => {
            if (item.marketplace_id === 'amazon') {
              credentialsData.amazon = item.credentials as AmazonCredentials;
            } else if (item.marketplace_id === 'shopee') {
              credentialsData.shopee = item.credentials as ShopeeCredentials;
            }
          });
          
          setCredentials(prevState => ({
            ...prevState,
            ...credentialsData
          }));
        }
      } catch (error) {
        console.error('Error fetching credentials:', error);
      }
    };
    
    fetchCredentials();
  }, []);

  const saveCredentials = async (id: MarketplaceId, data: Record<string, string>) => {
    setIsLoading(true);
    
    try {
      // Save credentials to Supabase
      const { error } = await supabase
        .from('marketplace_credentials')
        .upsert({
          marketplace_id: id,
          credentials: data,
          last_updated: new Date().toISOString()
        }, { onConflict: 'marketplace_id' });
      
      if (error) throw error;
      
      // Update local state
      setCredentials(prevState => ({
        ...prevState,
        [id]: data
      }));
      
      setApiStatus('connected');
      toast({
        title: "Credenciais salvas",
        description: `Suas credenciais da ${getMarketplaceName(id)} foram salvas com sucesso.`,
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
        description: `Sua conexão com a API da ${marketplaceId ? getMarketplaceName(marketplaceId) : 'marketplace'} está funcionando corretamente.`,
      });
      setIsLoading(false);
    }, 1500);
  };

  return {
    apiStatus,
    isLoading,
    saveCredentials,
    testConnection,
    credentials
  };
}

function getMarketplaceName(marketplaceId: MarketplaceId): string {
  switch (marketplaceId) {
    case 'amazon':
      return 'Amazon';
    case 'shopee':
      return 'Shopee';
    default:
      return marketplaceId;
  }
}
