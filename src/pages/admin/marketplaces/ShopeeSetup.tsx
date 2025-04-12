
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
            title: "Crie uma conta no programa Shopee Affiliates",
            description: "Acesse o site oficial e complete o cadastro fornecendo as informações necessárias."
          },
          {
            title: "Aguarde a aprovação da Shopee",
            description: "O processo de aprovação pode levar de 2 a 5 dias úteis."
          },
          {
            title: "Obtenha suas credenciais de API",
            description: "Localize seu ID de Afiliado e Token de Acesso no painel de controle."
          },
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
          title: "Taxa de Comissão",
          message: "As taxas de comissão da Shopee variam entre 3% e 12% dependendo da categoria do produto. Categorias como eletrônicos tendem a ter taxas menores, enquanto moda e beleza oferecem percentuais mais altos.",
          type: "info"
        }}
      />
      
      <MarketplaceSetupLayout
        marketplaceId="shopee"
        title="Configuração da Shopee"
        alertMessage="Para integrar com a Shopee, você precisará se cadastrar no programa Shopee Affiliates e obter suas credenciais de API. Siga o guia passo a passo abaixo."
        steps={[
          {
            title: "Cadastro no Shopee Affiliates",
            description: (
              <div className="space-y-2">
                <p>Para começar, você precisa se cadastrar no programa de afiliados da Shopee.</p>
                <p>Siga estas etapas:</p>
                <ol className="list-decimal ml-5 space-y-2">
                  <li>Acesse o site do <a href="https://affiliate.shopee.com.br/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Shopee Affiliates Brasil</a></li>
                  <li>Clique em "Inscrever-se"</li>
                  <li>Complete o processo de inscrição com suas informações</li>
                  <li>Aguarde a aprovação da Shopee</li>
                </ol>
              </div>
            ),
            action: {
              label: "Visitar Shopee Affiliates",
              href: "https://affiliate.shopee.com.br/"
            }
          },
          {
            title: "Obtenha suas Credenciais de API",
            description: (
              <div className="space-y-2">
                <p>Após a aprovação, você receberá acesso às suas credenciais de API.</p>
                <p>Para encontrar suas credenciais:</p>
                <ol className="list-decimal ml-5 space-y-2">
                  <li>Faça login na sua conta do Shopee Affiliates</li>
                  <li>Acesse a seção "Configurações" ou "API"</li>
                  <li>Copie seu ID de Afiliado e Token de Acesso</li>
                </ol>
                <p>Essas informações são essenciais para conectar sua plataforma à API da Shopee.</p>
              </div>
            ),
            action: {
              label: "Acessar Conta de Afiliado",
              href: "https://affiliate.shopee.com.br/login"
            }
          },
          {
            title: "Configure suas Credenciais",
            description: (
              <div className="space-y-2">
                <p>Agora, insira suas credenciais no formulário abaixo:</p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>ID de Afiliado: Seu número de identificação único</li>
                  <li>Token de Acesso: Chave para autenticar suas solicitações à API</li>
                  <li>Código de Rastreamento: Código usado para identificar suas referências</li>
                </ul>
                <p>Clique em "Testar Conexão" para verificar se está funcionando.</p>
              </div>
            )
          }
        ]}
        formFields={[
          {
            id: "affiliateId",
            label: "ID de Afiliado",
            type: "text",
            placeholder: "12345678",
            helperText: "Seu ID numérico único de afiliado Shopee."
          },
          {
            id: "accessToken",
            label: "Token de Acesso",
            type: "password",
            placeholder: "••••••••••••••••••••",
            helperText: "Token de autenticação para a API da Shopee."
          },
          {
            id: "trackingCode",
            label: "Código de Rastreamento",
            type: "text",
            placeholder: "SEUSITE",
            helperText: "Código usado para rastrear suas referências."
          }
        ]}
        formTitle="Shopee Affiliates"
        formDescription="Configure suas credenciais de afiliado da Shopee."
        troubleshootingItems={[
          {
            title: "Minha conta não foi aprovada",
            description: "A Shopee pode levar alguns dias para aprovar sua conta. Certifique-se de que seu site atende às diretrizes do programa."
          },
          {
            title: "Token de acesso expirado",
            description: "Os tokens da Shopee podem expirar. Se estiver enfrentando erros de autenticação, tente gerar um novo token no painel de afiliados."
          },
          {
            title: "Problemas com rastreamento",
            description: "Certifique-se de que seu código de rastreamento está correto e que os links estão formatados adequadamente."
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
