import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { generateVisionBoardAnalysis, generateComprehensiveAnalysis } from "@/utils/openai";
import { useToast } from "@/components/ui/use-toast";
import { AnalysisSection } from "./vision-board/AnalysisSection";
import { EmailSection } from "./vision-board/EmailSection";
import { AnswersSection } from "./vision-board/AnswersSection";
import { createNewSession, updateSessionWithEmail } from "@/utils/session-management";
import { supabase } from "@/integrations/supabase/client";

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
        console.log('Generating initial analysis...');
        const result = await generateVisionBoardAnalysis(answers);
        
        if (!result) {
          throw new Error('Failed to generate initial analysis');
        }
        
        console.log('Analysis generated successfully:', result);
        setAnalysis(result);
        
        console.log('Creating new session with answers and analysis:', answers);
        const session = await createNewSession(answers, result);
        console.log('Session created successfully:', session);
        setSessionId(session.id);
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
      console.log('Generating comprehensive analysis and PDF...');
      const { analysis: fullAnalysis, pdf } = await generateComprehensiveAnalysis(answers);
      
      if (!fullAnalysis || !pdf) {
        throw new Error('Failed to generate comprehensive analysis or PDF');
      }

      console.log('Updating session with email and comprehensive analysis...');
      await updateSessionWithEmail(sessionId, email, fullAnalysis);
      console.log('Email and analysis updated successfully');

      // Send email with PDF
      console.log('Sending email with PDF...');
      const { error: emailError } = await supabase.functions.invoke('send-vision-email', {
        body: {
          sessionId,
          email,
          pdfData: Array.from(pdf),
        },
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        throw new Error('Failed to send email');
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
        description: "Your comprehensive vision board analysis has been sent to your email and downloaded.",
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
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-white to-purple-50 py-12 px-4 relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 via-transparent to-pink-100/20 pointer-events-none" />
      
      <div
        className={cn(
          "relative z-10 w-full max-w-4xl mx-auto p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl animate-fade-up space-y-8 border border-purple-100/50",
          className
        )}
      >
        <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Your Vision Board
        </h2>
        
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
    </div>
  );
};