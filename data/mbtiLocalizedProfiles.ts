import { mbtiProfiles, type MbtiProfile } from "@/data/mbtiProfiles";
export type MbtiPremiumProfile = {
  type: string;
  name: string;
  summary: string;
  personality: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
  careerAdvice: string;
  relationships: string;
  relationshipAdvice: string;
  growthAdvice: string;
  finalAdvice: string;
};
const mbtiMnPremiumOverrides: Partial<
  Record<string, Partial<MbtiPremiumProfile>>
> = {
  ESTJ: {
    name: "Зохион байгуулагч",
    summary:
      "Та бол эмх цэгц, тодорхой дүрэм, бодит үр дүнг эрхэмлэдэг зохион байгуулагч төрлийн хүн. Хариуцсан зүйлээ дуусгах, хүмүүсийг нэг чиглэлд оруулах, ажил үүргийг тодорхой болгох тал дээр таны давуу тал хүчтэй илэрдэг.",
    personality:
      "ESTJ төрлийн хүн асуудлыг хийсвэрээр биш, бодит амьдрал дээр хэрэгжих талаас нь хардаг. “Яаж ажиллуулах вэ?”, “Хэн юу хийх вэ?”, “Үр дүн нь юу вэ?” гэдэг асуулт танд ойр. Эмх замбараагүй нөхцөлд та хурдан цэгц оруулж, ажлыг урагшлуулах чадвартай. Гэхдээ бүх зүйл үр ашигтай байх ёстой гэсэн хандлагаас болж бусдын удаан, зөөлөн, мэдрэмжтэй талыг ойлгоход заримдаа төвөгтэй санагдаж болно.",
    strengths: [
      "Зохион байгуулах чадвар өндөр",
      "Хариуцлагатай, хэлсэндээ хүрдэг",
      "Шууд, шударга харилцдаг",
      "Үр дүнд төвлөрч, ажлыг дуусгаж чаддаг",
    ],
    weaknesses: [
      "Заримдаа хэт хатуу харагдаж болно",
      "Бусдын мэдрэмжийг анзааралгүй өнгөрөх магадлалтай",
      "Уян хатан бус шийдвэр гаргах үе бий",
      "Бүхнийг хянах гэж яваад өөрийгөө ядраах эрсдэлтэй",
    ],
    careerAdvice:
      "Та бүтэцтэй, зорилго нь тодорхой, үр дүн нь хэмжигдэх орчинд илүү сайн ажилладаг. Удирдлага, төслийн менежмент, санхүү, хууль, логистик, үйл ажиллагааны удирдлага зэрэг чиглэл танд илүү тохиромжтой. Хийсвэр санаа гаргахаас илүү систем ажиллуулах, сайжруулах, үр дүнд хүргэх тал дээр таны хүч илүү тод харагдана.",
    relationshipAdvice:
      "Харилцаанд та тодорхой, шулуун, найдвартай байдлыг эрхэмлэдэг. Та хайр халамжаа ихэвчлэн үгээр биш, хариуцлага үүрэх, хамгаалах, туслах, асуудлыг шийдэх байдлаар илэрхийлдэг. Гэхдээ ойр дотнын хүмүүс тань заримдаа шийдэл биш, зүгээр л сонсох дулаан хандлага хүсдэг гэдгийг санахад илүүдэхгүй.",
    growthAdvice:
      "Бүх зүйл таны төлөвлөснөөр явах албагүй. Зарим хүн таны бодож байгаа шиг хурдан, цэгцтэй, шууд ажиллахгүй байж болно. Энэ нь заавал буруу гэсэн үг биш. Бусдын өөр хэмнэлийг хүлээн зөвшөөрч, логиктой зэрэгцүүлэн мэдрэмжийг ч бас тооцож сурвал таны манлайлал илүү хүчтэй болно.",
    finalAdvice:
      "Та бол аливаа зүйлийг бодит үр дүнд хүргэх чадвартай хүн. Гэхдээ хүчтэй хүн байна гэдэг бүхнийг ганцаараа үүрнэ гэсэн үг биш. Хааяа хяналтаа суллаж, бусдад итгэж, өөртөө амрах зай өгч чадвал таны хүч илүү тогтвортой, илүү ухаалаг хэлбэрээр илэрнэ.",
  },

  INFP: {
    name: "Дотоод ертөнцтэй мөрөөдөгч",
    summary:
      "Та бол мэдрэмж, үнэт зүйл, дотоод утга учрыг гүнзгий мэдэрдэг хүн. Гаднаа тайван, даруухан харагдаж болох ч дотроо маш баялаг төсөөлөл, зөөлөн сэтгэл, өөрийн гэсэн хүчтэй итгэл үнэмшилтэй.",
    personality:
      "INFP төрлийн хүн амьдралыг зөвхөн бодит зүйлээр хэмждэггүй. Танд аливаа хүний цаад мэдрэмж, хэлээгүй үг, нуугдсан шалтгаан илүү мэдрэгддэг. Та өнгөц харилцаанаас илүү чин сэтгэлийн, гүн холбоог хүсдэг. Гэхдээ амьдралын хатуу бодит байдал, шүүмжлэл, шударга бус хандлага таныг амархан шархлуулж, өөрийн дотоод ертөнц рүү retreat хийхэд хүргэж болно.",
    strengths: [
      "Бусдын мэдрэмжийг гүн ойлгодог",
      "Бүтээлч, уран төсөөлөлтэй",
      "Өөрийн үнэт зүйлдээ үнэнч",
      "Зөөлөн, хүн бүрийн орон зайг хүндэтгэдэг",
    ],
    weaknesses: [
      "Шүүмжлэлийг хэт хүндээр тусгаж авах үе бий",
      "Мөрөөдөлдөө автаад бодит алхмаа хойшлуулах магадлалтай",
      "Бусдыг гомдоохгүй гэж өөрийгөө орхигдуулах үе байдаг",
      "Олон сонголтын дунд шийдвэрээ удаан гаргадаг",
    ],
    careerAdvice:
      "Та утга учиртай, хүний сэтгэлд хүрдэг, өөрийн бүтээлч чанараа илэрхийлэх боломжтой ажилд илүү сайн гэрэлтэнэ. Бичих, дизайн, урлаг, сэтгэлзүй, боловсрол, зөвлөгөө, хүмүүнлэгийн чиглэл танд тохиромжтой. Хэт хатуу дүрэмтэй, зөвхөн ашиг үр дүнгээр хэмждэг орчин таны эрч хүчийг хурдан сулруулж мэднэ.",
    relationshipAdvice:
      "Харилцаанд та зөөлөн, үнэнч, гүн мэдрэмжтэй ханддаг. Итгэсэн хүндээ сэтгэлийнхээ хамгийн нандин хэсгийг нээж чаддаг ч эхэндээ өөрийгөө хамгаалах хандлагатай. Танд тохирох харилцаа бол таны мэдрэмжийг шоолохгүй, яарахгүй, тайван ойлгодог харилцаа.",
    growthAdvice:
      "Мөрөөдөл бол таны хүч. Гэхдээ тэр мөрөөдлөө бодит амьдрал дээр жижиг алхмаар хэрэгжүүлж сурах нь таны өсөлтийн гол түлхүүр. Мөн “үгүй” гэж хэлэх нь муу хүн болж байгаа хэрэг биш. Энэ нь өөрийн зөөлөн сэтгэл, энергиэ хамгаалж байгаа хэрэг.",
    finalAdvice:
      "Таны эмзэг мэдрэмж сул тал биш. Харин зөв хамгаалж, зөв илэрхийлж чадвал бусдыг ойлгох, бүтээх, эдгээх хүч болно. Өөрийгөө хэт шүүмжлэхээ багасгаж, дотор байгаа санаагаа бодит амьдралд бага багаар гаргаж эхлээрэй.",
  },

  ENFP: {
    name: "Урам зориг түгээгч",
    summary:
      "Та бол амьдралыг олон боломж, шинэ санаа, сонирхолтой уулзалтаар дүүрэн гэж хардаг эрч хүчтэй хүн. Хүмүүстэй амархан холбогдож, орчиндоо дулаан уур амьсгал, хөдөлгөөн, урам зориг авчирдаг.",
    personality:
      "ENFP төрлийн хүн нэг хэвийн байдлаас хурдан уйддаг. Таны дотор шинэ санаа, төлөвлөгөө, боломжууд байнга хөдөлж байдаг. Та хүмүүсийн сайн талыг олж харахдаа гарамгай бөгөөд тэднийг өөртөө итгэхэд нь түлхэц өгч чаддаг. Гэхдээ сонирхол хурдан асдаг шигээ заримдаа хурдан унтарч, эхлүүлсэн зүйлээ дуусгах тал дээр асуудал үүсч болно.",
    strengths: [
      "Хүмүүстэй хурдан холбогддог",
      "Шинэ санаа, боломжийг амархан олж хардаг",
      "Орчиндоо эерэг уур амьсгал авчирдаг",
      "Нээлттэй, уян хатан, сониуч",
    ],
    weaknesses: [
      "Эхлүүлсэн зүйлээ дуусгахдаа сулрах магадлалтай",
      "Анхаарал амархан сарнидаг",
      "Бусдын үг, хандлагыг хэт их бодох үе бий",
      "Бусдад таалагдах гэж өөрийн жинхэнэ хүслээ дарах эрсдэлтэй",
    ],
    careerAdvice:
      "Та чөлөөтэй сэтгэх, хүмүүстэй харилцах, шинэ санаа гаргах боломжтой орчинд илүү хүчтэй ажилладаг. Маркетинг, контент, PR, сургалт, эвент, зөвлөгөө, хувийн бизнес зэрэг чиглэл танд тохиромжтой. Харин өдөр бүр яг ижил давтамжтай, хатуу хяналттай, бүтээлч эрх чөлөө багатай орчин таныг хурдан ядрааж мэднэ.",
    relationshipAdvice:
      "Харилцаанд та дулаан, амьд, урамтай байдлыг авчирдаг. Та хүнийг сонсож, сайн талыг нь харж, сэтгэлийг нь сэргээж чаддаг. Гэхдээ өөрөө үргэлж хөгжилтэй байх ёстой мэт дүрд орох хэрэггүй. Танд ч бас тайван сонсогдох, ойлгогдох, дэмжүүлэх хэрэгцээ бий.",
    growthAdvice:
      "Таны амжилтын гол түлхүүр бол олон санаанаас хамгийн чухлыг нь сонгоод эцсийг нь үзэх. Эмх цэгц, төлөвлөгөө хоёр таны эрх чөлөөг хорьдог зүйл биш. Харин том мөрөөдлөө бодит болгох суурь болж өгдөг.",
    finalAdvice:
      "Таны эрч хүч хүмүүсийг хөдөлгөж, урамшуулж чаддаг. Гэхдээ тэр хүчээ хадгалахын тулд бүх зүйл рүү зэрэг гүйхээ багасгаж, өөрийн дотоод тэнцвэрийг хамгаалаарай. Нэг санаагаа дуусгаж чадвал таны нөлөө илүү хүчтэй болно.",
  },

  INTJ: {
    name: "Алсын хараатай стратегич",
    summary:
      "Та бол аливаа зүйлийн цаад бүтэц, зүй тогтол, ирээдүйн боломжийг олж харахдаа сайн стратегич төрлийн хүн. Бие даасан, логиктой, чанартай үр дүнд төвлөрдөг зан тань таны гол хүч.",
    personality:
      "INTJ төрлийн хүн аливааг зүгээр байгаагаар нь хүлээж авахаас илүү “Үүнийг яаж илүү үр ашигтай болгох вэ?” гэж хардаг. Та систем, төлөвлөгөө, урт хугацааны үр дүнг бодож шийдвэр гаргах хандлагатай. Гаднаасаа хүйтэн эсвэл дуу цөөтэй мэт харагдаж болох ч үнэндээ та ойр дотнын цөөн хүндээ маш хариуцлагатай, үнэнч ханддаг.",
    strengths: [
      "Алсын хараатай, стратеги боловсруулж чаддаг",
      "Бие даан сурах, ажиллах чадвар өндөр",
      "Логиктой, тайван шийдвэр гаргадаг",
      "Өндөр стандарттай, чанарт төвлөрдөг",
    ],
    weaknesses: [
      "Хэт шүүмжлэлт хандах үе бий",
      "Бусдын мэдрэмжийг логикгүй гэж үзэх магадлалтай",
      "Өөрийн бодлын ертөнцөд хэт хаагдах эрсдэлтэй",
      "Төгс болгох гэж өөрийгөө дарамтлах хандлагатай",
    ],
    careerAdvice:
      "Та нарийн төвлөрөл, стратеги, анализ, бие даасан шийдвэр шаардсан орчинд илүү сайн ажилладаг. IT, инженерчлэл, судалгаа, санхүүгийн анализ, стратеги төлөвлөлт, хууль эрх зүй зэрэг чиглэл танд тохиромжтой. Харин байнгын жижиг яриа, тодорхой бус бүтэц, замбараагүй орчин таны бүтээмжийг бууруулж мэднэ.",
    relationshipAdvice:
      "Харилцаанд та шулуун, логиктой, утгатай яриаг илүүд үздэг. Олон сул яриа, тойруу хандлага танд амаргүй санагдаж болно. Гэхдээ ойр дотнын хүмүүс тань үргэлж зөв шийдэл биш, заримдаа зүгээр л ойлголцол, дулаан хандлага хүсдэг гэдгийг санах хэрэгтэй.",
    growthAdvice:
      "Амьдралын бүх зүйл логикоор бүрэн тайлбарлагдахгүй. Хүний мэдрэмж ч өөрийн гэсэн шалтгаан, утгатай байдаг. Бусдын сэтгэл хөдлөлийг сул тал гэж харахын оронд мэдээлэл гэж хүлээж авч сурвал таны харилцаа илүү гүн болно.",
    finalAdvice:
      "Таны алсын хараа, дүн шинжилгээ хийх чадвар том давуу тал. Харин түүнийгээ зөөлөн харилцаа, уян хатан хандлагатай хослуулж чадвал та зөвхөн ухаалаг шийдвэр гаргагч биш, бусдад нөлөөлж чаддаг хүчтэй хүн болно.",
  },
};
export const mbtiEnglishProfiles: Record<string, MbtiProfile> = {
  INTJ: {
    name: "Architect",
    summary:
      "A strategic and independent thinker who likes long-term planning, systems, and clear goals.",
    strengths: ["Strategic thinking", "Independence", "Deep analysis"],
    weaknesses: ["Can appear too strict", "May hide emotions", "Perfectionism"],
    careers: ["Engineer", "Strategist", "Scientist"],
    relationships:
      "They value deep understanding, loyalty, honesty, and intellectual connection.",
  },
  INTP: {
    name: "Thinker",
    summary:
      "A curious and logical person who enjoys ideas, theories, and understanding how things work.",
    strengths: ["Creative thinking", "Logical analysis", "Original ideas"],
    weaknesses: [
      "Weak follow-through",
      "Can be too theoretical",
      "May hide feelings",
    ],
    careers: ["Programmer", "Researcher", "Analyst"],
    relationships:
      "They prefer relationships with intellectual connection, freedom, and low pressure.",
  },
  ENTJ: {
    name: "Commander",
    summary:
      "A decisive and goal-oriented leader who likes building systems and moving forward with purpose.",
    strengths: ["Leadership", "Decision-making", "Result focus"],
    weaknesses: ["Can seem too direct", "Impatient", "High expectations"],
    careers: ["Manager", "CEO", "Business Leader"],
    relationships:
      "They value direct communication, ambition, and a strong partner with clear goals.",
  },
  ENTP: {
    name: "Debater",
    summary:
      "An energetic idea-generator who enjoys possibilities, debate, and creative challenges.",
    strengths: ["Quick thinking", "Flexibility", "New ideas"],
    weaknesses: [
      "Weak finishing",
      "Inconsistency",
      "Can enjoy arguing too much",
    ],
    careers: ["Entrepreneur", "Marketing", "Creative Strategist"],
    relationships:
      "They enjoy lively, interesting, and mentally stimulating relationships.",
  },
  INFJ: {
    name: "Advocate",
    summary:
      "A thoughtful and empathetic person who seeks meaning, depth, and emotional understanding.",
    strengths: ["Empathy", "Vision", "Loyalty to values"],
    weaknesses: [
      "Overthinking",
      "Emotional exhaustion",
      "Keeping things inside",
    ],
    careers: ["Counselor", "Teacher", "Psychologist"],
    relationships:
      "They want deep, sincere, loyal, and emotionally meaningful relationships.",
  },
  INFP: {
    name: "Mediator",
    summary:
      "A sensitive and imaginative person who values inner meaning, ideals, and authenticity.",
    strengths: ["Idealism", "Creativity", "Empathy"],
    weaknesses: [
      "Over-sensitivity",
      "Slow decisions",
      "Struggle with harsh reality",
    ],
    careers: ["Writer", "Designer", "Humanitarian Work"],
    relationships:
      "They want warm, sincere, emotionally safe, and meaningful connection.",
  },
  ENFJ: {
    name: "Protagonist",
    summary:
      "A warm and inspiring person who naturally encourages, guides, and connects people.",
    strengths: ["Encouragement", "Communication", "Leadership"],
    weaknesses: [
      "Self-sacrifice",
      "Worrying too much",
      "Sensitive to approval",
    ],
    careers: ["Coach", "Teacher", "HR"],
    relationships:
      "They invest deeply in relationships and value care, growth, and emotional closeness.",
  },
  ENFP: {
    name: "Campaigner",
    summary:
      "An energetic, optimistic, and creative person who enjoys people, possibilities, and new experiences.",
    strengths: ["Positive energy", "Creativity", "Connection with people"],
    weaknesses: ["Scattered attention", "Weak planning", "Emotional intensity"],
    careers: ["Content Creator", "Marketing", "Public Relations"],
    relationships:
      "They feel happiest in warm, exciting, expressive, and emotionally alive relationships.",
  },
  ISTJ: {
    name: "Logistician",
    summary:
      "A responsible, organized, and reliable person who values duty, structure, and stability.",
    strengths: ["Reliability", "Discipline", "Responsibility"],
    weaknesses: [
      "Resists change",
      "Shows emotions less",
      "Can become too rigid",
    ],
    careers: ["Accountant", "Administrator", "Law"],
    relationships:
      "They value loyalty, trust, stability, and long-term commitment.",
  },
  ISFJ: {
    name: "Defender",
    summary:
      "A caring, quiet, and dependable person who notices the needs of others and supports them.",
    strengths: ["Care", "Patience", "Reliability"],
    weaknesses: [
      "Difficulty saying no",
      "Sensitive to criticism",
      "Forgetting themselves",
    ],
    careers: ["Nurse", "Support Specialist", "Teacher"],
    relationships: "They want safe, warm, stable, and caring relationships.",
  },
  ESTJ: {
    name: "Executive",
    summary:
      "A practical and organized person who values structure, responsibility, and clear results.",
    strengths: ["Organization", "Leadership", "Responsibility"],
    weaknesses: ["Can be too direct", "Less flexible", "May ignore emotions"],
    careers: ["Operations", "Management", "Project Leadership"],
    relationships:
      "They fit best with honest, reliable, and responsible relationship dynamics.",
  },
  ESFJ: {
    name: "Consul",
    summary:
      "A social and caring person who values harmony, belonging, and strong human connection.",
    strengths: ["Sociability", "Care", "Teamwork"],
    weaknesses: [
      "Trying too hard to please",
      "Sensitive to criticism",
      "Over-focus on approval",
    ],
    careers: ["Customer Service", "Teaching", "HR"],
    relationships:
      "They want closeness, care, stability, and emotional attention.",
  },
  ISTP: {
    name: "Virtuoso",
    summary:
      "A practical and calm problem-solver who likes hands-on solutions and independence.",
    strengths: ["Practical thinking", "Problem solving", "Adaptability"],
    weaknesses: [
      "Shows feelings less",
      "Dislikes long planning",
      "Can seem inconsistent",
    ],
    careers: ["Technician", "Engineer", "Mechanic"],
    relationships:
      "They prefer calm, honest relationships that respect freedom and personal space.",
  },
  ISFP: {
    name: "Adventurer",
    summary:
      "A gentle and creative person who values beauty, freedom, and being true to themselves.",
    strengths: ["Aesthetic sense", "Creativity", "Gentle attitude"],
    weaknesses: ["Weak planning", "Avoids conflict", "May hide themselves"],
    careers: ["Designer", "Artist", "Lifestyle Creator"],
    relationships:
      "They prefer warm, sincere, low-pressure, and emotionally gentle relationships.",
  },
  ESTP: {
    name: "Entrepreneur",
    summary:
      "An active and bold person who makes quick decisions and enjoys direct experience.",
    strengths: ["Fast action", "Adaptability", "Energy"],
    weaknesses: ["Impulsiveness", "Weak long-term planning", "Impatience"],
    careers: ["Sales", "Business", "Event Management"],
    relationships:
      "They enjoy energetic, interesting, spontaneous, and lively relationships.",
  },
  ESFP: {
    name: "Entertainer",
    summary:
      "A fun, open, and expressive person who enjoys people, energy, and living in the moment.",
    strengths: ["Warmth", "Social energy", "Joyfulness"],
    weaknesses: [
      "Avoiding serious planning",
      "Easily distracted",
      "Sensitive to mood",
    ],
    careers: ["Entertainment", "Sales", "Hospitality"],
    relationships:
      "They enjoy warm, fun, active, and emotionally expressive relationships.",
  },
};

