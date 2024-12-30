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

  const formatMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/#{3} (.*?)\n/g, '<h3 class="text-xl font-semibold my-3">$1</h3>') // H3
      .replace(/#{2} (.*?)\n/g, '<h2 class="text-2xl font-bold my-4">$1</h2>') // H2
      .replace(/#{1} (.*?)\n/g, '<h1 class="text-3xl font-bold my-5">$1</h1>') // H1
      .replace(/\n\n/g, '<br/><br/>') // Double line breaks
      .replace(/\n/g, '<br/>') // Single line breaks
      .replace(/- (.*?)(<br\/>|$)/g, '<li class="ml-4">$1</li>') // List items
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded">$1</code>'); // Code
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