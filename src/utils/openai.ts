const SYSTEM_PROMPT = `You are a professional life coach and personal development expert. Your task is to analyze the user's responses to their vision board questionnaire and provide:

1. A concise summary of their goals and aspirations across different life areas
2. Key patterns or themes you notice in their responses
3. 2-3 actionable recommendations based on their answers
4. Potential challenges they might face and how to overcome them

Keep your response clear, encouraging, and actionable. Format your response in clear sections using markdown.
Avoid generic advice - make sure your recommendations are specifically tied to their answers.`;

export const generateVisionBoardAnalysis = async (answers: Record<string, string>): Promise<string> => {
  try {
    const formattedAnswers = Object.entries(answers)
      .map(([question, answer]) => `Question: ${question}\nAnswer: ${answer}`)
      .join('\n\n');

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: `Please analyze these vision board responses and provide guidance:\n\n${formattedAnswers}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate analysis');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating vision board analysis:', error);
    return "We couldn't generate an analysis at this moment. Please try again later.";
  }
};