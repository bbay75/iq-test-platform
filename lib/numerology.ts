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

  scoreBandText: {
    title: string;
    summary: string;
    strengthMessage: string;
    watchOut: string;
    advice: string;
    grandmaNote: string;
  };

  birth: NumerologySection;
  name: NumerologySection;
  phone: PhoneReading;
  combined: CombinedReading;
  detailedSections: DetailedSection[];
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
function getEnglishScoreBandText(scoreBand: NumerologyScoreBand) {
  switch (scoreBand) {
    case "excellent":
      return {
        title: "A clear and powerful energy alignment",
        summary:
          "Your birth energy, name expression, and phone number are moving in a supportive direction. This does not mean everything will happen easily, but it shows that your natural rhythm has strong backing. When you use your strengths wisely, progress can feel smoother.",
        strengthMessage:
          "Your strongest point is inner consistency. You are likely to make better decisions when you trust your own direction.",
        watchOut:
          "Do not become overconfident or ignore small warning signs. Even strong energy needs patience and discipline.",
        advice:
          "Use this period to build something meaningful. Keep your plans simple, stay consistent, and avoid scattering your energy.",
        grandmaNote:
          "When the road is open, walk with gratitude, not pride. A steady heart carries good fortune further.",
      };
    case "strong":
      return {
        title: "Strong energy with good support",
        summary:
          "Your overall pattern is supportive, even if not every part is perfectly aligned. Your natural energy has enough strength to carry you forward. Small adjustments in habits, communication, and focus can improve the result even more.",
        strengthMessage:
          "You have a good base for progress. Your energy can support responsibility, growth, and stable movement.",
        watchOut:
          "Avoid forcing everything to happen quickly. Rushing may create unnecessary stress.",
        advice:
          "Move step by step and choose the direction that feels calm, not just exciting. The right path will not always be loud.",
        grandmaNote:
          "A strong person does not need to run all the time. Sometimes walking steadily is what brings the best result.",
      };
    case "good":
      return {
        title: "A gentle and workable energy flow",
        summary:
          "Your result shows a usable and fairly balanced energy. There may be some areas that need attention, but nothing here should be seen as bad or unlucky. With self-awareness, this combination can still support a good path.",
        strengthMessage:
          "You are able to adapt and learn from experience. This flexibility can become one of your quiet strengths.",
        watchOut:
          "Try not to compare your timing with others. Your growth may come more gradually.",
        advice:
          "Focus on what is already working in your life. Improve the weak points calmly instead of judging yourself harshly.",
        grandmaNote:
          "A flower does not bloom by looking at another flower. Give yourself the right season and the right care.",
      };
    case "mixed":
      return {
        title: "Mixed energy asking for balance",
        summary:
          "Your energy is not fully conflicting, but some parts may pull in different directions. One side may want movement, while another side asks for rest or caution. This is not a bad sign; it simply means you need to understand your own rhythm more clearly.",
        strengthMessage:
          "You have more than one side to your personality. This can help you understand different people and situations.",
        watchOut:
          "When your mind is tired, you may make decisions from pressure instead of clarity.",
        advice:
          "Do not force yourself to be one fixed type of person. Notice when you are strong, when you are sensitive, and when you need space.",
        grandmaNote:
          "Even a river turns around stones softly. You do not always need force; sometimes wisdom is the gentler road.",
      };
    case "fragile":
      return {
        title: "Sensitive energy that needs care",
        summary:
          "Your result shows a more sensitive pattern. This does not mean you are weak or unlucky. It means your inner energy and outer signals may not always support each other naturally, so you may need more conscious choices.",
        strengthMessage:
          "You may notice things others miss. Your sensitivity can become wisdom when you protect your peace.",
        watchOut:
          "Do not ignore exhaustion or emotional pressure. Small stress can build up if you keep pushing yourself.",
        advice:
          "Choose calm routines, honest relationships, and environments that do not drain you. Your energy improves when your life becomes simpler.",
        grandmaNote:
          "A soft heart is not a small heart. Protect it well, and it will guide you better than noise ever can.",
      };
    case "risk":
    default:
      return {
        title: "Challenging energy that needs reflection",
        summary:
          "This result shows stronger tension between your birth energy, name expression, and phone number. This should not be taken as a bad fate. It is better understood as a mirror that shows where your life may need more awareness and balance.",
        strengthMessage:
          "You still have useful strengths. The key is to stop moving blindly and start choosing more intentionally.",
        watchOut:
          "Avoid making big decisions only from fear, pressure, or other people’s expectations.",
        advice:
          "Use this result as a reminder to slow down and observe yourself. You can improve your direction through better habits, clearer boundaries, and calmer choices.",
        grandmaNote:
          "A difficult road is not always a wrong road. Walk carefully, and it can still teach you something precious.",
      };
  }
}

