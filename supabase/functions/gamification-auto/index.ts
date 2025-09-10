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
    console.log('Iniciando processamento de gamificação...');

    // Buscar atividades recentes dos usuários (últimas 24h)
    const { data: recentActivities, error: activitiesError } = await supabase
      .from('user_analytics')
      .select('user_id, event_type, product_id, event_data, created_at')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (activitiesError) {
      throw activitiesError;
    }

    if (!recentActivities || recentActivities.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Nenhuma atividade recente para processar',
        users_processed: 0
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Agrupar atividades por usuário
    const userActivities = recentActivities.reduce((acc, activity) => {
      if (!acc[activity.user_id]) {
        acc[activity.user_id] = [];
      }
      acc[activity.user_id].push(activity);
      return acc;
    }, {} as Record<string, any[]>);

    let processedUsers = 0;
    let totalPointsAwarded = 0;
    const achievements = [];

    // Processar cada usuário
    for (const [userId, activities] of Object.entries(userActivities)) {
      try {
        const pointsEarned = calculatePoints(activities);
        const newAchievements = checkAchievements(userId, activities);
        
        if (pointsEarned > 0) {
          // Atualizar pontos do usuário
          const { data: currentUser, error: userError } = await supabase
            .from('users')
            .select('preferences')
            .eq('id', userId)
            .single();

          if (!userError && currentUser) {
            const currentPoints = currentUser.preferences?.points || 0;
            const newPoints = currentPoints + pointsEarned;

            await supabase
              .from('users')
              .update({
                preferences: {
                  ...currentUser.preferences,
                  points: newPoints,
                  last_activity: new Date().toISOString()
                }
              })
              .eq('id', userId);

            totalPointsAwarded += pointsEarned;
          }
        }

        // Registrar conquistas
        for (const achievement of newAchievements) {
          achievements.push({ userId, ...achievement });
          
          // Enviar notificação de conquista
          await supabase
            .from('notifications')
            .insert({
              user_id: userId,
              title: `🎉 Nova Conquista: ${achievement.title}`,
              message: achievement.description,
              type: 'achievement',
              data: {
                achievement_type: achievement.type,
                points_earned: achievement.points
              }
            });
        }

        processedUsers++;

      } catch (error) {
        console.error(`Erro processando usuário ${userId}:`, error);
      }
    }

    // Atualizar rankings diários
    await updateDailyRankings();

    const duration = Date.now() - startTime;

    // Log da execução
    await supabase
      .from('automation_logs')
      .insert({
        job_id: null,
        status: 'success',
        message: 'Processamento de gamificação concluído',
        details: {
          users_processed: processedUsers,
          total_points_awarded: totalPointsAwarded,
          achievements_unlocked: achievements.length,
          activities_processed: recentActivities.length
        },
        duration_ms: duration
      });

    return new Response(JSON.stringify({
      success: true,
      message: 'Gamificação processada com sucesso',
      users_processed: processedUsers,
      total_points_awarded: totalPointsAwarded,
      achievements_unlocked: achievements.length,
      duration_ms: duration
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error('Erro no processamento de gamificação:', error);
    
    await supabase
      .from('automation_logs')
      .insert({
        job_id: null,
        status: 'error',
        message: `Erro no processamento de gamificação: ${error.message}`,
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

function calculatePoints(activities: any[]): number {
  let points = 0;
  
  const pointsSystem = {
    'product_view': 1,
    'product_click': 3,
    'comparison_made': 5,
    'price_alert_created': 2,
    'wishlist_add': 2,
    'search_performed': 1,
    'tool_used': 3,
    'daily_visit': 5
  };

  // Contar atividades por tipo
  const activityCounts = activities.reduce((acc, activity) => {
    acc[activity.event_type] = (acc[activity.event_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calcular pontos base
  for (const [eventType, count] of Object.entries(activityCounts)) {
    const pointsPerAction = pointsSystem[eventType] || 0;
    points += pointsPerAction * count;
  }

  // Bônus por streak (visitas consecutivas)
  const uniqueDays = new Set(
    activities.map(a => new Date(a.created_at).toDateString())
  ).size;
  
  if (uniqueDays >= 3) points += 10; // Bônus streak 3 dias
  if (uniqueDays >= 7) points += 25; // Bônus streak 7 dias

  // Bônus por diversidade de ações
  const uniqueEventTypes = Object.keys(activityCounts).length;
  if (uniqueEventTypes >= 5) points += 15;

  return Math.floor(points);
}

function checkAchievements(userId: string, activities: any[]): any[] {
  const achievements = [];
  
  const activityCounts = activities.reduce((acc, activity) => {
    acc[activity.event_type] = (acc[activity.event_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Conquista: Primeiro Clique
  if (activityCounts['product_click'] >= 1) {
    achievements.push({
      type: 'first_click',
      title: 'Primeiro Clique',
      description: 'Você clicou em seu primeiro produto!',
      points: 10
    });
  }

  // Conquista: Comparador Expert
  if (activityCounts['comparison_made'] >= 5) {
    achievements.push({
      type: 'comparison_expert',
      title: 'Comparador Expert',
      description: 'Você fez 5 comparações de produtos!',
      points: 25
    });
  }

  // Conquista: Caçador de Ofertas
  if (activityCounts['price_alert_created'] >= 3) {
    achievements.push({
      type: 'deal_hunter',
      title: 'Caçador de Ofertas',
      description: 'Você criou 3 alertas de preço!',
      points: 20
    });
  }

  // Conquista: Explorador
  if (Object.keys(activityCounts).length >= 6) {
    achievements.push({
      type: 'explorer',
      title: 'Explorador da Plataforma',
      description: 'Você usou diversas funcionalidades!',
      points: 30
    });
  }

  // Conquista: Visitante Fiel (baseado em dados históricos)
  const uniqueDays = new Set(
    activities.map(a => new Date(a.created_at).toDateString())
  ).size;

  if (uniqueDays >= 7) {
    achievements.push({
      type: 'loyal_visitor',
      title: 'Visitante Fiel',
      description: 'Você visitou a plataforma por 7 dias seguidos!',
      points: 50
    });
  }

  return achievements;
}

async function updateDailyRankings() {
  try {
    // Buscar top usuários por pontos
    const { data: topUsers, error: rankingError } = await supabase
      .from('users')
      .select('id, full_name, preferences')
      .order('preferences->points', { ascending: false })
      .limit(50);

    if (rankingError) {
      console.error('Erro ao buscar ranking:', rankingError);
      return;
    }

    // Salvar ranking atual
    await supabase
      .from('system_settings')
      .upsert({
        key: 'daily_ranking',
        value: {
          ranking: topUsers?.map((user, index) => ({
            position: index + 1,
            user_id: user.id,
            full_name: user.full_name,
            points: user.preferences?.points || 0
          })) || [],
          updated_at: new Date().toISOString()
        },
        description: 'Ranking diário de usuários',
        is_public: true
      });

  } catch (error) {
    console.error('Erro atualizando rankings:', error);
  }
}

serve(handler);