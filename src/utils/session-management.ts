import { supabase } from "@/integrations/supabase/client";

export const createNewSession = async (answers: Record<string, string>) => {
  try {
    console.log('Creating new session...');
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert([{}])
      .select()
      .single();

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      throw sessionError;
    }

    if (!session) {
      console.error('No session data returned after creation');
      throw new Error('Failed to create session');
    }
    
    console.log('Session created:', session);

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
    console.log('Updating session with analysis...', { sessionId, analysis });
    
    const { data: updateData, error: updateError } = await supabase
      .from('sessions')
      .update({ short_analysis: analysis })
      .eq('id', sessionId)
      .select()
      .single();

    if (updateError) {
      console.error('Analysis update error:', updateError);
      throw updateError;
    }

    if (!updateData) {
      console.error('No data returned after updating analysis');
      throw new Error('Session not found');
    }

    console.log('Analysis update successful:', updateData);
    return updateData;
  } catch (error) {
    console.error('Error in updateSessionWithAnalysis:', error);
    throw error;
  }
};

export const updateSessionWithEmail = async (sessionId: string, email: string) => {
  try {
    console.log('Updating session with email...', { sessionId, email });
    
    const { data: emailUpdateData, error: emailUpdateError } = await supabase
      .from('sessions')
      .update({ email })
      .eq('id', sessionId)
      .select()
      .single();

    if (emailUpdateError) {
      console.error('Email update error:', emailUpdateError);
      throw emailUpdateError;
    }

    if (!emailUpdateData) {
      console.error('No data returned after updating email');
      throw new Error('Session not found');
    }

    console.log('Email update successful:', emailUpdateData);
    return emailUpdateData;
  } catch (error) {
    console.error('Error in updateSessionWithEmail:', error);
    throw error;
  }
};