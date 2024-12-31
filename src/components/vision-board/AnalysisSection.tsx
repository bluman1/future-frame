import { toast } from "@/components/ui/use-toast";

interface AnalysisSectionProps {
  isLoading: boolean;
  analysis: string;
  formatMarkdown: (text: string) => string;
}

export const AnalysisSection = ({ isLoading, analysis, formatMarkdown }: AnalysisSectionProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 backdrop-blur-sm border border-purple-100/50 transition-all duration-300 hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/3 to-pink-500/3" />
      <div className="relative p-8">
        <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Your Personal Analysis
        </h3>
        <div 
          className="prose prose-sm max-w-none prose-headings:text-purple-900 prose-p:text-gray-600 prose-strong:text-purple-700 prose-em:text-pink-600"
          dangerouslySetInnerHTML={{ __html: formatMarkdown(analysis) }}
        />
      </div>
    </div>
  );
};