import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { QuestionOption } from "@/data/types";

interface QuestionCardProps {
  question: string;
  type: "text" | "multiple-choice" | "checkbox";
  options?: QuestionOption[];
  onNext: (answer: string) => void;
  onPrevious: () => void;
  className?: string;
  previousAnswer?: string;
}

export const QuestionCard = ({
  question,
  type,
  options = [],
  onNext,
  onPrevious,
  className,
  previousAnswer = "",
}: QuestionCardProps) => {
  const [answer, setAnswer] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [otherInput, setOtherInput] = useState("");

  // Effect to handle setting previous answers when navigating
  useEffect(() => {
    if (previousAnswer) {
      if (type === "checkbox") {
        const answers = previousAnswer.split(", ");
        const otherAnswer = answers.find(a => a.startsWith("Other: "));
        if (otherAnswer) {
          setOtherInput(otherAnswer.replace("Other: ", ""));
          setSelectedOptions([...answers.filter(a => !a.startsWith("Other: ")), "other"]);
        } else {
          setSelectedOptions(answers);
        }
      } else {
        if (previousAnswer.startsWith("Other: ")) {
          setAnswer("other");
          setOtherInput(previousAnswer.replace("Other: ", ""));
        } else {
          setAnswer(previousAnswer);
        }
      }
    } else {
      // Reset form when there's no previous answer
      setAnswer("");
      setSelectedOptions([]);
      setOtherInput("");
    }
  }, [previousAnswer, type]);

  const handleNext = () => {
    if (type === "checkbox") {
      const answers = selectedOptions.map(opt => {
        if (opt === "other" && otherInput) {
          return `Other: ${otherInput}`;
        }
        return opt;
      });
      onNext(answers.join(", "));
    } else if (answer === "other" && otherInput) {
      onNext(`Other: ${otherInput}`);
    } else if (answer.trim()) {
      onNext(answer);
    }
  };

  const handleCheckboxChange = (value: string) => {
    setSelectedOptions((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      }
      return [...prev, value];
    });
  };

  const showOtherInput = (type === "checkbox" && selectedOptions.includes("other")) ||
    (type === "multiple-choice" && answer === "other");

  return (
    <div
      className={cn(
        "w-full max-w-lg mx-auto p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-purple-100/50 shadow-xl animate-fade-up",
        "hover:shadow-purple-200/50 transition-all duration-300",
        className
      )}
    >
      <h2 className="text-2xl font-medium mb-6 bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
        {question}
      </h2>
      
      {type === "text" ? (
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="mb-6 bg-white/50 border-purple-100 focus:border-purple-200 transition-colors"
          placeholder="Type your answer here..."
        />
      ) : type === "checkbox" ? (
        <div className="space-y-3 mb-6">
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2 group">
              <Checkbox
                id={option.value}
                checked={selectedOptions.includes(option.value)}
                onCheckedChange={() => handleCheckboxChange(option.value)}
                className="border-purple-200 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
              />
              <label
                htmlFor={option.value}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 group-hover:text-purple-700 transition-colors"
              >
                {option.label}
              </label>
            </div>
          ))}
          {showOtherInput && (
            <Input
              value={otherInput}
              onChange={(e) => setOtherInput(e.target.value.slice(0, 100))}
              placeholder="Specify other (max 100 characters)..."
              className="mt-2 bg-white/50 border-purple-100 focus:border-purple-200 transition-colors"
            />
          )}
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
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                  : "bg-white/50 hover:bg-white hover:shadow-md text-gray-700 hover:text-purple-700"
              )}
            >
              {option.label}
            </button>
          ))}
          {showOtherInput && (
            <Input
              value={otherInput}
              onChange={(e) => setOtherInput(e.target.value.slice(0, 100))}
              placeholder="Specify other (max 100 characters)..."
              className="mt-2 bg-white/50 border-purple-100 focus:border-purple-200 transition-colors"
            />
          )}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="transition-all duration-200 hover:translate-x-[-4px] bg-white hover:bg-purple-50"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={
            type === "checkbox"
              ? selectedOptions.length === 0 || (selectedOptions.includes("other") && !otherInput.trim())
              : !answer.trim() || (answer === "other" && !otherInput.trim())
          }
          className="transition-all duration-200 hover:translate-x-[4px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Next
        </Button>
      </div>
    </div>
  );
};