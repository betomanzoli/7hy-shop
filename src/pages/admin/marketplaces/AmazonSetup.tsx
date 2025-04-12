
import React from 'react';
import { MarketplaceSetupLayout } from '@/components/admin/marketplaces/MarketplaceSetupLayout';
import { AdminSetupGuide } from '@/components/admin/AdminSetupGuide';

// Amazon Associate ID configured in the application
const AMAZON_ASSOCIATE_ID = "7hy01-20";

const AmazonSetup = () => {
  return (
    <>
      <AdminSetupGuide
        title="Configuração da Amazon Associates"
        description="Siga estes passos para configurar sua integração com o programa de afiliados da Amazon."
        steps={[
          {
            title: "Crie uma conta no programa Amazon Associates",
            description: "Acesse o site oficial e complete o cadastro fornecendo as informações necessárias.",
            completed: true
          },
          {
            title: "Aguarde a aprovação da Amazon",
            description: "O processo de aprovação pode levar de 1 a 3 dias úteis.",
            completed: true
          },
          {
            title: "Obtenha sua ID de Associado (tag)",
            description: "Sua ID de Associado é 7hy01-20, já configurada no sistema.",
            completed: true
          },
          {
            title: "Configure suas credenciais na plataforma",
            description: "Insira as credenciais no formulário abaixo e teste a conexão.",
            completed: true
          }
        ]}
        tips={[
          "Mantenha seu site atualizado com conteúdo relevante e original para aumentar as chances de aprovação.",
          "A Amazon possui regras estritas sobre o uso de suas imagens e logos. Certifique-se de seguir as diretrizes oficiais.",
          "Recomendamos focar em categorias específicas de produtos para melhorar suas taxas de conversão.",
          "Monitore regularmente suas estatísticas para identificar quais produtos geram mais comissões."
        ]}
        alertInfo={{
          title: "ID de Associado Configurado",
          message: "Sua ID de Associado da Amazon (7hy01-20) já está configurada no sistema. Você pode usar esta ID para criar links de afiliados e acompanhar suas comissões.",
          type: "success"
        }}
      />
      
      <MarketplaceSetupLayout
        marketplaceId="amazon"
        title="Configuração da Amazon"
        alertMessage="Sua integração com a Amazon já está configurada com o ID de Associado 7hy01-20. Você pode ajustar as configurações abaixo se necessário."
        steps={[
          {
            title: "Cadastro no Amazon Associates",
            description: (
              <div className="space-y-2">
                <p>Você já está cadastrado no programa de afiliados da Amazon (Amazon Associates).</p>
                <p>Detalhes da sua conta:</p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>ID de Associado: <span className="font-semibold">7hy01-20</span></li>
                  <li>ID exclusiva: <span className="font-semibold">7hy01</span></li>
                </ul>
              </div>
            ),
            action: {
              label: "Acessar Amazon Associates",
              href: "https://associados.amazon.com.br/"
            }
          },
          {
            title: "Verificar Status da Conta",
            description: (
              <div className="space-y-2">
                <p>Recomendamos verificar regularmente o status da sua conta de associado.</p>
                <p>Certifique-se de que seu site (7hy.shop) está corretamente vinculado à sua conta de associado.</p>
                <ol className="list-decimal ml-5 space-y-2">
                  <li>Faça login na sua conta do Amazon Associates</li>
                  <li>Navegue até "Sua conta de associado"</li>
                  <li>Selecione "Alterar a lista de sites e apps"</li>
                  <li>Verifique se 7hy.shop está listado e aprovado</li>
                </ol>
              </div>
            ),
            action: {
              label: "Verificar Conta de Associado",
              href: "https://associados.amazon.com.br/home"
            }
          },
          {
            title: "Monitorar Relatórios",
            description: (
              <div className="space-y-2">
                <p>Acompanhe o desempenho dos seus links de afiliados regularmente:</p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Verifique se as comissões estão sendo reportadas corretamente sob o ID 7hy01-20</li>
                  <li>Analise quais produtos estão gerando mais cliques e conversões</li>
                  <li>Ajuste sua estratégia de conteúdo com base nos relatórios</li>
                </ul>
              </div>
            ),
            action: {
              label: "Ver Relatórios",
              href: "https://associados.amazon.com.br/gp/associates/network/reports/main.html"
            }
          }
        ]}
        formFields={[
          {
            id: "associateTag",
            label: "ID de Associado (tag)",
            type: "text",
            placeholder: "7hy01-20",
            helperText: "A tag de afiliado fornecida pela Amazon."
          },
          {
            id: "accessKey",
            label: "Chave de API (opcional)",
            type: "text",
            placeholder: "AKIAXXXXXXXXXXXXXXXX",
            helperText: "Chave de acesso para a API Product Advertising."
          },
          {
            id: "secretKey",
            label: "Chave Secreta (opcional)",
            type: "password",
            placeholder: "••••••••••••••••••••",
            helperText: "Chave secreta associada à sua chave de API."
          }
        ]}
        formTitle="Amazon Associates"
        formDescription="Suas credenciais de afiliado da Amazon estão configuradas com o ID 7hy01-20."
        troubleshootingItems={[
          {
            title: "Links não estão gerando comissões",
            description: "Verifique se todos os links contêm seu ID de associado (7hy01-20) corretamente. As comissões podem levar até 24 horas para aparecer no painel."
          },
          {
            title: "Erros na API Product Advertising",
            description: "Se você estiver usando a API Product Advertising, certifique-se de que suas chaves de API estão corretas e que você está usando o formato adequado nas requisições."
          },
          {
            title: "Problemas com rastreamento de cliques",
            description: "Assegure-se de que os parâmetros de rastreamento estão presentes em todos os links. Para a Amazon, o parâmetro é '?tag=7hy01-20'."
          }
        ]}
        docsLink={{
          url: "https://associados.amazon.com.br/help/operating",
          label: "Consultar documentação completa"
        }}
      />
    </>
  );
};

export default AmazonSetup;
