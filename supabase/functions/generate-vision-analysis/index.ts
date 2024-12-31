import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateInitialAnalysis = async (answers: Record<string, string>) => {
  const prompt = `As a vision board analyst, create a concise yet insightful initial analysis of the following responses. Focus on identifying key patterns, aspirations, and potential areas of growth. Keep the tone encouraging and positive.

Responses to analyze:
${Object.entries(answers)
  .map(([question, answer]) => `${question}: ${answer}`)
  .join('\n')}

Please structure your analysis with:
1. A brief overview of the main themes
2. 2-3 key strengths identified
3. 1-2 areas of potential growth
4. A short encouraging conclusion

Format using markdown with ### for sections and bullet points where appropriate. Keep the total length to around 300-400 words.`;

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
          content: 'You are an insightful vision board analyst who helps people understand their goals and aspirations. You provide clear, actionable insights while maintaining an encouraging and positive tone.'
        },
        { role: 'user', content: prompt }
      ],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers } = await req.json();
    const analysis = await generateInitialAnalysis(answers);

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});