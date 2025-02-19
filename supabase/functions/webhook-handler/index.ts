
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the request body
    const payload = await req.json()
    console.log('Received webhook payload:', payload)

    // Store the webhook event in the database
    const { data, error } = await supabase
      .from('webhook_events')
      .insert({
        source: 'zapier',
        event_type: payload.event_type || 'webhook',
        payload: payload
      })
      .select()
      .single()

    if (error) {
      console.error('Error storing webhook event:', error)
      throw error
    }

    console.log('Successfully stored webhook event:', data)

    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: 'Webhook received and processed', data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
