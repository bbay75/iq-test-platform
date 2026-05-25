import { getNumerologyScoreBandText } from "@/data/numerologyScoreBands";
import { getNumerologyPremiumProfile } from "@/data/numerologyPremiumProfiles";
export type NumerologySection = {
  number: number;
  title: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
};

export type PhoneReading = {
  number: number;
  title: string;
  summary: string;
  matchScore: number;
  moneyEnergy: string;
  suitability: string;
  strengths: string[];
  weaknesses: string[];
};

export type CombinedReading = {
  title: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  advice: string;
};

export type NumerologyScoreBand =
  | "excellent"
  | "strong"
  | "good"
  | "mixed"
  | "fragile"
  | "risk";

export type NumerologyCategoryScores = {
  identity: number;
  expression: number;
  money: number;
  relationship: number;
  direction: number;
};

export type DetailedSection = {
  key: string;
  title: string;
  summary: string;
  points: string[];
};

export type LocalizedNumerologyResult = {
  resultTitle: string;
  resultSubtitle: string;
  scoreLabel: string;
  scoreMeaning: string;
  categoryTitle: string;
  detailedTitle: string;
  birthTitle: string;
  nameTitle: string;
  phoneTitle: string;
  combinedTitle: string;
  finalAdvice: string;
};

export type NumerologyResult = {
  test_type: "numerology";

  fullName: string;
  birthDate: string;
  phoneNumber: string;

  finalScore: number;
  scoreBand: NumerologyScoreBand;
  scoreBandText: {
    title: string;
    summary: string;
    strengthMessage: string;
    watchOut: string;
    advice: string;
    grandmaNote: string;
  };

  categoryScores: NumerologyCategoryScores;
  detailedSections: DetailedSection[];

  birth: NumerologySection;
  name: NumerologySection;
  phone: PhoneReading;
  combined: CombinedReading;

  localized: {
    mn: LocalizedNumerologyResult;
    en: LocalizedNumerologyResult;
  };
};

const LETTER_MAP: Record<string, number> = {
  А: 1,
  Б: 2,
  В: 3,
  Г: 4,
  Д: 5,
  Е: 6,
  Ё: 7,
  Ж: 8,
  З: 9,
  И: 1,
  Й: 2,
  К: 3,
  Л: 4,
  М: 5,
  Н: 6,
  О: 7,
  Ө: 8,
  П: 9,
  Р: 1,
  С: 2,
  Т: 3,
  У: 4,
  Ү: 5,
  Ф: 6,
  Х: 7,
  Ц: 8,
  Ч: 9,
  Ш: 1,
  Щ: 2,
  Ъ: 3,
  Ы: 4,
  Ь: 5,
  Э: 6,
  Ю: 7,
  Я: 8,

  A: 1,
  J: 1,
  S: 1,
  B: 2,
  K: 2,
  T: 2,
  C: 3,
  L: 3,
  U: 3,
  D: 4,
  M: 4,
  V: 4,
  E: 5,
  N: 5,
  W: 5,
  F: 6,
  O: 6,
  X: 6,
  G: 7,
  P: 7,
  Y: 7,
  H: 8,
  Q: 8,
  Z: 8,
  I: 9,
  R: 9,
};

function clampScore(score: number): number {
  return Math.max(35, Math.min(99, Math.round(score)));
}

function reduceNumber(num: number): number {
  let current = num;

  while (current > 9 && current !== 11 && current !== 22 && current !== 33) {
    current = String(current)
      .split("")
      .reduce((sum, d) => sum + Number(d), 0);
  }

  return current || 1;
}

function sumDigits(value: string): number {
  return value
    .replace(/\D/g, "")
    .split("")
    .reduce((sum, d) => sum + Number(d), 0);
}

function getBirthNumber(date: string): number {
  return reduceNumber(sumDigits(date));
}

function getNameNumber(name: string): number {
  const upper = name.toUpperCase();
  let total = 0;

  for (const ch of upper) {
    if (LETTER_MAP[ch]) total += LETTER_MAP[ch];
  }

  return reduceNumber(total || 1);
}

function getPhoneNumberValue(phone: string): number {
  return reduceNumber(sumDigits(phone));
}

function getNumberProfile(num: number): NumerologySection {
  const normalizedNumber = reduceNumber(num);
  const premium = getNumerologyPremiumProfile(normalizedNumber);

  return {
    number: premium.number,
    title: premium.shortTitle,
    summary: premium.summary,
    strengths: premium.strengths,
    weaknesses: premium.challenges,
  };
}

