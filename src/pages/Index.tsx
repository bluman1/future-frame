import { useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { VisionBoard } from "@/components/VisionBoard";
import { questions } from "@/data/questions";

const Index = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);

  const progress = ((currentQuestionIndex) / questions.length) * 100;

  const handleNext = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.question]: answer,
    }));

    if (currentQuestionIndex === questions.length - 1) {
      setIsComplete(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (isComplete) {
    return <VisionBoard answers={answers} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-4xl mb-8">
        <h2 className="text-xl font-medium text-muted-foreground mb-4">
          {questions[currentQuestionIndex].category}
        </h2>
        <ProgressBar progress={progress} />
      </div>
      
      <QuestionCard
        {...questions[currentQuestionIndex]}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
};

export default Index;