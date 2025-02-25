
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const { phone } = await req.json()
    
    // Use OpenAI to analyze the phone number
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in identifying phone number area codes for Mexico and USA. Analyze the provided phone number and identify its area code and country. Return only the area code and country name if found, or null if not recognized.'
          },
          {
            role: 'user',
            content: `Analyze this phone number and identify its area code and country (Mexico or USA): ${phone}`
          }
        ],
      }),
    })

    const data = await response.json()
    const analysis = data.choices[0].message.content

    // Extract area code and country from the AI response
    let areaCode = null
    let country = null

    // Simple parsing of the AI response
    if (analysis.toLowerCase().includes('mexico')) {
      country = 'Mexico'
      const match = analysis.match(/\b\d{2,3}\b/)
      if (match) areaCode = match[0]
    } else if (analysis.toLowerCase().includes('usa') || analysis.toLowerCase().includes('united states')) {
      country = 'USA'
      const match = analysis.match(/\b\d{3}\b/)
      if (match) areaCode = match[0]
    }

    console.log('Phone analysis:', { phone, areaCode, country, analysis })

    return new Response(
      JSON.stringify({ areaCode, country }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in detect-area-code function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
