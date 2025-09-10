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

const perplexityApiKey = Deno.env.get("PERPLEXITY_API_KEY");

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();
    console.log('Iniciando análise de concorrentes...');

    if (!perplexityApiKey) {
      throw new Error('Perplexity API key não configurada');
    }

    // Lista de concorrentes para monitorar
    const competitors = [
      { name: 'Buscapé', website: 'buscape.com.br' },
      { name: 'Zoom', website: 'zoom.com.br' },
      { name: 'Pelando', website: 'pelando.com.br' },
      { name: 'Promobit', website: 'promobit.com.br' }
    ];

    const analyses = [];

    for (const competitor of competitors) {
      try {
        console.log(`Analisando ${competitor.name}...`);

        const prompt = `
        Faça uma análise competitiva do site ${competitor.website} focando em:
        
        1. Principais funcionalidades oferecidas
        2. Categorias de produtos mais populares
        3. Estratégias de marketing e promoções
        4. Interface e experiência do usuário
        5. Pontos fortes e fracos
        
        Forneça insights específicos para um comparador de preços brasileiro.
        Seja conciso e objetivo, máximo 500 palavras.
        `;

        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${perplexityApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-large-128k-online',
            messages: [
              {
                role: 'system',
                content: 'Você é um especialista em análise competitiva de e-commerce e comparadores de preço no Brasil.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.2,
            max_tokens: 1000
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const analysis = data.choices[0]?.message?.content;
          
          analyses.push({
            competitor: competitor.name,
            website: competitor.website,
            analysis: analysis,
            analyzed_at: new Date().toISOString()
          });
        }

        // Delay para respeitar rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`Erro analisando ${competitor.name}:`, error);
        analyses.push({
          competitor: competitor.name,
          website: competitor.website,
          analysis: `Erro na análise: ${error.message}`,
          analyzed_at: new Date().toISOString(),
          error: true
        });
      }
    }

    // Gerar relatório consolidado
    const consolidatedReport = await generateConsolidatedReport(analyses);

    // Salvar análise no banco
    const { error: saveError } = await supabase
      .from('system_settings')
      .upsert({
        key: 'competitor_analysis',
        value: {
          analyses: analyses,
          consolidated_report: consolidatedReport,
          generated_at: new Date().toISOString(),
          competitors_analyzed: competitors.length
        },
        description: 'Análise competitiva automatizada',
        is_public: false
      });

    if (saveError) {
      console.error('Erro ao salvar análise:', saveError);
    }

    // Enviar relatório por email para admins
    await sendCompetitorReport(consolidatedReport);

    const duration = Date.now() - startTime;

    // Log da execução
    await supabase
      .from('automation_logs')
      .insert({
        job_id: null,
        status: 'success',
        message: 'Análise de concorrentes concluída',
        details: {
          competitors_analyzed: competitors.length,
          successful_analyses: analyses.filter(a => !a.error).length,
          failed_analyses: analyses.filter(a => a.error).length
        },
        duration_ms: duration
      });

    return new Response(JSON.stringify({
      success: true,
      message: 'Análise de concorrentes concluída',
      competitors_analyzed: competitors.length,
      report_generated: !!consolidatedReport,
      duration_ms: duration
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error('Erro na análise de concorrentes:', error);
    
    await supabase
      .from('automation_logs')
      .insert({
        job_id: null,
        status: 'error',
        message: `Erro na análise de concorrentes: ${error.message}`,
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

async function generateConsolidatedReport(analyses: any[]) {
  if (!perplexityApiKey || analyses.length === 0) return null;

  try {
    const successfulAnalyses = analyses.filter(a => !a.error);
    if (successfulAnalyses.length === 0) return null;

    const prompt = `
    Com base nas seguintes análises de concorrentes no mercado brasileiro de comparadores de preço:
    
    ${successfulAnalyses.map(a => `
    ${a.competitor} (${a.website}):
    ${a.analysis}
    `).join('\n\n')}
    
    Gere um relatório executivo consolidado com:
    1. Principais tendências do mercado
    2. Oportunidades identificadas
    3. Ameaças competitivas
    4. Recomendações estratégicas para 7hy-shop
    5. Funcionalidades que devemos considerar implementar
    
    Seja estratégico e focado em ações práticas.
    `;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'Você é um consultor estratégico especializado em e-commerce e comparadores de preço.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices[0]?.message?.content;
    }
  } catch (error) {
    console.error('Erro gerando relatório consolidado:', error);
  }
  
  return null;
}

async function sendCompetitorReport(report: string) {
  if (!report) return;

  try {
    // Buscar admins para envio do relatório
    const { data: admins, error: adminError } = await supabase
      .from('users')
      .select('email')
      .eq('is_admin', true);

    if (adminError || !admins || admins.length === 0) {
      console.log('Nenhum admin encontrado para envio do relatório');
      return;
    }

    for (const admin of admins) {
      await supabase
        .from('email_queue')
        .insert({
          to_email: admin.email,
          subject: '📊 Relatório Semanal de Análise Competitiva - 7hy-shop',
          html_content: `
            <h2>Relatório de Análise Competitiva</h2>
            <p>Análise automática dos principais concorrentes realizada em ${new Date().toLocaleString('pt-BR')}.</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              ${report.replace(/\n/g, '<br>')}
            </div>
            
            <p><small>Este relatório foi gerado automaticamente pelo sistema de automação do 7hy-shop.</small></p>
          `,
          template_name: 'competitor_analysis',
          template_data: { report: report }
        });
    }
  } catch (error) {
    console.error('Erro enviando relatório por email:', error);
  }
}

serve(handler);