export type MbtiDimension = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export type MbtiQuestion = {
  question: {
    mn: string;
    en: string;
  };
  dimension: MbtiDimension;
};

export const mbtiQuestions: MbtiQuestion[] = [
  {
    question: {
      mn: "Олон хүнтэй, хөдөлгөөнтэй орчинд орохоор та илүү сэргээд ирдэг.",
      en: "You usually feel energized when you are around many people.",
    },
    dimension: "E",
  },
  {
    question: {
      mn: "Ганцаараа тайван байх үед та өөрийгөө илүү цэгцэлж, эрч хүчээ нөхдөг.",
      en: "Time alone is important for you to recharge.",
    },
    dimension: "I",
  },

  {
    question: {
      mn: "Та аливааг шийдэхдээ бодит баримт, өмнөх туршлагадаа илүү итгэдэг.",
      en: "When making decisions, you rely more on facts, experience, and evidence.",
    },
    dimension: "S",
  },
  {
    question: {
      mn: "Та одоо байгаа зүйлээс илүү цаашид ямар боломж байж болохыг түрүүлж хардаг.",
      en: "You are more naturally drawn to possibilities, ideas, and future potential.",
    },
    dimension: "N",
  },

  {
    question: {
      mn: "Хэцүү үед та сэтгэл хөдлөлөөс илүү логик, шударга зарчмыг барихыг хичээдэг.",
      en: "When making a difficult choice, you look first at logic and fair principles.",
    },
    dimension: "T",
  },
  {
    question: {
      mn: "Шийдвэр гаргахдаа тухайн зүйл хүмүүсийн сэтгэл, харилцаанд яаж нөлөөлөхийг их боддог.",
      en: "When making a difficult choice, you think a lot about people's feelings and the impact on relationships.",
    },
    dimension: "F",
  },

  {
    question: {
      mn: "Төлөвлөгөө тодорхой, хийх зүйлс эмх цэгцтэй байвал та илүү тайван ажилладаг.",
      en: "You feel more comfortable working with a plan and clear structure.",
    },
    dimension: "J",
  },
  {
    question: {
      mn: "Та бүхнийг хэт эрт шийдэхээс илүү нөхцөл байдлаа хараад уян хатан явах дуртай.",
      en: "You prefer having room to adapt depending on the situation.",
    },
    dimension: "P",
  },

  {
    question: {
      mn: "Шинэ хүмүүстэй яриа эхлүүлэх нь танд тийм ч хэцүү санагддаггүй.",
      en: "Starting conversations with new people usually does not feel difficult for you.",
    },
    dimension: "E",
  },
  {
    question: {
      mn: "Та олон хүнтэй танил байхаас илүү цөөн ч гэсэн дотно, гүн харилцааг эрхэмлэдэг.",
      en: "You prefer a few deep relationships over many casual connections.",
    },
    dimension: "I",
  },

  {
    question: {
      mn: "Та аливаа зүйлийг ойлгохдоо бодит жишээ, тодорхой алхам байвал илүү амархан хүлээж авдаг.",
      en: "You are good at understanding things in a practical, step-by-step way.",
    },
    dimension: "S",
  },
  {
    question: {
      mn: "Та жижиг зүйлсээс илүү ерөнхий зураг, далд утга, холбоосыг түрүүлж анзаардаг.",
      en: "You quickly notice the bigger picture and hidden patterns more than small details.",
    },
    dimension: "N",
  },

  {
    question: {
      mn: "Маргаантай үед та хэн юу мэдэрч байгаагаас илүү юу үнэн, юу зөв гэдэгт төвлөрдөг.",
      en: "In disagreements, you value facts and logical reasoning more.",
    },
    dimension: "T",
  },
  {
    question: {
      mn: "Маргаантай үед та зөв буруугаас гадна харилцаа эвдрэх вий гэдгийг их боддог.",
      en: "In disagreements, you care more about protecting the relationship.",
    },
    dimension: "F",
  },

  {
    question: {
      mn: "Та ажлаа эртхэн дуусгаад санаа амар байхыг илүүд үздэг.",
      en: "You like finishing tasks early so you can feel at ease.",
    },
    dimension: "J",
  },
  {
    question: {
      mn: "Заримдаа сүүлийн мөчийн шахалт таныг илүү хурц төвлөрүүлдэг.",
      en: "Sometimes you focus better under last-minute pressure.",
    },
    dimension: "P",
  },

  {
    question: {
      mn: "Та бодлоо яриад эхлэхээр санаа чинь улам тодорхой болоод ирдэг.",
      en: "You often clarify your thoughts by talking them through.",
    },
    dimension: "E",
  },
  {
    question: {
      mn: "Та бодлоо шууд хэлэхээсээ өмнө дотроо сайн боловсруулж байж илүү зөв илэрхийлдэг.",
      en: "You express yourself better after processing your thoughts internally first.",
    },
    dimension: "I",
  },

  {
    question: {
      mn: "Та дүрэм, заавар, жижиг деталиудыг анхааралтай баримтлахдаа сайн.",
      en: "You are good at following rules, instructions, and detailed information carefully.",
    },
    dimension: "S",
  },
  {
    question: {
      mn: "Та бусдын анзаараагүй шинэ санаа, өөр гарц, сонин боломжийг амархан олж хардаг.",
      en: "You easily notice new ideas, alternative possibilities, and unusual solutions.",
    },
    dimension: "N",
  },

  {
    question: {
      mn: "Шүүмж хэлэх үедээ та аль болох тойруулахгүй, бодитой хэлэхийг хичээдэг.",
      en: "When giving criticism, you try to be objective and direct.",
    },
    dimension: "T",
  },
  {
    question: {
      mn: "Шүүмж хэлэхдээ тухайн хүн яаж хүлээж авах бол гэж урьдчилж боддог.",
      en: "You think about how criticism may affect someone's feelings.",
    },
    dimension: "F",
  },

  {
    question: {
      mn: "Хугацаа, зорилго, хийх дараалал тодорхой байвал та илүү үр дүнтэй байдаг.",
      en: "You work better when there is a clear schedule, goal, and deadline.",
    },
    dimension: "J",
  },
  {
    question: {
      mn: "Та бүх сонголтоо хаачихалгүй, явцын дунд мэдэрч шийдэхийг илүүд үздэг.",
      en: "You prefer keeping your options open and deciding as things develop.",
    },
    dimension: "P",
  },
];
