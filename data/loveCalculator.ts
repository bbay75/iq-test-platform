type LoveCategory =
  | "communication"
  | "trust"
  | "emotion"
  | "conflict"
  | "future";

type LoveDetailedSection = {
  key: LoveCategory;
  title: string;
  score: number;
  description: string;
  advice: string;
};

type LoveLocalizedResult = {
  nameCompatibilityTitle: string;
  nameCompatibilitySummary: string;
  nameCompatibilityAdvice: string;

  detailedSections: LoveDetailedSection[];

  summary: string;
  strengths: string[];
  challenges: string[];
  advice: string;
};

type LoveCalculationResult = {
  finalScore: number;
  nameScore: number;
  psychologyScore: number;
  reduced1: number;
  reduced2: number;

  nameCompatibilityTitle: string;
  nameCompatibilitySummary: string;
  nameCompatibilityAdvice: string;

  categoryScores: Record<LoveCategory, number>;
  detailedSections: LoveDetailedSection[];

  summary: string;
  strengths: string[];
  challenges: string[];
  advice: string;

  localized?: {
    mn: LoveLocalizedResult;
    en: LoveLocalizedResult;
  };
};

const letterMap: Record<string, number> = {
  а: 1,
  б: 2,
  в: 3,
  г: 4,
  д: 5,
  е: 6,
  ё: 7,
  ж: 8,
  з: 9,
  и: 1,
  й: 2,
  к: 3,
  л: 4,
  м: 5,
  н: 6,
  о: 7,
  ө: 8,
  п: 9,
  р: 1,
  с: 2,
  т: 3,
  у: 4,
  ү: 5,
  ф: 6,
  х: 7,
  ц: 8,
  ч: 9,
  ш: 1,
  щ: 2,
  ъ: 3,
  ы: 4,
  ь: 5,
  э: 6,
  ю: 7,
  я: 8,

  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8,
  i: 9,
  j: 1,
  k: 2,
  l: 3,
  m: 4,
  n: 5,
  o: 6,
  p: 7,
  q: 8,
  r: 9,
  s: 1,
  t: 2,
  u: 3,
  v: 4,
  w: 5,
  x: 6,
  y: 7,
  z: 8,
};
const loveCategoryOrder: LoveCategory[] = [
  "communication",
  "trust",
  "emotion",
  "conflict",
  "future",
];

const categoryLabels: Record<LoveCategory, string> = {
  communication: "Харилцааны хэв маяг",
  trust: "Итгэлцэл",
  emotion: "Сэтгэл хөдлөлийн холбоо",
  conflict: "Маргаан шийдэх хэв маяг",
  future: "Ирээдүйн чиглэл",
};
function nameToNumber(name: string) {
  let sum = 0;
  const lower = name.toLowerCase().trim();

  for (const char of lower) {
    if (letterMap[char]) sum += letterMap[char];
  }

  return sum;
}

function reduceNumber(num: number) {
  let current = num;

  while (current > 9) {
    current = current
      .toString()
      .split("")
      .reduce((acc, digit) => acc + Number(digit), 0);
  }

  return current;
}

export function calculateNameCompatibility(name1: string, name2: string) {
  const n1 = nameToNumber(name1);
  const n2 = nameToNumber(name2);

  const r1 = reduceNumber(n1);
  const r2 = reduceNumber(n2);

  const diff = Math.abs(r1 - r2);
  const base = 100 - diff * 12;

  let score = base + ((n1 + n2) % 7);

  if (score < 45) score = 45 + ((n1 + n2) % 10);
  if (score > 98) score = 98;

  return {
    score,
    r1,
    r2,
  };
}

export function calculatePsychologyCompatibility(
  person1Answers: number[],
  person2Answers: number[],
) {
  if (
    person1Answers.length !== person2Answers.length ||
    person1Answers.length === 0
  ) {
    return 0;
  }

  let total = 0;

  for (let i = 0; i < person1Answers.length; i++) {
    const diff = Math.abs(person1Answers[i] - person2Answers[i]);
    const match = 100 - diff * 25;
    total += match;
  }

  return Math.round(total / person1Answers.length);
}

export function calculateSoloPsychologyEstimate(answers: number[]) {
  if (answers.length === 0) return 0;

  const avg = answers.reduce((sum, value) => sum + value, 0) / answers.length;

  const balancePenalty = Math.abs(avg - 3) * 12;
  let score = Math.round(82 - balancePenalty);

  if (score < 55) score = 55;
  if (score > 92) score = 92;

  return score;
}
function clampScore(score: number) {
  if (score < 0) return 0;
  if (score > 100) return 100;
  return Math.round(score);
}

