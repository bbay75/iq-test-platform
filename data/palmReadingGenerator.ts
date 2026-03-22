export type PalmReadingResult = {
  title: string;
  overall: string;
  heartLine: string;
  headLine: string;
  lifeLine: string;
  personality: string;
  love: string;
  career: string;
  future: string;
  strengths: string[];
  challenges: string[];
  advice: string;
  energy: string;
};

const overallOptions = [
  "Таны алган дээрх ерөнхий дүр зураг нь тайван боловч дотроо хүчтэй, тогтвортой зан чанарыг илтгэж байна.",
  "Таны гарын ерөнхий бүтэц нь мэдрэмж ба логикийг тэнцвэртэй ашигладаг хүнийг илэрхийлж байна.",
  "Таны алган дээрх хэлбэр, шугамын хослол нь бие даасан, өөрийн гэсэн үзэл бодолтой хүнийг харуулж байна.",
  "Таны гарын ерөнхий төрх нь аажим боловч баттай өсөлттэй, тогтвортой хүнийг илтгэж байна.",
];

const heartLineOptions = [
  "Heart line-ийн energy нь сэтгэл хөдлөлөө дотроо хадгалдаг ч үнэнч, гүн холбоо хүсдэг хүний шинжтэй байна.",
  "Таны heart line романтик мэдрэмжтэй, халуун дулаан холбоог үнэ цэнтэй гэж үздэг хэв маягийг илтгэж байна.",
  "Таны heart line нь харилцаанд ойлголцол, аюулгүй мэдрэмж, тогтвортой байдлыг эрхэмлэдгийг харуулж байна.",
  "Сэтгэлийн шугамын ерөнхий утга нь хайр дурлалд чин сэтгэлтэй ч итгэлцэлд өндөр шаардлага тавьдаг хүнийг илтгэж байна.",
];

const headLineOptions = [
  "Head line-ийн хандлагаас харахад та асуудлыг бодитоор задлан шинжилж шийдэх дуртай хүн байна.",
  "Таны head line бүтээлч, төсөөлөл сайтай, гэхдээ логик холбоосыг бас сайн хардаг хэв маягийг илтгэж байна.",
  "Оюуны шугамын energy нь шийдвэр гаргахдаа дотроо сайн тунгааж байж алхам хийдэг хүнийг харуулж байна.",
  "Таны head line нь хурдан ойлгоцтой ч заримдаа хэт их бодох хандлагатай байж болохыг илтгэж байна.",
];

const lifeLineOptions = [
  "Life line-ийн ерөнхий утга нь тогтвортой, аажим өсөлттэй, тэсвэр хатуужилтай хүнийг илтгэж байна.",
  "Таны life line амьдралын сорилтыг давж, өөрийн хүчээр урагшилдаг зан чанарыг харуулж байна.",
  "Амьдралын шугамын energy нь ачаалалтай үед ч дасан зохицох чадвартайг илэрхийлж байна.",
  "Таны life line нь эрч хүчээ зөв хуваарилбал илүү амжилттай хөгжих боломжтой хүнийг илтгэж байна.",
];

const personalityOptions = [
  "Та гаднаа тайван боловч дотроо маш хүчтэй, ажигч, мэдрэмжтэй хүний шинжтэй байна.",
  "Та хүмүүсийг ойлгох чадвартай, гэхдээ өөрийн дотоод ертөнцийг хүн бүрт бүрэн нээдэггүй хүн байна.",
  "Та бие даасан сэтгэлгээтэй, шийдвэр гаргахдаа өөрийн дотоод мэдрэмж ба логикт тулгуурладаг.",
  "Та тогтвортой, гүн холбоо, ойлгомжтой харилцаа, аажим боловч найдвартай өсөлтийг илүүд үздэг.",
];

const loveOptions = [
  "Та харилцаанд гүн холбоо, итгэлцлийг хамгийн их эрхэмлэдэг.",
  "Та хайр сэтгэлд халуун дулаан боловч болгоомжтой ханддаг.",
  "Та харилцаанд эрх чөлөө ба ойлголцлыг зэрэг хүсдэг.",
  "Та хайр дээр маш үнэнч, гэхдээ хэт мэдрэмтгий байж магадгүй.",
];

