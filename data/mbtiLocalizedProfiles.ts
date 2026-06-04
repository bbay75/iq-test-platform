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
  return {
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
      `Гэхдээ зөвхөн мэргэжлийн нэрээр хязгаарлах хэрэггүй. Танд тохирох ажил нь таны сэтгэх арга, шийдвэр гаргах хэв маяг, энерги авах орчинтой нийцэж байх нь чухал. ` +
      `Хэрвээ ажил тань таны төрөлхийн хэв маягийг байнга эсэргүүцэж байвал хурдан ядрах, сонирхол буурах магадлалтай.`,

    relationships: base.relationships,

    relationshipAdvice:
      `${base.relationships} Харилцаанд таны анхаарах зүйл бол өөрийн хэрэгцээг нуухгүй, нөгөө хүний хүлээлтийг таамгаар дүгнэхгүй байх юм. ` +
      `Өөрийн харилцах хэв маягаа ойлгосноор та бусдад илүү тодорхой, тайван, үнэнчээр ойлгогдоно.`,

    growthAdvice:
      `Таны өсөх гол чиглэл бол давуу талаа хэтрүүлэхгүй ашиглах. Давуу тал хэтэрвэл сул тал болж хувирдаг. ` +
      `Жишээ нь таны хүчтэй тал ${base.strengths.join(", ")} байж болох ч үүнийг хэт нэг тийш нь түлхвэл ${base.weaknesses.join(", ")} гэх асуудал илэрч болно. ` +
      `Тиймээс өөрийгөө өөрчлөхөөс илүү өөрийгөө зөв удирдах нь чухал.`,

    finalAdvice:
      `Энэ үр дүнг өөрийгөө хайрцаглах онош гэж битгий хар. Харин өөрийн зан төлөв, харилцаа, ажиллах хэв маягийг ойлгох газрын зураг гэж хар. ` +
      `Та өөрийн төрөлхийн хандлагаа мэддэг бол шийдвэрээ илүү тайван гаргаж, өөрт тохирох орчин, хүмүүс, ажлын хэв маягаа илүү зөв сонгож чадна.`,
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
