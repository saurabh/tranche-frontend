import moment from 'moment';
import { JLoanSetup, JLoanHelperSetup, JPriceOracleSetup, JCompoundSetup, StakingSetup, YieldFarmSetup, ERC20Setup } from 'utils/contractConstructor';
import store from '../redux/store';
import { notifyEmitter } from 'services/blocknative';
import { isGreaterThan, isEqualTo } from 'utils/helperFunctions';
import { web3 } from 'utils/getWeb3';
import {
  pairData,
  LoanContractAddress,
  factoryFees,
  epochDuration,
  txMessage,
  tokenDecimals,
  ETHorMaticCheck,
  networkId,
  maticNetworkId
} from 'config';
import { setTxLoading } from 'redux/actions/ethereum';
import { addNotification } from 'redux/actions/NotificationToggle';

const searchArr = (key) => tokenDecimals.find((i) => i.key === key);
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

export const trancheAllowanceCheck = async (tokenAddress, contractAddress, userAddress) => {
  try {
    const state = store.getState();
    const { web3, tokenBalance } = state.ethereum;
    const token = ERC20Setup(web3, tokenAddress);
    let userAllowance = await token.methods.allowance(userAddress, contractAddress).call();
    if ((isGreaterThan(userAllowance, tokenBalance[tokenAddress]) || isEqualTo(userAllowance, tokenBalance[tokenAddress])) && userAllowance !== '0') {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

export const buyTrancheTokens = async (contractAddress, trancheId, trancheType, cryptoType) => {
  try {
    const state = store.getState();
    const { web3, address, notify, network } = state.ethereum;
    let { depositAmount } = state.form.tranche.values;
    const JCompound = JCompoundSetup(web3, contractAddress);
    depositAmount = searchArr(cryptoType) ? toWei(depositAmount, 'Mwei') : toWei(depositAmount);
    let depositAmountInEth = ETHorMaticCheck.indexOf(cryptoType) !== -1 ? depositAmount : 0;
    if (trancheType === 'TRANCHE_A') {
      await JCompound.methods
        .buyTrancheAToken(trancheId, depositAmount)
        .send({ value: depositAmountInEth, from: address })
        .on('transactionHash', (hash) => {
          store.dispatch(setTxLoading(true));
          if (network === networkId) {
            // notifyEmitter(hash);
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              return {
                message: txMessage(transaction.hash)
              };
            });
            emitter.on('txConfirmed', () => store.dispatch(setTxLoading(false)));
            emitter.on('txFailed', () => store.dispatch(setTxLoading(false)));
            emitter.on('txCancel', () => store.dispatch(setTxLoading(false)));
          } else if (network === maticNetworkId) {
            store.dispatch(
              addNotification({
                type: 'PENDING',
                message: txMessage(hash),
                title: 'pending transaction'
              })
            );
          }
        })
        .on('confirmation', (count) => {
          count === 1 && store.dispatch(setTxLoading(false));
          if (network === maticNetworkId) {
            store.dispatch(
              addNotification({
                type: 'SUCCESS',
                message: 'Your transaction has succeeded',
                title: 'successful transaction'
              })
            );
          }
        });
    } else {
      await JCompound.methods
        .buyTrancheBToken(trancheId, depositAmount)
        .send({ value: depositAmountInEth, from: address })
        .on('transactionHash', (hash) => {
          store.dispatch(setTxLoading(true));
          if (network === networkId) {
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              return {
                message: txMessage(transaction.hash)
              };
            });
            emitter.on('txConfirmed', () => store.dispatch(setTxLoading(false)));
            emitter.on('txFailed', () => store.dispatch(setTxLoading(false)));
            emitter.on('txCancel', () => store.dispatch(setTxLoading(false)));
          } else if (network === maticNetworkId) {
            store.dispatch(
              addNotification({
                type: 'PENDING',
                message: txMessage(hash),
                title: 'pending transaction'
              })
            );
          }
        })
        .on('confirmation', (count) => {
          count === 1 && store.dispatch(setTxLoading(false));
          if (network === maticNetworkId) {
            store.dispatch(
              addNotification({
                type: 'SUCCESS',
                message: 'Your transaction has succeeded',
                title: 'successful transaction'
              })
            );
          }
        });
    }
  } catch (error) {
    console.error(error);
  }
};