function getPhoneReading(phone: string, birthNumber: number): PhoneReading {
  const phoneNum = getPhoneNumberValue(phone);
  const base = getNumberProfile(phoneNum);

  let moneyEnergy = "Дундаж";
  let suitability = "Өдөр тутмын хэрэглээ";
  let bonus = 0;

  if (phoneNum === 8) {
    moneyEnergy = "Маш хүчтэй";
    suitability = "Бизнес, санхүү, борлуулалт";
    bonus = 15;
  } else if (phoneNum === 6) {
    moneyEnergy = "Тогтвортой";
    suitability = "Гэр бүл, итгэлцэл, үйлчилгээ";
    bonus = 10;
  } else if (phoneNum === 5) {
    moneyEnergy = "Идэвхтэй боловч савлагаатай";
    suitability = "Харилцаа, хөдөлгөөн, худалдаа";
    bonus = 8;
  } else if (phoneNum === 4) {
    moneyEnergy = "Аажим тогтвортой";
    suitability = "Урт хугацааны ажил, сахилга бат";
    bonus = 9;
  } else if (phoneNum === 7) {
    moneyEnergy = "Удаан боловч гүн";
    suitability = "Судалгаа, анализ, дотоод төвлөрөл";
    bonus = 5;
  } else if (phoneNum === 1) {
    moneyEnergy = "Шинэ эхлэлд сайн";
    suitability = "Хувийн брэнд, манлайлал";
    bonus = 7;
  } else if (phoneNum === 9) {
    moneyEnergy = "Өргөн хүрээтэй";
    suitability = "Нийгмийн ажил, контент, хүмүүстэй ажиллах";
    bonus = 6;
  }

  const distance = Math.abs(phoneNum - reduceNumber(birthNumber));
  const matchScore = clampScore(88 - distance * 6 + bonus);

  return {
    number: phoneNum,
    title: base.title,
    summary: `Таны утасны дугаар ${phoneNum} энергитэй байна. Энэ нь ${suitability.toLowerCase()} чиглэлд илүү хүчтэй нөлөөлөх боломжтой.`,
    matchScore,
    moneyEnergy,
    suitability,
    strengths: [
      ...base.strengths.slice(0, 2),
      `Санхүүгийн энерги: ${moneyEnergy}`,
    ],
    weaknesses: base.weaknesses.slice(0, 3),
  };
}

function getScoreBand(score: number): NumerologyScoreBand {
  if (score >= 90) return "excellent";
  if (score >= 80) return "strong";
  if (score >= 70) return "good";
  if (score >= 60) return "mixed";
  if (score >= 50) return "fragile";
  return "risk";
}

function getBandMeaningMn(scoreBand: NumerologyScoreBand): string {
  switch (scoreBand) {
    case "excellent":
      return "Маш хүчтэй зохицол. Таны үндсэн энерги, нэр, утасны дугаарын чиглэл нэг тал руу сайн ажиллаж байна.";
    case "strong":
      return "Сайн зохицол. Зарим жижиг зөрүү байгаа ч нийт энерги тань дэмжих хандлагатай.";
    case "good":
      return "Боломжийн зохицол. Зөв ашиглавал давуу тал гарна, гэхдээ зарим хэсэгт анхаарах хэрэгтэй.";
    case "mixed":
      return "Холимог энерги. Нэг тал нь дэмжиж байгаа ч нөгөө тал нь тогтворгүй мэдрэмж үүсгэж магадгүй.";
    case "fragile":
      return "Эмзэг зохицол. Өөрийн үндсэн зан төлөвтэй зөрөх хэсгүүд байна.";
    case "risk":
    default:
      return "Зөрчилтэй энерги. Энэ үр дүнг шийдвэр гаргах үндсэн шалтгаан болгохгүй, харин өөрийгөө ажиглах дохио гэж харах нь зөв.";
  }
}

function getBandMeaningEn(scoreBand: NumerologyScoreBand): string {
  switch (scoreBand) {
    case "excellent":
      return "Excellent alignment. Your birth, name, and phone energies appear to support the same direction.";
    case "strong":
      return "Strong alignment. There are small differences, but the overall pattern is supportive.";
    case "good":
      return "Good alignment. This can work well if you use your strengths intentionally.";
    case "mixed":
      return "Mixed energy. Some parts support you, while others may feel inconsistent.";
    case "fragile":
      return "Fragile alignment. There are noticeable gaps between your core energy and outer signals.";
    case "risk":
    default:
      return "Challenging alignment. Treat this as a reflection tool, not as a final decision-maker.";
  }
}