const careerOptions = [
  "Та бие даан шийдвэр гаргах, өөрийн замаар явах ажилд илүү амжилт гаргана.",
  "Та систем, зохион байгуулалттай орчинд хүчтэй байдаг.",
  "Та бүтээлч, санаачлагатай салбарт илүү тохирно.",
  "Та хүмүүстэй харилцах, удирдах чиглэлд илүү амжилттай.",
];

const futureOptions = [
  "Таны амьдрал аажим боловч баттай өсөх хандлагатай.",
  "Ойрын хугацаанд шинэ боломж гарч ирэх магадлалтай.",
  "Таны шийдвэрүүд ирээдүйд том өөрчлөлт авчирна.",
  "Тогтвортой байдал хадгалбал амжилт баталгаатай.",
];

const energyTypes = [
  "Stable Energy (Тогтвортой энерги)",
  "Emotional Energy (Мэдрэмж давамгай)",
  "Logical Energy (Логик давамгай)",
  "Dynamic Energy (Эрч хүчтэй хөдөлгөөнт)",
];

const strengthsPool = [
  "Ажигч чанар",
  "Тэсвэртэй байдал",
  "Дотоод хүч",
  "Логик сэтгэлгээ",
  "Мэдрэмж ба ухаалаг байдал",
  "Тогтвортой сэтгэлгээ",
  "Хүмүүсийг ойлгох чадвар",
  "Бие даасан байдал",
];

const challengesPool = [
  "Хэт их бодох хандлага",
  "Сэтгэлээ дотроо хадгалах",
  "Итгэлцэлд удаан нээгдэх",
  "Өөртөө өндөр шаардлага тавих",
  "Ядарснаа оройтож анзаарах",
  "Мэдрэмжээ шууд илэрхийлэхэд төвөгтэй байх",
];

const advicePool = [
  "Мэдрэмжээ дотроо удаан хадгалахгүйгээр зөв хүнтэйгээ илэн далангүй ярилцахыг хичээгээрэй.",
  "Эрч хүчээ зөв хуваарилж, амралт ба ачааллаа тэнцвэржүүлэх нь танд чухал.",
  "Шийдвэр гаргахдаа дотоод мэдрэмжээ үл тоохгүй байх нь илүү зөв сонголтод хүргэнэ.",
  "Харилцаанд хүлээлтээ тодорхой илэрхийлж байвал ойлголцол илүү амар болно.",
];

function hashString(input: string) {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) % 1000000;
  }

  return Math.abs(hash);
}

function pickOne<T>(arr: T[], seed: number, offset: number): T {
  return arr[(seed + offset) % arr.length];
}

function pickMany(arr: string[], seed: number, count: number, offset: number) {
  const result: string[] = [];
  const used = new Set<number>();

  let i = 0;
  while (result.length < count && i < 50) {
    const idx = (seed + offset + i * 3) % arr.length;
    if (!used.has(idx)) {
      used.add(idx);
      result.push(arr[idx]);
    }
    i++;
  }

  return result;
}

export function generatePalmReading(seedSource: string): PalmReadingResult {
  const seed = hashString(seedSource || "default-palm");

  return {
    title: "AI Palm Reading Result",
    overall: pickOne(overallOptions, seed, 1),
    heartLine: pickOne(heartLineOptions, seed, 2),
    headLine: pickOne(headLineOptions, seed, 3),
    lifeLine: pickOne(lifeLineOptions, seed, 4),
    personality: pickOne(personalityOptions, seed, 5),
    love: pickOne(loveOptions, seed, 6),
    career: pickOne(careerOptions, seed, 7),
    future: pickOne(futureOptions, seed, 8),
    strengths: pickMany(strengthsPool, seed, 3, 9),
    challenges: pickMany(challengesPool, seed, 3, 12),
    advice: pickOne(advicePool, seed, 15),
    energy: pickOne(energyTypes, seed, 20),
  };
}
