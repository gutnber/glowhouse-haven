
import { RESEND_API_KEY, ADMIN_EMAIL } from "./constants.ts";
import { supabase } from "./supabase-client.ts";

// Function to send email using Resend
export async function sendEmail(emailPayload: any) {
  if (!RESEND_API_KEY) {
    console.error('No Resend API key found');
    return { error: 'No Resend API key configured' };
  }

  try {
    // Check if we're using the default Resend test domain
    const isUsingTestDomain = emailPayload.from.includes('resend.dev');
    const originalRecipient = emailPayload.to;
    
    // If using test domain, we can only send to the verified admin email
    if (isUsingTestDomain) {
      console.log(`Using test domain - redirecting email from ${originalRecipient} to admin: ${ADMIN_EMAIL}`);
      
      // Store original recipient in text for reference
      if (typeof emailPayload.html === 'string') {
        emailPayload.html = `<div style="background-color: #f8f9fa; padding: 10px; margin-bottom: 15px; border-left: 4px solid #6c757d;">
          <p><strong>Note:</strong> This email was originally intended for: ${Array.isArray(originalRecipient) ? originalRecipient.join(', ') : originalRecipient}</p>
          <p>It was redirected to you because Resend requires domain verification for sending to external addresses.</p>
        </div>` + emailPayload.html;
      }
      
      // Override the recipient with the admin email
      emailPayload.to = [ADMIN_EMAIL];
    }
    
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
    
    // Return success with additional context for testing environments
    return { 
      success: true, 
      result,
      isUsingTestDomain,
      redirected: isUsingTestDomain ? true : false,
      originalRecipient: isUsingTestDomain ? originalRecipient : null
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
