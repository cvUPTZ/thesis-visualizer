import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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

  let client: SMTPClient | null = null;

  try {
    console.log('Starting email send process...');
    const requestData = await req.json();
    console.log('Request data:', requestData);

    // Validate and sanitize input data
    const { to, thesisTitle, inviteLink, role } = requestData as InviteEmailRequest;
    
    if (!to || !thesisTitle || !inviteLink || !role) {
      throw new Error('Missing required fields');
    }

    console.log('SMTP Configuration:', { 
      host: SMTP_HOSTNAME, 
      port: SMTP_PORT,
      username: SMTP_USERNAME,
      senderEmail: SENDER_EMAIL 
    });

    client = new SMTPClient({
      connection: {
        hostname: SMTP_HOSTNAME,
        port: SMTP_PORT,
        tls: true,
        auth: {
          username: SMTP_USERNAME,
          password: SMTP_PASSWORD,
        },
      },
    });

    console.log('SMTP client initialized');

    // Convert all variables to strings and trim them
    const safeThesisTitle = String(thesisTitle).trim();
    const safeRole = String(role).trim();
    const safeInviteLink = String(inviteLink).trim();
    const safeToEmail = String(to).trim();

    console.log('Sanitized data:', {
      safeThesisTitle,
      safeRole,
      safeInviteLink,
      safeToEmail
    });

    const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #2563eb; margin-bottom: 20px;">You've been invited to collaborate!</h2>
            <p style="margin-bottom: 16px;">You've been invited to collaborate on the thesis "${safeThesisTitle}" as a ${safeRole}.</p>
            <p style="margin-bottom: 24px;">Click the link below to accept the invitation:</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="${safeInviteLink}" 
                 style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                Accept Invitation
              </a>
            </div>
            <p style="margin-top: 24px; color: #666;">If you can't click the button, copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #4F46E5;">${safeInviteLink}</p>
          </div>
        </body>
      </html>
    `.trim();

    console.log('Email content prepared');

    const message = {
      from: SENDER_EMAIL,
      to: safeToEmail,
      subject: `Invitation to collaborate on thesis: ${safeThesisTitle}`,
      content: emailContent,
      html: true,
    };

    console.log('Sending email...');
    await client.send(message);
    console.log('Email sent successfully');
    
    await client.close();
    client = null;

    return new Response(
      JSON.stringify({ success: true }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in email sending process:', error);
    
    if (client) {
      try {
        await client.close();
      } catch (closeError) {
        console.error('Error closing SMTP client:', closeError);
      }
    }
    
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
  }
});