import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createReport } from "https://esm.sh/v128/pdf-lib@1.17.1";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers } = await req.json();
    
    // Format answers for the prompt
    const formattedAnswers = Object.entries(answers)
      .map(([question, answer]) => `${question}: ${answer}`)
      .join('\n');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a professional life coach and personal development expert. Create a comprehensive analysis and action plan based on the user's vision board responses. Include:

1. Executive Summary (Brief overview of goals and aspirations)
2. Detailed Analysis
   - Key Patterns and Themes
   - Strengths and Growth Areas
   - Potential Synergies Between Goals
3. Strategic Recommendations
   - Short-term Actions (Next 30 days)
   - Medium-term Goals (3-6 months)
   - Long-term Vision (1-5 years)
4. Implementation Framework
   - Specific Action Steps
   - Resources Needed
   - Progress Tracking Methods
5. Potential Challenges and Mitigation Strategies
6. Success Metrics and Milestones

Format your response using markdown with clear headers, bullet points, and emphasis where appropriate.`
          },
          {
            role: 'user',
            content: formattedAnswers
          }
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    // Generate PDF
    const pdfDoc = await createReport(analysis);
    const pdfBytes = await pdfDoc.save();

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