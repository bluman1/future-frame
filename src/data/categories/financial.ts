import { Question } from '../types';

export const financialQuestions: Question[] = [
  {
    id: "financial-1",
    category: "Financial Goals",
    question: "How much income do you want to earn this year?",
    type: "multiple-choice",
    options: [
      { label: "Less than $50k", value: "<50k" },
      { label: "$50k–$100k", value: "50k-100k" },
      { label: "$100k–$200k", value: "100k-200k" },
      { label: "$200k+", value: "200k+" },
      { label: "Other", value: "other" }
    ]
  },
  {
    id: "financial-2",
    category: "Financial Goals",
    question: "What financial milestones are you aiming for?",
    type: "checkbox",
    options: [
      { label: "Build an emergency fund", value: "emergency-fund" },
      { label: "Start or grow investments", value: "investments" },
      { label: "Pay off debt", value: "debt" },
      { label: "Save for a major purchase", value: "major-purchase" },
      { label: "Other", value: "other" }
    ]
  },
  {
    id: "financial-3",
    category: "Financial Goals",
    question: "How will you track your financial progress?",
    type: "multiple-choice",
    options: [
      { label: "Budgeting apps", value: "apps" },
      { label: "Manual tracking (spreadsheets)", value: "spreadsheets" },
      { label: "Working with a financial advisor", value: "advisor" },
      { label: "Other", value: "other" }
    ]
  }
];
