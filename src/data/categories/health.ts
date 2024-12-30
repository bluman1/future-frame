import { Question } from '../types';

export const healthQuestions: Question[] = [
  {
    id: "health-1",
    category: "Health & Wellness",
    question: "What are your top health goals?",
    type: "checkbox",
    options: [
      { label: "Exercise regularly", value: "exercise" },
      { label: "Lose weight", value: "weight-loss" },
      { label: "Gain muscle", value: "muscle-gain" },
      { label: "Improve mental health", value: "mental-health" },
      { label: "Other", value: "other" }
    ]
  },
  {
    id: "health-2",
    category: "Health & Wellness",
    question: "How often do you plan to work out?",
    type: "multiple-choice",
    options: [
      { label: "Daily", value: "daily" },
      { label: "3–5 times a week", value: "3-5-times" },
      { label: "1–2 times a week", value: "1-2-times" },
      { label: "Occasionally", value: "occasionally" }
    ]
  },
  {
    id: "health-3",
    category: "Health & Wellness",
    question: "What wellness practices would you like to adopt?",
    type: "checkbox",
    options: [
      { label: "Yoga or meditation", value: "yoga-meditation" },
      { label: "Journaling", value: "journaling" },
      { label: "Balanced meal prep", value: "meal-prep" },
      { label: "Regular health check-ups", value: "check-ups" },
      { label: "Other", value: "other" }
    ]
  }
];
