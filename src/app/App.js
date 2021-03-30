import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import { GlobalStyle } from 'app/components';
import Banner from 'app/components/Banner/Banner';
import { fetchTableData } from 'redux/actions/tableData';
import { setCurrentBlock } from 'redux/actions/ethereum';
import { summaryFetchSuccess } from 'redux/actions/summaryData';
import { web3 } from 'utils/getWeb3';
import {
  serverUrl,
  apiUri,
  LoanContractAddress,
  PriceOracleAddress,
  ProtocolAddress,
  StakingAddresses,
  YieldAddresses,
  JCompoundAddress
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
const { loanList, tranchesList, stakingList, stakingSummary } = apiUri;
const baseRouteUrl = '/:locale(zh|kr|en)?';

const App = ({
  fetchTableData,
  setCurrentBlock,
  summaryFetchSuccess,
  path,
  ethereum: { address },
  data: { skip, limit, filter, filterType, tradeType },
  checkServerStatus
}) => {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const timeout = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const currentBlock = web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
      if (!error) {
        setCurrentBlock(blockHeader.number);
        return;
      }
      console.error(error);
    });
    const pairContract = web3.eth
      .subscribe('logs', {
        address: LoanContractAddress
      })
      .on('data', async () => {
        if (path === 'borrow' || path === 'lend') {
          await timeout(4000);
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
          await timeout(4000);
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
    const Protocol = web3.eth
      .subscribe('logs', {
        address: ProtocolAddress
      })
      .on('data', async () => {
        if (path === 'tranche') {
          await timeout(4000);
          await fetchTableData(
            {
              skip,
              limit,
              filter: {
                address: tradeType === 'myTranches' ? address : undefined,
                type: filter //ETH/JNT keep these in constant file
              }
            },
            tranchesList
          );
        }
      });
    const JCompound = web3.eth
      .subscribe('logs', {
        address: JCompoundAddress
      })
      .on('data', async () => {
        if (path === 'tranche') {
          await timeout(4000);
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
        }
      });
    const Staking = web3.eth
      .subscribe('logs', {
        address: StakingAddresses
      })
      .on('data', async () => {
        if (path === 'stake') {
          await timeout(4000);
          await fetchTableData(
            {
              skip,
              limit,
              filter: {
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
          await timeout(4000);
          const res = await axios(`${serverUrl + stakingSummary + address}`);
          const { result } = res.data;
          summaryFetchSuccess(result);
        }
      });

    return () => {
      currentBlock.unsubscribe((error) => {
        if (error) console.error(error);
      });
      pairContract.unsubscribe((error) => {
        if (error) console.error(error);
      });
      priceOracle.unsubscribe((error) => {
        if (error) console.error(error);
      });
      Protocol.unsubscribe((error) => {
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
  }, [address, filterType, path, fetchTableData, limit, filter, setCurrentBlock, summaryFetchSuccess, tradeType, skip]);

  const serverError = () => {
    return <ErrorModal openModal={showModal} closeModal={() => setShowModal(false)} />;
  };
  const initApp = () => {
    return (
      <>
        <GlobalStyle />
        <Banner />
        <Router>
          <Switch location={window.location}>
            <Redirect exact from={baseRouteUrl + '/'} to='/stake' />
            <Route exact path={baseRouteUrl + '/lend'} component={Earn} />
            <Route exact path={baseRouteUrl + '/borrow'} component={Borrow} />
            <Route exact path={baseRouteUrl + '/tranche'} component={Trade} />
            <Route exact path={baseRouteUrl + '/stake'} component={Stake} />
            <Route exact path={baseRouteUrl + '/privacy'} component={Privacy} />
            <Route exact path={baseRouteUrl + '/terms'} component={TermsAndConditions} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </>
    );
  };
  return checkServerStatus ? initApp() : serverError();
};

App.propTypes = {
  ethereum: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  tranches: PropTypes.object.isRequired,
  trade: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  fetchTableData: PropTypes.func.isRequired,
  setCurrentBlock: PropTypes.func.isRequired,
  summaryFetchSuccess: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  data: state.data,
  tranches: state.tranches,
  trade: state.trade,
  path: state.path,
  checkServerStatus: state.checkServerStatus
});

export default connect(mapStateToProps, {
  fetchTableData,
  setCurrentBlock,
  summaryFetchSuccess
  // changePath
})(NetworkDetector(App));
