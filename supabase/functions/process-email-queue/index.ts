
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // This function is intended to be called on a schedule or via webhook
  // It processes pending emails in the queue
  
  try {
    // Get pending email notifications
    const { data: pendingEmails, error: queryError } = await supabase
      .from("email_notifications")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(10);
    
    if (queryError) throw queryError;
    
    if (!pendingEmails || pendingEmails.length === 0) {
      return new Response(
        JSON.stringify({ message: "No pending emails to process" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Processing ${pendingEmails.length} emails`);
    
    const results = await Promise.all(
      pendingEmails.map(async (email) => {
        try {
          // Call the send-contact-email function for each email
          const response = await fetch(
            `${supabaseUrl}/functions/v1/send-contact-email`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${supabaseServiceKey}`,
              },
              body: JSON.stringify({ record: email.payload }),
            }
          );
          
          const result = await response.json();
          
          if (!response.ok) throw new Error(result.error || "Failed to send email");
          
          // Update the email status to sent
          const { error: updateError } = await supabase
            .from("email_notifications")
            .update({ 
              status: "sent", 
              processed_at: new Date().toISOString() 
            })
            .eq("id", email.id);
          
          if (updateError) throw updateError;
          
          return { id: email.id, status: "sent", success: true };
        } catch (error) {
          console.error(`Error processing email ${email.id}:`, error.message);
          
          // Mark as failed
          await supabase
            .from("email_notifications")
            .update({ 
              status: "failed", 
              processed_at: new Date().toISOString() 
            })
            .eq("id", email.id);
            
          return { id: email.id, status: "failed", error: error.message, success: false };
        }
      })
    );
    
    return new Response(
      JSON.stringify({ 
        processed: results.length,
        successes: results.filter(r => r.success).length,
        failures: results.filter(r => !r.success).length,
        results 
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing email queue:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
