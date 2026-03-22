export function reduceToSingleDigit(num: number): number {
  let current = num;

  while (current > 9 && current !== 11 && current !== 22 && current !== 33) {
    current = current
      .toString()
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }

  return current;
}

export function calculateLifePath(date: string): number {
  const digits = date.replace(/-/g, "").split("");
  const total = digits.reduce((sum, digit) => sum + Number(digit), 0);
  return reduceToSingleDigit(total);
}

const letterMap: Record<string, number> = {
  а: 1,
  б: 2,
  в: 3,
  г: 4,
  д: 5,
  е: 6,
  ё: 7,
  ж: 8,
  з: 9,
  и: 1,
  й: 2,
  к: 3,
  л: 4,
  м: 5,
  н: 6,
  о: 7,
  ө: 8,
  п: 9,
  р: 1,
  с: 2,
  т: 3,
  у: 4,
  ү: 5,
  ф: 6,
  х: 7,
  ц: 8,
  ч: 9,
  ш: 1,
  щ: 2,
  ъ: 3,
  ы: 4,
  ь: 5,
  э: 6,
  ю: 7,
  я: 8,

  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8,
  i: 9,
  j: 1,
  k: 2,
  l: 3,
  m: 4,
  n: 5,
  o: 6,
  p: 7,
  q: 8,
  r: 9,
  s: 1,
  t: 2,
  u: 3,
  v: 4,
  w: 5,
  x: 6,
  y: 7,
  z: 8,
};

const vowels = new Set<string>([
  "a",
  "e",
  "i",
  "o",
  "u",
  "y",
  "а",
  "э",
  "и",
  "о",
  "ө",
  "у",
  "ү",
  "е",
  "ё",
  "ю",
  "я",
]);

function normalizeName(name: string): string {
  return name.toLowerCase().trim();
}

export function calculateDestiny(name: string): number {
  const normalized = normalizeName(name);
  let total = 0;

  for (const char of normalized) {
    if (letterMap[char]) {
      total += letterMap[char];
    }
  }

  return reduceToSingleDigit(total || 1);
}

export function calculateSoulUrge(name: string): number {
  const normalized = normalizeName(name);
  let total = 0;

  for (const char of normalized) {
    if (vowels.has(char) && letterMap[char]) {
      total += letterMap[char];
    }
  }

  return reduceToSingleDigit(total || 1);
}

export function calculatePersonalityNumber(name: string): number {
  const normalized = normalizeName(name);
  let total = 0;

  for (const char of normalized) {
    if (!vowels.has(char) && letterMap[char]) {
      total += letterMap[char];
    }
  }

  return reduceToSingleDigit(total || 1);
}
