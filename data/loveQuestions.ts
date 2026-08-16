export type LoveCategory =
  | "emotion"
  | "communication"
  | "trust"
  | "conflict"
  | "intimacy"
  | "future";

export type LoveQuestion = {
  id: number;
  question: string;
  category: LoveCategory;
  facet: string;
  reverse: boolean;
};

export const loveQuestions: LoveQuestion[] = [
  // 1. Emotional Connection
  {
    id: 1,
    question: "love_q_1",
    category: "emotion",
    facet: "emotional_openness",
    reverse: false,
  },
  {
    id: 2,
    question: "love_q_2",
    category: "emotion",
    facet: "feeling_understood",
    reverse: false,
  },
  {
    id: 3,
    question: "love_q_3",
    category: "emotion",
    facet: "emotional_support",
    reverse: false,
  },
  {
    id: 4,
    question: "love_q_4",
    category: "emotion",
    facet: "emotional_closeness",
    reverse: true,
  },
  {
    id: 5,
    question: "love_q_5",
    category: "emotion",
    facet: "emotional_awareness",
    reverse: false,
  },

  // 2. Communication & Understanding
  {
    id: 6,
    question: "love_q_6",
    category: "communication",
    facet: "open_communication",
    reverse: false,
  },
  {
    id: 7,
    question: "love_q_7",
    category: "communication",
    facet: "listening",
    reverse: false,
  },
  {
    id: 8,
    question: "love_q_8",
    category: "communication",
    facet: "self_expression",
    reverse: false,
  },
  {
    id: 9,
    question: "love_q_9",
    category: "communication",
    facet: "difficult_conversations",
    reverse: true,
  },
  {
    id: 10,
    question: "love_q_10",
    category: "communication",
    facet: "clarification",
    reverse: false,
  },

  // 3. Trust & Security
  {
    id: 11,
    question: "love_q_11",
    category: "trust",
    facet: "trust",
    reverse: false,
  },
  {
    id: 12,
    question: "love_q_12",
    category: "trust",
    facet: "reliability",
    reverse: false,
  },
  {
    id: 13,
    question: "love_q_13",
    category: "trust",
    facet: "psychological_safety",
    reverse: false,
  },
  {
    id: 14,
    question: "love_q_14",
    category: "trust",
    facet: "insecurity_jealousy",
    reverse: true,
  },
  {
    id: 15,
    question: "love_q_15",
    category: "trust",
    facet: "dependability",
    reverse: false,
  },

  // 4. Conflict Resolution
  {
    id: 16,
    question: "love_q_16",
    category: "conflict",
    facet: "respectful_conflict",
    reverse: false,
  },
  {
    id: 17,
    question: "love_q_17",
    category: "conflict",
    facet: "destructive_conflict",
    reverse: true,
  },
  {
    id: 18,
    question: "love_q_18",
    category: "conflict",
    facet: "problem_engagement",
    reverse: false,
  },
  {
    id: 19,
    question: "love_q_19",
    category: "conflict",
    facet: "compromise",
    reverse: false,
  },
  {
    id: 20,
    question: "love_q_20",
    category: "conflict",
    facet: "repair_after_conflict",
    reverse: true,
  },

  // 5. Intimacy & Affection
  {
    id: 21,
    question: "love_q_21",
    category: "intimacy",
    facet: "affection_expression",
    reverse: false,
  },
  {
    id: 22,
    question: "love_q_22",
    category: "intimacy",
    facet: "feeling_loved",
    reverse: false,
  },
  {
    id: 23,
    question: "love_q_23",
    category: "intimacy",
    facet: "physical_intimacy",
    reverse: false,
  },
  {
    id: 24,
    question: "love_q_24",
    category: "intimacy",
    facet: "quality_time",
    reverse: true,
  },
  {
    id: 25,
    question: "love_q_25",
    category: "intimacy",
    facet: "romantic_connection",
    reverse: false,
  },

  // 6. Shared Values & Future
  {
    id: 26,
    question: "love_q_26",
    category: "future",
    facet: "shared_values",
    reverse: false,
  },
  {
    id: 27,
    question: "love_q_27",
    category: "future",
    facet: "future_goals",
    reverse: false,
  },
  {
    id: 28,
    question: "love_q_28",
    category: "future",
    facet: "commitment",
    reverse: false,
  },
  {
    id: 29,
    question: "love_q_29",
    category: "future",
    facet: "life_plan_alignment",
    reverse: true,
  },
  {
    id: 30,
    question: "love_q_30",
    category: "future",
    facet: "team_orientation",
    reverse: false,
  },
];
