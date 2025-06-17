
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AutoImportDashboard } from '@/components/admin/products/AutoImportDashboard';
import { AffiliateAnalytics } from '@/components/analytics/AffiliateAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboardEnhanced() {
  const handleSystemCheck = async () => {
    // Implementar verificação de sistema
    console.log('Verificando sistema...');
  };

  const systemStatus = {
    flask_backend: { status: 'warning', message: 'Backend Flask não conectado' },
    affiliate_links: { status: 'success', message: 'Links de afiliado otimizados' },
    database: { status: 'success', message: 'Banco de dados operacional' },
    scraping: { status: 'warning', message: 'Sistema de scraping parcialmente ativo' }
  };

  return (
    <AdminLayout title="Dashboard Avançado">
      <div className="space-y-6">
        {/* Status do Sistema */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Status do Sistema
            </CardTitle>
            <Button onClick={handleSystemCheck} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Verificar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(systemStatus).map(([key, status]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Badge variant={status.status === 'success' ? 'default' : 'destructive'}>
                    {status.status === 'success' ? 'OK' : 'ATENÇÃO'}
                  </Badge>
                  <span className="text-sm">{status.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertas Importantes */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Ações Recomendadas:</strong> Configure o backend Flask para ativar o scraping automático e 
            verificar a otimização dos links de afiliado para maximizar suas comissões.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics">Analytics de Afiliados</TabsTrigger>
            <TabsTrigger value="auto-import">Importação Automática</TabsTrigger>
            <TabsTrigger value="optimization">Otimizações</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-4">
            <AffiliateAnalytics />
          </TabsContent>

          <TabsContent value="auto-import" className="space-y-4">
            <AutoImportDashboard />
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO e Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Meta tags otimizadas</span>
                    <Badge variant="default">Implementado</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Schema markup</span>
                    <Badge variant="default">Implementado</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sitemap XML</span>
                    <Badge variant="destructive">Pendente</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Compressão de imagens</span>
                    <Badge variant="destructive">Pendente</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Links de Afiliado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Códigos Amazon configurados</span>
                    <Badge variant="default">7hy01-20</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Códigos Shopee configurados</span>
                    <Badge variant="default">18357850294</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tracking de cliques</span>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Otimização automática</span>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Próximas Implementações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" checked readOnly />
                    <span>Sistema de scraping automático</span>
                    <Badge variant="default">Em desenvolvimento</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" readOnly />
                    <span>Alertas de preço em tempo real</span>
                    <Badge variant="secondary">Planejado</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" readOnly />
                    <span>Sistema de recomendações AI</span>
                    <Badge variant="secondary">Planejado</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" readOnly />
                    <span>Integração com WhatsApp Business</span>
                    <Badge variant="secondary">Planejado</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
