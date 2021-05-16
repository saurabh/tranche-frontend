import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import { GlobalStyle } from 'app/components';
import { ThemeProvider } from 'styled-components';

import Banner from 'app/components/Banner/Banner';
import { fetchTableData, trancheCardToggle } from 'redux/actions/tableData';

import { setTokenBalances, checkTrancheAllowances } from 'redux/actions/ethereum';
import { summaryFetchSuccess, setSliceStats, setTvl } from 'redux/actions/summaryData';
import { web3 } from 'utils/getWeb3';
import {
  serverUrl,
  apiUri,
  LoanContractAddress,
  PriceOracleAddress,
  StakingAddresses,
  YieldAddresses,
  JCompoundAddress,
  JAaveAddress,
  ModeThemes,
  ERC20Tokens,
  CompTrancheTokens,
  AaveTrancheTokens
} from 'config/constants';
import ErrorModal from 'app/components/Modals/Error';
// Routes
import Earn from 'app/pages/Lend';
import Borrow from 'app/pages/Borrow';
import Trade from 'app/pages/Trade';
import Stake from 'app/pages/Stake';
import NotFound from 'app/pages/NotFound';
import NetworkDetector from './components/NetworkDetector';
import Privacy from './pages/Privacy';
import TermsAndConditions from './pages/Terms&Conditions';
import '../App.css';
const { loanList, tranchesList, stakingList, stakingSummary, sliceSummary, totalValueLocked } = apiUri;
const baseRouteUrl = '/:locale(zh|kr|en)?';

