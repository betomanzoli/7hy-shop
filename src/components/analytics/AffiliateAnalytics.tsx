
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingCart,
  ExternalLink,
  Eye
} from 'lucide-react';

interface AnalyticsData {
  totalClicks: number;
  totalCommissions: number;
  conversionRate: number;
  topProducts: Array<{
    id: string;
    title: string;
    clicks: number;
    conversions: number;
    commissions: number;
    marketplace: string;
  }>;
  clicksByMarketplace: Array<{
    marketplace: string;
    clicks: number;
    conversions: number;
  }>;
  dailyStats: Array<{
    date: string;
    clicks: number;
    conversions: number;
    commissions: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function AffiliateAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    
    try {
      // Buscar dados de cliques
      const { data: clicks, error: clicksError } = await supabase
        .from('affiliate_clicks')
        .select('*')
        .gte('created_at', getDateRange(timeRange));

      if (clicksError) throw clicksError;

      // Buscar dados de produtos
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, title, marketplace, click_count, view_count')
        .eq('status', 'active');

      if (productsError) throw productsError;

      // Processar dados
      const processedData = processAnalyticsData(clicks || [], products || []);
      setAnalytics(processedData);

    } catch (error) {
      console.error('Erro ao buscar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = (range: string) => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  };

  const processAnalyticsData = (clicks: any[], products: any[]): AnalyticsData => {
    // Simular dados de comissões (em produção, viria de uma API real)
    const estimatedCommissionRate = 0.05; // 5% de comissão média
    const estimatedConversionRate = 0.03; // 3% de conversão média

    const totalClicks =  ||  ||clicks.length;
    const estimatedConversions = Math.floor(totalClicks * estimatedConversionRate);
    const estimatedCommissions = estimatedConversions * 50 * estimatedCommissionRate; // R$ 50 ticket médio

    // Agrupar cliques por marketplace
    const clicksByMarketplace = products.reduce((acc: any[], product) => {
      const existing = acc.find(item => item.marketplace === product.marketplace);
      if (existing) {
        existing.clicks += product.click_count || 0;
        existing.conversions += Math.floor((product.click_count || 0) * estimatedConversionRate);
      } else {
        acc.push({
          marketplace: product.marketplace,
          clicks: product.click_count || 0,
          conversions: Math.floor((product.click_count || 0) * estimatedConversionRate)
        });
      }
      return acc;
    }, []);

    // Top produtos
    const topProducts = products
      .sort((a, b) => (b.click_count || 0) - (a.click_count || 0))
      .slice(0, 10)
      .map(product => ({
        id: product.id,
        title: product.title,
        clicks: product.click_count || 0,
        conversions: Math.floor((product.click_count || 0) * estimatedConversionRate),
        commissions: Math.floor((product.click_count || 0) * estimatedConversionRate) * 50 * estimatedCommissionRate,
        marketplace: product.marketplace
      }));

    // Estatísticas diárias (últimos 30 dias)
    const dailyStats = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dayClicks = Math.floor(Math.random() * 50 + 10); // Dados simulados
      
      return {
        date: date.toISOString().split('T')[0],
        clicks: dayClicks,
        conversions: Math.floor(dayClicks * estimatedConversionRate),
        commissions: Math.floor(dayClicks * estimatedConversionRate) * 50 * estimatedCommissionRate
      };
    });

    return {
      totalClicks,
      totalCommissions: estimatedCommissions,
      conversionRate: estimatedConversionRate * 100,
      topProducts,
      clicksByMarketplace,
      dailyStats
    };
  };

  if (loading || !analytics) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissões Estimadas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {analytics.totalCommissions.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              +15.3% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              +2.5% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.topProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              Produtos com cliques
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="products">Top Produtos</TabsTrigger>
          <TabsTrigger value="marketplaces">Marketplaces</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cliques e Conversões Diárias</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="clicks" stroke="#8884d8" name="Cliques" />
                  <Line type="monotone" dataKey="conversions" stroke="#82ca9d" name="Conversões" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comissões Diárias Estimadas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Comissões']} />
                  <Bar dataKey="commissions" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Produtos por Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="font-bold text-lg">#{index + 1}</div>
                      <div>
                        <div className="font-medium">{product.title.substring(0, 50)}...</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{product.marketplace}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {product.clicks} cliques • {product.conversions} conversões
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        R$ {product.commissions.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Comissões estimadas
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplaces" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Cliques por Marketplace</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.clicksByMarketplace}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ marketplace, clicks }) => `${marketplace}: ${clicks}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="clicks"
                    >
                      {analytics.clicksByMarketplace.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance por Marketplace</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.clicksByMarketplace.map((marketplace) => (
                    <div key={marketplace.marketplace} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium capitalize">{marketplace.marketplace}</span>
                        <span>{marketplace.clicks} cliques</span>
                      </div>
                      <Progress 
                        value={(marketplace.clicks / analytics.totalClicks) * 100} 
                        className="h-2"
                      />
                      <div className="text-sm text-muted-foreground">
                        {marketplace.conversions} conversões • Taxa: {((marketplace.conversions / marketplace.clicks) * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
