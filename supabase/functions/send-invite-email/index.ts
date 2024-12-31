import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  thesisTitle: string;
  inviteLink: string;
  role: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const SMTP_USERNAME = Deno.env.get('SMTP_USERNAME');
    const SMTP_PASSWORD = Deno.env.get('SMTP_PASSWORD');
    
    if (!SMTP_USERNAME || !SMTP_PASSWORD) {
      throw new Error('Missing SMTP credentials');
    }

    // Create SMTP client with enhanced security settings
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 587, // Changed to TLS port
        tls: false, // Start with non-TLS
        debug: true, // Enable debug logging
      },
      auth: {
        username: SMTP_USERNAME,
        password: SMTP_PASSWORD,
      },
      pool: true, // Enable connection pooling
      secure: true, // Use STARTTLS
    });

    const requestData: EmailRequest = await req.json();
    console.log('Received request data:', requestData);

    const { to, thesisTitle, inviteLink, role } = requestData;

    if (!to || !thesisTitle || !inviteLink || !role) {
      throw new Error('Missing required fields');
    }

    const safeToEmail = String(to).trim();
    const safeThesisTitle = String(thesisTitle).trim();
    const safeInviteLink = String(inviteLink).trim();
    const safeRole = String(role).trim();

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thesis Collaboration Invitation</h2>
        <p>You have been invited to collaborate on the thesis: <strong>${safeThesisTitle}</strong></p>
        <p>You have been assigned the role of: <strong>${safeRole}</strong></p>
        <p>Click the link below to accept the invitation:</p>
        <p><a href="${safeInviteLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Accept Invitation</a></p>
        <p style="color: #666; font-size: 0.9em;">If you cannot click the button, copy and paste this link into your browser: ${safeInviteLink}</p>
      </div>
    `;

    console.log('Attempting to send email to:', safeToEmail);
    
    try {
      await client.send({
        from: SMTP_USERNAME,
        to: safeToEmail,
        subject: `Invitation to collaborate on thesis: ${safeThesisTitle}`,
        content: "This is a plain text fallback",
        html: emailContent,
        headers: {
          "X-Priority": "1 (Highest)",
          "X-MSMail-Priority": "High",
          "Importance": "High",
        },
      });

      console.log('Email sent successfully');
    } catch (emailError) {
      console.error('SMTP Error:', emailError);
      throw emailError;
    } finally {
      try {
        await client.close();
      } catch (closeError) {
        console.error('Error closing SMTP connection:', closeError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Invitation sent successfully' }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error sending invitation:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to send invitation',
        details: error,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
});