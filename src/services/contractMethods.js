import {
  JLoanSetup,
  JLoanHelperSetup,
  JPriceOracleSetup,
  JCompoundSetup,
  StakingSetup,
  LockupSetup,
  YieldFarmSetup,
  ERC20Setup,
  RewardDistributionSetup
} from 'utils/contractConstructor';
import store from '../redux/store';
import { isGreaterThan, isEqualTo, searchTokenDecimals } from 'utils/helperFunctions';
import { analyticsTrack } from 'analytics/googleAnalytics';
import { web3 } from 'utils/getWeb3';
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
  RewardDistributionAddress
} from 'config';
import {
  setTxLoading,
  addNotification,
  setNotificationCount,
  updateNotification,
  toggleApproval,
  checkSIRRewards,
  setTokenBalances
} from 'redux/actions/ethereum';
import { setMigrateStep, setMigrateLoading, setTxModalLoading, setTxOngoingData, setTxModalStatus, setTxLink } from 'redux/actions/tableData';

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
    return isGreaterThan(userAllowance, amount) || isEqualTo(userAllowance, amount);
  } catch (error) {
    console.error(error);
  }
};

export const calculateFees = async (collateralAmount) => {
  try {
    if (collateralAmount) {
      const state = store.getState();
      const { web3 } = state.ethereum;
      const JLoanHelper = JLoanHelperSetup(web3);
      const result = await JLoanHelper.methods.calculateCollFeesOnActivation(collateralAmount, factoryFees.toString()).call();
      return fromWei(result);
    }
  } catch (error) {
    console.error(error);
  }
};

export const calcMinCollateralAmount = async (pairId, askAmount) => {
  try {
    if (askAmount !== '' && askAmount !== 0) {
      const state = store.getState();
      const { web3 } = state.ethereum;
      const JLoan = JLoanSetup(web3);
      const result = await JLoan.methods.getMinCollateralWithFeesAmount(pairId, web3.utils.toWei(askAmount)).call();
      return web3.utils.fromWei(result);
    }
  } catch (error) {
    console.error(error);
  }
};

export const calcMaxBorrowAmount = async (pairId, collAmount) => {
  try {
    if (collAmount > 0) {
      const state = store.getState();
      const { web3 } = state.ethereum;
      const JLoan = JLoanSetup(web3);
      const result = await JLoan.methods.getMaxStableCoinWithFeesAmount(pairId, collAmount).call();
      return web3.utils.fromWei(result);
    }
  } catch (error) {
    console.error(error);
  }
};