function getEnglishNumberProfile(num: number): NumerologySection {
  const n = reduceNumber(num);

  const map: Record<number, NumerologySection> = {
    1: {
      number: 1,
      title: "Independent leader",
      summary:
        "This energy carries independence, initiative, and the desire to move forward by your own decision.",
      strengths: ["Leadership", "Courage", "Self-direction"],
      weaknesses: ["Impatience", "Stubbornness", "Difficulty asking for help"],
    },
    2: {
      number: 2,
      title: "Gentle protector",
      summary:
        "This energy is connected to harmony, care, emotional awareness, and the ability to support others.",
      strengths: ["Patience", "Empathy", "Cooperation"],
      weaknesses: [
        "Over-sensitivity",
        "Avoiding conflict",
        "Depending too much on others",
      ],
    },
    3: {
      number: 3,
      title: "Creative joy",
      summary:
        "This energy brings expression, creativity, warmth, and the ability to brighten the atmosphere around you.",
      strengths: ["Creativity", "Communication", "Optimism"],
      weaknesses: ["Scattered focus", "Mood swings", "Avoiding responsibility"],
    },
    4: {
      number: 4,
      title: "Stable builder",
      summary:
        "This energy is practical, disciplined, and connected to structure, responsibility, and long-term effort.",
      strengths: ["Discipline", "Reliability", "Practical thinking"],
      weaknesses: ["Rigidity", "Overworking", "Fear of change"],
    },
    5: {
      number: 5,
      title: "Free mover",
      summary:
        "This energy seeks freedom, change, movement, and new experiences.",
      strengths: ["Adaptability", "Curiosity", "Communication"],
      weaknesses: ["Restlessness", "Inconsistency", "Impulsive choices"],
    },
    6: {
      number: 6,
      title: "Caring guardian",
      summary:
        "This energy is linked to family, responsibility, service, beauty, and emotional warmth.",
      strengths: ["Care", "Loyalty", "Responsibility"],
      weaknesses: [
        "Over-giving",
        "Worrying too much",
        "Forgetting personal needs",
      ],
    },
    7: {
      number: 7,
      title: "Deep thinker",
      summary:
        "This energy is thoughtful, analytical, private, and drawn to deeper meaning.",
      strengths: ["Insight", "Analysis", "Inner wisdom"],
      weaknesses: ["Isolation", "Overthinking", "Emotional distance"],
    },
    8: {
      number: 8,
      title: "Power and success",
      summary:
        "This energy is connected to ambition, money, management, and material achievement.",
      strengths: ["Ambition", "Leadership", "Financial focus"],
      weaknesses: ["Pressure", "Control issues", "Work-life imbalance"],
    },
    9: {
      number: 9,
      title: "Compassionate soul",
      summary:
        "This energy is broad-hearted, generous, emotional, and connected to service and purpose.",
      strengths: ["Compassion", "Generosity", "Vision"],
      weaknesses: [
        "Emotional heaviness",
        "Over-sacrifice",
        "Difficulty letting go",
      ],
    },
    11: {
      number: 11,
      title: "Intuitive guide",
      summary:
        "This master energy is sensitive, intuitive, inspiring, and spiritually aware.",
      strengths: ["Intuition", "Inspiration", "Emotional depth"],
      weaknesses: ["Anxiety", "Over-sensitivity", "Nervous energy"],
    },
    22: {
      number: 22,
      title: "Master builder",
      summary:
        "This master energy can turn big ideas into practical results through discipline and vision.",
      strengths: ["Vision", "Structure", "Big-picture thinking"],
      weaknesses: ["Heavy pressure", "Perfectionism", "Fear of failure"],
    },
    33: {
      number: 33,
      title: "Compassionate teacher",
      summary:
        "This master energy carries deep care, healing, responsibility, and service to others.",
      strengths: ["Healing energy", "Compassion", "Guidance"],
      weaknesses: [
        "Self-sacrifice",
        "Emotional burden",
        "Taking too much responsibility",
      ],
    },
  };

  return map[n] ?? map[1];
}

