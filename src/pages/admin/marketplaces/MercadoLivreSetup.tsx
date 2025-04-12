
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiCredentialsForm } from '@/components/admin/marketplaces/ApiCredentialsForm';
import { SetupSteps } from '@/components/admin/marketplaces/SetupSteps';
import { useToast } from '@/hooks/use-toast';

const MercadoLivreSetup = () => {
  const [activeTab, setActiveTab] = useState('setup');
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'error' | null>(null);
  const { toast } = useToast();

  const mercadoLivreSetupSteps = [
    {
      title: 'Create Seller Account',
      description: (
        <div className="space-y-2">
          <p>If you don't already have a Mercado Livre seller account:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Visit the Mercado Livre website</li>
            <li>Complete the registration process</li>
            <li>Verify your identity and set up payment methods</li>
          </ol>
        </div>
      ),
      action: {
        label: 'Go to Mercado Livre',
        href: 'https://www.mercadolivre.com.br/'
      }
    },
    {
      title: 'Register Developer App',
      description: (
        <div className="space-y-2">
          <p>Create a new application in the Mercado Livre Developer Portal:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Navigate to Mercado Livre Developers</li>
            <li>Register as a developer</li>
            <li>Create a new application</li>
            <li>Note your App ID and Client Secret</li>
          </ol>
        </div>
      ),
      action: {
        label: 'Mercado Livre Developers',
        href: 'https://developers.mercadolivre.com.br/'
      }
    },
    {
      title: 'Configure Redirect URLs',
      description: (
        <div className="space-y-2">
          <p>Set up the redirect URL in your application settings:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>In your developer application, add the following redirect URL:</li>
            <li className="ml-6"><code className="bg-muted p-1 rounded">https://7hy.shop/api/mercadolivre/callback</code></li>
            <li>Save your application settings</li>
          </ol>
        </div>
      )
    },
    {
      title: 'Authorize Application',
      description: (
        <div className="space-y-2">
          <p>Generate an authorization code to get access to your Mercado Livre account:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Create an authorization URL using your App ID</li>
            <li>Visit the URL and log in to your Mercado Livre account</li>
            <li>Authorize the application to access your account data</li>
            <li>Receive the authorization code in the redirect URL</li>
            <li>Exchange the code for an access token and refresh token</li>
          </ol>
        </div>
      )
    },
    {
      title: 'Configure Credentials',
      description: (
        <div className="space-y-2">
          <p>Enter your API credentials in the form below:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>App ID from your developer application</li>
            <li>Client Secret from your developer application</li>
            <li>Access Token from the authorization process</li>
            <li>Refresh Token from the authorization process</li>
            <li>User ID from your Mercado Livre account</li>
          </ol>
          <p>After entering your credentials, switch to the "API Configuration" tab to save them.</p>
        </div>
      ),
      action: {
        label: 'Go to API Configuration Tab',
        onClick: () => setActiveTab('credentials')
      }
    }
  ];

  const mercadoLivreApiFields = [
    {
      id: 'appId',
      label: 'App ID',
      type: 'text',
      placeholder: '1234567890123456',
      helperText: 'The App ID from your Mercado Livre Developers application'
    },
    {
      id: 'clientSecret',
      label: 'Client Secret',
      type: 'password',
      placeholder: '••••••••••••••••••••••••••••••••',
      helperText: 'The Client Secret from your developer application'
    },
    {
      id: 'accessToken',
      label: 'Access Token',
      type: 'password',
      placeholder: '••••••••••••••••••••••••••••••••',
      helperText: 'The token received after authorization'
    },
    {
      id: 'refreshToken',
      label: 'Refresh Token',
      type: 'password',
      placeholder: '••••••••••••••••••••••••••••••••',
      helperText: 'The refresh token received after authorization'
    },
    {
      id: 'userId',
      label: 'User ID',
      type: 'text',
      placeholder: '123456789',
      helperText: 'Your Mercado Livre user ID'
    }
  ];

  const handleTestConnection = () => {
    // In a real app, this would make an API call to test the connection
    toast({
      title: "Testing connection...",
      description: "Attempting to connect to Mercado Livre API",
    });
    
    // Simulate API test
    setTimeout(() => {
      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.5;
      
      if (success) {
        setApiStatus('connected');
        toast({
          title: "Connection successful",
          description: "Mercado Livre API connection established",
        });
      } else {
        setApiStatus('error');
        toast({
          title: "Connection failed",
          description: "Could not connect to Mercado Livre API. Please check your credentials.",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const handleSubmitCredentials = (data: Record<string, string>) => {
    console.log("API Credentials:", data);
    toast({
      title: "Credentials saved",
      description: "Your Mercado Livre API credentials have been saved",
    });
    
    // In a real app, this would store the credentials securely
    setApiStatus('connected');
  };

  return (
    <AdminLayout title="Mercado Livre Integration Setup">
      <div className="max-w-4xl">
        <Tabs defaultValue="setup" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="setup">Setup Guide</TabsTrigger>
            <TabsTrigger value="credentials">API Configuration</TabsTrigger>
            <TabsTrigger value="products">Products Sync</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup">
            <Card>
              <CardHeader>
                <CardTitle>Mercado Livre API Integration</CardTitle>
                <CardDescription>
                  Follow this step-by-step guide to connect your Mercado Livre seller account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SetupSteps 
                  steps={mercadoLivreSetupSteps} 
                  onComplete={() => setActiveTab('credentials')}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="credentials">
            <ApiCredentialsForm
              title="Mercado Livre API Credentials"
              description="Enter your Mercado Livre API credentials to establish a connection"
              fields={mercadoLivreApiFields}
              onSubmit={handleSubmitCredentials}
              onTest={handleTestConnection}
              apiStatus={apiStatus}
            />
          </TabsContent>
          
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Products Synchronization</CardTitle>
                <CardDescription>
                  Configure how products are imported from Mercado Livre
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  <p className="text-muted-foreground mb-4">
                    You need to configure your API credentials before you can sync products.
                  </p>
                  <button 
                    onClick={() => setActiveTab('credentials')}
                    className="text-primary hover:underline"
                  >
                    Go to API Configuration
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default MercadoLivreSetup;
