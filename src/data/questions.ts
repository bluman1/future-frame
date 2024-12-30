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
};

export const questions: Question[] = [
  {
    id: "personal-growth-1",
    category: "Personal Growth",
    question: "What are your top three personal development goals for the year?",
    type: "multiple-choice",
    options: [
      { label: "Improve self-confidence", value: "self-confidence" },
      { label: "Develop leadership skills", value: "leadership" },
      { label: "Learn a new language", value: "language" },
      { label: "Build better time management habits", value: "time-management" },
      { label: "Read more books", value: "reading" },
    ],
  },
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
    ],
  },
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
    ],
  },
  {
    id: "relationships-1",
    category: "Relationships & Community",
    question: "What relationships would you like to prioritize this year?",
    type: "multiple-choice",
    options: [
      { label: "Family", value: "family" },
      { label: "Friends", value: "friends" },
      { label: "Romantic partner", value: "romantic" },
      { label: "Professional network", value: "professional" },
    ],
  },
  {
    id: "health-1",
    category: "Health & Wellness",
    question: "What are your top health goals?",
    type: "multiple-choice",
    options: [
      { label: "Exercise regularly", value: "exercise" },
      { label: "Lose weight", value: "weight-loss" },
      { label: "Gain muscle", value: "muscle-gain" },
      { label: "Improve mental health", value: "mental-health" },
    ],
  },
  {
    id: "lifestyle-1",
    category: "Lifestyle & Environment",
    question: "Where would you like to travel this year?",
    type: "text",
  },
  {
    id: "creativity-1",
    category: "Creativity & Innovation",
    question: "What creative projects do you want to work on?",
    type: "multiple-choice",
    options: [
      { label: "Writing a book or blog", value: "writing" },
      { label: "Starting a podcast", value: "podcast" },
      { label: "Building an innovative product or app", value: "product" },
    ],
  },
  {
    id: "spirituality-1",
    category: "Spirituality & Mindfulness",
    question: "What practices resonate most with you?",
    type: "multiple-choice",
    options: [
      { label: "Meditation or mindfulness", value: "meditation" },
      { label: "Prayer or religious study", value: "prayer" },
      { label: "Journaling for self-reflection", value: "journaling" },
      { label: "Spending time in nature", value: "nature" },
    ],
  },
  {
    id: "legacy-1",
    category: "Legacy & Long-Term Goals",
    question: "What legacy do you want to leave by the end of the year?",
    type: "text",
  },
];