function buildCategoryScores(
  mode: "solo" | "both",
  person1Answers: number[],
  person2Answers?: number[],
): Record<LoveCategory, number> {
  const scores: Record<LoveCategory, number[]> = {
    communication: [],
    trust: [],
    emotion: [],
    conflict: [],
    future: [],
  };

  const categories: LoveCategory[] = [
    "communication",
    "conflict",
    "trust",
    "emotion",
    "future",
    "communication",
    "emotion",
    "communication",
    "trust",
    "future",
  ];

  for (let i = 0; i < person1Answers.length; i++) {
    const category = categories[i];
    if (!category) continue;

    if (mode === "both" && person2Answers) {
      const diff = Math.abs(person1Answers[i] - person2Answers[i]);
      scores[category].push(100 - diff * 25);
    } else {
      const value = person1Answers[i];
      const readiness = 55 + value * 9;
      scores[category].push(readiness);
    }
  }

  const result: Record<LoveCategory, number> = {
    communication: 0,
    trust: 0,
    emotion: 0,
    conflict: 0,
    future: 0,
  };

  for (const category of loveCategoryOrder) {
    const values = scores[category];

    if (!values.length) {
      result[category] = 0;
      continue;
    }

    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
    result[category] = clampScore(avg);
  }

  return result;
}

type LoveScoreBand =
  | "excellent"
  | "strong"
  | "good"
  | "mixed"
  | "fragile"
  | "risk";

function getScoreBand(score: number): LoveScoreBand {
  if (score >= 90) return "excellent";
  if (score >= 80) return "strong";
  if (score >= 70) return "good";
  if (score >= 60) return "mixed";
  if (score >= 50) return "fragile";
  return "risk";
}

function getScoreBandLabel(score: number) {
  if (score >= 90) return "маш өндөр";
  if (score >= 80) return "хүчтэй сайн";
  if (score >= 70) return "сайн суурьтай";
  if (score >= 60) return "холимог";
  if (score >= 50) return "эмзэг";
  return "сорилттой";
}

const categoryBandText: Record<
  LoveCategory,
  Record<LoveScoreBand, { description: string; advice: string }>
