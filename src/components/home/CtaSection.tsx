
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="py-20 bg-brand-600 text-white">
      <div className="container px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para Transformar sua Experiência de Compras?</h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Junte-se a milhares de compradores satisfeitos que simplificaram suas compras online com o 7hy.shop.
        </p>
        <Link to="/products">
          <Button size="lg" variant="secondary" className="gap-2">
            Comece a Comprar Agora
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
