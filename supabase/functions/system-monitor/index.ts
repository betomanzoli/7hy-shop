import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();
    console.log('Iniciando monitoramento do sistema...');

    const healthChecks = {
      database: await checkDatabaseHealth(),
      automation_jobs: await checkAutomationJobs(),
      email_queue: await checkEmailQueue(),
      products: await checkProductsHealth(),
      edge_functions: await checkEdgeFunctions(),
      storage: await checkStorageHealth(),
      performance: await checkPerformanceMetrics()
    };

    // Calcular saúde geral do sistema
    const healthScore = calculateOverallHealth(healthChecks);
    
    // Gerar alertas críticos
    const alerts = generateHealthAlerts(healthChecks);
    
    // Salvar status do sistema
    const systemStatus = {
      overall_health: healthScore,
      health_checks: healthChecks,
      alerts: alerts,
      last_check: new Date().toISOString(),
      uptime_days: calculateUptime()
    };

    await supabase
      .from('system_settings')
      .upsert({
        key: 'system_health',
        value: systemStatus,
        description: 'Status de saúde do sistema',
        is_public: false
      });

    // Enviar alertas críticos
    for (const alert of alerts.filter(a => a.severity === 'critical')) {
      await sendCriticalAlert(alert);
    }

    // Executar limpeza automática se necessário
    if (healthChecks.database.cleanup_needed) {
      await performDatabaseCleanup();
    }

    const duration = Date.now() - startTime;

    // Log da execução
    await supabase
      .from('automation_logs')
      .insert({
        job_id: null,
        status: healthScore >= 80 ? 'success' : 'error',
        message: `Monitoramento do sistema concluído - Saúde: ${healthScore}%`,
        details: {
          overall_health: healthScore,
          alerts_generated: alerts.length,
          critical_alerts: alerts.filter(a => a.severity === 'critical').length,
          checks_performed: Object.keys(healthChecks).length
        },
        duration_ms: duration
      });

    return new Response(JSON.stringify({
      success: true,
      message: 'Monitoramento concluído',
      overall_health: healthScore,
      alerts_count: alerts.length,
      critical_alerts: alerts.filter(a => a.severity === 'critical').length,
      duration_ms: duration
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error('Erro no monitoramento do sistema:', error);
    
    // Alerta crítico de erro no monitoramento
    await sendCriticalAlert({
      type: 'monitor_failure',
      severity: 'critical',
      title: 'Falha no Sistema de Monitoramento',
      message: `Erro crítico no monitoramento: ${error.message}`,
      timestamp: new Date().toISOString()
    });
    
    await supabase
      .from('automation_logs')
      .insert({
        job_id: null,
        status: 'error',
        message: `Erro no monitoramento do sistema: ${error.message}`,
        details: { error: error.message },
        duration_ms: Date.now() - Date.now()
      });

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

async function checkDatabaseHealth() {
  const health = { status: 'healthy', issues: [], cleanup_needed: false };

  try {
    // Verificar conectividade
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);

    if (error) {
      health.status = 'error';
      health.issues.push(`Database connection error: ${error.message}`);
      return health;
    }

    // Verificar tamanho das tabelas principais
    const tables = ['products', 'user_analytics', 'automation_logs', 'email_queue'];
    const tableSizes = {};

    for (const table of tables) {
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      tableSizes[table] = count || 0;
    }

    // Verificar se precisa de limpeza
    const oldLogs = await supabase
      .from('automation_logs')
      .select('id')
      .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    if (oldLogs.data && oldLogs.data.length > 0) {
      health.cleanup_needed = true;
    }

    // Verificar emails na fila há muito tempo
    const { count: stuckEmails } = await supabase
      .from('email_queue')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (stuckEmails && stuckEmails > 10) {
      health.status = 'warning';
      health.issues.push(`${stuckEmails} emails stuck in queue for >24h`);
    }

    health.table_sizes = tableSizes;

  } catch (error) {
    health.status = 'error';
    health.issues.push(`Database health check failed: ${error.message}`);
  }

  return health;
}

async function checkAutomationJobs() {
  const health = { status: 'healthy', issues: [], jobs_status: {} };

  try {
    const { data: jobs, error } = await supabase
      .from('automation_jobs')
      .select('*');

    if (error) {
      health.status = 'error';
      health.issues.push(`Failed to fetch automation jobs: ${error.message}`);
      return health;
    }

    const now = new Date();
    let failedJobs = 0;

    for (const job of jobs || []) {
      const jobHealth = {
        is_active: job.is_active,
        run_count: job.run_count,
        error_count: job.error_count,
        last_run: job.last_run,
        status: 'healthy'
      };

      // Verificar se job está falhando muito
      if (job.error_count > job.run_count * 0.3) {
        jobHealth.status = 'error';
        health.issues.push(`Job ${job.job_name} has high error rate: ${job.error_count}/${job.run_count}`);
        failedJobs++;
      }

      // Verificar se job não roda há muito tempo
      if (job.is_active && job.last_run) {
        const lastRun = new Date(job.last_run);
        const hoursSinceLastRun = (now.getTime() - lastRun.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastRun > 24) {
          jobHealth.status = 'warning';
          health.issues.push(`Job ${job.job_name} hasn't run in ${Math.round(hoursSinceLastRun)} hours`);
        }
      }

      health.jobs_status[job.job_name] = jobHealth;
    }

    if (failedJobs > 0) {
      health.status = failedJobs > jobs.length * 0.5 ? 'error' : 'warning';
    }

  } catch (error) {
    health.status = 'error';
    health.issues.push(`Automation jobs check failed: ${error.message}`);
  }

  return health;
}

async function checkEmailQueue() {
  const health = { status: 'healthy', issues: [], queue_stats: {} };

  try {
    const { count: pendingEmails } = await supabase
      .from('email_queue')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: failedEmails } = await supabase
      .from('email_queue')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed');

    health.queue_stats = {
      pending: pendingEmails || 0,
      failed: failedEmails || 0
    };

    if (pendingEmails && pendingEmails > 100) {
      health.status = 'warning';
      health.issues.push(`High email queue backlog: ${pendingEmails} pending emails`);
    }

    if (failedEmails && failedEmails > 50) {
      health.status = 'error';
      health.issues.push(`High email failure rate: ${failedEmails} failed emails`);
    }

  } catch (error) {
    health.status = 'error';
    health.issues.push(`Email queue check failed: ${error.message}`);
  }

  return health;
}

async function checkProductsHealth() {
  const health = { status: 'healthy', issues: [], product_stats: {} };

  try {
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: outdatedProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .lt('updated_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    health.product_stats = {
      total_active: totalProducts || 0,
      outdated: outdatedProducts || 0
    };

    if (totalProducts && totalProducts < 10) {
      health.status = 'warning';
      health.issues.push(`Low product count: ${totalProducts} active products`);
    }

    if (outdatedProducts && outdatedProducts > totalProducts * 0.5) {
      health.status = 'warning';
      health.issues.push(`Many outdated products: ${outdatedProducts}/${totalProducts}`);
    }

  } catch (error) {
    health.status = 'error';
    health.issues.push(`Products health check failed: ${error.message}`);
  }

  return health;
}

async function checkEdgeFunctions() {
  const health = { status: 'healthy', issues: [], function_checks: {} };

  const criticalFunctions = [
    'price-monitor',
    'user-alerts', 
    'email-processor'
  ];

  for (const functionName of criticalFunctions) {
    try {
      // Simular verificação de edge function (timeout rápido)
      const response = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/${functionName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ health_check: true }),
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      health.function_checks[functionName] = {
        status: response.ok ? 'healthy' : 'error',
        response_time: Date.now() - Date.now() // Placeholder
      };

      if (!response.ok) {
        health.status = 'warning';
        health.issues.push(`Edge function ${functionName} returned ${response.status}`);
      }

    } catch (error) {
      health.function_checks[functionName] = {
        status: 'error',
        error: error.message
      };
      health.status = 'error';
      health.issues.push(`Edge function ${functionName} failed: ${error.message}`);
    }
  }

  return health;
}

