import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  sessionId: string;
  email: string;
  pdfData: number[];
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const { sessionId, email, pdfData }: EmailRequest = await req.json();

    console.log('Sending email for session:', sessionId);

    // Get the comprehensive analysis from the session
    const { data: analysisData, error: analysisError } = await supabase
      .from('session_answers')
      .select('answer')
      .eq('session_id', sessionId)
      .eq('question', '_comprehensive_analysis')
      .single();

    if (analysisError) {
      console.error('Error fetching analysis:', analysisError);
      throw new Error('Failed to fetch analysis');
    }

    // Convert PDF data to base64
    const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfData)));

    // Send email using Resend with attachment
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vision Board <noreply@futureframe.michael.ng>',
        to: email,
        subject: 'Your Vision Board Analysis',
        html: `
          <h1>Your Vision Board Analysis</h1>
          <p>Thank you for using our Vision Board tool! Please find your comprehensive analysis attached as a PDF.</p>
          <p>We hope this analysis helps you achieve your goals and aspirations!</p>
        `,
        attachments: [{
          filename: 'vision-board-analysis.pdf',
          content: pdfBase64,
        }],
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Resend API error:', error);
      throw new Error('Failed to send email');
    }

    const data = await res.json();
    console.log('Email sent successfully:', data);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in send-vision-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});