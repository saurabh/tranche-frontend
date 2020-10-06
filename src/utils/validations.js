import { SubmissionError } from 'redux-form'
import { isLessThan, isGreaterThan } from './helperFunctions'

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

let submitValidations = (values, submitCheck) => {
  console.log(values)
  console.log(submitCheck)
  let { borrowedAskAmount, collateralAmount, rpbRate } = values;
  let { maxBorrowedAskAmount, minCollateralAmount } = submitCheck;
  let minRpbRate = 10**9;

  return sleep(1).then(() => {
    if (isLessThan(collateralAmount, minCollateralAmount)) {
      throw new SubmissionError({
        borrowedAskAmount: "Ask amount is too high",
        _error: 'Create New Loan failed!'
      })
    } else if (isGreaterThan(borrowedAskAmount, maxBorrowedAskAmount)) {
      throw new SubmissionError({
        collateralAmount: "Not enough collateral",
        _error: 'Create New Loan failed!'
      })
    } else {

    }
  })
}

export { required, number, minValue0, maxValue100, submitValidations }