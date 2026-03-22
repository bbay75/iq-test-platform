type LoveCalculationResult = {
  finalScore: number;
  nameScore: number;
  psychologyScore: number;
  reduced1: number;
  reduced2: number;
  summary: string;
  strengths: string[];
  challenges: string[];
  advice: string;
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
          ? "Та хоёрын ерөнхий зохицол маш өндөр байна. Нэрний энерги болон харилцааны хэв маяг хоёул эерэг харагдаж байна."
          : "Таны хариулт болон нэрний зохицлоос харахад энэ харилцаа маш өндөр потенциалтай байна.",
      strengths: [
        "Сэтгэлзүйн нийцэмж өндөр",
        "Ойлголцох суурь сайн",
        "Урт хугацаанд хөгжих боломжтой",
      ],
      challenges: [
        "Хэт итгэлтэй болж асуудлыг үл ойшоохоос сэргийлэх",
        "Хүлээлтээ тогтмол ярилцаж байх хэрэгтэй",
      ],
      advice:
        "Илэн далангүй харилцаагаа хадгалж, мэдрэмж болон ирээдүйн зорилгоо тогтмол ярилцаж байгаарай.",
    };
  }

  if (finalScore >= 70) {
    return {
      summary:
        mode === "both"
          ? "Та хоёрын зохицол сайн байна. Харилцааны гол суурь боломжийн бөгөөд хөгжүүлэх сайхан нөөц харагдаж байна."
          : "Таны хэв маяг болон нэрний зохицлоос харахад сайн потенциал байна.",
      strengths: [
        "Харилцаа хөгжих боломж сайн",
        "Ойлголцол бий болгох чадвар байна",
        "Зөрүүгээ ярилцаж сайжруулах боломжтой",
      ],
      challenges: [
        "Зарим сэдэв дээр хүлээлт зөрөх магадлалтай",
        "Communication style ялгаатай байж болно",
      ],
      advice:
        "Харилцаанд юу хамгийн чухал вэ гэдгийг эрт тохиролцож, мэдрэмжээ илүү илэрхийлж байгаарай.",
    };
  }

  if (finalScore >= 55) {
    return {
      summary:
        mode === "both"
          ? "Та хоёрын зохицол дунд түвшинд байна. Тохирох тал байгаа ч илүү их ойлголцол, ярилцлага хэрэгтэй."
          : "Таны харилцааны хэв маягт тохирох хүнтэйгээ илүү нээлттэй ярилцаж байвал зохицол өсөх боломжтой.",
      strengths: ["Хөгжүүлэх боломж бий", "Ярилцлагаар сайжруулах нөөц байна"],
      challenges: [
        "Хүлээлт зөрөх магадлалтай",
        "Сэтгэл хөдлөл ба communication дээр сорилт гарч болно",
        "Маргааны үеийн арга барил ялгаатай байж магадгүй",
      ],
      advice:
        "Хил хязгаар, хэрэгцээ, ирээдүйн хүлээлтээ тодорхой ярилцаж хэвшээрэй.",
    };
  }

  return {
    summary:
      mode === "both"
        ? "Та хоёрын зохицол сорилттой байж болохоор харагдаж байна. Гэхдээ бодит харилцаа зөвхөн тестээс хамаарахгүй."
        : "Таны хэв маяг болон нэрний зохицлоос харахад харилцаанд илүү болгоомжтой, нээлттэй хандах хэрэгтэй байж магадгүй.",
    strengths: [
      "Өсөж хөгжих боломж байна",
      "Ярилцлагаар ойлголцлоо сайжруулж болно",
    ],
    challenges: [
      "Communication gap их байж болзошгүй",
      "Сэтгэлзүйн хэрэгцээ зөрөх магадлалтай",
      "Хүлээлт ба үнэт зүйлс ялгаатай байж магадгүй",
    ],
    advice:
      "Илэн далангүй ярилцаж, харилцаанд хамгийн чухал зүйлсээ эрт тохирох нь хамгаас чухал.",
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
  const text = buildResultText(finalScore, "both");

  return {
    finalScore,
    nameScore: nameData.score,
    psychologyScore,
    reduced1: nameData.r1,
    reduced2: nameData.r2,
    ...text,
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
  const text = buildResultText(finalScore, "solo");

  return {
    finalScore,
    nameScore: nameData.score,
    psychologyScore,
    reduced1: nameData.r1,
    reduced2: nameData.r2,
    ...text,
  };
}
