import { Question } from '../types';

export const legacyQuestions: Question[] = [
  {
    id: "legacy-1",
    category: "Legacy & Long-Term Goals",
    question: "What legacy do you want to leave by the end of the year?",
    type: "text"
  },
  {
    id: "legacy-2",
    category: "Legacy & Long-Term Goals",
    question: "What actions this year will contribute to your 5- or 10-year goals?",
    type: "checkbox",
    options: [
      { label: "Expanding your professional network", value: "network" },
      { label: "Investing in personal growth", value: "growth" },
      { label: "Saving or investing for long-term stability", value: "investing" },
      { label: "Other", value: "other" }
    ]
  }
];
