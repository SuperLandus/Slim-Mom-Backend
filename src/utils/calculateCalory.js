export const calculateDailyCalory = ({
  currentWeight,
  height,
  age,
  desiredWeight,
}) => {
  //10 * ağırlık + 6,25 * boy - 5 * yaş - 161 - 10 * (ağırlık - istenen ağırlık)
  return Math.floor(
    10 * currentWeight +
      6.25 * height -
      5 * age -
      161 -
      10 * (currentWeight - desiredWeight),
  );
};
