import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const SMTP_HOSTNAME = Deno.env.get('SMTP_HOST')!;
const SMTP_PORT = parseInt(Deno.env.get('SMTP_PORT')!);
const SMTP_USERNAME = Deno.env.get('SMTP_USERNAME')!;
const SMTP_PASSWORD = Deno.env.get('SMTP_PASSWORD')!;
const SENDER_EMAIL = Deno.env.get('SENDER_EMAIL')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InviteEmailRequest {
  to: string;
  thesisTitle: string;
  inviteLink: string;
  role: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let client: SmtpClient | null = null;

  try {
    console.log('Starting email send process...');
    const { to, thesisTitle, inviteLink, role } = await req.json() as InviteEmailRequest;

    console.log('Request data:', { to, thesisTitle, role });
    console.log('SMTP Configuration:', { 
      host: SMTP_HOSTNAME, 
      port: SMTP_PORT,
      username: SMTP_USERNAME,
      senderEmail: SENDER_EMAIL 
    });

    client = new SmtpClient();

    console.log('Connecting to SMTP server...');
    await client.connectTLS({
      hostname: SMTP_HOSTNAME,
      port: SMTP_PORT,
      username: SMTP_USERNAME,
      password: SMTP_PASSWORD,
    });

    console.log('SMTP connection established');

    const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">You've been invited to collaborate!</h2>
            <p>You've been invited to collaborate on the thesis "${thesisTitle}" as a ${role}.</p>
            <p>Click the link below to accept the invitation:</p>
            <a href="${inviteLink}" 
               style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
              Accept Invitation
            </a>
            <p style="margin-top: 20px;">If you can't click the button, copy and paste this link in your browser:</p>
            <p style="word-break: break-all;">${inviteLink}</p>
          </div>
        </body>
      </html>
    `.trim();

    console.log('Sending email...');
    await client.send({
      from: SENDER_EMAIL,
      to: to,
      subject: `Invitation to collaborate on thesis: ${thesisTitle}`,
      content: "Please view this email in an HTML-capable client",
      html: emailContent,
    });

    console.log('Email sent successfully');

    return new Response(
      JSON.stringify({ success: true }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in email sending process:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to send invitation email',
        details: error
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  } finally {
    if (client) {
      console.log('Closing SMTP connection...');
      try {
        await client.close();
        console.log('SMTP connection closed successfully');
      } catch (closeError) {
        console.error('Error closing SMTP connection:', closeError);
      }
    }
  }
});