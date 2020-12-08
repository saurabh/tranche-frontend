import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GlobalStyle } from 'app/components';
import Banner from 'app/components/Banner/Banner';
import { loansFetchData } from 'redux/actions/loans';
import { setCurrentBlock } from 'redux/actions/ethereum';
import { web3 } from 'utils/getWeb3';
import { LoanContractAddress, PriceOracleAddress } from 'config/constants';
import ErrorModal from 'app/components/Modals/Error';
import { apiUri } from 'config/constants';
import { postRequest } from 'services/axios';

// Routes
import Earn from 'app/pages/Earn';
import Borrow from 'app/pages/Borrow';
import Trade from 'app/pages/Trade';
import NotFound from 'app/pages/NotFound';
import NetworkDetector from './components/NetworkDetector';
import Privacy from './pages/Privacy';
import TermsAndConditions from './pages/Terms&Conditions';
import '../App.css';

const { loanList: loanListUrl } = apiUri;

const App = ({
  loansFetchData,
  setCurrentBlock,
  path,
  ethereum: { address },
  loans: { skip, limit, filter, filterType }
}) => {
  const [showModal, setShowModal] = useState(true);
  const [serverStatus, setServerStatus] = useState(null);

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
    };
  }, [address, filterType, path, loansFetchData, skip, limit, filter, setCurrentBlock]);

  useEffect(() => {
    checkServer();
  }, [])

  const checkServer = async () => {
    try {
      const { data: result } = await postRequest(loanListUrl, { data: { skip: 0, limit: 20 } }, null, true);
      if(result){
        setServerStatus(true);
      }
      else{
        setServerStatus(false);
      }
    } catch (error) {
      setServerStatus(false);
      console.log(error);
    }
  }

  const serverError = () => {
    return(
      <ErrorModal openModal={showModal} closeModal={() => setShowModal(false)} />
    )
  }
  const initApp = () => {
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
  }
  return (serverStatus === false) ? serverError() : (serverStatus === true) ? initApp() : '';
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
