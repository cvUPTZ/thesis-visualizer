import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, thesisTitle, inviteLink, role }: EmailRequest = await req.json();

    if (!to || !thesisTitle || !inviteLink || !role) {
      console.error('Missing required fields:', { to, thesisTitle, inviteLink, role });
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const client = new SmtpClient();

    const connectConfig = {
      hostname: Deno.env.get("SMTP_HOST")!,
      port: Number(Deno.env.get("SMTP_PORT")),
      username: Deno.env.get("SMTP_USERNAME")!,
      password: Deno.env.get("SMTP_PASSWORD")!,
    };

    console.log('Connecting to SMTP server...');
    await client.connectTLS(connectConfig);

    const senderEmail = Deno.env.get("SENDER_EMAIL")!;
    
    const html = `
      <h2>You've been invited to collaborate!</h2>
      <p>You have been invited to collaborate on the thesis "${thesisTitle}" as a ${role}.</p>
      <p>Click the link below to accept the invitation:</p>
      <a href="${inviteLink}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
      <p>If you can't click the button, copy and paste this link in your browser:</p>
      <p>${inviteLink}</p>
    `;

    console.log('Sending email to:', to);
    await client.send({
      from: senderEmail,
      to: to,
      subject: `Invitation to collaborate on "${thesisTitle}"`,
      html: html,
    });

    await client.close();
    console.log('Email sent successfully');

    return new Response(
      JSON.stringify({ message: 'Invitation sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending invitation email:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send invitation email' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});