> = {
  communication: {
    excellent: {
      description:
        "Та хоёрын харилцах хэв маяг маш өндөр түвшинд харагдаж байна. Асуудлыг нуухгүй ярилцах, нэгнийхээ үгийг таслахгүй сонсох, ойлголцолд хүрэх чадвар хүчтэй байна. Ийм хосууд үл ойлголцлыг хуримтлуулалгүй, цаг тухайд нь тайван ярилцах боломжтой байдаг.",
      advice:
        "Энэ давуу талаа хадгалахын тулд зөвхөн асуудал гарсан үед биш, энгийн үед ч мэдрэмжээ хуваалцаж байгаарай. Харилцааны халуун дулаан уур амьсгал байнгын жижиг ярианаас эхэлдэг.",
    },
    strong: {
      description:
        "Харилцааны суурь хүчтэй сайн байна. Та хоёр ихэнх үед ярилцаж ойлголцох боломжтой ч зарим нарийн сэдэв дээр нэг нь илүү шууд, нөгөө нь болгоомжтой хандах магадлалтай.",
      advice:
        "Маргаантай сэдэв дээр хэн нь зөв гэдгээ батлах гэж яаралгүй, эхлээд нөгөө хүнийхээ санааг зөв ойлгосон эсэхээ шалгаж хэвшээрэй.",
    },
    good: {
      description:
        "Харилцааны хэв маяг сайн суурьтай байна. Ойлголцох боломж байгаа ч зарим үед хэлэх гэсэн санаа буруу өнгөөр хүрэх, эсвэл нэг тал дотроо хадгалах эрсдэлтэй.",
      advice:
        "“Чи дандаа...” гэж буруутгахаас илүү “надад ингэж мэдрэгдсэн” гэж тайлбарлавал хамгаалалт багасаж, яриа илүү зөөлөн болно.",
    },
    mixed: {
      description:
        "Харилцааны хэсэг холимог харагдаж байна. Та хоёр ярилцах хүсэлтэй байж болох ч нэг нь хурдан шийдэх гэдэг, нөгөө нь бодох хугацаа хүсдэг байж магадгүй. Энэ ялгаа буруу ойлголцол үүсгэж болно.",
      advice:
        "Ярихаас өмнө тайвшрах хугацаа өгөх дүрэмтэй болоорой. Жишээ нь: “Одоо биш, 30 минутын дараа тайван ярья” гэх мэт тодорхой хэлбэр үр дүнтэй.",
    },
    fragile: {
      description:
        "Харилцааны хэв маяг эмзэг түвшинд байна. Буруу ойлгох, гомдлоо дотроо хадгалах, эсвэл яриаг маргаан болгож хувиргах магадлал өндөр байна.",
      advice:
        "Эхний зорилго нь асуудлыг бүрэн шийдэх биш, аюулгүй ярилцах орчин бүрдүүлэх байх хэрэгтэй. Богино, тодорхой, буруутгалгүй өгүүлбэр ашиглаарай.",
    },
    risk: {
      description:
        "Харилцааны хэв маяг сорилттой байна. Хэрвээ нэг тал ярилцахаас зайлсхийж, нөгөө тал хүчтэй шахвал харилцаа амархан ядарч болзошгүй.",
      advice:
        "Хүнд яриаг хүчээр эхлүүлэх хэрэггүй. Эхлээд итгэлтэй, тайван орчин бүрдүүлж, жижиг сэдвүүдээс эхлэн ярилцах дадал суулгах нь зөв.",
    },
  },

  trust: {
    excellent: {
      description:
        "Итгэлцлийн оноо маш өндөр байна. Та хоёрын хооронд үнэнч байдал, тогтвортой хандлага, нэгэндээ найдах мэдрэмж хүчтэй үүсэх боломжтой. Энэ нь урт хугацааны харилцаанд маш сайн суурь болдог.",
      advice:
        "Итгэлцэл өндөр үед ч жижиг амлалтаа биелүүлэх, ил тод байх, нэгнийхээ эмзэг сэдвийг хүндлэх нь харилцааг улам бат бөх болгоно.",
    },
    strong: {
      description:
        "Итгэлцлийн суурь хүчтэй сайн байна. Та хоёр нэгэндээ найдах боломжтой ч зарим үед баталгаажуулалт, анхаарал, тогтмол харилцаа хэрэгтэй байж магадгүй.",
      advice:
        "Итгэлийг том үгээр биш, өдөр тутмын тогтвортой үйлдлээр хамгаалаарай. Хариу өгөх, хэлсэндээ хүрэх, нууж хаахгүй байх нь чухал.",
    },
    good: {
      description:
        "Итгэлцэл сайн суурьтай байна. Гэхдээ итгэл бүрэн автоматаар үүсэхгүй. Зарим жижиг эргэлзээ гарвал тэрийг шууд том асуудал болгохоос өмнө тайван асуух хэрэгтэй.",
      advice:
        "Таамаглаж дүгнэхийн оронд шууд, зөөлөн асуу. “Би буруу ойлгосон байж магадгүй, гэхдээ...” гэж эхлэх нь хамгаалалт багасгана.",
    },
    mixed: {
      description:
        "Итгэлцлийн хэсэг холимог байна. Нэг тал хурдан итгэдэг, нөгөө тал болгоомжтой ханддаг байж магадгүй. Энэ ялгаа анхааралгүй орхивол гомдол эсвэл хардалт болж хувирч болно.",
      advice:
        "Харилцааны эхэнд хил хязгаар, хувийн орон зай, social харилцаа, үнэнч байдлын хүлээлтээ тодорхой ярилцаарай.",
    },
    fragile: {
      description:
        "Итгэлцэл эмзэг түвшинд байна. Амлалт биелэхгүй байх, хариу удах, нуусан мэт санагдах жижиг зүйлс ч харилцаанд хүчтэй нөлөөлж магадгүй.",
      advice:
        "Ийм үед итгэл шаардах биш, итгэл бий болгох дадал хэрэгтэй. Ил тод байдал, тогтмол байдал, тайлбаргүй алга болохгүй байх нь чухал.",
    },
    risk: {
      description:
        "Итгэлцлийн тал сорилттой харагдаж байна. Хэрвээ эргэлзээ, хардалт, баталгаа нэхэх байдал их байвал харилцаа амархан түгшүүртэй болно.",
      advice:
        "Итгэлцэл сул үед хурдан гүнзгий амлалт өгөхөөс зайлсхий. Эхлээд бодит үйлдэл, тогтвортой харилцаагаар аюулгүй мэдрэмж бий болгох хэрэгтэй.",
    },
  },

  emotion: {
    excellent: {
      description:
        "Сэтгэл хөдлөлийн холбоо маш өндөр байна. Та хоёр хайр, халамж, дэмжлэгийг мэдрэх болон илэрхийлэх тал дээр сайн нийцэх боломжтой. Ийм холбоо харилцааг дулаан, ойр, амьд мэдрэмжтэй болгодог.",
      advice:
        "Энэ холбоог улам гүн болгохын тулд зөвхөн сайхан үед биш, эмзэг үедээ ч нэгэндээ зөөлөн хандаарай. Сэтгэлээ нуухгүй хуваалцах нь хүчтэй тал болно.",
    },
    strong: {
      description:
        "Сэтгэл хөдлөлийн холбоо хүчтэй сайн байна. Та хоёр нэгэндээ халамж, анхаарал өгөх боломжтой ч хайраа илэрхийлэх хэлбэр өөр байж магадгүй.",
      advice:
        "Нэг нь үгээр, нөгөө нь үйлдлээр хайраа илэрхийлдэг байж болно. Өөрийнхөөрөө дүгнэхээс өмнө нөгөө хүнийхээ хайрын хэлбэрийг ажигла.",
    },
    good: {
      description:
        "Сэтгэл хөдлөлийн тал сайн суурьтай байна. Дотно мэдрэмж үүсэх боломж байгаа ч зарим үед анхаарал дутсан мэт, эсвэл буруу ойлгогдсон мэт санагдах үе гарч болно.",
      advice:
        "Хайр, анхаарал, талархлаа жижигхэн ч гэсэн тогтмол илэрхийл. Харилцаанд том үйл явдал гэхээсээ илүү давтагддаг жижиг халамж хүчтэй нөлөөлдөг.",
    },
    mixed: {
      description:
        "Сэтгэл хөдлөлийн холбоо холимог байна. Нэг тал илүү их ойр дотно байдал хүсэж, нөгөө тал хувийн зайгаа хамгаалах хандлагатай байж магадгүй.",
      advice:
        "Ойр байх хэрэгцээ ба хувийн орон зай хоёрын тэнцвэрийг эрт ярилц. “Чамд зай хэрэгтэй үед би яаж ойлгох вэ?” гэх мэт асуулт хэрэгтэй.",
    },
    fragile: {
      description:
        "Сэтгэл хөдлөлийн тал эмзэг байна. Анхаарал дутсан, хайр мэдрэгдэхгүй байгаа, эсвэл өөрийгөө илэрхийлэхэд хэцүү санагдах эрсдэлтэй.",
      advice:
        "Харилцаанд юу таныг хайрлуулж байгаа мэт мэдрүүлдэг вэ гэдгээ тодорхой хэлж сураарай. Нөгөө хүн таах ёстой гэж хүлээвэл гомдол хуримтлагдана.",
    },
    risk: {
      description:
        "Сэтгэл хөдлөлийн холбоо сорилттой байна. Хэрвээ нэг тал байнга баталгаа хүсэж, нөгөө тал холдож байвал харилцаа түгшүүртэй хэмнэлд орж болзошгүй.",
      advice:
        "Энэ үед хүчтэй романтик амлалт өгөхөөс өмнө сэтгэлзүйн аюулгүй байдал бий эсэхийг ажигла. Тайван, хүндэтгэлтэй, тогтвортой хандлага хамгийн чухал.",
    },
  },

  conflict: {
    excellent: {
      description:
        "Маргаан шийдэх хэв маяг маш өндөр түвшинд байна. Та хоёр зөрчил гарсан ч нэгнийгээ дайсан мэт харахгүй, асуудлыг хамтдаа шийдэх боломжтой. Энэ бол урт хугацааны харилцаанд маш хүчтэй үзүүлэлт.",
      advice:
        "Маргаан багатайдаа биш, маргааны дараа эргэж эвлэрч чаддагтаа анхаар. Уучлалт, засах үйлдэл, дахин ярилцах чадвараа хадгалаарай.",
    },
    strong: {
      description:
        "Маргаан шийдэх хэв маяг хүчтэй сайн байна. Ихэнх үед тайван ярилцах боломжтой ч зарим сэдэв дээр хамгаалах хандлага гарч магадгүй.",
      advice:
        "Маргааны үед ялах гэж биш ойлгох гэж ярилц. Нэгнийхээ сул цэгийг ашиглахгүй байх нь итгэлцлийг хамгаална.",
    },
    good: {
      description:
        "Маргаан шийдэх тал сайн суурьтай байна. Зөрчил гарах нь хэвийн боловч зөв удирдвал харилцааг сулруулах биш, илүү ойлголцолтой болгох боломжтой.",
      advice:
        "Хэрүүл дундаа шийдвэр гаргах хэрэггүй. Тайвширсны дараа “юу болсон, юу мэдрэгдсэн, дараа яах вэ” гэсэн 3 асуултаар ярилц.",
    },
    mixed: {
      description:
        "Маргаан шийдэх хэв маяг холимог байна. Нэг нь асуудлыг шууд барьж авахыг хүсэж, нөгөө нь зай авахыг хүсэх магадлалтай. Энэ ялгаа буруу ойлгогдвол нэг нь шахаж, нөгөө нь зугтаж байгаа мэт санагдана.",
      advice:
        "Завсарлага авах дүрэмтэй болоорой. Завсарлага гэдэг нь зугтах биш, тайвшраад эргэж ярилцах амлалт гэдгийг тодорхой болго.",
    },
    fragile: {
      description:
        "Маргаан шийдэх тал эмзэг байна. Жижиг асуудал хурдан томорч, өнгөрсөн гомдол дахин дахин сөхөгдөх эрсдэлтэй.",
      advice:
        "Нэг удаагийн маргаанд нэг л асуудал ярь. Өмнөх бүх гомдлыг зэрэг гаргавал шийдэл биш хамгаалалт, довтолгоо нэмэгдэнэ.",
    },
    risk: {
      description:
        "Маргаан шийдэх хэв маяг сорилттой байна. Хэрвээ буруутгал, дуугаа хураах, алга болох, эсвэл хэт ширүүн үг их байвал харилцаа сэтгэлзүйн хувьд ядрааж болзошгүй.",
      advice:
        "Энэ үед хамгийн түрүүнд аюулгүй харилцах дүрэм хэрэгтэй. Доромжлохгүй, сүрдүүлэхгүй, алга болохгүй, тайвширсны дараа заавал эргэж ярилцах зарчим баримтал.",
    },
  },

  future: {
    excellent: {
      description:
        "Ирээдүйн чиглэл маш өндөр нийцэлтэй харагдаж байна. Урт хугацааны зорилго, амьдралын хэмнэл, хамтын төлөвлөгөө дээр ойлголцох боломж хүчтэй байна.",
      advice:
        "Энэ давуу талаа бодит төлөвлөгөө болгож хувирга. Мөнгө, ажил, гэр бүл, амьдрах орчин, хувийн орон зай зэрэг сэдвээ үе шаттай ярилцаарай.",
    },
    strong: {
      description:
        "Ирээдүйн чиглэл хүчтэй сайн байна. Та хоёр урт хугацааны харилцааг төсөөлөх боломжтой ч зарим практик сэдэв дээр илүү тодорхой ярилцах хэрэгтэй.",
      advice:
        "Ирээдүйн тухай ерөнхий мөрөөдөл биш, бодит хүлээлт ярь. Жишээ нь: санхүү, карьер, гэр бүл, амьдралын хэв маяг.",
    },
    good: {
      description:
        "Ирээдүйн чиглэл сайн суурьтай байна. Та хоёрын зорилго ойролцоо байж болох ч бүх зүйл автоматаар таарна гэж үзэхэд эрт байна.",
      advice:
        "Харилцаа гүнзгийрэхээс өмнө “5 жилийн дараа би ямар амьдрал хүсэж байна вэ?” гэдэг асуултыг хоёулаа ярилцах хэрэгтэй.",
    },
    mixed: {
      description:
        "Ирээдүйн чиглэл холимог байна. Нэг тал тогтвортой байдал, нөгөө тал эрх чөлөө эсвэл өөрчлөлт хүсэх магадлалтай. Энэ нь буруу биш ч тохиролцоо шаарддаг.",
      advice:
        "Ирээдүйн талаар ярихаас зайлсхийвэл зөрүү дараа нь том асуудал болно. Тайван үедээ амьдралын хэмнэл, мөнгө, гэр бүл, зорилгоо ярилцаарай.",
    },
    fragile: {
      description:
        "Ирээдүйн чиглэл эмзэг харагдаж байна. Та хоёрын урт хугацааны хүлээлт өөр байж магадгүй. Нэг нь баталгаатай холбоо хүсэж, нөгөө нь тодорхойгүй байдалд илүү тухтай байж болно.",
      advice:
        "Хэт хурдан амлалт өгөхөөс зайлсхий. Эхлээд үнэт зүйл, амьдралын хэв маяг, ирээдүйн хүлээлт үнэхээр ойролцоо эсэхийг шалга.",
    },
    risk: {
      description:
        "Ирээдүйн чиглэл сорилттой байна. Хэрвээ та хоёрын амьдралын зорилго, хэмнэл, үнэт зүйлс хол байвал таталцал байсан ч урт хугацаанд дарамт үүсч болзошгүй.",
      advice:
        "Ийм үед мэдрэмжээрээ шууд том шийдвэр гаргах хэрэггүй. Ирээдүйн гол сэдвүүд дээр үнэнээрээ ярилцаж, өөрчлөх боломжгүй ялгааг хүлээн зөвшөөрөх хэрэгтэй.",
    },
  },
};

