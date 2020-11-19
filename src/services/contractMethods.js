import { JFactorySetup, JLoanSetup, JPriceOracleSetup } from 'utils/contractConstructor';
import { web3 } from 'utils/getWeb3';
const JFactory = JFactorySetup(web3);
const JPriceOracle = JPriceOracleSetup(web3);

export const toWei = web3.utils.toWei;
export const fromWei = web3.utils.fromWei;

export const calcMinCollateralAmount = async (pairId, askAmount) => {
  try {
    if (askAmount !== '' && askAmount !== 0) {
      const result = await JFactory.methods
        .calcMinCollateralWithFeesAmount(pairId, web3.utils.toWei(askAmount))
        .call();
      return web3.utils.fromWei(result);
    }
  } catch (error) {
    console.error(error);
  }
};

export const calcMaxBorrowedAmount = async (pairId, collAmount) => {
  try {
    if (collAmount > 0) {
      // const result = await JFactory.methods
      //   .calcMinCollateralWithFeesAmount(pairId, web3.utils.toWei(collAmount))
      //   .call();
      // return web3.utils.fromWei(result);
    }
  } catch (error) {
    console.error(error);
  }
};

export const calcAdjustCollateralRatio = async (contractAddress, loanId, amount, actionType) => {
  try {
    if (amount !== '' && amount !== 0) {
      const JLoan = JLoanSetup(web3, contractAddress);
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

export const getLoanStatus = async (contractAddress, loanId) => {
  try {
    const JLoan = JLoanSetup(web3, contractAddress);
    let onChainStatus = await JLoan.methods.getLoanStatus(loanId).call();
    return parseInt(onChainStatus);
  } catch (error) {
    console.error(error);
  }
};

export const getLoanForeclosingBlock = async (contractAddress, loanId) => {
  try {
    const JLoan = JLoanSetup(web3, contractAddress);
    const result = await JLoan.methods.loanForeclosingBlock(loanId).call();
    return Number(result);
  } catch (error) {
    console.error(error);
  }
};

export const shareholderCheck = async (contractAddress, loanId, address) => {
  try {
    const JLoan = JLoanSetup(web3, contractAddress);
    const result = await JLoan.methods.isShareholder(loanId, address).call();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getAccruedInterests = async (contractAddress, loanId) => {
  try {
    const JLoan = JLoanSetup(web3, contractAddress);
    const result = await JLoan.methods.getAccruedInterests(loanId).call();
    return web3.utils.fromWei(result);
  } catch (error) {
    console.error(error);
  }
};
