import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { generateVisionBoardAnalysis, generateComprehensiveAnalysis } from "@/utils/openai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
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
    const createSession = async () => {
      try {
        // Create a new session
        const { data: session, error: sessionError } = await supabase
          .from('sessions')
          .insert({})
          .select()
          .single();

        if (sessionError) {
          console.error('Session creation error:', sessionError);
          throw sessionError;
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
        setAnalysis(result);

        // Update session with short analysis immediately after generation
        console.log('Updating session with short analysis...');
        const { data: updateData, error: updateError } = await supabase
          .from('sessions')
          .update({ short_analysis: result })
          .eq('id', session.id)
          .select();

        if (updateError) {
          console.error('Short analysis update error:', updateError);
          throw updateError;
        }
        
        console.log('Session updated with short analysis:', updateData);
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
        .select();

      if (emailUpdateError) {
        console.error('Email update error:', emailUpdateError);
        throw emailUpdateError;
      }
      
      console.log('Session updated with email:', emailUpdateData);

      // Then generate the comprehensive analysis and PDF
      console.log('Generating comprehensive analysis and PDF...');
      const { analysis: fullAnalysis, pdf } = await generateComprehensiveAnalysis(answers);
      
      // Update session with comprehensive analysis after generation
      console.log('Updating session with comprehensive analysis...');
      const { data: analysisUpdateData, error: analysisUpdateError } = await supabase
        .from('sessions')
        .update({ comprehensive_analysis: fullAnalysis })
        .eq('id', sessionId)
        .select();

      if (analysisUpdateError) {
        console.error('Comprehensive analysis update error:', analysisUpdateError);
        throw analysisUpdateError;
      }
      
      console.log('Session updated with comprehensive analysis:', analysisUpdateData);
      
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
      
      {/* AI Analysis Section */}
      <div className="mb-8 p-6 rounded-xl bg-primary/5 backdrop-blur-sm">
        <h3 className="text-2xl font-semibold mb-4">Your Personal Analysis</h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(analysis) }}
          />
        )}
      </div>

      {/* Email Collection Form */}
      <div className="p-6 rounded-xl bg-secondary/50 backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-4">Get Your Comprehensive Review</h3>
        <p className="text-muted-foreground mb-4">
          Enter your email to receive a detailed vision board review with personalized recommendations, action steps, and a comprehensive PDF report.
        </p>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleEmailSubmit}
              disabled={!email || isSubmitting}
            >
              {isSubmitting ? "Generating..." : "Download PDF Report"}
            </Button>
          </div>
          {pdfGenerated && (
            <div className="text-sm text-green-600 font-medium">
              ✓ Your PDF report has been successfully generated and downloaded!
            </div>
          )}
        </div>
      </div>

      {/* Original Answers Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(answers).map(([question, answer]) => (
          <div
            key={question}
            className="p-6 rounded-xl bg-secondary/50 backdrop-blur-sm"
          >
            <h3 className="font-medium text-sm text-muted-foreground mb-2">
              {question}
            </h3>
            <p className="text-lg">{answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};