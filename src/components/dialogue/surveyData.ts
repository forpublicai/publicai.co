// ─── Question Types ───

export interface StatementItem {
  id: string;
  text: string;
  mockResults: { agree: number; disagree: number };
}

export interface ComfortItem {
  id: string;
  text: string;
  mockResults: { veryComfortable: number; comfortable: number; uncomfortable: number; veryUncomfortable: number };
}

export interface ScenarioItem {
  id: string;
  text: string;
  options: { id: string; label: string }[];
  mockResults: Record<string, number>; // option id → percentage
}

export interface RankingItem {
  id: string;
  label: string;
  mockAvgRank: number;
}

export interface ThemePill {
  label: string;
  count: number;
}

// Discriminated union
export type QuestionBlock =
  | {
      type: "statement-block";
      id: string;
      title: string;
      description?: string;
      statements: StatementItem[];
    }
  | {
      type: "comfort-level-block";
      id: string;
      title: string;
      description?: string;
      scenarios: ComfortItem[];
    }
  | {
      type: "scenario-block";
      id: string;
      title: string;
      description?: string;
      scenarios: ScenarioItem[];
    }
  | {
      type: "ranking";
      id: string;
      title: string;
      description?: string;
      pickCount: number;
      items: RankingItem[];
    }
  | {
      type: "priority-ranking";
      id: string;
      title: string;
      description?: string;
      items: RankingItem[];
    }
  | {
      type: "open-text";
      id: string;
      title: string;
      prompts: string[];
      mockThemes: ThemePill[];
    };

export interface SurveySection {
  id: string;
  title: string;
  questions: QuestionBlock[];
}

// ─── Survey Content ───

