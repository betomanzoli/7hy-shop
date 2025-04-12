
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ExternalLink, LineChart, Package, ShoppingBag, Store, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <AdminLayout title="Painel">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Programas de Afiliados Ativos
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0/3</div>
            <p className="text-xs text-muted-foreground">
              Nenhum programa conectado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Produtos
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Pesquise produtos nas plataformas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Cliques
            </CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Nenhum clique registrado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Comissões Totais
            </CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 0,00</div>
            <p className="text-xs text-muted-foreground">
              Nenhuma comissão ainda
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Tarefas comuns para gerenciar sua plataforma de afiliados
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link 
              to="/admin/marketplaces" 
              className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-muted"
            >
              <div className="font-medium">Configurar Programas de Afiliados</div>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              to="/admin/products" 
              className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-muted"
            >
              <div className="font-medium">Pesquisar Produtos</div>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              to="/admin/analytics" 
              className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-muted"
            >
              <div className="font-medium">Visualizar Estatísticas</div>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              to="/admin/settings" 
              className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-muted"
            >
              <div className="font-medium">Configurações do Site</div>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Primeiros Passos</CardTitle>
            <CardDescription>
              Siga estas etapas para configurar sua plataforma de afiliados multi-marketplace
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex items-center gap-3 rounded-lg border p-3 text-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div className="font-medium">Conecte seu primeiro programa de afiliados (Amazon)</div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3 text-sm bg-muted/50">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                2
              </div>
              <div className="font-medium text-muted-foreground">Pesquise e exiba produtos da Amazon</div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3 text-sm bg-muted/50">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                3
              </div>
              <div className="font-medium text-muted-foreground">Conecte programas de afiliados adicionais</div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3 text-sm bg-muted/50">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                4
              </div>
              <div className="font-medium text-muted-foreground">Configure as definições do seu site</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
