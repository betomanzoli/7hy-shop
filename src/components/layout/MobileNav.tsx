
import React from 'react';
import { Link } from 'react-router-dom';

export function MobileNav() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="px-6 mb-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-2xl text-brand-700">7hy<span className="text-brand-500">.shop</span></span>
        </Link>
      </div>
      
      <nav className="flex flex-col gap-2 px-6">
        <Link to="/" className="text-sm font-medium p-2 hover:bg-muted rounded-lg transition-colors">
          Início
        </Link>
        <Link to="/products" className="text-sm font-medium p-2 hover:bg-muted rounded-lg transition-colors">
          Produtos
        </Link>
        <Link to="/amazon" className="text-sm font-medium p-2 hover:bg-muted rounded-lg transition-colors">
          Amazon
        </Link>
        <Link to="/shopee" className="text-sm font-medium p-2 hover:bg-muted rounded-lg transition-colors">
          Shopee
        </Link>
        <Link to="/mercadolivre" className="text-sm font-medium p-2 hover:bg-muted rounded-lg transition-colors">
          Mercado Livre
        </Link>
        <Link to="/about" className="text-sm font-medium p-2 hover:bg-muted rounded-lg transition-colors">
          Sobre
        </Link>
        <Link to="/contact" className="text-sm font-medium p-2 hover:bg-muted rounded-lg transition-colors">
          Contato
        </Link>
        <Link to="/admin-login" className="text-sm font-medium p-2 hover:bg-muted rounded-lg transition-colors">
          Área do Administrador
        </Link>
      </nav>
    </div>
  );
}
