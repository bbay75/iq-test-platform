import type { MbtiAxis, MbtiDirection } from "@/lib/mbtiScoring";

export type MbtiQuestionRole = "core" | "borderline";

export type MbtiQuestion = {
  id: number;

  question: {
    mn: string;
    en: string;
  };

  /**
   * EI = Extraversion ↔ Introversion
   * SN = Sensing ↔ Intuition
   * TF = Thinking ↔ Feeling
   * JP = Judging ↔ Perceiving
   */
  axis: MbtiAxis;

  /**
   * +1 = Agree нь axis-ийн эхний үсгийг дэмжинэ.
   * -1 = Agree нь axis-ийн хоёр дахь үсгийг дэмжинэ.
   *
   * EI: + = E, - = I
   * SN: + = S, - = N
   * TF: + = T, - = F
   * JP: + = J, - = P
   */
  direction: MbtiDirection;

  /**
   * core:
   * Үндсэн dimension score-д орно.
   *
   * borderline:
   * Core score яг 0 үед л тухайн axis-ийг
   * ялгахад ашиглана.
   */
  role: MbtiQuestionRole;

  /**
   * Дараа personalized premium тайлал хийхэд
   * ашиглаж болох behavioral facet.
   */
  facet: string;
};

export const mbtiQuestions: MbtiQuestion[] = [
  // =========================================================
  // 1–4
  // =========================================================

  {
    id: 1,
    question: {
      mn: "Олон хүнтэй идэвхтэй орчинд байх нь танд ихэвчлэн эрч хүч нэмдэг.",
      en: "Being in an active environment with many people usually gives you energy.",
    },
    axis: "EI",
    direction: 1,
    role: "core",
    facet: "social_energy",
  },
  {
    id: 2,
    question: {
      mn: "Шийдвэр гаргахдаа та таамгаас илүү бодитоор шалгаж болох мэдээлэлд түшиглэхийг илүүд үздэг.",
      en: "When making decisions, you prefer information that can be directly observed or verified.",
    },
    axis: "SN",
    direction: 1,
    role: "core",
    facet: "evidence",
  },
  {
    id: 3,
    question: {
      mn: "Хэцүү шийдвэр гаргахдаа та эхлээд логикийн хувьд нийцтэй эсэхийг нь шалгадаг.",
      en: "When making a difficult decision, you first consider whether it is logically consistent.",
    },
    axis: "TF",
    direction: 1,
    role: "core",
    facet: "logic",
  },
  {
    id: 4,
    question: {
      mn: "Том ажил эхлэхийн өмнө хийх дарааллаа урьдчилж тодорхойлох нь танд тухтай байдаг.",
      en: "Before starting a major task, you prefer to define the steps in advance.",
    },
    axis: "JP",
    direction: 1,
    role: "core",
    facet: "planning",
  },

  // =========================================================
  // 5–8
  // =========================================================

  {
    id: 5,
    question: {
      mn: "Завгүй өдөр өнгөрсний дараа ганцаараа тайван байх нь танд эрч хүчээ нөхөхөд хамгийн их тусалдаг.",
      en: "After a busy day, quiet time alone is usually the best way for you to recharge.",
    },
    axis: "EI",
    direction: -1,
    role: "core",
    facet: "recovery",
  },
  {
    id: 6,
    question: {
      mn: "Одоогийн нөхцөлөөс гадна цааш ямар боломж нээгдэж болохыг төсөөлөх нь танд сонирхолтой.",
      en: "You enjoy imagining what possibilities might emerge beyond the current situation.",
    },
    axis: "SN",
    direction: -1,
    role: "core",
    facet: "possibilities",
  },
  {
    id: 7,
    question: {
      mn: "Шийдвэр зөв мэт санагдсан ч хүмүүст хэрхэн нөлөөлөхийг нь та заавал харгалздаг.",
      en: "Even when a decision seems correct, you make a point of considering how it will affect people.",
    },
    axis: "TF",
    direction: -1,
    role: "core",
    facet: "people_impact",
  },
  {
    id: 8,
    question: {
      mn: "Сонголтоо эрт хаахаас илүү шинэ мэдээлэл гарвал чиглэлээ өөрчлөх боломжтой байлгах дуртай.",
      en: "You prefer to keep your options open so you can change direction when new information appears.",
    },
    axis: "JP",
    direction: -1,
    role: "core",
    facet: "openness",
  },

  // =========================================================
  // 9–12
  // =========================================================

  {
    id: 9,
    question: {
      mn: "Танихгүй хүмүүстэй орчинд та өөрөө яриа эхлүүлэх нь элбэг.",
      en: "In a group of unfamiliar people, you often initiate conversations yourself.",
    },
    axis: "EI",
    direction: 1,
    role: "core",
    facet: "social_initiation",
  },
  {
    id: 10,
    question: {
      mn: "Та жижиг баримтуудаас илүү тэдгээрийн хоорондох нийтлэг хэв маягийг хурдан анзаардаг.",
      en: "You tend to notice broader patterns connecting individual pieces of information.",
    },
    axis: "SN",
    direction: -1,
    role: "core",
    facet: "patterns",
  },
  {
    id: 11,
    question: {
      mn: "Ижил нөхцөлд байгаа хүмүүст ижил шалгуур хэрэглэх нь танд чухал.",
      en: "It is important to you to apply consistent criteria to people in similar situations.",
    },
    axis: "TF",
    direction: 1,
    role: "core",
    facet: "consistency",
  },
  {
    id: 12,
    question: {
      mn: "Өдрийн төлөвлөгөө өөрчлөгдвөл шинэ нөхцөлдөө тааруулж явах нь танд ерөнхийдөө эвтэйхэн.",
      en: "When your plans change during the day, you generally feel comfortable adapting to the new situation.",
    },
    axis: "JP",
    direction: -1,
    role: "core",
    facet: "adaptability",
  },

  // =========================================================
  // 13–16
  // =========================================================

  {
    id: 13,
    question: {
      mn: "Ярихаасаа өмнө бодлоо дотроо цэгцлэх үедээ та өөрийгөө илүү зөв илэрхийлдэг.",
      en: "You express yourself more clearly when you organize your thoughts internally before speaking.",
    },
    axis: "EI",
    direction: -1,
    role: "core",
    facet: "internal_processing",
  },
  {
    id: 14,
    question: {
      mn: "Шинэ зүйл сурахдаа бодит жишээ, дараалсан алхамтай тайлбар танд илүү ойлгомжтой байдаг.",
      en: "When learning something new, concrete examples and step-by-step explanations are especially helpful to you.",
    },
    axis: "SN",
    direction: 1,
    role: "core",
    facet: "concrete_learning",
  },
  {
    id: 15,
    question: {
      mn: "Хоёр хүний нөхцөл ижил харагдсан ч тэдний хувийн нөхцөл байдлыг тусад нь харгалзах нь зөв гэж та үздэг.",
      en: "Even when two situations look similar, you believe each person's circumstances should be considered individually.",
    },
    axis: "TF",
    direction: -1,
    role: "core",
    facet: "personal_context",
  },
  {
    id: 16,
    question: {
      mn: "Хангалттай мэдээлэлтэй болсон бол шийдвэрээ гаргаад дараагийн зүйлдээ орох нь танд илүү амар байдаг.",
      en: "Once you have enough information, you prefer to make the decision and move on.",
    },
    axis: "JP",
    direction: 1,
    role: "core",
    facet: "closure",
  },

  // =========================================================
  // 17–20
  // =========================================================

  {
    id: 17,
    question: {
      mn: "Шинэ бүлэгт ороход та шууд төвд нь орохоосоо өмнө хэсэг ажиглах хандлагатай.",
      en: "When entering a new group, you tend to observe for a while before becoming actively involved.",
    },
    axis: "EI",
    direction: -1,
    role: "core",
    facet: "social_observation",
  },
  {
    id: 18,
    question: {
      mn: "Төлөвлөгөө гаргахдаа та эхлээд одоо байгаа нөөц, бодит хязгаарлалтыг хардаг.",
      en: "When making a plan, you first consider the resources and practical limits that currently exist.",
    },
    axis: "SN",
    direction: 1,
    role: "core",
    facet: "present_reality",
  },
  {
    id: 19,
    question: {
      mn: "Санал зөрөх үед юу хэлэхээс гадна ямар өнгөөр хэлэхээ та их анхаардаг.",
      en: "During disagreements, you pay close attention not only to what you say but also to how you say it.",
    },
    axis: "TF",
    direction: -1,
    role: "core",
    facet: "tact",
  },
  {
    id: 20,
    question: {
      mn: "Чухал ажилд урьдчилж бэлдэж эхлэх үедээ та илүү тайван байдаг.",
      en: "You feel more at ease when you begin preparing for important tasks ahead of time.",
    },
    axis: "JP",
    direction: 1,
    role: "core",
    facet: "preparation",
  },

  // =========================================================
  // 21–24
  // =========================================================

  {
    id: 21,
    question: {
      mn: "Санаагаа бусадтай ярилцаж байх үед шинэ бодол танд амархан төрдөг.",
      en: "New ideas often come to you while you are talking things through with other people.",
    },
    axis: "EI",
    direction: 1,
    role: "core",
    facet: "verbal_processing",
  },
  {
    id: 22,
    question: {
      mn: "Онол, үзэл санааг шууд практикт хэрэглэхгүй байсан ч судлах нь танд сонирхолтой.",
      en: "You enjoy exploring theories and ideas even when they have no immediate practical use.",
    },
    axis: "SN",
    direction: -1,
    role: "core",
    facet: "abstraction",
  },
  {
    id: 23,
    question: {
      mn: "Хэн нэгэнд санал хэлэхдээ гол асуудлыг аль болох тодорхой хэлэх нь зөөлрүүлж тойруулахаас илүү хэрэгтэй гэж та үздэг.",
      en: "When giving feedback, you generally value stating the main issue clearly rather than softening it too much.",
    },
    axis: "TF",
    direction: 1,
    role: "core",
    facet: "directness",
  },
  {
    id: 24,
    question: {
      mn: "Яг яаж хийхээ бүрэн тогтоохоосоо өмнө эхлээд туршиж үзэх нь танд эвтэйхэн.",
      en: "You are comfortable trying something before deciding exactly how you will approach it.",
    },
    axis: "JP",
    direction: -1,
    role: "core",
    facet: "experimentation",
  },

  // =========================================================
  // 25–28
  // =========================================================

  {
    id: 25,
    question: {
      mn: "Олон өөр хүнтэй танилцаж, харилцааны хүрээгээ тэлэх нь танд таатай.",
      en: "You enjoy meeting a variety of people and expanding your social circle.",
    },
    axis: "EI",
    direction: 1,
    role: "core",
    facet: "social_breadth",
  },
  {
    id: 26,
    question: {
      mn: "Та ерөнхий санаанаас гадна жижиг зөрүү, тодорхой деталиудыг анзаарах хандлагатай.",
      en: "You tend to notice specific details and small differences as well as the overall idea.",
    },
    axis: "SN",
    direction: 1,
    role: "core",
    facet: "detail_attention",
  },
  {
    id: 27,
    question: {
      mn: "Хүн яагаад тэгж авирласныг ойлгохын тулд түүний мэдрэмжийг төсөөлөхийг та хичээдэг.",
      en: "To understand someone's behavior, you often try to imagine what they may be feeling.",
    },
    axis: "TF",
    direction: -1,
    role: "core",
    facet: "empathy",
  },
  {
    id: 28,
    question: {
      mn: "Өдөрт хийх ажлуудаа урьдчилж жагсааж эсвэл дараалуулах нь танд тустай байдаг.",
      en: "Organizing the day's tasks in advance tends to work well for you.",
    },
    axis: "JP",
    direction: 1,
    role: "core",
    facet: "scheduling",
  },

  // =========================================================
  // 29–32
  // =========================================================

  {
    id: 29,
    question: {
      mn: "Олон танилтай байхаас цөөн хүнтэй илүү гүн холбоотой байх нь танд таатай.",
      en: "You generally prefer deeper connections with a few people over having many casual connections.",
    },
    axis: "EI",
    direction: -1,
    role: "core",
    facet: "relationship_depth",
  },
  {
    id: 30,
    question: {
      mn: "Ямар нэг санааны цаадах холбоо, далд утгыг хайх нь танд сонирхолтой.",
      en: "You enjoy looking for underlying connections and meanings behind ideas.",
    },
    axis: "SN",
    direction: -1,
    role: "core",
    facet: "hidden_connections",
  },
  {
    id: 31,
    question: {
      mn: "Тухайн шийдвэр танд таалагдахгүй байсан ч зарчим нь үндэслэлтэй бол дэмжиж чадна.",
      en: "You can support a decision you do not personally like if you believe its underlying principle is sound.",
    },
    axis: "TF",
    direction: 1,
    role: "core",
    facet: "principle",
  },
  {
    id: 32,
    question: {
      mn: "Нэг арга дээр эрт тогтохоосоо өмнө хэд хэдэн боломжийг судлахыг та илүүд үздэг.",
      en: "You prefer exploring several possibilities before settling on one approach.",
    },
    axis: "JP",
    direction: -1,
    role: "core",
    facet: "exploration",
  },

  // =========================================================
  // 33–36
  // =========================================================

  {
    id: 33,
    question: {
      mn: "Хөдөлгөөнтэй, харилцаа ихтэй өдөр танд ихэвчлэн сонирхолтой, сэргэлэн санагддаг.",
      en: "A busy day with plenty of interaction usually feels engaging and energizing to you.",
    },
    axis: "EI",
    direction: 1,
    role: "core",
    facet: "stimulation",
  },
  {
    id: 34,
    question: {
      mn: "Асуудал шийдэхдээ өмнө нь үр дүнтэй байсан аргыг эхний сонголт болгон авч үзэх нь танд түгээмэл.",
      en: "When solving a problem, you often consider methods that have worked before as a useful starting point.",
    },
    axis: "SN",
    direction: 1,
    role: "core",
    facet: "proven_methods",
  },
  {
    id: 35,
    question: {
      mn: "Шийдэл сонгохдоо аль нь илүү үр ашигтай, ажиллах боломжтой вэ гэдгийг та хүчтэй харгалздаг.",
      en: "When choosing a solution, you place considerable weight on which option is most efficient and workable.",
    },
    axis: "TF",
    direction: 1,
    role: "core",
    facet: "efficiency",
  },
  {
    id: 36,
    question: {
      mn: "Өдөр бүр яг ижил хуваарьтай байхаас бага зэрэг өөрчлөлт, сонголттой байх нь танд таатай.",
      en: "You prefer having some variety and choice rather than following exactly the same schedule every day.",
    },
    axis: "JP",
    direction: -1,
    role: "core",
    facet: "variety",
  },

  // =========================================================
  // 37–40
  // =========================================================

  {
    id: 37,
    question: {
      mn: "Удаан хугацаанд төвлөрөх ажил хийхдээ чимээгүй, тасалдал багатай орчныг илүүд үздэг.",
      en: "For work requiring long concentration, you prefer a quiet environment with few interruptions.",
    },
    axis: "EI",
    direction: -1,
    role: "core",
    facet: "focus_environment",
  },
  {
    id: 38,
    question: {
      mn: "Одоогийн шийдвэр ирээдүйд ямар үр дагавар, шинэ боломж үүсгэж болохыг та их боддог.",
      en: "You often think about what future consequences or possibilities may grow from a current decision.",
    },
    axis: "SN",
    direction: -1,
    role: "core",
    facet: "future_projection",
  },
  {
    id: 39,
    question: {
      mn: "Маргаанд ялахаас илүү харилцан итгэлцлийг хадгалах нь зарим үед танд илүү чухал санагддаг.",
      en: "At times, preserving mutual trust matters more to you than winning an argument.",
    },
    axis: "TF",
    direction: -1,
    role: "core",
    facet: "harmony",
  },
  {
    id: 40,
    question: {
      mn: "Ажлаа хугацаанаас өмнө дуусгаж, дараа нь санаа амрах нь танд таатай.",
      en: "You prefer completing work ahead of the deadline so you can relax afterward.",
    },
    axis: "JP",
    direction: 1,
    role: "core",
    facet: "completion",
  },

  // =========================================================
  // 41–44
  // =========================================================

  {
    id: 41,
    question: {
      mn: "Бүлгийн хэлэлцүүлэгт санаа төрөх үедээ шууд хэлж, бусадтай хамт хөгжүүлэх нь танд эвтэйхэн.",
      en: "In group discussions, you are comfortable sharing an idea as it forms and developing it with others.",
    },
    axis: "EI",
    direction: 1,
    role: "core",
    facet: "group_expression",
  },
  {
    id: 42,
    question: {
      mn: "Танил асуудалд ч өөр, туршиж үзээгүй шийдэл бодох нь танд сонирхолтой.",
      en: "Even with familiar problems, you enjoy considering solutions that have not been tried before.",
    },
    axis: "SN",
    direction: -1,
    role: "core",
    facet: "novelty",
  },
  {
    id: 43,
    question: {
      mn: "Санал зөрөлдөх үед хүнийг нь биш, гаргаж байгаа үндэслэлийг нь тусад нь авч үзэхийг та хичээдэг.",
      en: "During disagreements, you try to evaluate the argument separately from the person making it.",
    },
    axis: "TF",
    direction: 1,
    role: "core",
    facet: "argument_analysis",
  },
  {
    id: 44,
    question: {
      mn: "Тодорхой хуваарь, тогтсон цагтай байх үед өдөр тань илүү эмхтэй санагддаг.",
      en: "Your day tends to feel more manageable when it has a clear schedule and defined times.",
    },
    axis: "JP",
    direction: 1,
    role: "core",
    facet: "routine",
  },

  // =========================================================
  // 45–48
  // =========================================================

  {
    id: 45,
    question: {
      mn: "Олон уулзалт дараалсан үед та дараа нь өөртөө чимээгүй цаг гаргах хэрэгцээ мэдэрдэг.",
      en: "After several social interactions in a row, you usually need some quiet time to yourself.",
    },
    axis: "EI",
    direction: -1,
    role: "core",
    facet: "social_recovery",
  },
  {
    id: 46,
    question: {
      mn: "Шинэ санаа сонсохдоо эхлээд бодит амьдралд яаж хэрэгжихийг нь мэдэхийг хүсдэг.",
      en: "When hearing a new idea, you often want to know first how it could work in practice.",
    },
    axis: "SN",
    direction: 1,
    role: "core",
    facet: "practical_application",
  },
  {
    id: 47,
    question: {
      mn: "Хэцүү үед хүнд зөвлөгөө өгөхөөсөө өмнө түүний мэдрэмжийг ойлгож байгаагаа харуулах нь танд чухал.",
      en: "When someone is struggling, it is important to you to show understanding of their feelings before offering advice.",
    },
    axis: "TF",
    direction: -1,
    role: "core",
    facet: "emotional_support",
  },
  {
    id: 48,
    question: {
      mn: "Гэнэт гарсан сонирхолтой боломжийн төлөө өмнөх төлөвлөгөөгөө өөрчлөхөд та нээлттэй.",
      en: "You are open to changing an existing plan when an interesting unexpected opportunity appears.",
    },
    axis: "JP",
    direction: -1,
    role: "core",
    facet: "spontaneity",
  },

  // =========================================================
  // 49–52
  // =========================================================

  {
    id: 49,
    question: {
      mn: "Чөлөөт цагаа бусадтай байнга хуваалцахаас илүү өөрийн орон зайтай байх нь танд хэрэгтэй.",
      en: "Having some personal space in your free time is important to you.",
    },
    axis: "EI",
    direction: -1,
    role: "core",
    facet: "personal_space",
  },
  {
    id: 50,
    question: {
      mn: "Заавар тодорхой, үг нь шууд утгатай байх үед ажиллахад танд илүү амар байдаг.",
      en: "You find it easier to work with instructions that are specific and directly worded.",
    },
    axis: "SN",
    direction: 1,
    role: "core",
    facet: "precision",
  },
  {
    id: 51,
    question: {
      mn: "Хоёр сонголт логикийн хувьд ойролцоо бол аль нь хүмүүст илүү хүнлэг санагдахыг та харгалздаг.",
      en: "When two options are logically similar, you consider which one is likely to feel more humane to the people involved.",
    },
    axis: "TF",
    direction: -1,
    role: "core",
    facet: "human_values",
  },
  {
    id: 52,
    question: {
      mn: "Шаардлагатай мэдээлэл хангалттай болсон үед шийдвэрээ гаргаад цааш явахыг та илүүд үздэг.",
      en: "Once the necessary information is available, you prefer to make the decision and move forward.",
    },
    axis: "JP",
    direction: 1,
    role: "core",
    facet: "decisiveness",
  },

  // =========================================================
  // 53–56
  // =========================================================

  {
    id: 53,
    question: {
      mn: "Шинэ ажил эсвэл төсөл эхлэхдээ бусадтай шууд холбогдож, санал солилцох нь танд эрч өгдөг.",
      en: "When starting a new task or project, connecting with others and exchanging ideas tends to energize you.",
    },
    axis: "EI",
    direction: 1,
    role: "core",
    facet: "collaboration",
  },
  {
    id: 54,
    question: {
      mn: "Зүйрлэл, бэлгэдэл, олон утгатай санааг тайлж бодох нь танд сонирхолтой.",
      en: "You enjoy interpreting metaphors, symbols, and ideas that can have several meanings.",
    },
    axis: "SN",
    direction: -1,
    role: "core",
    facet: "symbolism",
  },
  {
    id: 55,
    question: {
      mn: "Хэцүү асуудлыг шийдэхдээ түр зуурын сэтгэл хөдлөлөөс зай авч, нөхцөл байдлыг хөндлөнгөөс харахыг та хичээдэг.",
      en: "When solving a difficult problem, you try to step back from immediate emotions and view the situation objectively.",
    },
    axis: "TF",
    direction: 1,
    role: "core",
    facet: "objectivity",
  },
  {
    id: 56,
    question: {
      mn: "Төлөвлөгөөг ягштал дагахаас илүү явцын мэдээлэлд тохируулан өөрчлөхийг та илүүд үздэг.",
      en: "You prefer adjusting a plan as new information appears rather than following it rigidly.",
    },
    axis: "JP",
    direction: -1,
    role: "core",
    facet: "flexibility",
  },

  // =========================================================
  // BORDERLINE ITEMS — 57–60
  //
  // Үндсэн 14 item-ийн score яг 0 болсон үед л
  // тухайн axis дээр ашиглана.
  // =========================================================

  {
    id: 57,
    question: {
      mn: "Чөлөөт өдөртөө удаан ганцаараа байхаас хүнтэй уулзаж, ямар нэг зүйл хамт хийхийг та илүүд үздэг.",
      en: "On a free day, you generally prefer meeting people and doing something together rather than spending most of the time alone.",
    },
    axis: "EI",
    direction: 1,
    role: "borderline",
    facet: "overall_social_orientation",
  },
  {
    id: 58,
    question: {
      mn: "Шинэ сэдэв сурахдаа эхлээд бодит жишээнээс илүү ерөнхий санаа, боломжит утгыг нь сонирхдог.",
      en: "When learning a new subject, you are often drawn first to the broader idea and its possible meanings rather than concrete examples.",
    },
    axis: "SN",
    direction: -1,
    role: "borderline",
    facet: "overall_information_style",
  },
  {
    id: 59,
    question: {
      mn: "Логик болон хүний мэдрэмж хоёр зөрчилдвөл та ихэвчлэн логикийн хувьд хамгийн нийцтэй сонголтыг дагадаг.",
      en: "When logic and people's feelings point in different directions, you usually lean toward the option that is most logically consistent.",
    },
    axis: "TF",
    direction: 1,
    role: "borderline",
    facet: "overall_decision_style",
  },
  {
    id: 60,
    question: {
      mn: "Гэнэтийн өөрчлөлт гарсан үед анхны төлөвлөгөөгөө барихаас илүү шинэ нөхцөлд тааруулж өөрчлөхийг та илүүд үздэг.",
      en: "When an unexpected change occurs, you generally prefer adapting to the new situation rather than sticking to the original plan.",
    },
    axis: "JP",
    direction: -1,
    role: "borderline",
    facet: "overall_structure_style",
  },
];
