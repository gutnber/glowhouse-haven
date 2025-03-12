
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY") || "sk-b266b9a9f1d143acb5bac4eef1e1be12";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  messages: Array<{role: string, content: string}>;
  propertyData?: any;
  currentProperty?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, propertyData, currentProperty } = await req.json() as ChatRequest;
    
    console.log("Request received:", { messagesCount: messages.length, hasPropertyData: !!propertyData, currentProperty });

    // Create system message with property context if available
    let systemMessage = "Eres un asistente inmobiliario especializado en propiedades en Baja California, México. Responde en el mismo idioma que el usuario (español o inglés). Proporciona información precisa y útil sobre propiedades, el mercado inmobiliario de la región, y el proceso de compra/venta en México.";
    
    if (propertyData) {
      systemMessage += " Tienes información sobre las siguientes propiedades: " + 
        JSON.stringify(propertyData, null, 2);
    }
    
    if (currentProperty) {
      systemMessage += " El usuario está actualmente viendo la propiedad con ID: " + currentProperty;
    }

    // Add system message to the beginning
    const fullMessages = [
      { role: "system", content: systemMessage },
      ...messages
    ];
    
    console.log("Sending to DeepSeek API with system message");

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat", // Ensuring this is set to deepseek-chat
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    console.log("Response received from DeepSeek", { status: response.status });
    
    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in real-estate-assistant function:", error);
    return new Response(
      JSON.stringify({ 
        choices: [{ 
          message: { 
            content: "I'm sorry, I encountered an error. Please try again or contact our support team." 
          } 
        }] 
      }),
      {
        status: 200, // Return 200 with error message to prevent UI breaking
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
