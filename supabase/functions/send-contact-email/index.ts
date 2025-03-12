
// Follow Deno API reference: https://deno.land/api@v1.35.0?s=Deno.Kv
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleRequest } from "./handlers.ts";
import { corsHeaders } from "./constants.ts";

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    return await handleRequest(req);
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error',
        message: 'Email sending failed, but submission has been saved for retry' 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  }
});
