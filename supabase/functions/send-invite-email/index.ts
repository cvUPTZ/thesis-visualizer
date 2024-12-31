import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { Resend } from 'https://esm.sh/resend@2.0.0';

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
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY');
    }

    const resend = new Resend(RESEND_API_KEY);
    const SENDER_EMAIL = Deno.env.get('SENDER_EMAIL') || 'onboarding@resend.dev';

    // Parse and validate request body
    const requestData: EmailRequest = await req.json();
    console.log('Received request data:', requestData);

    const { to, thesisTitle, inviteLink, role } = requestData;

    // Validate required fields
    if (!to || !thesisTitle || !inviteLink || !role) {
      throw new Error('Missing required fields');
    }

    // Sanitize inputs
    const safeToEmail = String(to).trim();
    const safeThesisTitle = String(thesisTitle).trim();
    const safeInviteLink = String(inviteLink).trim();
    const safeRole = String(role).trim();

    // Create email content
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

    console.log('Sending email to:', safeToEmail);
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: safeToEmail,
      subject: `Invitation to collaborate on thesis: ${safeThesisTitle}`,
      html: emailContent,
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    console.log('Email sent successfully:', data);

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