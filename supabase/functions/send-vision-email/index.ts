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

    // Convert PDF data back to Buffer/Uint8Array
    const pdfBuffer = new Uint8Array(pdfData);
    
    // Create FormData for the attachment
    const formData = new FormData();
    formData.append('from', 'Vision Board <onboarding@resend.dev>');
    formData.append('to', email);
    formData.append('subject', 'Your Vision Board Analysis');
    formData.append('html', `
      <h1>Your Vision Board Analysis</h1>
      <p>Thank you for using our Vision Board tool! Please find your comprehensive analysis attached as a PDF.</p>
      <p>We hope this analysis helps you achieve your goals and aspirations!</p>
    `);
    formData.append('attachment', new Blob([pdfBuffer], { type: 'application/pdf' }), 'vision-board-analysis.pdf');

    // Send email using Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: formData,
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