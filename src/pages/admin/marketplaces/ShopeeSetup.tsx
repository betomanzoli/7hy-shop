
import React from 'react';
import { MarketplaceSetupLayout } from '@/components/admin/marketplaces/MarketplaceSetupLayout';
import { useMarketplaceCredentials } from '@/hooks/useMarketplaceCredentials';

const ShopeeSetup = () => {
  const { credentials } = useMarketplaceCredentials();
  
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
    <MarketplaceSetupLayout
      marketplaceId="shopee"
      title="Configuração da Shopee"
      alertMessage="Para integrar com a Shopee, você precisará se cadastrar no programa de afiliados e obter suas credenciais. Configure abaixo."
      steps={setupSteps}
      formFields={[
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
      formTitle="Credenciais da Shopee Affiliates"
      formDescription="Configure suas credenciais para integração com o programa de afiliados da Shopee"
      troubleshootingItems={troubleshootingItems}
      docsLink={{
        url: "https://affiliate.shopee.com.br/support",
        label: "Ver documentação completa"
      }}
    />
  );
};

export default ShopeeSetup;
