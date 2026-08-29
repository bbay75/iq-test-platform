export type IQQuestionType = "visual" | "number" | "logic" | "verbal";

export type IQOption = {
  text?: string;
  image?: string;
  points: number;
};

export type IQQuestion = {
  id: string;
  question: string;
  type: IQQuestionType;
  image?: string;
  options: IQOption[];
  explanation?: string;
};

export const iqQuestions: IQQuestion[] = [
  // VISUAL
  {
    id: "visual-1",
    question: "iq_q_visual_1",
    type: "visual",
    image: "/images/iq/visual/v1/question.jpg",
    explanation: "iq_e_visual_1",
    options: [
      { image: "/images/iq/visual/v1/option-a.jpg", points: 0 },
      { image: "/images/iq/visual/v1/option-b.jpg", points: 0 },
      { image: "/images/iq/visual/v1/option-c.jpg", points: 0 },
      { image: "/images/iq/visual/v1/option-d.jpg", points: 0 },
      { image: "/images/iq/visual/v1/option-e.jpg", points: 2 },
      { image: "/images/iq/visual/v1/option-f.jpg", points: 0 },
    ],
  },
  {
    id: "visual-2",
    question: "iq_q_visual_2",
    type: "visual",
    image: "/images/iq/visual/v2/question.jpg",
    explanation: "iq_e_visual_2",
    options: [
      { image: "/images/iq/visual/v2/option-a.jpg", points: 0 },
      { image: "/images/iq/visual/v2/option-b.jpg", points: 0 },
      { image: "/images/iq/visual/v2/option-c.jpg", points: 2 },
      { image: "/images/iq/visual/v2/option-d.jpg", points: 0 },
      { image: "/images/iq/visual/v2/option-e.jpg", points: 0 },
      { image: "/images/iq/visual/v2/option-f.jpg", points: 0 },
    ],
  },
  {
    id: "visual-3",
    question: "iq_q_visual_3",
    type: "visual",
    image: "/images/iq/visual/v3/question.jpg",
    explanation: "iq_e_visual_3",
    options: [
      { image: "/images/iq/visual/v3/option-a.jpg", points: 2 },
      { image: "/images/iq/visual/v3/option-b.jpg", points: 0 },
      { image: "/images/iq/visual/v3/option-c.jpg", points: 0 },
      { image: "/images/iq/visual/v3/option-d.jpg", points: 0 },
      { image: "/images/iq/visual/v3/option-e.jpg", points: 0 },
      { image: "/images/iq/visual/v3/option-f.jpg", points: 0 },
    ],
  },
  {
    id: "visual-4",
    question: "iq_q_visual_4",
    type: "visual",
    image: "/images/iq/visual/v4/question.jpg",
    explanation: "iq_e_visual_4",
    options: [
      { image: "/images/iq/visual/v4/option-a.jpg", points: 2 },
      { image: "/images/iq/visual/v4/option-b.jpg", points: 0 },
      { image: "/images/iq/visual/v4/option-c.jpg", points: 0 },
      { image: "/images/iq/visual/v4/option-d.jpg", points: 0 },
      { image: "/images/iq/visual/v4/option-e.jpg", points: 0 },
      { image: "/images/iq/visual/v4/option-f.jpg", points: 0 },
    ],
  },
  {
    id: "visual-5",
    question: "iq_q_visual_5",
    type: "visual",
    image: "/images/iq/visual/v5/question.jpg",
    explanation: "iq_e_visual_5",
    options: [
      { image: "/images/iq/visual/v5/option-a.jpg", points: 0 },
      { image: "/images/iq/visual/v5/option-b.jpg", points: 2 },
      { image: "/images/iq/visual/v5/option-c.jpg", points: 0 },
      { image: "/images/iq/visual/v5/option-d.jpg", points: 0 },
      { image: "/images/iq/visual/v5/option-e.jpg", points: 0 },
      { image: "/images/iq/visual/v5/option-f.jpg", points: 0 },
    ],
  },
  {
    id: "visual-6",
    question: "iq_q_visual_6",
    type: "visual",
    image: "/images/iq/visual/v6/question.jpg",
    explanation: "iq_e_visual_6",
    options: [
      { image: "/images/iq/visual/v6/option-a.jpg", points: 0 },
      { image: "/images/iq/visual/v6/option-b.jpg", points: 0 },
      { image: "/images/iq/visual/v6/option-c.jpg", points: 0 },
      { image: "/images/iq/visual/v6/option-d.jpg", points: 0 },
      { image: "/images/iq/visual/v6/option-e.jpg", points: 2 },
      { image: "/images/iq/visual/v6/option-f.jpg", points: 0 },
    ],
  },
  {
    id: "visual-7",
    question: "iq_q_visual_7",
    type: "visual",
    image: "/images/iq/visual/v7/question.jpg",
    explanation: "iq_e_visual_7",
    options: [
      { image: "/images/iq/visual/v7/option-a.jpg", points: 0 },
      { image: "/images/iq/visual/v7/option-b.jpg", points: 0 },
      { image: "/images/iq/visual/v7/option-c.jpg", points: 0 },
      { image: "/images/iq/visual/v7/option-d.jpg", points: 0 },
      { image: "/images/iq/visual/v7/option-e.jpg", points: 0 },
      { image: "/images/iq/visual/v7/option-f.jpg", points: 2 },
    ],
  },
  {
    id: "visual-8",
    question: "iq_q_visual_8",
    type: "visual",
    image: "/images/iq/visual/v8/question.jpg",
    explanation: "iq_e_visual_8",
    options: [
      { image: "/images/iq/visual/v8/option-a.jpg", points: 0 },
      { image: "/images/iq/visual/v8/option-b.jpg", points: 0 },
      { image: "/images/iq/visual/v8/option-c.jpg", points: 0 },
      { image: "/images/iq/visual/v8/option-d.jpg", points: 2 },
      { image: "/images/iq/visual/v8/option-e.jpg", points: 0 },
      { image: "/images/iq/visual/v8/option-f.jpg", points: 0 },
    ],
  },

  // NUMBER
  {
    id: "number-1",
    question: "iq_q_number_1",
    type: "number",
    explanation: "iq_e_number_1",
    options: [
      { text: "iq_opt_number_1_a", points: 2 }, // ✅ CORRECT
      { text: "iq_opt_number_1_b", points: 0 },
      { text: "iq_opt_number_1_c", points: 0 },
      { text: "iq_opt_number_1_d", points: 0 },
    ],
  },
  {
    id: "number-2",
    question: "iq_q_number_2",
    type: "number",
    explanation: "iq_e_number_2",
    options: [
      { text: "iq_opt_number_2_a", points: 0 },
      { text: "iq_opt_number_2_b", points: 2 }, // ✅ CORRECT
      { text: "iq_opt_number_2_c", points: 0 },
      { text: "iq_opt_number_2_d", points: 0 },
    ],
  },
  {
    id: "number-3",
    question: "iq_q_number_3",
    type: "number",
    explanation: "iq_e_number_3",
    options: [
      { text: "iq_opt_number_3_a", points: 0 },
      { text: "iq_opt_number_3_b", points: 0 },
      { text: "iq_opt_number_3_c", points: 2 }, // ✅ CORRECT
      { text: "iq_opt_number_3_d", points: 0 },
    ],
  },
  {
    id: "number-4",
    question: "iq_q_number_4",
    type: "number",
    explanation: "iq_e_number_4",
    options: [
      { text: "iq_opt_number_4_a", points: 0 },
      { text: "iq_opt_number_4_b", points: 0 },
      { text: "iq_opt_number_4_c", points: 0 },
      { text: "iq_opt_number_4_d", points: 2 }, // ✅ CORRECT
    ],
  },
  {
    id: "number-5",
    question: "iq_q_number_5",
    type: "number",
    explanation: "iq_e_number_5",
    options: [
      { text: "iq_opt_number_5_a", points: 2 }, // ✅ CORRECT
      { text: "iq_opt_number_5_b", points: 0 },
      { text: "iq_opt_number_5_c", points: 0 },
      { text: "iq_opt_number_5_d", points: 0 },
    ],
  },
  {
    id: "number-6",
    question: "iq_q_number_6",
    type: "number",
    explanation: "iq_e_number_6",
    options: [
      { text: "iq_opt_number_6_a", points: 0 },
      { text: "iq_opt_number_6_b", points: 0 },
      { text: "iq_opt_number_6_c", points: 2 }, // ✅ CORRECT
      { text: "iq_opt_number_6_d", points: 0 },
    ],
  },
  {
    id: "number-7",
    question: "iq_q_number_7",
    type: "number",
    explanation: "iq_e_number_7",
    options: [
      { text: "iq_opt_number_7_a", points: 0 },
      { text: "iq_opt_number_7_b", points: 0 },
      { text: "iq_opt_number_7_c", points: 0 },
      { text: "iq_opt_number_7_d", points: 2 }, // ✅ CORRECT
    ],
  },

  // LOGIC
  {
    id: "logic-1",
    question: "iq_q_logic_1",
    type: "logic",
    explanation: "iq_e_logic_1",
    options: [
      { text: "iq_opt_logic_1_a", points: 0 },
      { text: "iq_opt_logic_1_b", points: 2 }, // ✅ CORRECT
      { text: "iq_opt_logic_1_c", points: 0 },
      { text: "iq_opt_logic_1_d", points: 0 },
    ],
  },
  {
    id: "logic-2",
    question: "iq_q_logic_2",
    type: "logic",
    explanation: "iq_e_logic_2",
    options: [
      { text: "iq_opt_logic_2_a", points: 0 },
      { text: "iq_opt_logic_2_b", points: 0 },
      { text: "iq_opt_logic_2_c", points: 0 },
      { text: "iq_opt_logic_2_d", points: 2 }, // ✅ CORRECT
    ],
  },
  {
    id: "logic-3",
    question: "iq_q_logic_3",
    type: "logic",
    explanation: "iq_e_logic_3",
    options: [
      { text: "iq_opt_logic_3_a", points: 2 }, // ✅ CORRECT
      { text: "iq_opt_logic_3_b", points: 0 },
      { text: "iq_opt_logic_3_c", points: 0 },
      { text: "iq_opt_logic_3_d", points: 0 },
    ],
  },
  {
    id: "logic-4",
    question: "iq_q_logic_4",
    type: "logic",
    explanation: "iq_e_logic_4",
    options: [
      { text: "iq_opt_logic_4_a", points: 0 },
      { text: "iq_opt_logic_4_b", points: 0 },
      { text: "iq_opt_logic_4_c", points: 2 }, // ✅ CORRECT
      { text: "iq_opt_logic_4_d", points: 0 },
    ],
  },
  {
    id: "logic-5",
    question: "iq_q_logic_5",
    type: "logic",
    explanation: "iq_e_logic_5",
    options: [
      { text: "iq_opt_logic_5_a", points: 0 },
      { text: "iq_opt_logic_5_b", points: 0 },
      { text: "iq_opt_logic_5_c", points: 0 },
      { text: "iq_opt_logic_5_d", points: 2 }, // ✅ CORRECT
    ],
  },
  {
    id: "logic-6",
    question: "iq_q_logic_6",
    type: "logic",
    explanation: "iq_e_logic_6",
    options: [
      { text: "iq_opt_logic_6_a", points: 2 }, // ✅ CORRECT
      { text: "iq_opt_logic_6_b", points: 0 },
      { text: "iq_opt_logic_6_c", points: 0 },
      { text: "iq_opt_logic_6_d", points: 0 },
    ],
  },
  {
    id: "logic-7",
    question: "iq_q_logic_7",
    type: "logic",
    explanation: "iq_e_logic_7",
    options: [
      { text: "iq_opt_logic_7_a", points: 0 },
      { text: "iq_opt_logic_7_b", points: 0 },
      { text: "iq_opt_logic_7_c", points: 2 }, // ✅ CORRECT
      { text: "iq_opt_logic_7_d", points: 0 },
    ],
  },

  // VERBAL
  {
    id: "verbal-1",
    question: "iq_q_verbal_1",
    type: "verbal",
    explanation: "iq_e_verbal_1",
    options: [
      { text: "iq_opt_verbal_1_a", points: 0 },
      { text: "iq_opt_verbal_1_b", points: 0 },
      { text: "iq_opt_verbal_1_c", points: 2 }, // ✅ CORRECT
      { text: "iq_opt_verbal_1_d", points: 0 },
    ],
  },
  {
    id: "verbal-2",
    question: "iq_q_verbal_2",
    type: "verbal",
    explanation: "iq_e_verbal_2",
    options: [
      { text: "iq_opt_verbal_2_a", points: 2 }, // ✅ CORRECT
      { text: "iq_opt_verbal_2_b", points: 0 },
      { text: "iq_opt_verbal_2_c", points: 0 },
      { text: "iq_opt_verbal_2_d", points: 0 },
    ],
  },
  {
    id: "verbal-3",
    question: "iq_q_verbal_3",
    type: "verbal",
    explanation: "iq_e_verbal_3",
    options: [
      { text: "iq_opt_verbal_3_a", points: 0 },
      { text: "iq_opt_verbal_3_b", points: 0 },
      { text: "iq_opt_verbal_3_c", points: 0 },
      { text: "iq_opt_verbal_3_d", points: 2 }, // ✅ CORRECT
    ],
  },
  {
    id: "verbal-4",
    question: "iq_q_verbal_4",
    type: "verbal",
    explanation: "iq_e_verbal_4",
    options: [
      { text: "iq_opt_verbal_4_a", points: 0 },
      { text: "iq_opt_verbal_4_b", points: 2 }, // ✅ CORRECT
      { text: "iq_opt_verbal_4_c", points: 0 },
      { text: "iq_opt_verbal_4_d", points: 0 },
    ],
  },
  {
    id: "verbal-5",
    question: "iq_q_verbal_5",
    type: "verbal",
    explanation: "iq_e_verbal_5",
    options: [
      { text: "iq_opt_verbal_5_a", points: 0 },
      { text: "iq_opt_verbal_5_b", points: 0 },
      { text: "iq_opt_verbal_5_c", points: 2 }, // ✅ CORRECT
      { text: "iq_opt_verbal_5_d", points: 0 },
    ],
  },
  {
    id: "verbal-6",
    question: "iq_q_verbal_6",
    type: "verbal",
    explanation: "iq_e_verbal_6",
    options: [
      { text: "iq_opt_verbal_6_a", points: 0 },
      { text: "iq_opt_verbal_6_b", points: 0 },
      { text: "iq_opt_verbal_6_c", points: 0 },
      { text: "iq_opt_verbal_6_d", points: 2 }, // ✅ CORRECT
    ],
  },
  {
    id: "verbal-7",
    question: "iq_q_verbal_7",
    type: "verbal",
    explanation: "iq_e_verbal_7",
    options: [
      { text: "iq_opt_verbal_7_a", points: 2 }, // ✅ CORRECT
      { text: "iq_opt_verbal_7_b", points: 0 },
      { text: "iq_opt_verbal_7_c", points: 0 },
      { text: "iq_opt_verbal_7_d", points: 0 },
    ],
  },
];
