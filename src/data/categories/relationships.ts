import { Question } from '../types';

export const relationshipQuestions: Question[] = [
  {
    id: "relationships-1",
    category: "Relationships & Community",
    question: "What relationships would you like to prioritize this year?",
    type: "checkbox",
    options: [
      { label: "Family", value: "family" },
      { label: "Friends", value: "friends" },
      { label: "Romantic partner", value: "romantic" },
      { label: "Professional network", value: "professional" },
      { label: "Other", value: "other" }
    ]
  },
  {
    id: "relationships-2",
    category: "Relationships & Community",
    question: "How do you plan to nurture these relationships?",
    type: "checkbox",  // Changed from multiple-choice to checkbox
    options: [
      { label: "Regular meetups or calls", value: "regular-contact" },
      { label: "Creating shared experiences", value: "shared-experiences" },
      { label: "Attending social events", value: "social-events" },
      { label: "Other", value: "other" }
    ]
  },
  {
    id: "relationships-3",
    category: "Relationships & Community",
    question: "Would you like to give back to your community this year?",
    type: "multiple-choice",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" }
    ],
    subQuestions: [
      {
        id: "relationships-3-1",
        category: "Relationships & Community",
        question: "How would you like to give back?",
        type: "checkbox",
        options: [
          { label: "Volunteer work", value: "volunteer" },
          { label: "Financial donations", value: "donations" },
          { label: "Mentorship", value: "mentorship" },
          { label: "Other", value: "other" }
        ],
        condition: {
          parentId: "relationships-3",
          requiredAnswer: "yes"
        }
      }
    ]
  }
];
