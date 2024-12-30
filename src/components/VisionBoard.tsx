import { cn } from "@/lib/utils";

interface VisionBoardProps {
  answers: Record<string, string>;
  className?: string;
}

export const VisionBoard = ({ answers, className }: VisionBoardProps) => {
  return (
    <div
      className={cn(
        "w-full max-w-4xl mx-auto p-8 rounded-2xl bg-card shadow-lg animate-fade-up",
        className
      )}
    >
      <h2 className="text-3xl font-bold mb-8 text-center">Your Vision Board</h2>
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