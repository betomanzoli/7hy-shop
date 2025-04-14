
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
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
      action: {
        label: "Shopee Affiliates",
        href: "https://affiliate.shopee.com.br/"
      }
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
      title: "Não consigo acessar minha conta de afiliado da Shopee",
      description: "Verifique se você está usando as credenciais corretas. Se o problema persistir, entre em contato com o suporte da Shopee Affiliates."
    },
    {
      title: "Quanto tempo leva para minha aplicação ser aprovada?",
      description: "Normalmente o processo de aprovação leva cerca de 3 a 5 dias úteis."
    },
    {
      title: "Como funcionam as comissões na Shopee?",
      description: "As comissões variam de acordo com a categoria do produto, geralmente entre 3% e 10% do valor da venda."
    }
  ];
  
  return (
    <AdminLayout title="Configuração da Shopee">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="grid gap-8">
          <ApiCredentialsForm
            title="Credenciais da Shopee Affiliates"
            description="Configure suas credenciais para integração com o programa de afiliados da Shopee"
            fields={[
              {
                id: "username",
                label: "Nome de Usuário",
                type: "text",
                placeholder: "Seu nome de usuário",
                helperText: "Seu nome de usuário na plataforma de afiliados"
              },
              {
                id: "affiliateId",
                label: "ID de Afiliado",
                type: "text",
                placeholder: "Seu ID de afiliado",
                helperText: "Seu ID único de afiliado Shopee"
              }
            ]}
            onSubmit={handleSaveCredentials}
            isLoading={false}
            apiStatus={credentials.shopee?.username ? "connected" : "disconnected"}
          />
          
          <SetupSteps steps={setupSteps} />
          
          <TroubleshootingSection 
            items={troubleshootingItems} 
            docsLink={{
              url: "https://affiliate.shopee.com.br/support",
              label: "Ver documentação completa"
            }} 
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ShopeeSetup;
