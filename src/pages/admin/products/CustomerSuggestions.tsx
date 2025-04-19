
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash, Check } from 'lucide-react';
import { CustomerSuggestion } from '@/types/product';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock storage for customer suggestions
const STORAGE_KEY = 'customer_suggestions';

const loadSuggestions = (): CustomerSuggestion[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

const saveSuggestions = (suggestions: CustomerSuggestion[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(suggestions));
};

const CustomerSuggestions = () => {
  const [suggestions, setSuggestions] = useState<CustomerSuggestion[]>(loadSuggestions);
  
  useEffect(() => {
    saveSuggestions(suggestions);
  }, [suggestions]);

  const handleDelete = (id: string) => {
    setSuggestions(suggestions.filter(s => s.id !== id));
  };

  const handleMarkAsProcessed = (id: string) => {
    setSuggestions(suggestions.map(s => 
      s.id === id ? { ...s, processed: true } : s
    ));
  };

  return (
    <AdminLayout title="Sugestões dos Clientes">
      <Card>
        <CardHeader>
          <CardTitle>Sugestões e Pedidos dos Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {suggestions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Nenhuma sugestão recebida dos clientes.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo de Produto</TableHead>
                    <TableHead>Mensagem</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suggestions.map((suggestion) => (
                    <TableRow key={suggestion.id} className={suggestion.processed ? "bg-muted/40" : ""}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{suggestion.name}</div>
                          <div className="text-sm text-muted-foreground">{suggestion.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{suggestion.productType}</TableCell>
                      <TableCell>{suggestion.message}</TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(suggestion.createdAt), { 
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkAsProcessed(suggestion.id)}
                          disabled={suggestion.processed}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(suggestion.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default CustomerSuggestions;
