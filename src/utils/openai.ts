import { supabase } from "@/integrations/supabase/client";

export const generateVisionBoardAnalysis = async (answers: Record<string, string>): Promise<string> => {
  try {
    console.log('Calling generate-vision-analysis function...');
    const { data, error } = await supabase.functions.invoke('generate-vision-analysis', {
      body: { answers }
    });

    if (error) {
      console.error('Error calling generate-vision-analysis:', error);
      throw error;
    }

    if (!data || !data.analysis) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from analysis function');
    }

    return data.analysis;
  } catch (error) {
    console.error('Error generating vision board analysis:', error);
    throw error;
  }
};

export const generateComprehensiveAnalysis = async (answers: Record<string, string>): Promise<{ analysis: string; pdf: number[] }> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-comprehensive-analysis', {
      body: { answers }
    });

    if (error) {
      console.error('Error calling generate-comprehensive-analysis:', error);
      throw error;
    }

    if (!data || !data.analysis || !data.pdf) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from comprehensive analysis function');
    }

    return data;
  } catch (error) {
    console.error('Error generating comprehensive analysis:', error);
    throw error;
  }
};