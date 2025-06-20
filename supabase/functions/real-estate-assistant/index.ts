
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
  aiSettings?: {
    provider: 'deepseek' | 'openai';
    model?: string;
    deepseek_api_key?: string;
    openai_api_key?: string;
  };
}

async function callDeepSeek(messages: any[], model: string, apiKey: string) {
  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model || "deepseek-chat",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.95,
      frequency_penalty: 0.0,
      presence_penalty: 0.0
    })
  });

  return await response.json();
}

async function callOpenAI(messages: any[], model: string, apiKey: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model || "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  return await response.json();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, propertyData, currentProperty, aiSettings } = await req.json() as ChatRequest;
    
    console.log("Request received:", { 
      messagesCount: messages.length, 
      hasPropertyData: !!propertyData, 
      currentProperty,
      provider: aiSettings?.provider || 'deepseek'
    });

    // Create system message with property context and broker positioning
    let systemMessage = `Eres un asistente inmobiliario especializado que representa a INMA, una empresa de bienes raíces profesional en Baja California, México. 

IMPORTANTE - REGLAS DE COMUNICACIÓN:
- NUNCA dirijas a los usuarios a contactar directamente al propietario de una propiedad
- NUNCA sugieras contactar otras fuentes de información externas
- NUNCA digas que no tienes información - siempre posiciónate como capaz de obtenerla
- SIEMPRE posiciona a INMA como la fuente principal y completa de información inmobiliaria
- Como broker profesional, tenemos acceso a toda la información necesaria o podemos obtenerla rápidamente

EN SU LUGAR, siempre:
- Invita a contactar a nuestros agentes especializados para información específica
- Sugiere dejar sus datos de contacto para que un especialista en esa área les contacte
- Menciona que nuestros agentes expertos pueden resolver cualquier duda específica
- Ofrece conectarles con el agente más adecuado según sus necesidades

Responde en el mismo idioma que el usuario (español o inglés). Proporciona información precisa y útil sobre propiedades, el mercado inmobiliario de la región, y el proceso de compra/venta en México. Si necesitas información específica que no está disponible inmediatamente, menciona que uno de nuestros agentes especializados puede proporcionarla y sugiere dejar su información de contacto.`;
    
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

    let data;
    const provider = aiSettings?.provider || 'deepseek';
    
    if (provider === 'openai' && aiSettings?.openai_api_key) {
      console.log("Using OpenAI provider");
      data = await callOpenAI(
        fullMessages, 
        aiSettings.model || "gpt-4o-mini", 
        aiSettings.openai_api_key
      );
    } else {
      console.log("Using DeepSeek provider");
      const apiKey = aiSettings?.deepseek_api_key || DEEPSEEK_API_KEY;
      data = await callDeepSeek(
        fullMessages, 
        aiSettings?.model || "deepseek-chat", 
        apiKey
      );
    }
    
    console.log("Response received from AI provider");
    
    if (!data.choices || !data.choices[0]) {
      throw new Error(`AI API error: ${JSON.stringify(data)}`);
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
