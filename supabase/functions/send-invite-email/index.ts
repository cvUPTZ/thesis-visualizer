import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

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
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { to, thesisTitle, inviteLink, role }: EmailRequest = await req.json();

    if (!to || !thesisTitle || !inviteLink || !role) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is already a collaborator
    const { data: existingCollaborator } = await supabaseClient
      .from('thesis_collaborators')
      .select('*')
      .eq('user_id', to)
      .single();

    if (existingCollaborator) {
      return new Response(
        JSON.stringify({ error: 'User is already a collaborator' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

        // Send invitation email using your email service
         const { error: emailError } = await supabaseClient.functions.invoke('send-email', {
                body: JSON.stringify({
                    to: to,
                    subject: `Invitation to collaborate on ${thesisTitle}`,
                     body: `You have been invited to collaborate on ${thesisTitle} as ${role}. Please click on this link to accept the invite: ${inviteLink}`,
                }),
            });

            if (emailError) {
                console.error('Error invoking send email function:', emailError);
              return new Response(
                    JSON.stringify({ error: 'Failed to send invitation email' }),
                    {
                      status: 500,
                      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    }
                  );
            }
             return new Response(
                JSON.stringify({ message: 'Invitation sent successfully' }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );


  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});