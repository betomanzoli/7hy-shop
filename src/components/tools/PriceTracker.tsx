
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Bell, TrendingDown, TrendingUp, Target } from 'lucide-react';
import { toast } from 'sonner';

interface PricePoint {
  date: string;
  price: number;
  marketplace: string;
}

export const PriceTracker = () => {
  const [productUrl, setProductUrl] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [tracking, setTracking] = useState(false);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);

  // Dados simulados para demonstração
  const mockPriceHistory: PricePoint[] = [
    { date: '2024-01', price: 299.99, marketplace: 'Amazon' },
    { date: '2024-02', price: 279.99, marketplace: 'Amazon' },
    { date: '2024-03', price: 259.99, marketplace: 'Amazon' },
    { date: '2024-04', price: 289.99, marketplace: 'Amazon' },
    { date: '2024-05', price: 239.99, marketplace: 'Amazon' },
    { date: '2024-06', price: 219.99, marketplace: 'Amazon' },
  ];

  useEffect(() => {
    // Simular carregamento de dados históricos
    if (tracking) {
      setPriceHistory(mockPriceHistory);
    }
  }, [tracking]);

  const startTracking = () => {
    if (!productUrl) {
      toast.error('Por favor, insira a URL do produto');
      return;
    }

    setTracking(true);
    toast.success('Rastreamento iniciado! Você será notificado sobre mudanças de preço.');
  };

  const createPriceAlert = () => {
    if (!targetPrice) {
      toast.error('Por favor, defina um preço alvo');
      return;
    }

    const target = parseFloat(targetPrice);
    const currentPrice = priceHistory[priceHistory.length - 1]?.price;

    if (currentPrice && target >= currentPrice) {
      toast.error('O preço alvo deve ser menor que o preço atual');
      return;
    }

    toast.success(`Alerta criado! Você será notificado quando o preço chegar a R$ ${target.toFixed(2)}`);
  };

  const getCurrentPrice = () => {
    return priceHistory[priceHistory.length - 1]?.price || 0;
  };

  const getLowestPrice = () => {
    if (priceHistory.length === 0) return 0;
    return Math.min(...priceHistory.map(p => p.price));
  };

  const getHighestPrice = () => {
    if (priceHistory.length === 0) return 0;
    return Math.max(...priceHistory.map(p => p.price));
  };

  const getPriceTrend = () => {
    if (priceHistory.length < 2) return 'stable';
    const current = priceHistory[priceHistory.length - 1].price;
    const previous = priceHistory[priceHistory.length - 2].price;
    return current > previous ? 'up' : current < previous ? 'down' : 'stable';
  };

  const currentPrice = getCurrentPrice();
  const lowestPrice = getLowestPrice();
  const highestPrice = getHighestPrice();
  const priceTrend = getPriceTrend();

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Rastreador de Preços
          </CardTitle>
          <CardDescription>
            Monitore preços e receba alertas quando eles baixarem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              URL do Produto
            </label>
            <Input
              id="url"
              placeholder="https://www.amazon.com.br/produto..."
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="target" className="text-sm font-medium">
                Preço Alvo (R$)
              </label>
              <Input
                id="target"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ações</label>
              <div className="flex gap-2">
                <Button onClick={startTracking} disabled={tracking} className="flex-1">
                  {tracking ? 'Rastreando' : 'Iniciar Rastreamento'}
                </Button>
                <Button onClick={createPriceAlert} variant="outline" disabled={!tracking}>
                  <Bell className="w-4 h-4 mr-2" />
                  Criar Alerta
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {tracking && priceHistory.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">💰</div>
                  <div>
                    <p className="text-sm text-gray-600">Preço Atual</p>
                    <p className="text-xl font-bold">R$ {currentPrice.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Menor Preço</p>
                    <p className="text-xl font-bold text-green-600">R$ {lowestPrice.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Maior Preço</p>
                    <p className="text-xl font-bold text-red-600">R$ {highestPrice.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">
                    {priceTrend === 'up' ? '📈' : priceTrend === 'down' ? '📉' : '➡️'}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tendência</p>
                    <Badge 
                      className={
                        priceTrend === 'up' ? 'bg-red-100 text-red-800' :
                        priceTrend === 'down' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    >
                      {priceTrend === 'up' ? 'Subindo' : priceTrend === 'down' ? 'Descendo' : 'Estável'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Preços</CardTitle>
              <CardDescription>
                Acompanhe a evolução dos preços ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Preço']}
                      labelFormatter={(label) => `Período: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="text-blue-600">💡</div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Dica de Compra</p>
                    <p className="text-xs text-blue-700">
                      {currentPrice === lowestPrice 
                        ? 'Este é o menor preço registrado! Ótimo momento para comprar.'
                        : `O produto já esteve R$ ${(currentPrice - lowestPrice).toFixed(2)} mais barato. Considere aguardar.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
