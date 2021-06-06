import axios from 'axios';
import store from 'redux/store';
import { web3 } from 'utils/getWeb3';
// import maticWeb3 from 'utils/maticWeb3';
import { fetchTableData, trancheCardToggle } from 'redux/actions/tableData';
import { summaryFetchSuccess, setSliceStats, setTvl } from 'redux/actions/summaryData';
import { setTokenBalances } from 'redux/actions/ethereum';
import { serverUrl, apiUri, StakingAddresses, YieldAddresses, JCompoundAddress, JAaveAddress } from 'config/constants';
import maticWeb3 from 'utils/maticWeb3';
const { tranchesList, stakingList, stakingSummary, sliceSummary, totalValueLocked } = apiUri;

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
let JCompound, Staking, YieldFarm, JAave;

export const ETHContracts = {
  subscribe: () => {
    try {
      const state = store.getState();
      const { path, ethereum, data } = state;
      const { address } = ethereum;
      
      JCompound =
        path === 'tranche' &&
        address &&
        web3.eth
          .subscribe('logs', {
            address: JCompoundAddress
          })
          .on('data', async (log) => {
            console.log(log);
            let userAddress = address.split('0x')[1];
            await timeout(5000);
            if (log.data.includes(userAddress)) {
              const state = store.getState();
              const { data } = state;
              const { skip, limit, filter } = data;
              console.log(filter);
              await store.dispatch(
                fetchTableData(
                  {
                    skip,
                    limit,
                    filter: {
                      address: address ? address : undefined,
                      type: filter
                    }
                  },
                  tranchesList
                )
              );
              store.dispatch(trancheCardToggle({ status: false, id: null }));
              const getSliceStats = async () => {
                const res = await axios(`${serverUrl + sliceSummary}`);
                const { result } = res.data;
                store.dispatch(setSliceStats(result));
              };
              const getTvl = async () => {
                const res = await axios(`${serverUrl + totalValueLocked}`);
                const { result } = res.data;
                store.dispatch(setTvl(result));
              };
              getSliceStats();
              getTvl();
              store.dispatch(setTokenBalances(address));
            }
          });
      Staking =
        path === 'stake' &&
        address &&
        web3.eth
          .subscribe('logs', {
            address: StakingAddresses
          })
          .on('data', async () => {
            await timeout(5000);
            const { skip, limit, filter } = data;
            await store.dispatch(
              fetchTableData(
                {
                  skip,
                  limit,
                  filter: {
                    address: address ? address : undefined,
                    type: filter
                  }
                },
                stakingList
              )
            );
            const res = await axios(`${serverUrl + stakingSummary + address}`);
            const { result } = res.data;
            store.dispatch(summaryFetchSuccess(result));
            store.dispatch(setTokenBalances(address));
          });
      YieldFarm =
        path === 'stake' &&
        address &&
        web3.eth
          .subscribe('logs', {
            address: YieldAddresses
          })
          .on('data', async () => {
            await timeout(5000);
            const res = await axios(`${serverUrl + stakingSummary + address}`);
            const { result } = res.data;
            store.dispatch(summaryFetchSuccess(result));
            store.dispatch(setTokenBalances(address));
          });
    } catch (error) {
      console.error(error);
    }
  },
  unsubscribe: () => {
    try {
      JCompound &&
        JCompound.unsubscribe((error) => {
          if (error) console.error(error);
        });
      Staking &&
        Staking.unsubscribe((error) => {
          if (error) console.error(error);
        });
      YieldFarm &&
        YieldFarm.unsubscribe((error) => {
          if (error) console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }
};

export const MaticContracts = {
  subscribe: () => {
    try {
      const state = store.getState();
      const { path, ethereum } = state;
      const { address } = ethereum;

      JAave =
        path === 'tranche' &&
        address &&
        maticWeb3.webSocket.eth
          .subscribe('logs', {
            address: JAaveAddress
          })
          .on('data', async (log) => {
            console.log(log);
            let userAddress = address.split('0x')[1];
            await timeout(5000);
            if (log.data.includes(userAddress)) {
              const state = store.getState();
              const { data } = state;
              const { skip, limit, filter } = data;
              console.log(filter);
              await store.dispatch(
                fetchTableData(
                  {
                    skip,
                    limit,
                    filter: {
                      address: address ? address : undefined,
                      type: filter
                    }
                  },
                  tranchesList
                )
              );
              store.dispatch(trancheCardToggle({ status: false, id: null }));
              const getSliceStats = async () => {
                const res = await axios(`${serverUrl + sliceSummary}`);
                const { result } = res.data;
                store.dispatch(setSliceStats(result));
              };
              const getTvl = async () => {
                const res = await axios(`${serverUrl + totalValueLocked}`);
                const { result } = res.data;
                store.dispatch(setTvl(result));
              };
              getSliceStats();
              getTvl();
              store.dispatch(setTokenBalances(address));
            }
          });
    } catch (error) {
      console.error(error);
    }
  },
  unsubscribe: () => {
    try {
      JAave &&
        JAave.unsubscribe((error) => {
          if (error) console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }
};
