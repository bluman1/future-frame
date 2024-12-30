import { Question } from '../types';

export const lifestyleQuestions: Question[] = [
  {
    id: "lifestyle-1",
    category: "Lifestyle & Environment",
    question: "What kind of living environment do you envision for yourself?",
    type: "multiple-choice",
    options: [
      { label: "A peaceful, minimalist home", value: "minimalist" },
      { label: "A luxury apartment in the city", value: "luxury" },
      { label: "A home with a large outdoor space", value: "outdoor" },
      { label: "Other", value: "other" }
    ]
  },
  {
    id: "lifestyle-2",
    category: "Lifestyle & Environment",
    question: "What hobbies or leisure activities do you want to focus on?",
    type: "checkbox",
    options: [
      { label: "Travel", value: "travel" },
      { label: "Music", value: "music" },
      { label: "Sports or outdoor activities", value: "sports" },
      { label: "Creative arts", value: "arts" },
      { label: "Other", value: "other" }
    ]
  },
  {
    id: "lifestyle-3",
    category: "Lifestyle & Environment",
    question: "Where would you like to travel this year?",
    type: "text"
  }
];
