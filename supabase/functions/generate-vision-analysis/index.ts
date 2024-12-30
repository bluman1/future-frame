import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    console.log('Received request to generate vision analysis');
    const { answers } = await req.json();
    
    if (!answers || Object.keys(answers).length === 0) {
      console.error('No answers provided in request');
      throw new Error('No answers provided');
    }

    console.log('Formatting answers for analysis');
    // Format the answers for the prompt
    const formattedAnswers = Object.entries(answers)
      .map(([question, answer]) => `${question}: ${answer}`)
      .join('\n');

    console.log('Calling OpenAI API');
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
            content: `You are a professional life coach and personal development expert. Analyze the user's vision board responses and provide:
1. A concise summary of their goals and aspirations
2. Key patterns or themes you notice
3. 2-3 actionable recommendations
4. Potential challenges and how to overcome them

Keep your response clear, encouraging, and actionable. Format in markdown.`
          },
          {
            role: 'user',
            content: formattedAnswers
          }
        ],
      }),
    });

    const data = await response.json();
    console.log('Received response from OpenAI');

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response from OpenAI:', data);
      throw new Error('Invalid response from OpenAI');
    }

    const analysis = data.choices[0].message.content;
    console.log('Successfully generated analysis');

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-vision-analysis function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate vision board analysis'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});