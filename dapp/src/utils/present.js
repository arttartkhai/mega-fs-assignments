import { EXPLORER } from '../constant/url';

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
  return value.toString().split('.')[1]?.length || 0;
};

export const getUrlExplorer = (chainId, transactionHash = '') => {
  if (chainId === 4) {
    return `${EXPLORER.rinkeby}/${transactionHash}`;
  }
  if (chainId === 3) {
    return `${EXPLORER.ropsten}/${transactionHash}`;
  }
  return '';
};
