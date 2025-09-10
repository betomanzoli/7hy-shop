
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Activity,
  Mail,
  TrendingUp,
  Search,
  Bot,
  Zap,
  Rocket
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AutomationJob {
  id: string;
  job_name: string;
  job_type: string;
  schedule: string;
  is_active: boolean;
  last_run: string | null;
  next_run: string | null;
  run_count: number;
  error_count: number;
  last_error: string | null;
  config: any;
  created_at: string;
  updated_at: string;
}

interface AutomationLog {
  id: string;
  job_id: string;
  status: string; // Changed from union type to string
  message: string;
  details: any;
  duration_ms: number;
  created_at: string;
}

export function AutomationDashboard() {
  const [jobs, setJobs] = useState<AutomationJob[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningJobs, setRunningJobs] = useState<Set<string>>(new Set());
  const [activatingSystem, setActivatingSystem] = useState(false);

  const fetchData = async () => {
    try {
      const [jobsResponse, logsResponse] = await Promise.all([
        supabase
          .from('automation_jobs')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('automation_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)
      ]);

      if (jobsResponse.data) setJobs(jobsResponse.data);
      if (logsResponse.data) setLogs(logsResponse.data);
    } catch (error) {
      console.error('Erro ao carregar dados de automação:', error);
      toast.error('Erro ao carregar dados de automação');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  }, []);

  const toggleJobStatus = async (jobId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('automation_jobs')
        .update({ is_active: isActive })
        .eq('id', jobId);

      if (error) throw error;

      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, is_active: isActive } : job
      ));

      toast.success(isActive ? 'Job ativado' : 'Job desativado');
    } catch (error) {
      console.error('Erro ao atualizar job:', error);
      toast.error('Erro ao atualizar job');
    }
  };

  const activateCompleteSystem = async () => {
    setActivatingSystem(true);
    
    try {
      toast.loading('🚀 Ativando sistema completo com seus IDs de afiliado...', {
        id: 'system-activation'
      });

      const { data, error } = await supabase.functions.invoke('auto-activate-system', {
        body: {}
      });

      if (error) throw error;

      toast.success(
        `🎉 Sistema ativado com sucesso! ${data.summary.successful_steps}/${data.summary.total_steps} passos concluídos`,
        { id: 'system-activation' }
      );
      
      // Mostrar detalhes da ativação
      console.log('Resultado da ativação:', data);
      
      // Recarregar dados
      fetchData();
      
    } catch (error) {
      console.error('Erro na ativação do sistema:', error);
      toast.error(
        `Erro na ativação: ${error.message}`,
        { id: 'system-activation' }
      );
    } finally {
      setActivatingSystem(false);
    }
  };

  const runJobManually = async (job: AutomationJob) => {
    setRunningJobs(prev => new Set(prev).add(job.id));
    
    try {
      const response = await fetch(`/functions/v1/${job.job_name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Job ${job.job_name} executado com sucesso`);
        fetchData(); // Recarregar dados
      } else {
        throw new Error('Erro na execução do job');
      }
    } catch (error) {
      console.error('Erro ao executar job:', error);
      toast.error(`Erro ao executar ${job.job_name}`);
    } finally {
      setRunningJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(job.id);
        return newSet;
      });
    }
  };

  const getJobIcon = (jobType: string) => {
    switch (jobType) {
      case 'price_monitoring': return <TrendingUp className="h-4 w-4" />;
      case 'user_engagement': return <Mail className="h-4 w-4" />;
      case 'email_automation': return <Mail className="h-4 w-4" />;
      case 'analytics': return <Activity className="h-4 w-4" />;
      case 'market_intelligence': return <Search className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (job: AutomationJob) => {
    if (!job.is_active) {
      return <Badge variant="secondary">Inativo</Badge>;
    }
    if (job.error_count > 0 && job.last_error) {
      return <Badge variant="destructive">Com Erros</Badge>;
    }
    return <Badge variant="default">Ativo</Badge>;
  };

  const getLogStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'partial_success': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatSchedule = (schedule: string) => {
    // Converter cron para descrição legível
    const scheduleMap: Record<string, string> = {
      '0 */4 * * *': 'A cada 4 horas',
      '*/15 * * * *': 'A cada 15 minutos',
      '0 6 * * *': 'Diariamente às 6h',
      '0 2 * * *': 'Diariamente às 2h',
      '*/5 * * * *': 'A cada 5 minutos'
    };
    return scheduleMap[schedule] || schedule;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const activeJobs = jobs.filter(j => j.is_active).length;
  const totalRuns = jobs.reduce((sum, job) => sum + job.run_count, 0);
  const totalErrors = jobs.reduce((sum, job) => sum + job.error_count, 0);
  const successRate = totalRuns > 0 ? ((totalRuns - totalErrors) / totalRuns * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Ativação Completa do Sistema */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Rocket className="h-5 w-5 text-primary" />
            <span>Ativação Completa do Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ative automaticamente TODO o sistema com seus IDs de afiliado configurados:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Amazon ID: <strong>7hy01-20</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Shopee ID: <strong>18357850294</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Configurar Cron Jobs</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Importar Produtos</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Gerar Recomendações</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Processar Analytics</span>
              </div>
            </div>
            
            <Button 
              onClick={activateCompleteSystem}
              disabled={activatingSystem}
              className="w-full md:w-auto"
              size="lg"
            >
              {activatingSystem ? (
                <>
                  <RotateCcw className="h-5 w-5 mr-2 animate-spin" />
                  Ativando Sistema...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Ativar Sistema Completo
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Jobs Ativos</p>
                <p className="text-2xl font-bold">{activeJobs}</p>
              </div>
              <Bot className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Execuções</p>
                <p className="text-2xl font-bold">{totalRuns}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</p>
                <p className="text-2xl font-bold">{successRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Erros</p>
                <p className="text-2xl font-bold">{totalErrors}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Jobs de Automação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getJobIcon(job.job_type)}
                    <div>
                      <h3 className="font-semibold">{job.job_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatSchedule(job.schedule)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(job)}
                    <Switch
                      checked={job.is_active}
                      onCheckedChange={(checked) => toggleJobStatus(job.id, checked)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Execuções: </span>
                    <span className="font-medium">{job.run_count}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Erros: </span>
                    <span className="font-medium text-red-500">{job.error_count}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Última execução: </span>
                    <span className="font-medium">
                      {job.last_run ? new Date(job.last_run).toLocaleString('pt-BR') : 'Nunca'}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => runJobManually(job)}
                      disabled={runningJobs.has(job.id)}
                    >
                      {runningJobs.has(job.id) ? (
                        <RotateCcw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {job.last_error && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                    <strong>Último erro:</strong> {job.last_error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Logs Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Logs Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {logs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  {getLogStatusIcon(log.status)}
                  
                  <div>
                    <p className="font-medium">{log.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(log.created_at).toLocaleString('pt-BR')} • 
                      Duração: {formatDuration(log.duration_ms)}
                    </p>
                  </div>
                </div>
                
                {log.details && (
                  <div className="text-sm text-muted-foreground">
                    {log.details.processed && `${log.details.processed} processados`}
                    {log.details.sent && ` • ${log.details.sent} enviados`}
                    {log.details.errors && ` • ${log.details.errors} erros`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
