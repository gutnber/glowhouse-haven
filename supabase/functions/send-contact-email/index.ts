
// Follow Deno API reference: https://deno.land/api@v1.35.0?s=Deno.Kv
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client with the service role key
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const NOTIFICATION_EMAIL = 'help@ignishomes.com';

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the request body
    const payload = await req.json();
    const record = payload.record;

    console.log('Received contact submission', record);

    if (!record || !record.email || !record.name) {
      console.error('Invalid contact submission data', record);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid contact submission data' 
        }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    }

    // Format message
    const contactMessage = {
      from: 'Notifications <notifications@ignishomes.com>',
      to: NOTIFICATION_EMAIL,
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

    console.log('Sending email to:', NOTIFICATION_EMAIL);

    // Send email using Resend
    if (RESEND_API_KEY) {
      try {
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
          throw new Error(`Resend API error: ${result.message || response.statusText}`);
        }

        // Update the contact submission status
        const { error: updateError } = await supabase
          .from('contact_submissions')
          .update({ status: 'notified' })
          .eq('id', record.id);

        if (updateError) {
          console.error('Error updating contact submission status:', updateError);
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Email sent successfully' }),
          { 
            status: 200, 
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            } 
          }
        );
      } catch (error) {
        console.error('Error sending email:', error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: error.message || 'Error sending email' 
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
    } else {
      console.warn('RESEND_API_KEY not configured. Email not sent.');
      return new Response(
        JSON.stringify({ 
          success: false, 
          warning: 'Email service not configured' 
        }),
        { 
          status: 200,  // Still return 200 as the form submission itself was successful
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    }
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
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
