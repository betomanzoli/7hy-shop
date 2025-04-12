
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
          Home
        </Link>
        <Link to="/products" className="text-sm font-medium p-2 hover:bg-muted rounded-lg transition-colors">
          Products
        </Link>
        <Link to="/about" className="text-sm font-medium p-2 hover:bg-muted rounded-lg transition-colors">
          About
        </Link>
        <Link to="/contact" className="text-sm font-medium p-2 hover:bg-muted rounded-lg transition-colors">
          Contact
        </Link>
        <Link to="/admin-login" className="text-sm font-medium p-2 hover:bg-muted rounded-lg transition-colors">
          Admin Area
        </Link>
      </nav>
    </div>
  );
}
