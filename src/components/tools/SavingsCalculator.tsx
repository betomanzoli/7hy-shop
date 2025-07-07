
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export const SavingsCalculator = () => {
  const [originalPrice, setOriginalPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [installments, setInstallments] = useState('1');
  const [result, setResult] = useState<{
    savings: number;
    percentage: number;
    totalWithShipping: number;
    installmentValue: number;
  } | null>(null);

  const calculateSavings = () => {
    const original = parseFloat(originalPrice);
    const current = parseFloat(currentPrice);
    const shipping = parseFloat(shippingCost) || 0;
    const installmentCount = parseInt(installments) || 1;
    
    if (!original || !current || original <= 0 || current <= 0) {
      toast.error('Por favor, insira valores válidos');
      return;
    }

    if (current >= original) {
      toast.error('O preço atual deve ser menor que o preço original');
      return;
    }

    const savings = original - current;
    const percentage = (savings / original) * 100;
    const totalWithShipping = current + shipping;
    const installmentValue = totalWithShipping / installmentCount;
    
    setResult({ 
      savings, 
      percentage, 
      totalWithShipping,
      installmentValue 
    });
    
    toast.success(`Economia de R$ ${savings.toFixed(2)} (${percentage.toFixed(1)}%)`);
  };

  const reset = () => {
    setOriginalPrice('');
    setCurrentPrice('');
    setShippingCost('');
    setInstallments('1');
    setResult(null);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="w-5 h-5 mr-2" />
          Calculadora de Economia
        </CardTitle>
        <CardDescription>
          Descubra quanto você pode economizar em suas compras
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="original" className="text-sm font-medium">
            Preço Original (R$)
          </label>
          <Input
            id="original"
            type="number"
            step="0.01"
            placeholder="0,00"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="current" className="text-sm font-medium">
            Preço Atual (R$)
          </label>
          <Input
            id="current"
            type="number"
            step="0.01"
            placeholder="0,00"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="shipping" className="text-sm font-medium">
            Frete (R$) - Opcional
          </label>
          <Input
            id="shipping"
            type="number"
            step="0.01"
            placeholder="0,00"
            value={shippingCost}
            onChange={(e) => setShippingCost(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="installments" className="text-sm font-medium">
            Parcelas
          </label>
          <Input
            id="installments"
            type="number"
            min="1"
            max="24"
            value={installments}
            onChange={(e) => setInstallments(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={calculateSavings} className="flex-1">
            <DollarSign className="w-4 h-4 mr-2" />
            Calcular
          </Button>
          <Button onClick={reset} variant="outline">
            Limpar
          </Button>
        </div>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">Você economizará:</span>
                </div>
                <div className="text-2xl font-bold text-green-700">
                  R$ {result.savings.toFixed(2)}
                </div>
                <Badge className="bg-green-600">
                  {result.percentage.toFixed(1)}% de desconto
                </Badge>
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="font-medium text-blue-800">Total com Frete</div>
                <div className="text-blue-600">R$ {result.totalWithShipping.toFixed(2)}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <div className="font-medium text-purple-800">Por Parcela</div>
                <div className="text-purple-600">R$ {result.installmentValue.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700 text-center">
            💡 Dica: Use nossa calculadora antes de comprar para saber se é uma boa oferta!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
