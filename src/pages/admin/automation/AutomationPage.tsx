
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AutomationDashboard } from '@/components/admin/automation/AutomationDashboard';

export default function AutomationPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Automação</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie e monitore os jobs de automação da plataforma
          </p>
        </div>
        
        <AutomationDashboard />
      </div>
    </AdminLayout>
  );
}
