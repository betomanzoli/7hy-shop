
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MobileNav } from './MobileNav';
import { Logo } from '@/components/ui/logo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <MobileNav />
            </SheetContent>
          </Sheet>
          
          <Logo />
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-brand-500 transition-colors">
            Início
          </Link>
          <Link to="/products" className="text-sm font-medium hover:text-brand-500 transition-colors">
            Produtos
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-brand-500 transition-colors">
            Sobre
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-brand-500 transition-colors">
            Contato
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <Link to="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Carrinho</span>
            </Button>
          </Link>
          <Link to="/admin-login">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Conta</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
