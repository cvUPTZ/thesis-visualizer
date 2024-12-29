import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from 'resend';
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface InviteEmailPayload {
  to: string;
  thesisTitle: string;
  inviteLink: string;
  role: 'editor' | 'admin';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const payload = await req.json() as InviteEmailPayload;

    // Validate required fields
    if (!payload.to || !payload.thesisTitle || !payload.inviteLink || !payload.role) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: payload.to,
      subject: `Invitation to collaborate on thesis: ${payload.thesisTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thesis Collaboration Invitation</h2>
          <p>You have been invited to collaborate on the thesis: <strong>${payload.thesisTitle}</strong></p>
          <p>Role: ${payload.role}</p>
          <div style="margin: 24px 0;">
            <a href="${payload.inviteLink}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
              Accept Invitation
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If you didn't request this invitation, you can ignore this email.
          </p>
        </div>
      `,
    });

    if (!emailResult || emailResult.error) {
      throw new Error(emailResult.error?.message || 'Failed to send email');
    }

    return new Response(
      JSON.stringify({ message: 'Invitation email sent successfully', data: emailResult }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString() 
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
};

serve(handler);