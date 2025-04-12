
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ApiCredentialsForm } from '@/components/admin/marketplaces/ApiCredentialsForm';
import { SetupSteps } from '@/components/admin/marketplaces/SetupSteps';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MarketplaceCredentials {
  marketplace_id: string;
  credentials: Record<string, string>;
  last_updated: string;
}

const ShopeeSetup = () => {
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'error' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleApiCredentialsSubmit = async (data: Record<string, string>) => {
    setIsLoading(true);
    
    try {
      // Save credentials to Supabase
      const { error } = await supabase
        .from('marketplace_credentials')
        .upsert({
          marketplace_id: 'shopee',
          credentials: data,
          last_updated: new Date().toISOString()
        }, { onConflict: 'marketplace_id' });
      
      if (error) throw error;
      
      setApiStatus('connected');
      toast({
        title: "Credenciais salvas",
        description: "Suas credenciais da Shopee foram salvas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar credenciais:", error);
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

  const handleTestConnection = () => {
    setIsLoading(true);
    // Simulando um teste de conexão
    setTimeout(() => {
      setApiStatus('connected');
      toast({
        title: "Conexão bem-sucedida",
        description: "Sua conexão com a API da Shopee está funcionando corretamente.",
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <AdminLayout title="Configuração da Shopee">
      <div className="max-w-3xl mx-auto space-y-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Informações importantes</AlertTitle>
          <AlertDescription>
            Para integrar com a Shopee, você precisará se cadastrar no programa Shopee Affiliates e obter suas credenciais de API. Siga o guia passo a passo abaixo.
          </AlertDescription>
        </Alert>
        
        <SetupSteps 
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
          onComplete={() => {
            toast({
              title: "Configuração concluída",
              description: "Você concluiu o processo de configuração da Shopee.",
            });
          }}
        />
        
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Credenciais de API</h2>
          <ApiCredentialsForm
            title="Shopee Affiliates"
            description="Configure suas credenciais de afiliado da Shopee."
            fields={[
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
            onSubmit={handleApiCredentialsSubmit}
            onTest={handleTestConnection}
            isLoading={isLoading}
            apiStatus={apiStatus}
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Solução de Problemas</h2>
          <div className="bg-muted p-4 rounded-lg space-y-4">
            <div>
              <h3 className="font-medium">Minha conta não foi aprovada</h3>
              <p className="text-sm text-muted-foreground">
                A Shopee pode levar alguns dias para aprovar sua conta. Certifique-se de que seu site atende às diretrizes do programa.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Token de acesso expirado</h3>
              <p className="text-sm text-muted-foreground">
                Os tokens da Shopee podem expirar. Se estiver enfrentando erros de autenticação, tente gerar um novo token no painel de afiliados.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Problemas com rastreamento</h3>
              <p className="text-sm text-muted-foreground">
                Certifique-se de que seu código de rastreamento está correto e que os links estão formatados adequadamente.
              </p>
            </div>
            <a 
              href="https://affiliate.shopee.com.br/faq" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Consultar perguntas frequentes
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ShopeeSetup;
