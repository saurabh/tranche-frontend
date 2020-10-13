import { SubmissionError } from 'redux-form';
import { isLessThan, isGreaterThan } from './helperFunctions';
import { calcMinCollateralAmount, calcMaxBorrowedAmount } from 'services/contractMethods';

const validate = (values) => {
  const { borrowedAskAmount, collateralAmount, rpbRate } = values;
  const errors = {};
  if (!borrowedAskAmount) errors.borrowedAskAmount = 'Required';
  if (borrowedAskAmount && NaN) errors.borrowedAskAmount = 'Must be a number';
  if (!collateralAmount) errors.collateralAmount = 'Required';
  if (collateralAmount && NaN) errors.collateralAmount = 'Must be a number';
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

let submitValidations = async (values) => {
  let { borrowedAskAmount, collateralAmount, maxBorrowedAskAmount, minCollateralAmount } = values;

  return new Promise((resolve, reject) => {
    if (isLessThan(collateralAmount, minCollateralAmount)) {
      reject(
        new SubmissionError({
          borrowedAskAmount: 'Ask amount is too high',
          _error: 'Create New Loan failed!'
        })
      );
    } else if (isGreaterThan(borrowedAskAmount, maxBorrowedAskAmount)) {
      reject(
        new SubmissionError({
          collateralAmount: 'Not enough collateral',
          _error: 'Create New Loan failed!'
        })
      );
    } else {
      resolve();
    }
  });
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

let asyncValidate = (values) => {
  return sleep(0).then(async () => {
    console.log(values)
    let { borrowedAskAmount, collateralAmount, pairId } = values;
    let minCollateralAmount = await calcMinCollateralAmount(pairId, borrowedAskAmount);
    let maxBorrowedAskAmount = await calcMaxBorrowedAmount(pairId, collateralAmount);
    if (borrowedAskAmount && (!collateralAmount || isLessThan(collateralAmount, minCollateralAmount))) {
      throw { collateralAmount: 'Not enough collateral' }
    }
    if (collateralAmount && (!borrowedAskAmount || isGreaterThan(borrowedAskAmount, maxBorrowedAskAmount))) {
      throw { borrowedAskAmount: 'Ask amount is too high' }
    }
  })
};

export { required, number, minValue0, maxValue100, submitValidations, validate, asyncValidate };