function getEnglishPhoneReading(phone: PhoneReading): PhoneReading {
  let moneyEnergy = "Average";
  let suitability = "Daily use";

  if (phone.number === 8) {
    moneyEnergy = "Very strong";
    suitability = "Business, finance, sales";
  } else if (phone.number === 6) {
    moneyEnergy = "Stable";
    suitability = "Family, trust, service";
  } else if (phone.number === 5) {
    moneyEnergy = "Active but changeable";
    suitability = "Communication, movement, trade";
  } else if (phone.number === 4) {
    moneyEnergy = "Slow and stable";
    suitability = "Long-term work and discipline";
  } else if (phone.number === 7) {
    moneyEnergy = "Slow but deep";
    suitability = "Research, analysis, inner focus";
  } else if (phone.number === 1) {
    moneyEnergy = "Good for new beginnings";
    suitability = "Personal brand and leadership";
  } else if (phone.number === 9) {
    moneyEnergy = "Broad and social";
    suitability = "Social work, content, people-facing work";
  }

  const base = getEnglishNumberProfile(phone.number);

  return {
    ...phone,
    title: base.title,
    summary: `Your phone number carries ${phone.number} energy. This may support ${suitability.toLowerCase()} more strongly.`,
    moneyEnergy,
    suitability,
    strengths: [...base.strengths.slice(0, 2), `Money energy: ${moneyEnergy}`],
    weaknesses: base.weaknesses.slice(0, 3),
  };
}

function getEnglishCombinedReading(
  birth: NumerologySection,
  name: NumerologySection,
  phone: PhoneReading,
  finalScore: number,
): CombinedReading {
  const title =
    finalScore >= 80
      ? "Well-matched energy profile"
      : finalScore >= 65
        ? "Balanced but mixed energy profile"
        : "Sensitive energy profile";

  const summary =
    finalScore >= 80
      ? "Your birth energy, name expression, and phone number are relatively well aligned. Your inner nature, outer expression, and daily signals can support one direction."
      : finalScore >= 65
        ? "Your energy is not fully conflicting, but some parts may pull in different directions. If you understand your strong and unstable areas, this combination can still work well."
        : "Your birth energy, name expression, and phone number show noticeable differences. Instead of seeing this as bad, use it as a gentle signal for self-awareness.";

  const strengths = [
    `Birth energy: ${birth.title}`,
    `Name expression: ${name.title}`,
    `Phone energy: ${phone.title}`,
    phone.matchScore >= 80
      ? "Your phone number supports your core energy well"
      : "Your phone number needs more attention in relation to your core energy",
  ];

  const weaknesses = [
    birth.number !== name.number
      ? "Your inner nature and outer expression may feel different at times"
      : "Your inner and outer energies are close to each other",
    phone.matchScore < 75
      ? "Your phone energy may not fully match your natural rhythm"
      : "There is little conflict in your phone energy",
  ];

  const advice =
    finalScore >= 80
      ? "This combination looks supportive. Use it to express your strengths more clearly and move with confidence."
      : finalScore >= 65
        ? "This combination can work, but you need to know where you are steady and where you become inconsistent."
        : "If you want more stability in work, money, and relationships, pay attention to your daily choices and the energy you repeatedly surround yourself with.";

  return {
    title,
    summary,
    strengths,
    weaknesses,
    advice,
  };
}