function getCategoryScores(
  birth: NumerologySection,
  name: NumerologySection,
  phone: PhoneReading,
): NumerologyCategoryScores {
  const birthBase =
    birth.number === 11 || birth.number === 22 || birth.number === 33
      ? 88
      : 72 + birth.number * 2;
  const nameDistance = Math.abs(
    reduceNumber(birth.number) - reduceNumber(name.number),
  );
  const phoneDistance = Math.abs(
    reduceNumber(birth.number) - reduceNumber(phone.number),
  );

  return {
    identity: clampScore(birthBase),
    expression: clampScore(90 - nameDistance * 7),
    money: clampScore(
      phone.matchScore + (phone.number === 8 ? 8 : phone.number === 4 ? 4 : 0),
    ),
    relationship: clampScore(
      84 -
        nameDistance * 4 +
        (birth.number === 2 || birth.number === 6 ? 6 : 0),
    ),
    direction: clampScore(86 - phoneDistance * 5),
  };
}

function getFinalScore(categoryScores: NumerologyCategoryScores): number {
  return clampScore(
    categoryScores.identity * 0.22 +
      categoryScores.expression * 0.18 +
      categoryScores.money * 0.22 +
      categoryScores.relationship * 0.18 +
      categoryScores.direction * 0.2,
  );
}

function getCombinedReading(
  birth: NumerologySection,
  name: NumerologySection,
  phone: PhoneReading,
  finalScore: number,
): CombinedReading {
  const title =
    finalScore >= 80
      ? "Well-Matched Energy Profile"
      : finalScore >= 65
        ? "Balanced but Mixed Energy Profile"
        : "Sensitive Energy Profile";

  const summary =
    finalScore >= 80
      ? "Төрсөн огноо, нэр, утасны дугаарын энерги хоорондоо харьцангуй сайн нийцэж байна. Таны үндсэн зан төлөв, илэрхийлэл, өдөр тутмын хэрэглээ нэг чиглэлд ажиллах боломжтой."
      : finalScore >= 65
        ? "Таны энерги бүрэн зөрчилтэй биш боловч зарим хэсэгт өөр өөр чиглэл рүү татах хандлага байна. Давуу талаа зөв ашиглавал боломжийн сайн үр дүн гарна."
        : "Төрсөн огноо, нэр, утасны дугаарын энерги хоорондоо мэдэгдэхүйц зөрөх хэсэгтэй байна. Үүнийг муу гэж харахаас илүү өөрийгөө ажиглах дохио гэж үзэх нь зөв.";

  const strengths = [
    `Үндсэн энерги: ${birth.title}`,
    `Нэрний илэрхийлэл: ${name.title}`,
    `Утасны энерги: ${phone.title}`,
    phone.matchScore >= 80
      ? "Утасны дугаар таны үндсэн энергийг сайн дэмжиж байна"
      : "Утасны дугаарын энерги дээр анхаарах зүйл байна",
  ];

  const weaknesses = [
    birth.number !== name.number
      ? "Дотоод мөн чанар ба бусдад харагдах дүр төрх ялгаатай байж болно"
      : "Дотоод ба гадаад энерги ойролцоо байна",
    phone.matchScore < 75
      ? "Утасны дугаарын энерги таны төрөлх энергитэй бүрэн нийлээгүй байна"
      : "Утасны энергийн зөрчил бага байна",
  ];

  const advice =
    finalScore >= 80
      ? "Одоогийн нэр, төрсөн огноо, утасны дугаарын хослол боломжийн сайн харагдаж байна. Үүнийг өөрийн давуу талаа тодруулах чиглэлд ашигла."
      : finalScore >= 65
        ? "Энэ хослол ашиглаж болох ч та аль хэсэгтээ тогтворгүй, аль хэсэгтээ хүчтэй байгаагаа мэдэж явах хэрэгтэй."
        : "Хэрвээ та санхүү, ажил, харилцаанд илүү тогтвортой энерги хүсэж байвал утасны дугаар болон өөрийн өдөр тутмын сонголтоо анхаарах хэрэгтэй.";

  return {
    title,
    summary,
    strengths,
    weaknesses,
    advice,
  };
}

