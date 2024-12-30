import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { generateVisionBoardAnalysis } from "@/utils/openai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface VisionBoardProps {
  answers: Record<string, string>;
  className?: string;
}

export const VisionBoard = ({ answers, className }: VisionBoardProps) => {
  const [analysis, setAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const result = await generateVisionBoardAnalysis(answers);
        setAnalysis(result);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to generate vision board analysis. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [answers]);

  const handleEmailSubmit = async () => {
    setIsSubmitting(true);
    // Here you would typically send the email to your backend
    // For now, we'll just show a success message
    toast({
      title: "Success!",
      description: "We'll send your comprehensive vision board review shortly.",
    });
    setIsSubmitting(false);
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
            dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br/>') }}
          />
        )}
      </div>

      {/* Email Collection Form */}
      <div className="p-6 rounded-xl bg-secondary/50 backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-4">Get Your Comprehensive Review</h3>
        <p className="text-muted-foreground mb-4">
          Enter your email to receive a detailed vision board review with personalized recommendations and action steps.
        </p>
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
            {isSubmitting ? "Sending..." : "Send to Email"}
          </Button>
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