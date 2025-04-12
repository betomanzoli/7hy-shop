
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Package, ShoppingBag, Store, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <AdminLayout title="Painel">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Marketplaces Ativos
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1/3</div>
            <p className="text-xs text-muted-foreground">
              Amazon conectada
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
              Sincronize produtos dos marketplaces
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Pedidos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Nenhum pedido ainda
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Nenhum cliente ainda
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Tarefas comuns para gerenciar sua loja multi-marketplace
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link 
              to="/admin/marketplaces" 
              className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-muted"
            >
              <div className="font-medium">Configurar Marketplaces</div>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              to="/admin/products" 
              className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-muted"
            >
              <div className="font-medium">Gerenciar Produtos</div>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              to="/admin/orders" 
              className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-muted"
            >
              <div className="font-medium">Visualizar Pedidos</div>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              to="/admin/settings" 
              className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-muted"
            >
              <div className="font-medium">Configurações da Loja</div>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Primeiros Passos</CardTitle>
            <CardDescription>
              Siga estas etapas para configurar sua integração multi-marketplace
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex items-center gap-3 rounded-lg border p-3 text-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div className="font-medium">Conecte seu primeiro marketplace (Amazon)</div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3 text-sm bg-muted/50">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                2
              </div>
              <div className="font-medium text-muted-foreground">Importe produtos da Amazon</div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3 text-sm bg-muted/50">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                3
              </div>
              <div className="font-medium text-muted-foreground">Conecte marketplaces adicionais</div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3 text-sm bg-muted/50">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                4
              </div>
              <div className="font-medium text-muted-foreground">Configure as definições da sua loja</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