function buildDetailedSections(
  categoryScores: Record<LoveCategory, number>,
): LoveDetailedSection[] {
  return loveCategoryOrder.map((key) => {
    const score = categoryScores[key];
    const band = getScoreBand(score);
    const level = getScoreBandLabel(score);
    const text = categoryBandText[key][band];

    return {
      key,
      title: categoryLabels[key],
      score,
      description: `${text.description} Энэ хэсгийн түвшин: ${level}.`,
      advice: text.advice,
    };
  });
}

function getNameNumberMeaning(num: number) {
  const meanings: Record<number, string> = {
    1: "манлайлах, өөрийнхөөрөө байх, шийдвэртэй чанар",
    2: "мэдрэмж, халамж, хамтын ойлголцол",
    3: "илэрхийлэл, хөгжилтэй байдал, харилцаа",
    4: "тогтвортой байдал, хариуцлага, итгэлцэл",
    5: "эрх чөлөө, хөдөлгөөн, шинэчлэл",
    6: "хайр, гэр бүл, халамж",
    7: "дотоод мэдрэмж, бодол, гүн холбоо",
    8: "зорилго, хүч, амжилт",
    9: "уучлал, сэтгэлийн тэнхээ, том зургаар харах чадвар",
  };

  return meanings[num] ?? "онцгой хослолын энерги";
}

