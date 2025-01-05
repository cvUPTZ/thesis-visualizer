import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from 'npm:resend';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

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
    console.log('Starting email sending process...');

    if (!RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY');
    }

    const resend = new Resend(RESEND_API_KEY);
    const SENDER_EMAIL = 'thesis@yourdomain.com'; // Update this with your verified domain

    const requestData: EmailRequest = await req.json();
    console.log('Received request data:', requestData);

    const { to, thesisTitle, inviteLink, role } = requestData;

    if (!to || !thesisTitle || !inviteLink || !role) {
      throw new Error('Missing required fields');
    }

    const safeEmail = String(to).trim();
    const safeTitle = String(thesisTitle).trim();
    const safeLink = String(inviteLink).trim();
    const safeRole = String(role).trim();

    console.log('Sending email to:', safeEmail);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thesis Collaboration Invitation</h2>
        <p>You have been invited to collaborate on the thesis: <strong>${safeTitle}</strong></p>
        <p>You have been assigned the role of: <strong>${safeRole}</strong></p>
        <p>Click the link below to accept the invitation:</p>
        <p><a href="${safeLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Accept Invitation</a></p>
        <p style="color: #666; font-size: 0.9em;">If you cannot click the button, copy and paste this link into your browser: ${safeLink}</p>
      </div>
    `;

    try {
      const { data, error } = await resend.emails.send({
        from: SENDER_EMAIL,
        to: [safeEmail],
        subject: `Invitation to collaborate on thesis: ${safeTitle}`,
        html: emailHtml,
      });

      if (error) {
        console.error('Resend error:', error);
        
        // Check specifically for domain verification error
        if (error.message?.toLowerCase().includes('verify a domain')) {
          return new Response(
            JSON.stringify({
              error: 'Domain verification required',
              details: {
                message: 'Please verify your domain at Resend.com before sending invitations.',
                name: 'domain_verification_error'
              }
            }),
            {
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
              },
              status: 403,
            }
          );
        }
        
        throw error;
      }

      console.log('Email sent successfully:', data);
      return new Response(
        JSON.stringify({ success: true, data }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 200,
        }
      );
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  } catch (error) {
    console.error('General error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        details: {
          message: error.message,
          name: error.name || 'unknown_error'
        }
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