
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, BarChart3, TrendingUp, Users, DollarSign, BarChart2, Calendar, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface AnalyticsData {
  clicks: number;
  sales: number;
  conversion: number;
  revenue: number;
  topProducts: Array<{
    id: string;
    name: string;
    clicks: number;
    sales: number;
    commission: number;
    platform: 'amazon' | 'shopee' | 'mercadolivre';
  }>;
  recentClicks: Array<{
    id: string;
    productName: string;
    platform: 'amazon' | 'shopee' | 'mercadolivre';
    timestamp: string;
    converted: boolean;
  }>;
}

const sampleData: Record<string, AnalyticsData> = {
  amazon: {
    clicks: 156,
    sales: 12,
    conversion: 7.69,
    revenue: 239.88,
    topProducts: [
      { id: '1', name: 'Echo Dot 4ª Geração', clicks: 42, sales: 5, commission: 89.95, platform: 'amazon' },
      { id: '2', name: 'Kindle 11ª Geração', clicks: 38, sales: 3, commission: 68.97, platform: 'amazon' },
      { id: '3', name: 'Fire TV Stick', clicks: 29, sales: 2, commission: 39.98, platform: 'amazon' },
      { id: '4', name: 'Headphone JBL', clicks: 27, sales: 1, commission: 17.99, platform: 'amazon' },
      { id: '5', name: 'Smartwatch Samsung', clicks: 20, sales: 1, commission: 22.99, platform: 'amazon' },
    ],
    recentClicks: [
      { id: 'c1', productName: 'Echo Dot 4ª Geração', platform: 'amazon', timestamp: '2023-04-12T14:32:11', converted: true },
      { id: 'c2', productName: 'Kindle 11ª Geração', platform: 'amazon', timestamp: '2023-04-12T13:45:23', converted: false },
      { id: 'c3', productName: 'Fire TV Stick', platform: 'amazon', timestamp: '2023-04-12T12:12:54', converted: false },
      { id: 'c4', productName: 'Headphone JBL', platform: 'amazon', timestamp: '2023-04-12T11:05:32', converted: false },
      { id: 'c5', productName: 'Smartwatch Samsung', platform: 'amazon', timestamp: '2023-04-12T10:47:18', converted: true },
    ]
  },
  shopee: {
    clicks: 87,
    sales: 6,
    conversion: 6.90,
    revenue: 124.35,
    topProducts: [
      { id: '6', name: 'Caixa de Som Bluetooth', clicks: 22, sales: 2, commission: 43.98, platform: 'shopee' },
      { id: '7', name: 'Carregador USB-C', clicks: 18, sales: 1, commission: 15.49, platform: 'shopee' },
      { id: '8', name: 'Fone de Ouvido TWS', clicks: 15, sales: 1, commission: 27.90, platform: 'shopee' },
      { id: '9', name: 'Capa para Celular', clicks: 17, sales: 1, commission: 12.99, platform: 'shopee' },
      { id: '10', name: 'Suporte de Celular', clicks: 15, sales: 1, commission: 23.99, platform: 'shopee' },
    ],
    recentClicks: [
      { id: 'c6', productName: 'Caixa de Som Bluetooth', platform: 'shopee', timestamp: '2023-04-12T14:15:22', converted: false },
      { id: 'c7', productName: 'Carregador USB-C', platform: 'shopee', timestamp: '2023-04-12T13:22:45', converted: true },
      { id: 'c8', productName: 'Fone de Ouvido TWS', platform: 'shopee', timestamp: '2023-04-12T11:54:12', converted: false },
      { id: 'c9', productName: 'Capa para Celular', platform: 'shopee', timestamp: '2023-04-12T10:32:57', converted: false },
      { id: 'c10', productName: 'Suporte de Celular', platform: 'shopee', timestamp: '2023-04-12T09:18:34', converted: true },
    ]
  },
  mercadolivre: {
    clicks: 123,
    sales: 9,
    conversion: 7.32,
    revenue: 178.47,
    topProducts: [
      { id: '11', name: 'Smartphone Xiaomi', clicks: 35, sales: 2, commission: 59.98, platform: 'mercadolivre' },
      { id: '12', name: 'Mouse Gamer', clicks: 28, sales: 2, commission: 39.98, platform: 'mercadolivre' },
      { id: '13', name: 'Teclado Mecânico', clicks: 22, sales: 2, commission: 45.98, platform: 'mercadolivre' },
      { id: '14', name: 'SSD 256GB', clicks: 20, sales: 1, commission: 17.99, platform: 'mercadolivre' },
      { id: '15', name: 'Cadeira Gamer', clicks: 18, sales: 2, commission: 14.54, platform: 'mercadolivre' },
    ],
    recentClicks: [
      { id: 'c11', productName: 'Smartphone Xiaomi', platform: 'mercadolivre', timestamp: '2023-04-12T15:12:34', converted: true },
      { id: 'c12', productName: 'Mouse Gamer', platform: 'mercadolivre', timestamp: '2023-04-12T14:45:12', converted: false },
      { id: 'c13', productName: 'Teclado Mecânico', platform: 'mercadolivre', timestamp: '2023-04-12T13:32:54', converted: true },
      { id: 'c14', productName: 'SSD 256GB', platform: 'mercadolivre', timestamp: '2023-04-12T12:17:23', converted: false },
      { id: 'c15', productName: 'Cadeira Gamer', platform: 'mercadolivre', timestamp: '2023-04-12T11:05:45', converted: false },
    ]
  },
  all: {
    clicks: 366,
    sales: 27,
    conversion: 7.38,
    revenue: 542.70,
    topProducts: [
      { id: '1', name: 'Echo Dot 4ª Geração', clicks: 42, sales: 5, commission: 89.95, platform: 'amazon' },
      { id: '11', name: 'Smartphone Xiaomi', clicks: 35, sales: 2, commission: 59.98, platform: 'mercadolivre' },
      { id: '2', name: 'Kindle 11ª Geração', clicks: 38, sales: 3, commission: 68.97, platform: 'amazon' },
      { id: '12', name: 'Mouse Gamer', clicks: 28, sales: 2, commission: 39.98, platform: 'mercadolivre' },
      { id: '6', name: 'Caixa de Som Bluetooth', clicks: 22, sales: 2, commission: 43.98, platform: 'shopee' },
    ],
    recentClicks: [
      { id: 'c11', productName: 'Smartphone Xiaomi', platform: 'mercadolivre', timestamp: '2023-04-12T15:12:34', converted: true },
      { id: 'c1', productName: 'Echo Dot 4ª Geração', platform: 'amazon', timestamp: '2023-04-12T14:32:11', converted: true },
      { id: 'c6', productName: 'Caixa de Som Bluetooth', platform: 'shopee', timestamp: '2023-04-12T14:15:22', converted: false },
      { id: 'c12', productName: 'Mouse Gamer', platform: 'mercadolivre', timestamp: '2023-04-12T14:45:12', converted: false },
      { id: 'c2', productName: 'Kindle 11ª Geração', platform: 'amazon', timestamp: '2023-04-12T13:45:23', converted: false },
    ]
  }
};

