// data/loveShareTemplates.ts

export const loveShareTemplates = [
  { min: 0, max: 39, bg: "/share/love/love-28-0-39.webp" },
  { min: 40, max: 49, bg: "/share/love/love-44-40-49.webp" },
  { min: 50, max: 54, bg: "/share/love/love-52-50-54.webp" },
  { min: 55, max: 59, bg: "/share/love/love-57-55-59.webp" },
  { min: 60, max: 64, bg: "/share/love/love-62-60-64.webp" },
  { min: 65, max: 69, bg: "/share/love/love-67-65-69.webp" },
  { min: 70, max: 74, bg: "/share/love/love-72-70-74.webp" },
  { min: 75, max: 79, bg: "/share/love/love-78-75-79.webp" },
  { min: 80, max: 84, bg: "/share/love/love-83-80-84.webp" },
  { min: 85, max: 89, bg: "/share/love/love-87-85-89.webp" },
  { min: 90, max: 94, bg: "/share/love/love-92-90-94.webp" },
  { min: 95, max: 100, bg: "/share/love/love-98-95-100.webp" },
];

export function getLoveShareTemplate(score: number) {
  return loveShareTemplates.find(
    (item) => score >= item.min && score <= item.max,
  );
}
