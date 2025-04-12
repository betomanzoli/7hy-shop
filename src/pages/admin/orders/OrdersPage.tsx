
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

// Dados de exemplo
const orders = [
  { id: "ORD-1234", customer: "João Silva", date: "2025-04-10", status: "pending", total: "R$ 189,90" },
  { id: "ORD-1235", customer: "Maria Oliveira", date: "2025-04-09", status: "processing", total: "R$ 299,50" },
  { id: "ORD-1236", customer: "Carlos Souza", date: "2025-04-08", status: "completed", total: "R$ 129,00" },
  { id: "ORD-1237", customer: "Ana Pereira", date: "2025-04-07", status: "completed", total: "R$ 459,80" },
  { id: "ORD-1238", customer: "Paulo Santos", date: "2025-04-06", status: "cancelled", total: "R$ 89,90" },
];

const OrdersPage = () => {
  return (
    <AdminLayout title="Pedidos">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex items-center gap-2 max-w-sm">
            <Input placeholder="Buscar pedidos..." />
            <Button size="icon" variant="outline">
              <Search className="h-4 w-4" />
              <span className="sr-only">Buscar</span>
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
            <Button size="sm">Exportar</Button>
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="processing">Em Processamento</TabsTrigger>
            <TabsTrigger value="completed">Concluídos</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID do Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "completed" ? "success" :
                          order.status === "processing" ? "warning" :
                          order.status === "pending" ? "default" : "destructive"
                        }
                      >
                        {order.status === "completed" ? "Concluído" :
                         order.status === "processing" ? "Em Processamento" :
                         order.status === "pending" ? "Pendente" : "Cancelado"}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Detalhes</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="pending" className="mt-4">
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-muted-foreground">Filtragem por status será implementada em breve</p>
            </div>
          </TabsContent>
          
          <TabsContent value="processing" className="mt-4">
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-muted-foreground">Filtragem por status será implementada em breve</p>
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4">
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-muted-foreground">Filtragem por status será implementada em breve</p>
            </div>
          </TabsContent>
          
          <TabsContent value="cancelled" className="mt-4">
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-muted-foreground">Filtragem por status será implementada em breve</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
