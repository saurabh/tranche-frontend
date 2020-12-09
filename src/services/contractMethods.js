import { JLoanSetup, JLoanHelperSetup, JPriceOracleSetup } from 'utils/contractConstructor';
import { web3 as alchemyWeb3 } from 'utils/getWeb3';
import { factoryFees } from 'config';
// const JLoan = JLoanSetup(web3);
// const JLoanHelper = JLoanHelperSetup(web3);
// const JPriceOracle = JPriceOracleSetup(web3);

export const toWei = alchemyWeb3.utils.toWei;
export const fromWei = alchemyWeb3.utils.fromWei;
export const toBN = alchemyWeb3.utils.toBN;

export const calculateFees = async (collateralAmount, web3) => {
  try {
    const JLoanHelper = JLoanHelperSetup(web3);
    if (collateralAmount) {
      const result = await JLoanHelper.methods
        .calculateCollFeesOnActivation(collateralAmount, factoryFees.toString())
        .call();
      return fromWei(result);
    }
  } catch (error) {
    console.error(error);
  }
};

export const calcMinCollateralAmount = async (pairId, askAmount, web3 = alchemyWeb3) => {
  try {
    const JLoan = JLoanSetup(web3);
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

export const calcMaxBorrowAmount = async (pairId, collAmount, web3 = alchemyWeb3) => {
  try {
    const JLoan = JLoanSetup(web3);
    if (collAmount > 0) {
      const result = await JLoan.methods.getMaxStableCoinWithFeesAmount(pairId, collAmount).call();
      return web3.utils.fromWei(result);
    }
  } catch (error) {
    console.error(error);
  }
};

export const calcAdjustCollateralRatio = async (loanId, amount, actionType, web3 = alchemyWeb3) => {
  try {
    const JLoan = JLoanSetup(web3);
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

export const getPairDetails = async (pairId, web3) => {
  try {
    const JPriceOracle = JPriceOracleSetup(web3);
    const result = await JPriceOracle.methods.pairs(pairId).call();
    const pairValue = await JPriceOracle.methods.getPairValue(pairId).call();
    return {
      baseDecimals: result.baseDecimals,
      quoteDecimals: result.quoteDecimals,
      pairDecimals: result.pairDecimals,
      pairValue
    };
  } catch (error) {
    console.error(error);
  }
};

export const getLoanStatus = async (loanId, web3) => {
  try {
    const JLoan = JLoanSetup(web3);
    let onChainStatus = await JLoan.methods.getLoanStatus(loanId).call();
    return parseInt(onChainStatus);
  } catch (error) {
    console.error(error);
  }
};

export const getLoanForeclosingBlock = async (loanId, web3 = alchemyWeb3) => {
  try {
    const JLoan = JLoanSetup(web3);
    const result = await JLoan.methods.loanBlocks(loanId).call();
    return Number(result.loanForeclosingBlock);
  } catch (error) {
    console.error(error);
  }
};

export const getAccruedInterests = async (loanId, web3 = alchemyWeb3) => {
  try {
    const JLoan = JLoanSetup(web3);
    const result = await JLoan.methods.getAccruedInterests(loanId).call();
    return web3.utils.fromWei(result);
  } catch (error) {
    console.error(error);
  }
};
