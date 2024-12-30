import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { PDFDocument, rgb, StandardFonts } from "https://cdn.skypack.dev/pdf-lib@1.17.1";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function generatePDF(content: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 12;
  const margin = 50;
  const lineHeight = fontSize * 1.2;

  // Split content into lines that fit within page width
  const words = content.split(' ');
  let currentLine = '';
  let yPosition = height - margin;
  const lines: string[] = [];

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const textWidth = timesRomanFont.widthOfTextAtSize(testLine, fontSize);

    if (textWidth > width - 2 * margin) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  // Add lines to the page, creating new pages as needed
  for (const line of lines) {
    if (yPosition < margin) {
      const newPage = pdfDoc.addPage();
      yPosition = height - margin;
    }

    page.drawText(line, {
      x: margin,
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    yPosition -= lineHeight;
  }

  return await pdfDoc.save();
}

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

1. Executive Summary
   - Brief overview of goals and aspirations
   - Key themes identified

2. Detailed Analysis
   - Strengths and Growth Areas
   - Potential Synergies Between Goals
   - Risk Assessment

3. Strategic Recommendations
   - Immediate Actions (Next 30 days)
   - Short-term Goals (3-6 months)
   - Medium-term Goals (6-12 months)
   - Long-term Vision (1-5 years)

4. Implementation Framework
   - Weekly Action Items
   - Monthly Milestones
   - Resources Needed
   - Progress Tracking Methods

5. Success Metrics
   - Key Performance Indicators
   - Milestone Achievements
   - Progress Review Schedule

6. Potential Challenges and Solutions
   - Anticipated Obstacles
   - Mitigation Strategies
   - Contingency Plans

Format your response using markdown with clear headers, bullet points, and emphasis where appropriate.`
          },
          {
            role: 'user',
            content: formattedAnswers
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    const data = await response.json();
    const analysis = data.choices[0].message.content;
    
    // Generate PDF
    const pdfBytes = await generatePDF(analysis);

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