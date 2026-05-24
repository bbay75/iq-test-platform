export type LoveQuestion = {
  id: number;
  question: string;
  category: "communication" | "trust" | "emotion" | "conflict" | "future";
};

export const loveQuestions: LoveQuestion[] = [
  {
    id: 1,
    question: "love_q_1",
    category: "communication",
  },
  {
    id: 2,
    question: "love_q_2",
    category: "conflict",
  },
  {
    id: 3,
    question: "love_q_3",
    category: "trust",
  },
  {
    id: 4,
    question: "love_q_4",
    category: "emotion",
  },
  {
    id: 5,
    question: "love_q_5",
    category: "future",
  },
  {
    id: 6,
    question: "love_q_6",
    category: "communication",
  },
  {
    id: 7,
    question: "love_q_7",
    category: "emotion",
  },
  {
    id: 8,
    question: "love_q_8",
    category: "communication",
  },
  {
    id: 9,
    question: "love_q_9",
    category: "trust",
  },
  {
    id: 10,
    question: "love_q_10",
    category: "future",
  },
];
