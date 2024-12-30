import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { generateVisionBoardAnalysis, generateComprehensiveAnalysis } from "@/utils/openai";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AnalysisSection } from "./vision-board/AnalysisSection";
import { EmailSection } from "./vision-board/EmailSection";
import { AnswersSection } from "./vision-board/AnswersSection";

interface VisionBoardProps {
  answers: Record<string, string>;
  className?: string;
}

export const VisionBoard = ({ answers, className }: VisionBoardProps) => {
  const [analysis, setAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const createSession = async () => {
      try {
        // Create a new session
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
        setSessionId(session.id);

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

        console.log('Answers stored successfully');

        // Generate initial analysis
        console.log('Generating initial analysis...');
        const result = await generateVisionBoardAnalysis(answers);
        
        if (!result) {
          throw new Error('Failed to generate initial analysis');
        }
        
        setAnalysis(result);

        // Update session with short analysis immediately after generation
        console.log('Updating session with short analysis...');
        const { data: updateData, error: updateError } = await supabase
          .from('sessions')
          .update({ short_analysis: result })
          .eq('id', session.id)
          .select('*')
          .maybeSingle();

        if (updateError) {
          console.error('Short analysis update error:', updateError);
          throw updateError;
        }

        if (!updateData) {
          throw new Error('No data returned after updating short analysis');
        }
        
        console.log('Session updated with short analysis:', updateData);
        
        // Verify the update
        const { data: verifyData, error: verifyError } = await supabase
          .from('sessions')
          .select('short_analysis')
          .eq('id', session.id)
          .maybeSingle();

        if (verifyError) {
          console.error('Verification error:', verifyError);
          throw verifyError;
        }
          
        console.log('Verified short analysis in database:', verifyData);
      } catch (error) {
        console.error('Error storing session data:', error);
        toast({
          title: "Error",
          description: "Failed to store your vision board data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    createSession();
  }, [answers]);

  const handleEmailSubmit = async () => {
    if (!sessionId) {
      console.error('No session ID available');
      return;
    }
    
    setIsSubmitting(true);
    setPdfGenerated(false);

    try {
      // First, update the email immediately
      console.log('Updating session with email...');
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
      
      console.log('Session updated with email:', emailUpdateData);

      // Verify email update
      const { data: verifyEmailData, error: verifyEmailError } = await supabase
        .from('sessions')
        .select('email')
        .eq('id', sessionId)
        .maybeSingle();

      if (verifyEmailError) {
        console.error('Email verification error:', verifyEmailError);
        throw verifyEmailError;
      }
        
      console.log('Verified email in database:', verifyEmailData);

      // Then generate the comprehensive analysis and PDF
      console.log('Generating comprehensive analysis and PDF...');
      const { analysis: fullAnalysis, pdf } = await generateComprehensiveAnalysis(answers);
      
      if (!fullAnalysis || !pdf) {
        throw new Error('Failed to generate comprehensive analysis or PDF');
      }
      
      // Update session with comprehensive analysis after generation
      console.log('Updating session with comprehensive analysis...');
      const { data: analysisUpdateData, error: analysisUpdateError } = await supabase
        .from('sessions')
        .update({ comprehensive_analysis: fullAnalysis })
        .eq('id', sessionId)
        .select('*')
        .maybeSingle();

      if (analysisUpdateError) {
        console.error('Comprehensive analysis update error:', analysisUpdateError);
        throw analysisUpdateError;
      }

      if (!analysisUpdateData) {
        throw new Error('No data returned after updating comprehensive analysis');
      }
      
      console.log('Session updated with comprehensive analysis:', analysisUpdateData);
      
      // Verify comprehensive analysis update
      const { data: verifyAnalysisData, error: verifyAnalysisError } = await supabase
        .from('sessions')
        .select('comprehensive_analysis')
        .eq('id', sessionId)
        .maybeSingle();

      if (verifyAnalysisError) {
        console.error('Analysis verification error:', verifyAnalysisError);
        throw verifyAnalysisError;
      }
        
      console.log('Verified comprehensive analysis in database:', verifyAnalysisData);
      
      // Handle PDF download
      const pdfBlob = new Blob([new Uint8Array(pdf)], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vision-board-analysis.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setPdfGenerated(true);
      toast({
        title: "Success!",
        description: "Your comprehensive vision board analysis has been downloaded.",
      });
    } catch (error) {
      console.error('Error in email submission process:', error);
      toast({
        title: "Error",
        description: "Failed to generate your comprehensive analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/#{3} (.*?)\n/g, '<h3 class="text-xl font-semibold my-3">$1</h3>')
      .replace(/#{2} (.*?)\n/g, '<h2 class="text-2xl font-bold my-4">$1</h2>')
      .replace(/#{1} (.*?)\n/g, '<h1 class="text-3xl font-bold my-5">$1</h1>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>')
      .replace(/- (.*?)(<br\/>|$)/g, '<li class="ml-4">$1</li>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded">$1</code>');
  };

  return (
    <div
      className={cn(
        "w-full max-w-4xl mx-auto p-8 rounded-2xl bg-card shadow-lg animate-fade-up space-y-8",
        className
      )}
    >
      <h2 className="text-3xl font-bold mb-8 text-center">Your Vision Board</h2>
      
      <AnalysisSection 
        isLoading={isLoading}
        analysis={analysis}
        formatMarkdown={formatMarkdown}
      />

      <EmailSection 
        email={email}
        setEmail={setEmail}
        handleEmailSubmit={handleEmailSubmit}
        isSubmitting={isSubmitting}
        pdfGenerated={pdfGenerated}
      />

      <AnswersSection answers={answers} />
    </div>
  );
};