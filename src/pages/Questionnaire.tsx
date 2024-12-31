import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { VisionBoard } from "@/components/VisionBoard";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { questions, getAllQuestions, getNextQuestion } from "@/data/questions";

const Index = () => {
  const navigate = useNavigate();
  const [currentQuestionId, setCurrentQuestionId] = useState(questions[0].id);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionHistory, setQuestionHistory] = useState<string[]>([questions[0].id]);
  const [isComplete, setIsComplete] = useState(false);

  const allQuestions = getAllQuestions(questions);
  const currentQuestion = allQuestions.find(q => q.id === currentQuestionId);
  const progress = (Object.keys(answers).length / allQuestions.length) * 100;

  const handleNext = (answer: string) => {
    const updatedAnswers = { ...answers, [currentQuestion!.question]: answer };
    setAnswers(updatedAnswers);

    const nextQuestion = getNextQuestion(currentQuestionId, updatedAnswers);
    if (nextQuestion) {
      setCurrentQuestionId(nextQuestion.id);
      setQuestionHistory(prev => [...prev, nextQuestion.id]);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (questionHistory.length > 1) {
      const newHistory = [...questionHistory];
      newHistory.pop();
      const previousQuestionId = newHistory[newHistory.length - 1];
      setCurrentQuestionId(previousQuestionId);
      setQuestionHistory(newHistory);
    }
  };

  if (isComplete) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          className="fixed top-4 left-4 z-50"
          onClick={() => navigate("/")}
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <VisionBoard answers={answers} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 via-transparent to-pink-100/20 pointer-events-none" />
      
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200"
        onClick={() => navigate("/")}
      >
        <Home className="mr-2 h-4 w-4" />
        Back to Home
      </Button>
      
      <div className="w-full max-w-4xl mb-8 relative z-10">
        <h2 className="text-xl font-medium text-purple-700/80 mb-4 text-center">
          {currentQuestion?.category}
        </h2>
        <ProgressBar progress={progress} />
      </div>
      
      {currentQuestion && (
        <QuestionCard
          {...currentQuestion}
          onNext={handleNext}
          onPrevious={handlePrevious}
          previousAnswer={answers[currentQuestion.question]}
          className="relative z-10"
        />
      )}
    </div>
  );
};

export default Index;