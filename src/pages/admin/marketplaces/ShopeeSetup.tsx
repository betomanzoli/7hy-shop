
import React from 'react';
import { MarketplaceSetupLayout } from '@/components/admin/marketplaces/MarketplaceSetupLayout';
import { AdminSetupGuide } from '@/components/admin/AdminSetupGuide';

const ShopeeSetup = () => {
  return (
    <>
      <AdminSetupGuide
        title="Configuração do Shopee Affiliates"
        description="Siga estes passos para configurar sua integração com o programa de afiliados da Shopee."
        steps={[
          {
            title: "Configure suas credenciais na plataforma",
            description: "Insira as credenciais no formulário abaixo e teste a conexão."
          }
        ]}
        tips={[
          "A Shopee prioriza afiliados com foco em produtos asiáticos e eletrônicos.",
          "Crie conteúdo comparativo entre produtos similares para aumentar as conversões.",
          "Utilize banners e deep links para categorias específicas, não apenas para a página inicial.",
          "Consulte o calendário de promoções da Shopee para sincronizar seu conteúdo com as campanhas oficiais."
        ]}
        alertInfo={{
          title: "Informação de Conta",
          message: "Suas credenciais de afiliado da Shopee já foram configuradas com o ID de afiliado 18357850294 e nome de usuário 7hyckshop.",
          type: "info"
        }}
      />
      
      <MarketplaceSetupLayout
        marketplaceId="shopee"
        title="Configuração da Shopee"
        alertMessage="Suas credenciais da Shopee já estão pré-configuradas no sistema com o ID de afiliado 18357850294 e nome de usuário 7hyckshop. Você pode gerenciar configurações adicionais abaixo."
        steps={[
          {
            title: "Credenciais pré-configuradas",
            description: (
              <div className="space-y-2">
                <p>Suas credenciais da Shopee já estão configuradas:</p>
                <ul className="list-disc ml-5 space-y-2">
                  <li><strong>ID de Afiliado:</strong> 18357850294</li>
                  <li><strong>Nome de Usuário:</strong> 7hyckshop</li>
                </ul>
                <p>Estas informações serão usadas automaticamente para gerar links de afiliado.</p>
              </div>
            ),
            action: {
              label: "Acessar Conta de Afiliado",
              href: "https://affiliate.shopee.com.br/login"
            }
          },
          {
            title: "Gestão de Produtos",
            description: (
              <div className="space-y-2">
                <p>Para maximizar seus ganhos como afiliado da Shopee:</p>
                <ol className="list-decimal ml-5 space-y-2">
                  <li>Selecione produtos com boas avaliações (4+ estrelas)</li>
                  <li>Foque em produtos com descontos ativos</li>
                  <li>Promova produtos com frete grátis</li>
                  <li>Verifique se os produtos estão em estoque</li>
                </ol>
              </div>
            )
          }
        ]}
        formFields={[
          {
            id: "trackingCode",
            label: "Código de Rastreamento Personalizado (opcional)",
            type: "text",
            placeholder: "CUSTOM_CODE",
            helperText: "Código adicional para rastreamento personalizado, se necessário."
          }
        ]}
        formTitle="Configurações Adicionais da Shopee"
        formDescription="Suas credenciais principais já estão configuradas. Aqui você pode adicionar configurações opcionais."
        troubleshootingItems={[
          {
            title: "Links de afiliado não funcionando",
            description: "Certifique-se de que os links estão formatados corretamente e que seu ID de afiliado (18357850294) está sendo usado."
          },
          {
            title: "Problemas com rastreamento",
            description: "Se os cliques não estiverem sendo registrados, verifique se o parâmetro smtt está incluído nos URLs de afiliado."
          }
        ]}
        docsLink={{
          url: "https://affiliate.shopee.com.br/faq",
          label: "Consultar perguntas frequentes"
        }}
      />
    </>
  );
};

export default ShopeeSetup;