export const calcAdjustCollateralRatio = async (loanId, amount, actionType) => {
  try {
    if (amount !== '' && amount !== 0) {
      const state = store.getState();
      const { web3 } = state.ethereum;
      const JLoan = JLoanSetup(web3);
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
    return (
      (isGreaterThan(userAllowance, tokenBalance[tokenAddress]) || isEqualTo(userAllowance, tokenBalance[tokenAddress])) && userAllowance !== '0'
    );
  } catch (error) {
    console.error(error);
  }
};

export const approveContract = async (isDeposit, tokenAddress, contractAddress, isApproved, e) => {
  const state = store.getState();
  const { address, network, web3, txOngoing, notify } = state.ethereum;
  const { trancheCard } = state.data;
  if (txOngoing) e.stopPropogation();
  try {
    store.dispatch(setTxModalLoading(true));
    store.dispatch(setTxOngoingData({ isDeposit, trancheCardId: trancheCard.id }));
    store.dispatch(setTxModalStatus('confirm'));
    const amount = isApproved ? 0 : toWei(ApproveBigNumber);
    const token = ERC20Setup(web3, tokenAddress);
    await token.methods
      .approve(contractAddress, amount)
      .send({ from: address })
      .on('transactionHash', (hash) => {
        store.dispatch(setTxLoading(true));
        store.dispatch(setTxModalStatus('pending'));
        if (network === networkId) {
          const { emitter } = notify.hash(hash);
          emitter.on('txPool', (transaction) => {
            store.dispatch(setTxLink(transaction.hash));
            return {
              message: txMessage(transaction.hash)
            };
          });
          emitter.on('txCancel', () => {
            store.dispatch(setTxLoading(false));
            store.dispatch(setTxModalLoading(false));
            store.dispatch(setTxModalStatus('failed'));
          });
          emitter.on('txFailed', () => {
            store.dispatch(setTxLoading(false));
            store.dispatch(setTxModalLoading(false));
            store.dispatch(setTxModalStatus('failed'));
          });
        }
      })
      .on('confirmation', (count) => {
        if (count === 0) {
          // isDeposit ? setDepositApproved(!isApproved) : setWithdrawApproved(!isApproved);
          store.dispatch(toggleApproval(tokenAddress, contractAddress, !isApproved));
          store.dispatch(setTxLoading(false));
          store.dispatch(setTxModalLoading(false));
          store.dispatch(setTxModalStatus('success'));
        }
      });
  } catch (error) {
    store.dispatch(setTxModalLoading(false));
    error.code === 4001 && store.dispatch(setTxModalStatus('rejected'));
    return error;
  }
};

export const buyTrancheTokens = async (contractAddress, trancheId, trancheType, cryptoType) => {
  const state = store.getState();
  const { web3, address, notify, network } = state.ethereum;
  const { trancheCard } = state.data;
  try {
    store.dispatch(setTxModalLoading(true));
    store.dispatch(setTxOngoingData({ isDeposit: true, trancheCardId: trancheCard.id }));
    store.dispatch(setTxModalStatus('confirm'));
    let { depositAmount } = state.form.tranche.values;
    const JCompound = JCompoundSetup(web3, contractAddress);
    depositAmount = searchTokenDecimals(cryptoType) ? toWei(depositAmount, 'Mwei') : toWei(depositAmount);
    let depositAmountInEth = ETHorMaticCheck.indexOf(cryptoType) !== -1 ? depositAmount : 0;
    if (trancheType === 'TRANCHE_A') {
      await JCompound.methods
        .buyTrancheAToken(trancheId, depositAmount)
        .send({ value: depositAmountInEth, from: address })
        .on('transactionHash', (hash) => {
          store.dispatch(setTxLoading(true));
          store.dispatch(setTxModalStatus('pending'));
          if (network === networkId) {
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              store.dispatch(setTxLink(transaction.hash));
              return {
                message: txMessage(transaction.hash)
              };
            });
            emitter.on('txCancel', () => {
              store.dispatch(setTxLoading(false));
              store.dispatch(setTxModalLoading(false));
              store.dispatch(setTxModalStatus('failed'));
            });
            emitter.on('txFailed', () => {
              store.dispatch(setTxLoading(false));
              store.dispatch(setTxModalLoading(false));
              store.dispatch(setTxModalStatus('failed'));
            });
          }
        })
        .on('confirmation', async (count) => {
          if (count === 0) {
            store.dispatch(setTxLoading(false));
            store.dispatch(setTxLoading(false));
            store.dispatch(setTxModalStatus('success'));
            await store.dispatch(checkSIRRewards());
            await store.dispatch(setTokenBalances(address));
            analyticsTrack('Tracking user activity', 'Tranche Markets', {
              address: address,
              trancheType: trancheType,
              deposit: depositAmount + cryptoType
            });
          }
        });
    } else {
      await JCompound.methods
        .buyTrancheBToken(trancheId, depositAmount)
        .send({ value: depositAmountInEth, from: address })
        .on('transactionHash', (hash) => {
          store.dispatch(setTxLoading(true));
          store.dispatch(setTxModalStatus('pending'));
          if (network === networkId) {
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              store.dispatch(setTxLink(transaction.hash));
              return {
                message: txMessage(transaction.hash)
              };
            });
            emitter.on('txCancel', () => {
              store.dispatch(setTxLoading(false));
              store.dispatch(setTxModalLoading(false));
              store.dispatch(setTxModalStatus('failed'));
            });
            emitter.on('txFailed', () => {
              store.dispatch(setTxLoading(false));
              store.dispatch(setTxModalLoading(false));
              store.dispatch(setTxModalStatus('failed'));
            });
          }
        })
        .on('confirmation', async (count) => {
          if (count === 0) {
            store.dispatch(setTxLoading(false));
            store.dispatch(setTxLoading(false));
            store.dispatch(setTxModalStatus('success'));
            await store.dispatch(checkSIRRewards());
            await store.dispatch(setTokenBalances(address));
            analyticsTrack('Tracking user activity', 'Tranche Markets', {
              address: address,
              trancheType: trancheType,
              deposit: depositAmount + cryptoType
            });
          }
        });
    }
  } catch (error) {
    store.dispatch(setTxModalLoading(false));
    error.code === 4001 && store.dispatch(setTxModalStatus('rejected'));
    console.error(error);
  }
};

