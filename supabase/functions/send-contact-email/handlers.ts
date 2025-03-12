
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

    // For admin email (normal contact form)
    if (!isChatTranscript) {
      const adminEmailPayload = getAdminEmailTemplate({ ...record, adminEmail: ADMIN_EMAIL });
      const { error: sendError } = await sendEmail(adminEmailPayload);
      
      if (sendError) {
        console.error('Error sending admin email:', sendError);
      }
    }

    // For user transcript email (only for chat transcripts)
    if (isChatTranscript) {
      // Determine language from transcript
      const isSpanish = detectLanguage(record.message);
      
      // Create and send transcript email
      const transcriptEmailPayload = getUserTranscriptTemplate(record, isSpanish);
      const { error: transcriptError } = await sendEmail(transcriptEmailPayload);
      
      if (transcriptError) {
        console.error('Error sending transcript email:', transcriptError);
        throw transcriptError;
      }
    }

    // Update submission status
    await updateSubmissionStatus(record.id, 'notified');

    return new Response(
      JSON.stringify({ success: true, message: 'Email process completed successfully' }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error('Error in handler:', error);
    
    // Create retry entry
    try {
      const payload = await req.json();
      if (payload.record) {
        await createRetryEntry(payload.record, error.message);
      }
    } catch (dbError) {
      console.error('Error creating retry entry:', dbError);
    }
    
    throw error; // Re-throw to be caught by the main error handler
  }
}
