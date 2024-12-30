import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SENDER_EMAIL = Deno.env.get("SENDER_EMAIL");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    console.log('Starting email sending process...');
    
    if (!RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY');
      throw new Error('RESEND_API_KEY is not configured');
    }

    if (!SENDER_EMAIL) {
      console.error('Missing SENDER_EMAIL');
      throw new Error('SENDER_EMAIL is not configured');
    }

    const { to, thesisTitle, inviteLink, role }: EmailRequest = await req.json();

    if (!to || !thesisTitle || !inviteLink || !role) {
      console.error('Missing required fields:', { to, thesisTitle, inviteLink, role });
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Sending email to:', to);
    
    const emailContent = `
      <h2>You've been invited to collaborate!</h2>
      <p>You have been invited to collaborate on the thesis "${thesisTitle}" as a ${role}.</p>
      <p>Click the link below to accept the invitation:</p>
      <a href="${inviteLink}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
      <p>If you can't click the button, copy and paste this link in your browser:</p>
      <p>${inviteLink}</p>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        to: [to],
        subject: `Invitation to collaborate on "${thesisTitle}"`,
        html: emailContent,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Resend API error:', error);
      
      // Parse the error response to check if it's a domain verification issue
      try {
        const errorData = JSON.parse(error);
        if (errorData.statusCode === 403 && (
          errorData.message.includes('domain is not verified') || 
          errorData.message.includes('verify a domain')
        )) {
          return new Response(
            JSON.stringify({ 
              error: 'Domain verification required',
              details: 'The email domain needs to be verified. Please verify your domain at https://resend.com/domains'
            }),
            { 
              status: 403, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      } catch (parseError) {
        console.error('Error parsing Resend API error:', parseError);
      }
      
      throw new Error(`Resend API error: ${error}`);
    }

    const data = await res.json();
    console.log('Email sent successfully:', data);

    return new Response(
      JSON.stringify({ message: 'Invitation sent successfully' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error sending invitation email:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send invitation email',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});