function buildNameCompatibilityText(
  nameScore: number,
  reduced1: number,
  reduced2: number,
): Pick<
  LoveCalculationResult,
  | "nameCompatibilityTitle"
  | "nameCompatibilitySummary"
  | "nameCompatibilityAdvice"
> {
  const meaning1 = getNameNumberMeaning(reduced1);
  const meaning2 = getNameNumberMeaning(reduced2);

  if (nameScore >= 85) {
    return {
      nameCompatibilityTitle: "Нэрний зохицол маш сайн",
      nameCompatibilitySummary: `Нэрний тоон зохицлоор харахад та хоёрын энерги сайн нийцэж байна. Эхний хүний нэр ${reduced1} буюу ${meaning1}-ийг илэрхийлж байгаа бол хоёр дахь хүний нэр ${reduced2} буюу ${meaning2}-ийг илэрхийлж байна. Энэ хослол нь бие биенээ нөхөх, татагдах, хамтдаа урагшлах боломж өндөртэй харагдаж байна.`,
      nameCompatibilityAdvice:
        "Энэ зохицлыг зөв ашиглахын тулд бие биенийхээ хүчтэй талыг дэмжиж, жижиг зөрүүг өрсөлдөөн биш харин тэнцвэр гэж хараарай.",
    };
  }

  if (nameScore >= 70) {
    return {
      nameCompatibilityTitle: "Нэрний зохицол боломжийн сайн",
      nameCompatibilitySummary: `Нэрний тоон хэмнэлээр та хоёрын хооронд таталцал, ойлголцол үүсэх боломж байна. Эхний нэр ${reduced1} буюу ${meaning1}, хоёр дахь нэр ${reduced2} буюу ${meaning2}-тэй холбоотой энерги агуулж байна. Энэ нь шууд төгс зохицол биш ч зөв харилцвал сайхан холбоо болох боломжтой.`,
      nameCompatibilityAdvice:
        "Та хоёрын нэрний энерги харилцаанд боломж өгч байгаа ч бодит харилцаанд итгэлцэл, тогтмол яриа, хүлээлтээ зөв ойлголцох нь илүү чухал.",
    };
  }

  if (nameScore >= 55) {
    return {
      nameCompatibilityTitle: "Нэрний зохицол дундаж түвшинд",
      nameCompatibilitySummary: `Нэрний тоон зохицол дундаж түвшинд харагдаж байна. Эхний нэр ${reduced1} буюу ${meaning1}, хоёр дахь нэр ${reduced2} буюу ${meaning2} гэсэн шинжийг илэрхийлж байна. Энэ нь муу гэсэн үг биш, харин харилцаанд илүү их ойлголцол, тэвчээр хэрэгтэй гэсэн дохио байж болно.`,
      nameCompatibilityAdvice:
        "Нэрний энерги ялгаатай үед нэгнийгээ өөрчлөх гэж яарахгүй, харин юугаараа өөр гэдгээ ойлгох нь харилцааг илүү тайван болгоно.",
    };
  }

  return {
    nameCompatibilityTitle: "Нэрний зохицолд сорилт байна",
    nameCompatibilitySummary: `Нэрний тоон зохицлоор та хоёрын энерги нэлээд өөр чиглэлтэй харагдаж байна. Эхний нэр ${reduced1} буюу ${meaning1}, хоёр дахь нэр ${reduced2} буюу ${meaning2} гэсэн шинжийг илэрхийлж байна. Ийм хослолд таталцал байж болох ч ойлголцол, хүлээлт, харилцах хэв маяг дээр зөрүү гарах магадлалтай.`,
    nameCompatibilityAdvice:
      "Ийм үед яаран дүгнэхээс илүү бие биенийхээ хэрэгцээ, хил хязгаар, харилцааны хэв маягийг сайн ажиглах нь зөв.",
  };
}

