// Supabase Edge Function (send-invite-email.ts) - SMTP Workaround (Discouraged)

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/denomail@v0.2.0/mod.ts";
import { createClient } from "@supabase/supabase-js";

// Supabase client (for accessing storage)
const supabase = createClient(
  "https://xkwdfddamvuhucorwttw.supabase.co"!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

// SMTP credentials from environment variables (HIGHLY DISCOURAGED - SECURITY RISK)
const SMTP_USERNAME = "excelzed@gmail.com"!;  
const SMTP_PASSWORD = "acgl tfsi hfbe ufaw"!;
const SMTP_HOST = "smtp.gmail.com"!;  // e.g., "smtp.gmail.com"
const SMTP_PORT = "587";
const SENDER_EMAIL = "excelzed@gmail.com"!;

const handler = async (req: Request): Promise<Response> => {
  try {
    const { to, thesisTitle, inviteLink, role } = await req.json();

    // 1. Fetch Email Template from Supabase Storage
    const { data: templateData, error: storageError } = await supabase.storage
      .from('your-storage-bucket') // Replace 'your-storage-bucket'
      .download('email-template.html'); // Replace 'email-template.html'

    if (storageError) {
      throw new Error(`Storage Error: ${storageError.message}`);
    }
    if (!templateData) {
      throw new Error("Email template not found in storage.");
    }

    const emailTemplate = new TextDecoder().decode(templateData);

    // 2. Populate Email Template
    const populatedEmailTemplate = emailTemplate
      .replace("{{thesisTitle}}", thesisTitle)
      .replace("{{inviteLink}}", inviteLink)
      .replace("{{role}}", role);



    // 3. Send Email via SMTP
    const smtp = new SmtpClient();
    await smtp.connect({
      hostname: SMTP_HOST,
      port: SMTP_PORT,
      username: SMTP_USERNAME,
      password: SMTP_PASSWORD,
      tls: true, // Or false if your provider doesn't require TLS
    });

    await smtp.send({
      from: SENDER_EMAIL,
      to: to,
      subject: `Invitation to collaborate on thesis: ${thesisTitle}`,
      htmlBody: populatedEmailTemplate,
    });

    await smtp.close();


    return new Response("Invitation email sent (but probably not reliably).", { status: 200 });

  } catch (error) {
    console.error("Error sending email:", error);
    return new Response("Failed to send invitation email.", { status: 500 });
  }
};

serve(handler);