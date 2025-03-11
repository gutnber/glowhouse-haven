
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
}

// Store recently processed submission IDs to prevent duplicate sends
const recentlyProcessed = new Map<string, number>();
// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, timestamp] of recentlyProcessed.entries()) {
    // Remove entries older than 10 minutes
    if (now - timestamp > 10 * 60 * 1000) {
      recentlyProcessed.delete(id);
    }
  }
}, 5 * 60 * 1000);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing contact email request");
    
    // Parse the request body
    let body;
    try {
      body = await req.json();
      console.log("Request body:", JSON.stringify(body));
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      throw new Error("Invalid JSON in request body");
    }
    
    let submission: ContactSubmission;
    
    // Handle all possible formats (direct submission, database trigger, email_notifications payload)
    if (body.record) {
      submission = body.record as ContactSubmission;
      console.log("Processing request from direct submission record format");
    } else if (body.payload && typeof body.payload === 'object') {
      submission = body.payload as ContactSubmission;
      console.log("Processing request from payload object format");
    } else if (typeof body === 'object' && body.name && body.email) {
      submission = body as ContactSubmission;
      console.log("Processing direct submission format");
    } else {
      console.error("Invalid request format:", body);
      throw new Error("Invalid request format - could not determine submission data structure");
    }

    // Validate required fields
    if (!submission.name || !submission.email || !submission.message) {
      console.error("Missing required fields in submission:", submission);
      throw new Error("Missing required fields for email");
    }

    // Check for duplicate submissions to prevent multiple emails
    const submissionId = submission.id || `${submission.email}-${submission.created_at}`;
    if (recentlyProcessed.has(submissionId)) {
      console.log(`Skipping duplicate submission: ${submissionId}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Duplicate submission detected", 
          skipped: true 
        }),
        {
          status: 200,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          },
        }
      );
    }
    
    // Mark this submission as processed
    recentlyProcessed.set(submissionId, Date.now());

    console.log("Processing contact submission:", submissionId);

    // Format the date for better readability
    const formattedDate = new Date(submission.created_at || new Date().toISOString()).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Try to send the email notification
    console.log("Sending email via Resend to henrygutierrezbaja@gmail.com");
    try {
      const { data, error } = await resend.emails.send({
        from: "INMA Real Estate <onboarding@resend.dev>",
        to: ["henrygutierrezbaja@gmail.com"],
        subject: `New Contact Form Submission from ${submission.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h1 style="color: #E65100; border-bottom: 2px solid #FFB74D; padding-bottom: 10px;">New Contact Form Submission</h1>
            
            <div style="margin: 20px 0;">
              <p><strong>Name:</strong> ${submission.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${submission.email}">${submission.email}</a></p>
              <p><strong>Phone:</strong> ${submission.phone || 'Not provided'}</p>
              <p><strong>Submitted on:</strong> ${formattedDate}</p>
            </div>
            
            <div style="background-color: #FFF3E0; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <h2 style="color: #E65100; margin-top: 0;">Message:</h2>
              <p style="white-space: pre-line;">${submission.message}</p>
            </div>
            
            <div style="margin-top: 30px; font-size: 12px; color: #757575; border-top: 1px solid #e0e0e0; padding-top: 15px;">
              <p>This is an automated notification from your INMA Real Estate website.</p>
            </div>
          </div>
        `,
      });

      if (error) {
        console.error("Error sending email:", error);
        throw new Error(error.message);
      }

      console.log("Email sent successfully:", data);
      
      return new Response(
        JSON.stringify({ success: true, message: "Email notification sent" }),
        {
          status: 200,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          },
        }
      );
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      
      // Return error but with 200 status since we still want to acknowledge receipt
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email sending failed, but submission was recorded",
          details: emailError.message || "Unknown email error"
        }),
        {
          status: 200,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          },
        }
      );
    }
  } catch (error) {
    console.error("Function error:", error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An unknown error occurred" 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
      }
    );
  }
});
