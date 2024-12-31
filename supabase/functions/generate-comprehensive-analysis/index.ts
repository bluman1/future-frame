import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generatePDF } from "./pdf-generator.ts";
import { generateAnalysis } from "./openai-client.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers } = await req.json();
    
    // Format answers for the prompt
    const formattedAnswers = Object.entries(answers)
      .map(([question, answer]) => `${question}: ${answer}`)
      .join('\n');

    console.log('Generating analysis for answers:', formattedAnswers);

    // Generate the analysis using OpenAI
    const analysis = await generateAnalysis(formattedAnswers);
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