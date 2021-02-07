import { isLessThan } from './helperFunctions';
import {
  calcMinCollateralAmount,
  calcAdjustCollateralRatio,
  getShareholderShares
} from 'services/contractMethods';
import { generalParams } from 'config/constants';

const validateCreate = (values) => {
  const { borrowedAskAmount, collateralAmount, apy } = values;
  const errors = {};
  if (!borrowedAskAmount) {
    errors.borrowedAskAmount = 'Required';
  } else if (isNaN(Number(borrowedAskAmount))) {
    errors.borrowedAskAmount = 'Must be a number';
  }
  if (!collateralAmount) {
    errors.collateralAmount = 'Required';
  } else if (isNaN(Number(collateralAmount))) {
    errors.collateralAmount = 'Must be a number';
  }
  if (!apy) {
    errors.apy = 'Required';
  } else if (isNaN(Number(apy))) {
    errors.apy = 'Must be a number';
  }
  return errors;
};

const required = (value) => (value ? undefined : 'Required');
const number = (value) => (value && isNaN(Number(value)) ? 'Must be a number' : undefined);
const minValue = (min) => (value) =>
  value && value <= min ? `Must be at least ${min}%` : undefined;
const minValue0 = minValue(0);
const maxValue = (max) => (value) =>
  value && value >= max ? `Must be ${max}% at most` : undefined;
const maxValue100 = maxValue(100);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let asyncValidateCreate = (values) => {
  return sleep(0).then(async () => {
    let { borrowedAskAmount, collateralAmount, pairId } = values;
    let minCollateralAmount = borrowedAskAmount
      ? await calcMinCollateralAmount(pairId, borrowedAskAmount)
      : undefined;
    if (
      borrowedAskAmount &&
      (!collateralAmount || isLessThan(collateralAmount, minCollateralAmount))
    ) {
      // eslint-disable-next-line
      throw {
        collateralAmount: 'Not enough collateral',
        error: 'Not enough collateral'
      };
    }
  });
};

let asyncValidateAdjust = (values) => {
  return sleep(0).then(async () => {
    let { loanId, collateralAmount, actionType } = values;
    if (!actionType) {
      let newCollateralRatio = await calcAdjustCollateralRatio(
        loanId,
        collateralAmount,
        actionType
      );
      if (isLessThan(parseFloat(newCollateralRatio), generalParams.limitCollRatioForWithdraw)) {
        // eslint-disable-next-line
        throw {
          collateralAmount: 'New collateral ratio is below acceptable threshold',
          error: 'Ratio too low'
        };
      }
    }
  });
};

let asyncValidateSell = (values) => {
  return sleep(0).then(async () => {
    let { loanId, address, shares } = values;
    if (loanId) {
      const shareholderShares = await getShareholderShares(loanId, address);
      if (isLessThan(parseFloat(shareholderShares), parseFloat(shares))) {
        // eslint-disable-next-line
        throw {
          shares: "You don't own enough shares of this loan",
          error: 'Not enough shares'
        };
      }
    }
  });
};

export {
  required,
  number,
  minValue0,
  maxValue100,
  validateCreate,
  asyncValidateCreate,
  asyncValidateAdjust,
  asyncValidateSell
};
