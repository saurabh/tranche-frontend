import Web3 from 'web3';
import axios from 'axios';
import store from '../store';
import { ERC20Setup, isEqualTo, isGreaterThan } from 'utils';
import {
  networkId,
  maticNetworkId,
  maticAddress,
  serverUrl,
  etherScanUrl,
  maticBlockExplorerUrl,
  polygonScanUrl,
  apiUri,
  ERC20Tokens,
  JCompoundAddress,
  CompTrancheTokens,
  TrancheBuyerCoinAddresses,
  JAaveAddress,
  AaveTrancheTokens,
  PolygonBuyerCoinAddresses,
  StakingAddresses,
  LockupAddress,
  SLICEAddress,
  LP1TokenAddress,
  LP2TokenAddress,
  RewardDistributionAddress
} from 'config';
import {
  SET_ADDRESS,
  SET_NETWORK,
  SET_BALANCE,
  SET_TOKEN_BALANCE,
  SET_WALLET,
  SET_WEB3,
  SET_CURRENT_BLOCK,
  SET_TRANSACTION_LOADING,
  SET_ALLOWANCE,
  SET_BLOCKEXPLORER_URL,
  ADD_NOTIFICATION,
  UPDATE_NOTIFICATION,
  UPDATE_NOTIFICATION_COUNT,
  REMOVE_NOTIFICATION,
  SIR_REWARDS
} from './constants';
import { summaryFetchSuccess } from './summaryData';
import { setHasMigrated, trancheMarketsToggle } from './tableData';
import { getUnclaimedRewards } from 'services';

const { stakingSummary } = apiUri;

export const setAddress = (address) => (dispatch) => {
  const migrateAddress = JSON.parse(window.localStorage.getItem('migrateAddress'));
  migrateAddress && migrateAddress[address.toLowerCase()] ? store.dispatch(setHasMigrated(true)) : store.dispatch(setHasMigrated(false));
  if (address) {
    dispatch({
      type: SET_ADDRESS,
      payload: address.toLowerCase()
    });
    window.localStorage.setItem('address', address.toLowerCase());
  }
};

export const setNetwork = (network) => async (dispatch) => {
  const state = store.getState();
  const { path, ethereum } = state;
  const { address } = ethereum;
  dispatch({
    type: SET_NETWORK,
    payload: network
  });
  window.localStorage.setItem('network', network === 137 ? 'polygon' : 'ethereum');

  if (network === networkId) {
    store.dispatch(trancheMarketsToggle('compound'));
    if (path === 'stake' && address) {
      const res = await axios(`${serverUrl + stakingSummary + address}`);
      const { result } = res.data;
      store.dispatch(summaryFetchSuccess(result));
    }
  }
  if (network === maticNetworkId) {
    store.dispatch(trancheMarketsToggle('aavePolygon'));
    store.dispatch(setBlockExplorerUrl(maticBlockExplorerUrl));
  }
  network !== maticNetworkId ? store.dispatch(setBlockExplorerUrl(etherScanUrl)) : store.dispatch(setBlockExplorerUrl(polygonScanUrl));
};

export const setBalance = (balance) => (dispatch) => {
  const state = store.getState();
  const { network } = state.ethereum;
  dispatch({
    type: SET_BALANCE,
    payload: balance
  });
  if (network === maticNetworkId) {
    dispatch({
      type: SET_TOKEN_BALANCE,
      payload: { tokenAddress: maticAddress, tokenBalance: balance }
    });
  }
};

export const setWalletAndWeb3 = (wallet) => async (dispatch) => {
  let web3 = new Web3(wallet.provider);
  dispatch({
    type: SET_WALLET,
    payload: wallet
  });
  dispatch({
    type: SET_WEB3,
    payload: web3
  });
  window.localStorage.setItem('selectedWallet', wallet.name);
};

export const setBlockExplorerUrl = (url) => (dispatch) => {
  dispatch({
    type: SET_BLOCKEXPLORER_URL,
    payload: url
  });
};

export const setTokenBalance = (tokenAddress, address) => async (dispatch) => {
  try {
    const state = store.getState();
    const { web3 } = state.ethereum;
    const token = ERC20Setup(web3, tokenAddress);
    const tokenBalance = await token.methods.balanceOf(address).call();

    dispatch({
      type: SET_TOKEN_BALANCE,
      payload: { tokenAddress, tokenBalance }
    });
  } catch (error) {
    console.error(error);
  }
};

