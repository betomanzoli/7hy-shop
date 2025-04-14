
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ExternalLink, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MarketplaceLogo, MarketplaceType } from '@/components/marketplace/MarketplaceLogo';

export type MarketplaceStatus = 'connected' | 'disconnected' | 'pending';

interface MarketplaceCardProps {
  title: string;
  description: string;
  status: MarketplaceStatus;
  setupLink: string;
  docsLink: string;
  type: MarketplaceType;
}

export function MarketplaceCard({ 
  title, 
  description, 
  status, 
  setupLink, 
  docsLink,
  type
}: MarketplaceCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <MarketplaceLogo type={type} />
          <StatusBadge status={status} />
        </div>
        <CardTitle className="mt-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="rounded bg-muted px-3 py-2 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Status:</span>
            <span>{getStatusText(status)}</span>
          </div>
          {status === 'connected' && (
            <div className="flex items-center justify-between mt-1 text-muted-foreground">
              <span>Última atualização:</span>
              <span>Hoje</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <a href={docsLink} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Documentação
          </a>
        </Button>
        <Button asChild>
          <Link to={setupLink}>
            <Settings className="mr-2 h-4 w-4" />
            Configurar
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function StatusBadge({ status }: { status: MarketplaceStatus }) {
  switch (status) {
    case 'connected':
      return <Badge variant="success">Conectado</Badge>;
    case 'disconnected':
      return <Badge variant="outline">Desconectado</Badge>;
    case 'pending':
      return <Badge variant="warning">Pendente</Badge>;
    default:
      return null;
  }
}

function getStatusText(status: MarketplaceStatus) {
  switch (status) {
    case 'connected':
      return 'Conectado e funcionando';
    case 'disconnected':
      return 'Não configurado';
    case 'pending':
      return 'Aguardando aprovação';
    default:
      return '';
  }
}
