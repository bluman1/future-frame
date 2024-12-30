import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { QuestionOption } from "@/data/questions";

interface QuestionCardProps {
  question: string;
  type: "text" | "multiple-choice" | "checkbox";
  options?: QuestionOption[];
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
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleNext = () => {
    if (type === "checkbox") {
      onNext(selectedOptions.join(", "));
    } else if (answer.trim()) {
      onNext(answer);
    }
    setAnswer("");
    setSelectedOptions([]);
  };

  const handleCheckboxChange = (value: string) => {
    setSelectedOptions((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      }
      return [...prev, value];
    });
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
      ) : type === "checkbox" ? (
        <div className="space-y-3 mb-6">
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={selectedOptions.includes(option.value)}
                onCheckedChange={() => handleCheckboxChange(option.value)}
              />
              <label
                htmlFor={option.value}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => setAnswer(option.value)}
              className={cn(
                "w-full p-4 text-left rounded-lg transition-all duration-200",
                answer === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              )}
            >
              {option.label}
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
          disabled={type === "checkbox" ? selectedOptions.length === 0 : !answer.trim()}
          className="transition-all duration-200 hover:translate-x-[4px]"
        >
          Next
        </Button>
      </div>
    </div>
  );
};