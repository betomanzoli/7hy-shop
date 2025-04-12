
import React from 'react';
import { MarketplaceSetupLayout } from '@/components/admin/marketplaces/MarketplaceSetupLayout';
import { AdminSetupGuide } from '@/components/admin/AdminSetupGuide';

const MercadoLivreSetup = () => {
  return (
    <>
      <AdminSetupGuide
        title="Configuração do Mercado Livre Afiliados"
        description="Siga estes passos para configurar sua integração com o programa de afiliados do Mercado Livre."
        steps={[
          {
            title: "Crie uma conta no programa de afiliados do Mercado Livre",
            description: "Acesse o site oficial e complete o cadastro fornecendo as informações necessárias."
          },
          {
            title: "Crie uma aplicação no portal de desenvolvedores",
            description: "Você precisará criar uma aplicação para obter as credenciais de API."
          },
          {
            title: "Obtenha suas credenciais de API",
            description: "Copie o Client ID, Client Secret e código de afiliado."
          },
          {
            title: "Configure suas credenciais na plataforma",
            description: "Insira as credenciais no formulário abaixo e teste a conexão."
          }
        ]}
        tips={[
          "O Mercado Livre oferece uma das maiores comissões entre os marketplaces brasileiros para algumas categorias.",
          "Produtos usados também geram comissões no programa de afiliados do Mercado Livre.",
          "Utilize os relatórios detalhados para identificar quais produtos têm as maiores taxas de conversão.",
          "Considere focar em produtos de nicho que tenham menos concorrência entre afiliados."
        ]}
        alertInfo={{
          title: "Política de cookies",
          message: "O Mercado Livre utiliza cookies de 30 dias para atribuição de comissões. Isso significa que você receberá comissão se o usuário comprar até 30 dias após clicar no seu link.",
          type: "info"
        }}
      />
      
      <MarketplaceSetupLayout
        marketplaceId="mercadolivre"
        title="Configuração do Mercado Livre"
        alertMessage="Para integrar com o Mercado Livre, você precisará se cadastrar no programa de afiliados e obter suas credenciais de API. Siga o guia passo a passo abaixo."
        steps={[
          {
            title: "Cadastro no Programa de Afiliados",
            description: (
              <div className="space-y-2">
                <p>Para começar, você precisa se cadastrar no programa de afiliados do Mercado Livre.</p>
                <p>Siga estas etapas:</p>
                <ol className="list-decimal ml-5 space-y-2">
                  <li>Acesse o site de <a href="https://www.mercadolivre.com.br/brandprotection/affiliates" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Afiliados do Mercado Livre</a></li>
                  <li>Clique em "Inscrever-se"</li>
                  <li>Complete o processo de inscrição com suas informações</li>
                  <li>Aguarde a aprovação do Mercado Livre</li>
                </ol>
              </div>
            ),
            action: {
              label: "Visitar Afiliados do Mercado Livre",
              href: "https://www.mercadolivre.com.br/brandprotection/affiliates"
            }
          },
          {
            title: "Obtenha suas Credenciais de API",
            description: (
              <div className="space-y-2">
                <p>Após a aprovação, você receberá acesso às suas credenciais de API.</p>
                <p>Para encontrar suas credenciais:</p>
                <ol className="list-decimal ml-5 space-y-2">
                  <li>Faça login na sua conta de desenvolvedor do Mercado Livre</li>
                  <li>Acesse a seção "Aplicativos"</li>
                  <li>Crie um novo aplicativo ou selecione um existente</li>
                  <li>Copie seu Client ID, Client Secret e código de afiliado</li>
                </ol>
              </div>
            ),
            action: {
              label: "Acessar Conta de Desenvolvedor",
              href: "https://developers.mercadolivre.com.br/apps"
            }
          },
          {
            title: "Configure suas Credenciais",
            description: (
              <div className="space-y-2">
                <p>Agora, insira suas credenciais no formulário abaixo:</p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Client ID: Identificador do seu aplicativo</li>
                  <li>Client Secret: Chave secreta do seu aplicativo</li>
                  <li>Código de Afiliado: Código usado para identificar suas referências</li>
                </ul>
                <p>Clique em "Testar Conexão" para verificar se está funcionando.</p>
              </div>
            )
          }
        ]}
        formFields={[
          {
            id: "clientId",
            label: "Client ID",
            type: "text",
            placeholder: "12345678901234567890",
            helperText: "ID do seu aplicativo no Mercado Livre."
          },
          {
            id: "clientSecret",
            label: "Client Secret",
            type: "password",
            placeholder: "••••••••••••••••••••",
            helperText: "Chave secreta do seu aplicativo no Mercado Livre."
          },
          {
            id: "affiliateCode",
            label: "Código de Afiliado",
            type: "text",
            placeholder: "SEUSITE",
            helperText: "Código usado para rastrear suas referências."
          }
        ]}
        formTitle="Afiliados do Mercado Livre"
        formDescription="Configure suas credenciais de afiliado do Mercado Livre."
        troubleshootingItems={[
          {
            title: "Minha aplicação não foi aprovada",
            description: "O Mercado Livre pode levar alguns dias para aprovar sua aplicação. Certifique-se de fornecer todas as informações necessárias."
          },
          {
            title: "Erros de autenticação",
            description: "Verifique se o Client ID e Client Secret estão corretos. Os tokens de acesso expiram após algumas horas e precisam ser renovados."
          },
          {
            title: "Limites de API",
            description: "A API do Mercado Livre tem limites de requisições. Se estiver encontrando erros 429, reduza a frequência de suas solicitações."
          }
        ]}
        docsLink={{
          url: "https://developers.mercadolivre.com.br/documentation",
          label: "Consultar documentação técnica"
        }}
      />
    </>
  );
};

export default MercadoLivreSetup;
