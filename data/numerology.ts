export const calculateLifePath = (birthDate: string) => {
  // birthDate = "YYYY-MM-DD"
  const parts = birthDate.split("-");
  const sumDigits = (numStr: string) =>
    numStr.split("").reduce((acc, d) => acc + parseInt(d), 0);

  let total =
    sumDigits(parts[0]) + // year
    sumDigits(parts[1]) + // month
    sumDigits(parts[2]); // day

  // reduce to single digit
  while (total > 9 && total !== 11 && total !== 22 && total !== 33) {
    total = total
      .toString()
      .split("")
      .reduce((acc, d) => acc + parseInt(d), 0);
  }

  return total;
};
