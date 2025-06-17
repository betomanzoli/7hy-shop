
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { RefreshCw, Download, TrendingUp, AlertCircle } from 'lucide-react';

interface ImportResult {
  imported: number;
  updated: number;
  errors: number;
  details: Array<{
    action: 'imported' | 'updated' | 'error';
    product?: string;
    marketplace?: string;
    url?: string;
    error?: string;
  }>;
}

export function AutoImportDashboard() {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [category, setCategory] = useState('all');
  const [limit, setLimit] = useState(10);
  const [lastResult, setLastResult] = useState<ImportResult | null>(null);

  const handleAutoImport = async () => {
    setIsImporting(true);
    setProgress(0);
    
    try {
      const response = await fetch('/functions/v1/auto-import-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          category,
          limit,
          force_update: false
        })
      });

      if (!response.ok) {
        throw new Error('Erro na importação automática');
      }

      const data = await response.json();
      
      if (data.success) {
        setLastResult(data.results);
        toast.success(data.message);
      } else {
        throw new Error(data.error || 'Erro desconhecido');
      }
      
    } catch (error: any) {
      console.error('Erro na importação:', error);
      toast.error(`Erro na importação: ${error.message}`);
    } finally {
      setIsImporting(false);
      setProgress(100);
    }
  };

  const handleScrapeUrl = async (url: string) => {
    try {
      const response = await fetch('/functions/v1/product-scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ url, save_to_db: true })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Produto "${data.title}" importado com sucesso!`);
      } else {
        throw new Error('Erro ao importar produto');
      }
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error(`Erro ao importar: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Produtos Importados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lastResult?.imported || 0}</div>
            <p className="text-xs text-muted-foreground">Última execução</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Produtos Atualizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lastResult?.updated || 0}</div>
            <p className="text-xs text-muted-foreground">Última execução</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Erros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lastResult?.errors || 0}</div>
            <p className="text-xs text-muted-foreground">Última execução</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Importação Automática de Produtos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="electronics">Eletrônicos</SelectItem>
                  <SelectItem value="home">Casa e Jardim</SelectItem>
                  <SelectItem value="fashion">Moda</SelectItem>
                  <SelectItem value="beauty">Beleza</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Limite de produtos</label>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 produtos</SelectItem>
                  <SelectItem value="10">10 produtos</SelectItem>
                  <SelectItem value="20">20 produtos</SelectItem>
                  <SelectItem value="50">50 produtos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isImporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Importando produtos...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          <Button 
            onClick={handleAutoImport} 
            disabled={isImporting}
            className="w-full"
          >
            {isImporting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Iniciar Importação Automática
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {lastResult && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado da Última Importação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lastResult.details.map((detail, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      detail.action === 'imported' ? 'default' :
                      detail.action === 'updated' ? 'secondary' : 'destructive'
                    }>
                      {detail.action === 'imported' ? 'Importado' :
                       detail.action === 'updated' ? 'Atualizado' : 'Erro'}
                    </Badge>
                    <span className="text-sm">
                      {detail.product || detail.url}
                    </span>
                  </div>
                  {detail.marketplace && (
                    <Badge variant="outline">{detail.marketplace}</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
