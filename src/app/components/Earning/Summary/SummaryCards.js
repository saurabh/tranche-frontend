import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SummaryCard from './SummaryCard';
import { SummaryCardsWrapper } from './styles/SummaryComponents';
import { TableTitle } from '../../Stake/Table/styles/TableComponents';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios';
import { apiUri, ModeThemes, serverUrl } from 'config/constants';
import PropTypes from 'prop-types';

import { setAddress, setNetwork, setBalance, setWalletAndWeb3 } from 'redux/actions/ethereum';
import { summaryFetchSuccess, setSliceStats, setTvl } from 'redux/actions/summaryData';
import i18n from '../../locale/i18n';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    paritialVisibilityGutter: 60
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    paritialVisibilityGutter: 50
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    paritialVisibilityGutter: 100
  }
};

// const { summaryRatio, summaryCollateral, summaryLoan, stakingSummary } = apiUri;
// const BASE_URL = serverUrl;
const { sliceSummary, totalValueLocked } = apiUri;

const SummaryCards = ({
  path,
  ethereum: { address },
  summaryData: { slice, lp, lpList, sliceStats, tvl },
  summaryFetchSuccess,
  setSliceStats,
  setTvl,
  theme
}) => {
  const { pathname } = window.location;
  let parsedPath = pathname.split('/');
  let currentPath = parsedPath[1];
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const [hasAllowance, setHasAllowance] = useState(false);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };
  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });

  useEffect(() => {
    const getSliceStats = async () => {
      const res = await axios(`${ serverUrl }${ sliceSummary }`);
      const { result } = res.data;
      setSliceStats(result);
    };
    const getTvl = async () => {
      const res = await axios(`${ serverUrl }${ totalValueLocked }`);
      const { result } = res.data;
      setTvl(result);
    };

    if (currentPath === 'tranche') {
      getSliceStats();
      getTvl();
    }
  }, [isDesktop, currentPath, setSliceStats, setTvl]);

  const openModal = () => console.log('needs to be removed at the time of components merge');
  const closeModal = () => console.log('needs to be removed at the time of components merge');
  return (
    <div>
      {
        isDesktop && (
          <TableTitle color={ModeThemes[theme].HeaderTitle} className='container content-container' summary={true}>
            <h2>{i18n.t('tranche.trancheData.TrancheStats')}</h2>
          </TableTitle>
        )
      }
      {!isDesktop && currentPath === 'stake' && (
        <SummaryCardsWrapper className='container content-container'>
          <button onClick={() => openModal(undefined, 0)}>
            Stake and withdraw
            <span>+ -</span>
          </button>
        </SummaryCardsWrapper>
      )}
      {isDesktop && (
        <SummaryCardsWrapper className='container content-container' path={currentPath} isDesktop={isDesktop}>
          <SummaryCard
            title={
              currentPath === 'stake'
                ? i18n.t('stake.summary.slice.title')
                : currentPath === 'tranche'
                ? i18n.t('tranche.summary.valueLocked.title')
                : 'Decentralized Loans'
            }
            // title="Wallet Balance"
            tokenAddress={slice.address}
            value={tvl ? tvl.total : 0}
            path={currentPath}
            type={'tvl'}
            details={''}
            openModal={(bool, num = 1) => openModal(bool, num)}
            closeModal={closeModal}
            modalType={false}
            summaryModal={''}
            hasAllowance={hasAllowance}
            setHasAllowance={setHasAllowance}
            color='#4441CF'
            // color='#343267'
          />
          <SummaryCard
            title={
              currentPath === 'stake'
                ? i18n.t('stake.summary.sliceLP.title')
                : currentPath === 'tranche'
                ? i18n.t('tranche.summary.slicePrice.title')
                : 'Protocol Collateral'
            }
            // title="Tranche A Yields"
            tokenAddress={lp.address}
            lpList={lpList}
            value={sliceStats ? sliceStats.price : 0}
            path={currentPath}
            type={'price'}
            details={''}
            openModal={(bool, num = 2) => openModal(bool, num)}
            closeModal={closeModal}
            modalType={false}
            summaryModal={''}
            hasAllowance={hasAllowance}
            setHasAllowance={setHasAllowance}
            color='#5826E5'
            // color='#4441CF'
          />
          <SummaryCard
            title={
              currentPath === 'stake'
                ? i18n.t('stake.summary.sliceRewards.title')
                : currentPath === 'tranche'
                ? i18n.t('tranche.summary.sliceVolume.title')
                : 'Collateralization Ratio'
            }
            // title="Tranche B Yields"
            value={sliceStats ? sliceStats.volume : 0}
            isLoading={false}
            path={currentPath}
            type={'volume'}
            details={''}
            openModal={(bool = null, num = 3) => openModal(bool, num)}
            closeModal={closeModal}
            modalType={false}
            summaryModal={''}
            color='#2E65F3'
            // color='#5826E5'
          />
          <SummaryCard
            title={currentPath !== 'stake' ? 'Collateralization Ratio' : currentPath === 'tranche' ? '' : i18n.t('stake.summary.sliceRewards.title')}
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
          {/* <SummaryCard
            title="All Staked Rewards"
            value={sliceStats && sliceStats.volume}
            isLoading={false}
            path={currentPath}
            type={'volume'}
            details={''}
            openModal={(bool = null, num = 3) => openModal(bool, num)}
            closeModal={closeModal}
            modalType={false}
            summaryModal={''}
            color="#369987"
          /> */}
        </SummaryCardsWrapper>
      )}

      
    </div>
  );
};
SummaryCards.propTypes = {
  ethereum: PropTypes.object.isRequired,
  setAddress: PropTypes.func.isRequired,
  setNetwork: PropTypes.func.isRequired,
  setBalance: PropTypes.func.isRequired,
  setWalletAndWeb3: PropTypes.func.isRequired,
  summaryFetchSuccess: PropTypes.func.isRequired,
  setSliceStats: PropTypes.func.isRequired,
  setTvl: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    path: state.path,
    ethereum: state.ethereum,
    summaryData: state.summaryData,
    theme: state.theme
  };
};

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  summaryFetchSuccess,
  setSliceStats,
  setTvl
})(SummaryCards);
