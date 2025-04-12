
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, KeyRound, Save, TestTube } from 'lucide-react';

interface Field {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  helperText?: string;
}

interface ApiCredentialsFormProps {
  title: string;
  description: string;
  fields: Field[];
  onSubmit: (data: Record<string, string>) => void;
  onTest?: () => void;
  isLoading?: boolean;
  apiStatus?: 'connected' | 'disconnected' | 'error' | null;
}

export function ApiCredentialsForm({
  title,
  description,
  fields,
  onSubmit,
  onTest,
  isLoading = false,
  apiStatus = null
}: ApiCredentialsFormProps) {
  const [formData, setFormData] = React.useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {apiStatus && (
            <div className={`p-3 rounded-md text-sm ${
              apiStatus === 'connected' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : apiStatus === 'error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
            }`}>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>
                  {apiStatus === 'connected' 
                    ? 'API connection successful!' 
                    : apiStatus === 'error'
                    ? 'API connection failed. Please check your credentials.'
                    : 'API not connected. Please configure your credentials.'}
                </span>
              </div>
            </div>
          )}
          
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                onChange={handleChange}
                value={formData[field.id] || ''}
              />
              {field.helperText && (
                <p className="text-sm text-muted-foreground">{field.helperText}</p>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          {onTest && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onTest}
              disabled={isLoading}
            >
              <TestTube className="mr-2 h-4 w-4" />
              Test Connection
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            Save Credentials
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
