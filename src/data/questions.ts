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
  subQuestions?: Question[]; // For conditional questions
  condition?: {
    parentId: string;
    requiredAnswer: string;
  };
};

// Personal Growth Questions
const personalGrowthQuestions: Question[] = [
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

// Career & Business Questions
const careerQuestions: Question[] = [
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

// Financial Goals Questions
const financialQuestions: Question[] = [
  {
    id: "financial-1",
    category: "Financial Goals",
    question: "How much income do you want to earn this year?",
    type: "multiple-choice",
    options: [
      { label: "Less than $50k", value: "<50k" },
      { label: "$50k–$100k", value: "50k-100k" },
      { label: "$100k–$200k", value: "100k-200k" },
      { label: "$200k+", value: "200k+" }
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

// Relationships & Community Questions
const relationshipQuestions: Question[] = [
  {
    id: "relationships-1",
    category: "Relationships & Community",
    question: "What relationships would you like to prioritize this year?",
    type: "checkbox",
    options: [
      { label: "Family", value: "family" },
      { label: "Friends", value: "friends" },
      { label: "Romantic partner", value: "romantic" },
      { label: "Professional network", value: "professional" }
    ]
  },
  {
    id: "relationships-2",
    category: "Relationships & Community",
    question: "How do you plan to nurture these relationships?",
    type: "multiple-choice",
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

// Health & Wellness Questions
const healthQuestions: Question[] = [
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
      { label: "Regular health check-ups", value: "check-ups" }
    ]
  }
];

// Lifestyle & Environment Questions
const lifestyleQuestions: Question[] = [
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

// Creativity & Innovation Questions
const creativityQuestions: Question[] = [
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

// Spirituality & Mindfulness Questions
const spiritualityQuestions: Question[] = [
  {
    id: "spirituality-1",
    category: "Spirituality & Mindfulness",
    question: "What practices resonate most with you?",
    type: "checkbox",
    options: [
      { label: "Meditation or mindfulness", value: "meditation" },
      { label: "Prayer or religious study", value: "prayer" },
      { label: "Journaling for self-reflection", value: "journaling" },
      { label: "Spending time in nature", value: "nature" }
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
      { label: "Monthly", value: "monthly" }
    ]
  }
];

// Legacy & Long-Term Goals Questions
const legacyQuestions: Question[] = [
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

// Combine all questions
export const questions: Question[] = [
  ...personalGrowthQuestions,
  ...careerQuestions,
  ...financialQuestions,
  ...relationshipQuestions,
  ...healthQuestions,
  ...lifestyleQuestions,
  ...creativityQuestions,
  ...spiritualityQuestions,
  ...legacyQuestions
];

// Helper function to get all questions including subquestions
export const getAllQuestions = (questions: Question[]): Question[] => {
  return questions.reduce((acc: Question[], question) => {
    acc.push(question);
    if (question.subQuestions) {
      acc.push(...getAllQuestions(question.subQuestions));
    }
    return acc;
  }, []);
};

// Helper function to get the next question based on current answers
export const getNextQuestion = (
  currentQuestionId: string,
  answers: Record<string, string>
): Question | undefined => {
  const allQuestions = getAllQuestions(questions);
  const currentIndex = allQuestions.findIndex(q => q.id === currentQuestionId);
  
  if (currentIndex === -1) return undefined;
  
  // Look for the next question that should be shown based on conditions
  for (let i = currentIndex + 1; i < allQuestions.length; i++) {
    const question = allQuestions[i];
    
    // If the question has no condition, or its condition is met, return it
    if (!question.condition || 
        (answers[question.condition.parentId] === question.condition.requiredAnswer)) {
      return question;
    }
  }
  
  return undefined;
};