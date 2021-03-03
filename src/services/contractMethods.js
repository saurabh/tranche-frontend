import {
  JLoanSetup,
  JLoanHelperSetup,
  JPriceOracleSetup,
  JTrancheTokenSetup,
  JProtocolSetup,
  StakingSetup
} from 'utils/contractConstructor';
import store from '../redux/store';
import { isGreaterThan, isEqualTo } from 'utils/helperFunctions';
import { pairData, LoanContractAddress, factoryFees, txMessage } from 'config';

const state = store.getState();
const { web3 } = state.ethereum;
export const toWei = web3.utils.toWei;
export const fromWei = web3.utils.fromWei;
export const toBN = web3.utils.toBN;

export const loanAllowanceCheck = async (pairId, amount, collateral = false) => {
  try {
    const state = store.getState();
    const { web3, address } = state.ethereum;
    amount = toWei(amount);
    const { lendTokenSetup, collateralTokenSetup } = pairData[pairId];
    const token = collateral ? collateralTokenSetup(web3) : lendTokenSetup(web3);
    let userAllowance = await token.methods.allowance(address, LoanContractAddress).call();
    if (isGreaterThan(userAllowance, amount) || isEqualTo(userAllowance, amount)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

export const calculateFees = async (collateralAmount) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
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

export const calcMinCollateralAmount = async (pairId, askAmount) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
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

export const calcMaxBorrowAmount = async (pairId, collAmount) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
    const JLoan = JLoanSetup(web3);
    if (collAmount > 0) {
      const result = await JLoan.methods.getMaxStableCoinWithFeesAmount(pairId, collAmount).call();
      return web3.utils.fromWei(result);
    }
  } catch (error) {
    console.error(error);
  }
};

export const calcAdjustCollateralRatio = async (loanId, amount, actionType) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
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

export const getPairDetails = async (pairId) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
    const JPriceOracle = JPriceOracleSetup(web3);
    const result = await JPriceOracle.methods.getPairDetails(pairId).call();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getLoanStatus = async (loanId) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
    const JLoan = JLoanSetup(web3);
    let onChainStatus = await JLoan.methods.loanStatus(loanId).call();
    return parseInt(onChainStatus);
  } catch (error) {
    console.error(error);
  }
};

export const getLoanForeclosingBlock = async (loanId) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
    const JLoan = JLoanSetup(web3);
    const result = await JLoan.methods.loanBlocks(loanId).call();
    return Number(result.loanForeclosingBlock);
  } catch (error) {
    console.error(error);
  }
};

export const getAccruedInterests = async (loanId) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
    const JLoan = JLoanSetup(web3);
    const result = await JLoan.methods.getAccruedInterests(loanId).call();
    return web3.utils.fromWei(result);
  } catch (error) {
    console.error(error);
  }
};

export const getShareholderShares = async (loanId, address) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
    const JLoan = JLoanSetup(web3);
    const result = await JLoan.methods.getShareholderShares(loanId, address).call();
    return result;
  } catch (error) {
    console.error(error);
  }
};

// Tranche Calls

export const getWithdrawableFunds = async (trancheAddress, address) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
    const TrancheToken = JTrancheTokenSetup(web3, trancheAddress);
    const result = await TrancheToken.methods.withdrawableFundsOf(address).call();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getTrancheParameters = async (trancheId) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
    const JProtocol = JProtocolSetup(web3);
    const result = await JProtocol.methods.trancheParameters(trancheId).call();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getLoansAccruedInterest = async (trancheId, startIndex, stopIndex) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
    const JProtocol = JProtocolSetup(web3);
    const result = await JProtocol.methods
      .getTotalLoansAccruedInterest(trancheId, startIndex, stopIndex)
      .call();
  } catch (error) {
    console.error(error);
  }
};

export const collectLoansAccruedInterest = async (trancheId, startIndex, stopIndex) => {
  try {
    const state = store.getState();
    const { web3, address, notify } = state.ethereum;
    const JProtocol = JProtocolSetup(web3);
    await JProtocol.methods
      .getTrancheAccruedInterests(trancheId, startIndex, stopIndex)
      .send({ from: address })
      .on('transactionHash', (hash) => {
        const { emitter } = notify.hash(hash);
        emitter.on('txPool', (transaction) => {
          return {
            message: txMessage(transaction.hash)
          };
        });
      });
  } catch (error) {
    console.error(error);
  }
};

export const sendValueToTranche = async (trancheId) => {
  try {
    const state = store.getState();
    const { web3, address, notify } = state.ethereum;
    const JProtocol = JProtocolSetup(web3);
    await JProtocol.methods
      .sendValueToTrancheTokens(trancheId)
      .send({ from: address })
      .on('transactionHash', (hash) => {
        const { emitter } = notify.hash(hash);
        emitter.on('txPool', (transaction) => {
          return {
            message: txMessage(transaction.hash)
          };
        });
      });
  } catch (error) {
    console.error(error);
  }
};

// Staking Functions

export const getAccruedStakingRewards = async (tokenAddress) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
    const Staking = StakingSetup(web3);
    const result = await Staking.methods.getTotalReward(tokenAddress).call();
    return result;
  } catch (error) {
    console.error(error);
  }
};