
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, CheckCircle, ExternalLink } from 'lucide-react';

interface SetupStep {
  title: string;
  description: React.ReactNode;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

interface SetupStepsProps {
  steps: SetupStep[];
  onComplete?: () => void;
}

export function SetupSteps({ steps, onComplete }: SetupStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    } else {
      setCompletedSteps([...completedSteps, currentStep]);
      if (onComplete) {
        onComplete();
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const isStepCompleted = (index: number) => {
    return completedSteps.includes(index);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ul className="flex w-full">
          {steps.map((step, index) => (
            <li 
              key={index} 
              className="relative flex-1"
            >
              <div className="flex items-center justify-center">
                <button
                  onClick={() => isStepCompleted(index) && setCurrentStep(index)}
                  disabled={!isStepCompleted(index)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    currentStep === index
                      ? 'bg-primary text-primary-foreground ring-2 ring-offset-2'
                      : isStepCompleted(index)
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isStepCompleted(index) ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </button>
                {index < steps.length - 1 && (
                  <div 
                    className={`h-[2px] w-full ${
                      isStepCompleted(index) ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
              <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center text-xs font-medium">
                {step.title}
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <Card className="mt-16">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {steps[currentStep].title}
            </h3>
            <div className="text-sm text-muted-foreground">
              {steps[currentStep].description}
            </div>
            
            {steps[currentStep].action && (
              <div className="pt-2">
                {steps[currentStep].action.href ? (
                  <a 
                    href={steps[currentStep].action.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    {steps[currentStep].action.label}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <Button 
                    onClick={steps[currentStep].action.onClick}
                    variant="secondary"
                  >
                    {steps[currentStep].action.label}
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        <Button onClick={handleNext}>
          {currentStep === steps.length - 1 ? (
            <>
              Concluir Configuração
              <CheckCircle className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Próxima Etapa
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
