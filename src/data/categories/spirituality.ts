import { Question } from '../types';

export const spiritualityQuestions: Question[] = [
  {
    id: "spirituality-1",
    category: "Spirituality & Mindfulness",
    question: "What practices resonate most with you?",
    type: "checkbox",
    options: [
      { label: "Meditation or mindfulness", value: "meditation" },
      { label: "Prayer or religious study", value: "prayer" },
      { label: "Journaling for self-reflection", value: "journaling" },
      { label: "Spending time in nature", value: "nature" },
      { label: "Other", value: "other" }
    ]
  },
  {
    id: "spirituality-2",
    category: "Spirituality & Mindfulness",
    question: "How often will you set aside time for mindfulness?",
    type: "multiple-choice",
    options: [
      { label: "Daily", value: "daily" },
      { label: "Weekly", value: "weekly" },
      { label: "Monthly", value: "monthly" },
      { label: "Other", value: "other" }
    ]
  }
];
