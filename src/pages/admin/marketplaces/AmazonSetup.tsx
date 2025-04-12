
import React from 'react';
import { MarketplaceSetupLayout } from '@/components/admin/marketplaces/MarketplaceSetupLayout';

const AmazonSetup = () => {
  return (
    <MarketplaceSetupLayout
      marketplaceId="amazon"
      title="Configuração da Amazon"
      alertMessage="Para integrar com a Amazon, você precisará se cadastrar no programa Amazon Associates e obter suas credenciais de API. Siga o guia passo a passo abaixo."
      steps={[
        {
          title: "Cadastro no Amazon Associates",
          description: (
            <div className="space-y-2">
              <p>Para começar, você precisa se cadastrar no programa de afiliados da Amazon (Amazon Associates).</p>
              <p>Siga estas etapas:</p>
              <ol className="list-decimal ml-5 space-y-2">
                <li>Acesse o site do <a href="https://associados.amazon.com.br/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon Associates Brasil</a></li>
                <li>Clique em "Inscrever-se"</li>
                <li>Complete o processo de inscrição com suas informações</li>
                <li>Aguarde a aprovação da Amazon</li>
              </ol>
            </div>
          ),
          action: {
            label: "Visitar Amazon Associates",
            href: "https://associados.amazon.com.br/"
          }
        },
        {
          title: "Obtenha sua ID de Associado",
          description: (
            <div className="space-y-2">
              <p>Após a aprovação, você receberá sua ID de Associado (tag de afiliado).</p>
              <p>Esta ID tem o formato <code>seusite-20</code> e é usada para rastrear suas referências.</p>
              <p>Para encontrar sua ID:</p>
              <ol className="list-decimal ml-5 space-y-2">
                <li>Faça login na sua conta do Amazon Associates</li>
                <li>Clique em "Ferramentas" no menu</li>
                <li>Selecione "Links de Produtos"</li>
                <li>Sua ID de Associado aparecerá no topo da página</li>
              </ol>
            </div>
          ),
          action: {
            label: "Acessar Conta de Associado",
            href: "https://associados.amazon.com.br/home"
          }
        },
        {
          title: "Configure suas Credenciais",
          description: (
            <div className="space-y-2">
              <p>Agora, insira suas credenciais no formulário abaixo:</p>
              <ul className="list-disc ml-5 space-y-2">
                <li>ID de Associado (tag): Sua ID única do programa</li>
                <li>Chave de API (opcional): Se você tiver acesso à API Product Advertising</li>
                <li>Chave Secreta (opcional): O par da chave de API</li>
              </ul>
              <p>Clique em "Testar Conexão" para verificar se está funcionando.</p>
            </div>
          )
        }
      ]}
      formFields={[
        {
          id: "associateTag",
          label: "ID de Associado (tag)",
          type: "text",
          placeholder: "seusite-20",
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
      formDescription="Configure suas credenciais de afiliado da Amazon."
      troubleshootingItems={[
        {
          title: "Minha conta não foi aprovada",
          description: "A Amazon pode levar alguns dias para aprovar sua conta. Certifique-se de que seu site atende às diretrizes do programa."
        },
        {
          title: "Não estou vendo comissões",
          description: "As comissões podem levar até 24 horas para aparecer no seu painel da Amazon. Verifique se os links estão configurados corretamente."
        },
        {
          title: "Erros na API",
          description: "Certifique-se de que suas credenciais estão corretas. Se o problema persistir, consulte a documentação da API ou entre em contato com o suporte da Amazon."
        }
      ]}
      docsLink={{
        url: "https://associados.amazon.com.br/help/operating",
        label: "Consultar documentação completa"
      }}
    />
  );
};

export default AmazonSetup;
