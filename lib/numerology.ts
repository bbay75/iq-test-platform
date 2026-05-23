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

export type NumerologyResult = {
  birth: NumerologySection;
  name: NumerologySection;
  phone: PhoneReading;
  combined: CombinedReading;
};

const LETTER_MAP: Record<string, number> = {
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

function reduceNumber(num: number): number {
  while (num > 9) {
    num = String(num)
      .split("")
      .reduce((sum, d) => sum + Number(d), 0);
  }
  return num;
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
  switch (num) {
    case 1:
      return {
        number: 1,
        title: "Independent Leader",
        summary: "Та бие даасан, шийдэмгий, манлайлах чиг хандлагатай хүн.",
        strengths: ["Манлайлал", "Шийдэмгий байдал", "Өөртөө итгэх итгэл"],
        weaknesses: ["Зөрүүдлэх", "Хэт ганцаардах", "Бусдыг үл тоомсорлох"],
      };
    case 2:
      return {
        number: 2,
        title: "Peaceful Supporter",
        summary:
          "Та эв зохицол, хамтын ажиллагаа, зөөлөн харилцааг эрхэмлэдэг хүн.",
        strengths: ["Эв зүй", "Тэвчээр", "Мэдрэмжтэй байдал"],
        weaknesses: ["Хэт эмзэг", "Шийдвэргүйдэх", "Бусдаас хэт хамаарах"],
      };
    case 3:
      return {
        number: 3,
        title: "Creative Communicator",
        summary: "Та бүтээлч, хөгжилтэй, өөрийгөө илэрхийлэх чадвартай хүн.",
        strengths: ["Бүтээлч байдал", "Харилцаа", "Эерэг энерги"],
        weaknesses: ["Анхаарал сарних", "Дутуу орхих", "Хөнгөн хандах"],
      };
    case 4:
      return {
        number: 4,
        title: "Stable Builder",
        summary: "Та сахилга баттай, тогтвортой, бодит үр дүнд төвлөрдөг хүн.",
        strengths: ["Хариуцлага", "Тогтвортой байдал", "Шаргуу хөдөлмөр"],
        weaknesses: ["Хэт хатуу байх", "Уян хатан бус", "Өөрчлөлтөд дургүй"],
      };
    case 5:
      return {
        number: 5,
        title: "Free Spirit",
        summary: "Та эрх чөлөө, өөрчлөлт, шинэ туршлагыг эрэлхийлдэг хүн.",
        strengths: ["Уян хатан байдал", "Эрч хүч", "Адал явдалд дуртай"],
        weaknesses: ["Тогтворгүй байдал", "Яаруу шийдвэр", "Анхаарал сарних"],
      };
    case 6:
      return {
        number: 6,
        title: "Responsible Nurturer",
        summary: "Та халамжтай, гэр бүлсэг, хариуцлагатай энерги ихтэй хүн.",
        strengths: ["Халамж", "Хариуцлага", "Гэр бүлийн үнэ цэнэ"],
        weaknesses: [
          "Хэт санаа зовох",
          "Өөрийгөө мартах",
          "Бусдад хэт ачаалал үүрэх",
        ],
      };
    case 7:
      return {
        number: 7,
        title: "Deep Thinker",
        summary:
          "Та дотоод гүн бодолтой, анализ хийх, үнэнийг хайх хандлагатай хүн.",
        strengths: ["Анализ", "Гүн ухаан", "Дотоод төвлөрөл"],
        weaknesses: ["Хэт бодох", "Хаалттай байх", "Ганцаардах"],
      };
    case 8:
      return {
        number: 8,
        title: "Power & Success Energy",
        summary: "Та амжилт, нөлөө, санхүүгийн үр дүнд төвлөрөх хүчтэй хүн.",
        strengths: ["Манлайлал", "Бизнес мэдрэмж", "Санхүүгийн эрмэлзэл"],
        weaknesses: ["Хэт хатуу", "Материаллаг хэт төвлөрөл", "Стресс"],
      };
    case 9:
    default:
      return {
        number: 9,
        title: "Compassionate Humanitarian",
        summary: "Та өрөвч, өргөн сэтгэлгээтэй, бусдад нөлөөлөх хүсэлтэй хүн.",
        strengths: [
          "Өгөөмөр зан",
          "Өрөвдөх сэтгэл",
          "Том зургаар харах чадвар",
        ],
        weaknesses: [
          "Хэт мэдрэмтгий",
          "Сэтгэл хөдлөл их",
          "Алдагдалд амархан өртөх",
        ],
      };
  }
}

function getPhoneReading(phone: string, birthNumber: number): PhoneReading {
  const phoneNum = getPhoneNumberValue(phone);
  const base = getNumberProfile(phoneNum);

  let moneyEnergy = "Medium";
  let suitability = "Normal";
  let bonus = 0;

  if (phoneNum === 8) {
    moneyEnergy = "Strong";
    suitability = "Business and finance focused";
    bonus = 15;
  } else if (phoneNum === 6) {
    moneyEnergy = "Stable";
    suitability = "Family, relationships, trust";
    bonus = 10;
  } else if (phoneNum === 5) {
    moneyEnergy = "Active but unstable";
    suitability = "Sales, communication, movement";
    bonus = 8;
  } else if (phoneNum === 4) {
    moneyEnergy = "Steady";
    suitability = "Long-term stability and discipline";
    bonus = 9;
  } else if (phoneNum === 7) {
    moneyEnergy = "Slow but thoughtful";
    suitability = "Research, analysis, inner focus";
    bonus = 5;
  }

  const distance = Math.abs(phoneNum - birthNumber);
  const matchScore = Math.max(55, 95 - distance * 7 + bonus);

  return {
    number: phoneNum,
    title: base.title,
    summary: `Таны утасны дугаар ${phoneNum} энергитэй байна. Энэ нь ${suitability.toLowerCase()} чиглэлд илүү хүчтэй нөлөөлж болзошгүй.`,
    matchScore,
    moneyEnergy,
    suitability,
    strengths: [...base.strengths.slice(0, 2), `Money energy: ${moneyEnergy}`],
    weaknesses: base.weaknesses.slice(0, 3),
  };
}

function getCombinedReading(
  birth: NumerologySection,
  name: NumerologySection,
  phone: PhoneReading,
): CombinedReading {
  const strongMoney =
    phone.moneyEnergy === "Strong" || phone.moneyEnergy === "Stable";

  const title =
    phone.matchScore >= 80
      ? "Well-Matched Energy Profile"
      : "Mixed Energy Profile";

  const summary =
    phone.matchScore >= 80
      ? `Төрсөн огноо, нэр, утасны дугаарын энерги хоорондоо харьцангуй сайн нийцэж байна. Таны үндсэн зан төлөв болон гадаад энерги нэг чиглэлд ажиллах хандлагатай.`
      : `Төрсөн огноо, нэр, утасны дугаарын энерги хоорондоо бүрэн нийцэхгүй тал байна. Энэ нь зарим үед дотоод хүсэл ба гаднах орчны энерги зөрөх мэдрэмж төрүүлж болно.`;

  const strengths = [
    `Core energy: ${birth.title}`,
    `Outer expression: ${name.title}`,
    `Phone vibration: ${phone.title}`,
    strongMoney
      ? "Санхүүгийн урсгалд эерэг тал ажиглагдаж байна"
      : "Санхүүгийн тал дээр илүү сонголт, анхаарал хэрэгтэй",
  ];

  const weaknesses = [
    phone.matchScore < 75
      ? "Утасны дугаарын энерги таны үндсэн төрөлх энергиэс бага зэрэг зөрж байна"
      : "Энергийн зөрчил харьцангуй бага",
    birth.number !== name.number
      ? "Дотоод мөн чанар ба бусдад харагдах дүр төрх ялгаатай байж болно"
      : "Дотоод ба гадаад энерги ойролцоо байна",
  ];

  const advice =
    phone.matchScore >= 80
      ? "Одоогийн дугаар танд боломжийн сайн тохирч байна. Санхүү, харилцаа, өдөр тутмын хэрэглээнд тогтвортой ашиглаж болно."
      : "Хэрэв та санхүү, тогтвортой байдал, өөрт нийцэх байдлыг чухалчилж байвал илүү зохимжтой дугаар сонгох талаар бодож болно.";

  return {
    title,
    summary,
    strengths,
    weaknesses,
    advice,
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
  const combined = getCombinedReading(birth, name, phone);

  return {
    birth,
    name,
    phone,
    combined,
  };
}