export const sellTrancheTokens = async (contractAddress, trancheId, trancheType) => {
  const state = store.getState();
  const { web3, address, notify, network } = state.ethereum;
  const { trancheCard } = state.data;
  try {
    store.dispatch(setTxModalLoading(true));
    store.dispatch(setTxOngoingData({ isDeposit: false, trancheCardId: trancheCard.id }));
    store.dispatch(setTxModalStatus('confirm'));
    let { withdrawAmount } = state.form.tranche.values;
    withdrawAmount = toWei(withdrawAmount);
    const JCompound = JCompoundSetup(web3, contractAddress);
    if (trancheType === 'TRANCHE_A') {
      await JCompound.methods
        .redeemTrancheAToken(trancheId, withdrawAmount)
        .send({ from: address })
        .on('transactionHash', (hash) => {
          store.dispatch(setTxLoading(true));
          store.dispatch(setTxModalStatus('pending'));
          if (network === networkId) {
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              store.dispatch(setTxLink(transaction.hash));
              return {
                message: txMessage(transaction.hash)
              };
            });
            emitter.on('txCancel', () => {
              store.dispatch(setTxLoading(false));
              store.dispatch(setTxModalLoading(false));
              store.dispatch(setTxModalStatus('failed'));
            });
            emitter.on('txFailed', () => {
              store.dispatch(setTxLoading(false));
              store.dispatch(setTxModalLoading(false));
              store.dispatch(setTxModalStatus('failed'));
            });
          }
        })
        .on('confirmation', async (count) => {
          if (count === 0) {
            store.dispatch(setTxLoading(false));
            store.dispatch(setTxModalLoading(false));
            store.dispatch(setTxModalStatus('success'));
            await store.dispatch(checkSIRRewards());
            await store.dispatch(setTokenBalances(address));
            analyticsTrack('Tracking user activity', 'Tranche Markets', { address: address, trancheType: trancheType, withdrawn: withdrawAmount });
          }
        });
    } else {
      await JCompound.methods
        .redeemTrancheBToken(trancheId, withdrawAmount)
        .send({ from: address })
        .on('transactionHash', (hash) => {
          store.dispatch(setTxLoading(true));
          store.dispatch(setTxModalStatus('pending'));
          if (network === networkId) {
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              store.dispatch(setTxLink(transaction.hash));
              return {
                message: txMessage(transaction.hash)
              };
            });
            emitter.on('txCancel', () => {
              store.dispatch(setTxLoading(false));
              store.dispatch(setTxModalLoading(false));
              store.dispatch(setTxModalStatus('failed'));
            });
            emitter.on('txFailed', () => {
              store.dispatch(setTxLoading(false));
              store.dispatch(setTxModalLoading(false));
              store.dispatch(setTxModalStatus('failed'));
            });
          }
        })
        .on('confirmation', async (count) => {
          if (count === 0) {
            store.dispatch(setTxLoading(false));
            store.dispatch(setTxModalLoading(false));
            store.dispatch(setTxModalStatus('success'));
            await store.dispatch(checkSIRRewards());
            await store.dispatch(setTokenBalances(address));
            analyticsTrack('Tracking user activity', 'Tranche Markets', { address: address, trancheType: trancheType, withdrawn: withdrawAmount });
          }
        });
    }
  } catch (error) {
    store.dispatch(setTxModalLoading(false));
    error.code === 4001 && store.dispatch(setTxModalStatus('rejected'));
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
    return isGreaterThan(userAllowance, tokenBalance[tokenAddress]) || isEqualTo(userAllowance, tokenBalance[tokenAddress]);
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
    error.code === 4001 &&
      updateNotification({
        id,
        type: 'REJECTED',
        message: 'You rejected the transaction',
        title: 'Transaction rejected'
      });
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
      store.dispatch(
        updateNotification({
          id,
          type: 'REJECTED',
          message: 'You rejected the transaction',
          title: 'Transaction rejected'
        })
      );
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
      store.dispatch(
        updateNotification({
          id,
          type: 'REJECTED',
          message: 'You rejected the transaction',
          title: 'Transaction rejected'
        })
      );
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
      store.dispatch(
        updateNotification({
          id,
          type: 'REJECTED',
          message: 'You rejected the transaction',
          title: 'Transaction rejected'
        })
      );
      store.dispatch(setMigrateLoading(false));
    }
    return error;
  }
};

