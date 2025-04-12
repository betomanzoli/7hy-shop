
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      'https://yzhidpsmzabrxnkucfpt.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6aGlkcHNtemFicnhua3VjZnB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNTgyNTUsImV4cCI6MjA1OTYzNDI1NX0._OQayDjF3iFrEyYfAbKrfnNkJXPOyhzxAfGseL_38DQ'
    )

    const requestData = await req.json()
    const { marketplaceId, productId, userId, referrer, platformType, originalUrl } = requestData

    // Store the click in the database
    const { data, error } = await supabaseClient
      .from('affiliate_clicks')
      .insert([
        {
          marketplace_id: marketplaceId,
          product_id: productId,
          user_id: userId || null,
          referrer: referrer || null,
          platform_type: platformType,
          original_url: originalUrl,
          clicked_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error tracking affiliate click:', error)

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      }
    )
  }
})
