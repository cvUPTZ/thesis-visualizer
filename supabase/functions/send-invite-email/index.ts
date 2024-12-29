// // Supabase Edge Function (send-invite-email.ts) - SMTP Workaround (Discouraged)

// import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// import { SmtpClient } from "https://deno.land/x/denomail@v0.2.0/mod.ts";
// import { createClient } from "@supabase/supabase-js";


// const SUPABASE_URL ="https://xkwdfddamvuhucorwttw.supabase.co"

// const SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhrd2RmZGRhbXZ1aHVjb3J3dHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNzcwMDQsImV4cCI6MjA1MDk1MzAwNH0.6Ml1JDiKKsjSnM1z82bD9bVoiT_ZQmTRZaqtpxTPF2g"
// // Supabase client (for accessing storage)


// // SMTP credentials from environment variables (HIGHLY DISCOURAGED - SECURITY RISK)
// const SMTP_USERNAME = "excelzed@gmail.com"!;  
// const SMTP_PASSWORD = "acgl tfsi hfbe ufaw"!;
// const SMTP_HOST = "smtp.gmail.com"!;  // e.g., "smtp.gmail.com"
// const SMTP_PORT = "587";
// const SENDER_EMAIL = "excelzed@gmail.com"!;

// const supabase = createClient(
//   SUPABASE_URL , SUPABASE_ANON_KEY
// );

// const handler = async (req: Request): Promise<Response> => {
//   try {
//     const { to, thesisTitle, inviteLink, role } = await req.json();

//     const { data: templateData, error: storageError } = await supabase.storage
//       .from('THESIS EMAIL TEMPLATE FILE') // Replace with your bucket name
//       .download('email-template.html'); // Replace with your template name

//     if (storageError) {
//       throw new Error(`Storage Error: ${storageError.message}`);
//     }
//     if (!templateData) {
//       throw new Error("Email template not found in storage.");
//     }

//     const emailTemplate = new TextDecoder().decode(templateData);
//     const populatedEmailTemplate = emailTemplate
//       .replace("{{thesisTitle}}", thesisTitle)
//       .replace("{{inviteLink}}", inviteLink)
//       .replace("{{role}}", role);


//     const smtp = new SmtpClient();

//     try { // Inner try-catch for SMTP connection/sending
//         await smtp.connectTLS({ // Or smtp.connect() if not using TLS
//             hostname: SMTP_HOST,
//             port: SMTP_PORT,
//             username: SMTP_USERNAME,
//             password: SMTP_PASSWORD,
//         });

//         await smtp.send({
//             from: SENDER_EMAIL,
//             to: to,
//             subject: `Invitation to collaborate on thesis: ${thesisTitle}`,
//             htmlBody: populatedEmailTemplate,
//         });

//     } finally { // Ensure SMTP connection is closed even if an error occurs
//         try {
//           await smtp.close();
//         } catch (closeError) {
//           console.error("Error closing SMTP connection:", closeError);
//         }
//     }


//     return new Response("Invitation email sent (but consider using a dedicated email service).", { status: 200 });

//   } catch (error) {
//     console.error("Error sending email:", error);
//     return new Response("Failed to send invitation email.", { status: 500 });
//   }
// };

// serve(handler);









import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from 'resend';
import { createClient } from "@supabase/supabase-js";
import { Database } from '../../../src/integrations/supabase/types';

// Initialize Resend with your API key
const resend = new Resend("re_J2KATbSq_EuMbe7J8aiJCKKhqcSXBdhbU");


interface InviteEmailPayload {
  to: string;
  thesisTitle: string;
  inviteLink: string;
  role: 'editor' | 'admin';
}


// Supabase client initialization
const supabaseUrl = "https://xkwdfddamvuhucorwttw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhrd2RmZGRhbXZ1aHVjb3J3dHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNzcwMDQsImV4cCI6MjA1MDk1MzAwNH0.6Ml1JDiKKsjSnM1z82bD9bVoiT_ZQmTRZaqtpxTPF2g";
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

const handler = async (req: Request): Promise<Response> => {
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
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const payload = await req.json() as InviteEmailPayload;

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

