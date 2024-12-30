import { supabase } from "@/integrations/supabase/client";

export const generateVisionBoardAnalysis = async (answers: Record<string, string>): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-vision-analysis', {
      body: { answers }
    });

    if (error) {
      console.error('Error calling generate-vision-analysis:', error);
      throw error;
    }

    return data.analysis;
  } catch (error) {
    console.error('Error generating vision board analysis:', error);
    return "We couldn't generate an analysis at this moment. Please try again later.";
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

    return data;
  } catch (error) {
    console.error('Error generating comprehensive analysis:', error);
    throw error;
  }
};