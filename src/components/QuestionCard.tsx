import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface QuestionCardProps {
  question: string;
  type: "text" | "multiple-choice";
  options?: string[];
  onNext: (answer: string) => void;
  onPrevious: () => void;
  className?: string;
}

export const QuestionCard = ({
  question,
  type,
  options = [],
  onNext,
  onPrevious,
  className,
}: QuestionCardProps) => {
  const [answer, setAnswer] = useState("");

  const handleNext = () => {
    if (answer.trim()) {
      onNext(answer);
      setAnswer("");
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-lg mx-auto p-8 rounded-2xl bg-card shadow-lg animate-fade-up",
        className
      )}
    >
      <h2 className="text-2xl font-medium mb-6 text-card-foreground">{question}</h2>
      
      {type === "text" ? (
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="mb-6"
          placeholder="Type your answer here..."
        />
      ) : (
        <div className="space-y-3 mb-6">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => setAnswer(option)}
              className={cn(
                "w-full p-4 text-left rounded-lg transition-all duration-200",
                answer === option
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="transition-all duration-200 hover:translate-x-[-4px]"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!answer.trim()}
          className="transition-all duration-200 hover:translate-x-[4px]"
        >
          Next
        </Button>
      </div>
    </div>
  );
};