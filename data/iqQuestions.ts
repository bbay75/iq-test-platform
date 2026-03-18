export type IQQuestionType = "visual" | "number" | "logic" | "verbal";

export type IQOption = {
  text: string;
  points: number;
};

export type IQQuestion = {
  question: string;
  type: IQQuestionType;
  options: IQOption[];
};

export const iqQuestions: IQQuestion[] = [
  // VISUAL / PATTERN (7)
  {
    question: "△ ○ △ ○ △ ?",
    type: "visual",
    options: [
      { text: "△", points: 0 },
      { text: "○", points: 2 },
      { text: "□", points: 0 },
      { text: "◇", points: 0 },
    ],
  },
  {
    question: "⬛ ⬜ ⬛ ⬜ ?",
    type: "visual",
    options: [
      { text: "⬛", points: 2 },
      { text: "⬜", points: 0 },
      { text: "▲", points: 0 },
      { text: "●", points: 0 },
    ],
  },
  {
    question: "→ ↓ → ↓ → ?",
    type: "visual",
    options: [
      { text: "→", points: 0 },
      { text: "↓", points: 2 },
      { text: "↑", points: 0 },
      { text: "←", points: 0 },
    ],
  },
  {
    question: "A B A B A ?",
    type: "visual",
    options: [
      { text: "A", points: 0 },
      { text: "B", points: 2 },
      { text: "C", points: 0 },
      { text: "D", points: 0 },
    ],
  },
  {
    question: "◼ ◻ ◼ ◻ ◼ ?",
    type: "visual",
    options: [
      { text: "◻", points: 2 },
      { text: "◼", points: 0 },
      { text: "●", points: 0 },
      { text: "▲", points: 0 },
    ],
  },
  {
    question: "1 2 1 2 1 ?",
    type: "visual",
    options: [
      { text: "1", points: 0 },
      { text: "2", points: 2 },
      { text: "3", points: 0 },
      { text: "4", points: 0 },
    ],
  },
  {
    question: "◆ ◇ ◆ ◇ ◆ ?",
    type: "visual",
    options: [
      { text: "◇", points: 2 },
      { text: "◆", points: 0 },
      { text: "□", points: 0 },
      { text: "○", points: 0 },
    ],
  },

  // NUMBER (7)
  {
    question: "2, 4, 8, 16, ?",
    type: "number",
    options: [
      { text: "20", points: 0 },
      { text: "24", points: 0 },
      { text: "32", points: 2 },
      { text: "30", points: 0 },
    ],
  },
  {
    question: "5, 10, 20, 40, ?",
    type: "number",
    options: [
      { text: "60", points: 0 },
      { text: "80", points: 2 },
      { text: "70", points: 0 },
      { text: "90", points: 0 },
    ],
  },
  {
    question: "3, 6, 9, 12, ?",
    type: "number",
    options: [
      { text: "13", points: 0 },
      { text: "14", points: 0 },
      { text: "15", points: 2 },
      { text: "18", points: 0 },
    ],
  },
  {
    question: "10, 8, 6, 4, ?",
    type: "number",
    options: [
      { text: "1", points: 0 },
      { text: "2", points: 2 },
      { text: "3", points: 0 },
      { text: "5", points: 0 },
    ],
  },
  {
    question: "1, 4, 9, 16, ?",
    type: "number",
    options: [
      { text: "20", points: 0 },
      { text: "25", points: 2 },
      { text: "36", points: 0 },
      { text: "18", points: 0 },
    ],
  },
  {
    question: "7, 14, 21, 28, ?",
    type: "number",
    options: [
      { text: "32", points: 0 },
      { text: "35", points: 2 },
      { text: "36", points: 0 },
      { text: "30", points: 0 },
    ],
  },
  {
    question: "30, 25, 20, 15, ?",
    type: "number",
    options: [
      { text: "5", points: 0 },
      { text: "10", points: 2 },
      { text: "12", points: 0 },
      { text: "8", points: 0 },
    ],
  },

  // LOGIC (7)
  {
    question: "Бүх муур амьтан. Зарим амьтан нохой. Тэгвэл?",
    type: "logic",
    options: [
      { text: "Бүх нохой муур", points: 0 },
      { text: "Зарим муур нохой", points: 0 },
      { text: "Шууд дүгнэх боломжгүй", points: 2 },
      { text: "Бүх амьтан муур", points: 0 },
    ],
  },
  {
    question: "Хэрвээ A > B, B > C бол?",
    type: "logic",
    options: [
      { text: "A < C", points: 0 },
      { text: "A > C", points: 2 },
      { text: "A = C", points: 0 },
      { text: "Тодорхойгүй", points: 0 },
    ],
  },
  {
    question: "Бүх сарнай цэцэг. Зарим цэцэг улаан. Тэгвэл?",
    type: "logic",
    options: [
      { text: "Бүх сарнай улаан", points: 0 },
      { text: "Зарим сарнай улаан байж болно", points: 2 },
      { text: "Ямар ч сарнай улаан биш", points: 0 },
      { text: "Бүх улаан зүйл сарнай", points: 0 },
    ],
  },
  {
    question: "Хэрвээ өнөөдөр Даваа бол 2 хоногийн дараа ямар гараг вэ?",
    type: "logic",
    options: [
      { text: "Мягмар", points: 0 },
      { text: "Лхагва", points: 2 },
      { text: "Пүрэв", points: 0 },
      { text: "Баасан", points: 0 },
    ],
  },
  {
    question:
      "3 хүн 3 цагт 3 зүйл хийдэг бол 1 хүн 1 зүйлийг хэдэн цагт хийх вэ?",
    type: "logic",
    options: [
      { text: "1 цаг", points: 0 },
      { text: "2 цаг", points: 0 },
      { text: "3 цаг", points: 2 },
      { text: "9 цаг", points: 0 },
    ],
  },
  {
    question: "Эрдэнэ Бат-аас өндөр. Бат Тэмүүжнээс өндөр. Тэгвэл?",
    type: "logic",
    options: [
      { text: "Тэмүүжин хамгийн өндөр", points: 0 },
      { text: "Эрдэнэ Тэмүүжнээс өндөр", points: 2 },
      { text: "Бат хамгийн өндөр", points: 0 },
      { text: "Шууд дүгнэх боломжгүй", points: 0 },
    ],
  },
  {
    question: "Бүх X нь Y. Бүх Y нь Z. Тэгвэл?",
    type: "logic",
    options: [
      { text: "Бүх Z нь X", points: 0 },
      { text: "Бүх X нь Z", points: 2 },
      { text: "Бүх X нь Y биш", points: 0 },
      { text: "Шууд боломжгүй", points: 0 },
    ],
  },

  // VERBAL (7)
  {
    question: "“Хүйтэн” гэдэг үгийн эсрэг утга?",
    type: "verbal",
    options: [
      { text: "Сэрүүн", points: 0 },
      { text: "Халуун", points: 2 },
      { text: "Дулаан", points: 1 },
      { text: "Салхи", points: 0 },
    ],
  },
  {
    question: "Нохой : Гөлөг = Муур : ?",
    type: "verbal",
    options: [
      { text: "Муур", points: 0 },
      { text: "Зулзага", points: 2 },
      { text: "Амьтан", points: 0 },
      { text: "Жижиг муур", points: 1 },
    ],
  },
  {
    question: "“Өдөр” гэдэгтэй хамгийн эсрэг утгатай нь?",
    type: "verbal",
    options: [
      { text: "Өглөө", points: 0 },
      { text: "Шөнө", points: 2 },
      { text: "Орой", points: 0 },
      { text: "Цаг", points: 0 },
    ],
  },
  {
    question: "Ном : Унших = Хоол : ?",
    type: "verbal",
    options: [
      { text: "Харах", points: 0 },
      { text: "Идэх", points: 2 },
      { text: "Авах", points: 0 },
      { text: "Хийх", points: 0 },
    ],
  },
  {
    question: "“Их” гэдэгтэй ойролцоо утгатай нь?",
    type: "verbal",
    options: [
      { text: "Жижиг", points: 0 },
      { text: "Том", points: 2 },
      { text: "Бага", points: 0 },
      { text: "Нарийн", points: 0 },
    ],
  },
  {
    question: "Гар : Хуруу = Мод : ?",
    type: "verbal",
    options: [
      { text: "Навч", points: 2 },
      { text: "Үндэс", points: 0 },
      { text: "Газар", points: 0 },
      { text: "Сүүдэр", points: 0 },
    ],
  },
  {
    question: "“Хурдан” гэдэгтэй эсрэг утгатай нь?",
    type: "verbal",
    options: [
      { text: "Удаан", points: 2 },
      { text: "Түргэн", points: 0 },
      { text: "Шуурхай", points: 0 },
      { text: "Ойр", points: 0 },
    ],
  },
];
