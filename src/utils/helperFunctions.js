import ReactHtmlParser from 'react-html-parser';
import BigNumber from 'bignumber.js';
import moment  from 'moment';
import { gweiVariants, tokenDecimals } from 'config/constants';

export const searchTokenDecimals = (key) => tokenDecimals.find((i) => i.key === key);

export const readyToTransact = async (wallet, onboard) => {
  if (!wallet) {
    const walletSelected = await onboard.walletSelect();
    if (!walletSelected) return false;
  }
  const ready = await onboard.walletCheck();
  return ready;
};

export const addrShortener = (addr) => {
  if (addr && addr.length > 5) {
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

const singularOrPlural = (num, string) => {
  return num === 1 ? num + string : num + string + 's';
}

export const formatTime = (value) =>{
  // let format = (val) => moment().add(value, 'seconds').diff(moment(), val);
  // let years =  format('years');
  // let months =  format('months');
  // let weeks =  format('weeks');
  // let days =  format('days');
  // let hours =  format('hours');
  // let minutes = format('minutes');
  // return years !== 0 ? singularOrPlural(years, ' year') : months !== 0 ? singularOrPlural(months, ' month') : weeks !== 0 ? singularOrPlural(weeks, ' week') : days !== 0 ? singularOrPlural(days, ' day') : hours !== 0 ? singularOrPlural(hours, ' hour') : minutes !== 0 ? singularOrPlural(minutes, ' minute') : ""
  
  const minutes = moment().add(value, 'seconds').diff(moment(), 'minutes');
  if (minutes < 60) {
    return singularOrPlural(minutes, ' minute');
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24)
  {
    return singularOrPlural(hours, ' hour');
  }
  const days = Math.floor(hours / 24);
  if (days < 31)
  {
    return singularOrPlural(days, ' day');
  }
  const months = Math.floor(days / 30)
  if (months < 12)
  {
    return singularOrPlural(months, ' month');
  } 
  return singularOrPlural(Math.floor(months / 12), ' year');
}

export const round = (type, input, roundTo) => {
  try {
    let result = safeMultiply(input, 10 ** roundTo);
    if (type === 'up') result = Math.ceil(result);
    if (type === 'down') result = Math.floor(result);
    result = safeDivide(result, 10 ** roundTo);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const roundNumber = (input, roundTo, type = false) => {
  try {
    if (input === 'N/A') return;
    if (typeof input === 'string') input = Number(input);
    let decimalPoints = 0;
    if (!roundTo && input % 10 !== 0) {
      const value = Math.floor(input);
      decimalPoints = input % 1 === 0 ? 0 : Math.max(5 - `${ value === 0 ? '' : value }`.length, 0);
    } else decimalPoints = roundTo;
    if (type) {
      let result = safeMultiply(input, 10 ** decimalPoints);
      if (type === 'up') {
        if (Number(result.toString().split('.')[0]) === Math.ceil(result)) result = safeAdd(result, 0.1);
        result = Math.ceil(result);
      }
      if (type === 'down') result = Math.floor(result);
      result = safeDivide(result, 10 ** decimalPoints);
      return result;
    }
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimalPoints,
      maximumFractionDigits: decimalPoints
    });
    return formatter.format(input);
  } catch (error) {
    console.error(error);
  }
};

export const gweiOrEther = (input, cryptoName) => {
  try {
    if (cryptoName === 'ETH') {
      if (input <= 0.0001) {
        return 'Gwei';
      } else return 'ETH';
    } else if (cryptoName === 'SLICE') {
      if (input <= 0.00099) {
        return 'nSLICE';
      } else return 'SLICE';
    } else if (cryptoName === 'DAI') {
      if (input <= 0.00099) {
        return 'nDAI';
      } else return 'DAI';
    } else if (cryptoName === 'USDC') {
      if (input <= 0.00099) {
        return 'nUSDC';
      } else return 'USDC';
    }
  } catch (error) {
    console.error(error);
  }
};

export const roundBasedOnUnit = (input, cryptoName, roundTo) => {
  try {
    if (gweiVariants.indexOf(gweiOrEther(input, cryptoName)) !== -1) {
      input *= 10 ** 9;
    }
    const result = roundNumber(input, roundTo);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const formatString = (input) => {
  try {
    let array = input.split(',');
    let result = array[0];
    for (let i = 1; i < array.length; i++) {
      result += array[i];
    }
    return result;
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
