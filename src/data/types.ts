export type QuestionOption = {
  label: string;
  value: string;
};

export type Question = {
  id: string;
  category: string;
  question: string;
  type: "text" | "multiple-choice" | "checkbox";
  options?: QuestionOption[];
  subQuestions?: Question[];
  condition?: {
    parentId: string;
    requiredAnswer: string;
  };
};