export const generateVisionBoardAnalysis = async (answers: Record<string, string>): Promise<string> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-vision-analysis`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate analysis');
    }

    const data = await response.json();
    return data.analysis;
  } catch (error) {
    console.error('Error generating vision board analysis:', error);
    return "We couldn't generate an analysis at this moment. Please try again later.";
  }
};