export const surveySections: SurveySection[] = [
  // ── Section 1: What is this AI, and who should it be for? ──
  {
    id: "s1",
    title: "What is this AI, and who should it be for?",
    questions: [
      {
        type: "open-text",
        id: "s1q1",
        title: "Your hopes for Swiss AI",
        prompts: [
          "What do you hope a Swiss AI could help you with in everyday life?",
        ],
        mockThemes: [
          { label: "Government services", count: 1843 },
          { label: "Translation / multilingual help", count: 1654 },
          { label: "Health information", count: 1201 },
          { label: "Education & learning", count: 987 },
          { label: "Daily tasks & productivity", count: 876 },
          { label: "Local information", count: 634 },
        ],
      },
      {
        type: "statement-block",
        id: "s1q2",
        title: "Who should Swiss AI serve?",
        statements: [
          {
            id: "s1q2a",
            text: "This AI should be designed for everyone, not just people who are good with technology",
            mockResults: { agree: 89, disagree: 11 },
          },
          {
            id: "s1q2b",
            text: "It matters to me that Switzerland has its own AI, rather than using systems built by large foreign companies",
            mockResults: { agree: 74, disagree: 26 },
          },
          {
            id: "s1q2c",
            text: "I trust an AI built in Switzerland more than one built abroad",
            mockResults: { agree: 61, disagree: 39 },
          },
          {
            id: "s1q2d",
            text: "This AI should be available in my language without me having to ask",
            mockResults: { agree: 82, disagree: 18 },
          },
        ],
      },
      {
        type: "ranking",
        id: "s1q3",
        title: "What should Swiss AI help with most?",
        description: "Pick your top 3",
        pickCount: 3,
        items: [
          { id: "info", label: "Getting information and answers", mockAvgRank: 1.8 },
          { id: "work", label: "Help with work or study", mockAvgRank: 2.3 },
          { id: "gov", label: "Government services", mockAvgRank: 2.1 },
          { id: "health", label: "Health and wellbeing", mockAvgRank: 3.2 },
          { id: "learn", label: "Learning and education", mockAvgRank: 2.9 },
          { id: "creative", label: "Creative projects", mockAvgRank: 4.1 },
        ],
      },
    ],
  },

  // ── Section 2: When should the AI say no? ──
  {
    id: "s2",
    title: "When should the AI say no?",
    questions: [
      {
        type: "scenario-block",
        id: "s2q1",
        title: "How should the AI handle sensitive situations?",
        scenarios: [
          {
            id: "s2q1a",
            text: "Someone asks the AI how to take a much higher dose of a medication than prescribed",
            options: [
              { id: "full", label: "Answer the question fully with medical information" },
              { id: "doctor", label: "Suggest they speak with a doctor instead" },
              { id: "decline", label: "Decline to answer" },
            ],
            mockResults: { full: 12, doctor: 71, decline: 17 },
          },
          {
            id: "s2q1b",
            text: "Someone asks the AI for its opinion during a live Swiss vote",
            options: [
              { id: "both", label: "Explain both sides of the issue" },
              { id: "refuse", label: "Refuse to take a position" },
              { id: "argue", label: "Share the stronger arguments on each side" },
            ],
            mockResults: { both: 58, refuse: 28, argue: 14 },
          },
          {
            id: "s2q1c",
            text: "A minor asks the AI a question that would normally be for adults",
            options: [
              { id: "same", label: "Respond the same as for an adult" },
              { id: "careful", label: "Respond more carefully with age-appropriate language" },
              { id: "parent", label: "Suggest they ask a parent or teacher" },
            ],
            mockResults: { same: 8, careful: 54, parent: 38 },
          },
        ],
      },
      {
        type: "open-text",
        id: "s2q2",
        title: "Off-limits topics",
        prompts: [
          "Is there a topic you think the Swiss AI should always refuse to discuss?",
        ],
        mockThemes: [
          { label: "Weapons & violence", count: 2341 },
          { label: "Self-harm", count: 1987 },
          { label: "Election manipulation", count: 1456 },
          { label: "Personal medical advice", count: 1102 },
          { label: "Nothing should be off-limits", count: 876 },
          { label: "Illegal activities", count: 743 },
        ],
      },
      {
        type: "statement-block",
        id: "s2q3",
        title: "How should the AI handle refusals?",
        statements: [
          {
            id: "s2q3a",
            text: "When in doubt, the AI should be cautious rather than risk causing harm",
            mockResults: { agree: 76, disagree: 24 },
          },
          {
            id: "s2q3b",
            text: "Adults should be able to tell the AI they understand the risks and get more detailed answers",
            mockResults: { agree: 68, disagree: 32 },
          },
          {
            id: "s2q3c",
            text: "The AI should always explain why it is refusing, not just say no",
            mockResults: { agree: 91, disagree: 9 },
          },
        ],
      },
    ],
  },

  // ── Section 3: Your privacy and your data ──
  {
    id: "s3",
    title: "Your privacy and your data",
    questions: [
      {
        type: "comfort-level-block",
        id: "s3q1",
        title: "How comfortable are you with the following?",
        scenarios: [
          {
            id: "s3q1a",
            text: "The AI keeping a record of your conversation so it can help you better next time",
            mockResults: { veryComfortable: 14, comfortable: 31, uncomfortable: 35, veryUncomfortable: 20 },
          },
          {
            id: "s3q1b",
            text: "Your conversation being reviewed by a person to improve the system",
            mockResults: { veryComfortable: 8, comfortable: 22, uncomfortable: 38, veryUncomfortable: 32 },
          },
          {
            id: "s3q1c",
            text: "Your data being stored on servers outside Switzerland",
            mockResults: { veryComfortable: 6, comfortable: 18, uncomfortable: 34, veryUncomfortable: 42 },
          },
          {
            id: "s3q1d",
            text: "The AI remembering things you told it in previous conversations",
            mockResults: { veryComfortable: 12, comfortable: 28, uncomfortable: 36, veryUncomfortable: 24 },
          },
        ],
      },
      {
        type: "statement-block",
        id: "s3q2",
        title: "Your data preferences",
        statements: [
          {
            id: "s3q2a",
            text: "I would rather the AI forget my conversations after each session",
            mockResults: { agree: 57, disagree: 43 },
          },
          {
            id: "s3q2b",
            text: "I'm willing to share more information for better, more personalised answers",
            mockResults: { agree: 41, disagree: 59 },
          },
          {
            id: "s3q2c",
            text: "The AI should always tell me what it remembers about me",
            mockResults: { agree: 88, disagree: 12 },
          },
          {
            id: "s3q2d",
            text: "Storing data in Switzerland is important, even if it means slower or more expensive service",
            mockResults: { agree: 72, disagree: 28 },
          },
        ],
      },
      {
        type: "open-text",
        id: "s3q3",
        title: "Trust and personal data",
        prompts: [
          "What would make you trust this AI with personal information? What would put you off?",
        ],
        mockThemes: [
          { label: "Transparency about data use", count: 2156 },
          { label: "Swiss data storage", count: 1834 },
          { label: "Ability to delete my data", count: 1567 },
          { label: "Government oversight", count: 1203 },
          { label: "No commercial use of data", count: 987 },
          { label: "Clear privacy policy", count: 876 },
        ],
      },
    ],
  },

  // ── Section 4: Should the AI be different in different places? ──
  {
    id: "s4",
    title: "Should the AI be different in different places?",
    questions: [
      {
        type: "statement-block",
        id: "s4q1",
        title: "Regional differences",
        statements: [
          {
            id: "s4q1a",
            text: "The AI should respond in my local language automatically",
            mockResults: { agree: 79, disagree: 21 },
          },
          {
            id: "s4q1b",
            text: "It would bother me if the AI behaved differently in another part of Switzerland",
            mockResults: { agree: 43, disagree: 57 },
          },
          {
            id: "s4q1c",
            text: "Local communities should be able to set some of their own rules for the AI",
            mockResults: { agree: 52, disagree: 48 },
          },
          {
            id: "s4q1d",
            text: "The AI should know about local laws and customs, not just national ones",
            mockResults: { agree: 84, disagree: 16 },
          },
        ],
      },
      {
        type: "scenario-block",
        id: "s4q2",
        title: "Conflicting regional rules",
        scenarios: [
          {
            id: "s4q2a",
            text: "Two cantons have different rules for how the AI should handle a topic. A person from one canton asks the AI about this topic.",
            options: [
              { id: "local", label: "Follow the rules of the person's canton" },
              { id: "national", label: "Follow a single national standard" },
              { id: "explain", label: "Explain the difference and let the person decide" },
            ],
            mockResults: { local: 24, national: 31, explain: 45 },
          },
        ],
      },
      {
        type: "open-text",
        id: "s4q3",
        title: "Local understanding",
        prompts: [
          "Is there anything about where you live that the AI should understand better?",
        ],
        mockThemes: [
          { label: "Local dialect / language nuances", count: 1876 },
          { label: "Regional traditions & customs", count: 1543 },
          { label: "Local government services", count: 1234 },
          { label: "Geographic & weather context", count: 987 },
          { label: "Cultural sensitivities", count: 765 },
        ],
      },
    ],
  },

  // ── Section 5: Who is in charge? ──
  {
    id: "s5",
    title: "Who is in charge?",
    questions: [
      {
        type: "statement-block",
        id: "s5q1",
        title: "AI principles",
        statements: [
          {
            id: "s5q1a",
            text: "The AI should always be honest, even if the truth is uncomfortable",
            mockResults: { agree: 87, disagree: 13 },
          },
          {
            id: "s5q1b",
            text: "The AI should make clear when it is not sure about something",
            mockResults: { agree: 95, disagree: 5 },
          },
          {
            id: "s5q1c",
            text: "The AI should never try to influence what you believe politically",
            mockResults: { agree: 83, disagree: 17 },
          },
          {
            id: "s5q1d",
            text: "The AI should consider long-term consequences, not just give you what you want right now",
            mockResults: { agree: 71, disagree: 29 },
          },
          {
            id: "s5q1e",
            text: "The AI should always remind you that the final decision is yours",
            mockResults: { agree: 78, disagree: 22 },
          },
        ],
      },
      {
        type: "priority-ranking",
        id: "s5q2",
        title: "When these principles conflict, what comes first?",
        description: "Rank from most important (1) to least important (4)",
        items: [
          { id: "accuracy", label: "Giving the most accurate answer", mockAvgRank: 1.9 },
          { id: "harm", label: "Protecting people from harm", mockAvgRank: 2.1 },
          { id: "choice", label: "Respecting your right to choose", mockAvgRank: 2.6 },
          { id: "fairness", label: "Supporting fair decisions for everyone", mockAvgRank: 3.4 },
        ],
      },
      {
        type: "open-text",
        id: "s5q3",
        title: "Missing principles",
        prompts: ["Is there a principle you think is missing?"],
        mockThemes: [
          { label: "Accountability & responsibility", count: 1654 },
          { label: "Environmental sustainability", count: 1123 },
          { label: "Cultural sensitivity", count: 987 },
          { label: "Accessibility for disabled users", count: 876 },
          { label: "Protection of children", count: 765 },
        ],
      },
      {
        type: "statement-block",
        id: "s5q4",
        title: "Who should decide the rules?",
        statements: [
          {
            id: "s5q4a",
            text: "Citizens should be able to vote on the rules guiding this AI",
            mockResults: { agree: 67, disagree: 33 },
          },
          {
            id: "s5q4b",
            text: "The researchers who built this AI should have the final say on how it behaves",
            mockResults: { agree: 29, disagree: 71 },
          },
          {
            id: "s5q4c",
            text: "There should be an independent oversight body that reviews the AI regularly",
            mockResults: { agree: 86, disagree: 14 },
          },
          {
            id: "s5q4d",
            text: "The rules guiding this AI should be reviewed and updated every year",
            mockResults: { agree: 81, disagree: 19 },
          },
        ],
      },
    ],
  },

  // ── Section 6: The bigger picture ──
  {
    id: "s6",
    title: "The bigger picture",
    questions: [
      {
        type: "open-text",
        id: "s6q1",
        title: "Your hopes and concerns",
        prompts: [
          "What is the one thing you most want this AI to get right?",
          "What is the one thing you are most worried it could get wrong?",
        ],
        mockThemes: [
          { label: "Accuracy & truthfulness", count: 2543 },
          { label: "Privacy protection", count: 2187 },
          { label: "Bias & fairness", count: 1876 },
          { label: "Manipulation & misuse", count: 1654 },
          { label: "Democratic values", count: 1234 },
          { label: "Accessibility", count: 987 },
        ],
      },
      {
        type: "statement-block",
        id: "s6q2",
        title: "Looking ahead",
        statements: [
          {
            id: "s6q2a",
            text: "AI will make life in Switzerland better over the next 10 years",
            mockResults: { agree: 62, disagree: 38 },
          },
          {
            id: "s6q2b",
            text: "I worry that AI will make it harder to tell what is true",
            mockResults: { agree: 74, disagree: 26 },
          },
          {
            id: "s6q2c",
            text: "Switzerland should move carefully with AI, even if other countries move faster",
            mockResults: { agree: 69, disagree: 31 },
          },
          {
            id: "s6q2d",
            text: "I feel like I have a say in how AI develops in this country",
            mockResults: { agree: 34, disagree: 66 },
          },
        ],
      },
    ],
  },
];

// Helper to flatten all questions
export function getAllQuestions(): { sectionIndex: number; question: QuestionBlock }[] {
  return surveySections.flatMap((section, sectionIndex) =>
    section.questions.map((question) => ({ sectionIndex, question }))
  );
}

export function getTotalQuestionCount(): number {
  return surveySections.reduce((sum, s) => sum + s.questions.length, 0);
}
