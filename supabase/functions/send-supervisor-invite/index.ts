import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const SMTP_HOST = Deno.env.get('SMTP_HOST')!;
const SMTP_PORT = parseInt(Deno.env.get('SMTP_PORT')!);
const SMTP_USERNAME = Deno.env.get('SMTP_USERNAME')!;
const SMTP_PASSWORD = Deno.env.get('SMTP_PASSWORD')!;
const SENDER_EMAIL = Deno.env.get('SENDER_EMAIL')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  thesisTitle: string;
  inviteLink: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Starting supervisor invitation email process...');

    // Validate environment variables
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USERNAME || !SMTP_PASSWORD || !SENDER_EMAIL) {
      throw new Error('Missing SMTP configuration');
    }

    // Parse and validate request body
    const requestData: EmailRequest = await req.json();
    console.log('Received request data:', requestData);

    const { to, thesisTitle, inviteLink } = requestData;

    if (!to || !thesisTitle || !inviteLink) {
      throw new Error('Missing required fields');
    }

    // Sanitize inputs
    const safeEmail = String(to).trim();
    const safeTitle = String(thesisTitle).trim();
    const safeLink = String(inviteLink).trim();

    console.log('Sending email to:', safeEmail);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thesis Supervision Invitation</h2>
        <p>You have been invited to supervise the thesis: <strong>${safeTitle}</strong></p>
        <p>As a supervisor, you will be able to:</p>
        <ul>
          <li>Review and comment on thesis content</li>
          <li>Add annotations and highlights</li>
          <li>Track student progress</li>
          <li>Provide feedback and suggestions</li>
        </ul>
        <p>Click the link below to accept the invitation:</p>
        <p><a href="${safeLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Accept Invitation</a></p>
        <p style="color: #666; font-size: 0.9em;">If you cannot click the button, copy and paste this link into your browser: ${safeLink}</p>
      </div>
    `;

    // Create SMTP client
    const client = new SmtpClient();

    await client.connectTLS({
      hostname: SMTP_HOST,
      port: SMTP_PORT,
      username: SMTP_USERNAME,
      password: SMTP_PASSWORD,
    });

    await client.send({
      from: SENDER_EMAIL,
      to: safeEmail,
      subject: `Invitation to supervise thesis: ${safeTitle}`,
      content: emailHtml,
      html: emailHtml,
    });

    await client.close();

    console.log('Email sent successfully');
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        details: {}
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