
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { MarketplaceType } from '@/components/marketplace/MarketplaceLogo';

export interface RedirectModalProps {
  productTitle: string;
  affiliateUrl: string;
  onClose: () => void;
  marketplace: MarketplaceType;
}

export function RedirectModal({ productTitle, affiliateUrl, onClose, marketplace }: RedirectModalProps) {
  const platformName = marketplace === 'amazon' 
    ? 'Amazon' 
    : marketplace === 'shopee' 
      ? 'Shopee' 
      : 'Mercado Livre';
  
  const handleConfirm = () => {
    window.open(affiliateUrl, '_blank');
    onClose();
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            Redirecionando para {platformName}
          </DialogTitle>
          <DialogDescription>
            Você será redirecionado para o site da {platformName} para completar sua compra do produto:
            <div className="font-bold mt-2">{productTitle}</div>
          </DialogDescription>
        </DialogHeader>
        <div className="bg-blue-50 p-4 rounded-md text-sm mt-2">
          <div className="text-blue-700">
            Ao comprar através deste link, você nos apoia sem pagar nada a mais por isso. Obrigado pelo seu apoio!
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:gap-0">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm} className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Ir para {platformName}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
