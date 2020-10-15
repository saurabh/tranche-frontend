import { SubmissionError } from 'redux-form';
import { isLessThan, isGreaterThan } from './helperFunctions';
import { calcMinCollateralAmount, calcMaxBorrowedAmount } from 'services/contractMethods';

const validate = (values) => {
  const { borrowedAskAmount, collateralAmount, rpbRate } = values;
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
  return errors;
};

const required = (value) => (value ? undefined : 'Required');
const number = (value) =>
  value && isNaN(Number(value)) ? 'Must be a number' : undefined;
const minValue = (min) => (value) =>
  value && value <= min ? `Must be at least ${min}%` : undefined;
const minValue0 = minValue(0);
const maxValue = (max) => (value) =>
  value && value >= max ? `Must be ${max}% at most` : undefined;
const maxValue100 = maxValue(100);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

let submitValidations = async (values) => {
  return sleep(0).then(async () => {
    let { borrowedAskAmount, collateralAmount, pairId } = values;
    let minCollateralAmount = await calcMinCollateralAmount(pairId, borrowedAskAmount);
    let maxBorrowedAskAmount = await calcMaxBorrowedAmount(pairId, collateralAmount);
    if (borrowedAskAmount && (!collateralAmount || isLessThan(collateralAmount, minCollateralAmount))) {
      throw new SubmissionError({
        borrowedAskAmount: 'Ask amount is too high',
        _error: 'Create New Loan failed!'
      })
    }
    if (collateralAmount && (!borrowedAskAmount || isGreaterThan(borrowedAskAmount, maxBorrowedAskAmount))) {
      throw new SubmissionError({
        collateralAmount: 'Not enough collateral',
        _error: 'Create New Loan failed!'
      })
    }
  })
};

let asyncValidate = (values) => {
  return sleep(0).then(async () => {
    let { borrowedAskAmount, collateralAmount, pairId } = values;
    let minCollateralAmount = borrowedAskAmount ? await calcMinCollateralAmount(pairId, borrowedAskAmount) : undefined;
    let maxBorrowedAskAmount = collateralAmount ? await calcMaxBorrowedAmount(pairId, collateralAmount) : undefined;
    console.log(isLessThan(collateralAmount, minCollateralAmount))
    console.log(collateralAmount && (!borrowedAskAmount || isGreaterThan(borrowedAskAmount, maxBorrowedAskAmount)))
    if (borrowedAskAmount && (!collateralAmount || isLessThan(collateralAmount, minCollateralAmount))) {
      throw { collateralAmount: 'Not enough collateral', _error: 'Not enough collateral' }
    }
    if (collateralAmount && (!borrowedAskAmount || isGreaterThan(borrowedAskAmount, maxBorrowedAskAmount))) {
      throw { borrowedAskAmount: 'Ask amount is too high', _error: 'Ask amount is too high' }
    }
  })
};

export { required, number, minValue0, maxValue100, submitValidations, validate, asyncValidate };
