export const loveAlgorithm = (name1: string, name2: string) => {
  // Simple hash
  const sum = name1.length + name2.length;
  const code = sum * (name1.charCodeAt(0) + name2.charCodeAt(0));
  return code % 101; // 0-100%
};
