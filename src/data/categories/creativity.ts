import { Question } from '../types';

export const creativityQuestions: Question[] = [
  {
    id: "creativity-1",
    category: "Creativity & Innovation",
    question: "What creative projects do you want to work on?",
    type: "checkbox",
    options: [
      { label: "Writing a book or blog", value: "writing" },
      { label: "Starting a podcast", value: "podcast" },
      { label: "Building an innovative product or app", value: "product" },
      { label: "Other", value: "other" }
    ]
  },
  {
    id: "creativity-2",
    category: "Creativity & Innovation",
    question: "How will you find time for creative pursuits?",
    type: "multiple-choice",
    options: [
      { label: "Setting aside specific hours each week", value: "scheduled" },
      { label: "Joining creative workshops or groups", value: "workshops" },
      { label: "Other", value: "other" }
    ]
  }
];
