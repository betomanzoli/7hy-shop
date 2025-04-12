
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
      title: 'Create Seller Account',
      description: (
        <div className="space-y-2">
          <p>If you don't already have an Amazon Seller account:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Visit the Amazon Seller Central website</li>
            <li>Complete the registration process</li>
            <li>Verify your identity and set up payment methods</li>
          </ol>
        </div>
      ),
      action: {
        label: 'Go to Amazon Seller Central',
        href: 'https://sellercentral.amazon.com/'
      }
    },
    {
      title: 'Register a Developer App',
      description: (
        <div className="space-y-2">
          <p>Create a new application in the Amazon Developer Console:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Navigate to the Amazon Developer Console</li>
            <li>Register a new application</li>
            <li>Select "Seller Central" as the API access type</li>
            <li>Note your Client ID and Client Secret</li>
          </ol>
        </div>
      ),
      action: {
        label: 'Amazon Developer Console',
        href: 'https://developer.amazonservices.com/'
      }
    },
    {
      title: 'Set API Access',
      description: (
        <div className="space-y-2">
          <p>Configure the appropriate API permissions:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>In your Developer App, add the required scopes:</li>
            <li className="ml-6">- Products API</li>
            <li className="ml-6">- Orders API</li>
            <li className="ml-6">- Inventory API</li>
            <li>Set your application's redirect URL to:</li>
            <li className="ml-6"><code className="bg-muted p-1 rounded">https://7hy.shop/api/amazon/callback</code></li>
          </ol>
        </div>
      )
    },
    {
      title: 'Generate Access Token',
      description: (
        <div className="space-y-2">
          <p>Generate a refresh token for API access:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Use the LWA (Login with Amazon) authorization flow</li>
            <li>Authorize your application to access your seller account</li>
            <li>Exchange the authorization code for a refresh token</li>
            <li>Store the refresh token securely</li>
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
            <li>Client ID from your Developer App</li>
            <li>Client Secret from your Developer App</li>
            <li>Refresh Token generated in the previous step</li>
            <li>Your Seller ID from Amazon Seller Central</li>
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

  const amazonApiFields = [
    {
      id: 'clientId',
      label: 'Client ID',
      type: 'text',
      placeholder: 'amzn1.application-oa2-client.xxxxxxxx',
      helperText: 'The Client ID from your Amazon Developer App'
    },
    {
      id: 'clientSecret',
      label: 'Client Secret',
      type: 'password',
      placeholder: '••••••••••••••••••••••••••••••••',
      helperText: 'The Client Secret from your Amazon Developer App'
    },
    {
      id: 'refreshToken',
      label: 'Refresh Token',
      type: 'password',
      placeholder: 'Amzn.••••••••••••••••••••••••••••••••',
      helperText: 'The long-lived token used to generate access tokens'
    },
    {
      id: 'sellerId',
      label: 'Seller ID',
      type: 'text',
      placeholder: 'A2XXXXXXXXXXX',
      helperText: 'Your Amazon Seller ID from Seller Central'
    }
  ];

  const handleTestConnection = () => {
    // In a real app, this would make an API call to test the connection
    toast({
      title: "Testing connection...",
      description: "Attempting to connect to Amazon API",
    });
    
    // Simulate API test
    setTimeout(() => {
      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.5;
      
      if (success) {
        setApiStatus('connected');
        toast({
          title: "Connection successful",
          description: "Amazon API connection established",
        });
      } else {
        setApiStatus('error');
        toast({
          title: "Connection failed",
          description: "Could not connect to Amazon API. Please check your credentials.",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const handleSubmitCredentials = (data: Record<string, string>) => {
    console.log("API Credentials:", data);
    toast({
      title: "Credentials saved",
      description: "Your Amazon API credentials have been saved",
    });
    
    // In a real app, this would store the credentials securely
    // and establish a connection to the Amazon API
    setApiStatus('connected');
  };

  return (
    <AdminLayout title="Amazon Integration Setup">
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
                <CardTitle>Amazon Seller Central Integration</CardTitle>
                <CardDescription>
                  Follow this step-by-step guide to connect your Amazon Seller account
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
              title="Amazon API Credentials"
              description="Enter your Amazon Seller Central API credentials to establish a connection"
              fields={amazonApiFields}
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
                  Configure how products are imported from Amazon
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

export default AmazonSetup;
