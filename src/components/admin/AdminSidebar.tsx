
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Settings, 
  LogOut,
  Store,
  Plus,
  List,
  MessageSquare,
  Bot
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';

const sidebarLinks = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Produtos',
    href: '/admin/products',
    icon: ShoppingBag,
    subItems: [
      {
        title: 'Buscar Produtos',
        href: '/admin/products',
        icon: List,
      },
      {
        title: 'Gerenciar Produtos',
        href: '/admin/products/manage',
        icon: Plus,
      },
      {
        title: 'Sugestões de Clientes',
        href: '/admin/products/suggestions',
        icon: MessageSquare,
      }
    ]
  },
  {
    title: 'Pedidos',
    href: '/admin/orders',
    icon: Package,
  },
  {
    title: 'Marketplaces',
    href: '/admin/marketplaces',
    icon: Store,
  },
  {
    title: 'Automação',
    href: '/admin/automation',
    icon: Bot,
  },
  {
    title: 'Configurações',
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
            
            const isOpen = link.subItems && location.pathname.startsWith(link.href);
            
            return (
              <React.Fragment key={link.href}>
                <Link
                  to={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                    isActive && "bg-muted text-foreground"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.title}
                </Link>
                
                {link.subItems && isOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {link.subItems.map((subItem) => {
                      const isSubActive = location.pathname === subItem.href;
                      
                      return (
                        <Link
                          key={subItem.href}
                          to={subItem.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground text-xs",
                            isSubActive && "bg-muted text-foreground"
                          )}
                        >
                          <subItem.icon className="h-3 w-3" />
                          {subItem.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </React.Fragment>
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
          Sair do Admin
        </Link>
      </div>
    </aside>
  );
}
