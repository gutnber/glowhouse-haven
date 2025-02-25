
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.1.0'

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
    // Get request body
    const { phone } = await req.json()

    if (!phone) {
      throw new Error('Phone number is required')
    }

    console.log('Processing phone number:', phone)

    // Call Deepseek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{
          role: "user",
          content: `Given this phone number: ${phone}, please identify the area code and country. Return ONLY a JSON object with "areaCode" and "country" properties. For example: {"areaCode": "123", "country": "USA"}`
        }],
        temperature: 0
      })
    })

    const data = await response.json()
    console.log('Deepseek API Response:', data)

    // Validate API response
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('Invalid API response structure:', data)
      throw new Error('Invalid API response from Deepseek')
    }

    try {
      // Parse the response to get the actual content
      const result = JSON.parse(data.choices[0].message.content)
      
      // Validate result structure
      if (!result.areaCode || !result.country) {
        console.error('Invalid parsed result structure:', result)
        throw new Error('Invalid response format from AI')
      }
      
      console.log('Successfully parsed result:', result)

      // Return the result
      return new Response(
        JSON.stringify(result),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      )
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      console.error('Raw content:', data.choices[0].message.content)
      throw new Error('Failed to parse AI response')
    }

  } catch (error) {
    console.error('Error in edge function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred processing the phone number',
        details: error.toString()
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
