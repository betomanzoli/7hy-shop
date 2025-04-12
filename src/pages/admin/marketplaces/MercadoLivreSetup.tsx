
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ApiCredentialsForm } from '@/components/admin/marketplaces/ApiCredentialsForm';
import { SetupSteps } from '@/components/admin/marketplaces/SetupSteps';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const MercadoLivreSetup = () => {
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'error' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleApiCredentialsSubmit = async (data: Record<string, string>) => {
    setIsLoading(true);
    
    try {
      // Save credentials to Supabase
      const { error } = await supabase
        .from('marketplace_credentials')
        .upsert(
          { 
            marketplace_id: 'mercadolivre',
            credentials: data,
            last_updated: new Date().toISOString()
          },
          { onConflict: 'marketplace_id' }
        );
      
      if (error) throw error;
      
      setApiStatus('connected');
      toast({
        title: "Credenciais salvas",
        description: "Suas credenciais do Mercado Livre foram salvas com sucesso.",
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
        description: "Sua conexão com a API do Mercado Livre está funcionando corretamente.",
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <AdminLayout title="Configuração do Mercado Livre">
      <div className="max-w-3xl mx-auto space-y-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Informações importantes</AlertTitle>
          <AlertDescription>
            Para integrar com o Mercado Livre, você precisará se cadastrar no programa de afiliados e obter suas credenciais de API. Siga o guia passo a passo abaixo.
          </AlertDescription>
        </Alert>
        
        <SetupSteps 
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
          onComplete={() => {
            toast({
              title: "Configuração concluída",
              description: "Você concluiu o processo de configuração do Mercado Livre.",
            });
          }}
        />
        
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Credenciais de API</h2>
          <ApiCredentialsForm
            title="Afiliados do Mercado Livre"
            description="Configure suas credenciais de afiliado do Mercado Livre."
            fields={[
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
              <h3 className="font-medium">Minha aplicação não foi aprovada</h3>
              <p className="text-sm text-muted-foreground">
                O Mercado Livre pode levar alguns dias para aprovar sua aplicação. Certifique-se de fornecer todas as informações necessárias.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Erros de autenticação</h3>
              <p className="text-sm text-muted-foreground">
                Verifique se o Client ID e Client Secret estão corretos. Os tokens de acesso expiram após algumas horas e precisam ser renovados.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Limites de API</h3>
              <p className="text-sm text-muted-foreground">
                A API do Mercado Livre tem limites de requisições. Se estiver encontrando erros 429, reduza a frequência de suas solicitações.
              </p>
            </div>
            <a 
              href="https://developers.mercadolivre.com.br/documentation" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Consultar documentação técnica
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MercadoLivreSetup;