const App = ({
  fetchTableData,
  setTokenBalances,
  checkTrancheAllowances,
  summaryFetchSuccess,
  setSliceStats,
  setTvl,
  trancheCardToggle,
  path,
  ethereum: { address },
  data: { skip, limit, filter, filterType, tradeType },
  checkServerStatus,
  theme
}) => {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const Tokens = ERC20Tokens.concat(CompTrancheTokens).concat(AaveTrancheTokens);
    const timeout = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    address && setTokenBalances(address);
    const ERC20Balances = web3.eth
      .subscribe('logs', {
        address: Tokens,
        topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef']
      })
      .on('data', async (log) => {
        if (address) {
          // console.log(log.blockNumber)
          // let token = ERC20Setup(web3, '0xeA6ba879Ffc4337430B238C39Cb32e8E1FF63A1b');
          // let balanceOf = await token.methods.balanceOf(address).call();
          // console.log(balanceOf)
          for (let i = 1; i < 3; i++) {
            let topicAddress = '0x' + log.topics[i].split('0x000000000000000000000000')[1];
            if (address === topicAddress) {
              await timeout(5000);
              setTokenBalances(address);
            }
          }
        }
      });

    return () => {
      ERC20Balances.unsubscribe((error) => {
        if (error) console.error(error);
      });
    };
  }, [address, setTokenBalances]);

  useEffect(() => {
    if (address) {
      checkTrancheAllowances(address, JCompoundAddress);
      checkTrancheAllowances(address, JAaveAddress);
    }
  }, [address, checkTrancheAllowances]);

  useEffect(() => {
    const timeout = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const pairContract = web3.eth
      .subscribe('logs', {
        address: LoanContractAddress
      })
      .on('data', async () => {
        if (path === 'borrow' || path === 'lend') {
          await timeout(5000);
          await fetchTableData(
            {
              skip,
              limit,
              filter: {
                borrowerAddress: path === 'borrow' && filterType === 'own' ? address : undefined,
                lenderAddress: path === 'lend' && filterType === 'own' ? address : undefined,
                type: filter
              }
            },
            loanList
          );
        }
      });
    const priceOracle = web3.eth
      .subscribe('logs', {
        address: PriceOracleAddress
      })
      .on('data', async () => {
        if (path === 'borrow' || path === 'lend') {
          await timeout(5000);
          await fetchTableData(
            {
              skip,
              limit,
              filter: {
                borrowerAddress: path === 'borrow' && filterType === 'own' ? address : undefined,
                lenderAddress: path === 'lend' && filterType === 'own' ? address : undefined,
                type: filter
              }
            },
            loanList
          );
        }
      });
    const JCompound = web3.eth
      .subscribe('logs', {
        address: JCompoundAddress
      })
      .on('data', async (log) => {
        if (path === 'tranche') {
          let userAddress = address.split('0x')[1];
          await timeout(5000);
          if (log.data.includes(userAddress)) {
            await fetchTableData(
              {
                skip,
                limit,
                filter: {
                  address: address ? address : undefined,
                  type: filter //ETH/JNT keep these in constant file
                }
              },
              tranchesList
            );
            trancheCardToggle({ status: false, id: null });
          }
          const getSliceStats = async () => {
            const res = await axios(`${serverUrl + sliceSummary}`);
            const { result } = res.data;
            setSliceStats(result);
          };
          const getTvl = async () => {
            const res = await axios(`${serverUrl + totalValueLocked}`);
            const { result } = res.data;
            setTvl(result);
          };
          getSliceStats();
          getTvl();
        }
      });
    const Staking = web3.eth
      .subscribe('logs', {
        address: StakingAddresses
      })
      .on('data', async () => {
        if (path === 'stake') {
          await timeout(5000);
          await fetchTableData(
            {
              skip,
              limit,
              filter: {
                address: address ? address : undefined,
                type: filter //ETH/JNT keep these in constant file
              }
            },
            stakingList
          );
          const res = await axios(`${serverUrl + stakingSummary + address}`);
          const { result } = res.data;
          summaryFetchSuccess(result);
        }
      });
    const YieldFarm = web3.eth
      .subscribe('logs', {
        address: YieldAddresses
      })
      .on('data', async () => {
        if (path === 'stake') {
          await timeout(5000);
          const res = await axios(`${serverUrl + stakingSummary + address}`);
          const { result } = res.data;
          summaryFetchSuccess(result);
        }
      });

    return () => {
      // currentBlock.unsubscribe((error) => {
      //   if (error) console.error(error);
      // });
      pairContract.unsubscribe((error) => {
        if (error) console.error(error);
      });
      priceOracle.unsubscribe((error) => {
        if (error) console.error(error);
      });
      JCompound.unsubscribe((error) => {
        if (error) console.error(error);
      });
      Staking.unsubscribe((error) => {
        if (error) console.error(error);
      });
      YieldFarm.unsubscribe((error) => {
        if (error) console.error(error);
      });
    };
  }, [
    address,
    filterType,
    path,
    fetchTableData,
    limit,
    filter,
    setTokenBalances,
    summaryFetchSuccess,
    setSliceStats,
    setTvl,
    tradeType,
    skip,
    trancheCardToggle
  ]);

  const serverError = () => {
    return <ErrorModal openModal={showModal} closeModal={() => setShowModal(false)} />;
  };
  const initApp = () => {
    return (
      <ThemeProvider theme={ModeThemes[theme]}>
        <GlobalStyle />
        <Banner />
        <Router>
          <Switch location={window.location}>
            <Redirect exact from={baseRouteUrl + '/'} to='/tranche' />
            <Route exact path={baseRouteUrl + '/lend'} component={Earn} />
            <Route exact path={baseRouteUrl + '/borrow'} component={Borrow} />
            <Route exact path={baseRouteUrl + '/tranche'} component={Trade} />
            <Route exact path={baseRouteUrl + '/stake'} component={Stake} />
            <Route exact path={baseRouteUrl + '/privacy'} component={Privacy} />
            <Route exact path={baseRouteUrl + '/terms'} component={TermsAndConditions} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </ThemeProvider>
    );
  };
  return checkServerStatus ? initApp() : serverError();
};

App.propTypes = {
  ethereum: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  fetchTableData: PropTypes.func.isRequired,
  summaryFetchSuccess: PropTypes.func.isRequired,
  setSliceStats: PropTypes.func.isRequired,
  setTvl: PropTypes.func.isRequired.bind,
  setTokenBalances: PropTypes.func.isRequired,
  checkTrancheAllowances: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  data: state.data,
  tranches: state.tranches,
  trade: state.trade,
  path: state.path,
  checkServerStatus: state.checkServerStatus,
  theme: state.theme
});

export default connect(mapStateToProps, {
  fetchTableData,
  setTokenBalances,
  checkTrancheAllowances,
  summaryFetchSuccess,
  setSliceStats,
  trancheCardToggle,
  setTvl
})(NetworkDetector(App));
