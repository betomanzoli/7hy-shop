
import React from 'react';
import { MarketplaceSetupLayout } from '@/components/admin/marketplaces/MarketplaceSetupLayout';
import { ApiCredentialsForm } from '@/components/admin/marketplaces/ApiCredentialsForm';
import { SetupSteps } from '@/components/admin/marketplaces/SetupSteps';
import { TroubleshootingSection } from '@/components/admin/marketplaces/TroubleshootingSection';
import { useToast } from '@/hooks/use-toast';
import { useMarketplaceCredentials } from '@/hooks/useMarketplaceCredentials';

const ShopeeSetup = () => {
  const { toast } = useToast();
  const { saveCredentials, credentials } = useMarketplaceCredentials();
  
  const handleSaveCredentials = (data: any) => {
    saveCredentials('shopee', data);
    
    toast({
      title: "Credenciais salvas",
      description: "Suas credenciais da Shopee foram salvas com sucesso.",
    });
  };
  
  const setupSteps = [
    {
      title: "Registre-se no Programa de Afiliados da Shopee",
      description: "Acesse o site de afiliados da Shopee e crie uma conta.",
      link: "https://affiliate.shopee.com.br/",
      linkText: "Shopee Affiliates"
    },
    {
      title: "Preencha todas as informações necessárias",
      description: "Complete seu perfil com informações sobre seus canais e público-alvo."
    },
    {
      title: "Aguarde a aprovação",
      description: "O time da Shopee irá revisar sua inscrição e entrar em contato."
    },
    {
      title: "Acesse suas credenciais de afiliado",
      description: "Após aprovado, você terá acesso ao painel com seu ID de afiliado."
    }
  ];
  
  const troubleshootingItems = [
    {
      question: "Não consigo acessar minha conta de afiliado da Shopee",
      answer: "Verifique se você está usando as credenciais corretas. Se o problema persistir, entre em contato com o suporte da Shopee Affiliates."
    },
    {
      question: "Quanto tempo leva para minha aplicação ser aprovada?",
      answer: "Normalmente o processo de aprovação leva cerca de 3 a 5 dias úteis."
    },
    {
      question: "Como funcionam as comissões na Shopee?",
      answer: "As comissões variam de acordo com a categoria do produto, geralmente entre 3% e 10% do valor da venda."
    }
  ];
  
  return (
    <MarketplaceSetupLayout 
      title="Configuração da Shopee" 
      description="Configure sua integração com o programa Shopee Affiliates"
      type="shopee"
    >
      <div className="grid gap-8">
        <ApiCredentialsForm
          fields={[
            {
              name: "username",
              label: "Nome de Usuário",
              description: "Seu nome de usuário na plataforma de afiliados",
              defaultValue: credentials.shopee?.username || "7hyckshop"
            },
            {
              name: "affiliateId",
              label: "ID de Afiliado",
              description: "Seu ID único de afiliado Shopee",
              defaultValue: credentials.shopee?.affiliateId || "18357850294"
            }
          ]}
          onSave={handleSaveCredentials}
          savedValues={credentials.shopee}
        />
        
        <SetupSteps steps={setupSteps} />
        
        <TroubleshootingSection items={troubleshootingItems} />
      </div>
    </MarketplaceSetupLayout>
  );
};

export default ShopeeSetup;
