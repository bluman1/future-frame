import { toast } from "@/components/ui/use-toast";

interface AnalysisSectionProps {
  isLoading: boolean;
  analysis: string;
  formatMarkdown: (text: string) => string;
}

export const AnalysisSection = ({ isLoading, analysis, formatMarkdown }: AnalysisSectionProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="mb-8 p-6 rounded-xl bg-primary/5 backdrop-blur-sm">
      <h3 className="text-2xl font-semibold mb-4">Your Personal Analysis</h3>
      <div 
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: formatMarkdown(analysis) }}
      />
    </div>
  );
};