
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SetupSteps } from '@/components/admin/marketplaces/SetupSteps';
import { ApiCredentialsForm } from '@/components/admin/marketplaces/ApiCredentialsForm';
import { TroubleshootingSection } from '@/components/admin/marketplaces/TroubleshootingSection';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Mail } from 'lucide-react';
import { useMarketplaceCredentials, MarketplaceId } from '@/hooks/useMarketplaceCredentials';
import { useToast } from '@/hooks/use-toast';

export interface SetupStep {
  title: string;
  description: React.ReactNode;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  helperText?: string;
}

export interface TroubleshootingItem {
  title: string;
  description: string;
}

interface MarketplaceSetupLayoutProps {
  marketplaceId: MarketplaceId;
  title: string;
  alertMessage: string;
  steps: SetupStep[];
  formFields: FormField[];
  formTitle: string;
  formDescription: string;
  troubleshootingItems: TroubleshootingItem[];
  docsLink: {
    url: string;
    label: string;
  };
}

export function MarketplaceSetupLayout({
  marketplaceId,
  title,
  alertMessage,
  steps,
  formFields,
  formTitle,
  formDescription,
  troubleshootingItems,
  docsLink
}: MarketplaceSetupLayoutProps) {
  const { apiStatus, isLoading, saveCredentials, testConnection } = useMarketplaceCredentials(marketplaceId);
  const { toast } = useToast();

  const handleSaveCredentials = (data: Record<string, string>) => {
    saveCredentials(marketplaceId, data);
  };

  return (
    <AdminLayout title={title}>
      <div className="max-w-3xl mx-auto space-y-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Informações importantes</AlertTitle>
          <AlertDescription>
            {alertMessage}
          </AlertDescription>
        </Alert>
        
        <SetupSteps 
          steps={steps}
          onComplete={() => {
            toast({
              title: "Configuração concluída",
              description: `Você concluiu o processo de configuração da ${marketplaceId === 'amazon' ? 'Amazon' : 'Shopee'}.`,
            });
          }}
        />
        
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Credenciais de API</h2>
          <ApiCredentialsForm
            title={formTitle}
            description={formDescription}
            fields={formFields}
            onSubmit={handleSaveCredentials}
            onTest={testConnection}
            isLoading={isLoading}
            apiStatus={apiStatus}
          />
        </div>
        
        <TroubleshootingSection items={troubleshootingItems} docsLink={docsLink} />
        
        <div className="border rounded-lg p-6 bg-muted/40">
          <h2 className="text-xl font-semibold mb-4">Suporte Administrativo</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>Para qualquer dúvida administrativa, entre em contato: 7hyckshop@gmail.com</span>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Este email é apenas para uso administrativo interno. Por favor, não compartilhe com usuários finais.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
