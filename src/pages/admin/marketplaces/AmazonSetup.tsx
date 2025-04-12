
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

const AmazonSetup = () => {
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
          marketplace_id: 'amazon',
          credentials: data,
          last_updated: new Date().toISOString()
        }, { onConflict: 'marketplace_id' });
      
      if (error) throw error;
      
      setApiStatus('connected');
      toast({
        title: "Credenciais salvas",
        description: "Suas credenciais da Amazon foram salvas com sucesso.",
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
        description: "Sua conexão com a API da Amazon está funcionando corretamente.",
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <AdminLayout title="Configuração da Amazon">
      <div className="max-w-3xl mx-auto space-y-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Informações importantes</AlertTitle>
          <AlertDescription>
            Para integrar com a Amazon, você precisará se cadastrar no programa Amazon Associates e obter suas credenciais de API. Siga o guia passo a passo abaixo.
          </AlertDescription>
        </Alert>
        
        <SetupSteps 
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
          onComplete={() => {
            toast({
              title: "Configuração concluída",
              description: "Você concluiu o processo de configuração da Amazon.",
            });
          }}
        />
        
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Credenciais de API</h2>
          <ApiCredentialsForm
            title="Amazon Associates"
            description="Configure suas credenciais de afiliado da Amazon."
            fields={[
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
                A Amazon pode levar alguns dias para aprovar sua conta. Certifique-se de que seu site atende às diretrizes do programa.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Não estou vendo comissões</h3>
              <p className="text-sm text-muted-foreground">
                As comissões podem levar até 24 horas para aparecer no seu painel da Amazon. Verifique se os links estão configurados corretamente.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Erros na API</h3>
              <p className="text-sm text-muted-foreground">
                Certifique-se de que suas credenciais estão corretas. Se o problema persistir, consulte a documentação da API ou entre em contato com o suporte da Amazon.
              </p>
            </div>
            <a 
              href="https://associados.amazon.com.br/help/operating" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Consultar documentação completa
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AmazonSetup;
