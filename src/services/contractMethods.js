import {
  JLoanSetup,
  JLoanHelperSetup,
  JPriceOracleSetup,
  JCompoundSetup,
  StakingSetup,
  LockupSetup,
  YieldFarmSetup,
  ERC20Setup
} from 'utils/contractConstructor';
import store from '../redux/store';
import { isGreaterThan, isEqualTo } from 'utils/helperFunctions';
import { analyticsTrack } from 'analytics/googleAnalytics';
import { web3, safeMultiply } from 'utils';
import {
  pairData,
  LoanContractAddress,
  factoryFees,
  epochDuration,
  txMessage,
  ApproveBigNumber,
  tokenDecimals,
  ETHorMaticCheck,
  networkId,
  maticNetworkId
} from 'config';
import { setTxLoading, addNotification, setNotificationCount, updateNotification, toggleApproval } from 'redux/actions/ethereum';
import { setMigrateStep, setMigrateLoading } from 'redux/actions/tableData';

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

// Tranches

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
  console.log(contractAddress, trancheId, trancheType, cryptoType)
  const state = store.getState();
  const { web3, address, notify, network, notificationCount } = state.ethereum;
  let id = notificationCount;
  store.dispatch(setNotificationCount(notificationCount + 1));
  try {
    let { depositAmount } = state.form.tranche.values;
    const JCompound = JCompoundSetup(web3, contractAddress);
    depositAmount = searchArr(cryptoType) ? safeMultiply(depositAmount, 10 ** searchArr(cryptoType).decimals) : toWei(depositAmount);
    let depositAmountInEth = ETHorMaticCheck.indexOf(cryptoType) !== -1 ? depositAmount : 0;
    store.dispatch(
      addNotification({
        id,
        type: 'WAITING',
        message: 'Your transaction is waiting for you to confirm',
        title: 'awaiting confirmation'
      })
    );
    if (trancheType === 'TRANCHE_A') {
      console.log('tranche a condition', network)
      await JCompound.methods
        .buyTrancheAToken(trancheId, depositAmount)
        .send({ value: depositAmountInEth, from: address })
        .on('transactionHash', (hash) => {
          if (network === networkId) {
            // notifyEmitter(hash);
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              return {
                message: txMessage(transaction.hash)
              };
            });
          } else if (network === maticNetworkId) {
            store.dispatch(
              updateNotification({
                id,
                type: 'PENDING',
                message: txMessage(hash),
                title: 'pending transaction'
              })
            );
          }
        })
        .on('confirmation', (count) => {
          if (count === 0) {
            store.dispatch(setTxLoading(false));
            analyticsTrack('Tracking user activity', 'Tranche Markets', {
              address: address,
              trancheType: trancheType,
              deposit: depositAmount + cryptoType
            });
            network === maticNetworkId &&
              store.dispatch(
                updateNotification({
                  id,
                  type: 'SUCCESS',
                  message: 'Your transaction has succeeded',
                  title: 'successful transaction'
                })
              );
          }
        });
    } else {
      console.log('tranche a tranche b condition', network)
      await JCompound.methods
        .buyTrancheBToken(trancheId, depositAmount)
        .send({ value: depositAmountInEth, from: address })
        .on('transactionHash', (hash) => {
          if (network === networkId) {
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              return {
                message: txMessage(transaction.hash)
              };
            });
          } else if (network === maticNetworkId) {
            store.dispatch(
              updateNotification({
                id,
                type: 'PENDING',
                message: txMessage(hash),
                title: 'pending transaction'
              })
            );
          }
        })
        .on('confirmation', (count) => {
          if (count === 0) {
            store.dispatch(setTxLoading(false));
            analyticsTrack('Tracking user activity', 'Tranche Markets', {
              address: address,
              trancheType: trancheType,
              deposit: depositAmount + cryptoType
            });
            network === maticNetworkId &&
              store.dispatch(
                updateNotification({
                  id,
                  type: 'SUCCESS',
                  message: 'Your transaction has succeeded',
                  title: 'successful transaction'
                })
              );
          }
        });
    }
  } catch (error) {
    console.log(error)
    error.code === 4001 && console.error(error);
  }
};

