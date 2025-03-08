
// This file contains setup code for Supabase features
import { supabase } from "./client";

// Run this on application initialization to ensure the realtime subscriptions work
export async function setupRealtimeSubscriptions() {
  // Enable realtime for specific tables
  const { error } = await supabase.rpc('supabase_functions.enable_realtime', {
    table_name: 'footer_settings'
  });
  
  if (error) {
    console.error('Error enabling realtime for footer_settings:', error);
  } else {
    console.log('Realtime enabled for footer_settings table');
  }
}
