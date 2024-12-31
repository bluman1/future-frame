import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { generateVisionBoardAnalysis, generateComprehensiveAnalysis } from "@/utils/openai";
import { useToast } from "@/components/ui/use-toast";
import { AnalysisSection } from "./vision-board/AnalysisSection";
import { EmailSection } from "./vision-board/EmailSection";
import { AnswersSection } from "./vision-board/AnswersSection";
import { createNewSession, updateSessionWithAnalysis, updateSessionWithEmail } from "@/utils/session-management";

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
    const initializeSession = async () => {
      if (sessionId) return; // Skip if we already have a session

      setIsLoading(true);
      try {
        console.log('Creating new session with answers:', answers);
        const session = await createNewSession(answers);
        console.log('Session created successfully:', session);
        setSessionId(session.id);
        
        console.log('Generating initial analysis...');
        const result = await generateVisionBoardAnalysis(answers);
        
        if (!result) {
          throw new Error('Failed to generate initial analysis');
        }
        
        console.log('Analysis generated successfully:', result);
        setAnalysis(result);
        
        console.log('Updating session with analysis...');
        await updateSessionWithAnalysis(session.id, result);
        console.log('Session updated with analysis');
      } catch (error) {
        console.error('Error initializing session:', error);
        toast({
          title: "Error",
          description: "Failed to initialize your vision board. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [answers, sessionId, toast]);

  const handleEmailSubmit = async () => {
    if (!sessionId) {
      console.error('No session ID available');
      toast({
        title: "Error",
        description: "Session not found. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setPdfGenerated(false);

    try {
      console.log('Updating session with email...');
      await updateSessionWithEmail(sessionId, email);
      console.log('Email updated successfully');

      console.log('Generating comprehensive analysis and PDF...');
      const { analysis: fullAnalysis, pdf } = await generateComprehensiveAnalysis(answers);
      
      if (!fullAnalysis || !pdf) {
        throw new Error('Failed to generate comprehensive analysis or PDF');
      }

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