export const getUnclaimedRewards = async (contractAddress) => {
  try
  {
    const state = store.getState();
    const { web3, address } = state.ethereum;
    const contract = await RewardDistributionSetup(web3, contractAddress);
    const marketsCounter = await contract.methods.marketsCounter().call();
    const marketArray = new Array(+(marketsCounter || 0)).fill(0);
    const b = new web3.BatchRequest();
    const historicalTrARewardPromises = [],
      historicalTrBRewardPromises = [];
    const distributionCounterPromise = marketArray.map((_v, marketId) => {
      historicalTrARewardPromises.push(
        new Promise((resolve, reject) => {
          b.add(
            contract.methods.getHistoricalUnclaimedRewardsAmountTrA(marketId, address).call.request((err, res) => {
              if (err) {
                resolve(0);
                return;
              }
              resolve(+res);
            })
          );
        })
      );
      historicalTrBRewardPromises.push(
        new Promise((resolve, reject) => {
          b.add(
            contract.methods.getHistoricalUnclaimedRewardsAmountTrB(marketId, address).call.request((err, res) => {
              if (err) {
                resolve(0);
                return;
              }
              resolve(+res);
            })
          );
        })
      );
      return new Promise((resolve, reject) => {
        b.add(
          contract.methods.availableMarketsRewards(marketId).call.request((err, res) => {
            if (err) {
              resolve({
                trADistributionCounter: 0,
                trBDistributionCounter: 0
              });
              return;
            }
            const { trADistributionCounter, trBDistributionCounter } = res;
            resolve({ trADistributionCounter, trBDistributionCounter });
          })
        );
      });
    });
    b.execute();
    const distributionCounter = await Promise.all(distributionCounterPromise);
    const batch = new web3.BatchRequest();
    const trARewardsPromise = [];
    distributionCounter.forEach((o, marketId) => {
      trARewardsPromise.push(
        new Promise((resolve, reject) => {
          batch.add(
            contract.methods.trAEarned(marketId, address, +(o.trADistributionCounter || 0)).call.request((err, res) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(res);
            })
          );
        })
      );
    });
    const trBRewardsPromise = [];
    distributionCounter.forEach((o, marketId) => {
      trBRewardsPromise.push(
        new Promise((resolve, reject) => {
          batch.add(
            contract.methods.trBEarned(marketId, address, +(o.trBDistributionCounter || 0)).call.request((err, res) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(res);
            })
          );
        })
      );
    });
    batch.execute();
    const rewards = await Promise.all([ ...trARewardsPromise, ...trBRewardsPromise, ...historicalTrARewardPromises, ...historicalTrBRewardPromises ]);
    return rewards.reduce((acc, cur) => {
      acc += +(cur || 0);
      return acc;
    }, 0);
  } catch (e) {
    console.log(e);
    return 0;
  }
};

export const claimRewardsAllMarkets = async () => {
  const state = store.getState();
  const { web3, address, notify, network, notificationCount } = state.ethereum;
  let id = notificationCount;
  try {
    store.dispatch(
      addNotification({
        id,
        type: 'WAITING',
        message: 'Your transaction is waiting for you to confirm',
        title: 'awaiting confirmation'
      })
    );
    const contract = await RewardDistributionSetup(web3, RewardDistributionAddress);
    await contract.methods
      .claimRewardsAllMarkets(address)
      .send({ from: address })
      .on('transactionHash', (hash) => {
        if (network === networkId) {
          const { emitter } = notify.hash(hash);
          emitter.on('txPool', (transaction) => {
            return {
              message: txMessage(transaction.hash)
            };
          });
          emitter.on('txConfirmed', async () => {
            store.dispatch(setTxLoading(false));
            await store.dispatch(checkSIRRewards());
            await store.dispatch(setTokenBalances(address));
          });
          emitter.on('txFailed', () => store.dispatch(setTxLoading(false)));
          emitter.on('txCancel', () => store.dispatch(setTxLoading(false)));
        }
      });
  } catch (error) {
    console.log(error);
    error.code === 4001 &&
      store.dispatch(
        updateNotification({
          id,
          type: 'REJECTED',
          message: 'You rejected the transaction',
          title: 'Transaction rejected'
        })
      );
    return error;
  }
};
