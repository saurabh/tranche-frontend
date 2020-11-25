import ReactHtmlParser from 'react-html-parser';
import BigNumber from 'bignumber.js';

export const readyToTransact = async (wallet, onboard) => {
  if (!wallet) {
    const walletSelected = await onboard.walletSelect();
    if (!walletSelected) return false;
  }
  const ready = await onboard.walletCheck();
  return ready;
};

export const addrShortener = (addr) => {
  if (addr.length > 5) {
    return ReactHtmlParser(
      addr.substring(0, 5) + '...' + addr.substring(addr.length - 4, addr.length)
    );
  } else return 'Connect';
};

export const valShortner = (val) => {
  if (typeof val === 'string') {
    return ReactHtmlParser(val.substring(0, 12) + (val.length >= 12 ? '.' : ''));
  } else if (typeof val === 'number') {
    return val;
  }
};

export const round = (type, input, roundTo) => {
  try {
    let result = input * 10 ** roundTo;
    if (type === 'up') result = Math.ceil(result);
    if (type === 'down') result = Math.floor(result);
    result /= 10 ** roundTo;
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const roundNumber = (input, roundTo) => {
  try {
    if (input === 'N/A') return;
    if (typeof input === 'number') {
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: roundTo,
        maximumFractionDigits: roundTo
      });
      return formatter.format(input);
    } else if (typeof input === 'string') {
      let string = input.split('.');
      string[1] = string[1].substr(0, roundTo);
      string = string[0].concat('.', string[1]);
      return string;
    }
  } catch (error) {
    console.error(error);
  }
};

export const gweiOrEther = (input) => {
  try {
    if (input <= 0.00099) {
      return 'gwei';
    } else return 'ether';
  } catch (error) {
    console.error(error);
  }
};

// Big Number Functions

export const safeAdd = function (a, b) {
  let x = new BigNumber(a);
  let y = new BigNumber(b);
  return x.plus(y);
};
export const safeSubtract = function (a, b) {
  let x = new BigNumber(a);
  let y = new BigNumber(b);
  return x.minus(y);
};
export const safeDivide = function (a, b) {
  let x = new BigNumber(a);
  let y = new BigNumber(b);
  return x.dividedBy(y);
};
export const safeMultiply = function (a, b) {
  let x = new BigNumber(a);
  let y = new BigNumber(b);
  return x.multipliedBy(y);
};
export const valueOf = function (a) {
  return a.valueOf();
};
export const isGreaterThan = function (a, b) {
  let x = new BigNumber(a);
  let y = new BigNumber(b);
  return x.isGreaterThan(y);
};
export const isLessThan = function (a, b) {
  let x = new BigNumber(a);
  let y = new BigNumber(b);
  return x.isLessThan(y);
};
export const isGreaterThanOrEqualTo = function (a, b) {
  let x = new BigNumber(a);
  let y = new BigNumber(b);
  return x.isGreaterThanOrEqualTo(y);
};
export const isLessThanOrEqualTo = function (a, b) {
  let x = new BigNumber(a);
  let y = new BigNumber(b);
  return x.isLessThanOrEqualTo(y);
};
export const toFixed = function (a, b) {
  let x = new BigNumber(a);
  return x.toFixed(b);
};
export const toFixedNew = function (a, b) {
  a = a.toString();
  let str = a.split('.');
  let str1 = str[0];
  let str2 = str[1];
  if (str2) {
    if (str2.length > b) {
      str2 = str2.slice(0, b);
    } else {
      let numofzero = b - str2.length;
      str2 += '0'.repeat(numofzero);
    }
  } else {
    str2 = '0000';
  }
  return str1 + '.' + str2;
};
export const isEqualTo = function (a, b) {
  let x = new BigNumber(a);
  let y = new BigNumber(b);
  return x.isEqualTo(y);
};
