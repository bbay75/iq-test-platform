export type LoveQuestion = {
  id: number;
  question: string;
  category: "communication" | "trust" | "emotion" | "conflict" | "future";
};

export const loveQuestions: LoveQuestion[] = [
  {
    id: 1,
    question: "Би асуудлаа илэн далангүй ярилцах дуртай.",
    category: "communication",
  },
  {
    id: 2,
    question: "Маргааны үед тайван байж чаддаг.",
    category: "conflict",
  },
  {
    id: 3,
    question: "Хамтрагчдаа амархан итгэдэг.",
    category: "trust",
  },
  {
    id: 4,
    question: "Хайраа үгээр илэрхийлэх нь надад чухал.",
    category: "emotion",
  },
  {
    id: 5,
    question: "Ирээдүйн зорилгоо хамтдаа төлөвлөх дуртай.",
    category: "future",
  },
  {
    id: 6,
    question: "Хувийн орон зай надад чухал.",
    category: "communication",
  },
  {
    id: 7,
    question: "Би хамтрагчаа сэтгэл санааны хувьд дэмжихийг чухалчилдаг.",
    category: "emotion",
  },
  {
    id: 8,
    question:
      "Шийдвэр гаргахдаа хоёр талын бодлыг тэнцвэртэй сонсох хэрэгтэй гэж боддог.",
    category: "communication",
  },
  {
    id: 9,
    question: "Харилцаанд үнэнч байдал хамгийн чухал зүйлсийн нэг.",
    category: "trust",
  },
  {
    id: 10,
    question: "Урт хугацааны тогтвортой харилцаа надад чухал.",
    category: "future",
  },
];
