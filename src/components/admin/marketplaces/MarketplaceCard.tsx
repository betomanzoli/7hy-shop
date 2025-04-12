
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ExternalLink, Settings } from 'lucide-react';

export type MarketplaceStatus = 'active' | 'inactive' | 'pending' | 'error';

interface MarketplaceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: MarketplaceStatus;
  lastSync?: string;
  setupLink: string;
  docsLink: string;
}

export function MarketplaceCard({
  title,
  description,
  icon,
  status,
  lastSync,
  setupLink,
  docsLink
}: MarketplaceCardProps) {
  const statusLabel = {
    active: 'Ativo',
    inactive: 'Não Configurado',
    pending: 'Configuração em Andamento',
    error: 'Erro de Conexão'
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          {icon}
        </div>
        <div className="grid gap-1">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="line-clamp-1">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className={`status-badge ${status}`}>
              {statusLabel[status]}
            </span>
          </div>
          {lastSync && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Última Sincronização</span>
              <span>{lastSync}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2 pt-2">
        <Link to={setupLink} className="w-full">
          <Button variant="default" className="w-full gap-1">
            <Settings className="h-4 w-4 mr-1" />
            {status === 'inactive' ? 'Configurar Integração' : 'Gerenciar Integração'}
          </Button>
        </Link>
        <a href={docsLink} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button variant="outline" className="w-full gap-1">
            <ExternalLink className="h-4 w-4 mr-1" />
            Ver Documentação
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}
