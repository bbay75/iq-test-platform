import { mbtiProfiles, type MbtiProfile } from "@/data/mbtiProfiles";

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

export function getLocalizedMbtiProfile(type: string) {
  const mn = mbtiProfiles[type] ?? mbtiProfiles.INTJ;
  const en = mbtiEnglishProfiles[type] ?? mbtiEnglishProfiles.INTJ;

  return { mn, en };
}
