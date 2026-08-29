import type { MbtiAxis, MbtiDirection } from "@/lib/mbtiScoring";

export type MbtiQuestionRole = "core" | "borderline";

export type MbtiQuestion = {
  id: number;

  question: {
    mn: string;
    en: string;
  };
  firstLabel: {
    mn: string;
    en: string;
  };

  secondLabel: {
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
   * +1 = Agree / right-side positive score нь axis-ийн эхний үсгийг дэмжинэ.
   * -1 = axis-ийн хоёр дахь үсгийг дэмжинэ.
   *
   * EI: + = E, - = I
   * SN: + = S, - = N
   * TF: + = T, - = F
   * JP: + = J, - = P
   */
  direction: MbtiDirection;

  /**
   * core = үндсэн score-д орно
   * borderline = tie-break зориулалттай хуучин бүтэц
   */
  role: MbtiQuestionRole;

  /**
   * Behavioral facet.
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
      mn: "Дадал болсон ажил хийж байхдаа?",
      en: "When doing a familiar routine task?",
    },
    firstLabel: {
      mn: "Ярингаа хийх дуртай",
      en: "Prefer doing it while talking",
    },
    secondLabel: {
      mn: "Дуугүй хийх дуртай",
      en: "Prefer doing it quietly",
    },
    axis: "EI",
    direction: 1,
    role: "core",
    facet: "social_stimulation",
  },
  {
    id: 2,
    question: {
      mn: "Шинэ юм заалгуулахдаа?",
      en: "When learning something new?",
    },
    firstLabel: {
      mn: "Хийж үзүүлбэл ойлгомжтой",
      en: "Show me how",
    },
    secondLabel: {
      mn: "Учрыг нь тайлбарлавал ойлгомжтой",
      en: "Understand it better when the reason is explained",
    },
    axis: "SN",
    direction: 1,
    role: "core",
    facet: "learning_style",
  },

  {
    id: 3,
    question: {
      mn: "Киноны дүр хэцүү сонголт хийхэд?",
      en: "When a movie character faces a difficult choice?",
    },
    firstLabel: {
      mn: "Шийдвэрийн үр дагаврыг бодно",
      en: "Think about the consequences",
    },
    secondLabel: {
      mn: "Дүрийн мэдрэмжийг ойлгоно",
      en: "Focus on how the character feels",
    },
    axis: "TF",
    direction: 1,
    role: "core",
    facet: "outcome_vs_emotional_perspective",
  },

  {
    id: 4,
    question: {
      mn: "Аялалд явахын өмнө авч явах юмаа?",
      en: "Before going on a trip?",
    },
    firstLabel: {
      mn: "Урьдчилаад бэлдчихдэг",
      en: "Pack ahead of time",
    },
    secondLabel: {
      mn: "Явах үедээ бэлддэг",
      en: "Pack when it's time to go",
    },
    axis: "JP",
    direction: 1,
    role: "core",
    facet: "preparation",
  },
  // =========================================================
  // 5–8
  // =========================================================

  {
    id: 5,
    question: {
      mn: "Яриа гэнэт тасарвал?",
      en: "If a conversation suddenly goes quiet?",
    },
    firstLabel: {
      mn: "Шинэ сэдэв гаргана",
      en: "Bring up a new topic",
    },
    secondLabel: {
      mn: "Нам гүм байсан ч зүгээр",
      en: "Be fine with the silence",
    },
    axis: "EI",
    direction: -1,
    role: "core",
    facet: "social_initiation",
  },
  {
    id: 6,
    question: {
      mn: "Хүн аяллынхаа тухай ярихад?",
      en: "If a friend tells you about a trip?",
    },

    firstLabel: {
      mn: "Юу үзсэнийг нь сонирхоно",
      en: "Wonder what they saw",
    },

    secondLabel: {
      mn: "Ямар байсан бол гэж төсөөлнө",
      en: "Imagine what it was like",
    },

    axis: "SN",
    direction: -1,
    role: "core",
    facet: "concrete_experience_vs_imagination",
  },

  {
    id: 7,
    question: {
      mn: "Хүнд бэлэг сонгохдоо?",
      en: "When choosing a gift?",
    },
    firstLabel: {
      mn: "Хэрэг болохыг нь харна",
      en: "Choose something useful",
    },
    secondLabel: {
      mn: "Баярлуулахыг нь харна",
      en: "Choose something they'll love",
    },
    axis: "TF",
    direction: -1,
    role: "core",
    facet: "utility_vs_personal_impact",
  },
  {
    id: 8,
    question: {
      mn: "Амралтын өдөр эхлэхэд?",
      en: "When your day off begins?",
    },
    firstLabel: {
      mn: "Юу хийхээ мэдэж байна",
      en: "Already know what I'll do",
    },
    secondLabel: {
      mn: "Тэр үедээ шийднэ",
      en: "Decide as I go",
    },
    axis: "JP",
    direction: -1,
    role: "core",
    facet: "planning",
  },
  // =========================================================
  // 9–12
  // =========================================================

  {
    id: 9,
    question: {
      mn: "Олуулаа ярьж байхад сонирхолтой сэдэв гарвал?",
      en: "If an interesting topic comes up in a group conversation?",
    },
    firstLabel: {
      mn: "Шууд ярианд орно",
      en: "Jump into the conversation",
    },
    secondLabel: {
      mn: "Сонсож байгаад оролцоно",
      en: "Listen before joining in",
    },
    axis: "EI",
    direction: 1,
    role: "core",
    facet: "group_participation",
  },
  {
    id: 10,
    question: {
      mn: "Хоёр өөр зүйлд ижил санаа байвал?",
      en: "When two different things share a similar idea?",
    },
    firstLabel: {
      mn: "Тус тусад нь авч үзнэ",
      en: "Consider them separately",
    },
    secondLabel: {
      mn: "Хооронд нь холбоод бодно",
      en: "Think about how they connect",
    },
    axis: "SN",
    direction: 1,
    role: "core",
    facet: "connections",
  },
  {
    id: 11,
    question: {
      mn: "Тоглоомын дүрэм дээр маргалдвал?",
      en: "If there is a disagreement about the rules of a game?",
    },
    firstLabel: {
      mn: "Дүрмээр нь шийднэ",
      en: "Go by the rules",
    },
    secondLabel: {
      mn: "Бүгдээрээ тохиролцоно",
      en: "Agree on it together",
    },
    axis: "TF",
    direction: 1,
    role: "core",
    facet: "consistency_vs_harmony",
  },
  {
    id: 12,
    question: {
      mn: "Хийх зүйл олон байвал?",
      en: "When you have many things to do?",
    },
    firstLabel: {
      mn: "Дарааллыг нь гаргана",
      en: "Decide the order first",
    },
    secondLabel: {
      mn: "Аль тохирохоос нь эхэлнэ",
      en: "Start with whatever fits the moment",
    },
    axis: "JP",
    direction: -1,
    role: "core",
    facet: "task_structure",
  },

  // =========================================================
  // 13–16
  // =========================================================

  {
    id: 13,
    question: {
      mn: "Групп чатанд хөгжилтэй юм харагдвал?",
      en: "If something funny pops up in a group chat?",
    },
    firstLabel: {
      mn: "Шууд хариулна",
      en: "Reply right away",
    },
    secondLabel: {
      mn: "Инээгээд өнгөрнө",
      en: "Smile and move on",
    },
    axis: "EI",
    direction: -1,
    role: "core",
    facet: "expression",
  },

  {
    id: 14,
    question: {
      mn: "Ханын зураг эсвэл бүтээл харахдаа?",
      en: "When looking at a painting?",
    },
    firstLabel: {
      mn: "Бодит дүрслэлийг нь харна",
      en: "Notice what is depicted",
    },
    secondLabel: {
      mn: "Цаадах утгыг нь хайна",
      en: "Look for the deeper meaning",
    },
    axis: "SN",
    direction: -1,
    role: "core",
    facet: "literal_vs_symbolic",
  },

  {
    id: 15,
    question: {
      mn: "Чамайг шүүмжилбэл?",
      en: "If someone criticizes you?",
    },
    firstLabel: {
      mn: "Хэлсэн нь үнэн эсэхийг бодно",
      en: "Think about whether it's true",
    },
    secondLabel: {
      mn: "Яаж хэлснийг нь анзаарна",
      en: "Notice how it was said",
    },
    axis: "TF",
    direction: -1,
    role: "core",
    facet: "content_vs_tone",
  },

  {
    id: 16,
    question: {
      mn: "Төрсөн өдөрт очихдоо бэлэг авах бол?",
      en: "When buying a birthday gift?",
    },
    firstLabel: {
      mn: "Урьдчилаад сонгочихдог",
      en: "Choose it in advance",
    },
    secondLabel: {
      mn: "Очих өдрөө сонгодог",
      en: "Choose it on the day",
    },
    axis: "JP",
    direction: -1,
    role: "core",
    facet: "decision_closure",
  },
  // =========================================================
  // 17–20
  // =========================================================

  {
    id: 17,
    question: {
      mn: "Толгой дүүрэн бодолтой үед?",
      en: "When your head is full of thoughts?",
    },
    firstLabel: {
      mn: "Хэн нэгэнд ярьж цэгцэлнэ",
      en: "Sort it out by talking",
    },
    secondLabel: {
      mn: "Өөрөө бодож цэгцэлнэ",
      en: "Sort it out in my head",
    },
    axis: "EI",
    direction: 1,
    role: "core",
    facet: "processing_style",
  },

  {
    id: 18,
    question: {
      mn: "Кино дууссаны дараа?",
      en: "After a movie ends?",
    },
    firstLabel: {
      mn: "Үйл явдлыг нь санана",
      en: "Remember what happened",
    },
    secondLabel: {
      mn: "Цаад санааг нь бодно",
      en: "Think about the meaning",
    },
    axis: "SN",
    direction: 1,
    role: "core",
    facet: "meaning",
  },
  {
    id: 19,
    question: {
      mn: "Хэн нэгэн амласнаа хийж чадаагүй бол?",
      en: "If someone couldn't keep a promise?",
    },
    firstLabel: {
      mn: "Тохирсноо биелүүлээгүйг нь харна",
      en: "Focus on what wasn't fulfilled",
    },
    secondLabel: {
      mn: "Яагаад чадаагүйг нь сонсоно",
      en: "Listen to why they couldn't",
    },
    axis: "TF",
    direction: -1,
    role: "core",
    facet: "accountability_vs_context",
  },

  {
    id: 20,
    question: {
      mn: "Очсон ресторан чинь хаалттай байвал?",
      en: "If the restaurant you went to is closed?",
    },
    firstLabel: {
      mn: "Өөр газар шууд сонгоно",
      en: "Choose another place right away",
    },
    secondLabel: {
      mn: "Ойр хавиар харж байгаад шийднэ",
      en: "Look around and decide as you go",
    },
    axis: "JP",
    direction: 1,
    role: "core",
    facet: "change_response",
  },

  // =========================================================
  // 21–24
  // =========================================================

  {
    id: 21,
    question: {
      mn: "Ангийн уулзалт дээр?",
      en: "At a class reunion?",
    },
    firstLabel: {
      mn: "Олон ярианд идэвхтэй оролцоно",
      en: "Join many conversations",
    },
    secondLabel: {
      mn: "Нэг яриандаа төвлөрнө",
      en: "Focus on one conversation",
    },
    axis: "EI",
    direction: -1,
    role: "core",
    facet: "social_breadth",
  },
  {
    id: 22,
    question: {
      mn: "Ямар нэг эд зүйл харахдаа?",
      en: "When looking at an object?",
    },
    firstLabel: {
      mn: "Одоо юунд хэрэгтэйг нь харна",
      en: "Notice what it's useful for now",
    },
    secondLabel: {
      mn: "Өөр юунд ашиглаж болохыг бодно",
      en: "Think of other ways it could be used",
    },
    axis: "SN",
    direction: -1,
    role: "core",
    facet: "practicality",
  },

  {
    id: 23,
    question: {
      mn: "Хэд хэдэн санал гарвал?",
      en: "When several suggestions come up?",
    },
    firstLabel: {
      mn: "Хамгийн оновчтойг нь сонгоно",
      en: "Choose the most effective option",
    },
    secondLabel: {
      mn: "Хүмүүсийн саналыг харгалзана",
      en: "Consider everyone's input",
    },
    axis: "TF",
    direction: -1,
    role: "core",
    facet: "merit_vs_inclusion",
  },
  {
    id: 24,
    question: {
      mn: "Онлайнаар юм авахдаа?",
      en: "When buying something online?",
    },
    firstLabel: {
      mn: "Сонголтоо тогтоогоод авна",
      en: "Choose one and buy it",
    },
    secondLabel: {
      mn: "Өөр зүйл бас харна",
      en: "Keep looking at other options",
    },
    axis: "JP",
    direction: -1,
    role: "core",
    facet: "option_openness",
  },

  // =========================================================
  // 25–28
  // =========================================================

  {
    id: 25,
    question: {
      mn: "Сайхан мэдээ сонсвол?",
      en: "If you get some good news?",
    },
    firstLabel: {
      mn: "Хүнд хэлмээр санагдана",
      en: "Share it right away",
    },
    secondLabel: {
      mn: "Өөртөө түр хадгална",
      en: "Keep it to myself for a while",
    },
    axis: "EI",
    direction: 1,
    role: "core",
    facet: "expression",
  },
  {
    id: 26,
    question: {
      mn: "Танил асуудал дахин гарвал?",
      en: "When a familiar problem comes up again?",
    },
    firstLabel: {
      mn: "Өмнө хийж байсан аргаа хэрэглэнэ",
      en: "Use an approach that worked before",
    },
    secondLabel: {
      mn: "Өөрөөр хийж үзэхийг бодно",
      en: "Think of a different way to do it",
    },
    axis: "SN",
    direction: -1,
    role: "core",
    facet: "experience_vs_new_approach",
  },

  {
    id: 27,
    question: {
      mn: "Гэр бүлээрээ хаашаа амрахаа шийдэхдээ?",
      en: "When deciding where to go on a family vacation?",
    },
    firstLabel: {
      mn: "Зардал, замыг нь харж сонгоно",
      en: "Choose based on cost and travel",
    },
    secondLabel: {
      mn: "Хүн бүрийн хүсэлд нийцүүлнэ",
      en: "Consider everyone's preferences",
    },
    axis: "TF",
    direction: 1,
    role: "core",
    facet: "practical_criteria_vs_people_preferences",
  },
  {
    id: 28,
    question: {
      mn: "Гэртээ жижиг засвар хийхдээ?",
      en: "When doing a small repair at home?",
    },
    firstLabel: {
      mn: "Эхлээд хийх дарааллаа бодно",
      en: "Plan the steps before starting",
    },
    secondLabel: {
      mn: "Хийж байхдаа дараагийнхаа алхмыг шийднэ",
      en: "Decide the next step as I go",
    },
    axis: "JP",
    direction: 1,
    role: "core",
    facet: "structure_vs_adaptation",
  },
  // =========================================================
  // 29–32
  // =========================================================

  {
    id: 29,
    question: {
      mn: "Шинэ танилтай яриа гоё өрнөвөл?",
      en: "If a conversation with someone new goes really well?",
    },
    firstLabel: {
      mn: "Нээлттэй ярилцана",
      en: "Open up easily",
    },
    secondLabel: {
      mn: "Аажмаар нээлттэй болно",
      en: "Open up gradually",
    },
    axis: "EI",
    direction: -1,
    role: "core",
    facet: "self_disclosure",
  },
  {
    id: 30,
    question: {
      mn: "Шинэ өрөөнд ороход?",
      en: "When you enter a room for the first time?",
    },
    firstLabel: {
      mn: "Жижиг зүйлс нүдэнд тусна",
      en: "Notice the small details",
    },
    secondLabel: {
      mn: "Ерөнхий төрх нь нүдэнд тусна",
      en: "Notice the overall picture",
    },
    axis: "SN",
    direction: -1,
    role: "core",
    facet: "detail_attention",
  },
  {
    id: 31,
    question: {
      mn: "Хажууд чинь хүн халуун цай асгачихвал эхлээд яах вэ?",
      en: "If someone next to you spills hot tea, what do you do first?",
    },
    firstLabel: {
      mn: "Асгарсныг арчина",
      en: "Clean up the spill",
    },
    secondLabel: {
      mn: "Түлэгдсэн эсэхийг асууна",
      en: "Ask if they got burned",
    },
    axis: "TF",
    direction: 1,
    role: "core",
    facet: "problem_vs_person_focus",
  },

  {
    id: 32,
    question: {
      mn: "Орой юу үзэхээ?",
      en: "When deciding what to watch in the evening?",
    },
    firstLabel: {
      mn: "Урьдчилаад сонгочихдог",
      en: "Choose it beforehand",
    },
    secondLabel: {
      mn: "Тэр үедээ хайж сонгодог",
      en: "Browse and choose at the time",
    },
    axis: "JP",
    direction: -1,
    role: "core",
    facet: "decision_timing",
  },
  // =========================================================
  // 33–36
  // =========================================================

  {
    id: 33,
    question: {
      mn: "Үдэшлэг тарах дөхөхөд?",
      en: "As a party is winding down?",
    },
    firstLabel: {
      mn: "Үлдээд үргэлжлүүлмээр",
      en: "Want to stay",
    },
    secondLabel: {
      mn: "Харихад бэлэн",
      en: "Want to head home",
    },
    axis: "EI",
    direction: 1,
    role: "core",
    facet: "social_stamina",
  },

  {
    id: 34,
    question: {
      mn: "Шинэ дуу сонсохдоо?",
      en: "When listening to a new song?",
    },
    firstLabel: {
      mn: "Аялгуу, хэмнэлийг нь анзаарна",
      en: "Notice the melody and rhythm",
    },
    secondLabel: {
      mn: "Цаадах санааг нь бодно",
      en: "Think about the meaning behind it",
    },
    axis: "SN",
    direction: 1,
    role: "core",
    facet: "sensory_vs_meaning",
  },

  {
    id: 35,
    question: {
      mn: "Шинэ хүнтэй хамтарч ажиллах эсэхээ шийдэхдээ?",
      en: "When deciding whether to work with someone new?",
    },
    firstLabel: {
      mn: "Юу хийж чаддагийг нь харна",
      en: "Consider what they can do",
    },
    secondLabel: {
      mn: "Хэр ойлголцож байгаагаа харна",
      en: "Consider how well we get along",
    },
    axis: "TF",
    direction: 1,
    role: "core",
    facet: "competence_vs_interpersonal_fit",
  },
  {
    id: 36,
    question: {
      mn: "Өглөө гэрээс гарахдаа?",
      en: "When leaving home in the morning?",
    },
    firstLabel: {
      mn: "Хэдэн цагт гарахаа тогтоодог",
      en: "Decide what time to leave",
    },
    secondLabel: {
      mn: "Бэлэн болсон үедээ гардаг",
      en: "Leave when I'm ready",
    },
    axis: "JP",
    direction: -1,
    role: "core",
    facet: "schedule_flexibility",
  },
  // =========================================================
  // 37–40
  // =========================================================

  {
    id: 37,
    question: {
      mn: "Бүтэн өдөр хүмүүстэй байсны дараа?",
      en: "After spending the whole day around people?",
    },
    firstLabel: {
      mn: "Дахиад уулзмаар",
      en: "Up for more company",
    },
    secondLabel: {
      mn: "Ганцаараа баймаар",
      en: "Want time alone",
    },
    axis: "EI",
    direction: -1,
    role: "core",
    facet: "recharge",
  },

  {
    id: 38,
    question: {
      mn: "Шинэ боломж гарвал?",
      en: "When a new opportunity comes up?",
    },
    firstLabel: {
      mn: "Одоо хэрэг болохыг нь харна",
      en: "Focus on how it can help now",
    },
    secondLabel: {
      mn: "Цааш юу болж болохыг төсөөлнө",
      en: "Imagine what it could lead to",
    },
    axis: "SN",
    direction: -1,
    role: "core",
    facet: "present_vs_future_possibilities",
  },

  {
    id: 39,
    question: {
      mn: "Нэг хүн хоёр зүйлээс сонгож чадахгүй байвал?",
      en: "If someone can't decide between two options?",
    },
    firstLabel: {
      mn: "Аль нь дээрийг нь хэлнэ",
      en: "Tell them which seems better",
    },
    secondLabel: {
      mn: "Өөрт нь юу чухлыг асууна",
      en: "Ask what matters most to them",
    },
    axis: "TF",
    direction: -1,
    role: "core",
    facet: "solution_vs_values",
  },

  {
    id: 40,
    question: {
      mn: "Өглөөг эхлэхдээ?",
      en: "When starting your morning?",
    },
    firstLabel: {
      mn: "Тогтсон дарааллаараа хийдэг",
      en: "Follow my usual routine",
    },
    secondLabel: {
      mn: "Өдрөөсөө хамаарч өөрчилдөг",
      en: "Change it depending on the day",
    },
    axis: "JP",
    direction: 1,
    role: "core",
    facet: "routine_flexibility",
  },

  // =========================================================
  // 41–44
  // =========================================================

  {
    id: 41,
    question: {
      mn: "Дэлгүүрээс хайсан юмаа олохгүй бол?",
      en: "If you can't find something in a store?",
    },
    firstLabel: {
      mn: "Ажилтнаас шууд асууна",
      en: "Ask an employee right away",
    },
    secondLabel: {
      mn: "Эхлээд өөрөө хайна",
      en: "Look for it myself first",
    },
    axis: "EI",
    direction: -1,
    role: "core",
    facet: "social_initiative",
  },

  {
    id: 42,
    question: {
      mn: "Шинэ юм ойлгохдоо?",
      en: "When trying to understand something new?",
    },
    firstLabel: {
      mn: "Алхам алхмаар үзнэ",
      en: "Go step by step",
    },
    secondLabel: {
      mn: "Ерөнхий санааг нь барина",
      en: "Grasp the main idea",
    },
    axis: "SN",
    direction: 1,
    role: "core",
    facet: "information_style",
  },
  {
    id: 43,
    question: {
      mn: "Хүмүүст хийх зүйлийг нь хуваарилахдаа?",
      en: "When dividing tasks among people?",
    },
    firstLabel: {
      mn: "Хэн юуг сайн хийдгийг нь харна",
      en: "Consider what each person does best",
    },
    secondLabel: {
      mn: "Хэн юу хийхийг хүсэж байгааг нь харна",
      en: "Consider what each person wants to do",
    },
    axis: "TF",
    direction: -1,
    role: "core",
    facet: "competence_vs_preference",
  },
  {
    id: 44,
    question: {
      mn: "Өдрийн хийх юм өөрчлөгдвөл?",
      en: "If your plans for the day change?",
    },
    firstLabel: {
      mn: "Шинээр зохицуулна",
      en: "Reorganize the day",
    },
    secondLabel: {
      mn: "Явцдаа зохицно",
      en: "Adapt as I go",
    },
    axis: "JP",
    direction: 1,
    role: "core",
    facet: "change_response",
  },

  // =========================================================
  // 45–48
  // =========================================================

  {
    id: 45,
    question: {
      mn: "Амралтын өдөр ямар ч төлөвлөгөөгүй бол?",
      en: "If you have a completely free day with no plans?",
    },
    firstLabel: {
      mn: "Хүнтэй уулзах шалтаг олно",
      en: "Find someone to meet",
    },
    secondLabel: {
      mn: "Өөрийнхөөрөө тухална",
      en: "Enjoy the time on my own",
    },
    axis: "EI",
    direction: -1,
    role: "borderline",
    facet: "overall_social_orientation",
  },
  {
    id: 46,
    question: {
      mn: "Хэн нэгнээр ямар нэг зүйл хийлгэхдээ?",
      en: "When asking someone to make something for you?",
    },
    firstLabel: {
      mn: "Яг юу хийхийг нь хэлнэ",
      en: "Explain exactly what to do",
    },
    secondLabel: {
      mn: "Эцэст нь ямар болохыг хэлнэ",
      en: "Describe what the final result should be",
    },
    axis: "SN",
    direction: -1,
    role: "borderline",
    facet: "specifics_vs_overall_goal",
  },
  {
    id: 47,
    question: {
      mn: "Шийдвэр гаргахдаа?",
      en: "When making a decision?",
    },
    firstLabel: {
      mn: "Учир шалтгааныг нь бодно",
      en: "Follow the reasoning",
    },
    secondLabel: {
      mn: "Мэдрэмжээ дагана",
      en: "Follow how I feel",
    },
    axis: "TF",
    direction: -1,
    role: "borderline",
    facet: "overall_decision_style",
  },
  {
    id: 48,
    question: {
      mn: "Гадуур хэд хэдэн газар орохдоо?",
      en: "When you have several places to visit while you're out?",
    },
    firstLabel: {
      mn: "Явах дарааллаа урьдчилж шийднэ",
      en: "Decide the order beforehand",
    },
    secondLabel: {
      mn: "Замдаа аль руу орохоо шийднэ",
      en: "Decide where to go as I go",
    },
    axis: "JP",
    direction: -1,
    role: "borderline",
    facet: "overall_structure",
  },
];
