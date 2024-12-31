import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
      .eq('id', 'initial_analysis')
      .single();

    if (promptError) {
      throw promptError;
    }

    const { answers } = await req.json();
    
    if (!answers || Object.keys(answers).length === 0) {
      console.error('No answers provided in request');
      throw new Error('No answers provided');
    }

    console.log('Formatting answers for analysis');
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