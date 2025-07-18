
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { property } = await req.json()
    console.log('Processing property for EasyBroker sync:', property)

    // Validate required fields
    if (!property.name || !property.price || !property.address) {
      throw new Error('Missing required fields: name, price, or address')
    }

    // Map property types from our system to EasyBroker types
    const propertyTypeMapping: Record<string, string> = {
      'singleFamily': 'House',
      'apartment': 'Apartment',
      'condo': 'Apartment',
      'townhouse': 'House',
      'vacantLand': 'Land',
      'commercial': 'Commercial',
      'other': 'House'
    }

    // Map operation modes to EasyBroker operation types
    const operationTypeMapping: Record<string, string> = {
      'sale': 'sale',
      'rent': 'rental',
      'lease': 'rental'
    }

    // Prepare the operations array (required field)
    const operations = [{
      type: operationTypeMapping[property.mode] || 'sale',
      amount: property.price,
      currency: property.currency || 'USD'
    }]

    // Prepare EasyBroker payload with all required fields
    const easyBrokerPayload: any = {
      title: property.name,
      description: property.description || `${property.name} - ${property.address}`,
      property_type: propertyTypeMapping[property.property_type] || 'House',
      status: 'published',
      operations: operations,
      location: {
        name: property.address
      },
      show_prices: true,
      internal_id: `inma-${property.id}`
    }

    // Add optional fields only if they have valid values
    if (property.bedrooms && property.bedrooms > 0) {
      easyBrokerPayload.bedrooms = property.bedrooms
    }
    
    if (property.bathrooms && property.bathrooms > 0) {
      easyBrokerPayload.bathrooms = property.bathrooms
    }
    
    if (property.area && property.area > 0) {
      easyBrokerPayload.construction_size = property.area
    }
    
    if (property.width && property.height && property.width > 0 && property.height > 0) {
      easyBrokerPayload.lot_size = property.width * property.height
    }

    if (property.build_year) {
      easyBrokerPayload.age = property.build_year
    }

    console.log('EasyBroker payload:', JSON.stringify(easyBrokerPayload, null, 2))

    // Send to EasyBroker API
    const easyBrokerResponse = await fetch('https://api.easybroker.com/v1/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': '7crcshl2fnvcjx27e3s0ekcbzmtj34'
      },
      body: JSON.stringify(easyBrokerPayload)
    })

    const responseData = await easyBrokerResponse.json()
    
    if (!easyBrokerResponse.ok) {
      console.error('EasyBroker API error:', responseData)
      throw new Error(`EasyBroker API error: ${responseData.message || responseData.error || 'Unknown error'}`)
    }

    console.log('EasyBroker sync successful:', responseData)

    // Log the sync result
    const { error: logError } = await supabase
      .from('easybroker_sync_log')
      .insert({
        property_id: property.id,
        easybroker_id: responseData.public_id || responseData.id,
        status: 'success',
        request_payload: easyBrokerPayload,
        response_payload: responseData,
        synced_at: new Date().toISOString()
      })

    if (logError) {
      console.error('Error logging sync result:', logError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Property successfully synced to EasyBroker',
        easybroker_id: responseData.public_id || responseData.id,
        public_url: responseData.public_url,
        data: responseData
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error syncing to EasyBroker:', error)

    // Log the error
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const { property } = await req.json().catch(() => ({}))
      
      await supabase
        .from('easybroker_sync_log')
        .insert({
          property_id: property?.id || null,
          status: 'error',
          error_message: error.message,
          synced_at: new Date().toISOString()
        })
    } catch (logError) {
      console.error('Error logging sync error:', logError)
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
