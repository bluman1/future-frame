import { Question } from '../types';

export const careerQuestions: Question[] = [
  {
    id: "career-1",
    category: "Career & Business",
    question: "What is your ultimate career or business goal for the year?",
    type: "multiple-choice",
    options: [
      { label: "Get a promotion", value: "promotion" },
      { label: "Start a new job", value: "new-job" },
      { label: "Launch my own business", value: "start-business" },
      { label: "Expand my current business", value: "expand-business" },
      { label: "Other", value: "other" }
    ]
  },
  {
    id: "career-2",
    category: "Career & Business",
    question: "Do you want to acquire new skills or certifications to boost your career?",
    type: "multiple-choice",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" }
    ],
    subQuestions: [
      {
        id: "career-2-1",
        category: "Career & Business",
        question: "Which certifications interest you?",
        type: "checkbox",
        options: [
          { label: "Project management (e.g., PMP, Scrum)", value: "project-management" },
          { label: "Technical certifications (e.g., AWS, AI)", value: "technical" },
          { label: "Creative certifications (e.g., Adobe, UX Design)", value: "creative" },
          { label: "Other", value: "other" }
        ],
        condition: {
          parentId: "career-2",
          requiredAnswer: "yes"
        }
      }
    ]
  },
  {
    id: "career-3",
    category: "Career & Business",
    question: "What motivates you most in your career?",
    type: "multiple-choice",
    options: [
      { label: "Money", value: "money" },
      { label: "Recognition", value: "recognition" },
      { label: "Creative freedom", value: "creative-freedom" },
      { label: "Work-life balance", value: "work-life-balance" },
      { label: "Other", value: "other" }
    ]
  }
];
