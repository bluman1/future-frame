import { Question } from '../types';

export const personalGrowthQuestions: Question[] = [
  {
    id: "personal-growth-1",
    category: "Personal Growth",
    question: "What are your top three personal development goals for the year?",
    type: "checkbox",
    options: [
      { label: "Improve self-confidence", value: "self-confidence" },
      { label: "Develop leadership skills", value: "leadership" },
      { label: "Learn a new language", value: "language" },
      { label: "Build better time management habits", value: "time-management" },
      { label: "Read more books", value: "reading" },
      { label: "Other", value: "other" }
    ]
  },
  {
    id: "personal-growth-2",
    category: "Personal Growth",
    question: "What skills or knowledge do you want to learn or improve on?",
    type: "checkbox",
    options: [
      { label: "Technical skills (e.g., coding, design)", value: "technical" },
      { label: "Public speaking or communication", value: "communication" },
      { label: "Creative skills (e.g., painting, writing)", value: "creative" },
      { label: "Financial literacy", value: "financial" },
      { label: "Other", value: "other" }
    ]
  },
  {
    id: "personal-growth-3",
    category: "Personal Growth",
    question: "Are there any habits you'd like to build or break?",
    type: "checkbox",
    options: [
      { label: "Exercise regularly", value: "exercise" },
      { label: "Eat healthier", value: "diet" },
      { label: "Wake up earlier", value: "early-riser" },
      { label: "Break procrastination habits", value: "procrastination" },
      { label: "Other", value: "other" }
    ]
  }
];
