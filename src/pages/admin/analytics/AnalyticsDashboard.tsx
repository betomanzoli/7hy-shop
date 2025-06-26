
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Search, Eye, MousePointer, Users, TrendingUp } from 'lucide-react';

interface AnalyticsData {
  topSearchTerms: Array<{ term: string; count: number }>;
  topProducts: Array<{ title: string; views: number; clicks: number }>;
  pageViews: Array<{ page: string; views: number }>;
  toolUsage: Array<{ tool: string; usage: number }>;
  dailyActivity: Array<{ date: string; events: number }>;
  totalEvents: number;
  uniqueUsers: number;
  topMarketplaces: Array<{ marketplace: string; interactions: number }>;
}

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7'); // days

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));
      
      // Fetch analytics data from user_analytics table
      const { data: rawData, error } = await supabase
        .from('user_analytics')
        .select(`
          *,
          products (title, marketplace)
        `)
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      // Process the data
      const processedData = processAnalyticsData(rawData || []);
      setAnalytics(processedData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (data: any[]): AnalyticsData => {
    const searchTerms: Record<string, number> = {};
    const products: Record<string, { title: string; views: number; clicks: number }> = {};
    const pages: Record<string, number> = {};
    const tools: Record<string, number> = {};
    const dailyActivity: Record<string, number> = {};
    const marketplaces: Record<string, number> = {};
    const uniqueUsers = new Set();

    data.forEach(event => {
      if (event.user_id) uniqueUsers.add(event.user_id);

      const date = new Date(event.created_at).toISOString().split('T')[0];
      dailyActivity[date] = (dailyActivity[date] || 0) + 1;

      switch (event.event_type) {
        case 'search':
          const searchTerm = event.event_data?.search_term;
          if (searchTerm) {
            searchTerms[searchTerm] = (searchTerms[searchTerm] || 0) + 1;
          }
          break;

        case 'product_view':
        case 'product_click':
          if (event.product_id && event.products) {
            const productTitle = event.products.title;
            if (!products[event.product_id]) {
              products[event.product_id] = { title: productTitle, views: 0, clicks: 0 };
            }
            if (event.event_type === 'product_view') {
              products[event.product_id].views++;
            } else {
              products[event.product_id].clicks++;
            }

            // Track marketplace interactions
            const marketplace = event.products.marketplace;
            if (marketplace) {
              marketplaces[marketplace] = (marketplaces[marketplace] || 0) + 1;
            }
          }
          break;

        case 'page_view':
          const page = event.event_data?.page;
          if (page) {
            pages[page] = (pages[page] || 0) + 1;
          }
          break;

        case 'tool_usage':
          const toolName = event.event_data?.tool_name;
          if (toolName) {
            tools[toolName] = (tools[toolName] || 0) + 1;
          }
          break;
      }
    });

    return {
      topSearchTerms: Object.entries(searchTerms)
        .map(([term, count]) => ({ term, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      
      topProducts: Object.values(products)
        .sort((a, b) => (b.views + b.clicks) - (a.views + a.clicks))
        .slice(0, 10),
      
      pageViews: Object.entries(pages)
        .map(([page, views]) => ({ page, views }))
        .sort((a, b) => b.views - a.views),
      
      toolUsage: Object.entries(tools)
        .map(([tool, usage]) => ({ tool, usage }))
        .sort((a, b) => b.usage - a.usage),
      
      dailyActivity: Object.entries(dailyActivity)
        .map(([date, events]) => ({ date, events }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      
      totalEvents: data.length,
      uniqueUsers: uniqueUsers.size,
      
      topMarketplaces: Object.entries(marketplaces)
        .map(([marketplace, interactions]) => ({ marketplace, interactions }))
        .sort((a, b) => b.interactions - a.interactions),
    };
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <select 
          value={dateRange} 
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="7">Últimos 7 dias</option>
          <option value="30">Últimos 30 dias</option>
          <option value="90">Últimos 90 dias</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalEvents.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Únicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.uniqueUsers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buscas Realizadas</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.topSearchTerms.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Mais Vistos</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.topProducts.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="searches" className="space-y-4">
        <TabsList>
          <TabsTrigger value="searches">Buscas</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="pages">Páginas</TabsTrigger>
          <TabsTrigger value="tools">Ferramentas</TabsTrigger>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
        </TabsList>

        <TabsContent value="searches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Termos Mais Buscados</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics?.topSearchTerms}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="term" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Produtos com Maior Engajamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.topProducts.map((product, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">{product.title}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{product.views} visualizações</Badge>
                      <Badge variant="outline">{product.clicks} cliques</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Páginas Mais Visitadas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    dataKey="views"
                    data={analytics?.pageViews}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ page, views }) => `${page}: ${views}`}
                  >
                    {analytics?.pageViews.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ferramentas Mais Utilizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics?.toolUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tool" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="usage" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atividade Diária</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics?.dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="events" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
