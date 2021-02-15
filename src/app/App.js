import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GlobalStyle } from 'app/components';
import Banner from 'app/components/Banner/Banner';
import { loansFetchData } from 'redux/actions/loans';
import { tranchesFetchData } from 'redux/actions/tranches';
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
import NotFound from 'app/pages/NotFound';
import NetworkDetector from './components/NetworkDetector';
import Privacy from './pages/Privacy';
import TermsAndConditions from './pages/Terms&Conditions';
import '../App.css';

const baseRouteUrl = '/:locale(zh|en)?';

const App = ({
  loansFetchData,
  setCurrentBlock,
  path,
  ethereum: { address },
  loans: { skip, limit, filter, filterType },
  tranches: { skip: tSkip, limit: tLimit, filter: tFilter },
  trade: { tradeType },
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
        await loansFetchData({
          skip,
          limit,
          filter: {
            borrowerAddress: path === 'borrow' && filterType === 'own' ? address : undefined,
            lenderAddress: path === 'lend' && filterType === 'own' ? address : undefined,
            type: filter
          }
        });
      });

    const priceOracle = web3.eth
      .subscribe('logs', {
        address: PriceOracleAddress
      })
      .on('data', async () => {
        await timeout(4000);
        await loansFetchData({
          skip,
          limit,
          filter: {
            borrowerAddress: path === 'borrow' && filterType === 'own' ? address : undefined,
            lenderAddress: path === 'lend' && filterType === 'own' ? address : undefined,
            type: filter
          }
        });
      });

    const Protocol = web3.eth
      .subscribe('logs', {
        address: ProtocolAddress
      })
      .on('data', async () => {
        await timeout(4000);
        await tranchesFetchData({
          tSkip,
          tLimit,
          filter: {
            address: path === 'earn' && tradeType === 'myTranches' ? address : undefined,
            type: tFilter //ETH/JNT keep these in constant file
          }
        });
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
  }, [address, filterType, path, loansFetchData, skip, limit, filter, setCurrentBlock, tradeType, tSkip, tLimit, tFilter]);

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
  loansFetchData: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  loans: state.loans,
  tranches: state.tranches,
  trade: state.trade,
  path: state.path,
  checkServerStatus: state.checkServerStatus
});

export default connect(mapStateToProps, {
  loansFetchData,
  setCurrentBlock
})(NetworkDetector(App));