export const sellTrancheTokens = async (contractAddress, trancheId, trancheType) => {
  try {
    const state = store.getState();
    const { web3, address, network, notify } = state.ethereum;
    let { withdrawAmount } = state.form.tranche.values;
    withdrawAmount = toWei(withdrawAmount);
    const JCompound = JCompoundSetup(web3, contractAddress);
    if (trancheType === 'TRANCHE_A') {
      await JCompound.methods
        .redeemTrancheAToken(trancheId, withdrawAmount)
        .send({ from: address })
        .on('transactionHash', (hash) => {
          store.dispatch(setTxLoading(true));
          if (network === networkId) {
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              return {
                message: txMessage(transaction.hash)
              };
            });
            emitter.on('txConfirmed', () => store.dispatch(setTxLoading(false)));
            emitter.on('txFailed', () => store.dispatch(setTxLoading(false)));
            emitter.on('txCancel', () => store.dispatch(setTxLoading(false)));
          } else if (network === maticNetworkId) {
            store.dispatch(
              addNotification({
                type: 'PENDING',
                message: txMessage(hash),
                title: 'pending transaction'
              })
            );
          }
        })
        .on('confirmation', (count) => {
          count === 1 && store.dispatch(setTxLoading(false));
          if (network === maticNetworkId) {
            store.dispatch(
              addNotification({
                type: 'SUCCESS',
                message: 'Your transaction has succeeded',
                title: 'successful transaction'
              })
            );
          }
        });
    } else {
      await JCompound.methods
        .redeemTrancheBToken(trancheId, withdrawAmount)
        .send({ from: address })
        .on('transactionHash', (hash) => {
          store.dispatch(setTxLoading(true));
          if (network === networkId) {
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              return {
                message: txMessage(transaction.hash)
              };
            });
            emitter.on('txConfirmed', () => store.dispatch(setTxLoading(false)));
            emitter.on('txFailed', () => store.dispatch(setTxLoading(false)));
            emitter.on('txCancel', () => store.dispatch(setTxLoading(false)));
          } else if (network === maticNetworkId) {
            store.dispatch(
              addNotification({
                type: 'PENDING',
                message: txMessage(hash),
                title: 'pending transaction'
              })
            );
          }
        })
        .on('confirmation', (count) => {
          count === 1 && store.dispatch(setTxLoading(false));
          if (network === maticNetworkId) {
            store.dispatch(
              addNotification({
                type: 'SUCCESS',
                message: 'Your transaction has succeeded',
                title: 'successful transaction'
              })
            );
          }
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

export const getUserStaked = async (stakingAddress, tokenAddress) => {
  try {
    const state = store.getState();
    const { web3, address } = state.ethereum;
    const Staking = StakingSetup(web3, stakingAddress);
    let result = await Staking.methods.balanceOf(address, tokenAddress).call();
    return fromWei(result);
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
    const { web3, address, network, notify } = state.ethereum;
    let { amount } = state.form.stake.values;
    const StakingContract = StakingSetup(web3, stakingAddress);
    amount = toWei(amount.toString());
    await StakingContract.methods
      .deposit(tokenAddress, amount)
      .send({ from: address })
      .on('transactionHash', (hash) => {
        store.dispatch(setTxLoading(true));
        if (network === networkId) {
          const { emitter } = notify.hash(hash);
          emitter.on('txPool', (transaction) => {
            return {
              message: txMessage(transaction.hash)
            };
          });
          emitter.on('txConfirmed', () => store.dispatch(setTxLoading(false)));
          emitter.on('txFailed', () => store.dispatch(setTxLoading(false)));
          emitter.on('txCancel', () => store.dispatch(setTxLoading(false)));
        }
      });
  } catch (error) {
    console.error(error);
  }
};

export const withdrawStake = async (stakingAddress, tokenAddress) => {
  try {
    const state = store.getState();
    const { web3, address, network, notify } = state.ethereum;
    let { amount } = state.form.stake.values;
    const StakingContract = StakingSetup(web3, stakingAddress);
    amount = toWei(amount.toString());
    await StakingContract.methods
      .withdraw(tokenAddress, amount)
      .send({ from: address })
      .on('transactionHash', (hash) => {
        store.dispatch(setTxLoading(true));
        if (network === networkId) {
          const { emitter } = notify.hash(hash);
          emitter.on('txPool', (transaction) => {
            return {
              message: txMessage(transaction.hash)
            };
          });
          emitter.on('txConfirmed', () => store.dispatch(setTxLoading(false)));
          emitter.on('txFailed', () => store.dispatch(setTxLoading(false)));
          emitter.on('txCancel', () => store.dispatch(setTxLoading(false)));
        }
      });
  } catch (error) {
    console.error(error);
  }
};

export const massHarvest = async (yieldfarmAddress) => {
  try {
    const state = store.getState();
    const { web3, address } = state.ethereum;
    const YieldFarm = YieldFarmSetup(web3, yieldfarmAddress);
    await YieldFarm.methods
      .massHarvest()
      .send({ from: address })
      .on('transactionHash', (hash) => {
        notifyEmitter(hash);
      });
  } catch (error) {
    console.error(error);
  }
};
