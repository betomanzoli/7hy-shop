
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface TroubleshootingItem {
  title: string;
  description: string;
}

interface TroubleshootingSectionProps {
  items: TroubleshootingItem[];
  docsLink: {
    url: string;
    label: string;
  };
}

export function TroubleshootingSection({ items, docsLink }: TroubleshootingSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Solução de Problemas</h2>
      <div className="bg-muted p-4 rounded-lg space-y-4">
        {items.map((item, index) => (
          <div key={index}>
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
        <a 
          href={docsLink.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-sm text-primary hover:underline"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          {docsLink.label}
        </a>
      </div>
    </div>
  );
}
