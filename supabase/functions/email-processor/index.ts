
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
      .eq('job_name', 'email-processor')
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

    const batchSize = job?.config?.batch_size || 20;

    // Buscar emails pendentes na fila
    const { data: emails, error: emailsError } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'pending')
      .lt('attempts', 3) // Máximo 3 tentativas
      .lte('scheduled_for', new Date().toISOString())
      .order('created_at', { ascending: true })
      .limit(batchSize);

    if (emailsError) {
      throw new Error(`Erro ao buscar emails: ${emailsError.message}`);
    }

    if (!emails || emails.length === 0) {
      const message = "Nenhum email pendente na fila";
      
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

    let sentCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Processar cada email
    for (const email of emails) {
      try {
        // Marcar como sendo processado
        await supabase
          .from('email_queue')
          .update({ 
            attempts: email.attempts + 1
          })
          .eq('id', email.id);

        // Simular envio de email usando console.log por enquanto
        // Em produção, aqui usaria Resend, SendGrid, ou Supabase Auth Email
        console.log(`
=== EMAIL ENVIADO ===
Para: ${email.to_email}
Assunto: ${email.subject}
Template: ${email.template_name || 'custom'}
========================
        `);

        // Para fins de demonstração, vou simular sucesso na maioria dos casos
        const shouldSucceed = Math.random() > 0.1; // 90% de sucesso

        if (shouldSucceed) {
          // Marcar como enviado
          await supabase
            .from('email_queue')
            .update({ 
              status: 'sent',
              sent_at: new Date().toISOString()
            })
            .eq('id', email.id);

          sentCount++;
        } else {
          // Simular erro
          const errorMsg = 'Erro simulado no envio';
          
          if (email.attempts >= 2) { // Máximo de tentativas atingido
            await supabase
              .from('email_queue')
              .update({ 
                status: 'failed',
                error_message: errorMsg
              })
              .eq('id', email.id);
          } else {
            await supabase
              .from('email_queue')
              .update({ 
                error_message: errorMsg,
                scheduled_for: new Date(Date.now() + 300000).toISOString() // Reagendar para 5 minutos
              })
              .eq('id', email.id);
          }

          errorCount++;
          errors.push(`${email.to_email}: ${errorMsg}`);
        }

      } catch (error) {
        errorCount++;
        errors.push(`${email.to_email}: ${error.message}`);
        
        // Marcar erro no banco
        await supabase
          .from('email_queue')
          .update({ 
            error_message: error.message,
            scheduled_for: email.attempts >= 2 
              ? null 
              : new Date(Date.now() + 300000).toISOString() // Reagendar para 5 minutos se não excedeu tentativas
          })
          .eq('id', email.id);

        console.error(`Erro ao processar email ${email.id}:`, error);
      }
    }

    const duration = Date.now() - startTime;
    const message = `Processados ${emails.length} emails. Enviados: ${sentCount}, Erros: ${errorCount}`;

    // Registrar resultado do job
    if (jobId) {
      await supabase.from('automation_logs').insert({
        job_id: jobId,
        status: errorCount === 0 ? 'success' : 'partial_success',
        message,
        details: { 
          processed: emails.length,
          sent: sentCount,
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
      processed: emails.length,
      sent: sentCount,
      errors: errorCount
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error('Erro no processamento de emails:', error);
    
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
