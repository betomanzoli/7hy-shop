
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Package, ShoppingBag, Store, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Marketplaces
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1/3</div>
            <p className="text-xs text-muted-foreground">
              Amazon connected
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Sync products from marketplaces
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orders
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No orders yet
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No customers yet
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to manage your multi-marketplace store
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link 
              to="/admin/marketplaces" 
              className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-muted"
            >
              <div className="font-medium">Configure Marketplaces</div>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              to="/admin/products" 
              className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-muted"
            >
              <div className="font-medium">Manage Products</div>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              to="/admin/orders" 
              className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-muted"
            >
              <div className="font-medium">View Orders</div>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              to="/admin/settings" 
              className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-muted"
            >
              <div className="font-medium">Store Settings</div>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Follow these steps to set up your multi-marketplace integration
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex items-center gap-3 rounded-lg border p-3 text-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div className="font-medium">Connect your first marketplace (Amazon)</div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3 text-sm bg-muted/50">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                2
              </div>
              <div className="font-medium text-muted-foreground">Import products from Amazon</div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3 text-sm bg-muted/50">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                3
              </div>
              <div className="font-medium text-muted-foreground">Connect additional marketplaces</div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3 text-sm bg-muted/50">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                4
              </div>
              <div className="font-medium text-muted-foreground">Configure your store settings</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