export const setTokenBalances = (address) => async (dispatch) => {
  try {
    const state = store.getState();
    let { web3, network, maticWeb3 } = state.ethereum;
    web3 = network === maticNetworkId ? maticWeb3.http : web3;
    const Tokens =
      network === networkId
        ? ERC20Tokens.concat(CompTrancheTokens)
        : network === maticNetworkId
        ? PolygonBuyerCoinAddresses.concat(AaveTrancheTokens)
        : [];
    if (network === networkId || network === maticNetworkId) {
      const batch = new web3.BatchRequest();
      // const tokenBalance = {};
      Tokens.map((tokenAddress) => {
        let token = ERC20Setup(web3, tokenAddress);
        batch.add(
          token.methods.balanceOf(address).call.request({ from: address }, (err, res) => {
            if (err) {
              console.error(err);
            } else {
              dispatch({
                type: SET_TOKEN_BALANCE,
                payload: { tokenAddress: tokenAddress.toLowerCase(), tokenBalance: res }
              });
            }
          })
        );
        return batch;
      });
      network === maticNetworkId && dispatch({
        type: SET_TOKEN_BALANCE,
        payload: { tokenAddress: SLICEAddress.toLowerCase(), tokenBalance: '0' }
      });
      batch.execute();
    }
  } catch (error) {
    console.error(error);
  }
};

export const toggleApproval = (tokenAddress, contractAddress, bool) => async (dispatch) => {
  dispatch({
    type: SET_ALLOWANCE,
    payload: { contractAddress, tokenAddress: tokenAddress.toLowerCase(), isApproved: bool }
  });
};

export const checkTrancheAllowances = (address, contractAddress) => async (dispatch) => {
  try {
    const state = store.getState();
    let { web3, network, maticWeb3 } = state.ethereum;
    if ((network === networkId && contractAddress === JAaveAddress) || (network === maticNetworkId && contractAddress === JCompoundAddress)) return;
    web3 = network === maticNetworkId ? maticWeb3.http : web3;
    const Tokens =
      network === networkId
        ? CompTrancheTokens.concat(TrancheBuyerCoinAddresses)
        : network === maticNetworkId
        ? AaveTrancheTokens.concat(PolygonBuyerCoinAddresses)
        : [];
    if (network === networkId || network === maticNetworkId) {
      const batch = new web3.BatchRequest();
      let tokenBalance = {};
      Tokens.map((tokenAddress) => {
        let token = ERC20Setup(web3, tokenAddress);
        batch.add(
          token.methods.balanceOf(address).call.request({ from: address }, (err, res) => {
            if (err) {
              console.error(err);
            } else {
              tokenBalance[tokenAddress] = res;
            }
          })
        );
        return batch;
      });
      Tokens.map((tokenAddress) => {
        let token = ERC20Setup(web3, tokenAddress);
        batch.add(
          token.methods.allowance(address, contractAddress).call.request({ from: address }, (err, res) => {
            if (err) {
              console.error(err);
            } else {
              if ((isGreaterThan(res, tokenBalance[tokenAddress]) || isEqualTo(res, tokenBalance[tokenAddress])) && res !== '0') {
                dispatch({
                  type: SET_ALLOWANCE,
                  payload: { contractAddress, tokenAddress: tokenAddress.toLowerCase(), isApproved: true }
                });
              } else {
                dispatch({
                  type: SET_ALLOWANCE,
                  payload: { contractAddress, tokenAddress: tokenAddress.toLowerCase(), isApproved: false }
                });
              }
            }
          })
        );
        return batch;
      });
      batch.execute();
    }
  } catch (error) {
    console.error(error);
  }
};

// export const checkTrancheAllowances = (address, contractAddress) => async (dispatch) => {
//   try {
//     const state = store.getState();
//     let { web3, network, maticWeb3 } = state.ethereum;
//     if ((network === networkId && contractAddress === JAaveAddress) || (network === maticNetworkId && contractAddress === JCompoundAddress)) return;
//     web3 = network === maticNetworkId ? maticWeb3.http : web3;
//     const Tokens =
//       network === networkId
//         ? CompTrancheTokens.concat(TrancheBuyerCoinAddresses)
//         : network === maticNetworkId
//         ? AaveTrancheTokens.concat(PolygonBuyerCoinAddresses)
//         : [];
//     if (network === networkId || network === maticNetworkId) {
//       const batch = new web3.BatchRequest();
//       let tokenBalance = {};
//       Tokens.map((tokenAddress) => {
//         let token = ERC20Setup(web3, tokenAddress);
//         batch.add(
//           token.methods.balanceOf(address).call.request({ from: address }, (err, res) => {
//             if (err) {
//               console.error(err);
//             } else {
//               tokenBalance[tokenAddress] = res;
//             }
//           })
//         );
//         return batch;
//       });
//       Tokens.map((tokenAddress) => {
//         let token = ERC20Setup(web3, tokenAddress);
//         batch.add(
//           token.methods.allowance(address, contractAddress).call.request({ from: address }, (err, res) => {
//             if (err) {
//               console.error(err);
//             } else {
//               if ((isGreaterThan(res, tokenBalance[tokenAddress]) || isEqualTo(res, tokenBalance[tokenAddress])) && res !== '0') {
//                 dispatch({
//                   type: SET_ALLOWANCE,
//                   payload: { contractAddress, tokenAddress: tokenAddress.toLowerCase(), isApproved: true }
//                 });
//               } else {
//                 dispatch({
//                   type: SET_ALLOWANCE,
//                   payload: { contractAddress, tokenAddress: tokenAddress.toLowerCase(), isApproved: false }
//                 });
//               }
//             }
//           })
//         );
//         return batch;
//       });
//       batch.execute();
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

