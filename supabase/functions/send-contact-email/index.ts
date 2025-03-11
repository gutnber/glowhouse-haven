
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing contact email request");
    const body = await req.json();
    console.log("Request body:", JSON.stringify(body));
    
    let submission: ContactSubmission;
    
    // Handle both direct calls and database trigger format
    if (body.record) {
      submission = body.record as ContactSubmission;
    } else if (body.payload) {
      submission = body.payload as ContactSubmission;
    } else {
      throw new Error("Invalid request format - missing record or payload");
    }

    console.log("Processing contact submission:", submission.id);

    // Format the date for better readability
    const formattedDate = new Date(submission.created_at).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    console.log("Sending email via Resend...");
    // Send the email using Resend
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