async function checkStorageHealth() {
  // Placeholder para verificação de storage
  return {
    status: 'healthy',
    issues: [],
    storage_stats: {
      total_files: 0,
      total_size_mb: 0
    }
  };
}

async function checkPerformanceMetrics() {
  const health = { status: 'healthy', issues: [], metrics: {} };

  try {
    // Verificar tempo de resposta do banco
    const startTime = Date.now();
    await supabase.from('products').select('id').limit(1);
    const dbResponseTime = Date.now() - startTime;

    health.metrics = {
      db_response_time_ms: dbResponseTime,
      memory_usage: 'N/A', // Placeholder
      cpu_usage: 'N/A' // Placeholder
    };

    if (dbResponseTime > 1000) {
      health.status = 'warning';
      health.issues.push(`Slow database response: ${dbResponseTime}ms`);
    }

  } catch (error) {
    health.status = 'error';
    health.issues.push(`Performance check failed: ${error.message}`);
  }

  return health;
}

function calculateOverallHealth(healthChecks: any): number {
  const weights = {
    database: 30,
    automation_jobs: 25,
    email_queue: 15,
    products: 15,
    edge_functions: 10,
    storage: 3,
    performance: 2
  };

  let totalScore = 0;
  let totalWeight = 0;

  for (const [component, weight] of Object.entries(weights)) {
    const health = healthChecks[component];
    if (health) {
      let score = 100;
      if (health.status === 'warning') score = 70;
      if (health.status === 'error') score = 30;
      if (health.status === 'critical') score = 0;

      totalScore += score * weight;
      totalWeight += weight;
    }
  }

  return Math.round(totalWeight > 0 ? totalScore / totalWeight : 0);
}

