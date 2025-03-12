
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const ADMIN_EMAIL = 'silvia@inma.mx'; // Use admin email for notifications

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  // This function is intended to be called on a schedule or via webhook
  // It processes pending emails in the queue
  
  try {
    console.log("Starting email queue processing");
    
    // Get pending email notifications
    const { data: pendingEmails, error: queryError } = await supabase
      .from("email_notifications")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(10);
    
    if (queryError) {
      console.error("Error querying email_notifications:", queryError);
      throw queryError;
    }
    
    if (!pendingEmails || pendingEmails.length === 0) {
      console.log("No pending emails to process");
      return new Response(
        JSON.stringify({ message: "No pending emails to process" }),
        { 
          status: 200, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    }
    
    console.log(`Processing ${pendingEmails.length} emails`);
    
    const results = await Promise.all(
      pendingEmails.map(async (email) => {
        try {
          console.log(`Processing email ID: ${email.id}, type: ${email.email_type}`);
          
          if (email.email_type === 'contact_form' && RESEND_API_KEY) {
            const record = email.payload.record;
            
            if (!record) {
              throw new Error('Invalid record in payload');
            }
            
            // Format message for admin notification
            const contactMessage = {
              from: 'INMA Contact Form <notifications@resend.dev>',
              to: ADMIN_EMAIL,
              subject: `New Contact Form Submission - ${record.name}`,
              html: `
                <h1>New Contact Form Submission</h1>
                <p><strong>Name:</strong> ${record.name}</p>
                <p><strong>Email:</strong> ${record.email}</p>
                <p><strong>Phone:</strong> ${record.phone || 'Not provided'}</p>
                <p><strong>Message:</strong></p>
                <p>${record.message}</p>
                <p><strong>Submitted at:</strong> ${new Date(record.created_at).toLocaleString()}</p>
              `,
            };

            console.log('Retrying email via Resend to', ADMIN_EMAIL);
            
            // Send email using Resend
            const response = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
              },
              body: JSON.stringify(contactMessage),
            });

            const result = await response.json();
            console.log('Email send result:', result);

            if (!response.ok) {
              throw new Error(`Resend API error: ${result.message || result.error || response.statusText}`);
            }
            
            // Update the contact submission status if it exists
            if (record.id) {
              const { error: updateError } = await supabase
                .from('contact_submissions')
                .update({ status: 'notified' })
                .eq('id', record.id);

              if (updateError) {
                console.error(`Error updating contact submission status for ${record.id}:`, updateError);
              }
            }
          } else {
            throw new Error(`Unsupported email type: ${email.email_type}`);
          }
          
          // Mark email as sent
          const { error: updateError } = await supabase
            .from("email_notifications")
            .update({ 
              status: "sent", 
              processed_at: new Date().toISOString(),
              retry_count: (email.retry_count || 0) + 1
            })
            .eq("id", email.id);
          
          if (updateError) {
            console.error(`Error updating email status for ${email.id}:`, updateError);
            throw updateError;
          }
          
          console.log(`Successfully processed email ${email.id}`);
          return { id: email.id, status: "sent", success: true };
        } catch (error) {
          console.error(`Error processing email ${email.id}:`, error.message);
          
          // Increment retry count
          const newRetryCount = (email.retry_count || 0) + 1;
          const maxRetries = 3;
          
          // Mark as failed if max retries reached
          const newStatus = newRetryCount >= maxRetries ? "failed" : "pending";
          
          await supabase
            .from("email_notifications")
            .update({ 
              status: newStatus, 
              processed_at: new Date().toISOString(),
              retry_count: newRetryCount,
              error_message: error.message
            })
            .eq("id", email.id);
            
          return { id: email.id, status: newStatus, error: error.message, success: false };
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
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error("Error processing email queue:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  }
});
