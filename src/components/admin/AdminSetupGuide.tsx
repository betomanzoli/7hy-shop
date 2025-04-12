
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Step {
  title: string;
  description: string;
  completed?: boolean;
}

interface AdminSetupGuideProps {
  title: string;
  description: string;
  steps: Step[];
  tips?: string[];
  alertInfo?: {
    title: string;
    message: string;
    type?: 'info' | 'warning' | 'success';
  };
}

export function AdminSetupGuide({ title, description, steps, tips, alertInfo }: AdminSetupGuideProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="outline" className="uppercase">Guia</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {alertInfo && (
          <Alert variant={alertInfo.type === 'warning' ? 'destructive' : alertInfo.type === 'success' ? 'success' : 'default'}>
            {alertInfo.type === 'warning' ? (
              <AlertCircle className="h-4 w-4" />
            ) : alertInfo.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <InfoIcon className="h-4 w-4" />
            )}
            <AlertTitle>{alertInfo.title}</AlertTitle>
            <AlertDescription>{alertInfo.message}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Passo a Passo</h3>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${step.completed ? 'bg-green-500' : 'bg-muted'} text-xs text-white`}>
                  {step.completed ? <CheckCircle2 className="h-3 w-3" /> : index + 1}
                </div>
                <div>
                  <p className={`font-medium ${step.completed ? 'text-muted-foreground line-through' : ''}`}>
                    {step.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {tips && tips.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Dicas Úteis</h3>
            <div className="space-y-2">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <InfoIcon className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-muted-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
