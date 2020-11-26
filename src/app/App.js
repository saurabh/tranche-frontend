import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GlobalStyle } from 'app/components';
import Banner from 'app/components/Banner/Banner';
import { loansFetchData } from 'redux/actions/loans';
import { setCurrentBlock } from 'redux/actions/ethereum';
import { web3 } from 'utils/getWeb3';
import { LoanContractAddress, PriceOracleAddress } from 'config/constants';

// Routes
import Earn from 'app/pages/Earn';
import Borrow from 'app/pages/Borrow';
import Trade from 'app/pages/Trade';
import NotFound from 'app/pages/NotFound';
import NetworkDetector from './components/NetworkDetector';
import Privacy from './pages/Privacy';
import TermsAndConditions from './pages/Terms&Conditions';
import '../App.css';

const App = ({
  loansFetchData,
  setCurrentBlock,
  path,
  ethereum: { address },
  loans: { skip, limit, filter, filterType }
}) => {
  useEffect(() => {
    const timeout = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    // const currentBlock = web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
    //   if (!error) {
    //     setCurrentBlock(blockHeader.number);
    //     return;
    //   }
    //   console.error(error);
    // });

    const pairContract = web3.eth
      .subscribe('logs', {
        address: LoanContractAddress
      })
      .on('data', async () => {
        await timeout(3000);
        await loansFetchData({
          skip,
          limit,
          filter: {
            borrowerAddress: path === 'borrow' && filterType === 'own' ? address : undefined,
            lenderAddress: path === 'earn' && filterType === 'own' ? address : undefined,
            type: filter
          }
        });
      });

    const priceOracle = web3.eth
      .subscribe('logs', {
        address: PriceOracleAddress
      })
      .on('data', async (data) => {
        console.log(data);
        await timeout(3000);
        await loansFetchData({
          skip,
          limit,
          filter: {
            borrowerAddress: path === 'borrow' && filterType === 'own' ? address : undefined,
            lenderAddress: path === 'earn' && filterType === 'own' ? address : undefined,
            type: filter
          }
        });
      });

    return () => {
      // currentBlock.unsubscribe((error, success) => {
      //   if (error) console.log(error);
      //   if (success) console.log('Successfully unsubscribed!');
      // });
      pairContract.unsubscribe((error, success) => {
        if (error) console.log(error);
        if (success) console.log('Successfully unsubscribed!');
      });
      priceOracle.unsubscribe((error, success) => {
        if (error) console.log(error);
        if (success) console.log('Successfully unsubscribed!');
      });
    };
  }, [address, filterType, path, loansFetchData, skip, limit, filter, setCurrentBlock]);

  return (
    <>
      <GlobalStyle />
      <Banner />
      <Router>
        <Switch>
          <Redirect exact from='/' to='/borrow' />
          <Route exact path='/earn' component={Earn} />
          <Route exact path='/borrow' component={Borrow} />
          <Route exact path='/trade' component={Trade}>
            <Redirect to='/borrow' />
          </Route>
          <Route exact path='/privacy' component={Privacy} />
          <Route exact path='/terms' component={TermsAndConditions} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </>
  );
};

App.propTypes = {
  loansFetchData: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  loans: state.loans,
  path: state.path
});

export default connect(mapStateToProps, {
  loansFetchData,
  setCurrentBlock
})(NetworkDetector(App));
