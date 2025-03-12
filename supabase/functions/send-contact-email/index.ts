
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
const ADMIN_EMAIL = 'henrygutierrezbaja@gmail.com'; // Primary admin email for notifications

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the request body
    const payload = await req.json();
    const record = payload.record;
    const isChatTranscript = record.message && record.message.includes('--- Chat Transcript ---');

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

    // Format message for admin notification
    const contactMessage = {
      from: 'INMA Real Estate <onboarding@resend.dev>',
      to: [ADMIN_EMAIL],
      subject: isChatTranscript 
        ? `Chat Transcript from ${record.name}` 
        : `New Contact Form Submission - ${record.name}`,
      html: `
        <h1>${isChatTranscript ? 'New Chat Transcript' : 'New Contact Form Submission'}</h1>
        <p><strong>Name:</strong> ${record.name}</p>
        <p><strong>Email:</strong> ${record.email}</p>
        <p><strong>Phone:</strong> ${record.phone || 'Not provided'}</p>
        <p><strong>${isChatTranscript ? 'Transcript' : 'Message'}:</strong></p>
        <pre style="white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${record.message}</pre>
        <p><strong>Submitted at:</strong> ${new Date(record.created_at).toLocaleString()}</p>
      `,
    };

    console.log('Sending email via Resend to', ADMIN_EMAIL);

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
          throw new Error(`Resend API error: ${result.message || result.error || response.statusText}`);
        }

        // Also send an auto-reply to the submitter
        const autoReplyMessage = {
          from: 'INMA Real Estate <onboarding@resend.dev>',
          to: [record.email],
          subject: isChatTranscript 
            ? 'Your Chat Transcript from INMA' 
            : 'Thank you for contacting INMA',
          html: isChatTranscript
            ? `
              <h1>Your Chat Transcript</h1>
              <p>Dear ${record.name},</p>
              <p>Thank you for chatting with our assistant. Here is a copy of your conversation:</p>
              <pre style="white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${record.message}</pre>
              <p>If you have any further questions, please don't hesitate to contact us.</p>
              <p>Best regards,</p>
              <p>The INMA Team</p>
            `
            : `
              <h1>Thank you for contacting us!</h1>
              <p>Dear ${record.name},</p>
              <p>We have received your message and will get back to you as soon as possible.</p>
              <p>Best regards,</p>
              <p>The INMA Team</p>
            `,
        };

        // Send auto-reply
        const autoReplyResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify(autoReplyMessage),
        });

        const autoReplyResult = await autoReplyResponse.json();
        console.log('Auto-reply email result:', autoReplyResult);

        // Update the contact submission status
        const { error: updateError } = await supabase
          .from('contact_submissions')
          .update({ status: 'notified' })
          .eq('id', record.id);

        if (updateError) {
          console.error('Error updating contact submission status:', updateError);
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Emails sent successfully' }),
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
        
        // Create an entry in the email_notifications table for retry
        try {
          const { error: insertError } = await supabase
            .from('email_notifications')
            .insert({
              email_type: isChatTranscript ? 'chat_transcript' : 'contact_form',
              recipient: record.email,
              status: 'pending',
              payload: { record },
              error_message: error.message || 'Error sending email'
            });
            
          if (insertError) {
            console.error('Error creating email notification entry:', insertError);
          } else {
            console.log('Created email notification entry for retry');
          }
        } catch (dbError) {
          console.error('Error creating retry entry:', dbError);
        }
        
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: error.message || 'Error sending email',
            message: 'Email sending failed, but submission has been saved' 
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
