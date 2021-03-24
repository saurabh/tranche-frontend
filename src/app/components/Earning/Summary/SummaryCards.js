import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SummaryCard from './SummaryCard';
import { SummaryCardsWrapper } from './styles/SummaryComponents';
// import axios from 'axios';
// import { apiUri, serverUrl } from 'config/constants';
import { initOnboard } from 'services/blocknative';
import PropTypes from 'prop-types';

import { setAddress, setNetwork, setBalance, setWalletAndWeb3, setTokenBalances, setTokenBalance } from 'redux/actions/ethereum';
import { summaryFetchSuccess } from 'redux/actions/summaryData';
import i18n from '../../locale/i18n';

// const { summaryRatio, summaryCollateral, summaryLoan, stakingSummary } = apiUri;
// const BASE_URL = serverUrl;

const SummaryCards = ({
  path,
  ethereum: { wallet, address },
  setTokenBalance,
  userSummary: { slice, lp, lpList },
  summaryFetchSuccess
}) => {
  const { pathname } = window.location;
  let parsedPath = pathname.split('/');
  let currentPath = parsedPath[parsedPath.length - 1];
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const [hasAllowance, setHasAllowance] = useState(false);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };
  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });
  // const onboard = initOnboard({
  //   address: setAddress,
  //   network: setNetwork,
  //   balance: setBalance,
  //   wallet: setWalletAndWeb3
  // });

  useEffect(() => {
    if (currentPath === 'earn') {
    }
  }, [isDesktop, currentPath, address, summaryFetchSuccess]);

  useEffect(() => {
    if (isDesktop && currentPath === 'stake' && address && slice && lpList) {
      setTokenBalance(slice.address, address);
      lpList.forEach((lp) => setTokenBalance(lp.address, address));
    }
  }, [isDesktop, currentPath, address, lpList, slice, setTokenBalance]);

  const openModal = () => console.log('needs to be removed at the time of components merge');
  const closeModal = () => console.log('needs to be removed at the time of components merge');

  return (
    <div>
      {!isDesktop && currentPath === 'stake' && (
        <SummaryCardsWrapper className='container content-container'>
          <button onClick={() => openModal(undefined, 0)}>
            Stake and withdraw
            <span>+ -</span>
          </button>
        </SummaryCardsWrapper>
      )}

      <SummaryCardsWrapper className='container content-container' path={currentPath} isDesktop={isDesktop}>
        <SummaryCard
          title={
            currentPath !== 'stake' && currentPath !== 'earn'
              ? 'Decentralized Loans'
              : currentPath === 'earn'
              ? i18n.t('tranche.summary.valueLocked.title')
              : i18n.t('stake.summary.slice.title')
          }
          tokenAddress={slice.address}
          value={'Card'}
          path={currentPath}
          type={''}
          details={''}
          openModal={(bool, num = 1) => openModal(bool, num)}
          closeModal={closeModal}
          modalType={false}
          summaryModal={''}
          hasAllowance={hasAllowance}
          setHasAllowance={setHasAllowance}
          color='#4441CF'
        />
        <SummaryCard
          title={
            currentPath !== 'stake'
              ? 'Protocol Collateral'
              : currentPath === 'earn'
              ? i18n.t('tranche.summary.slicePrice.title')
              : i18n.t('stake.summary.sliceLP.title')
          }
          tokenAddress={lp.address}
          lpList={lpList}
          value={'Card'}
          path={currentPath}
          type={''}
          details={''}
          openModal={(bool, num = 2) => openModal(bool, num)}
          closeModal={closeModal}
          modalType={false}
          summaryModal={''}
          hasAllowance={hasAllowance}
          setHasAllowance={setHasAllowance}
          color='#5826E5'
        />
        <SummaryCard
          title={
            currentPath !== 'stake'
              ? 'Collateralization Ratio'
              : currentPath === 'earn'
              ? 'SLICE 24H Volume'
              : i18n.t('stake.summary.sliceRewards.title')
          }
          value={'Card'}
          isLoading={false}
          path={currentPath}
          type={''}
          details={''}
          openModal={(bool = null, num = 3) => openModal(bool, num)}
          closeModal={closeModal}
          modalType={false}
          summaryModal={''}
          color='#2E65F3'
        />
        <SummaryCard
          title={currentPath !== 'stake' ? 'Collateralization Ratio' : currentPath === 'earn' ? '' : i18n.t('stake.summary.sliceRewards.title')}
          value={'Card'}
          isLoading={false}
          path={currentPath}
          type={''}
          details={''}
          openModal={(bool = null, num = 3) => openModal(bool, num)}
          closeModal={closeModal}
          modalType={false}
          summaryModal={''}
          color='linear-gradient(180deg, #433FFB 0%, #0C08D6 100%);'
          stakeCard={true}
        />
      </SummaryCardsWrapper>
    </div>
  );
};
SummaryCards.propTypes = {
  ethereum: PropTypes.object.isRequired,
  setAddress: PropTypes.func.isRequired,
  setNetwork: PropTypes.func.isRequired,
  setBalance: PropTypes.func.isRequired,
  setWalletAndWeb3: PropTypes.func.isRequired,
  summaryFetchSuccess: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    path: state.path,
    ethereum: state.ethereum,
    userSummary: state.userSummary
  };
};

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTokenBalances,
  setTokenBalance,
  summaryFetchSuccess
})(SummaryCards);
