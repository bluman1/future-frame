import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const createNewSession = async (answers: Record<string, string>) => {
  try {
    console.log('Creating new session...');
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert([{}])
      .select('*')
      .maybeSingle();

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      throw sessionError;
    }

    if (!session) {
      throw new Error('No session data returned after creation');
    }
    
    console.log('Session created:', session);

    // Store all answers
    const answersToInsert = Object.entries(answers).map(([question, answer]) => ({
      session_id: session.id,
      question,
      answer
    }));

    const { error: answersError } = await supabase
      .from('session_answers')
      .insert(answersToInsert);

    if (answersError) {
      console.error('Answers storage error:', answersError);
      throw answersError;
    }

    return session;
  } catch (error) {
    console.error('Error in createNewSession:', error);
    throw error;
  }
};

export const updateSessionWithAnalysis = async (sessionId: string, analysis: string) => {
  try {
    console.log('Updating session with analysis...', sessionId);
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle();

    if (sessionError) {
      console.error('Session fetch error:', sessionError);
      throw sessionError;
    }

    if (!session) {
      throw new Error('Session not found');
    }

    const { data: updateData, error: updateError } = await supabase
      .from('sessions')
      .update({ short_analysis: analysis })
      .eq('id', sessionId)
      .select('*')
      .maybeSingle();

    if (updateError) {
      console.error('Analysis update error:', updateError);
      throw updateError;
    }

    if (!updateData) {
      throw new Error('No data returned after updating analysis');
    }

    return updateData;
  } catch (error) {
    console.error('Error in updateSessionWithAnalysis:', error);
    throw error;
  }
};

export const updateSessionWithEmail = async (sessionId: string, email: string) => {
  try {
    console.log('Updating session with email...', sessionId);
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle();

    if (sessionError) {
      console.error('Session fetch error:', sessionError);
      throw sessionError;
    }

    if (!session) {
      throw new Error('Session not found');
    }

    const { data: emailUpdateData, error: emailUpdateError } = await supabase
      .from('sessions')
      .update({ email })
      .eq('id', sessionId)
      .select('*')
      .maybeSingle();

    if (emailUpdateError) {
      console.error('Email update error:', emailUpdateError);
      throw emailUpdateError;
    }

    if (!emailUpdateData) {
      throw new Error('No data returned after updating email');
    }

    return emailUpdateData;
  } catch (error) {
    console.error('Error in updateSessionWithEmail:', error);
    throw error;
  }
};