function buildResultText(
  finalScore: number,
  mode: "solo" | "both",
): Pick<
  LoveCalculationResult,
  "summary" | "strengths" | "challenges" | "advice"
> {
  if (finalScore >= 85) {
    return {
      summary:
        mode === "both"
          ? "Та хоёрын хооронд ойлголцол, таталцал, сэтгэлзүйн нийцэл нэлээд өндөр харагдаж байна. Ийм төрлийн холбоо нь зөвхөн дурлалын мэдрэмжээр биш, бие биенээ сонсох, ойлгох, хамтдаа урагшлах чадвараар хүчтэй болдог. Нэрний зохицол болон хариултын хэв маяг хоёулаа эерэг тал руугаа давамгай байна."
          : "Таны өгсөн хариулт болон нэрний зохицлоос харахад энэ харилцаанд хүчтэй таталцал, сайхан боломж мэдрэгдэж байна. Та хайртай хүнтэйгээ сэтгэлээ нээлттэй хуваалцаж чадвал энэ холбоо илүү дулаан, тогтвортой болох боломжтой.",

      strengths: [
        "Бие биенээ ойлгох, дасан зохицох боломж өндөр",
        "Сэтгэл хөдлөлөө зөв илэрхийлбэл харилцаа хурдан гүнзгийрэх шинжтэй",
        "Итгэлцэл, дэмжлэг, хамтын зорилго үүсэх суурь сайн",
      ],

      challenges: [
        "Хэт их хүлээлт үүсгэвэл жижиг зүйл дээр эмзэглэх магадлалтай",
        "Сайхан мэдрэмждээ найдаад бодит яриаг хойшлуулахгүй байх хэрэгтэй",
        "Хоёулаа тайван үедээ хэрэгцээ, хил хязгаараа ярилцах нь чухал",
      ],

      advice:
        "Энэ холбоог удаан авч явахын тулд зөвхөн мэдрэмждээ биш, өдөр тутмын жижиг анхаарал, үнэнч харилцаа, тогтмол ярилцлагад найдаарай. Та хоёрын хувьд хамгийн том түлхүүр нь итгэлцлээ хамгаалах, нэгнийгээ өөрчлөх гэж яарахгүйгээр ойлгох юм.",
    };
  }

  if (finalScore >= 70) {
    return {
      summary:
        mode === "both"
          ? "Та хоёрын тохироо боломжийн сайн харагдаж байна. Энэ нь бүх зүйл өөрөө амархан болно гэсэн үг биш ч харилцааг зөв авч явбал дулаан, тогтвортой холбоо үүсэх боломж байна. Зарим зан төлөв, хүлээлтийн ялгаа байж болох ч түүнийг ярилцаж чадвал харилцаа улам сайжирна."
          : "Таны хариулт болон нэрний энергиэс харахад энэ харилцаанд боломж байна. Гэхдээ зөвхөн таталцал хангалтгүй. Та хоёрын хооронд ойлголцол, хүндлэл, харилцааны дадал сайн бүрдвэл энэ холбоо илүү сайхан хөгжих боломжтой.",

      strengths: [
        "Харилцаа хөгжих бодит боломжтой",
        "Зөрүүгээ ярилцаж чадвал ойлголцол нэмэгдэнэ",
        "Сэтгэл хөдлөл болон итгэлцлийн суурь бүрдэх боломж байна",
      ],

      challenges: [
        "Зарим үед хүлээлт өөр байснаас үл ойлголцол гарч магадгүй",
        "Нэг нь илүү их анхаарал хүсэж, нөгөө нь орон зай хүсэх үе гарч болно",
        "Асуудлыг дотроо хадгалбал харилцаа удаан хугацаанд ядрах магадлалтай",
      ],

      advice:
        "Та хоёрын хувьд хамгийн хэрэгтэй зүйл бол харилцааны дүрмээ эрт ойлголцох. Юу таалагддаг, юу эмзэглүүлдэг, ямар үед дэмжлэг хэрэгтэй байдаг гэдгээ тайван үедээ ярилц. Ингэж чадвал энэ холбоо илүү итгэлтэй, дулаан болно.",
    };
  }

  if (finalScore >= 55) {
    return {
      summary:
        mode === "both"
          ? "Та хоёрын тохироо дундаж түвшинд харагдаж байна. Энэ нь муу гэсэн үг биш. Харин харилцаа өөрөө аяндаа урсах биш, илүү их ойлголцол, тэвчээр, зөв ярилцлага шаардана гэсэн дохио. Хэрвээ хоёр тал хоёулаа хичээвэл энэ холбоонд хөгжих боломж бий."
          : "Таны өгсөн хариултаас харахад энэ харилцаанд боломж байгаа ч болгоомжтой, бодитой хандах хэрэгтэй. Анхны таталцал байж болох ч урт хугацаанд ойлголцол, хүлээлт, харилцааны хэв маяг чухал нөлөөтэй байна.",

      strengths: [
        "Зөв ярилцаж чадвал харилцаа сайжрах боломжтой",
        "Хоёр талын хэрэгцээг ойлгож эхэлбэл ойртож чадна",
        "Сэтгэлээ нээлттэй илэрхийлэх дадал суувал холбоо дулаарна",
      ],

      challenges: [
        "Хүлээлт, сэтгэл хөдлөлийн хэрэгцээ зөрөх магадлалтай",
        "Маргааны үед нэгнийгээ буруу ойлгох эрсдэл байна",
        "Харилцааны хэв маяг өөр байвал нэг тал нь ядарч мэднэ",
      ],

      advice:
        "Энэ холбоонд яарах хэрэггүй. Эхлээд бие биенийхээ бодит зан, харилцах хэв маяг, үнэт зүйлсийг сайн ажигла. Та хоёр асуудлаа тайван ярилцаж чаддаг эсэх нь энэ харилцааны ирээдүйд хамгийн их нөлөөлнө.",
    };
  }

  return {
    summary:
      mode === "both"
        ? "Та хоёрын тохироо одоогоор сорилттой тал руугаа харагдаж байна. Энэ нь заавал болохгүй гэсэн дүгнэлт биш ч харилцаа их хэмжээний ойлголцол, тэвчээр, өөрийгөө хянах чадвар шаардах магадлалтай гэсэн дохио юм. Хэрвээ нэг тал л хичээгээд байвал энэ холбоо амархан ядрааж мэднэ."
        : "Таны хариулт болон нэрний зохицлоос харахад энэ харилцаанд болгоомжтой хандах нь зөв. Таталцал байж болох ч урт хугацаанд хэрэгцээ, хүлээлт, харилцааны хэв маяг зөрөх магадлал харагдаж байна.",

    strengths: [
      "Хэрвээ зөв ярилцаж чадвал ойлголцол нэмэгдэх боломж бий",
      "Энэ харилцаа өөрийгөө илүү сайн таних боломж өгч магадгүй",
      "Хил хязгаараа тодорхой болгож чадвал зөрчил багасна",
    ],

    challenges: [
      "Харилцааны хэмнэл, хүлээлт зөрөх магадлал өндөр",
      "Сэтгэл хөдлөлөө буруу илэрхийлбэл үл ойлголцол хурдан нэмэгдэнэ",
      "Нэг тал нь илүү их өгч, нөгөө тал нь холдох мэдрэмж үүсч болзошгүй",
    ],

    advice:
      "Энэ холбоонд яарч шийдвэр гаргах хэрэггүй. Бие биенээ өөрчлөх гэж оролдохоос илүү бодит зан, хандлага, харилцах чадвараа ажигла. Хэрвээ харилцаа байнга түгшүүр, эргэлзээ төрүүлж байвал өөрийн сэтгэл санааг нэгдүгээрт тавих хэрэгтэй.",
  };
}

