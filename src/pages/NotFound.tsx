
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "Erro 404: Usuário tentou acessar uma rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  // Links úteis para ajudar o usuário a encontrar o que procura
  const helpfulLinks = [
    { title: "Página Inicial", path: "/" },
    { title: "Produtos", path: "/products" },
    { title: "Sobre Nós", path: "/about" },
    { title: "Contato", path: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-6 text-center">
      <div className="max-w-md w-full">
        <h1 className="text-9xl font-bold text-brand-600">404</h1>
        <h2 className="text-3xl font-semibold mt-6 mb-2">Página Não Encontrada</h2>
        
        <p className="text-lg text-muted-foreground mb-8">
          A página <span className="font-medium">{location.pathname}</span> não foi encontrada. 
          Ela pode ter sido removida, teve seu nome alterado ou está temporariamente indisponível.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/">
            <Button size="lg" className="gap-2 w-full">
              <Home className="h-5 w-5" />
              Voltar para o Início
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="gap-2 w-full" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </Button>
        </div>
        
        <div className="border-t pt-8">
          <h3 className="text-lg font-medium mb-4">Links que podem ajudar:</h3>
          <div className="grid grid-cols-2 gap-3">
            {helpfulLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </div>
          
          <div className="mt-8">
            <p className="text-sm text-muted-foreground mb-2">
              Não consegue encontrar o que procura?
            </p>
            <Link to="/contact">
              <Button variant="link" className="gap-1">
                Entre em contato conosco
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