function getEnglishDetailedSections(
  birth: NumerologySection,
  name: NumerologySection,
  phone: PhoneReading,
  combined: CombinedReading,
): DetailedSection[] {
  return [
    {
      key: "birth_energy",
      title: "Birth date core energy",
      summary: birth.summary,
      points: [
        `Your life path number: ${birth.number}`,
        "This number shows your natural rhythm, inner motivation, and the way you usually respond to life.",
        birth.strengths.length
          ? `Strengths: ${birth.strengths.join(", ")}`
          : "",
        birth.weaknesses.length
          ? `Watch out: ${birth.weaknesses.join(", ")}`
          : "",
      ].filter(Boolean),
    },
    {
      key: "name_energy",
      title: "Name expression",
      summary: name.summary,
      points: [
        `Your name number: ${name.number}`,
        "Name energy shows how others may feel your presence, communication style, and outer personality.",
        name.strengths.length ? `Strengths: ${name.strengths.join(", ")}` : "",
        name.weaknesses.length
          ? `Watch out: ${name.weaknesses.join(", ")}`
          : "",
      ].filter(Boolean),
    },
    {
      key: "phone_energy",
      title: "Phone number alignment",
      summary: phone.summary,
      points: [
        `Phone number: ${phone.number}`,
        `Match score: ${phone.matchScore}%`,
        `Money energy: ${phone.moneyEnergy}`,
        `Suitable direction: ${phone.suitability}`,
      ],
    },
    {
      key: "combined_insight",
      title: "Combined insight",
      summary: combined.summary,
      points: [
        ...combined.strengths,
        combined.advice,
        "See this result as a soft mirror for self-understanding, not as a fixed fate.",
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

  const scoreBandTextMn = getNumerologyScoreBandText(scoreBand);
  const detailedSectionsMn = getDetailedSections(birth, name, phone, combined);

  const birthEn = getEnglishNumberProfile(birth.number);
  const nameEn = getEnglishNumberProfile(name.number);
  const phoneEn = getEnglishPhoneReading(phone);
  const combinedEn = getEnglishCombinedReading(
    birthEn,
    nameEn,
    phoneEn,
    finalScore,
  );
  const scoreBandTextEn = getEnglishScoreBandText(scoreBand);
  const detailedSectionsEn = getEnglishDetailedSections(
    birthEn,
    nameEn,
    phoneEn,
    combinedEn,
  );

  return {
    mn: {
      resultTitle: scoreBandTextMn.title,
      resultSubtitle: `${birth.number} үндсэн энерги, ${name.number} нэрний илэрхийлэл, ${phone.number} утасны энерги дээр суурилсан уншлага.`,
      scoreLabel: `${finalScore}% зохицол`,
      scoreMeaning: scoreBandTextMn.summary,
      categoryTitle: "Гол үзүүлэлтүүд",
      detailedTitle: "Дэлгэрэнгүй тайлбар",
      birthTitle: "Төрсөн огнооны энерги",
      nameTitle: "Нэрний энерги",
      phoneTitle: "Утасны дугаарын энерги",
      combinedTitle: combined.title,
      finalAdvice: combined.advice,

      scoreBandText: scoreBandTextMn,
      birth,
      name,
      phone,
      combined,
      detailedSections: detailedSectionsMn,
    },

    en: {
      resultTitle: scoreBandTextEn.title,
      resultSubtitle: `A reading based on your ${birthEn.number} birth energy, ${nameEn.number} name expression, and ${phoneEn.number} phone vibration.`,
      scoreLabel: `${finalScore}% alignment`,
      scoreMeaning: scoreBandTextEn.summary,
      categoryTitle: "Key indicators",
      detailedTitle: "Detailed reading",
      birthTitle: "Birth date energy",
      nameTitle: "Name energy",
      phoneTitle: "Phone number energy",
      combinedTitle: combinedEn.title,
      finalAdvice: combinedEn.advice,

      scoreBandText: scoreBandTextEn,
      birth: birthEn,
      name: nameEn,
      phone: phoneEn,
      combined: combinedEn,
      detailedSections: detailedSectionsEn,
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
