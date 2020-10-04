import ReactHtmlParser from 'react-html-parser';
import BigNumber from "bignumber.js";

export const readyToTransact = async (wallet, onboard) => {
  if (!wallet) {
    const walletSelected = await onboard.walletSelect();
    if (!walletSelected) return false;
  }

  const ready = await onboard.walletCheck();
  return ready;
};

export const addrShortener = (addr) => {
  if (addr) {
    return ReactHtmlParser(
      addr.substring(0, 5) +
        '...' +
        addr.substring(addr.length - 4, addr.length)
    );
  } else return 'Connect';
};

export const statusShortner = (status) => {
  return ReactHtmlParser(
    status.substring(0, 12) + (status.length >= 12 ? '.' : '')
  );
};

// Big Number Functions

export const safeAdd = function (a, b) {
  let x = new BigNumber(a);
  let y = new BigNumber(b);
  return x.plus(y);
}
export const safeSubtract = function (a, b) {
  let x = new BigNumber(a);
  let y = new BigNumber(b);
  return x.minus(y);
}
export const safeDivide = function (a, b) {
  let x = new BigNumber(a);
  let y = new BigNumber(b);
  return x.dividedBy(y);
}
export const safeMultiply = function (a, b) {
  let x = new BigNumber(a);
  let y = new BigNumber(b);
  return x.multipliedBy(y);
}
export const valueOf = function (a) {
  return a.valueOf();
}
export const isGreaterThan = function (a, b) {
  let x = new BigNumber(a);
  let y = new BigNumber(b);
  return x.isGreaterThan(y);
}
export const isLessThan = function (a, b) {
  let x = new BigNumber(a);
  let y = new BigNumber(b);
  return x.isLessThan(y);
}
export const isGreaterThanOrEqualTo = function (a, b) {
  let x = new BigNumber(a);
  let y = new BigNumber(b);
  return x.isGreaterThanOrEqualTo(y);
}
export const isLessThanOrEqualTo = function (a, b) {
  let x = new BigNumber(a);
  let y = new BigNumber(b);
  return x.isLessThanOrEqualTo(y);
}
export const toFixed = function (a, b) {
  let x = new BigNumber(a);
  return x.toFixed(b);
}
export const toFixedNew = function (a, b) {
  a=a.toString();
  let str = a.split(".");
  let str1 = str[0];
  let str2 = str[1];
  if (str2) {
    if (str2.length > b) {
      str2 = str2.slice(0, b);
    }
    else {
      let numofzero = b - str2.length;
      str2 += '0'.repeat(numofzero);
    }
  } else {
    str2 = '0000';
  }
  return str1 + '.' + str2;
}
export const isEqualTo = function (a, b) {
  let x = new BigNumber(a);
  let y = new BigNumber(b);
  return x.isEqualTo(y);
}