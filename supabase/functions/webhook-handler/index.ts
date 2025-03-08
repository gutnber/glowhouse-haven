
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

    // Get the webhook type from URL parameters
    const url = new URL(req.url)
    const type = url.searchParams.get('type')

    // Get the request body
    const payload = await req.json()
    console.log('Received webhook payload:', { type, payload })

    // Store the webhook event
    const { data: eventData, error: eventError } = await supabase
      .from('webhook_events')
      .insert({
        source: 'zapier',
        event_type: type || 'webhook',
        payload: payload
      })
      .select()
      .single()

    if (eventError) {
      console.error('Error storing webhook event:', eventError)
      throw eventError
    }

    // Process the webhook based on type
    if (type === 'property') {
      // Calculate price_per_sqm if area is provided
      let price_per_sqm = null;
      if (payload.price && payload.area && payload.area > 0) {
        price_per_sqm = payload.price / payload.area;
      }
      
      const { error: propertyError } = await supabase
        .from('properties')
        .insert({
          title: payload.title,
          description: payload.description,
          price: payload.price,
          location: payload.location,
          images: payload.images || [],
          features: payload.features || [],
          property_type: payload.property_type || 'other',
          status: payload.status || 'available',
          area: payload.area || null,
          price_per_sqm: price_per_sqm,
          currency: payload.currency || 'USD',
          created_at: new Date().toISOString(),
        })

      if (propertyError) throw propertyError
    } else if (type === 'news') {
      const { error: newsError } = await supabase
        .from('news_posts')
        .insert({
          title: payload.title,
          content: payload.content,
          feature_image_url: payload.feature_image_url,
          created_at: new Date().toISOString(),
        })

      if (newsError) throw newsError
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: `${type || 'webhook'} received and processed`,
        data: eventData
      }),
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
