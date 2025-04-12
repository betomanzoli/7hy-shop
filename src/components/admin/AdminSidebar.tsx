
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Settings, 
  LogOut,
  Store
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';

const sidebarLinks = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: ShoppingBag,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: Package,
  },
  {
    title: 'Marketplaces',
    href: '/admin/marketplaces',
    icon: Store,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const location = useLocation();
  
  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-muted/40 fixed top-0 left-0">
      <div className="flex h-14 items-center border-b px-4">
        <Logo variant="admin" />
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.href || 
                            (link.href !== '/admin' && location.pathname.startsWith(link.href));
            
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                  isActive && "bg-muted text-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.title}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Exit Admin
        </Link>
      </div>
    </aside>
  );
}
