export type MbtiDimension = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export type MbtiQuestion = {
  question: string;
  dimension: MbtiDimension;
};

export const mbtiQuestions: MbtiQuestion[] = [
  { question: "Та олон хүнтэй орчинд байхад эрч хүч авдаг.", dimension: "E" },
  {
    question: "Та ганцаараа байхдаа илүү тайвширч, цэнэглэгддэг.",
    dimension: "I",
  },

  {
    question: "Та бодит баримт, туршлага дээр тулгуурлах дуртай.",
    dimension: "S",
  },
  {
    question: "Та боломж, ирээдүйн дүр зураг, санаанд илүү татагддаг.",
    dimension: "N",
  },

  {
    question: "Шийдвэр гаргахдаа логик, зарчмыг түрүүлж боддог.",
    dimension: "T",
  },
  {
    question: "Шийдвэр гаргахдаа хүмүүсийн мэдрэмжийг чухалчилдаг.",
    dimension: "F",
  },

  {
    question: "Та урьдчилан төлөвлөсөн, эмх цэгцтэй байх дуртай.",
    dimension: "J",
  },
  {
    question: "Та уян хатан, нөхцөл байдалд тааруулж ажиллах дуртай.",
    dimension: "P",
  },

  {
    question: "Шинэ хүмүүстэй танилцах нь танд амархан санагддаг.",
    dimension: "E",
  },
  { question: "Та гүнзгий, цөөн харилцааг илүүд үздэг.", dimension: "I" },

  {
    question: "Та одоо байгаа зүйлсийг бодитоор ажиглахдаа сайн.",
    dimension: "S",
  },
  {
    question: "Та далд утга, ерөнхий дүр зураг харахдаа сайн.",
    dimension: "N",
  },

  { question: "Маргаанд баримт, логик илүү чухал гэж үздэг.", dimension: "T" },
  {
    question: "Маргаанд харилцаагаа хадгалах нь илүү чухал гэж үздэг.",
    dimension: "F",
  },

  { question: "Та ажлаа эрт дуусгаад тайван байх дуртай.", dimension: "J" },
  {
    question: "Та сүүлийн мөчид ч сайн ажиллаж чадна гэж боддог.",
    dimension: "P",
  },

  {
    question: "Та бодлоо чангаар ярьж байж илүү тодорхой болгодог.",
    dimension: "E",
  },
  {
    question: "Та бодлоо дотроо боловсруулж байж илүү тодорхой болгодог.",
    dimension: "I",
  },

  { question: "Та нарийн деталь, алхам дарааллыг анзаардаг.", dimension: "S" },
  { question: "Та хэв загвар, холбоос, том зургаар сэтгэдэг.", dimension: "N" },

  { question: "Та шүүмжлэлд объектив хандахыг хичээдэг.", dimension: "T" },
  { question: "Та шүүмжлэл хүнд яаж нөлөөлөхийг боддог.", dimension: "F" },

  { question: "Та хуваарь, тодорхой дүрэмтэй орчинд дуртай.", dimension: "J" },
  { question: "Та сонголтоо нээлттэй үлдээх дуртай.", dimension: "P" },
];
