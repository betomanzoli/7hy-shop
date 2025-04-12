
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiCredentialsForm } from '@/components/admin/marketplaces/ApiCredentialsForm';
import { SetupSteps } from '@/components/admin/marketplaces/SetupSteps';
import { useToast } from '@/hooks/use-toast';

const AmazonSetup = () => {
  const [activeTab, setActiveTab] = useState('setup');
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'error' | null>(null);
  const { toast } = useToast();

  const amazonSetupSteps = [
    {
      title: 'Criar Conta de Afiliado',
      description: (
        <div className="space-y-2">
          <p>Se você ainda não possui uma conta no Amazon Associates:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Visite o site do Amazon Associates</li>
            <li>Complete o processo de registro</li>
            <li>Verifique sua identidade e configure os métodos de pagamento</li>
          </ol>
        </div>
      ),
      action: {
        label: 'Ir para Amazon Associates',
        href: 'https://associados.amazon.com.br/'
      }
    },
    {
      title: 'Registrar uma Aplicação',
      description: (
        <div className="space-y-2">
          <p>Crie uma nova aplicação no Amazon Product Advertising API:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Acesse o console do Product Advertising API</li>
            <li>Registre uma nova aplicação</li>
            <li>Anote seu Access Key ID e Secret Key</li>
          </ol>
        </div>
      ),
      action: {
        label: 'Console da API',
        href: 'https://affiliate-program.amazon.com/assoc_credentials/home'
      }
    },
    {
      title: 'Configurar Acesso à API',
      description: (
        <div className="space-y-2">
          <p>Configure as permissões adequadas da API:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>No console do Product Advertising API:</li>
            <li className="ml-6">- Verifique suas quotas de requisição</li>
            <li className="ml-6">- Configure sua URL de retorno</li>
            <li>Defina sua Tag de Rastreamento (tracking ID):</li>
            <li className="ml-6"><code className="bg-muted p-1 rounded">7hyshop-20</code> (exemplo)</li>
          </ol>
        </div>
      )
    },
    {
      title: 'Testar Funcionalidade',
      description: (
        <div className="space-y-2">
          <p>Teste a API com uma chamada simples:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Use a operação SearchItems para buscar produtos</li>
            <li>Verifique se os links de afiliados estão sendo gerados corretamente</li>
            <li>Confirme que as estatísticas estão sendo registradas</li>
          </ol>
        </div>
      )
    },
    {
      title: 'Configurar Credenciais',
      description: (
        <div className="space-y-2">
          <p>Insira suas credenciais da API no formulário abaixo:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Access Key ID da sua aplicação</li>
            <li>Secret Key da sua aplicação</li>
            <li>Tag de Rastreamento (Tracking ID) da sua conta de afiliado</li>
            <li>ID de Parceiro (opcional para alguns mercados)</li>
          </ol>
          <p>Após inserir suas credenciais, mude para a aba "Configuração da API" para salvá-las.</p>
        </div>
      ),
      action: {
        label: 'Ir para Configuração da API',
        onClick: () => setActiveTab('credentials')
      }
    }
  ];

  const amazonApiFields = [
    {
      id: 'accessKeyId',
      label: 'Access Key ID',
      type: 'text',
      placeholder: 'AKIAIOSFODNN7EXAMPLE',
      helperText: 'O Access Key ID da sua aplicação na Product Advertising API'
    },
    {
      id: 'secretKey',
      label: 'Secret Key',
      type: 'password',
      placeholder: '••••••••••••••••••••••••••••••••',
      helperText: 'A Secret Key da sua aplicação na Product Advertising API'
    },
    {
      id: 'trackingId',
      label: 'Tag de Rastreamento (Tracking ID)',
      type: 'text',
      placeholder: '7hyshop-20',
      helperText: 'Sua tag de rastreamento de afiliado da Amazon'
    },
    {
      id: 'region',
      label: 'Região',
      type: 'text',
      placeholder: 'com.br',
      helperText: 'Região da Amazon (com.br para Brasil, com para EUA, etc)'
    }
  ];

  const handleTestConnection = () => {
    toast({
      title: "Testando conexão...",
      description: "Tentando conectar à API da Amazon",
    });
    
    // Simulate API test
    setTimeout(() => {
      const success = Math.random() > 0.5;
      
      if (success) {
        setApiStatus('connected');
        toast({
          title: "Conexão bem-sucedida",
          description: "Conexão com a API da Amazon estabelecida",
        });
      } else {
        setApiStatus('error');
        toast({
          title: "Falha na conexão",
          description: "Não foi possível conectar à API da Amazon. Verifique suas credenciais.",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const handleSubmitCredentials = (data: Record<string, string>) => {
    console.log("Credenciais da API:", data);
    toast({
      title: "Credenciais salvas",
      description: "Suas credenciais da API da Amazon foram salvas",
    });
    
    setApiStatus('connected');
  };

  return (
    <AdminLayout title="Configuração de Afiliados Amazon">
      <div className="max-w-4xl">
        <Tabs defaultValue="setup" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="setup">Guia de Configuração</TabsTrigger>
            <TabsTrigger value="credentials">Configuração da API</TabsTrigger>
            <TabsTrigger value="analytics">Estatísticas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup">
            <Card>
              <CardHeader>
                <CardTitle>Integração com Amazon Associates</CardTitle>
                <CardDescription>
                  Siga este guia passo a passo para conectar sua conta de afiliado da Amazon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SetupSteps 
                  steps={amazonSetupSteps} 
                  onComplete={() => setActiveTab('credentials')}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="credentials">
            <ApiCredentialsForm
              title="Credenciais da API Amazon Associates"
              description="Insira suas credenciais da API Product Advertising para estabelecer uma conexão"
              fields={amazonApiFields}
              onSubmit={handleSubmitCredentials}
              onTest={handleTestConnection}
              apiStatus={apiStatus}
            />
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Afiliados</CardTitle>
                <CardDescription>
                  Acompanhe o desempenho dos seus links de afiliado da Amazon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  {apiStatus === 'connected' ? (
                    <div className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="bg-muted rounded-lg p-4 text-center">
                          <p className="text-sm text-muted-foreground mb-1">Cliques (Hoje)</p>
                          <p className="text-2xl font-bold">0</p>
                        </div>
                        <div className="bg-muted rounded-lg p-4 text-center">
                          <p className="text-sm text-muted-foreground mb-1">Vendas (Mês Atual)</p>
                          <p className="text-2xl font-bold">0</p>
                        </div>
                        <div className="bg-muted rounded-lg p-4 text-center">
                          <p className="text-sm text-muted-foreground mb-1">Comissões (Total)</p>
                          <p className="text-2xl font-bold">R$ 0,00</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        As estatísticas são atualizadas diariamente. Os dados são importados diretamente da sua conta Amazon Associates.
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground mb-4">
                      Você precisa configurar suas credenciais de API antes de visualizar estatísticas.
                    </p>
                  )}
                  {apiStatus !== 'connected' && (
                    <button 
                      onClick={() => setActiveTab('credentials')}
                      className="text-primary hover:underline"
                    >
                      Ir para Configuração da API
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AmazonSetup;
