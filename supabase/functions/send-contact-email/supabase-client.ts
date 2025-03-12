
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Create a Supabase client with the service role key
export const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);