const AffiliateAnalytics = () => {
  const [currentTab, setCurrentTab] = useState('all');
  const data = sampleData[currentTab as keyof typeof sampleData];
  
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const platformColors = {
    amazon: 'bg-amber-100 text-amber-800',
    shopee: 'bg-orange-100 text-orange-800',
    mercadolivre: 'bg-yellow-100 text-yellow-800'
  };
  
  const platformNames = {
    amazon: 'Amazon',
    shopee: 'Shopee',
    mercadolivre: 'Mercado Livre'
  };

  return (
    <AdminLayout title="Análise de Afiliados">
      <div className="max-w-7xl mx-auto">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Dados de Demonstração</AlertTitle>
          <AlertDescription>
            Os dados apresentados são apenas para fins de demonstração. Os dados reais serão exibidos automaticamente quando suas integrações de afiliados estiverem configuradas e gerando tráfego.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="all" onValueChange={setCurrentTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="amazon">Amazon</TabsTrigger>
            <TabsTrigger value="shopee">Shopee</TabsTrigger>
            <TabsTrigger value="mercadolivre">Mercado Livre</TabsTrigger>
          </TabsList>
          
          <TabsContent value={currentTab} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Cliques
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.clicks}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3" />
                      12%
                    </span>
                    vs. mês anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Vendas Concluídas
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.sales}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3" />
                      8%
                    </span>
                    vs. mês anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Taxa de Conversão
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.conversion.toFixed(2)}%</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-red-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 rotate-90" />
                      2%
                    </span>
                    vs. mês anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Comissões Totais
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(data.revenue)}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3" />
                      15%
                    </span>
                    vs. mês anterior
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Top Produtos</CardTitle>
                    <BarChart2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardDescription>
                    Os produtos com mais cliques e vendas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-right">Cliques</TableHead>
                        <TableHead className="text-right">Vendas</TableHead>
                        <TableHead className="text-right">Comissão</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.topProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              product.platform === 'amazon' 
                                ? 'bg-amber-500' 
                                : product.platform === 'shopee'
                                ? 'bg-orange-500'
                                : 'bg-yellow-500'
                            }`} />
                            {product.name}
                          </TableCell>
                          <TableCell className="text-right">{product.clicks}</TableCell>
                          <TableCell className="text-right">{product.sales}</TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(product.commission)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Cliques Recentes</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardDescription>
                    Atividade recente de cliques em afiliados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Plataforma</TableHead>
                        <TableHead>Horário</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.recentClicks.map((click) => (
                        <TableRow key={click.id}>
                          <TableCell className="font-medium">{click.productName}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${platformColors[click.platform]}`}>
                              {platformNames[click.platform]}
                            </span>
                          </TableCell>
                          <TableCell>{formatDateTime(click.timestamp)}</TableCell>
                          <TableCell className="text-right">
                            {click.converted ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                                Convertido
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                                Clique
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AffiliateAnalytics;
