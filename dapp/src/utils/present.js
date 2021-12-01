// params : Number | String
export const formatNumber = (num, decimal = 5) => {
  if (typeof num === 'number') {
    return num.toFixed(decimal);
  }

  if (typeof num === 'string') {
    return Number(num).toFixed(decimal);
  }

  return '';
};
