import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = "re_GksATSum_3Ed2s9AWtLp7JMBLRQgUZYfw";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  thesisTitle: string;
  inviteLink: string;
  role: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Processing invite email request");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, thesisTitle, inviteLink, role } = await req.json() as EmailRequest;
    console.log(`Sending invite email to ${to} for thesis: ${thesisTitle}`);
    console.log('Request Data:', { to, thesisTitle, inviteLink, role });
     
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Thesis Collaborator <onboarding@resend.dev>",
        to: [to],
        subject: `Invitation to collaborate on thesis: ${thesisTitle}`,
        html: `
          <h2>You've been invited to collaborate!</h2>
          <p>You have been invited as a <strong>${role}</strong> to collaborate on the thesis: "${thesisTitle}"</p>
          <p>Click the link below to accept the invitation:</p>
          <a href="${inviteLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
            Accept Invitation
          </a>
          <p style="margin-top: 20px; color: #666;">
            If you can't click the button, copy and paste this link in your browser:<br>
            ${inviteLink}
          </p>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Error sending email:", error);
      throw new Error(error);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in send-invite-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);