
import { corsHeaders, ADMIN_EMAIL } from "./constants.ts";
import { supabase } from "./supabase-client.ts";
import { getAdminEmailTemplate, getUserTranscriptTemplate } from "./email-templates.ts";
import { sendEmail, updateSubmissionStatus, createRetryEntry } from "./email-service.ts";
import { detectLanguage } from "./language-detector.ts";

export async function handleRequest(req: Request) {
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

    // For user transcript email (only for chat transcripts)
    if (isChatTranscript) {
      console.log('Processing chat transcript email');
      
      // Determine language from transcript
      const isSpanish = detectLanguage(record.message);
      
      // Create and send transcript email
      const transcriptEmailPayload = getUserTranscriptTemplate(record, isSpanish);
      console.log('Sending transcript email to:', record.email);
      
      const { error: transcriptError, result, redirected } = await sendEmail(transcriptEmailPayload);
      
      if (transcriptError) {
        console.error('Error sending transcript email:', transcriptError);
        throw transcriptError;
      }
      
      console.log('Transcript email sent successfully:', result);
      
      // If email was redirected to admin due to test domain restrictions,
      // let the client know about this for informative purposes
      const responseMessage = redirected 
        ? 'Email sent successfully but redirected to admin (Resend test domain restriction)' 
        : 'Email process completed successfully';
      
      // Update submission status
      await updateSubmissionStatus(record.id, 'notified');
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: responseMessage,
          redirected
        }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    }
    // For admin email (normal contact form)
    else {
      console.log('Processing regular contact form email');
      const adminEmailPayload = getAdminEmailTemplate({ ...record, adminEmail: ADMIN_EMAIL });
      const { error: sendError, redirected } = await sendEmail(adminEmailPayload);
      
      if (sendError) {
        console.error('Error sending admin email:', sendError);
        throw sendError;
      }
      
      // Update submission status
      await updateSubmissionStatus(record.id, 'notified');
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email process completed successfully',
          redirected 
        }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    }
  } catch (error) {
    console.error('Error in handler:', error);
    
    // Create retry entry
    try {
      const payload = await req.json();
      if (payload.record) {
        await createRetryEntry(payload.record, error.message);
        console.log('Created retry entry for failed email');
      }
    } catch (dbError) {
      console.error('Error creating retry entry:', dbError);
    }
    
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
}
