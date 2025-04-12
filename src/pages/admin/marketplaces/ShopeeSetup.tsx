
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiCredentialsForm } from '@/components/admin/marketplaces/ApiCredentialsForm';
import { SetupSteps } from '@/components/admin/marketplaces/SetupSteps';
import { useToast } from '@/hooks/use-toast';

const ShopeeSetup = () => {
  const [activeTab, setActiveTab] = useState('setup');
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'error' | null>(null);
  const { toast } = useToast();

  const shopeeSetupSteps = [
    {
      title: 'Create Shopee Account',
      description: (
        <div className="space-y-2">
          <p>If you don't already have a Shopee seller account:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Visit the Shopee Seller Center website</li>
            <li>Complete the registration process</li>
            <li>Verify your identity and set up payment methods</li>
          </ol>
        </div>
      ),
      action: {
        label: 'Go to Shopee Seller Center',
        href: 'https://seller.shopee.com/'
      }
    },
    {
      title: 'Register Open Platform App',
      description: (
        <div className="space-y-2">
          <p>Create a new application in the Shopee Open Platform:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Navigate to Shopee Open Platform</li>
            <li>Create a new partner application</li>
            <li>Fill in your application details</li>
            <li>Note your Partner ID and Partner Key</li>
          </ol>
        </div>
      ),
      action: {
        label: 'Shopee Open Platform',
        href: 'https://open.shopee.com/'
      }
    },
    {
      title: 'Configure Redirect URL',
      description: (
        <div className="space-y-2">
          <p>Set up the redirect URL in your Shopee app settings:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>In your partner application, add the following redirect URL:</li>
            <li className="ml-6"><code className="bg-muted p-1 rounded">https://7hy.shop/api/shopee/callback</code></li>
            <li>Save your application settings</li>
          </ol>
        </div>
      )
    },
    {
      title: 'Authorize Shop',
      description: (
        <div className="space-y-2">
          <p>Link your Shopee shop to your partner application:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Generate an authorization URL using your Partner ID</li>
            <li>Visit the URL and log in to your Shopee seller account</li>
            <li>Authorize the application to access your shop data</li>
            <li>Note the shop ID and access token from the callback</li>
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
            <li>Partner ID from your Open Platform app</li>
            <li>Partner Key from your Open Platform app</li>
            <li>Shop ID from the authorization process</li>
            <li>Access Token from the authorization process</li>
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

  const shopeeApiFields = [
    {
      id: 'partnerId',
      label: 'Partner ID',
      type: 'text',
      placeholder: '1234567',
      helperText: 'The Partner ID from your Shopee Open Platform app'
    },
    {
      id: 'partnerKey',
      label: 'Partner Key',
      type: 'password',
      placeholder: '••••••••••••••••••••••••••••••••',
      helperText: 'The Partner Key from your Shopee Open Platform app'
    },
    {
      id: 'shopId',
      label: 'Shop ID',
      type: 'text',
      placeholder: '123456789',
      helperText: 'Your Shopee Shop ID from the authorization process'
    },
    {
      id: 'accessToken',
      label: 'Access Token',
      type: 'password',
      placeholder: '••••••••••••••••••••••••••••••••',
      helperText: 'The access token received after authorization'
    }
  ];

  const handleTestConnection = () => {
    // In a real app, this would make an API call to test the connection
    toast({
      title: "Testing connection...",
      description: "Attempting to connect to Shopee API",
    });
    
    // Simulate API test
    setTimeout(() => {
      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.5;
      
      if (success) {
        setApiStatus('connected');
        toast({
          title: "Connection successful",
          description: "Shopee API connection established",
        });
      } else {
        setApiStatus('error');
        toast({
          title: "Connection failed",
          description: "Could not connect to Shopee API. Please check your credentials.",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const handleSubmitCredentials = (data: Record<string, string>) => {
    console.log("API Credentials:", data);
    toast({
      title: "Credentials saved",
      description: "Your Shopee API credentials have been saved",
    });
    
    // In a real app, this would store the credentials securely
    setApiStatus('connected');
  };

  return (
    <AdminLayout title="Shopee Integration Setup">
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
                <CardTitle>Shopee Open Platform Integration</CardTitle>
                <CardDescription>
                  Follow this step-by-step guide to connect your Shopee seller account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SetupSteps 
                  steps={shopeeSetupSteps} 
                  onComplete={() => setActiveTab('credentials')}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="credentials">
            <ApiCredentialsForm
              title="Shopee API Credentials"
              description="Enter your Shopee Open Platform API credentials to establish a connection"
              fields={shopeeApiFields}
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
                  Configure how products are imported from Shopee
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

export default ShopeeSetup;
