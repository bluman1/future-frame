import { useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { VisionBoard } from "@/components/VisionBoard";

const questions = [
  {
    id: "personal-growth",
    question: "What's your biggest personal growth goal for this year?",
    type: "text" as const,
  },
  {
    id: "career",
    question: "Where do you see your career heading?",
    type: "multiple-choice" as const,
    options: [
      "Starting a new venture",
      "Advancing in current role",
      "Career transition",
      "Learning new skills",
    ],
  },
  {
    id: "health",
    question: "What's your primary health and wellness goal?",
    type: "multiple-choice" as const,
    options: [
      "Regular exercise routine",
      "Better nutrition habits",
      "Mental health focus",
      "Work-life balance",
    ],
  },
  {
    id: "relationships",
    question: "How would you like to improve your relationships this year?",
    type: "text" as const,
  },
];

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
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl mb-8">
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