import { JLoanSetup, JPriceOracleSetup } from 'utils/contractConstructor';
import { web3 } from 'utils/getWeb3';
const JLoan = JLoanSetup(web3)
const JPriceOracle = JPriceOracleSetup(web3);

export const toWei = web3.utils.toWei;
export const fromWei = web3.utils.fromWei;

export const calcMinCollateralAmount = async (pairId, askAmount) => {
  try {
    if (askAmount !== '' && askAmount !== 0) {
      const result = await JLoan.methods
        .getMinCollateralWithFeesAmount(pairId, web3.utils.toWei(askAmount))
        .call();
      return web3.utils.fromWei(result);
    }
  } catch (error) {
    console.error(error);
  }
};

export const calcMaxBorrowAmount = async (pairId, collAmount) => {
  try {
    if (collAmount > 0) {
      const result = await JLoan.methods
        .getMaxStableCoinWithFeesAmount(pairId, collAmount)
        .call();
      return web3.utils.fromWei(result);
    }
  } catch (error) {
    console.error(error);
  }
};

export const calcAdjustCollateralRatio = async (loanId, amount, actionType) => {
  try {
    if (amount !== '' && amount !== 0) {
      const result = await JLoan.methods
        .calcRatioAdjustingCollateral(loanId, toWei(amount), actionType)
        .call();
      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

export const getPairDetails = async (pairId) => {
  try {
    const result = await JPriceOracle.methods.pairs(pairId).call();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getLoanStatus = async (loanId) => {
  try {
    let onChainStatus = await JLoan.methods.getLoanStatus(loanId).call();
    return parseInt(onChainStatus);
  } catch (error) {
    console.error(error);
  }
};

export const getLoanForeclosingBlock = async (loanId) => {
  try {
    const result = await JLoan.methods.loanForeclosingBlock(loanId).call();
    return Number(result);
  } catch (error) {
    console.error(error);
  }
};

export const shareholderCheck = async (loanId, address) => {
  try {
    const result = await JLoan.methods.isShareholder(loanId, address).call();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getAccruedInterests = async (loanId) => {
  try {
    const result = await JLoan.methods.getAccruedInterests(loanId).call();
    return web3.utils.fromWei(result);
  } catch (error) {
    console.error(error);
  }
};
