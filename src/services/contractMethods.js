import moment from 'moment';
import {
  JLoanSetup,
  JLoanHelperSetup,
  JPriceOracleSetup,
  JTrancheTokenSetup,
  JProtocolSetup,
  JCompoundSetup,
  StakingSetup,
  YieldFarmSetup,
  ERC20Setup
} from 'utils/contractConstructor';
import store from '../redux/store';
import { isGreaterThan, isEqualTo } from 'utils/helperFunctions';
import { pairData, LoanContractAddress, factoryFees, epochDuration, txMessage } from 'config';
import { ApproveBigNumber } from 'config';

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
      const result = await JLoanHelper.methods.calculateCollFeesOnActivation(collateralAmount, factoryFees.toString()).call();
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
      const result = await JLoan.methods.getMinCollateralWithFeesAmount(pairId, web3.utils.toWei(askAmount)).call();
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
      const result = await JLoan.methods.calcRatioAdjustingCollateral(loanId, toWei(amount), actionType).call();
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
    const result = await JProtocol.methods.getTotalLoansAccruedInterest(trancheId, startIndex, stopIndex).call();
    return result;
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

export const allowanceCheck = async (tokenAddress, contractAddress, userAddress) => {
  try {
    const state = store.getState();
    const { web3, tokenBalance } = state.ethereum;
    const token = ERC20Setup(web3, tokenAddress);
    let userAllowance = await token.methods.allowance(userAddress, contractAddress).call();
    if (isGreaterThan(userAllowance, tokenBalance[tokenAddress]) || isEqualTo(userAllowance, tokenBalance[tokenAddress])) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

export const buyTrancheTokens = async (contractAddress, trancheId, type, depositEth) => {
  try {
    const state = store.getState();
    const { web3, address, notify } = state.ethereum;
    let { depositAmount } = state.form.earn.values;
    const JCompound = JCompoundSetup(web3, contractAddress);
    depositAmount = toWei(depositAmount);
    let depositAmountInEth = depositEth ? depositAmount : 0; 
    if (type === 'TRANCHE_A') {
      await JCompound.methods
        .buyTrancheAToken(trancheId, depositAmount)
        .send({ value: depositAmountInEth, from: address })
        .on('transactionHash', (hash) => {
          const { emitter } = notify.hash(hash);
          emitter.on('txPool', (transaction) => {
            return {
              message: txMessage(transaction.hash)
            };
          });
        });
    } else {
      await JCompound.methods
        .buyTrancheBToken(trancheId, depositAmount)
        .send({ value: depositAmountInEth, from: address })
        .on('transactionHash', (hash) => {
          const { emitter } = notify.hash(hash);
          emitter.on('txPool', (transaction) => {
            return {
              message: txMessage(transaction.hash)
            };
          });
        });
    }
  } catch (error) {
    console.error(error);
  }
};

export const sellTrancheTokens = async (contractAddress, trancheId, type) => {
  try {
    const state = store.getState();
    const { web3, address, notify } = state.ethereum;
    let { withdrawAmount } = state.form.earn.values;
    const JCompound = JCompoundSetup(web3, contractAddress);
    withdrawAmount = toWei(withdrawAmount);
    if (type === 'TRANCHE_A') {
      await JCompound.methods
        .redeemTrancheAToken(trancheId, withdrawAmount)
        .send({ from: address })
        .on('transactionHash', (hash) => {
          const { emitter } = notify.hash(hash);
          emitter.on('txPool', (transaction) => {
            return {
              message: txMessage(transaction.hash)
            };
          });
        });
    } else {
      await JCompound.methods
        .redeemTrancheBToken(trancheId, withdrawAmount)
        .send({ from: address })
        .on('transactionHash', (hash) => {
          const { emitter } = notify.hash(hash);
          emitter.on('txPool', (transaction) => {
            return {
              message: txMessage(transaction.hash)
            };
          });
        });
    }
  } catch (error) {
    console.error(error);
  }
};

// Staking Functions

export const stakingAllowanceCheck = async (tokenAddress, contractAddress, userAddress) => {
  try {
    const state = store.getState();
    const { web3, tokenBalance } = state.ethereum;
    const token = ERC20Setup(web3, tokenAddress);
    let userAllowance = await token.methods.allowance(userAddress, contractAddress).call();
    if (isGreaterThan(userAllowance, tokenBalance[tokenAddress]) || isEqualTo(userAllowance, tokenBalance[tokenAddress])) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

export const epochTimeRemaining = async (stakingAddress) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
    const Staking = StakingSetup(web3, stakingAddress);
    let result = await Staking.methods.currentEpochMultiplier().call();
    result = (result / 10 ** 18) * epochDuration;
    let timeRemaining = moment
      .duration(result, 'seconds')
      .humanize()
      .split(' ')
      .map((word) => {
        return word[0].toUpperCase() + word.substring(1);
      })
      .join(' ');
    return timeRemaining;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const getAccruedStakingRewards = async (yieldfarmAddress, address) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
    const YieldFarm = YieldFarmSetup(web3, yieldfarmAddress);
    const result = await YieldFarm.methods.getTotalAccruedRewards(address).call();
    return fromWei(result);
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const addStake = async (stakingAddress, tokenAddress) => {
  try {
    const state = store.getState();
    const { web3, address, notify } = state.ethereum;
    let { amount } = state.form.stake.values;
    const StakingContract = StakingSetup(web3, stakingAddress);
    amount = toWei(amount.toString());
    await StakingContract.methods
      .deposit(tokenAddress, amount)
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

export const withdrawStake = async (stakingAddress, tokenAddress) => {
  try {
    const state = store.getState();
    const { web3, address, notify } = state.ethereum;
    let { amount } = state.form.stake.values;
    const StakingContract = StakingSetup(web3, stakingAddress);
    amount = toWei(amount.toString());
    await StakingContract.methods
      .withdraw(tokenAddress, amount)
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

export const massHarvest = async (yieldfarmAddress) => {
  try {
    const state = store.getState();
    const { web3, address, notify } = state.ethereum;
    const YieldFarm = YieldFarmSetup(web3, yieldfarmAddress);
    await YieldFarm.methods
      .massHarvest()
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
