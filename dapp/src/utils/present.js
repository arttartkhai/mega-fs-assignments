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

export const countDecimals = (value) => {
  if (Math.floor(value) === value) return 0;
  return value.toString().split('.')[1].length || 0;
};