export const sellTrancheTokens = async (contractAddress, trancheId, trancheType) => {
  const state = store.getState();
  const { web3, address, notify, network, notificationCount } = state.ethereum;
  let id = notificationCount;
  store.dispatch(setNotificationCount(notificationCount + 1));
  try {
    let { withdrawAmount } = state.form.tranche.values;
    withdrawAmount = toWei(withdrawAmount);
    const JCompound = JCompoundSetup(web3, contractAddress);
    store.dispatch(
      addNotification({
        id,
        type: 'WAITING',
        message: 'Your transaction is waiting for you to confirm',
        title: 'awaiting confirmation'
      })
    );
    if (trancheType === 'TRANCHE_A') {
      await JCompound.methods
        .redeemTrancheAToken(trancheId, withdrawAmount)
        .send({ from: address })
        .on('transactionHash', (hash) => {
          if (network === networkId) {
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              return {
                message: txMessage(transaction.hash)
              };
            });
          } else if (network === maticNetworkId) {
            store.dispatch(
              updateNotification({
                id,
                type: 'PENDING',
                message: txMessage(hash),
                title: 'pending transaction'
              })
            );
          }
        })
        .on('confirmation', (count) => {
          if (count === 0) {
            store.dispatch(setTxLoading(false));
            analyticsTrack('Tracking user activity', 'Tranche Markets', { address: address, trancheType: trancheType, withdrawn: withdrawAmount });
            network === maticNetworkId &&
              store.dispatch(
                updateNotification({
                  id,
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
          if (network === networkId) {
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              return {
                message: txMessage(transaction.hash)
              };
            });
          } else if (network === maticNetworkId) {
            store.dispatch(
              updateNotification({
                id,
                type: 'PENDING',
                message: txMessage(hash),
                title: 'pending transaction'
              })
            );
          }
        })
        .on('confirmation', (count) => {
          if (count === 0) {
            store.dispatch(setTxLoading(false));
            analyticsTrack('Tracking user activity', 'Tranche Markets', { address: address, trancheType: trancheType, withdrawn: withdrawAmount });
            network === maticNetworkId &&
              store.dispatch(
                updateNotification({
                  id,
                  type: 'SUCCESS',
                  message: 'Your transaction has succeeded',
                  title: 'successful transaction'
                })
              );
          }
        });
    }
  } catch (error) {
    error.code === 4001 && console.error(error);
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

export const stakingApproveContract = async (e, contractAddress, tokenAddress, isApproved) => {
  const state = store.getState();
  const { web3, address, notify, notificationCount, txOngoing } = state.ethereum;
  if (txOngoing) e.stopPropogation();
  let id = notificationCount;
  setNotificationCount(notificationCount + 1);
  try {
    const token = ERC20Setup(web3, tokenAddress);
    addNotification({
      id,
      type: 'WAITING',
      message: 'Your transaction is waiting for you to confirm',
      title: 'awaiting confirmation'
    });
    await token.methods
      .approve(contractAddress, toWei(ApproveBigNumber))
      .send({ from: address })
      .on('transactionHash', (hash) => {
        store.dispatch(setTxLoading(true));
        const { emitter } = notify.hash(hash);
        emitter.on('txPool', (transaction) => {
          return {
            message: txMessage(transaction.hash)
          };
        });
        emitter.on('txCancel', () => store.dispatch(setTxLoading(false)));
        emitter.on('txFailed', () => store.dispatch(setTxLoading(false)));
      })
      .on('confirmation', () => {
        store.dispatch(toggleApproval(tokenAddress, contractAddress, !isApproved));
        store.dispatch(setTxLoading(false));
      });
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
    return result;
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

export const addStake = async (stakingAddress, tokenAddress, durationIndex, migrate) => {
  const state = store.getState();
  const { web3, address, notify, network, notificationCount } = state.ethereum;
  let id = notificationCount;
  store.dispatch(setNotificationCount(notificationCount + 1));
  try {
    let { amount } = state.form.stake.values;
    console.log(durationIndex || durationIndex === 0 ? 'lockup' : 'milestones');
    const StakingContract = durationIndex || durationIndex === 0 ? LockupSetup(web3, stakingAddress) : StakingSetup(web3, stakingAddress);
    amount = toWei(amount.toString());
    store.dispatch(
      addNotification({
        id,
        type: 'WAITING',
        message: 'Your transaction is waiting for you to confirm',
        title: 'awaiting confirmation'
      })
    );
    const DepositMethod =
      durationIndex || durationIndex === 0
        ? StakingContract.methods.stake(amount, durationIndex)
        : StakingContract.methods.deposit(tokenAddress, amount);
    await DepositMethod.send({ from: address }).on('transactionHash', (hash) => {
      if (network === networkId) {
        const { emitter } = notify.hash(hash);
        emitter.on('txPool', (transaction) => {
          return {
            message: txMessage(transaction.hash)
          };
        });
        emitter.on('txConfirmed', () => {
          store.dispatch(setTxLoading(false));
          migrate && store.dispatch(setMigrateStep('done'));
          analyticsTrack('Tracking user activity', 'SLICE staking pool', { address: address, staked: amount });
        });
        emitter.on('txFailed', () => store.dispatch(setTxLoading(false)));
        emitter.on('txCancel', () => store.dispatch(setTxLoading(false)));
      }
    });
  } catch (error) {
    if (error.code === 4001) {
      store.dispatch(setMigrateLoading(false));
    }
    console.error(error);
  }
};

export const withdrawStake = async (stakingAddress, tokenAddress, maxAmount = false, migrate = false) => {
  const state = store.getState();
  const { web3, address, notify, network, notificationCount } = state.ethereum;
  let id = notificationCount;
  store.dispatch(setNotificationCount(notificationCount + 1));
  try {
    let amount = maxAmount ? await getUserStaked(stakingAddress, tokenAddress) : state.form.stake.values.amount;
    const StakingContract = StakingSetup(web3, stakingAddress);
    amount = toWei(amount.toString());
    if (amount !== '0') {
      store.dispatch(
        addNotification({
          id,
          type: 'WAITING',
          message: 'Your transaction is waiting for you to confirm',
          title: 'awaiting confirmation'
        })
      );
      await StakingContract.methods
        .withdraw(tokenAddress, amount)
        .send({ from: address })
        .on('transactionHash', (hash) => {
          if (network === networkId) {
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              return {
                message: txMessage(transaction.hash)
              };
            });
            emitter.on('txConfirmed', () => {
              store.dispatch(setTxLoading(false));
              migrate && store.dispatch(setMigrateStep('stake'));
              analyticsTrack('Tracking user activity', 'SLICE staking pool', { address: address, withdrawn: amount });
            });
            emitter.on('txFailed', () => store.dispatch(setTxLoading(false)));
            emitter.on('txCancel', () => store.dispatch(setTxLoading(false)));
          }
        });
    } else return;
  } catch (error) {
    if (error.code === 4001) {
      store.dispatch(setMigrateLoading(false));
    }
    console.log(error);
  }
};

export const claimRewards = async (contractAddress, stakingCounter, migrate = false) => {
  const state = store.getState();
  const { web3, address, notify, network, notificationCount } = state.ethereum;
  let id = notificationCount;
  store.dispatch(setNotificationCount(notificationCount + 1));
  try {
    console.log(stakingCounter || stakingCounter === 0 ? 'lockup' : 'yieldfarm');
    const RewardsContract = stakingCounter || stakingCounter === 0 ? LockupSetup(web3, contractAddress) : YieldFarmSetup(web3, contractAddress);
    store.dispatch(
      addNotification({
        id,
        type: 'WAITING',
        message: 'Your transaction is waiting for you to confirm',
        title: 'awaiting confirmation'
      })
    );
    const contractMethod =
      stakingCounter || stakingCounter === 0 ? RewardsContract.methods.claim(stakingCounter) : RewardsContract.methods.massHarvest();
    await contractMethod.send({ from: address }).on('transactionHash', (hash) => {
      if (network === networkId) {
        const { emitter } = notify.hash(hash);
        emitter.on('txPool', (transaction) => {
          return {
            message: txMessage(transaction.hash)
          };
        });
        emitter.on('txConfirmed', () => {
          migrate && store.dispatch(setMigrateStep('withdraw'));
          store.dispatch(setTxLoading(false));
        });
        emitter.on('txFailed', () => store.dispatch(setTxLoading(false)));
        emitter.on('txCancel', () => store.dispatch(setTxLoading(false)));
      }
    });
  } catch (error) {
    if (error.code === 4001) {
      store.dispatch(setMigrateLoading(false));
    }
    return error;
  }
};
