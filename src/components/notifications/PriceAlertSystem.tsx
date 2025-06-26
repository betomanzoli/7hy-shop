
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bell, Trash2, TrendingDown, Mail, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

interface PriceAlert {
  id: string;
  productName: string;
  currentPrice: number;
  targetPrice: number;
  imageUrl: string;
  marketplace: string;
  isActive: boolean;
  notificationChannels: ('email' | 'push' | 'sms')[];
  createdAt: string;
}

export const PriceAlertSystem = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: '1',
      productName: 'iPhone 15 Pro 128GB',
      currentPrice: 7999.99,
      targetPrice: 7500.00,
      imageUrl: 'https://via.placeholder.com/80',
      marketplace: 'Amazon',
      isActive: true,
      notificationChannels: ['email', 'push'],
      createdAt: '2024-06-01'
    },
    {
      id: '2',
      productName: 'MacBook Air M2',
      currentPrice: 9999.99,
      targetPrice: 9000.00,
      imageUrl: 'https://via.placeholder.com/80',
      marketplace: 'Shopee',
      isActive: true,
      notificationChannels: ['email'],
      createdAt: '2024-06-15'
    }
  ]);

  const [newAlert, setNewAlert] = useState({
    productUrl: '',
    targetPrice: '',
    channels: {
      email: true,
      push: false,
      sms: false
    }
  });

  const createAlert = () => {
    if (!newAlert.productUrl || !newAlert.targetPrice) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const selectedChannels = Object.entries(newAlert.channels)
      .filter(([_, enabled]) => enabled)
      .map(([channel, _]) => channel as 'email' | 'push' | 'sms');

    if (selectedChannels.length === 0) {
      toast.error('Selecione pelo menos um canal de notificação');
      return;
    }

    // Simular criação do alerta
    const mockAlert: PriceAlert = {
      id: Date.now().toString(),
      productName: 'Produto Extraído da URL',
      currentPrice: 299.99,
      targetPrice: parseFloat(newAlert.targetPrice),
      imageUrl: 'https://via.placeholder.com/80',
      marketplace: 'Amazon',
      isActive: true,
      notificationChannels: selectedChannels,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAlerts([...alerts, mockAlert]);
    setNewAlert({
      productUrl: '',
      targetPrice: '',
      channels: { email: true, push: false, sms: false }
    });

    toast.success('Alerta de preço criado com sucesso!');
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id 
        ? { ...alert, isActive: !alert.isActive }
        : alert
    ));
    toast.success('Status do alerta atualizado');
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast.success('Alerta removido');
  };

  const getStatusColor = (alert: PriceAlert) => {
    if (!alert.isActive) return 'bg-gray-100 text-gray-600';
    if (alert.currentPrice <= alert.targetPrice) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusText = (alert: PriceAlert) => {
    if (!alert.isActive) return 'Pausado';
    if (alert.currentPrice <= alert.targetPrice) return 'Meta Atingida!';
    return 'Monitorando';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Create New Alert */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Criar Alerta de Preço
          </CardTitle>
          <CardDescription>
            Seja notificado quando o preço do produto baixar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">
                URL do Produto
              </label>
              <Input
                id="url"
                placeholder="https://www.amazon.com.br/produto..."
                value={newAlert.productUrl}
                onChange={(e) => setNewAlert({...newAlert, productUrl: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="target" className="text-sm font-medium">
                Preço Alvo (R$)
              </label>
              <Input
                id="target"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={newAlert.targetPrice}
                onChange={(e) => setNewAlert({...newAlert, targetPrice: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Canais de Notificação</label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newAlert.channels.email}
                  onCheckedChange={(checked) => 
                    setNewAlert({
                      ...newAlert, 
                      channels: {...newAlert.channels, email: checked}
                    })
                  }
                />
                <Mail className="w-4 h-4" />
                <span className="text-sm">Email</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newAlert.channels.push}
                  onCheckedChange={(checked) => 
                    setNewAlert({
                      ...newAlert, 
                      channels: {...newAlert.channels, push: checked}
                    })
                  }
                />
                <Bell className="w-4 h-4" />
                <span className="text-sm">Push</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newAlert.channels.sms}
                  onCheckedChange={(checked) => 
                    setNewAlert({
                      ...newAlert, 
                      channels: {...newAlert.channels, sms: checked}
                    })
                  }
                />
                <Smartphone className="w-4 h-4" />
                <span className="text-sm">SMS</span>
              </div>
            </div>
          </div>

          <Button onClick={createAlert} className="w-full">
            <Bell className="w-4 h-4 mr-2" />
            Criar Alerta
          </Button>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Meus Alertas ({alerts.length})</CardTitle>
          <CardDescription>
            Gerencie seus alertas de preço ativos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum alerta criado ainda</p>
              <p className="text-sm">Crie seu primeiro alerta acima</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card key={alert.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={alert.imageUrl}
                        alt={alert.productName}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold line-clamp-1">{alert.productName}</h3>
                            <Badge variant="outline" className="text-xs">
                              {alert.marketplace}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={alert.isActive}
                              onCheckedChange={() => toggleAlert(alert.id)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAlert(alert.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Preço Atual</p>
                            <p className="font-semibold">R$ {alert.currentPrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Preço Alvo</p>
                            <p className="font-semibold text-green-600">R$ {alert.targetPrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Economia</p>
                            <p className="font-semibold">
                              R$ {(alert.currentPrice - alert.targetPrice).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Status</p>
                            <Badge className={getStatusColor(alert)}>
                              {getStatusText(alert)}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>Criado em {new Date(alert.createdAt).toLocaleDateString('pt-BR')}</span>
                            <span>•</span>
                            <span>Canais: {alert.notificationChannels.join(', ')}</span>
                          </div>
                          {alert.currentPrice <= alert.targetPrice && alert.isActive && (
                            <div className="flex items-center text-green-600 text-sm">
                              <TrendingDown className="w-4 h-4 mr-1" />
                              <span>Meta atingida!</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
