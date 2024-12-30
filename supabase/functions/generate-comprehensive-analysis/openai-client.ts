const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function generateAnalysis(formattedAnswers: string): Promise<string> {
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
  return data.choices[0].message.content;
}