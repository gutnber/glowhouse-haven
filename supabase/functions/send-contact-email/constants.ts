
// Export shared constants
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
export const ADMIN_EMAIL = 'henrygutierrezbaja@gmail.com'; // Primary admin email for notifications

// Spanish language indicators to detect language in transcripts
export const spanishIndicators = [
  'hola', 'gracias', 'buenos días', 'buenas tardes', 'buenas noches', 
  'por favor', 'cómo estás', 'qué tal', 'adiós', 'hasta luego',
  'propiedad', 'inmobiliaria', 'precio', 'venta', 'alquiler'
];
