export const formatNumberWithCommas = (num: number | undefined): string => {
  if (!num) {
    return "";
  }
  return num.toLocaleString("en-US");
};

export const isPowerOfTwo = (n: number) => {
  if (n <= 0) return false;
  return (n & (n - 1)) === 0;
};
