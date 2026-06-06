export type MbtiShareTemplate = {
  bg: string;
  archetype: string;
  rarity: string;
  accent: string;
  strengths: string[];
  quote: string;
};

export const mbtiShareTemplates: Record<string, MbtiShareTemplate> = {
  INTJ: {
    bg: "/share/mbti/strategist.png",
    archetype: "Стратегич жанжин",
    rarity: "2%",
    accent: "#b78cff",
    strengths: ["Алсын хараатай", "Логик сэтгэлгээтэй", "Бие даасан"],
    quote: "Бусдын хардаггүй боломжийг олж хардаг.",
  },
  INTP: {
    bg: "/share/mbti/strategist.png",
    archetype: "Логикч мэргэн",
    rarity: "3%",
    accent: "#9bbcff",
    strengths: ["Аналитик", "Бие даасан", "Шинийг эрэлхийлэгч"],
    quote: "Бүх зүйлийн цаад учрыг хайдаг.",
  },
  ENTJ: {
    bg: "/share/mbti/commander.png",
    archetype: "Командлагч хаан",
    rarity: "3%",
    accent: "#f4c76b",
    strengths: ["Төрөлхийн удирдагч", "Стратеги төлөвлөгч", "Шийдэмгий"],
    quote: "Удирдлагыг дагадаггүй, харин чиглүүлдэг.",
  },
  ESTJ: {
    bg: "/share/mbti/commander.png",
    archetype: "Зохион байгуулагч",
    rarity: "8%",
    accent: "#f4c76b",
    strengths: ["Эмх цэгцтэй", "Хариуцлагатай", "Үр дүнд төвлөрдөг"],
    quote: "Ажлыг бодит үр дүнд хүргэдэг.",
  },
  INFP: {
    bg: "/share/mbti/dreamer.png",
    archetype: "Мөрөөдөгч илбэчин",
    rarity: "4%",
    accent: "#d8a7ff",
    strengths: ["Мэдрэмжтэй", "Бүтээлч", "Зөөлөн сэтгэлтэй"],
    quote: "Дэлхийг илүү сайхан болгохыг хүсдэг зөөлөн зүрхтэн.",
  },
  ISFP: {
    bg: "/share/mbti/dreamer.png",
    archetype: "Мэдрэмжтэй уран бүтээлч",
    rarity: "9%",
    accent: "#d8a7ff",
    strengths: ["Гоо зүйтэй", "Зөөлөн", "Өөрийн өнгөтэй"],
    quote: "Өөрийнхөөрөө мэдэрч, өөрийнхөөрөө гэрэлтдэг.",
  },
  INFJ: {
    bg: "/share/mbti/mystic.png",
    archetype: "Зөнч",
    rarity: "2%",
    accent: "#a78bfa",
    strengths: ["Гүн мэдрэмжтэй", "Зөн совинтой", "Утга учир эрэлхийлдэг"],
    quote: "Хүмүүсийн хэлээгүйг ч дотроос нь мэдэрдэг.",
  },
  ENFJ: {
    bg: "/share/mbti/leader.png",
    archetype: "Удирдагч баатар",
    rarity: "3%",
    accent: "#ffd166",
    strengths: ["Урам зориг өгдөг", "Хүмүүстэй холбодог", "Хариуцлагатай"],
    quote: "Өөрөө гялалзаад зогсохгүй, бусдыг ч асаадаг.",
  },
  ISTJ: {
    bg: "/share/mbti/guardian.png",
    archetype: "Тогтвортой түшиг",
    rarity: "12%",
    accent: "#9fd8b4",
    strengths: ["Найдвартай", "Тууштай", "Эмх цэгцтэй"],
    quote: "Чимээгүйхэн хариуцлагаа үүрч, итгэл даадаг.",
  },
  ISFJ: {
    bg: "/share/mbti/guardian.png",
    archetype: "Хамгаалагч зүрх",
    rarity: "13%",
    accent: "#9fd8b4",
    strengths: ["Халамжтай", "Итгэл даадаг", "Тууштай"],
    quote: "Дулаан сэтгэл нь ойр байгаа бүхнийг тайвшруулдаг.",
  },
  ESFJ: {
    bg: "/share/mbti/guardian.png",
    archetype: "Нийтэч дэмжигч",
    rarity: "12%",
    accent: "#f2c879",
    strengths: ["Нийтэч", "Халамжтай", "Зохион байгуулдаг"],
    quote: "Хүмүүсийг холбож, орчныг дулаан болгодог.",
  },
  ENFP: {
    bg: "/share/mbti/explorer.png",
    archetype: "Галтай аялагч",
    rarity: "7%",
    accent: "#ff8a3d",
    strengths: ["Эрч хүчтэй", "Урам өгдөг", "Нээлттэй"],
    quote: "Түүний энерги орчныг гэрэлтүүлдэг.",
  },
  ENTP: {
    bg: "/share/mbti/explorer.png",
    archetype: "Шинийг санаачлагч",
    rarity: "4%",
    accent: "#ff8a3d",
    strengths: ["Хурдан сэтгэдэг", "Санаачлагч", "Өөр өнцөг хардаг"],
    quote: "Тоглоомын дүрмийг өөрчилж хардаг.",
  },
  ISTP: {
    bg: "/share/mbti/warrior.png",
    archetype: "Ганцаардмал дайчин",
    rarity: "5%",
    accent: "#9ecbff",
    strengths: ["Практик", "Хурдан шийддэг", "Эрсдэлд тайван"],
    quote: "Дуугүй ч чадвараараа ялгардаг.",
  },
  ESTP: {
    bg: "/share/mbti/warrior.png",
    archetype: "Эрч хүчтэй тоглогч",
    rarity: "4%",
    accent: "#ff9f43",
    strengths: ["Зоримог", "Шуурхай", "Нөхцөлд дасан зохицдог"],
    quote: "Боломжийг хүлээдэггүй, шууд барьж авдаг.",
  },
  ESFP: {
    bg: "/share/mbti/explorer.png",
    archetype: "Оргилуун харилцагч",
    rarity: "8%",
    accent: "#ff75c3",
    strengths: ["Нийтэч", "Эерэг", "Амьд мэдрэмжтэй"],
    quote: "Орчиндоо баяр баясал, өнгө нэмдэг.",
  },
};