function buildMnPremiumProfile(
  type: string,
  base: (typeof mbtiProfiles)[string],
): MbtiPremiumProfile {
  const fallback: MbtiPremiumProfile = {
    type,
    name: base.name,
    summary: base.summary,

    personality:
      `${type} төрлийн хүн нь өдөр тутмын шийдвэр, харилцаа, ажиллах арга барилдаа тодорхой хэв маягтай байдаг. ` +
      `Таны хувьд гол онцлог нь ${base.summary} Энэ нь таныг бусдаас илүү сайн эсвэл муу гэсэн үг биш, харин өөрийн давуу тал, сул талаа илүү бодитоор харахад тусална.`,

    strengths: base.strengths,
    weaknesses: base.weaknesses,
    careers: base.careers,

    careerAdvice:
      `${base.careers.join(", ")} зэрэг чиглэл танд илүү тохиромжтой байж болно. ` +
      `Гэхдээ зөвхөн мэргэжлийн нэрээр хязгаарлах хэрэггүй. Танд тохирох ажил нь таны сэтгэх арга, шийдвэр гаргах хэв маяг, энерги авах орчинтой нийцэж байх нь чухал.`,

    relationships: base.relationships,

    relationshipAdvice: `${base.relationships} Харилцаанд таны анхаарах зүйл бол өөрийн хэрэгцээг нуухгүй, нөгөө хүний хүлээлтийг таамгаар дүгнэхгүй байх юм.`,

    growthAdvice:
      `Таны өсөх гол чиглэл бол давуу талаа хэтрүүлэхгүй ашиглах. Давуу тал хэтэрвэл сул тал болж хувирдаг. ` +
      `Жишээ нь таны хүчтэй тал ${base.strengths.join(", ")} байж болох ч үүнийг хэт нэг тийш нь түлхвэл ${base.weaknesses.join(", ")} гэх асуудал илэрч болно.`,

    finalAdvice: `Энэ үр дүнг өөрийгөө хайрцаглах онош гэж битгий хар. Харин өөрийн зан төлөв, харилцаа, ажиллах хэв маягийг ойлгох газрын зураг гэж хар.`,
  };

  return {
    ...fallback,
    ...mbtiMnPremiumOverrides[type],
    type,
  };
}
function buildEnPremiumProfile(
  type: string,
  base: (typeof mbtiEnglishProfiles)[string],
): MbtiPremiumProfile {
  return {
    type,
    name: base.name,
    summary: base.summary,

    personality:
      `${type} describes a personality pattern that influences how you make decisions, communicate, work, and recharge. ` +
      `${base.summary} This does not mean your type is better or worse than others. It simply gives you a clearer way to understand your natural strengths, pressure points, and growth direction.`,

    strengths: base.strengths,

    weaknesses: base.weaknesses,

    careers: base.careers,

    careerAdvice:
      `${base.careers.join(", ")} may fit your natural working style. ` +
      `But the job title is not the only important thing. The environment, communication style, responsibility level, and freedom inside the role matter just as much. ` +
      `You are more likely to do well when your work matches the way you naturally think, focus, and solve problems.`,

    relationships: base.relationships,

    relationshipAdvice:
      `${base.relationships} In relationships, your main growth point is to communicate your needs clearly instead of expecting others to guess them. ` +
      `When you understand your own style, you can build relationships with more honesty, patience, and emotional clarity.`,

    growthAdvice:
      `Your growth direction is to use your strengths without overusing them. Strengths can become weaknesses when they are pushed too far. ` +
      `Your strengths may include ${base.strengths.join(", ")}, but under stress they may turn into patterns like ${base.weaknesses.join(", ")}. ` +
      `The goal is not to become a different person, but to manage your natural pattern more wisely.`,

    finalAdvice:
      `Do not use this result as a fixed label. Use it as a map for self-understanding. ` +
      `When you know your natural style, you can choose better work environments, healthier relationships, and decisions that fit you more honestly.`,
  };
}

export function getLocalizedMbtiProfile(type: string) {
  const mnBase = mbtiProfiles[type] ?? mbtiProfiles.INTJ;
  const enBase = mbtiEnglishProfiles[type] ?? mbtiEnglishProfiles.INTJ;

  return {
    mn: buildMnPremiumProfile(type, mnBase),
    en: buildEnPremiumProfile(type, enBase),
  };
}