function generateHealthAlerts(healthChecks: any): any[] {
  const alerts = [];

  for (const [component, health] of Object.entries(healthChecks)) {
    if (health.status === 'error' || health.status === 'critical') {
      alerts.push({
        type: `${component}_health`,
        severity: health.status === 'critical' ? 'critical' : 'high',
        title: `${component.replace('_', ' ').toUpperCase()} Health Issue`,
        message: health.issues.join('; '),
        component: component,
        timestamp: new Date().toISOString()
      });
    }
  }

  return alerts;
}

async function sendCriticalAlert(alert: any) {
  try {
    const { data: admins } = await supabase
      .from('users')
      .select('email')
      .eq('is_admin', true);

    if (!admins || admins.length === 0) return;

    for (const admin of admins) {
      await supabase
        .from('email_queue')
        .insert({
          to_email: admin.email,
          subject: `🚨 CRÍTICO: ${alert.title}`,
          html_content: `
            <h2 style="color: red;">ALERTA CRÍTICO DO SISTEMA</h2>
            <h3>${alert.title}</h3>
            <p><strong>Componente:</strong> ${alert.component || 'Sistema'}</p>
            <p><strong>Severidade:</strong> ${alert.severity.toUpperCase()}</p>
            <p><strong>Detalhes:</strong></p>
            <p>${alert.message}</p>
            <p><strong>Timestamp:</strong> ${new Date(alert.timestamp).toLocaleString('pt-BR')}</p>
            <hr>
            <p><small>Este é um alerta automático do sistema de monitoramento 7hy-shop.</small></p>
          `,
          template_name: 'critical_alert'
        });
    }
  } catch (error) {
    console.error('Erro enviando alerta crítico:', error);
  }
}

async function performDatabaseCleanup() {
  try {
    console.log('Executando limpeza automática do banco...');

    // Limpar logs antigos (>30 dias)
    const { error: logsError } = await supabase
      .from('automation_logs')
      .delete()
      .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (logsError) {
      console.error('Erro limpando logs:', logsError);
    }

    // Limpar emails antigos processados (>7 dias)
    const { error: emailsError } = await supabase
      .from('email_queue')
      .delete()
      .eq('status', 'sent')
      .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (emailsError) {
      console.error('Erro limpando emails:', emailsError);
    }

    console.log('Limpeza automática concluída');

  } catch (error) {
    console.error('Erro na limpeza automática:', error);
  }
}

function calculateUptime(): number {
  // Placeholder - em uma implementação real, você rastrearia o uptime
  return Math.floor(Math.random() * 100) + 200; // Simular 200-300 dias
}

serve(handler);