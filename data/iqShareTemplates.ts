export const iqShareTemplates = [
  {
    min: 0,
    max: 69,
    title: "МАШ ДООГУУР",
    quote: "Чиний хүч өөр чиглэлд илүү тод илэрдэг байж болно.",
  },
  {
    min: 70,
    max: 79,
    title: "ДООГУУР",
    quote: "Зөв өнцгийг олбол чи бодсоноосоо илүү хол явна.",
  },
  {
    min: 80,
    max: 89,
    title: "ДУНДЖААС ДООГУУР",
    quote: "Та шууд биш, бодож байж хөдөлдөг төрлийн сэтгэгч.",
  },
  {
    min: 90,
    max: 109,
    title: "ДУНДАЖ",
    quote: "Хэв маягийг олж харвал та хурдан урагшилдаг.",
  },
  {
    min: 110,
    max: 119,
    title: "ДУНДЖААС ДЭЭГҮҮР",
    quote: "Бусдын анзаарахгүй холбоосыг та арай эрт олж хардаг.",
  },
  {
    min: 120,
    max: 129,
    title: "ӨНДӨР",
    quote: "Төвөгтэй зүйлс таны тархинд хурдан холбогддог.",
  },
  {
    min: 130,
    max: 145,
    title: "МАШ ӨНДӨР",
    quote: "Бусдад харагдахаас өмнө шийдэл танд харагддаг.",
  },
];
export function getIqShareTemplate(score: number) {
  return iqShareTemplates.find(
    (item) => score >= item.min && score <= item.max,
  );
}
