import { loveQuestions, type LoveCategory } from "@/data/loveQuestions";

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
  person1CategoryScores?: Record<LoveCategory, number>;
  person2CategoryScores?: Record<LoveCategory, number>;
  categoryGaps?: Record<LoveCategory, number>;
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
  "emotion",
  "communication",
  "trust",
  "conflict",
  "intimacy",
  "future",
];

const categoryLabels: Record<LoveCategory, string> = {
  emotion: "Сэтгэл хөдлөлийн холбоо",
  communication: "Харилцаа ба ойлголцол",
  trust: "Итгэлцэл ба аюулгүй байдал",
  conflict: "Зөрчил шийдвэрлэлт",
  intimacy: "Дотно байдал ба хайр халамж",
  future: "Үнэт зүйл ба хамтын ирээдүй",
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

function clampScore(score: number) {
  if (score < 0) return 0;
  if (score > 100) return 100;
  return Math.round(score);
}

function buildCategoryScores(answers: number[]): Record<LoveCategory, number> {
  const scores: Record<LoveCategory, number[]> = {
    emotion: [],
    communication: [],
    trust: [],
    conflict: [],
    intimacy: [],
    future: [],
  };

  for (let i = 0; i < loveQuestions.length; i++) {
    const question = loveQuestions[i];
    const answer = answers[i];

    if (!question || answer === undefined) continue;

    const scoredValue = question.reverse ? 6 - answer : answer;

    scores[question.category].push(scoredValue);
  }

  const result: Record<LoveCategory, number> = {
    emotion: 0,
    communication: 0,
    trust: 0,
    conflict: 0,
    intimacy: 0,
    future: 0,
  };

  for (const category of loveCategoryOrder) {
    const values = scores[category];

    if (!values.length) {
      result[category] = 0;
      continue;
    }

    const rawScore = values.reduce((sum, value) => sum + value, 0);

    const minScore = values.length * 1;
    const maxScore = values.length * 5;

    const percent = ((rawScore - minScore) / (maxScore - minScore)) * 100;

    result[category] = clampScore(percent);
  }

  return result;
}

function buildPairCategoryScores(
  person1Scores: Record<LoveCategory, number>,
  person2Scores: Record<LoveCategory, number>,
): Record<LoveCategory, number> {
  const result = {} as Record<LoveCategory, number>;

  for (const category of loveCategoryOrder) {
    result[category] = Math.round(
      (person1Scores[category] + person2Scores[category]) / 2,
    );
  }

  return result;
}

function buildCategoryGaps(
  person1Scores: Record<LoveCategory, number>,
  person2Scores: Record<LoveCategory, number>,
): Record<LoveCategory, number> {
  const result = {} as Record<LoveCategory, number>;

  for (const category of loveCategoryOrder) {
    result[category] = Math.abs(
      person1Scores[category] - person2Scores[category],
    );
  }

  return result;
}

function calculateOverallScore(categoryScores: Record<LoveCategory, number>) {
  return Math.round(
    loveCategoryOrder.reduce(
      (sum, category) => sum + categoryScores[category],
      0,
    ) / loveCategoryOrder.length,
  );
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
  intimacy: {
    excellent: {
      description:
        "Дотно байдал, хайр халамжийн холбоо маш хүчтэй харагдаж байна. Та хоёр хайр халамжаа илэрхийлэх, хамтдаа чанартай цаг өнгөрөөх, ойр дотно байдлаа мэдрэх тал дээр сайн суурьтай байна.",
      advice:
        "Энэ холбоогоо хадгалахын тулд хайр халамжаа зөвхөн онцгой үед биш, өдөр тутмын жижиг үйлдлээр тогтмол илэрхийлж байгаарай.",
    },

    strong: {
      description:
        "Дотно байдал, хайр халамжийн суурь хүчтэй байна. Та хоёрын хооронд ойр дотно холбоо мэдрэгддэг ч зарим үед хайр халамжаа илэрхийлэх хэрэгцээ өөр байж болно.",
      advice:
        "Нэгэндээ юу хамгийн их хайрлагдаж байгаа мэт мэдрэмж төрүүлдэгийг шууд ярилцаж байгаарай.",
    },

    good: {
      description:
        "Дотно байдал, хайр халамжийн тал сайн суурьтай байна. Ойр холбоо байгаа ч өдөр тутмын ачаалал, цаг завын асуудлаас болж зарим үед холдсон мэт санагдаж болно.",
      advice:
        "Хамтдаа зориуд чанартай цаг гаргаж, анхаарал халамжийг санаандгүй зүйл биш тогтмол дадал болгоорой.",
    },

    mixed: {
      description:
        "Дотно байдал, хайр халамжийн хэсэг холимог байна. Нэг тал нь илүү их ойр байдал хүсэж, нөгөө тал нь арай бага илэрхийлэх хандлагатай байж болно.",
      advice:
        "Хэн нь зөв гэдгийг шийдэхээс илүү та хоёрын ойр дотно байдлын хэрэгцээ ямар ялгаатай байгааг ярилцаарай.",
    },

    fragile: {
      description:
        "Дотно байдал, хайр халамжийн холбоо эмзэг харагдаж байна. Хайр, анхаарал дутсан мэт мэдрэмж эсвэл хамтдаа чанартай цаг бага байх асуудал үүссэн байж болно.",
      advice:
        "Яг ямар төрлийн анхаарал, халамж дутагдаж байгааг тодорхой ярилц. Нөгөө хүн өөрөө таах ёстой гэж хүлээхээс зайлсхий.",
    },

    risk: {
      description:
        "Дотно байдал, хайр халамжийн хэсэг сорилттой байна. Сэтгэл хөдлөлийн болон бие махбодын ойр байдал багассан мэт мэдрэмж харилцаанд нөлөөлж байж болно.",
      advice:
        "Ойр дотно байдлыг хүчээр шаардахаас илүү эхлээд аюулгүй харилцаа, хүндлэл, нээлттэй ярилцах орчныг сэргээхэд анхаараарай.",
    },
  },
};
const categoryLabelsEn: Record<LoveCategory, string> = {
  emotion: "Emotional connection",
  communication: "Communication & understanding",
  trust: "Trust & security",
  conflict: "Conflict resolution",
  intimacy: "Intimacy & affection",
  future: "Shared values & future",
};

const categoryBandTextEn: Record<
  LoveCategory,
  Record<LoveScoreBand, { description: string; advice: string }>
> = {
  emotion: {
    excellent: {
      description:
        "Your emotional connection appears exceptionally strong. You are likely able to express care, support each other emotionally, and feel genuinely close. This kind of connection can make the relationship feel warm, safe, and emotionally alive.",
      advice:
        "Protect this strength by staying emotionally open not only during good moments, but also when one of you feels vulnerable. Sharing difficult feelings gently can deepen the connection even further.",
    },
    strong: {
      description:
        "Your emotional connection has a strong foundation. You are generally able to offer care and emotional support, although the way each of you expresses affection may sometimes differ.",
      advice:
        "One person may show love through words while the other shows it through actions. Try to notice how your partner naturally expresses care instead of judging it only by your own style.",
    },
    good: {
      description:
        "Your emotional connection has a healthy base. Closeness and emotional support are present, although there may be moments when one person feels overlooked or misunderstood.",
      advice:
        "Express appreciation, affection, and reassurance in small but consistent ways. Repeated everyday care often matters more than occasional big gestures.",
    },
    mixed: {
      description:
        "Your emotional connection looks mixed. One person may want more closeness while the other may need more personal space, which can create uncertainty if the difference is not discussed openly.",
      advice:
        "Talk directly about the balance between closeness and personal space. Questions such as “How should I understand it when you need space?” can prevent unnecessary hurt.",
    },
    fragile: {
      description:
        "Your emotional connection appears somewhat fragile. There may be moments when affection feels insufficient, emotional needs are hard to express, or one person does not feel fully understood.",
      advice:
        "Be specific about what helps you feel loved and emotionally supported. Expecting the other person to guess your needs can gradually create disappointment.",
    },
    risk: {
      description:
        "Your emotional connection is showing meaningful strain. If one person repeatedly seeks reassurance while the other withdraws, the relationship may fall into an anxious and emotionally exhausting pattern.",
      advice:
        "Before relying on intense romantic promises, pay attention to whether the relationship feels emotionally safe, respectful, and consistent. Stability matters more than intensity.",
    },
  },

  communication: {
    excellent: {
      description:
        "Your communication appears exceptionally strong. You are likely able to discuss important issues openly, listen without immediately becoming defensive, and work toward mutual understanding before resentment builds.",
      advice:
        "Keep this strength alive by sharing thoughts and feelings even when there is no conflict. Strong communication is built through regular everyday conversations, not only serious discussions.",
    },
    strong: {
      description:
        "Your communication has a strong foundation. You can usually talk things through, although one person may be more direct while the other approaches sensitive topics more carefully.",
      advice:
        "During difficult conversations, avoid rushing to prove who is right. First make sure you have correctly understood what the other person is trying to say.",
    },
    good: {
      description:
        "Your communication is generally healthy. You are capable of understanding each other, although tone, timing, or unspoken feelings may occasionally create confusion.",
      advice:
        "Instead of saying “You always...”, try explaining your own experience with phrases such as “I felt...” This reduces defensiveness and makes the conversation easier.",
    },
    mixed: {
      description:
        "Your communication pattern is mixed. You may both want to resolve issues, but one person may prefer immediate discussion while the other needs time to think. That difference can easily become a misunderstanding.",
      advice:
        "Agree on a clear pause-and-return rule. For example: “I need 30 minutes to calm down, then we will talk.” A defined return time prevents a pause from feeling like avoidance.",
    },
    fragile: {
      description:
        "Your communication appears fragile. Misunderstandings, keeping feelings inside, or turning conversations into arguments may happen more often than is healthy.",
      advice:
        "The first goal does not have to be solving everything. Focus first on creating a safe way to talk using short, clear, and non-accusatory statements.",
    },
    risk: {
      description:
        "Your communication is showing significant strain. If one person avoids discussion while the other pushes harder for answers, both people may quickly become exhausted.",
      advice:
        "Do not force difficult conversations in heated moments. Build a calmer and safer pattern gradually, starting with smaller topics and consistent follow-through.",
    },
  },

  trust: {
    excellent: {
      description:
        "Trust appears exceptionally strong. Reliability, honesty, and the feeling that you can depend on each other seem deeply established. This creates an excellent foundation for a long-term relationship.",
      advice:
        "Even strong trust needs maintenance. Keep small promises, stay transparent, and treat each other's vulnerable information with care.",
    },
    strong: {
      description:
        "Your relationship has a strong foundation of trust. You can generally rely on each other, although occasional reassurance, attention, or consistency may still be important.",
      advice:
        "Protect trust through everyday behavior rather than big promises. Responding consistently, following through, and avoiding unnecessary secrecy all matter.",
    },
    good: {
      description:
        "Trust has a healthy foundation. However, trust does not mean every doubt disappears automatically. Small uncertainties may still arise from time to time.",
      advice:
        "Instead of assuming the worst, ask calmly and directly. Starting with “I may have misunderstood this, but...” can reduce defensiveness.",
    },
    mixed: {
      description:
        "Trust appears mixed. One person may trust quickly while the other is more cautious. If that difference is ignored, it can gradually develop into resentment, insecurity, or jealousy.",
      advice:
        "Discuss boundaries, personal space, social relationships, and expectations around loyalty before misunderstandings build.",
    },
    fragile: {
      description:
        "Trust looks fragile. Broken promises, delayed responses, unexplained behavior, or situations that feel secretive may have a stronger emotional impact than usual.",
      advice:
        "Instead of demanding trust, build it through transparent and predictable behavior. Consistency and clear communication are especially important here.",
    },
    risk: {
      description:
        "Trust is showing significant strain. Frequent doubt, jealousy, checking, or repeated demands for reassurance can make the relationship feel anxious and unstable.",
      advice:
        "Avoid making major commitments before trust has been rebuilt through real behavior. Emotional safety should come from consistency, not repeated promises.",
    },
  },

  conflict: {
    excellent: {
      description:
        "Your conflict-resolution pattern appears exceptionally healthy. Even when you disagree, you are likely able to treat the problem as something to solve together rather than treating each other as opponents.",
      advice:
        "The goal is not to avoid every disagreement. Preserve your ability to repair after conflict through apologies, follow-up conversations, and concrete changes.",
    },
    strong: {
      description:
        "Your conflict-resolution skills are strong. Most disagreements can probably be handled respectfully, although certain sensitive topics may still trigger defensiveness.",
      advice:
        "During conflict, focus on understanding rather than winning. Avoid using each other's vulnerabilities as weapons.",
    },
    good: {
      description:
        "Your conflict-resolution skills have a healthy base. Disagreements are normal, and when managed well they can create greater understanding rather than damage the relationship.",
      advice:
        "Avoid making major decisions while emotions are high. After calming down, discuss three things: what happened, how it felt, and what should happen next.",
    },
    mixed: {
      description:
        "Your conflict pattern is mixed. One person may want to address the problem immediately while the other prefers to step away. Without agreement, this can feel like chasing and withdrawing.",
      advice:
        "Create a clear rule for taking breaks. A break should mean calming down and returning to the conversation, not disappearing from it.",
    },
    fragile: {
      description:
        "Your conflict-resolution pattern appears fragile. Small issues may escalate quickly, and old grievances may repeatedly return during new disagreements.",
      advice:
        "Keep each argument focused on one issue. Bringing every past problem into the same conversation usually increases defensiveness instead of creating a solution.",
    },
    risk: {
      description:
        "Your conflict pattern is showing significant strain. Blame, shutting down, disappearing, or using harsh language can make the relationship emotionally exhausting.",
      advice:
        "The first priority is establishing safe conflict rules: no insults, no threats, no disappearing, and a commitment to return to the discussion after both people have calmed down.",
    },
  },

  intimacy: {
    excellent: {
      description:
        "Intimacy and affection appear exceptionally strong. You seem to have a solid foundation of warmth, physical or emotional closeness, affection, and meaningful time together.",
      advice:
        "Maintain this connection through small daily expressions of affection rather than saving care only for special occasions.",
    },
    strong: {
      description:
        "Your intimacy and affection have a strong foundation. Closeness is present, although the amount or style of affection each person needs may sometimes differ.",
      advice:
        "Talk openly about what makes each of you feel loved, wanted, and emotionally close.",
    },
    good: {
      description:
        "Your intimacy and affection have a healthy base. The connection is present, but daily responsibilities or lack of time may occasionally create some distance.",
      advice:
        "Make intentional time for each other and treat quality time as a regular relationship habit rather than something that only happens when convenient.",
    },
    mixed: {
      description:
        "Your intimacy and affection appear mixed. One person may want more closeness or affection while the other naturally expresses it less often.",
      advice:
        "Instead of deciding whose need is more correct, talk about how your needs for closeness are different and what balance would work for both of you.",
    },
    fragile: {
      description:
        "Your intimacy and affection appear fragile. One or both of you may feel that affection, attention, or meaningful time together is not currently enough.",
      advice:
        "Be specific about what kind of affection or attention feels missing. Avoid expecting your partner to automatically know what you need.",
    },
    risk: {
      description:
        "Intimacy and affection are showing significant strain. Emotional or physical closeness may feel reduced, and that distance may already be affecting the relationship.",
      advice:
        "Rather than demanding closeness, first rebuild safety, respect, and honest communication. Intimacy usually improves when emotional security improves.",
    },
  },

  future: {
    excellent: {
      description:
        "Your shared direction for the future appears exceptionally aligned. Long-term goals, lifestyle expectations, and plans for building a life together seem highly compatible.",
      advice:
        "Turn this strength into practical planning. Discuss money, work, family, living arrangements, independence, and personal space in concrete terms.",
    },
    strong: {
      description:
        "Your shared future has a strong foundation. You can likely imagine a long-term relationship together, although some practical expectations still deserve clearer discussion.",
      advice:
        "Move beyond general dreams and talk about real expectations involving finances, careers, family, and lifestyle.",
    },
    good: {
      description:
        "Your shared future has a healthy base. Your goals may be broadly similar, but it is still too early to assume every major life decision will naturally align.",
      advice:
        "Discuss questions such as: “What kind of life do I want five years from now?” before the relationship becomes more deeply committed.",
    },
    mixed: {
      description:
        "Your future direction appears mixed. One person may value stability while the other wants greater freedom or change. This is not automatically a problem, but it requires conscious agreement.",
      advice:
        "Avoid postponing conversations about the future. Discuss lifestyle, money, family, career, and personal goals while things are calm.",
    },
    fragile: {
      description:
        "Your shared future appears fragile. Long-term expectations may differ, with one person wanting more certainty while the other feels more comfortable leaving things open.",
      advice:
        "Avoid rushing into major promises. First explore whether your values, lifestyle expectations, and long-term goals are genuinely compatible.",
    },
    risk: {
      description:
        "Your shared future is showing significant strain. If your major life goals, values, or preferred lifestyles are very different, attraction alone may not prevent long-term pressure.",
      advice:
        "Do not make major decisions based only on emotion. Discuss the core future issues honestly and identify which differences are flexible and which are not.",
    },
  },
};
function buildDetailedSectionsEn(
  categoryScores: Record<LoveCategory, number>,
): LoveDetailedSection[] {
  return loveCategoryOrder.map((key) => {
    const score = categoryScores[key];
    const band = getScoreBand(score);
    const text = categoryBandTextEn[key][band];

    return {
      key,
      title: categoryLabelsEn[key],
      score,
      description: text.description,
      advice: text.advice,
    };
  });
}
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

const categoryStrengthText: Record<LoveCategory, string> = {
  emotion: "Сэтгэл хөдлөлөө хуваалцах, нэгнээ ойлгож дэмжих холбоо хүчтэй",
  communication: "Нээлттэй ярилцах, сонсох, ойлголцолд хүрэх чадвар сайн",
  trust: "Итгэлцэл, найдвартай байдал, сэтгэлзүйн аюулгүй байдлын суурь сайн",
  conflict: "Зөрчил гарсан үед асуудлыг хүндэтгэлтэйгээр шийдэх чадвар сайн",
  intimacy:
    "Хайр халамж, ойр дотно байдал, хамтдаа чанартай цагийн холбоо сайн",
  future: "Үнэт зүйл, хамтын зорилго, ирээдүйн чиглэл нийцэх суурь сайн",
};

const categoryRiskText: Record<LoveCategory, string> = {
  emotion:
    "Сэтгэлээ нээх, ойлгогдож дэмжигдэх мэдрэмж дээр зай үүсэх эрсдэлтэй",
  communication:
    "Үл ойлголцол, дотроо хадгалах эсвэл хэцүү сэдвээс зайлсхийх эрсдэлтэй",
  trust:
    "Итгэлцэл, найдвартай байдал эсвэл аюулгүй мэдрэмж дээр эргэлзээ үүсэх эрсдэлтэй",
  conflict:
    "Маргаан хуримтлагдах, хамгаалах эсвэл дайрах хэв маяг үүсэх эрсдэлтэй",
  intimacy:
    "Хайр халамж, чанартай цаг, ойр дотно байдлын хэрэгцээ хангалтгүй үлдэх эрсдэлтэй",
  future: "Үнэт зүйл, амьдралын зорилго, ирээдүйн хүлээлт зөрөх эрсдэлтэй",
};

const categoryStrengthTextEn: Record<LoveCategory, string> = {
  emotion:
    "A strong ability to share emotions, understand each other, and provide emotional support",
  communication:
    "A healthy ability to communicate openly, listen carefully, and reach mutual understanding",
  trust: "A solid foundation of trust, reliability, and emotional security",
  conflict:
    "A healthy ability to handle disagreements respectfully and work toward solutions",
  intimacy:
    "A strong foundation of affection, closeness, and meaningful quality time together",
  future:
    "A healthy foundation of shared values, common goals, and long-term direction",
};

const categoryRiskTextEn: Record<LoveCategory, string> = {
  emotion:
    "Emotional distance may develop if feelings are difficult to express or emotional support feels insufficient",
  communication:
    "Misunderstandings, unspoken concerns, or avoidance of difficult conversations may create distance",
  trust: "Doubts may develop around reliability, loyalty, or emotional safety",
  conflict:
    "Unresolved disagreements, defensiveness, or aggressive conflict patterns may gradually build up",
  intimacy:
    "Needs for affection, quality time, or emotional closeness may not feel fully met",
  future:
    "Differences in values, life goals, or long-term expectations may become more important over time",
};

function buildResultText(
  finalScore: number,
  categoryScores: Record<LoveCategory, number>,
): Pick<
  LoveCalculationResult,
  "summary" | "strengths" | "challenges" | "advice"
> {
  const ranked = loveCategoryOrder
    .map((key) => ({
      key,
      score: categoryScores[key],
    }))
    .sort((a, b) => b.score - a.score);

  const topCutoff = ranked[Math.min(2, ranked.length - 1)].score;

  const bottomRanked = [...ranked].sort((a, b) => a.score - b.score);

  const bottomCutoff = bottomRanked[Math.min(2, bottomRanked.length - 1)].score;

  // Tie байвал хүчээр нэгийг сонгохгүй.
  const strongest = ranked.filter((item) => item.score >= topCutoff);

  const attention = bottomRanked.filter((item) => item.score <= bottomCutoff);

  const strengths = strongest.map((item) => categoryStrengthText[item.key]);

  const challenges = attention.map((item) => categoryRiskText[item.key]);

  const attentionAdvice = attention
    .map((item) => {
      const band = getScoreBand(item.score);
      return categoryBandText[item.key][band].advice;
    })
    .join(" ");

  let summary = "";

  if (finalScore >= 85) {
    summary =
      "Таны өгсөн хариултаар энэ харилцааны нийт суурь маш хүчтэй харагдаж байна. Гэхдээ нийт онооноос илүү 6 чиглэлийн ялгааг харах нь чухал. Таны өндөр оноотой хэсгүүд харилцааны гол давуу тал болж байгаа бол харьцангуй бага оноотой хэсгүүд нь цааш анхаарч хөгжүүлэх боломжийг харуулна.";
  } else if (finalScore >= 70) {
    summary =
      "Таны өгсөн хариултаар энэ харилцаа сайн суурьтай харагдаж байна. Зарим чиглэл бусдаасаа илүү хүчтэй бөгөөд харьцангуй сул хэсгүүд дээр ойлголцол, тогтвортой дадал нэмэх боломж байна.";
  } else if (finalScore >= 55) {
    summary =
      "Таны өгсөн хариултаар энэ харилцаанд хүчтэй болон анхаарах талууд зэрэгцэн байна. Аль хэсэг сайн, аль хэсэг эмзэг байгааг ялгаж харах нь нийт онооноос илүү хэрэгтэй мэдээлэл өгнө.";
  } else {
    summary =
      "Таны өгсөн хариултаар харилцааны хэд хэдэн хэсэгт бодитоор анхаарах шаардлага харагдаж байна. Энэ нь харилцаа заавал бүтэлгүй гэсэн дүгнэлт биш; харин яг аль чиглэлд асуудал төвлөрч байгааг тодорхой харах нь чухал.";
  }

  return {
    summary,
    strengths,
    challenges,
    advice: attentionAdvice,
  };
}
function buildResultTextEn(
  finalScore: number,
  categoryScores: Record<LoveCategory, number>,
): Pick<
  LoveCalculationResult,
  "summary" | "strengths" | "challenges" | "advice"
> {
  const ranked = loveCategoryOrder
    .map((key) => ({
      key,
      score: categoryScores[key],
    }))
    .sort((a, b) => b.score - a.score);

  const topCutoff = ranked[Math.min(2, ranked.length - 1)].score;

  const bottomRanked = [...ranked].sort((a, b) => a.score - b.score);

  const bottomCutoff = bottomRanked[Math.min(2, bottomRanked.length - 1)].score;

  // Preserve ties exactly as the Mongolian result does.
  const strongest = ranked.filter((item) => item.score >= topCutoff);

  const attention = bottomRanked.filter((item) => item.score <= bottomCutoff);

  const strengths = strongest.map((item) => categoryStrengthTextEn[item.key]);

  const challenges = attention.map((item) => categoryRiskTextEn[item.key]);

  const attentionAdvice = attention
    .map((item) => {
      const band = getScoreBand(item.score);
      return categoryBandTextEn[item.key][band].advice;
    })
    .join(" ");

  let summary = "";

  if (finalScore >= 85) {
    summary =
      "Based on your answers, the overall foundation of this relationship appears very strong. However, the six individual areas are more informative than the total score alone. Your highest-scoring areas show the strongest parts of the relationship, while the relatively lower areas show where additional attention may help the relationship grow.";
  } else if (finalScore >= 70) {
    summary =
      "Based on your answers, this relationship appears to have a healthy overall foundation. Some areas are clearly stronger than others, while the relatively weaker areas show where greater understanding, consistency, or intentional effort may be useful.";
  } else if (finalScore >= 55) {
    summary =
      "Based on your answers, this relationship contains both meaningful strengths and areas that deserve attention. Looking at which areas are strongest and which are more fragile gives more useful information than relying on the overall score alone.";
  } else {
    summary =
      "Based on your answers, several areas of the relationship may need meaningful attention. This does not automatically mean the relationship will fail. The important point is to identify where the main difficulties are concentrated and whether both people are willing to work on them.";
  }

  return {
    summary,
    strengths,
    challenges,
    advice: attentionAdvice,
  };
}
export function buildPairLoveResult(
  name1: string,
  name2: string,
  person1Answers: number[],
  person2Answers: number[],
): LoveCalculationResult {
  const nameData = calculateNameCompatibility(name1, name2);

  const person1CategoryScores = buildCategoryScores(person1Answers);
  const person2CategoryScores = buildCategoryScores(person2Answers);

  const categoryScores = buildPairCategoryScores(
    person1CategoryScores,
    person2CategoryScores,
  );

  const categoryGaps = buildCategoryGaps(
    person1CategoryScores,
    person2CategoryScores,
  );

  const psychologyScore = calculateOverallScore(categoryScores);
  const finalScore = psychologyScore;

  const detailedSections = buildDetailedSections(categoryScores);
  const text = buildResultText(finalScore, categoryScores);

  const nameText = buildNameCompatibilityText(
    nameData.score,
    nameData.r1,
    nameData.r2,
  );

  const localized = buildLocalizedResult(
    text,
    nameText,
    detailedSections,
    finalScore,
    categoryScores,
  );

  return {
    finalScore,
    nameScore: nameData.score,
    psychologyScore,
    reduced1: nameData.r1,
    reduced2: nameData.r2,
    categoryScores,
    person1CategoryScores,
    person2CategoryScores,
    categoryGaps,
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
  finalScore: number,
  categoryScores: Record<LoveCategory, number>,
): {
  mn: LoveLocalizedResult;
  en: LoveLocalizedResult;
} {
  const enText = buildResultTextEn(finalScore, categoryScores);
  const enDetailedSections = buildDetailedSectionsEn(categoryScores);

  return {
    mn: {
      ...mnNameText,
      detailedSections: mnDetailedSections,
      ...mnText,
    },

    en: {
      nameCompatibilityTitle: "Name compatibility",
      nameCompatibilitySummary:
        "The name-number reading suggests how the two names may symbolically complement or contrast with each other. It can be used as a light, entertaining reflection, but it should not be treated as a prediction of how the relationship will actually develop.",
      nameCompatibilityAdvice:
        "Treat this section as a fun extra rather than evidence about the relationship. Real compatibility depends far more on trust, communication, emotional safety, shared expectations, and how both people consistently treat each other.",

      detailedSections: enDetailedSections,

      ...enText,
    },
  };
}
export function buildSoloLoveResult(
  name1: string,
  name2: string,
  answers: number[],
): LoveCalculationResult {
  const nameData = calculateNameCompatibility(name1, name2);
  const categoryScores = buildCategoryScores(answers);

  const psychologyScore = calculateOverallScore(categoryScores);

  const finalScore = psychologyScore;
  const detailedSections = buildDetailedSections(categoryScores);

  const text = buildResultText(finalScore, categoryScores);
  const nameText = buildNameCompatibilityText(
    nameData.score,
    nameData.r1,
    nameData.r2,
  );

  const localized = buildLocalizedResult(
    text,
    nameText,
    detailedSections,
    finalScore,
    categoryScores,
  );

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
