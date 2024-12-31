import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { generatePDF } from "./pdf-generator.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateComprehensiveAnalysis = async (answers: Record<string, string>) => {
  const prompt = `As a vision board analyst, create a comprehensive and detailed analysis of the following responses. This analysis should be thorough and provide actionable insights and strategies.

Responses to analyze:
${Object.entries(answers)
  .map(([question, answer]) => `${question}: ${answer}`)
  .join('\n')}

Please structure your analysis with the following sections:

### Vision Overview
- Analyze the overall vision and life direction
- Identify core values and principles emerging from the responses
- Highlight unique aspects of the individual's aspirations

### Key Strengths & Resources
- Detail 3-4 major strengths identified
- List available resources and support systems
- Highlight potential advantages and opportunities

### Growth Areas & Challenges
- Identify 2-3 areas for development
- Analyze potential obstacles and challenges
- Suggest strategies for overcoming these challenges

### Action Plan
- Provide 3-5 specific, actionable steps
- Include both short-term and long-term goals
- Suggest timeline recommendations

### Success Metrics
- Define what success looks like
- Suggest ways to measure progress
- Recommend check-in points and milestones

### Final Recommendations
- Provide personalized advice
- Suggest resources or tools that might be helpful
- Include words of encouragement

Format using markdown with ### for sections and bullet points where appropriate. The analysis should be detailed but clear, approximately 1000-1200 words.`;

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
          content: 'You are an expert vision board analyst and life strategist who provides detailed, actionable insights while maintaining an encouraging and empowering tone. Your analysis should be both professional and personal, helping individuals understand their goals and create practical steps toward achieving them.'
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
    const analysis = await generateComprehensiveAnalysis(answers);
    const pdf = await generatePDF(analysis);

    return new Response(
      JSON.stringify({ analysis, pdf }),
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