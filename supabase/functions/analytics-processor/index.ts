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
    console.log('Iniciando processamento de analytics...');

    // Definir períodos de análise
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 1. Métricas Gerais
    const generalMetrics = await calculateGeneralMetrics(last24h, last7d, last30d);
    
    // 2. Análise de Produtos
    const productAnalytics = await analyzeProducts(last7d);
    
    // 3. Análise de Usuários
    const userAnalytics = await analyzeUsers(last7d);
    
    // 4. Análise de Conversão
    const conversionAnalytics = await analyzeConversions(last7d);
    
    // 5. Análise de Marketplace
    const marketplaceAnalytics = await analyzeMarketplaces(last7d);

    // Consolidar todos os insights
    const insights = {
      general_metrics: generalMetrics,
      product_analytics: productAnalytics,
      user_analytics: userAnalytics,
      conversion_analytics: conversionAnalytics,
      marketplace_analytics: marketplaceAnalytics,
      generated_at: now.toISOString()
    };

    // Salvar insights no banco
    await supabase
      .from('system_settings')
      .upsert({
        key: 'daily_analytics',
        value: insights,
        description: 'Analytics processado automaticamente',
        is_public: false
      });

    // Gerar alertas se necessário
    const alerts = generateAlerts(insights);
    for (const alert of alerts) {
      await sendAlert(alert);
    }

    const duration = Date.now() - startTime;

    // Log da execução
    await supabase
      .from('automation_logs')
      .insert({
        job_id: null,
        status: 'success',
        message: 'Processamento de analytics concluído',
        details: {
          metrics_calculated: Object.keys(insights).length,
          alerts_generated: alerts.length,
          data_points_processed: generalMetrics.total_events || 0
        },
        duration_ms: duration
      });

    return new Response(JSON.stringify({
      success: true,
      message: 'Analytics processado com sucesso',
      insights_generated: Object.keys(insights).length,
      alerts_generated: alerts.length,
      duration_ms: duration
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error('Erro no processamento de analytics:', error);
    
    await supabase
      .from('automation_logs')
      .insert({
        job_id: null,
        status: 'error',
        message: `Erro no processamento de analytics: ${error.message}`,
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

async function calculateGeneralMetrics(last24h: Date, last7d: Date, last30d: Date) {
  const metrics = {};

  try {
    // Total de eventos por período
    const { count: events24h } = await supabase
      .from('user_analytics')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', last24h.toISOString());

    const { count: events7d } = await supabase
      .from('user_analytics')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', last7d.toISOString());

    // Usuários únicos
    const { data: uniqueUsers } = await supabase
      .from('user_analytics')
      .select('user_id')
      .gte('created_at', last7d.toISOString());

    const uniqueUserCount = new Set(uniqueUsers?.map(u => u.user_id)).size;

    // Cliques em produtos
    const { count: productClicks } = await supabase
      .from('affiliate_clicks')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', last7d.toISOString());

    Object.assign(metrics, {
      total_events: events7d || 0,
      events_24h: events24h || 0,
      unique_users_7d: uniqueUserCount,
      product_clicks_7d: productClicks || 0,
      avg_events_per_user: uniqueUserCount > 0 ? Math.round((events7d || 0) / uniqueUserCount) : 0
    });

  } catch (error) {
    console.error('Erro calculando métricas gerais:', error);
  }

  return metrics;
}

async function analyzeProducts(since: Date) {
  const analytics = {};

  try {
    // Produtos mais visualizados
    const { data: topViewed } = await supabase
      .from('user_analytics')
      .select('product_id, products:product_id(title)')
      .eq('event_type', 'product_view')
      .gte('created_at', since.toISOString());

    const viewCounts = topViewed?.reduce((acc, item) => {
      if (item.product_id) {
        acc[item.product_id] = (acc[item.product_id] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>) || {};

    const sortedViews = Object.entries(viewCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    // Produtos mais clicados
    const { data: topClicked } = await supabase
      .from('affiliate_clicks')
      .select('product_id, marketplace_id')
      .gte('created_at', since.toISOString());

    const clickCounts = topClicked?.reduce((acc, item) => {
      if (item.product_id) {
        acc[item.product_id] = (acc[item.product_id] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>) || {};

    Object.assign(analytics, {
      top_viewed_products: sortedViews,
      top_clicked_products: Object.entries(clickCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10),
      total_products_viewed: Object.keys(viewCounts).length,
      total_products_clicked: Object.keys(clickCounts).length
    });

  } catch (error) {
    console.error('Erro analisando produtos:', error);
  }

  return analytics;
}

async function analyzeUsers(since: Date) {
  const analytics = {};

  try {
    // Usuários mais ativos
    const { data: userActivity } = await supabase
      .from('user_analytics')
      .select('user_id')
      .gte('created_at', since.toISOString());

    const userCounts = userActivity?.reduce((acc, item) => {
      acc[item.user_id] = (acc[item.user_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const topUsers = Object.entries(userCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    // Análise de eventos por tipo
    const { data: eventTypes } = await supabase
      .from('user_analytics')
      .select('event_type')
      .gte('created_at', since.toISOString());

    const eventTypeCounts = eventTypes?.reduce((acc, item) => {
      acc[item.event_type] = (acc[item.event_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    Object.assign(analytics, {
      most_active_users: topUsers,
      event_type_distribution: eventTypeCounts,
      total_active_users: Object.keys(userCounts).length
    });

  } catch (error) {
    console.error('Erro analisando usuários:', error);
  }

  return analytics;
}

async function analyzeConversions(since: Date) {
  const analytics = {};

  try {
    // Taxa de conversão (visualização -> clique)
    const { count: totalViews } = await supabase
      .from('user_analytics')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'product_view')
      .gte('created_at', since.toISOString());

    const { count: totalClicks } = await supabase
      .from('affiliate_clicks')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', since.toISOString());

    const conversionRate = totalViews && totalViews > 0 
      ? ((totalClicks || 0) / totalViews * 100).toFixed(2)
      : '0.00';

    Object.assign(analytics, {
      total_views: totalViews || 0,
      total_clicks: totalClicks || 0,
      conversion_rate: `${conversionRate}%`,
      avg_clicks_per_day: Math.round((totalClicks || 0) / 7)
    });

  } catch (error) {
    console.error('Erro analisando conversões:', error);
  }

  return analytics;
}

async function analyzeMarketplaces(since: Date) {
  const analytics = {};

  try {
    // Distribuição de cliques por marketplace
    const { data: marketplaceClicks } = await supabase
      .from('products')
      .select(`
        marketplace,
        affiliate_clicks!inner(created_at)
      `)
      .gte('affiliate_clicks.created_at', since.toISOString());

    const marketplaceCounts = marketplaceClicks?.reduce((acc, item) => {
      acc[item.marketplace] = (acc[item.marketplace] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    Object.assign(analytics, {
      marketplace_distribution: marketplaceCounts,
      most_popular_marketplace: Object.entries(marketplaceCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'
    });

  } catch (error) {
    console.error('Erro analisando marketplaces:', error);
  }

  return analytics;
}

function generateAlerts(insights: any): any[] {
  const alerts = [];

  // Alert: Queda abrupta no tráfego
  if (insights.general_metrics.events_24h < insights.general_metrics.total_events * 0.1) {
    alerts.push({
      type: 'traffic_drop',
      severity: 'high',
      title: 'Queda no Tráfego Detectada',
      message: `Tráfego nas últimas 24h (${insights.general_metrics.events_24h}) é muito baixo comparado à média semanal.`
    });
  }

  // Alert: Taxa de conversão baixa
  const conversionRate = parseFloat(insights.conversion_analytics.conversion_rate);
  if (conversionRate < 1.0) {
    alerts.push({
      type: 'low_conversion',
      severity: 'medium',
      title: 'Taxa de Conversão Baixa',
      message: `Taxa de conversão atual: ${insights.conversion_analytics.conversion_rate}. Considere otimizar a experiência do usuário.`
    });
  }

  // Alert: Poucos produtos sendo visualizados
  if (insights.product_analytics.total_products_viewed < 5) {
    alerts.push({
      type: 'low_product_diversity',
      severity: 'medium',
      title: 'Baixa Diversidade de Produtos',
      message: `Apenas ${insights.product_analytics.total_products_viewed} produtos foram visualizados. Considere melhorar a descoberta de produtos.`
    });
  }

  return alerts;
}

async function sendAlert(alert: any) {
  try {
    // Buscar admins
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
          subject: `🚨 Alerta: ${alert.title}`,
          html_content: `
            <h2>${alert.title}</h2>
            <p><strong>Severidade:</strong> ${alert.severity.toUpperCase()}</p>
            <p>${alert.message}</p>
            <p><small>Alerta gerado automaticamente em ${new Date().toLocaleString('pt-BR')}</small></p>
          `,
          template_name: 'system_alert'
        });
    }
  } catch (error) {
    console.error('Erro enviando alerta:', error);
  }
}

serve(handler);