import { Question } from './types';
import { personalGrowthQuestions } from './categories/personalGrowth';
import { careerQuestions } from './categories/career';
import { financialQuestions } from './categories/financial';
import { relationshipQuestions } from './categories/relationships';
import { healthQuestions } from './categories/health';
import { lifestyleQuestions } from './categories/lifestyle';
import { creativityQuestions } from './categories/creativity';
import { spiritualityQuestions } from './categories/spirituality';
import { legacyQuestions } from './categories/legacy';

// Combine all questions
export const questions: Question[] = [
  ...personalGrowthQuestions,
  ...careerQuestions,
  ...financialQuestions,
  ...relationshipQuestions,
  ...healthQuestions,
  ...lifestyleQuestions,
  ...creativityQuestions,
  ...spiritualityQuestions,
  ...legacyQuestions
];

// Helper function to get all questions including subquestions
export const getAllQuestions = (questions: Question[]): Question[] => {
  return questions.reduce((acc: Question[], question) => {
    acc.push(question);
    if (question.subQuestions) {
      acc.push(...getAllQuestions(question.subQuestions));
    }
    return acc;
  }, []);
};

// Helper function to get the next question based on current answers
export const getNextQuestion = (
  currentQuestionId: string,
  answers: Record<string, string>
): Question | undefined => {
  const allQuestions = getAllQuestions(questions);
  const currentIndex = allQuestions.findIndex(q => q.id === currentQuestionId);
  
  if (currentIndex === -1) return undefined;
  
  // Look for the next question that should be shown based on conditions
  for (let i = currentIndex + 1; i < allQuestions.length; i++) {
    const question = allQuestions[i];
    
    // If the question has no condition, or its condition is met, return it
    if (!question.condition || 
        (answers[question.condition.parentId] === question.condition.requiredAnswer)) {
      return question;
    }
  }
  
  return undefined;
};