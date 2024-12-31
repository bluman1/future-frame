import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { generatePDF } from "./pdf-generator.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    // Fetch the current prompt
    const { data: promptData, error: promptError } = await supabase
      .from('analysis_prompts')
      .select('prompt')
      .eq('id', 'comprehensive_analysis')
      .single();

    if (promptError) {
      throw promptError;
    }

    const { answers } = await req.json();
    
    // Format answers for the prompt
    const formattedAnswers = Object.entries(answers)
      .map(([question, answer]) => `${question}: ${answer}`)
      .join('\n');

    console.log('Generating analysis for answers:', formattedAnswers);

    // Generate the analysis using OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: promptData.prompt
          },
          {
            role: 'user',
            content: formattedAnswers
          }
        ],
      }),
    });

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI');
    }

    const analysis = data.choices[0].message.content;
    console.log('Generated analysis:', analysis);

    // Generate PDF
    const pdfBytes = await generatePDF(analysis);
    console.log('PDF generated successfully');

    return new Response(
      JSON.stringify({ 
        analysis,
        pdf: Array.from(pdfBytes)
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-comprehensive-analysis function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});