import { supabase } from "@/integrations/supabase/client";

export const createNewSession = async (answers: Record<string, string>, initialAnalysis: string) => {
  try {
    console.log('Creating new session with answers and analysis...');
    
    // First create the session
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

    // Prepare answers including the initial analysis
    const answersToInsert = [
      ...Object.entries(answers).map(([question, answer]) => ({
        session_id: session.id,
        question,
        answer
      })),
      {
        session_id: session.id,
        question: '_initial_analysis',
        answer: initialAnalysis
      }
    ];

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

export const updateSessionWithEmail = async (sessionId: string, email: string, comprehensiveAnalysis: string) => {
  try {
    console.log('Updating session with email and comprehensive analysis...', { sessionId, email });
    
    const emailAnswer = {
      session_id: sessionId,
      question: '_email',
      answer: email
    };

    const analysisAnswer = {
      session_id: sessionId,
      question: '_comprehensive_analysis',
      answer: comprehensiveAnalysis
    };

    const { error: updateError } = await supabase
      .from('session_answers')
      .insert([emailAnswer, analysisAnswer]);

    if (updateError) {
      console.error('Email and analysis update error:', updateError);
      throw updateError;
    }

    return true;
  } catch (error) {
    console.error('Error in updateSessionWithEmail:', error);
    throw error;
  }
};