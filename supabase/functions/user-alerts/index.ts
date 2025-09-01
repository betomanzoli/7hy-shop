
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

  const startTime = Date.now();
  let jobId: string | null = null;

  try {
    // Registrar início do job
    const { data: job } = await supabase
      .from('automation_jobs')
      .select('id, config')
      .eq('job_name', 'user-alerts')
      .single();

    if (job) {
      jobId = job.id;
      await supabase
        .from('automation_jobs')
        .update({ 
          last_run: new Date().toISOString(),
          run_count: supabase.rpc('increment', { x: 1 })
        })
        .eq('id', jobId);
    }

    const batchSize = job?.config?.batch_size || 50;

    // Buscar alertas de preço ativos onde o preço atual <= preço alvo
    const { data: alerts, error: alertsError } = await supabase
      .from('price_alerts')
      .select(`
        id,
        target_price,
        notification_sent,
        user_id,
        users!inner(email, full_name),
        products!inner(id, title, price, image_url, affiliate_url, marketplace)
      `)
      .eq('is_active', true)
      .eq('notification_sent', false)
      .limit(batchSize);

    if (alertsError) {
      throw new Error(`Erro ao buscar alertas: ${alertsError.message}`);
    }

    if (!alerts || alerts.length === 0) {
      const message = "Nenhum alerta de preço ativado encontrado";
      
      if (jobId) {
        await supabase.from('automation_logs').insert({
          job_id: jobId,
          status: 'success',
          message,
          duration_ms: Date.now() - startTime
        });
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message,
        processed: 0
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let notificationsSent = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Processar cada alerta
    for (const alert of alerts) {
      try {
        const product = alert.products;
        const user = alert.users;

        // Verificar se o preço atual é menor ou igual ao preço alvo
        if (product.price <= alert.target_price) {
          const discount = ((alert.target_price - product.price) / alert.target_price * 100).toFixed(1);
          
          // Adicionar email à fila
          const { error: emailError } = await supabase.from('email_queue').insert({
            to_email: user.email,
            subject: `🎉 Alerta de Preço: ${product.title} chegou no seu preço alvo!`,
            html_content: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #059669;">🎯 Preço Alvo Atingido!</h2>
                <p>Olá ${user.full_name || 'Cliente'},</p>
                
                <p>Temos uma ótima notícia! O produto que você estava acompanhando atingiu o preço desejado:</p>
                
                <div style="border: 2px solid #059669; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">${product.title}</h3>
                  ${product.image_url ? `<img src="${product.image_url}" alt="${product.title}" style="max-width: 200px; border-radius: 4px;">` : ''}
                  
                  <div style="margin: 15px 0;">
                    <span style="font-size: 18px; color: #059669; font-weight: bold;">
                      💰 Preço Atual: R$ ${product.price.toFixed(2)}
                    </span><br>
                    <span style="color: #6b7280; text-decoration: line-through;">
                      Preço Alvo: R$ ${alert.target_price.toFixed(2)}
                    </span><br>
                    <span style="color: #dc2626; font-weight: bold;">
                      Você economiza ${discount}%!
                    </span>
                  </div>
                  
                  <p style="margin-bottom: 0;">
                    <strong>Marketplace:</strong> ${product.marketplace.charAt(0).toUpperCase() + product.marketplace.slice(1)}
                  </p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${product.affiliate_url}" 
                     style="background-color: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    🛒 Comprar Agora
                  </a>
                </div>
                
                <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
                  Este alerta foi desativado automaticamente. Para continuar acompanhando este produto, configure um novo alerta em nosso site.
                </p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                <p style="font-size: 12px; color: #6b7280; text-align: center;">
                  7hy Shop - Encontre as melhores ofertas<br>
                  <a href="https://7hy.shop" style="color: #059669;">https://7hy.shop</a>
                </p>
              </div>
            `,
            template_name: 'price_alert_user',
            template_data: {
              user_name: user.full_name,
              product_title: product.title,
              current_price: product.price,
              target_price: alert.target_price,
              discount_percentage: discount,
              affiliate_url: product.affiliate_url,
              marketplace: product.marketplace
            }
          });

          if (emailError) {
            throw new Error(`Erro ao enviar email: ${emailError.message}`);
          }

          // Marcar alerta como enviado e desativar
          await supabase
            .from('price_alerts')
            .update({ 
              notification_sent: true,
              is_active: false,
              triggered_at: new Date().toISOString()
            })
            .eq('id', alert.id);

          // Criar notificação no sistema
          await supabase.from('notifications').insert({
            user_id: alert.user_id,
            type: 'price_alert',
            title: 'Preço Alvo Atingido!',
            message: `${product.title} chegou no preço desejado: R$ ${product.price.toFixed(2)}`,
            data: {
              product_id: product.id,
              old_price: alert.target_price,
              new_price: product.price,
              affiliate_url: product.affiliate_url
            }
          });

          notificationsSent++;
        }
      } catch (error) {
        errorCount++;
        errors.push(`Alerta ${alert.id}: ${error.message}`);
        console.error(`Erro ao processar alerta ${alert.id}:`, error);
      }
    }

    const duration = Date.now() - startTime;
    const message = `Processados ${alerts.length} alertas. Notificações enviadas: ${notificationsSent}, Erros: ${errorCount}`;

    // Registrar resultado do job
    if (jobId) {
      await supabase.from('automation_logs').insert({
        job_id: jobId,
        status: errorCount === 0 ? 'success' : 'partial_success',
        message,
        details: { 
          processed: alerts.length,
          notifications_sent: notificationsSent,
          errors: errorCount,
          error_details: errors.slice(0, 5)
        },
        duration_ms: duration
      });

      if (errorCount > 0) {
        await supabase
          .from('automation_jobs')
          .update({ 
            error_count: supabase.rpc('increment', { x: errorCount }),
            last_error: errors[0] || 'Erros múltiplos'
          })
          .eq('id', jobId);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message,
      processed: alerts.length,
      notifications_sent: notificationsSent,
      errors: errorCount
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error('Erro nos alertas de usuários:', error);
    
    const duration = Date.now() - startTime;
    const errorMessage = error.message;

    if (jobId) {
      await supabase.from('automation_logs').insert({
        job_id: jobId,
        status: 'error',
        message: errorMessage,
        duration_ms: duration
      });

      await supabase
        .from('automation_jobs')
        .update({ 
          error_count: supabase.rpc('increment', { x: 1 }),
          last_error: errorMessage
        })
        .eq('id', jobId);
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
