
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SetupSteps } from '@/components/admin/marketplaces/SetupSteps';
import { ApiCredentialsForm } from '@/components/admin/marketplaces/ApiCredentialsForm';
import { TroubleshootingSection } from '@/components/admin/marketplaces/TroubleshootingSection';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
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
              description: `Você concluiu o processo de configuração da ${marketplaceId === 'mercadolivre' ? 'do' : 'da'} ${marketplaceId === 'amazon' ? 'Amazon' : marketplaceId === 'shopee' ? 'Shopee' : 'Mercado Livre'}.`,
            });
          }}
        />
        
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Credenciais de API</h2>
          <ApiCredentialsForm
            title={formTitle}
            description={formDescription}
            fields={formFields}
            onSubmit={saveCredentials}
            onTest={testConnection}
            isLoading={isLoading}
            apiStatus={apiStatus}
          />
        </div>
        
        <TroubleshootingSection items={troubleshootingItems} docsLink={docsLink} />
      </div>
    </AdminLayout>
  );
}