export const checkStakingAllowances = (address) => (dispatch) => {
  try {
    const state = store.getState();
    let { web3 } = state.ethereum;

    const sliceStakingContracts = [StakingAddresses[0], LockupAddress];
    const Tokens = [SLICEAddress, LP1TokenAddress, LP2TokenAddress];
    let tokenBalance = {};

    const batch = new web3.BatchRequest();
    Tokens.map((tokenAddress) => {
      let token = ERC20Setup(web3, tokenAddress);
      batch.add(
        token.methods.balanceOf(address).call.request({ from: address }, (err, res) => {
          if (err) {
            console.error(err);
          } else {
            tokenBalance[tokenAddress] = res;
          }
        })
      );
      return batch;
    });

    let SLICE = ERC20Setup(web3, SLICEAddress);
    let LP1 = ERC20Setup(web3, LP1TokenAddress);
    let LP2 = ERC20Setup(web3, LP2TokenAddress);

    sliceStakingContracts.map((contractAddress) => {
      batch.add(
        SLICE.methods.allowance(address, contractAddress).call.request({ from: address }, (err, res) => {
          if (err) {
            console.error(err);
          } else {
            if ((isGreaterThan(res, tokenBalance[SLICEAddress]) || isEqualTo(res, tokenBalance[SLICEAddress])) && res !== '0') {
              dispatch({
                type: SET_ALLOWANCE,
                payload: { contractAddress: contractAddress.toLowerCase(), tokenAddress: SLICEAddress.toLowerCase(), isApproved: true }
              });
            } else {
              dispatch({
                type: SET_ALLOWANCE,
                payload: { contractAddress: contractAddress.toLowerCase(), tokenAddress: SLICEAddress.toLowerCase(), isApproved: false }
              });
            }
          }
        })
      );
      return batch;
    });
    batch.add(
      LP1.methods.allowance(address, StakingAddresses[1]).call.request({ from: address }, (err, res) => {
        if (err) {
          console.error(err);
        } else {
          if ((isGreaterThan(res, tokenBalance[LP1TokenAddress]) || isEqualTo(res, tokenBalance[LP1TokenAddress])) && res !== '0') {
            dispatch({
              type: SET_ALLOWANCE,
              payload: { contractAddress: StakingAddresses[1].toLowerCase(), tokenAddress: LP1TokenAddress.toLowerCase(), isApproved: true }
            });
          } else {
            dispatch({
              type: SET_ALLOWANCE,
              payload: { contractAddress: StakingAddresses[1].toLowerCase(), tokenAddress: LP1TokenAddress.toLowerCase(), isApproved: false }
            });
          }
        }
      })
    );
    batch.add(
      LP2.methods.allowance(address, StakingAddresses[2]).call.request({ from: address }, (err, res) => {
        if (err) {
          console.error(err);
        } else {
          if ((isGreaterThan(res, tokenBalance[LP2TokenAddress]) || isEqualTo(res, tokenBalance[LP2TokenAddress])) && res !== '0') {
            dispatch({
              type: SET_ALLOWANCE,
              payload: { contractAddress: StakingAddresses[2].toLowerCase(), tokenAddress: LP2TokenAddress.toLowerCase(), isApproved: true }
            });
          } else {
            dispatch({
              type: SET_ALLOWANCE,
              payload: { contractAddress: StakingAddresses[2].toLowerCase(), tokenAddress: LP2TokenAddress.toLowerCase(), isApproved: false }
            });
          }
        }
      })
    );

    batch.execute();
  } catch (error) {
    console.error(error);
  }
};

export const setCurrentBlock = (blockNumber) => (dispatch) => {
  dispatch({
    type: SET_CURRENT_BLOCK,
    payload: blockNumber
  });
};

export const setTxLoading = (bool) => (dispatch) => {
  dispatch({
    type: SET_TRANSACTION_LOADING,
    payload: bool
  });
};

export const setNotificationCount = (count) => (dispatch) => {
  dispatch({
    type: UPDATE_NOTIFICATION_COUNT,
    payload: count
  });
};

export const addNotification = (notification) => (dispatch) => {
  dispatch({
    type: ADD_NOTIFICATION,
    payload: notification
  });
};

export const updateNotification = (notification) => (dispatch) => {
  const state = store.getState();
  let { notifications } = state.ethereum;
  notifications.find((element) => element.id === notification.id)
    ? dispatch({
        type: UPDATE_NOTIFICATION,
        payload: notification
      })
    : dispatch({
        type: ADD_NOTIFICATION,
        payload: notification
      });
};

export const removeNotification = (notification) => (dispatch) => {
  const state = store.getState();
  let { notifications } = state.ethereum;
  const index = notifications.indexOf(notification);
  dispatch({
    type: REMOVE_NOTIFICATION,
    payload: index
  });
};

export const checkSIRRewards = () => async (dispatch) => {
  const rewards = await getUnclaimedRewards(RewardDistributionAddress);
  dispatch({
    type: SIR_REWARDS,
    payload: rewards
  });
};