export function buildPairLoveResult(
  name1: string,
  name2: string,
  person1Answers: number[],
  person2Answers: number[],
): LoveCalculationResult {
  const nameData = calculateNameCompatibility(name1, name2);
  const psychologyScore = calculatePsychologyCompatibility(
    person1Answers,
    person2Answers,
  );

  const finalScore = Math.round(nameData.score * 0.3 + psychologyScore * 0.7);

  const categoryScores = buildCategoryScores(
    "both",
    person1Answers,
    person2Answers,
  );
  const detailedSections = buildDetailedSections(categoryScores);

  const text = buildResultText(finalScore, "both");
  const nameText = buildNameCompatibilityText(
    nameData.score,
    nameData.r1,
    nameData.r2,
  );

  const localized = buildLocalizedResult(text, nameText, detailedSections);

  return {
    finalScore,
    nameScore: nameData.score,
    psychologyScore,
    reduced1: nameData.r1,
    reduced2: nameData.r2,
    categoryScores,
    detailedSections,
    ...nameText,
    ...text,
    localized,
  };
}
function buildLocalizedResult(
  mnText: Pick<
    LoveCalculationResult,
    "summary" | "strengths" | "challenges" | "advice"
  >,
  mnNameText: Pick<
    LoveCalculationResult,
    | "nameCompatibilityTitle"
    | "nameCompatibilitySummary"
    | "nameCompatibilityAdvice"
  >,
  mnDetailedSections: LoveDetailedSection[],
): {
  mn: LoveLocalizedResult;
  en: LoveLocalizedResult;
} {
  return {
    mn: {
      ...mnNameText,
      detailedSections: mnDetailedSections,
      ...mnText,
    },

    en: {
      nameCompatibilityTitle: "Name compatibility",
      nameCompatibilitySummary:
        "The name compatibility reading shows how the two names may balance each other. This section is based on name numbers and should be seen as a light relationship insight, not a fixed prediction.",
      nameCompatibilityAdvice:
        "Use this as a reflection point. Real compatibility depends more on trust, communication, emotional safety, and how both people treat each other over time.",

      summary:
        "This result shows your overall relationship compatibility based on name rhythm and answer patterns. A higher score means stronger alignment, while a lower score points to areas that may need more patience and honest communication.",

      strengths: [
        "There is room to understand each other better.",
        "The relationship can improve through honest communication.",
        "Shared effort can make the connection more stable.",
      ],

      challenges: [
        "Different expectations may create misunderstandings.",
        "One person may need more closeness while the other needs more space.",
        "Unspoken feelings can slowly create distance.",
      ],

      advice:
        "Do not rely only on attraction. Pay attention to communication, consistency, emotional safety, and whether both people are willing to understand each other.",

      detailedSections: mnDetailedSections.map((section) => ({
        ...section,
        title:
          section.key === "communication"
            ? "Communication style"
            : section.key === "trust"
              ? "Trust"
              : section.key === "emotion"
                ? "Emotional connection"
                : section.key === "conflict"
                  ? "Conflict style"
                  : "Future direction",
        description:
          "This area reflects how well both answers align in this part of the relationship. Higher scores suggest stronger compatibility, while lower scores show where more patience, clarity, and honest discussion may be needed.",
        advice:
          "Use this score as a guide for what to talk about. The goal is not to judge the relationship, but to understand where both people may need more care and effort.",
      })),
    },
  };
}
export function buildSoloLoveResult(
  name1: string,
  name2: string,
  answers: number[],
): LoveCalculationResult {
  const nameData = calculateNameCompatibility(name1, name2);
  const psychologyScore = calculateSoloPsychologyEstimate(answers);

  const finalScore = Math.round(nameData.score * 0.4 + psychologyScore * 0.6);

  const categoryScores = buildCategoryScores("solo", answers);
  const detailedSections = buildDetailedSections(categoryScores);

  const text = buildResultText(finalScore, "solo");
  const nameText = buildNameCompatibilityText(
    nameData.score,
    nameData.r1,
    nameData.r2,
  );

  const localized = buildLocalizedResult(text, nameText, detailedSections);

  return {
    finalScore,
    nameScore: nameData.score,
    psychologyScore,
    reduced1: nameData.r1,
    reduced2: nameData.r2,
    categoryScores,
    detailedSections,
    ...nameText,
    ...text,
    localized,
  };
}
