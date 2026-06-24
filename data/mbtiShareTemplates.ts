export type MbtiShareTemplate = {
  // Female (existing)
  bg: string;
  bgSize?: string;
  bgPosition?: string;

  // Male
  maleBg?: string;
  maleBgSize?: string;
  maleBgPosition?: string;

  archetype: string;
  rarity: string;
  accent: string;
  strengths: string[];
  quote: string;
};

export const mbtiShareTemplates: Record<string, MbtiShareTemplate> = {
  INTJ: {
    bg: "/share/mbti-og-card/female/intj.webp",
    archetype: "Чимээгүй стратегич",
    rarity: "2%",
    accent: "#b78cff",
    strengths: ["Алсын хараатай", "Логик сэтгэлгээтэй", "Бие даасан"],
    quote:
      "Чи олон зүйл ярьдаггүй. Гэхдээ дотроо бүхнийг аль хэдийн тооцоолчихсон байдаг.",
    bgSize: "125%",
    bgPosition: "55% 100%",
    // Male
    maleBg: "/share/mbti-og-card/male/intj.webp",
    maleBgSize: "140%",
    maleBgPosition: "55% 35%",
  },

  INTP: {
    bg: "/share/mbti-og-card/female/intp.webp",
    archetype: "Сониуч Өөр ертөнцтэй",
    rarity: "3%",
    accent: "#9bbcff",
    strengths: ["Задлан шинжээч", "Сониуч", "Өөр өнцөгтэй"],
    quote:
      "Та зүгээр хариулт хайдаггүй. Харин бүх зүйлийн цаад учир шалтгааныг ойлгохыг хүсдэг.",
    bgSize: "110%",
    bgPosition: "35% 100%",
    // Male
    maleBg: "/share/mbti-og-card/male/intp.webp",
    maleBgSize: "110%",
    maleBgPosition: "35% 100%",
  },

  ENTJ: {
    bg: "/share/mbti-og-card/female/entj.webp",
    archetype: "Төрөлхийн удирдагч",
    rarity: "3%",
    accent: "#f4c76b",
    strengths: ["Шийдэмгий", "Зорилготой", "Стратеги сэтгэлгээтэй"],
    quote:
      "Та боломжийг хүлээдэг хүн биш. Харин боломжийг өөрөө хөдөлгөдөг хүн.",
    bgSize: "125%",
    bgPosition: "60% 100%",
    maleBg: "/share/mbti-og-card/male/entj.webp",
    maleBgSize: "125%",
    maleBgPosition: "40% 100%",
  },

  ESTJ: {
    bg: "/share/mbti-og-card/female/estj.webp",
    archetype: "Бодит үр дүн бүтээгч",
    rarity: "8%",
    accent: "#f4c76b",
    strengths: ["Эмх цэгцтэй", "Хариуцлагатай", "Үр дүнд төвлөрдөг"],
    quote:
      "Та санааг яриа хэвээр үлдээдэггүй. Бодит ажил, бодит үр дүн болгож чаддаг.",
    bgSize: "113%",
    bgPosition: "0% 80%",
    // Male
    maleBg: "/share/mbti-og-card/male/estj.webp",
    maleBgSize: "113%",
    maleBgPosition: "0% 80%",
  },

  INFP: {
    bg: "/share/mbti-og-card/female/infp.webp",
    archetype: "Дотоод ертөнцийн аялагч",
    rarity: "4%",
    accent: "#d8a7ff",
    strengths: ["Мэдрэмжтэй", "Бүтээлч", "Зөөлөн сэтгэлтэй"],
    quote:
      "Та хэт мэдрэмтгий биш. Зүгээр л бусдын анзаардаггүй зүйлийг зүрхээрээ мэдэрдэг.",
    bgSize: "113%",
    bgPosition: "50% 100%",
    // Male
    maleBg: "/share/mbti-og-card/male/infp.webp",
    maleBgSize: "115%",
    maleBgPosition: "55% 100%",
  },

  ISFP: {
    bg: "/share/mbti-og-card/female/isfp.webp",
    archetype: "Өөрийн өнгөтэй хүн",
    rarity: "9%",
    accent: "#9fdc8f",
    strengths: ["Гоо зүйтэй", "Бүтээлч", "Чөлөөт сэтгэлгээтэй"],
    quote:
      "Та өөрийгөө чангаар тайлбарлах шаардлагаггүй. Таны мэдрэмж, өнгө аяс өөрөө ярьдаг.",
    bgSize: "109%",
    bgPosition: "10% 150%",
    // Male
    maleBg: "/share/mbti-og-card/male/isfp.webp",
    maleBgSize: "109%",
    maleBgPosition: "10% 150%",
  },

  INFJ: {
    bg: "/share/mbti-og-card/female/infj.webp",
    archetype: "Дотоод зөнтэй",
    rarity: "2%",
    accent: "#8ecbff",
    strengths: ["Гүн мэдрэмжтэй", "Зөн совинтой", "Утга учир эрэлхийлдэг"],
    quote:
      "Та хүмүүсийн хэлсэн үгийг биш, хэлээгүй мэдрэмжийг нь хүртэл анзаардаг.",
    bgSize: "125%",
    bgPosition: "45% 70%",
    maleBg: "/share/mbti-og-card/male/infj.webp",
    maleBgSize: "125%",
    maleBgPosition: "45% 80%",
  },

  ENFJ: {
    bg: "/share/mbti-og-card/female/enfj.webp",
    archetype: "Дулаан нөлөөлөгч",
    rarity: "3%",
    accent: "#ffd166",
    strengths: ["Урам зориг өгдөг", "Хүмүүсийг ойлгодог", "Хариуцлагатай"],
    quote: "Та өөрөө гэрэлтээд зогсохгүй, хажуугийн хүмүүсээ ч босгож чаддаг.",
    bgSize: "115%",
    bgPosition: "45% 70%",
    // Male
    maleBg: "/share/mbti-og-card/male/enfj.webp",
    maleBgSize: "115%",
    maleBgPosition: "50% 100%",
  },

  ISTJ: {
    bg: "/share/mbti-og-card/female/istj.webp",
    archetype: "Найдвартай түшиг",
    rarity: "12%",
    accent: "#9fd8b4",
    strengths: ["Найдвартай", "Тууштай", "Зарчимтай"],
    quote: "Та олон зүйл амладаггүй. Гэхдээ амласан зүйлээ заавал биелүүлдэг.",
    bgSize: "105%",
    bgPosition: "30% 100%",
    // Male
    maleBg: "/share/mbti-og-card/male/istj.webp",
    maleBgSize: "145%",
    maleBgPosition: "60% 85%",
  },

  ISFJ: {
    bg: "/share/mbti-og-card/female/isfj.webp",
    archetype: "Дулаан хамгаалагч",
    rarity: "13%",
    accent: "#9fd8b4",
    strengths: ["Халамжтай", "Итгэл даадаг", "Тууштай"],
    quote:
      "Та бусдыг анзаарахдаа жижиг зүйлээс эхэлдэг. Тэр чинь л хүмүүсийг тайвшруулдаг.",
    bgSize: "110%",
    bgPosition: "10% 100%",
    // Male
    maleBg: "/share/mbti-og-card/male/isfj.webp",
    maleBgSize: "115%",
    maleBgPosition: "10% 100%",
  },

  ESFJ: {
    bg: "/share/mbti-og-card/female/esfj.webp",
    archetype: "Хүмүүсийг холбогч",
    rarity: "12%",
    accent: "#f2c879",
    strengths: ["Нийтэч", "Халамжтай", "Зохион байгуулагч"],
    quote: "Та байгаа газраа илүү дулаан, илүү амьд, илүү ойр болгож чаддаг.",
    bgSize: "120%",
    bgPosition: "65% 100%",
    // Male
    maleBg: "/share/mbti-og-card/male/esfj.webp",
    maleBgSize: "120%",
    maleBgPosition: "75% 100%",
  },

  ENFP: {
    bg: "/share/mbti-og-card/female/enfp.webp",
    archetype: "Галтай оч",
    rarity: "7%",
    accent: "#ff8a3d",
    strengths: ["Эрч хүчтэй", "Урам өгдөг", "Нээлттэй"],
    quote:
      "Та тогтворгүй биш. Таны дотор нэг газарт багтахгүй их амьдрал байдаг.",
    bgSize: "110%",
    bgPosition: "-0% 80%",
    // Male
    maleBg: "/share/mbti-og-card/male/enfp.webp",
    maleBgSize: "110%",
    maleBgPosition: "0% 100%",
  },

  ENTP: {
    bg: "/share/mbti-og-card/female/entp.webp",
    archetype: "Санааны өдөөгч",
    rarity: "4%",
    accent: "#ff8a3d",
    strengths: ["Хурдан сэтгэдэг", "Санаачлагч", "Өөр өнцөг хардаг"],
    quote:
      "Та дүрмийг эвдэх гэж биш, илүү сонирхолтой хувилбар байгааг харуулах гэж асуудаг.",
    bgSize: "125%",
    bgPosition: "40% 95%",
    // Male
    maleBg: "/share/mbti-og-card/male/entp.webp",
    maleBgSize: "125%",
    maleBgPosition: "40% 100%",
  },

  ISTP: {
    bg: "/share/mbti-og-card/female/istp.webp",
    archetype: "Тайван шийдэгч",
    rarity: "5%",
    accent: "#9ecbff",
    strengths: ["Ажил хэрэгч", "Шуурхай", "Эрсдэлд тайван"],
    quote: "Та их ярихгүй. Харин хэрэгтэй мөчид яг юу хийхээ мэддэг.",
    bgSize: "125%",
    bgPosition: "58% 80%",
    // Male
    maleBg: "/share/mbti-og-card/male/istp.webp",
    maleBgSize: "125%",
    maleBgPosition: "58% 80%",
  },

  ESTP: {
    bg: "/share/mbti-og-card/female/estp.webp",
    archetype: "Зоригтой тоглогч",
    rarity: "4%",
    accent: "#ff9f43",
    strengths: ["Зоримог", "Шуурхай", "Нөхцөлд дасан зохицдог"],
    quote:
      "Та амьдралыг холоос ажигладаггүй. Шууд дотор нь орж, мэдэрч, хөдөлдөг.",
    bgSize: "110%",
    bgPosition: "0% 30%",
    // Male
    maleBg: "/share/mbti-og-card/male/estp.webp",
    maleBgSize: "140%",
    maleBgPosition: "35% 75%",
  },

  ESFP: {
    bg: "/share/mbti-og-card/female/esfp.webp",
    archetype: "Амьд энерги",
    rarity: "8%",
    accent: "#ff75c3",
    strengths: ["Нийтэч", "Эерэг", "Амьд мэдрэмжтэй"],
    quote:
      "Та орчиндоо зүгээр нэг орж ирдэггүй. Өнгө, инээмсэглэл, хөдөлгөөн авчирдаг.",
    bgSize: "120%",
    bgPosition: "20% 0%",
    // Male
    maleBg: "/share/mbti-og-card/male/esfp.webp",
    maleBgSize: "120%",
    maleBgPosition: "20% 0%",
  },
};
