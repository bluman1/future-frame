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
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  
  // PDF settings
  const fontSize = 12;
  const titleSize = 16;
  const margin = 50;
  const lineHeight = fontSize * 1.5;
  
  let currentPage = pdfDoc.addPage();
  let { width, height } = currentPage.getSize();
  let yPosition = height - margin;

  // Helper function to add a new page
  const addNewPage = () => {
    currentPage = pdfDoc.addPage();
    yPosition = height - margin;
    return currentPage;
  };

  // Helper function to write text and handle overflow
  const writeText = (text: string, { fontSize: size = fontSize, font = timesRomanFont, indent = 0 } = {}) => {
    // Replace problematic characters and normalize line endings
    text = text.replace(/[\r\n]+/g, ' ').trim();
    
    if (yPosition < margin + size) {
      currentPage = addNewPage();
    }

    const maxWidth = width - 2 * margin - indent;
    const words = text.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, size);

      if (testWidth > maxWidth) {
        // Write current line
        currentPage.drawText(currentLine, {
          x: margin + indent,
          y: yPosition,
          size: size,
          font: font,
          color: rgb(0, 0, 0),
        });
        yPosition -= lineHeight;
        currentLine = word;

        // Check if we need a new page
        if (yPosition < margin + size) {
          currentPage = addNewPage();
        }
      } else {
        currentLine = testLine;
      }
    }

    // Write remaining text
    if (currentLine) {
      currentPage.drawText(currentLine, {
        x: margin + indent,
        y: yPosition,
        size: size,
        font: font,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight;
    }
  };

  // Process markdown-like content
  const sections = content.split('\n\n').map(section => section.trim());
  
  for (const section of sections) {
    if (!section) continue;

    if (section.startsWith('# ')) {
      writeText(section.substring(2), { fontSize: titleSize, font: timesBoldFont });
      yPosition -= lineHeight;
    } else if (section.startsWith('## ')) {
      writeText(section.substring(3), { fontSize: titleSize - 2, font: timesBoldFont });
      yPosition -= lineHeight;
    } else if (section.startsWith('- ')) {
      writeText('•' + section.substring(1), { indent: 20 });
    } else {
      writeText(section);
      yPosition -= lineHeight / 2;
    }

    // Add extra space between sections
    yPosition -= lineHeight / 2;
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

    console.log('Generating analysis for answers:', formattedAnswers);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a professional life coach and personal development expert. Create a comprehensive analysis and action plan based on the user's vision board responses. Include:

# Vision Board Analysis

## Executive Summary
- Brief overview of goals and aspirations
- Key themes identified

## Detailed Analysis
- Strengths and Growth Areas
- Potential Synergies Between Goals
- Risk Assessment

## Strategic Recommendations
- Immediate Actions (Next 30 days)
- Short-term Goals (3-6 months)
- Medium-term Goals (6-12 months)
- Long-term Vision (1-5 years)

## Implementation Framework
- Weekly Action Items
- Monthly Milestones
- Resources Needed
- Progress Tracking Methods

## Success Metrics
- Key Performance Indicators
- Milestone Achievements
- Progress Review Schedule

## Potential Challenges and Solutions
- Anticipated Obstacles
- Mitigation Strategies
- Contingency Plans

Format your response using the exact headers above, with bullet points for each section.`
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