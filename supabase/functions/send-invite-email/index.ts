// Edge Function (send-invite-email.ts)
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = "re_GksATSum_3Ed2s9AWtLp7JMBLRQgUZYfw"; // Get API key from environment variables

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, thesisTitle, inviteLink, role } = await req.json() as EmailRequest;

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing Resend API Key" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Thesis Collaborator <cvupdz@gmail.com>", // Use your verified domain!
        to: [to],
        subject: `Invitation to collaborate on thesis: ${thesisTitle}`,
        html: `<h2>You've been invited to collaborate!</h2>
          <p>You have been invited as a <strong>${role}</strong> to collaborate on the thesis: "${thesisTitle}"</p>
          <a href="${inviteLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Accept Invitation</a>
          <p style="margin-top: 20px; color: #666;">If you can't click the button, copy and paste this link in your browser:<br>${inviteLink}</p>`,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();

      if (errorData.message.includes('already a collaborator')) {
            return new Response(JSON.stringify({ error: "This user is already a collaborator."}), { status: 400, headers: {...corsHeaders, "Content-Type": "application/json"}})
      } else if (/(invalid recipient|failed to resolve)/i.test(errorData.message)) {
            return new Response(JSON.stringify({ error: "Invalid recipient email address." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Default error handling
      console.error("Resend API Error:", errorData);
      return new Response(JSON.stringify({ error: errorData.message || "Failed to send email" }), {
        status: res.status, 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });

  } catch (error: any) {
    console.error("Error in Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message || "An unexpected error occurred." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
};

serve(handler);