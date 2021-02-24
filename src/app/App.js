import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GlobalStyle } from 'app/components';
import Banner from 'app/components/Banner/Banner';
import { apiUri } from 'config/constants';
import { fetchTableData } from 'redux/actions/tableData';
import { setCurrentBlock } from 'redux/actions/ethereum';
import { web3 } from 'utils/getWeb3';
import {
  LoanContractAddress,
  PriceOracleAddress,
  ProtocolAddress
} from 'config/constants';
import ErrorModal from 'app/components/Modals/Error';
// Routes
import Earn from 'app/pages/Earn';
import Borrow from 'app/pages/Borrow';
import Trade from 'app/pages/Trade';
import Staking from 'app/pages/Staking';
import NotFound from 'app/pages/NotFound';
import NetworkDetector from './components/NetworkDetector';
import Privacy from './pages/Privacy';
import TermsAndConditions from './pages/Terms&Conditions';
import '../App.css';
const { loanList: loanListUrl, tranchesList: tranchesistUrl } = apiUri;
const baseRouteUrl = "/:locale(zh|en)?";

const App = ({
  fetchTableData,
  setCurrentBlock,
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
        await timeout(4000);
        await fetchTableData({
          skip,
          limit,
          filter: {
            borrowerAddress: path === 'borrow' && filterType === 'own' ? address : undefined,
            lenderAddress: path === 'lend' && filterType === 'own' ? address : undefined,
            type: filter
          }
        }, loanListUrl);
      });

    const priceOracle = web3.eth
      .subscribe('logs', {
        address: PriceOracleAddress
      })
      .on('data', async () => {
        await timeout(4000);
        await fetchTableData({
          skip,
          limit,
          filter: {
            borrowerAddress: path === 'borrow' && filterType === 'own' ? address : undefined,
            lenderAddress: path === 'lend' && filterType === 'own' ? address : undefined,
            type: filter
          }
        }, loanListUrl);
      }, );

    const Protocol = web3.eth
      .subscribe('logs', {
        address: ProtocolAddress
      })
      .on('data', async () => {
        await timeout(4000);
        await fetchTableData({
          skip,
          limit,
          filter: {
            address: path === 'earn' && tradeType === 'myTranches' ? address : undefined,
            type: filter //ETH/JNT keep these in constant file
          }
        }, tranchesistUrl);
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
    };
  }, [address, filterType, path, fetchTableData, limit, filter, setCurrentBlock, tradeType, skip]);

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
            <Redirect exact from={baseRouteUrl + '/'} to='/borrow' />
            <Route exact path={baseRouteUrl + '/lend'} component={Earn} />
            <Route exact path={baseRouteUrl + '/borrow'} component={Borrow} />
            <Route exact path={baseRouteUrl + '/earn'} component={Trade} />
            <Route exact path={baseRouteUrl + '/stake'} component={Staking} />
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
  fetchTableData: PropTypes.func.isRequired
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
  setCurrentBlock
})(NetworkDetector(App));