function getDetailedSections(
  birth: NumerologySection,
  name: NumerologySection,
  phone: PhoneReading,
  combined: CombinedReading,
): DetailedSection[] {
  const birthPremium = getNumerologyPremiumProfile(birth.number);
  const namePremium = getNumerologyPremiumProfile(name.number);
  const phonePremium = getNumerologyPremiumProfile(phone.number);

  return [
    {
      key: "birth_energy",
      title: "Төрсөн огнооны үндсэн энерги",
      summary: birthPremium.deepReading,
      points: [
        `Таны life path number: ${birth.number}`,
        birthPremium.relationship,
        birthPremium.advice,
        birthPremium.grandmaNote,
      ],
    },
    {
      key: "name_energy",
      title: "Нэрний илэрхийлэл",
      summary: namePremium.deepReading,
      points: [
        `Таны name number: ${name.number}`,
        "Нэрний энерги нь таны бусдад мэдрэгдэх өнгө, харилцааны хэв маяг, өөрийгөө илэрхийлэх байдлыг илүү тод харуулдаг.",
        namePremium.money,
        namePremium.grandmaNote,
      ],
    },
    {
      key: "phone_energy",
      title: "Утасны дугаарын зохицол",
      summary: phone.summary,
      points: [
        `Утасны number: ${phone.number}`,
        `Match score: ${phone.matchScore}%`,
        `Мөнгөний энерги: ${phone.moneyEnergy}`,
        phonePremium.money,
        phonePremium.grandmaNote,
      ],
    },
    {
      key: "combined_insight",
      title: "Нэгдсэн дүгнэлт",
      summary: combined.summary,
      points: [
        ...combined.strengths,
        combined.advice,
        "Энэ үр дүнг хувь тавилангийн эцсийн шийдвэр гэж биш, өөрийгөө илүү сайн ойлгох зөөлөн толь гэж хараарай.",
      ],
    },
  ];
}

function getLocalizedResult(params: {
  finalScore: number;
  scoreBand: NumerologyScoreBand;
  birth: NumerologySection;
  name: NumerologySection;
  phone: PhoneReading;
  combined: CombinedReading;
}): NumerologyResult["localized"] {
  const { finalScore, scoreBand, birth, name, phone, combined } = params;

  return {
    mn: {
      resultTitle: "Таны numerology үр дүн",
      resultSubtitle: `${birth.number} үндсэн энерги, ${name.number} нэрний илэрхийлэл, ${phone.number} утасны энерги дээр суурилсан уншлага.`,
      scoreLabel: `${finalScore}% зохицол`,
      scoreMeaning: getBandMeaningMn(scoreBand),
      categoryTitle: "Гол үзүүлэлтүүд",
      detailedTitle: "Дэлгэрэнгүй тайлбар",
      birthTitle: "Төрсөн огнооны энерги",
      nameTitle: "Нэрний энерги",
      phoneTitle: "Утасны дугаарын энерги",
      combinedTitle: combined.title,
      finalAdvice: combined.advice,
    },
    en: {
      resultTitle: "Your numerology result",
      resultSubtitle: `A reading based on your ${birth.number} birth energy, ${name.number} name expression, and ${phone.number} phone vibration.`,
      scoreLabel: `${finalScore}% alignment`,
      scoreMeaning: getBandMeaningEn(scoreBand),
      categoryTitle: "Core indicators",
      detailedTitle: "Detailed reading",
      birthTitle: "Birth date energy",
      nameTitle: "Name energy",
      phoneTitle: "Phone number energy",
      combinedTitle: combined.title,
      finalAdvice: combined.advice,
    },
  };
}

export function generateNumerologyResult(input: {
  fullName: string;
  birthDate: string;
  phoneNumber: string;
}): NumerologyResult {
  const birthNumber = getBirthNumber(input.birthDate);
  const nameNumber = getNameNumber(input.fullName);
  const birth = getNumberProfile(birthNumber);
  const name = getNumberProfile(nameNumber);
  const phone = getPhoneReading(input.phoneNumber, birthNumber);

  const categoryScores = getCategoryScores(birth, name, phone);
  const finalScore = getFinalScore(categoryScores);
  const scoreBand = getScoreBand(finalScore);
  const scoreBandText = getNumerologyScoreBandText(scoreBand);
  const combined = getCombinedReading(birth, name, phone, finalScore);
  const detailedSections = getDetailedSections(birth, name, phone, combined);
  const localized = getLocalizedResult({
    finalScore,
    scoreBand,
    birth,
    name,
    phone,
    combined,
  });

  return {
    test_type: "numerology",

    fullName: input.fullName,
    birthDate: input.birthDate,
    phoneNumber: input.phoneNumber,

    finalScore,
    scoreBand,
    scoreBandText,
    categoryScores,
    detailedSections,

    birth,
    name,
    phone,
    combined,

    localized,
  };
}
