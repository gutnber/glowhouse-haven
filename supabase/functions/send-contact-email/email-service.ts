
import { RESEND_API_KEY, ADMIN_EMAIL } from "./constants.ts";
import { supabase } from "./supabase-client.ts";

// Function to send email using Resend
export async function sendEmail(emailPayload: any) {
  if (!RESEND_API_KEY) {
    console.error('No Resend API key found');
    return { error: 'No Resend API key configured' };
  }

  try {
    // Since we're now using a verified domain (info@inma.mx), 
    // we can send directly to recipients without redirecting
    console.log('Sending email via Resend API with payload:', {
      to: emailPayload.to,
      subject: emailPayload.subject,
      from: emailPayload.from
    });
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Resend API error response:', result);
      throw new Error(`Resend API error: ${result.message || result.error || response.statusText}`);
    }

    console.log('Email sent successfully:', result);
    
    // Return success
    return { 
      success: true, 
      result
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return { error };
  }
}

// Update submission status in the database
export async function updateSubmissionStatus(recordId: string, status: string) {
  if (!recordId) return { error: 'No record ID provided' };

  const { error } = await supabase
    .from('contact_submissions')
    .update({ status })
    .eq('id', recordId);

  if (error) {
    console.error('Error updating contact submission status:', error);
    return { error };
  }

  return { success: true };
}

// Create entry for retry in case of failure
export async function createRetryEntry(record: any, errorMessage: string) {
  if (!record) return { error: 'No record provided for retry' };

  const isTranscript = record.message && record.message.includes('--- Chat Transcript ---');
  
  const { error } = await supabase
    .from('email_notifications')
    .insert({
      email_type: isTranscript ? 'chat_transcript' : 'contact_form',
      recipient: record.email,
      status: 'pending',
      payload: { record },
      error_message: errorMessage || 'Error sending email'
    });
    
  if (error) {
    console.error('Error creating email notification entry:', error);
    return { error };
  }
  
  console.log('Created email notification entry for retry');
  return { success: true };
}
